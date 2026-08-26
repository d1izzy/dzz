import { Component, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import GlobeGL from 'react-globe.gl'
import { Color } from 'three'

const CITIES = {
  nyc: { lat: 40.71, lng: -74.01, name: 'New York' },
  la: { lat: 34.05, lng: -118.24, name: 'Los Angeles' },
  mexico: { lat: 19.43, lng: -99.13, name: 'Mexico City' },
  saoPaulo: { lat: -23.55, lng: -46.63, name: 'Sao Paulo' },
  buenos: { lat: -34.6, lng: -58.38, name: 'Buenos Aires' },
  london: { lat: 51.51, lng: -0.13, name: 'London' },
  paris: { lat: 48.86, lng: 2.35, name: 'Paris' },
  lagos: { lat: 6.52, lng: 3.38, name: 'Lagos' },
  cairo: { lat: 30.04, lng: 31.24, name: 'Cairo' },
  capeTown: { lat: -33.92, lng: 18.42, name: 'Cape Town' },
  dubai: { lat: 25.2, lng: 55.27, name: 'Dubai' },
  singapore: { lat: 1.35, lng: 103.82, name: 'Singapore' },
  tokyo: { lat: 35.68, lng: 139.69, name: 'Tokyo' },
  sydney: { lat: -33.87, lng: 151.21, name: 'Sydney' },
}

const ARC_PAIRS = [
  ['nyc', 'london'],
  ['nyc', 'lagos'],
  ['saoPaulo', 'lagos'],
  ['saoPaulo', 'capeTown'],
  ['mexico', 'paris'],
  ['buenos', 'capeTown'],
  ['cairo', 'saoPaulo'],
  ['la', 'tokyo'],
  ['sydney', 'capeTown'],
  ['london', 'singapore'],
]

const MARKERS = Object.values(
  Object.fromEntries(
    ARC_PAIRS.flat().map((id) => [id, CITIES[id]]),
  ),
)

function makeArcs(count) {
  return ARC_PAIRS.slice(0, count).map(([fromId, toId]) => {
    const from = CITIES[fromId]
    const to = CITIES[toId]
    return {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
    }
  })
}

const ARC_TRAVEL_MS = 1600
const ARC_HOLD_MS = 1600
const ARC_PAUSE_MS = 200
const ARC_CYCLE_MS = ARC_TRAVEL_MS + ARC_HOLD_MS + ARC_TRAVEL_MS + ARC_PAUSE_MS

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - (2 * (1 - t) * (1 - t))
}

function offsetAt(elapsed) {
  const t = elapsed % ARC_CYCLE_MS
  if (t < ARC_TRAVEL_MS) return 1 - easeInOut(t / ARC_TRAVEL_MS)
  if (t < ARC_TRAVEL_MS + ARC_HOLD_MS) return 0
  if (t < ARC_TRAVEL_MS + ARC_HOLD_MS + ARC_TRAVEL_MS) {
    return easeInOut((t - ARC_TRAVEL_MS - ARC_HOLD_MS) / ARC_TRAVEL_MS)
  }
  return 1
}

function collectDashUniforms(globe) {
  const list = []
  if (!globe) return list
  const scene = typeof globe.scene === 'function' ? globe.scene() : globe.scene
  if (!scene || typeof scene.traverse !== 'function') return list
  scene.traverse((obj) => {
    if (obj.__globeObjType === 'arc') {
      const uniform = obj.children?.[0]?.material?.uniforms?.dashOffset
      if (uniform) list.push(uniform)
      return
    }
    if (obj.type === 'Line' && obj.material?.uniforms?.dashOffset) {
      list.push(obj.material.uniforms.dashOffset)
    }
  })
  return list
}

function sampleLandDots(image, rows) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(image, 0, 0)
  const { data, width, height } = ctx.getImageData(0, 0, image.width, image.height)
  const dots = []
  const safeRows = Math.max(24, Math.round(rows))

  for (let y = 0; y < safeRows; y += 1) {
    const lat = 90 - (y / (safeRows - 1)) * 180
    const rowCount = Math.max(8, Math.round(Math.cos((lat * Math.PI) / 180) * safeRows * 2))
    for (let x = 0; x < rowCount; x += 1) {
      const lng = -180 + ((x + (y % 2) * 0.5) / rowCount) * 360
      const px = Math.min(width - 1, Math.max(0, Math.floor(((lng + 180) / 360) * width)))
      const py = Math.min(height - 1, Math.max(0, Math.floor(((90 - lat) / 180) * height)))
      const i = (py * width + px) * 4
      if (data[i] > 28) dots.push({ lat, lng })
    }
  }

  return dots
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

class GlobeGuard extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

