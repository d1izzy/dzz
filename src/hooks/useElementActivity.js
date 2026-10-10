import { useEffect, useState } from 'react'

// Decorative animation only runs while its element can actually be seen.
export function useElementActivity(ref) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let visible = false
    const update = () => setActive(visible && !document.hidden)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.01
      update()
    }, { threshold: 0.01 })
    if (observer) observer.observe(element)
    else visible = true
    update()
    document.addEventListener('visibilitychange', update)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [ref])

  return active
}
