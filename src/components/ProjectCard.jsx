import GlareHover from './GlareHover'
import { IconArrow } from './icons'
import LivePreview from './LivePreview'

export default function ProjectCard({ project }) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/10] w-full shrink-0 bg-black"
      >
        <GlareHover
          width="100%"
          height="100%"
          background="transparent"
          borderColor="transparent"
          borderRadius="0px"
          glareColor="#ffffff"
          glareOpacity={0.22}
          glareSize={180}
          className="!absolute !inset-0 !border-0"
        >
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <LivePreview url={project.url} title={project.title} />
          </div>
        </GlareHover>
      </a>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
          {project.index} · {project.lead}
        </p>
        <h3 className="mt-1 font-serif text-2xl">{project.title}</h3>
        <p className="muted mt-2 line-clamp-3 min-h-[3.75rem] text-sm">{project.description}</p>
        <div className="mt-3 flex min-h-[1.75rem] flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-auto flex min-h-[1.75rem] flex-wrap gap-4 pt-4">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-ink"
            >
              {link.label}
              <IconArrow className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
