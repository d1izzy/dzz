import { stackGroups } from '../data/stack'
import AnimatedContent from './AnimatedContent'
import { techIcons } from './icons'

export default function TechStack() {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-white/10">
      <div className="pad py-20 sm:py-28">
        <AnimatedContent distance={40} duration={0.9}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Стек</p>
          <h2 className="headline mt-2 max-w-xl">Чем собираем.</h2>
          <p className="muted mt-3 max-w-lg">Набор под задачу. Фронт, сервер, база, выкладка, Telegram.</p>
        </AnimatedContent>

        <AnimatedContent distance={36} duration={0.9} delay={0.08}>
          <div className="mt-14 overflow-hidden rounded-[1.6rem] border border-accent/15 bg-[#100e0c]">
            {stackGroups.map((group, i) => (
              <div
                key={group.title}
                className={`grid items-start gap-5 px-6 py-8 sm:px-8 lg:grid-cols-[13rem_1fr] lg:items-center lg:gap-12 ${
                  i ? 'border-t border-accent/10' : ''
                }`}
              >
                <h3 className="font-serif text-2xl tracking-tight text-ink sm:text-[1.75rem]">
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-x-6 gap-y-3">
                  {group.items.map((name) => {
                    const Icon = techIcons[name]
                    return (
                      <li key={name} className="inline-flex items-center gap-2.5 text-sm text-ink/75">
                        {Icon ? <Icon className="h-4 w-4 text-accent" /> : null}
                        {name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  )
}
