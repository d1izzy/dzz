import { useSyncExternalStore } from 'react'

function getSnapshot() {
  const connection = navigator.connection
  return Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType))
}

function subscribe(notify) {
  navigator.connection?.addEventListener('change', notify)
  return () => navigator.connection?.removeEventListener('change', notify)
}

export function useSaveData() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
