import { nav, site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { IconArrow, IconMark } from './icons'

export default function Header() {
  const active = useActiveSection(['top', ...nav.map((item) => item.id)])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <a href="#top" className="flex items-center gap-2.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
          <IconMark className="h-7 w-7 text-accent" />
          <span className="font-serif text-xl italic tracking-tight">
            {site.brand}
            <span className="not-italic text-accent">.</span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-full bg-black/40 p-1 backdrop-blur-md md:flex"
          aria-label="Разделы"
        >
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

      <nav className="flex gap-1 overflow-x-auto px-5 pb-3 md:hidden" aria-label="Разделы">
        {nav.map((item) => {
          const on = active === item.id
          return (
            <a
              key={item.id}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                on ? 'bg-accent text-paper' : 'bg-accent/10 text-ink/70'
              }`}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
