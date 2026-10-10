import { useEffect, useRef, useState } from 'react'
import { href, nav, site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { IconArrow, IconClose, IconMark, IconMenu } from './icons'

const sectionIds = ['top', ...nav.map((item) => item.id)]

function Logo({ onClick }) {
  return (
    <a href={href('/#top')} onClick={onClick} className="flex items-center gap-2.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
      <IconMark className="h-7 w-7 text-accent" />
      <span className="font-serif text-xl italic tracking-tight">
        {site.brand}
        <span className="not-italic text-accent">.</span>
      </span>
    </a>
  )
}

function DesktopHeader({ active }) {
  return (
    <header data-desktop-header className="fixed inset-x-0 top-0 z-50 hidden md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Logo />
        <nav className="flex items-center gap-1 rounded-full bg-black/40 p-1 backdrop-blur-md" aria-label="Разделы">
          {nav.map((item) => {
            const on = active === item.id
            return (
              <a
                key={item.id}
                href={href(item.href)}
                aria-current={on ? 'location' : undefined}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  on ? 'bg-accent text-paper' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
        <a
          href={site.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper underline decoration-paper/0 underline-offset-4 transition hover:bg-accent-soft hover:decoration-paper/70"
        >
          Telegram
          <IconArrow className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  )
}

function MobileHeader({ active }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isDesktop) setOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (!open || isDesktop) return undefined

    const header = headerRef.current
    const trigger = toggleRef.current
    const previousOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Isolate the rest of the page even when this header is nested in a wrapper.
    const background = []
    let current = header
    while (current && current !== document.body) {
      for (const sibling of current.parentElement.children) {
        if (sibling !== current && sibling instanceof HTMLElement) {
          background.push([sibling, sibling.inert])
          sibling.inert = true
        }
      }
      current = current.parentElement
    }

    const focusable = () => Array.from(header.querySelectorAll('a[href], button:not([disabled])'))
      .filter((element) => element.getClientRects().length > 0)
    header.querySelector('nav a')?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && (document.activeElement === first || !header.contains(document.activeElement))) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !header.contains(document.activeElement))) {
        event.preventDefault()
        first?.focus()
      }
    }
    const onFocusIn = (event) => {
      if (!header.contains(event.target)) trigger?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousRootOverflow
      background.forEach(([element, wasInert]) => { element.inert = wasInert })
      const focusTarget = trigger?.getClientRects().length ? trigger : document.querySelector('[data-desktop-header] a')
      focusTarget?.focus({ preventScroll: true })
    }
  }, [open, isDesktop])

  return (
    <header
      ref={headerRef}
      role={open ? 'dialog' : undefined}
      aria-modal={open ? true : undefined}
      aria-label={open ? 'Навигация по сайту' : undefined}
      className={`fixed inset-x-0 top-0 z-[60] md:hidden ${open ? 'bottom-0 bg-[#080706]' : ''}`}
    >
      <div className={`flex items-center justify-between gap-3 px-4 py-3 ${open ? 'bg-[#080706]' : ''}`}>
        <Logo onClick={() => setOpen(false)} />
        <button
          ref={toggleRef}
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-accent/25 bg-[#16130f] text-accent"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-navigation" data-lenis-prevent className="absolute inset-x-0 bottom-0 top-[4.25rem] overflow-y-auto overscroll-contain bg-[#080706] px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-6">
          <nav className="flex flex-col gap-1" aria-label="Разделы">
            {nav.map((item) => {
              const on = active === item.id
              return (
                <a
                  key={item.id}
                  href={href(item.href)}
                  aria-current={on ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-4 text-lg ${
                    on ? 'bg-accent text-paper' : 'text-ink/80'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
          <a
            href={site.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-paper"
          >
            Telegram
            <IconArrow className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </header>
  )
}

export default function Header() {
  const active = useActiveSection(sectionIds)

  return (
    <>
      <DesktopHeader active={active} />
      <MobileHeader active={active} />
    </>
  )
}
