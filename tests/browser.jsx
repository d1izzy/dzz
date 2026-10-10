import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/index.css'

// This separate dev-server entry is never imported by the production app.
if (!import.meta.env.DEV) throw new Error('The browser checks are available only on the development server.')

// Count callbacks that actually execute; this meter itself only uses a timer.
const nativeRequestAnimationFrame = window.requestAnimationFrame
let executedFrames = 0
const frameLabels = new WeakMap()
const executedByLabel = new Map()
let currentFrameLabel = null
window.requestAnimationFrame = (callback) => {
  let label = frameLabels.get(callback)
  if (!label) {
    // FrameTicker allocates a new arrow callback each tick; carry the original
    // constructor stack through that chain so abandoned instances stay distinct.
    label = currentFrameLabel || `${callback.name || '(anonymous)'} | ${new Error().stack?.split('\n').slice(2, 14).map((line) => line.trim()).join(' <- ')}`
    frameLabels.set(callback, label)
  }
  return nativeRequestAnimationFrame.call(window, (timestamp) => {
    executedFrames += 1
    executedByLabel.set(label, (executedByLabel.get(label) || 0) + 1)
    const previousLabel = currentFrameLabel
    currentFrameLabel = label
    try {
      callback(timestamp)
    } finally {
      currentFrameLabel = previousLabel
    }
  })
}

const query = '(prefers-reduced-motion: reduce)'
const params = new URLSearchParams(window.location.search)
const nativeMatchMedia = window.matchMedia.bind(window)
let reducedMotion = params.get('reduce') === '1'
const reducedMedia = new EventTarget()
Object.defineProperties(reducedMedia, {
  matches: { get: () => reducedMotion },
  media: { value: query },
})
reducedMedia.onchange = null
reducedMedia.addListener = (listener) => reducedMedia.addEventListener('change', listener)
reducedMedia.removeListener = (listener) => reducedMedia.removeEventListener('change', listener)
window.matchMedia = (value) => value === query ? reducedMedia : nativeMatchMedia(value)

const openedUrls = []
window.open = (url, target, features) => {
  openedUrls.push({ url: String(url), target, features })
  return null // Simulate a blocked popup without navigating or sending anything.
}
let rejectClipboard = true
let copiedText = null
Object.defineProperty(navigator, 'clipboard', {
  configurable: true,
  value: {
    async writeText(text) {
      if (rejectClipboard) throw new DOMException('Clipboard denied for this test', 'NotAllowedError')
      copiedText = text
    },
  },
})

// Keep direct Telegram links inside the test harness as well.
document.addEventListener('click', (event) => {
  const anchor = event.target.closest?.('a[href]')
  if (anchor && new URL(anchor.href).hostname === 't.me') {
    event.preventDefault()
    window.open(anchor.href, anchor.target, anchor.rel)
  }
}, true)

const results = document.getElementById('test-results')
const frameMeter = document.createElement('p')
frameMeter.style.marginTop = '10px'
frameMeter.append('Кадров анимации за секунду: ')
const frameCount = document.createElement('output')
frameCount.id = 'animation-frame-count'
frameCount.setAttribute('aria-label', 'Кадров анимации за секунду')
frameCount.setAttribute('aria-live', 'off')
frameCount.textContent = '0'
frameMeter.append(frameCount)
results.before(frameMeter)
let sampleStarted = performance.now()
const frameTimer = window.setInterval(() => {
  const now = performance.now()
  const elapsed = Math.max(1, now - sampleStarted)
  frameCount.textContent = JSON.stringify({
    perSecond: Math.round(executedFrames * 1000 / elapsed),
    sources: [...executedByLabel].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([label, count]) => ({
      perSecond: Math.round(count * 1000 / elapsed), label,
    })),
  })
  executedFrames = 0
  executedByLabel.clear()
  sampleStarted = now
}, 1000)
if (import.meta.hot) import.meta.hot.dispose(() => {
  window.requestAnimationFrame = nativeRequestAnimationFrame
  window.clearInterval(frameTimer)
  frameMeter.remove()
})

const runButton = document.getElementById('run-checks')
const motionButton = document.getElementById('toggle-motion')
const report = (value) => { results.textContent = JSON.stringify(value, null, 2) }
const refreshMotionLabel = () => {
  motionButton.textContent = `Уменьшить движение: ${reducedMotion ? 'вкл.' : 'выкл.'}`
  motionButton.setAttribute('aria-pressed', String(reducedMotion))
}
refreshMotionLabel()
motionButton.addEventListener('click', () => {
  reducedMotion = !reducedMotion
  const event = new Event('change')
  Object.defineProperties(event, { matches: { value: reducedMotion }, media: { value: query } })
  reducedMedia.dispatchEvent(event)
  reducedMedia.onchange?.(event)
  refreshMotionLabel()
})

// Import after configuring mocks so initial media-query snapshots match the test mode.
if (params.get('production') === '1') {
  const manifestPath = '/dist/index.html?raw'
  const { default: html } = await import(/* @vite-ignore */ manifestPath)
  const entry = new DOMParser().parseFromString(html, 'text/html').querySelector('script[type="module"][src*="/assets/"]').getAttribute('src')
  await import(/* @vite-ignore */ `/dist${entry}`)
} else {
  const { default: App } = await import('../src/App.jsx')
  createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
}