const GlobeCanvas = memo(function GlobeCanvas({
  width = 'auto',
  height = 'auto',
  primaryColor = '#c6b48a',
  neutralColor = '#8a7a5c',
  atmosphereColor,
  showAtmosphere = true,
  autoRotateSpeed = 0.85,
  enableZoom = false,
  interactive = true,
  arcCount = 10,
  cameraAltitude = 2.35,
  pointSize = 0.25,
  atmosphereAltitude = 0.18,
  globeOpacity = 1,
  landDotRows = 170,
  landMapUrl = '/earth-topology.png',
  className,
  onReady,
  onGlobeClick,
}) {
  const wrapRef = useRef(null)
  const globeRef = useRef(null)
  const dashUniformsRef = useRef([])
  const visibleRef = useRef(true)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [landDots, setLandDots] = useState([])
  const arcs = useMemo(() => makeArcs(arcCount), [arcCount])
  const particles = useMemo(
    () => (landDots.length ? [{ dots: landDots }] : []),
    [landDots],
  )

  const particlesList = useCallback((d) => d.dots, [])
  const particlesColor = useCallback(() => neutralColor, [neutralColor])
  const arcColor = useCallback(() => ['#e8dcc8', '#c6b48a'], [])
  const pointColor = useCallback(() => primaryColor, [primaryColor])

  const refreshDashUniforms = useCallback(() => {
    const found = collectDashUniforms(globeRef.current)
    if (found.length) dashUniformsRef.current = found
    return found.length
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined

    const apply = () => {
      const w = width === 'auto' ? el.clientWidth : width
      const h = height === 'auto' ? el.clientHeight || el.clientWidth : height
      const side = Math.max(1, Math.round(Math.min(w, h) || w || h))
      setSize((prev) => (prev.w === side && prev.h === side ? prev : { w: side, h: side }))
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height])

  useEffect(() => {
    let cancelled = false
    loadImage(landMapUrl)
      .then((image) => {
        if (!cancelled) setLandDots(sampleLandDots(image, landDotRows))
      })
      .catch(() => {
        if (!cancelled) setLandDots(MARKERS)
      })
    return () => {
      cancelled = true
    }
  }, [landMapUrl, landDotRows])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        const controls = globeRef.current?.controls?.()
        if (controls) controls.autoRotate = entry.isIntersecting && autoRotateSpeed > 0
      },
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [autoRotateSpeed, size.w])

  useEffect(() => {
    if (!size.w) return undefined
    const timers = [80, 250, 700, 1400].map((ms) => window.setTimeout(refreshDashUniforms, ms))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [landDots, arcs, size.w, refreshDashUniforms])

  useEffect(() => {
    let frame = 0
    let start = 0

    const tick = (now) => {
      frame = window.requestAnimationFrame(tick)
      if (document.hidden || !visibleRef.current) return
      const uniforms = dashUniformsRef.current
      if (!uniforms.length) return
      if (!start) start = now
      const offset = offsetAt(now - start)
      for (let i = 0; i < uniforms.length; i += 1) {
        uniforms[i].value = offset
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const applyGlobe = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return

    const controls = globe.controls()
    controls.autoRotate = autoRotateSpeed > 0 && visibleRef.current
    controls.autoRotateSpeed = autoRotateSpeed
    controls.enableZoom = enableZoom
    controls.enablePan = false
    controls.enableRotate = interactive
    controls.enableDamping = false
    controls.enabled = interactive
    globe.pointOfView({ lat: 12, lng: -28, altitude: cameraAltitude }, 0)

    const material = globe.globeMaterial()
    if (material) {
      material.color = new Color('#1a1612')
      material.emissive = new Color('#c6b48a')
      material.emissiveIntensity = 0.14
      material.opacity = globeOpacity
      material.transparent = globeOpacity < 1
    }

    refreshDashUniforms()
    onReady?.()
  }, [autoRotateSpeed, cameraAltitude, enableZoom, globeOpacity, interactive, onReady, refreshDashUniforms])

  return (
    <div ref={wrapRef} className={className ? `h-full w-full ${className}` : 'h-full w-full'}>
      {size.w > 0 && size.h > 0 ? (
        <GlobeGL
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={null}
          showGlobe
          showAtmosphere={showAtmosphere}
          atmosphereColor={atmosphereColor || primaryColor}
          atmosphereAltitude={atmosphereAltitude}
          animateIn={false}
          rendererConfig={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          onGlobeReady={applyGlobe}
          onGlobeClick={onGlobeClick}
          particlesData={particles}
          particlesList={particlesList}
          particleLat="lat"
          particleLng="lng"
          particlesSize={Math.max(0.55, pointSize * 2.4)}
          particlesSizeAttenuation={false}
          particlesColor={particlesColor}
          arcsData={arcs}
          arcColor={arcColor}
          arcAltitudeAutoScale={0.28}
          arcStroke={null}
          arcDashLength={1}
          arcDashGap={0}
          arcDashInitialGap={1}
          arcDashAnimateTime={0}
          arcsTransitionDuration={0}
          pointsData={MARKERS}
          pointLat="lat"
          pointLng="lng"
          pointColor={pointColor}
          pointAltitude={0.01}
          pointRadius={0.45}
          pointResolution={6}
          pointsMerge
          pointsTransitionDuration={0}
        />
      ) : null}
    </div>
  )
})

export default function Globe(props) {
  return (
    <GlobeGuard>
      <GlobeCanvas {...props} />
    </GlobeGuard>
  )
}
