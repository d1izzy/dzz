import { nav, site } from '../data/site'
import { services } from '../data/services'
import Magnet from './Magnet'
import { IconArrow, IconMark } from './icons'

const socials = [{ href: site.telegramUrl, label: `Telegram · @${site.telegram}` }]

export default function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden rounded-t-[2.5rem] bg-[#16130f] sm:mt-12 sm:rounded-t-[3.5rem]">
      <div className="footer-gold-wash pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-[1] mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 py-14 sm:flex-row sm:items-center sm:gap-10 sm:py-20">
          <h2 className="max-w-xl font-serif text-[2.6rem] leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Есть задача.
            <br />
            Напишите.
          </h2>
          <Magnet padding={28} magnetStrength={3} wrapperClassName="shrink-0">
            <a
              href={site.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 rounded-full bg-accent py-1.5 pl-6 pr-1.5 text-sm font-semibold text-paper"
            >
              Написать в Telegram
              <span className="grid h-10 w-10 place-items-center rounded-full bg-paper text-accent">
                <IconArrow className="h-4 w-4" />
              </span>
            </a>
          </Magnet>
        </div>

        <div className="grid gap-10 border-t border-accent/15 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5">
              <IconMark className="h-7 w-7 text-accent" />
              <span className="font-serif text-xl italic tracking-tight">
                {site.brand}
                <span className="not-italic text-accent">.</span>
              </span>
            </a>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-ink/55">
              Сайты, боты, Mini Apps, парсеры и интеграции с сервисами.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">Разделы</p>
            <nav className="flex flex-col gap-2.5" aria-label="Подвал">
              {nav.map((item) => (
                <a key={item.id} href={item.href} className="text-sm text-ink/70 transition hover:text-accent">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">Услуги</p>
            <ul className="flex flex-col gap-2.5">
              {services.map((item) => (
                <li key={item.index}>
                  <a href="#services" className="text-sm text-ink/70 transition hover:text-accent">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">Контакты</p>
            <ul className="flex flex-col gap-2.5">
              {socials.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/70 transition hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-base">
        <p className="footer-mark" aria-hidden>
          {site.brand}.
        </p>
        <div className="relative z-[1] mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} {site.brand}.
          </p>
          <a href="#top" className="text-xs text-ink/50 transition hover:text-accent">
            Наверх
          </a>
        </div>
      </div>
    </footer>
  )
}
