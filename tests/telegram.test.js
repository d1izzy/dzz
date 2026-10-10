import assert from 'node:assert/strict'
import test from 'node:test'
import { formatTelegram, requestMessage, telegramDraftUrl } from '../src/lib/telegram.js'

test('Telegram handles are trimmed and receive exactly one @ prefix', () => {
  assert.equal(formatTelegram('  username_123  '), '@username_123')
  assert.equal(formatTelegram('  @username_123  '), '@username_123')
})

test('Telegram profile links remain usable as links', () => {
  assert.equal(formatTelegram('  https://t.me/username_123  '), 'https://t.me/username_123')
  assert.equal(formatTelegram('t.me/username_123'), 't.me/username_123')
})

test('empty optional values do not become undefined or an isolated @', () => {
  for (const value of [undefined, null, '', '   ', '\t\n']) {
    assert.equal(formatTelegram(value), '')
  }
  assert.equal(requestMessage(), 'Заявка с сайта dzz.\n\nИмя: \nTelegram: \n\nЗадача:\n')
})

test('the draft trims field boundaries while preserving meaningful task line breaks', () => {
  assert.equal(requestMessage({
    name: '  Анна Мария  ',
    telegram: '  annamaria  ',
    task: ' \nНужен сайт.\nСрок: 2 недели.\n ',
  }), 'Заявка с сайта dzz.\n\nИмя: Анна Мария\nTelegram: @annamaria\n\nЗадача:\nНужен сайт.\nСрок: 2 недели.')
})

test('the URL preserves multiline Unicode and special characters without creating extra parameters', () => {
  const text = requestMessage({
    name: 'Лев & Zoë',
    telegram: '@lev',
    task: 'Mini App 🚀\nhttps://example.com/?a=1&b=два#этап\nЦена: 100% + поддержка?',
  })
  const url = new URL(telegramDraftUrl('https://t.me/thegodnull', text))
  assert.equal(url.origin, 'https://t.me')
  assert.equal(url.pathname, '/thegodnull')
  assert.equal(url.hash, '')
  assert.deepEqual(Array.from(url.searchParams.keys()), ['text'])
  assert.equal(url.searchParams.get('text'), text)
})

test('rebuilding a draft replaces an earlier text parameter', () => {
  const url = new URL(telegramDraftUrl('https://t.me/thegodnull?text=old', 'Новая заявка'))
  assert.deepEqual(url.searchParams.getAll('text'), ['Новая заявка'])
})
