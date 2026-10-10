import { useEffect, useState } from 'react'

export function useActiveSection(ids, offset = 0.28) {
  const [active, setActive] = useState(ids[0])
  const idsKey = JSON.stringify(ids)

  useEffect(() => {
    const nodes = JSON.parse(idsKey).map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length || !('IntersectionObserver' in window)) return undefined

    let observer
    let resizeFrame
    const observe = () => {
      observer?.disconnect()
      const visible = new Map()
      const height = window.innerHeight
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.set(entry.target, entry)
            else visible.delete(entry.target)
          })
          // Observer callbacks only include changed entries, not every visible section.
          const current = Array.from(visible.values()).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          if (current) setActive(current.target.id)
        },
        // Percentage root margins use viewport width, including top and bottom.
        { rootMargin: `-${height * offset}px 0px -${height * 0.45}px 0px`, threshold: [0, 0.08, 0.25, 0.5] },
      )
      nodes.forEach((node) => observer.observe(node))
    }
    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(observe)
    }

    observe()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', onResize)
    }
  }, [idsKey, offset])

  return active
}
