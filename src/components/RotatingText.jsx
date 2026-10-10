import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useElementActivity } from '../hooks/useElementActivity'

const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter('ru', { granularity: 'grapheme' })
  : null

const characters = (text) => segmenter
  ? Array.from(segmenter.segment(text), (part) => part.segment)
  : Array.from(text)

const RotatingText = forwardRef(function RotatingText({
  texts = [], rotationInterval = 2000, staggerDuration = 0, staggerFrom = 'first',
  loop = true, auto = true, splitBy = 'characters', onNext, mainClassName = '',
  splitLevelClassName = '', elementLevelClassName = '', transition,
  initial, animate, exit, animatePresenceMode, animatePresenceInitial, ...rest
}, ref) {
  const [index, setIndex] = useState(0)
  const elementRef = useRef(null)
  const visualRef = useRef(null)
  const active = useElementActivity(elementRef)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const text = texts[index] ?? texts[0] ?? ''
  const longest = texts.reduce((longestText, item) => item.length > longestText.length ? item : longestText, '')
  const parts = useMemo(() => {
    if (splitBy === 'characters') return characters(text)
    if (splitBy === 'words') return text.split(/(?<=\s)/)
    if (splitBy === 'lines') return text.split('\n')
    return text.split(splitBy)
  }, [text, splitBy])

  const jumpTo = useCallback((newIndex) => {
    const nextIndex = Math.max(0, Math.min(newIndex, texts.length - 1))
    if (nextIndex === index) return
    setIndex(nextIndex)
    onNext?.(nextIndex)
  }, [index, texts.length, onNext])
  const next = useCallback(() => {
    if (texts.length < 2) return
    jumpTo(index >= texts.length - 1 ? (loop ? 0 : index) : index + 1)
  }, [index, texts.length, loop, jumpTo])
  const previous = useCallback(() => {
    if (texts.length < 2) return
    jumpTo(index === 0 ? (loop ? texts.length - 1 : 0) : index - 1)
  }, [index, texts.length, loop, jumpTo])
  const reset = useCallback(() => jumpTo(0), [jumpTo])
  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset])

  useEffect(() => {
    if (!auto || !active || reducedMotion || texts.length < 2) return undefined
    const timer = window.setInterval(next, Math.max(900, rotationInterval))
    return () => window.clearInterval(timer)
  }, [auto, active, reducedMotion, texts.length, next, rotationInterval])

  useEffect(() => {
    if (!active || reducedMotion || !visualRef.current?.animate) return undefined
    const nodes = Array.from(visualRef.current.children)
    const animations = nodes.map((node, i) => {
      let order = i
      if (staggerFrom === 'last') order = nodes.length - 1 - i
      if (staggerFrom === 'center') order = Math.abs(i - (nodes.length - 1) / 2)
      if (typeof staggerFrom === 'number') order = Math.abs(i - staggerFrom)
      // The DOM always holds readable text. A cancelled/throttled animation
      // cannot leave a word waiting for an exit animation or with opacity zero.
      return node.animate([
        { transform: 'translateY(.22em)', opacity: 0.65 },
        { transform: 'translateY(0)', opacity: 1 },
      ], {
        duration: (transition?.duration ?? 0.42) * 1000,
        delay: Math.min(300, order * staggerDuration * 1000),
        easing: 'cubic-bezier(.16,1,.3,1)',
      })
    })
    return () => animations.forEach((animation) => animation.cancel())
  }, [text, active, reducedMotion, staggerDuration, staggerFrom, transition?.duration, splitBy])

  return (
    <span ref={elementRef} {...rest} className={mainClassName}
      style={{ ...rest.style, display: 'inline-grid', gridTemplateColumns: 'auto', alignItems: 'baseline' }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden', whiteSpace: 'pre', pointerEvents: 'none' }}>
        {longest}
      </span>
      <span ref={visualRef} aria-hidden="true" className={splitLevelClassName}
        style={{ gridArea: '1 / 1', whiteSpace: 'pre', lineHeight: 'inherit' }}>
        {parts.map((part, i) => (
          <span key={i} className={elementLevelClassName}
            style={{ display: splitBy === 'lines' ? 'block' : 'inline-block' }}>{part}</span>
        ))}
      </span>
    </span>
  )
})

export default RotatingText
