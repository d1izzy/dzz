import { useEffect, useRef, useState } from 'react'

const FRAME_W = 1440
const FRAME_H = 900

function hostLabel(url) {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function LivePreview({ url, title }) {
  const boxRef = useRef(null)
  const [src, setSrc] = useState('')
  const [scale, setScale] = useState(0.2)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return undefined

    const fit = () => {
      const w = box.clientWidth
      if (w) setScale(w / FRAME_W)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc(url)
          io.disconnect()
        }
      },
      { rootMargin: '160px 0px' },
    )

    io.observe(box)
    fit()
    window.addEventListener('resize', fit)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [url])

  return (
    <div ref={boxRef} className="live-preview relative h-full overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-2 border-b border-white/10 bg-[#111] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-white/5 px-3 py-0.5 text-[10px] text-white/45">
          {hostLabel(url)}
        </span>
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="absolute inset-0 top-9">
        {src ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            tabIndex={-1}
            aria-hidden
            scrolling="no"
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-black"
            style={{
              width: FRAME_W,
              height: FRAME_H,
              transform: `scale(${scale})`,
              opacity: ready ? 1 : 0,
              transition: 'opacity .4s ease',
              overflow: 'hidden',
            }}
            onLoad={() => setReady(true)}
          />
        ) : null}
      </div>
    </div>
  )
}
