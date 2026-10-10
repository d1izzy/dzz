import { lazy, Suspense } from 'react'
import Home from './pages/Home'
import { currentPath } from './data/site'

const Legal = lazy(() => import('./pages/Legal'))

export default function App() {
  const path = currentPath()
  if (path === '/privacy' || path === '/terms') {
    return <Suspense fallback={<main className="pad py-28" role="status">Загрузка документа…</main>}>
      <Legal slug={path.slice(1)} />
    </Suspense>
  }
  return <Home />
}
