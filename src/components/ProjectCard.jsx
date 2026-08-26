import GlareHover from './GlareHover'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { IconArrow } from './icons'
import LivePreview from './LivePreview'

function PreviewChrome({ url, children, live }) {
  let host = url
  try {
    host = new URL(url).host.replace(/^www\./, '')
  } catch {
    /* keep url */
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-x-0 top-0 z-20 flex h-9 items-center gap-2 border-b border-white/10 bg-[#111] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-white/5 px-3 py-0.5 text-[10px] text-white/45">
          {host}
        </span>
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-white/50">
          <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-400' : 'bg-accent'}`} />
          {live ? 'Live' : 'Preview'}
        </span>
      </div>
      <div className="absolute inset-0 top-9">{children}</div>
    </div>
  )
}

export default function ProjectCard({ project }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/10] w-full shrink-0 bg-black"
      >
        {isDesktop ? (
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
        ) : (
          <PreviewChrome url={project.url} live={false}>
            <img
              src={project.cover}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </PreviewChrome>
        )}
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
