import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CaseReveal({ children, reverse = false, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { autoAlpha: 1 })
      return undefined
    }

    const tween = gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        y: 90,
        x: reverse ? -48 : 48,
        rotateX: 16,
        rotateY: reverse ? -8 : 8,
        scale: 0.9,
        filter: 'blur(12px)',
      },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reverse])

  return (
    <div className={`h-full min-w-0 [perspective:1400px] ${className}`}>
      <div ref={ref} className="h-full origin-bottom will-change-transform" style={{ visibility: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}