const settle = () => new Promise((resolve) => window.setTimeout(resolve, 30))
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const fieldValue = (field, value) => {
  const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(prototype, 'value').set.call(field, value)
  field.dispatchEvent(new Event('input', { bubbles: true }))
  field.dispatchEvent(new Event('change', { bubbles: true }))
}

async function runChecks() {
  runButton.disabled = true
  const checks = []
  const check = async (name, action) => {
    try {
      await action()
      checks.push({ name, pass: true })
    } catch (error) {
      checks.push({ name, pass: false, error: error.message })
    }
    report({ state: 'running', reducedMotion, checks })
  }
  openedUrls.length = 0
  rejectClipboard = true
  copiedText = null
  const form = document.querySelector('#contact form')
  if (!form) {
    report({ state: 'failed', error: 'Contact form was not rendered.' })
    runButton.disabled = false
    return
  }
  const fields = {
    name: form.elements.namedItem('name'),
    telegram: form.elements.namedItem('telegram'),
    task: form.elements.namedItem('task'),
  }
  const consent = form.elements.namedItem('consent')
  const status = () => form.querySelector('[role="status"]').textContent
  const copyButton = () => Array.from(form.querySelectorAll('button')).find((button) => button.textContent.trim() === 'Скопировать текст')
  const reopenLink = () => Array.from(form.querySelectorAll('a')).find((anchor) => anchor.textContent.trim() === 'Открыть Telegram')
  for (const field of Object.values(fields)) {
    field.setCustomValidity('')
    fieldValue(field, '   ')
  }
  if (!consent.checked) consent.click()
  await settle()

  await check('whitespace blocked; entries retained', async () => {
    form.requestSubmit()
    await settle()
    assert(openedUrls.length === 0, 'Whitespace opened Telegram.')
    assert(Object.values(fields).every((field) => !field.validity.valid), 'Whitespace fields were not invalidated.')
    assert(Object.values(fields).every((field) => field.value === '   '), 'Invalid values were cleared.')
  })

  const values = {
    name: '  Анна & Zoë  ',
    telegram: '  test_user  ',
    task: '  Нужен сайт 🚀\nСсылка: https://example.com/?a=1&b=два#этап\nЦена: 100% + поддержка?  ',
  }
  const expectedText = 'Заявка с сайта dzz.\n\nИмя: Анна & Zoë\nTelegram: @test_user\n\nЗадача:\nНужен сайт 🚀\nСсылка: https://example.com/?a=1&b=два#этап\nЦена: 100% + поддержка?'
  await check('valid draft encodes multiline Unicode; blocked popup retains form', async () => {
    Object.entries(values).forEach(([name, value]) => fieldValue(fields[name], value))
    await settle()
    assert(form.checkValidity(), 'Corrected fields are still invalid.')
    form.requestSubmit()
    await settle()
    assert(openedUrls.length === 1, 'The handoff was not attempted once.')
    const url = new URL(openedUrls[0].url)
    assert(url.hostname === 't.me' && url.pathname === '/thegodnull', 'Wrong Telegram destination.')
    assert(url.searchParams.get('text') === expectedText, 'Draft text or encoding changed.')
    assert(Array.from(url.searchParams.keys()).length === 1 && !url.hash, 'Task text escaped its query parameter.')
    assert(Object.entries(values).every(([name, value]) => fields[name].value === value), 'Valid entries were cleared or altered.')
    assert(status().includes('Заявка подготовлена.'), 'Prepared feedback is missing.')
    assert(reopenLink()?.href === openedUrls[0].url, 'Retry link does not preserve the prepared draft.')
  })

  await check('clipboard denial exposes manual copy text', async () => {
    assert(copyButton(), 'Copy button is missing.')
    copyButton().click()
    await settle()
    assert(status().includes('Браузер не разрешил копирование.'), 'Clipboard failure is not explained.')
    assert(form.querySelector('textarea[readonly]')?.value === expectedText, 'Manual copy text is missing or changed.')
  })

  await check('clipboard success copies draft and announces completion', async () => {
    rejectClipboard = false
    assert(copyButton(), 'Copy button is missing.')
    copyButton().click()
    await settle()
    assert(copiedText === expectedText, 'Clipboard did not receive the prepared draft.')
    assert(status().includes('Текст скопирован.'), 'Copy success feedback is missing.')
    assert(!form.querySelector('textarea[readonly]'), 'Manual-copy fallback remained after successful copy.')
  })

  await check('editing invalidates stale draft without losing other fields', async () => {
    fieldValue(fields.task, 'Уточнённая задача')
    await settle()
    assert(!copyButton() && !reopenLink() && !status().trim(), 'Stale draft actions or status remain.')
    assert(fields.name.value === values.name && fields.telegram.value === values.telegram, 'Other fields were lost on edit.')
    assert(fields.task.value === 'Уточнённая задача', 'The new task was not retained.')
    assert(openedUrls.length === 1, 'Editing triggered another Telegram handoff.')
  })

  report({ state: checks.every((item) => item.pass) ? 'passed' : 'failed', reducedMotion, pass: checks.filter((item) => item.pass).length, total: checks.length, checks })
  runButton.disabled = false
}

runButton.addEventListener('click', runChecks)
await settle()
runButton.disabled = false
report({ state: 'ready', reducedMotion, note: 'Telegram and clipboard are mocked. CSS viewport queries remain real.' })
if (params.get('run') === '1') await runChecks()
