import Home from './pages/Home'
import Legal from './pages/Legal'
import { currentPath } from './data/site'

export default function App() {
  const path = currentPath()
  if (path === '/privacy') return <Legal slug="privacy" />
  if (path === '/terms') return <Legal slug="terms" />
  return <Home />
}
