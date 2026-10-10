import { useMemo, useSyncExternalStore } from 'react'

const queries = new Map()

function mediaStore(query) {
  if (!queries.has(query)) {
    const media = window.matchMedia(query)
    queries.set(query, {
      subscribe: (notify) => {
        media.addEventListener('change', notify)
        return () => media.removeEventListener('change', notify)
      },
      getSnapshot: () => media.matches,
    })
  }
  return queries.get(query)
}

const getServerSnapshot = () => false

export function useMediaQuery(query) {
  const store = useMemo(() => mediaStore(query), [query])
  return useSyncExternalStore(store.subscribe, store.getSnapshot, getServerSnapshot)
}
