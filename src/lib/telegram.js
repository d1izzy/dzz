export function formatTelegram(value) {
  const handle = String(value ?? '').trim()
  if (!handle) return handle
  if (handle.startsWith('@') || handle.includes('t.me/')) return handle
  return `@${handle}`
}

export function requestMessage({ name, telegram, task } = {}) {
  return [
    'Заявка с сайта dzz.',
    '',
    `Имя: ${String(name ?? '').trim()}`,
    `Telegram: ${formatTelegram(telegram)}`,
    '',
    'Задача:',
    String(task ?? '').trim(),
  ].join('\n')
}

export function telegramDraftUrl(telegramUrl, text) {
  const url = new URL(telegramUrl)
  url.searchParams.set('text', text)
  return url.toString()
}
