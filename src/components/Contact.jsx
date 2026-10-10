import { useRef, useState } from 'react'
import { href, site } from '../data/site'
import { requestMessage, telegramDraftUrl } from '../lib/telegram'
import AnimatedContent from './AnimatedContent'
import SpotlightCard from './SpotlightCard'
import { IconArrow, IconTelegram } from './icons'

export default function Contact() {
  const [draft, setDraft] = useState(null)
  const [copyStatus, setCopyStatus] = useState('idle')
  const manualCopyRef = useRef(null)

  function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const requiredFields = {
      name: 'Введите имя, чтобы я знал, как к вам обращаться.',
      telegram: 'Введите ваш Telegram: @username или ссылку на профиль.',
      task: 'Кратко опишите задачу.',
    }
    for (const [name, message] of Object.entries(requiredFields)) {
      form.elements.namedItem(name).setCustomValidity(String(data[name] ?? '').trim() ? '' : message)
    }
    if (!form.reportValidity()) return

    const text = requestMessage({
      name: data.name,
      telegram: data.telegram,
      task: data.task,
    })

    const url = telegramDraftUrl(site.telegramUrl, text)
    setDraft({ text, url })
    setCopyStatus('idle')
    // A new tab is only a handoff; Telegram still requires the user's send action.
    // noopener may return null even when it opens, so do not infer delivery from it.
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(draft.text)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('manual')
    }
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
              <form
                onSubmit={onSubmit}
                onInput={(event) => event.target.setCustomValidity?.('')}
                onChange={() => {
                  setDraft(null)
                  setCopyStatus('idle')
                }}
                className="relative z-[1] space-y-4 p-6 sm:p-8"
              >
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                    Ваше имя
                  </span>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base outline-none focus:border-accent sm:text-sm"
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
                    autoCapitalize="none"
                    spellCheck={false}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base outline-none focus:border-accent sm:text-sm"
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
                    className="w-full resize-y rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-base outline-none focus:border-accent sm:text-sm"
                    placeholder="Что нужно, сроки, ссылки"
                  />
                </label>
                <label className="flex items-start gap-3 text-[13px] leading-relaxed text-white/45">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-accent"
                  />
                  <span>
                    Согласен с{' '}
                    <a href={href('/privacy')} className="text-accent/90 underline decoration-accent/30 underline-offset-2 transition hover:text-accent">
                      политикой конфиденциальности
                    </a>
                    {' '}и{' '}
                    <a href={href('/terms')} className="text-accent/90 underline decoration-accent/30 underline-offset-2 transition hover:text-accent">
                      условиями пользования
                    </a>
                  </span>
                </label>
                <button type="submit" className="btn btn-primary" aria-describedby="contact-handoff-hint">
                  Перейти в Telegram
                </button>
                <p id="contact-handoff-hint" className="text-sm leading-relaxed text-ink/65">
                  Текст заявки откроется в чате. Отправку нужно подтвердить в Telegram.
                </p>
                <p role="status" aria-atomic="true" className="text-sm leading-relaxed text-ink/80">
                  {draft ? (copyStatus === 'copied'
                    ? 'Текст скопирован. Вставьте его в чат и отправьте в Telegram.'
                    : copyStatus === 'manual'
                      ? 'Браузер не разрешил копирование. Выделите и скопируйте текст ниже.'
                      : 'Заявка подготовлена. Если Telegram не открылся или текст не появился, воспользуйтесь кнопками ниже.') : null}
                </p>
                {draft ? (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="flex flex-wrap gap-3">
                      <a href={draft.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        Открыть Telegram
                      </a>
                      <button type="button" className="btn btn-ghost" onClick={copyMessage}>
                        Скопировать текст
                      </button>
                    </div>
                    {copyStatus === 'manual' ? (
                      <label className="block">
                        <span className="mb-2 block text-sm text-ink/80">Текст заявки для копирования</span>
                        <textarea
                          ref={manualCopyRef}
                          readOnly
                          value={draft.text}
                          rows={8}
                          onFocus={() => manualCopyRef.current?.select()}
                          className="w-full resize-y rounded-2xl border border-accent/40 bg-black/40 px-4 py-3 text-base outline-none focus:border-accent sm:text-sm"
                        />
                      </label>
                    ) : null}
                  </div>
                ) : null}
              </form>
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  )
}
