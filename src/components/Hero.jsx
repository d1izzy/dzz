import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useElementActivity } from '../hooks/useElementActivity'
import { useSaveData } from '../hooks/useSaveData'
import VisualBoundary from './VisualBoundary'
import BlurText from './BlurText'
import CountUp from './CountUp'
import GradientText from './GradientText'
import RotatingText from './RotatingText'
import ShinyText from './ShinyText'

const Globe = lazy(() => import('./Globe'))
const LightRays = lazy(() => import('./LightRays'))
const Particles = lazy(() => import('./Particles'))
const PARTICLE_COLORS = ['#c6b48a', '#e8dcc8']

const stats = [
  { to: 2, label: 'живых проекта' },
  { to: 5, label: 'форматов работы' },
]

export default function Hero() {
  const heroRef = useRef(null)
  const active = useElementActivity(heroRef)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const saveData = useSaveData()
  const [enhancementsReady, setEnhancementsReady] = useState(false)

  useEffect(() => {
    if (!isDesktop) return undefined
    // Leave the first paint and input handling ahead of optional 3D imports.
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setEnhancementsReady(true), { timeout: 1600 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setEnhancementsReady(true), 200)
    return () => window.clearTimeout(id)
  }, [isDesktop])

  const showGlobe = enhancementsReady && isDesktop
  const showFx = showGlobe && !reducedMotion && finePointer && !saveData

  return (
    <section ref={heroRef} id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-paper text-ink">
      <div className="hero-gold-wash pointer-events-none absolute inset-0" aria-hidden />

      {showFx ? (
        <VisualBoundary>
          <div className="hero-canvas pointer-events-none absolute inset-0 opacity-80" aria-hidden>
            <Suspense fallback={null}>
              <LightRays
                active={active}
                maxDpr={1}
                raysOrigin="top-center"
                raysColor="#c6b48a"
                raysSpeed={0.45}
                lightSpread={0.85}
                rayLength={1.35}
                fadeDistance={0.85}
                saturation={1}
                followMouse={false}
                mouseInfluence={0}
                noiseAmount={0.04}
              />
            </Suspense>
          </div>
          <div className="hero-canvas pointer-events-none absolute inset-0 opacity-35" aria-hidden>
            <Suspense fallback={null}>
              <LightRays
                active={active}
                maxDpr={1}
                raysOrigin="bottom-right"
                raysColor="#e8dcc8"
                raysSpeed={0.3}
                lightSpread={1.4}
                rayLength={0.7}
                fadeDistance={0.6}
                saturation={1}
                followMouse={false}
                mouseInfluence={0}
                noiseAmount={0.02}
              />
            </Suspense>
          </div>
          <div className="hero-canvas hero-fx-edge pointer-events-none absolute inset-0 opacity-50" aria-hidden>
            <Suspense fallback={null}>
              <Particles
                active={active}
                particleCount={50}
                particleSpread={14}
                speed={0.05}
                particleColors={PARTICLE_COLORS}
                moveParticlesOnHover={false}
                alphaParticles
                particleBaseSize={62}
                cameraDistance={24}
                disableRotation
              />
            </Suspense>
          </div>
        </VisualBoundary>
      ) : null}

      <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden />

      <div className="hero-read relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center gap-10 px-5 pb-16 pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pt-28">
        <div className="hero-copy flex w-full min-w-0 flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <p className="hero-kicker mb-6">
            <ShinyText text="можно заказать" color="#c6b48a" shineColor="#e8dcc8" speed={2.4} />
          </p>

          <h1 className="hero-title">
            <BlurText
              text="Сделаем"
              delay={80}
              animateBy="letters"
              direction="top"
              stepDuration={0.28}
              className="inline-flex"
            />
            <RotatingText
              texts={['сайт', 'бота', 'Mini App']}
              rotationInterval={2400}
              staggerDuration={0.03}
              splitBy="characters"
              mainClassName="hero-rotate text-ink"
              splitLevelClassName="overflow-hidden pb-1"
            />
          </h1>

          <GradientText
            colors={['#c6b48a', '#e8dcc8', '#c6b48a']}
            animationSpeed={6}
            className="hero-kicker mt-5 !mx-0"
          >
            под вашу задачу
          </GradientText>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 sm:text-lg">
            Лендинг, магазин, бот в Telegram или мини-приложение. Собираем, запускаем, отдаём рабочим.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <a href="#work" className="btn btn-ghost w-full sm:w-auto sm:min-w-[13.75rem]">
              Смотреть работы
            </a>
            <a
              href={site.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full sm:w-auto sm:min-w-[13.75rem]"
            >
              Telegram @{site.telegram}
            </a>
          </div>

          <dl className="mt-14 flex gap-10 text-left sm:mt-16">
            {stats.map((item) => (
              <div key={item.label}>
                <dt className="font-serif text-4xl sm:text-5xl">
                  <CountUp to={item.to} duration={1.4} />
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/55">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {isDesktop ? (
          <div className="hero-globe-widget hidden lg:block" aria-hidden>
            {showGlobe ? <VisualBoundary>
            <Suspense fallback={null}>
              <Globe
                primaryColor="#c6b48a"
                neutralColor="#c6b48a"
                atmosphereColor="#c6b48a"
                interactive={finePointer && !reducedMotion}
                reducedMotion={reducedMotion || saveData}
                maxPixelRatio={finePointer ? 1.5 : 1}
                enableZoom={false}
                autoRotateSpeed={0.7}
                cameraAltitude={2.9}
                arcCount={10}
                landDotRows={170}
                pointSize={0.24}
                atmosphereAltitude={0.2}
              />
            </Suspense>
            </VisualBoundary> : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
