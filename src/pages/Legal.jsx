import { useEffect } from 'react'
import ClickSpark from '../components/ClickSpark'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Noise from '../components/Noise'
import { legal } from '../data/legal'
import { href, legalLinks, site } from '../data/site'

export default function Legal({ slug }) {
  const doc = legal[slug]
  const other = legalLinks.find((item) => item.href !== `/${slug}`)

  useEffect(() => {
    const previous = document.title
    document.title = `${doc.title} — ${site.brand}`
    window.scrollTo(0, 0)
    return () => {
      document.title = previous
    }
  }, [doc.title])

  return (
    <ClickSpark sparkColor="#c6b48a" sparkSize={9} sparkRadius={18} sparkCount={10} duration={420}>
      <div className="noise-layer" aria-hidden>
        <Noise patternAlpha={18} patternRefreshInterval={3} />
      </div>
      <Header />
      <main id="top" className="relative z-[1]">
        <article className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Документы</p>
          <h1 className="headline mt-3">{doc.title}</h1>
          <p className="muted mt-4">Обновлено {doc.updated}</p>
          <p className="mt-8 text-[15px] leading-relaxed text-ink/80">{doc.intro}</p>

          <div className="mt-14 space-y-12">
            {doc.sections.map((section, index) => (
              <section key={section.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-2 font-serif text-2xl tracking-tight text-ink sm:text-3xl">{section.title}</h2>
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map((text) => (
                    <p key={text} className="text-[15px] leading-relaxed text-ink/70">
                      {text}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {other ? (
            <p className="mt-16 border-t border-accent/15 pt-8 text-sm text-ink/55">
              Также:{' '}
              <a href={href(other.href)} className="text-accent transition hover:text-ink">
                {other.label}
              </a>
            </p>
          ) : null}
        </article>
      </main>
      <Footer />
    </ClickSpark>
  )
}
