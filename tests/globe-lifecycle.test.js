import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { fixGlobeFactory } from '../build/globe-lifecycle.mjs'

test('the installed three-globe factory is recognized and its temporary instance is disposed', async () => {
  const source = await readFile(new URL('../node_modules/three-globe/dist/three-globe.mjs', import.meta.url), 'utf8')
  const patched = fixGlobeFactory(source)
  // Execute the actual installed factory with a small stand-in to verify cleanup
  // without requiring WebGL in a Node test.
  const factory = patched.slice(patched.indexOf('function fromKapsule ('), patched.indexOf('\nvar three = window.THREE'))
  let liveTickers = 0
  let disposed = 0
  const kapsule = () => {
    liveTickers += 2
    return { _destructor() { liveTickers -= 2; disposed++ }, pointsData() {} }
  }
  const run = new Function('kapsule', '_inherits', '_createClass', `${factory}; return fromKapsule(kapsule);`)
  const Globe = run(kapsule, () => {}, (ctor) => ctor)
  assert.equal(liveTickers, 0)
  assert.equal(disposed, 1)
  assert.equal(typeof Globe.prototype.pointsData, 'function')
})

test('an unrecognized upstream factory requires review rather than silently skipping cleanup', () => {
  assert.throws(() => fixGlobeFactory('upstream changed'), /review the lifecycle fix/)
})

test('temporary layer instances release their tickers while retaining readable defaults', async () => {
  const source = fixGlobeFactory(await readFile(new URL('../node_modules/three-globe/dist/three-globe.mjs', import.meta.url), 'utf8'))
  const start = source.indexOf('function linkKapsule (')
  const end = source.indexOf('\n}\n', start) + 2
  const factory = source.slice(start, end)
  let liveTickers = 0
  function Layer() {
    liveTickers++
    this._destructor = () => { liveTickers-- }
    this.testProperty = () => 'default value'
  }
  const bind = new Function('Layer', `${factory}; return linkKapsule('layer', Layer);`)(Layer)
  assert.equal(liveTickers, 0)
  assert.equal(bind.linkProp('testProperty').default, 'default value')
})
