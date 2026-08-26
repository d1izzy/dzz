import { useState } from 'react'
import { site } from '../data/site'
import AnimatedContent from './AnimatedContent'
import SpotlightCard from './SpotlightCard'
import { IconArrow, IconTelegram } from './icons'

function formatTelegram(value) {
  const handle = String(value || '').trim()
  if (!handle) return handle
  if (handle.startsWith('@') || handle.includes('t.me/')) return handle
  return `@${handle}`
}

function requestMessage({ name, telegram, task }) {
  return [
    'Заявка с сайта dzz.',
    '',
    `Имя: ${String(name || '').trim()}`,
    `Telegram: ${formatTelegram(telegram)}`,
    '',
    'Задача:',
    String(task || '').trim(),
  ].join('\n')
}

export default function Contact() {
  const [status, setStatus] = useState('idle')

  function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const text = requestMessage({
      name: data.name,
      telegram: data.telegram,
      task: data.task,
    })

    window.open(`${site.telegramUrl}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    form.reset()
    setStatus('sent')
  }

  return (
    <section id="contact" className="pad scroll-mt-24 border-t border-white/10 py-20 sm:py-28">
      <AnimatedContent distance={40} duration={0.9}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Связь</p>
        <h2 className="headline mt-2 max-w-xl">Кратко опишите задачу.</h2>
        <p className="muted mt-3 max-w-lg">Оценка по сроку и цене — обычно в течение дня.</p>
      </AnimatedContent>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <AnimatedContent delay={0.08} distance={50} direction="horizontal">
          <a
            href={site.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-5"
          >
            <span className="flex items-center gap-3">
              <IconTelegram className="h-5 w-5 text-accent" />
              <span>
                <span className="block text-[11px] uppercase tracking-[0.14em] text-white/40">Telegram</span>
                <span className="font-medium">@{site.telegram}</span>
              </span>
            </span>
            <IconArrow className="h-4 w-4 text-white/35 group-hover:text-accent" />
          </a>
        </AnimatedContent>

        <AnimatedContent delay={0.14} distance={50} direction="horizontal" reverse>
          <SpotlightCard
            className="!rounded-3xl !border-white/10 !bg-white/[0.03] !p-0"
            spotlightColor="rgba(198, 180, 138, 0.14)"
          >
            {status === 'sent' ? (
              <div className="relative z-[1] p-8">
                <p className="font-serif text-3xl">Заявка собрана.</p>
                <p className="muted mt-3">
                  Откроется чат с @{site.telegram}. Если окно не появилось — напишите напрямую.
                </p>
                <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus('idle')}>
                  Ещё одно сообщение
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="relative z-[1] space-y-4 p-6 sm:p-8">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    Ваше имя
                  </span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent"
                    placeholder="Как обращаться"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    Ваш Telegram
                  </span>
                  <input
                    name="telegram"
                    required
                    autoComplete="username"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent"
                    placeholder="@username"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    Задача
                  </span>
                  <textarea
                    name="task"
                    required
                    rows={5}
                    className="w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-accent"
                    placeholder="Что нужно, сроки, ссылки"
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  Отправить
                </button>
              </form>
            )}
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  )
}
