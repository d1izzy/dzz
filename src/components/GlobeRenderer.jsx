import { useLayoutEffect, useRef } from 'react'
import createGlobe from 'globe.gl'

// globe.gl starts timers in its constructor. Create it only in an effect so
// React's discarded renders cannot leave an unreachable animation loop behind.
export default function GlobeRenderer({ ref, animateIn, rendererConfig, ...properties }) {
  const containerRef = useRef(null)
  const latestProperties = useRef(properties)
  const previousProperties = useRef({})
  latestProperties.current = properties

  useLayoutEffect(() => {
    const container = containerRef.current
    let globe
    let disposed = false

    try {
      globe = createGlobe({ animateIn, rendererConfig })
      ref.current = globe
      const initialProperties = latestProperties.current
      for (const [name, value] of Object.entries(initialProperties)) {
        if (name === 'onGlobeReady') continue
        globe[name](value)
      }
      globe.onGlobeReady(() => {
        if (!disposed) latestProperties.current.onGlobeReady?.()
      })
      previousProperties.current = initialProperties
      globe(container)
    } catch (error) {
      disposed = true
      globe?._destructor()
      ref.current = null
      throw error
    }

    return () => {
      disposed = true
      globe._destructor()
      if (ref.current === globe) ref.current = null
      previousProperties.current = {}
      container.replaceChildren()
    }
  }, [ref, animateIn, rendererConfig])

  useLayoutEffect(() => {
    const globe = ref.current
    if (!globe) return
    for (const [name, value] of Object.entries(properties)) {
      if (name !== 'onGlobeReady' && previousProperties.current[name] !== value) {
        globe[name](value)
      }
    }
    previousProperties.current = properties
  })

  return <div ref={containerRef} />
}
