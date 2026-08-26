import { nav, site } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { IconMark, IconTelegram } from './icons'

export default function Sidebar() {
  const active = useActiveSection(nav.map((item) => item.id))

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col border-r border-white/10 bg-night text-paper lg:flex">
        <a href="#top" className="flex items-center gap-3 px-6 py-8">
          <IconMark className="h-9 w-9 text-accent-soft" />
          <span>
            <span className="block font-syne text-sm font-semibold tracking-wide">{site.brand}</span>
            <span className="block text-[11px] text-white/45">{site.tagline}</span>
          </span>
        </a>

        <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Разделы">
          {nav.map((item) => {
            const on = active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-baseline gap-3 px-3 py-3 font-syne text-lg transition ${
                  on ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'
                }`}
              >
                <span className={`text-[11px] tabular-nums ${on ? 'text-accent-soft' : 'text-white/25'}`}>
                  {item.index}
                </span>
                {item.label}
              </a>
            )
          })}
        </nav>

        <a
          href={site.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="m-4 mt-auto flex items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/80 hover:border-accent hover:text-white"
        >
          <IconTelegram className="h-4 w-4 text-accent-soft" />
          @{site.telegram}
        </a>
      </aside>

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-2">
            <IconMark className="h-7 w-7 text-accent" />
            <span className="font-syne text-sm font-semibold">{site.brand}</span>
          </a>
          <a
            href={site.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent"
          >
            @{site.telegram}
          </a>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Вкладки">
          {nav.map((item) => {
            const on = active === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                className={`shrink-0 px-3 py-1.5 font-syne text-sm ${
                  on ? 'bg-ink text-paper' : 'bg-white/60 text-mute'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </header>
    </>
  )
}
