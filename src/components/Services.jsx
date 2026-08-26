import { services } from '../data/services'
import AnimatedContent from './AnimatedContent'
import SpotlightCard from './SpotlightCard'
import { serviceIcons } from './icons'

export default function Services() {
  return (
    <section id="services" className="relative scroll-mt-24 overflow-hidden border-t border-white/10">
      <div className="services-gold-wash pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative pad py-20 sm:py-28">
        <AnimatedContent distance={40} duration={0.9} threshold={0.2}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Услуги</p>
          <h2 className="headline mt-2 max-w-xl">Пять форматов. Один цикл до запуска.</h2>
          <p className="muted mt-3 max-w-lg">Оценка до старта — бесплатно. На выходе рабочий продукт.</p>
        </AnimatedContent>

        <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
          {services.map((item, i) => (
            <li key={item.index} className="flex items-center gap-3">
              <span className="text-accent">{item.index}</span>
              <span>{item.title}</span>
              {i < services.length - 1 ? (
                <span className="hidden h-px w-7 bg-accent/30 sm:block" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>

        <ul className="mt-12 grid gap-4 lg:grid-cols-6">
          {services.map((item, i) => {
            const Icon = serviceIcons[item.index]
            const featured = i < 2
            return (
              <li
                key={item.title}
                className={featured ? 'lg:col-span-3' : 'lg:col-span-2'}
              >
                <AnimatedContent
                  distance={56}
                  duration={0.9}
                  delay={i * 0.07}
                  scale={0.97}
                >
                  <SpotlightCard
                    className="h-full !rounded-[1.6rem] !border-accent/15 !bg-[#16130f] !p-0"
                    spotlightColor="rgba(198, 180, 138, 0.16)"
                  >
                    <article
                      className={`relative z-[1] flex h-full flex-col overflow-hidden p-6 sm:p-8 ${
                        featured ? 'min-h-[16.5rem] justify-end sm:min-h-[18rem]' : 'min-h-[14.5rem]'
                      }`}
                    >
                      <span className="service-mark" aria-hidden>
                        {item.index}
                      </span>
                      <span className="relative mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent">
                        {Icon ? <Icon className="h-5 w-5" /> : null}
                      </span>
                      <h3 className="relative font-serif text-3xl tracking-tight sm:text-[2.1rem]">
                        {item.title}
                      </h3>
                      <p className="relative mt-3 max-w-[22rem] text-sm leading-relaxed text-ink/55">
                        {item.text}
                      </p>
                    </article>
                  </SpotlightCard>
                </AnimatedContent>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
