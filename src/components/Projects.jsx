import { projects } from '../data/projects'
import AnimatedContent from './AnimatedContent'
import CaseReveal from './CaseReveal'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section id="work" className="pad scroll-mt-24 py-20 sm:py-28">
      <AnimatedContent distance={40} duration={0.9} threshold={0.2}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Работы</p>
        <h2 className="headline mt-2">Живые страницы, не макеты</h2>
        <p className="muted mt-3 max-w-md">Превью — тот же сайт, что в проде. Клик открывает оригинал.</p>
      </AnimatedContent>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 items-stretch gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <CaseReveal key={project.id} reverse={i % 2 === 1} className="h-full min-w-0">
            <ProjectCard project={project} />
          </CaseReveal>
        ))}
      </div>
    </section>
  )
}
