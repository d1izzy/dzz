import { useEffect, useState } from 'react'
import { nav, site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { IconArrow, IconClose, IconMark, IconMenu } from './icons'

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
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
    <header className="fixed inset-x-0 top-0 z-50 hidden md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Logo />
        <nav className="flex items-center gap-1 rounded-full bg-black/40 p-1 backdrop-blur-md" aria-label="Разделы">
          {nav.map((item) => {
            const on = active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`fixed inset-x-0 top-0 z-[60] md:hidden ${open ? 'bottom-0 bg-[#080706]' : ''}`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-3 ${open ? 'bg-[#080706]' : ''}`}>
        <Logo />
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-accent/25 bg-[#16130f] text-accent"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="absolute inset-x-0 bottom-0 top-[4.25rem] bg-[#080706] px-5 pb-10 pt-6">
          <nav className="flex flex-col gap-1" aria-label="Разделы">
            {nav.map((item) => {
              const on = active === item.id
              return (
                <a
                  key={item.id}
                  href={item.href}
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
            Telegram @{site.telegram}
            <IconArrow className="h-4 w-4" />
          </a>
        </div>
      ) : null}
    </header>
  )
}

export default function Header() {
  const active = useActiveSection(['top', ...nav.map((item) => item.id)])

  return (
    <>
      <DesktopHeader active={active} />
      <MobileHeader active={active} />
    </>
  )
}
