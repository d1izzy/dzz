import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function CaseReveal({ children, reverse = false, className = '' }) {
  const ref = useRef(null)
  const revealed = useRef(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const el = ref.current
    if (!el || revealed.current || reducedMotion || !el.animate) return undefined
    let animation
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      revealed.current = true
      animation = el.animate([
        { opacity: 0, transform: `translate(${reverse ? -48 : 48}px, 90px) rotateX(16deg) rotateY(${reverse ? -8 : 8}deg) scale(.9)` },
        { opacity: 1, transform: 'none' },
      ], { duration: 1150, easing: 'cubic-bezier(.22,1,.36,1)' })
      observer.disconnect()
    }, { rootMargin: '0px 0px 80px 0px' })
    observer.observe(el)
    const finish = () => animation?.finish()
    el.addEventListener('focusin', finish)

    return () => {
      observer.disconnect()
      animation?.cancel()
      el.removeEventListener('focusin', finish)
    }
  }, [reverse, reducedMotion])

  return (
    <div className={`h-full min-w-0 [perspective:1400px] ${className}`}>
      <div ref={ref} className="h-full origin-bottom">
        {children}
      </div>
    </div>
  )
}
