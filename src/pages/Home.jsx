import ClickSpark from '../components/ClickSpark'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'
import LogoLoop from '../components/LogoLoop'
import Noise from '../components/Noise'
import Projects from '../components/Projects'
import Services from '../components/Services'
import TechStack from '../components/TechStack'

const ticker = ['сайты', 'боты', 'Mini Apps', 'парсеры', 'API'].map((label) => ({
  node: <span className="font-serif text-[2.4rem] leading-none text-ink/80 md:text-5xl">{label}</span>,
  title: label,
  ariaLabel: label,
}))

export default function Home() {
  return (
    <ClickSpark sparkColor="#c6b48a" sparkSize={9} sparkRadius={18} sparkCount={10} duration={420}>
      <div className="noise-layer" aria-hidden>
        <Noise patternAlpha={18} patternRefreshInterval={3} />
      </div>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        К работам
      </a>
      <Header />
      <main>
        <Hero />
        <div className="overflow-hidden border-y border-accent/15 bg-paper py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <LogoLoop
            logos={ticker}
            speed={70}
            logoHeight={48}
            gap={48}
            hoverSpeed={0}
            fadeOut
            fadeOutColor="#080706"
            ariaLabel="Направления"
          />
        </div>
        <Projects />
        <Services />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </ClickSpark>
  )
}
