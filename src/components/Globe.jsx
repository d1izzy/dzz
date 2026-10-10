import { Component, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import GlobeGL from './GlobeRenderer'
import { MeshPhongMaterial } from 'three'

const RENDERER_CONFIG = { alpha: true, antialias: false, powerPreference: 'default' }

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
  const uniforms = new Set()
  if (!globe) return []
  const scene = typeof globe.scene === 'function' ? globe.scene() : globe.scene
  if (!scene || typeof scene.traverse !== 'function') return []
  scene.traverse((obj) => {
    if (obj.__globeObjType === 'arc') {
      const uniform = obj.children?.[0]?.material?.uniforms?.dashOffset
      if (uniform) uniforms.add(uniform)
      return
    }
    if (obj.type === 'Line' && obj.material?.uniforms?.dashOffset) {
      uniforms.add(obj.material.uniforms.dashOffset)
    }
  })
  return [...uniforms]
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
  landMapUrl = `${import.meta.env.BASE_URL}earth-topology.png`,
  reducedMotion = false,
  maxPixelRatio = 1.5,
  className,
  onReady,
  onGlobeClick,
}) {
  const wrapRef = useRef(null)
  const globeRef = useRef(null)
  const dashUniformsRef = useRef([])
  const arcTimeRef = useRef({ elapsed: 0, previous: 0 })
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [landDots, setLandDots] = useState([])
  const active = inView && pageVisible
  const arcs = useMemo(() => makeArcs(arcCount), [arcCount])
  const globeMaterial = useMemo(() => new MeshPhongMaterial({
    // Match the original library's black sphere so gold dots and arcs stand out.
    color: '#000000',
    opacity: globeOpacity,
    transparent: globeOpacity < 1,
  }), [globeOpacity])
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
    dashUniformsRef.current = found
    return found.length
  }, [])

  useEffect(() => () => globeMaterial.dispose(), [globeMaterial])

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
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (!ready) return undefined
    const scene = globeRef.current.scene()
    const previousRender = scene.onBeforeRender
    dashUniformsRef.current = []

    // Update arcs in the globe's render cycle instead of running a second RAF loop.
    scene.onBeforeRender = function (...args) {
      previousRender.apply(this, args)
      if (!dashUniformsRef.current.length && arcs.length) refreshDashUniforms()
      const now = performance.now()
      const time = arcTimeRef.current
      if (time.previous && !reducedMotion) time.elapsed += Math.min(now - time.previous, 100)
      time.previous = now
      const offset = reducedMotion ? 0 : offsetAt(time.elapsed)
      for (const uniform of dashUniformsRef.current) {
        uniform.value = offset
      }
    }

    return () => {
      scene.onBeforeRender = previousRender
      dashUniformsRef.current = []
    }
  }, [ready, arcs, reducedMotion, refreshDashUniforms])

  const applyGlobe = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.pointOfView({ lat: 12, lng: -28, altitude: cameraAltitude }, 0)
    setReady(true)
    onReady?.()
  }, [cameraAltitude, onReady])

  useEffect(() => {
    if (!ready) return undefined
    const globe = globeRef.current
    const controls = globe.controls()
    const animate = active && !reducedMotion
    controls.autoRotate = animate && autoRotateSpeed > 0
    controls.autoRotateSpeed = autoRotateSpeed
    controls.enableZoom = enableZoom
    controls.enablePan = false
    controls.enableRotate = interactive
    controls.enableDamping = false
    controls.enabled = active && (interactive || animate)

    const renderer = globe.renderer()
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio)
    renderer.setPixelRatio(pixelRatio)
    globe.postProcessingComposer().setPixelRatio(pixelRatio)
    arcTimeRef.current.previous = 0

    if (animate) globe.resumeAnimation()
    else globe.pauseAnimation()

    // Reduced motion keeps the complete globe visible, rendering only on changes
    // (including a deliberate drag), with no idle animation loop.
    let frame = 0
    const renderStill = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          renderer.render(globe.scene(), globe.camera())
        })
      })
    }
    if (active && reducedMotion) {
      renderStill()
      controls.addEventListener('change', renderStill)
    }

    return () => {
      window.cancelAnimationFrame(frame)
      controls.removeEventListener('change', renderStill)
      globe.pauseAnimation()
    }
  }, [ready, active, reducedMotion, autoRotateSpeed, enableZoom, interactive, maxPixelRatio, size, particles, arcs, globeMaterial])

  return (
    <div ref={wrapRef} className={className ? `h-full w-full ${className}` : 'h-full w-full'}>
      {size.w > 0 && size.h > 0 ? (
        <GlobeGL
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={null}
          globeMaterial={globeMaterial}
          showGlobe
          showAtmosphere={showAtmosphere}
          atmosphereColor={atmosphereColor || primaryColor}
          atmosphereAltitude={atmosphereAltitude}
          animateIn={false}
          rendererConfig={RENDERER_CONFIG}
          onGlobeReady={applyGlobe}
          onGlobeClick={onGlobeClick}
          enablePointerInteraction={Boolean(onGlobeClick)}
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
