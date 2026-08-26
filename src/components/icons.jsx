const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, className = 'h-5 w-5', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      {...stroke}
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="5" y="9" width="17" height="14" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="6" width="17" height="14" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24.5" cy="22.5" r="3.2" fill="currentColor" />
    </svg>
  )
}

export function IconSite(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 9h18" />
      <circle cx="6.2" cy="7" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.4" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function IconBot(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="8" width="14" height="11" rx="3" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4.2" r="1" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M9 16.5h6" />
    </Svg>
  )
}

export function IconTma(props) {
  return (
    <Svg {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M10 6h4" />
      <path d="M11 18h2" />
      <path d="M12 10l4 1.2-6 3.2 2.2-4.2z" />
    </Svg>
  )
}

export function IconParser(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h10" />
      <path d="M4 12h16" />
      <path d="M4 17h7" />
      <circle cx="18" cy="7" r="2.2" />
      <path d="M16.5 17.5l2 2 4-4.5" />
    </Svg>
  )
}

export function IconApi(props) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="7" r="2.4" />
      <circle cx="18" cy="17" r="2.4" />
      <path d="M8.2 11.2l7.4-3.2" />
      <path d="M8.2 12.8l7.4 3.2" />
    </Svg>
  )
}

export function IconTelegram(props) {
  return (
    <Svg {...props}>
      <path d="M21 4L3 11.2l6.2 2.2L18 8l-6.4 7.2  .2 5.2L14.6 16 21 4z" />
    </Svg>
  )
}

export function IconGithub(props) {
  return (
    <Svg {...props}>
      <path d="M9 19c-4 1.3-4-2-6-2m12 5v-3.9c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 19 6.5 4.2 4.2 0 0 0 18.9 3s-1.3-.4-4.3 1.6a15 15 0 0 0-7.2 0C4.4 2.6 3.1 3 3.1 3A4.2 4.2 0 0 0 3 6.5 4.6 4.6 0 0 0 1.5 10c0 4.6 2.7 5.7 5.5 6-.4.4-.7 1.1-.6 2.1V22" />
    </Svg>
  )
}

export function IconMail(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M4 8l8 6 8-6" />
    </Svg>
  )
}

export function IconArrow(props) {
  return (
    <Svg {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </Svg>
  )
}

export function IconReact(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-60 12 12)" />
    </Svg>
  )
}

export function IconNext(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 16.5V7.5h.4L16 16.5" />
      <path d="M15.5 7.5v9" />
    </Svg>
  )
}

export function IconTs(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M8 10.5h8M12 10.5v6" />
    </Svg>
  )
}

export function IconTailwind(props) {
  return (
    <Svg {...props}>
      <path d="M4.5 13c2-5 4-7 7.5-7 5.2 0 5.2 4 8 4 1.8 0 3.2-1.2 4-3.5-2 5-4 7-7.5 7-5.2 0-5.2-4-8-4-1.8 0-3.2 1.2-4 3.5z" />
    </Svg>
  )
}

export function IconSwift(props) {
  return (
    <Svg {...props}>
      <path d="M4 16c6-1 10-6 13.5-12 0 6-2 12-8 16" />
      <path d="M6 12c5 2 9 2 14 0" />
    </Svg>
  )
}

export function IconGo(props) {
  return (
    <Svg {...props}>
      <path d="M3 13h9l1.2-3H20" />
      <circle cx="8" cy="10.5" r="0.7" fill="currentColor" stroke="none" />
      <path d="M3 16h7" />
    </Svg>
  )
}

export function IconNode(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 8v8" />
    </Svg>
  )
}

export function IconPython(props) {
  return (
    <Svg {...props}>
      <path d="M12 4h4a3 3 0 0 1 3 3v3H9.5A2.5 2.5 0 0 1 7 7.5V7a3 3 0 0 1 3-3h2z" />
      <path d="M12 20H8a3 3 0 0 1-3-3v-3h9.5A2.5 2.5 0 0 1 17 16.5V17a3 3 0 0 1-3 3h-2z" />
    </Svg>
  )
}

export function IconPostgres(props) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="8" rx="7" ry="3" />
      <path d="M5 8v8c0 1.7 3.1 3 7 3s7-1.3 7-3V8" />
    </Svg>
  )
}

export function IconMongo(props) {
  return (
    <Svg {...props}>
      <path d="M12 3s5 4.2 5 10-5 8-5 8-5-2.2-5-8 5-10 5-10z" />
      <path d="M12 7v13" />
    </Svg>
  )
}

export function IconRedis(props) {
  return (
    <Svg {...props}>
      <path d="M4 10l8-4 8 4-8 4-8-4z" />
      <path d="M4 14l8 4 8-4" />
      <path d="M4 10v4" />
      <path d="M20 10v4" />
    </Svg>
  )
}

export function IconDocker(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="11" width="3.2" height="3.2" />
      <rect x="9" y="11" width="3.2" height="3.2" />
      <rect x="13" y="11" width="3.2" height="3.2" />
      <rect x="9" y="7" width="3.2" height="3.2" />
      <path d="M4 15.5c2 3 14 3 16.5-1" />
    </Svg>
  )
}

export function IconNginx(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M9 16V8l6 8V8" />
    </Svg>
  )
}

export function IconCicd(props) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M8.2 12h1.6M14.2 12h1.6" />
    </Svg>
  )
}

export function IconGraphql(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="5.5" cy="16.5" r="1.5" />
      <circle cx="18.5" cy="16.5" r="1.5" />
      <path d="M12 6.5L6.5 15.4M12 6.5l5.5 8.9M6.8 16.5h10.4" />
    </Svg>
  )
}

export function IconWeb3(props) {
  return (
    <Svg {...props}>
      <path d="M12 4l6 3.5v7L12 18l-6-3.5v-7L12 4z" />
      <path d="M12 4v14M6 7.5l6 3.5 6-3.5" />
    </Svg>
  )
}

export const techIcons = {
  React: IconReact,
  'Next.js': IconNext,
  TypeScript: IconTs,
  Tailwind: IconTailwind,
  SwiftUI: IconSwift,
  Go: IconGo,
  Fiber: IconGo,
  GORM: IconGo,
  'Node.js': IconNode,
  Python: IconPython,
  PostgreSQL: IconPostgres,
  MongoDB: IconMongo,
  Redis: IconRedis,
  Docker: IconDocker,
  Nginx: IconNginx,
  'CI/CD': IconCicd,
  'Telegram Bot API': IconTelegram,
  Web3: IconWeb3,
  'REST API': IconApi,
  GraphQL: IconGraphql,
}

export const serviceIcons = {
  '01': IconSite,
  '02': IconBot,
  '03': IconTma,
  '04': IconParser,
  '05': IconApi,
}
