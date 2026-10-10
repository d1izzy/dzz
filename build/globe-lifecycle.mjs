import { readFile } from 'node:fs/promises'

// three-globe 2.45.2 constructs a temporary instance just to enumerate methods.
// It also constructs temporary layers to read defaults. Those instances own
// live FrameTickers and must be disposed, just like globe.gl's own probes.
// Keep the change narrowly matched and fail loudly if an upstream update changes it.
export function fixGlobeFactory(source) {
  const start = 'Object.keys(kapsule()).forEach(function (m) {'
  const end = '  return Globe;\n}'
  const layer = 'var dummyK = new kapsuleType(); // To extract defaults'
  if (source.split(start).length !== 2 || source.split(end).length !== 2 || source.split(layer).length !== 2) {
    throw new Error('three-globe factory changed; review the lifecycle fix before upgrading.')
  }
  return source
    .replace(layer, layer + '\n  if (dummyK._destructor) dummyK._destructor();')
    .replace(start, 'var probe = kapsule();\n  Object.keys(probe).forEach(function (m) {')
    .replace(end, '  probe._destructor();\n' + end)
}

const globeModule = /[/\\]three-globe[/\\]dist[/\\]three-globe\.mjs$/

export function globeLifecyclePlugin() {
  return {
    name: 'dispose-three-globe-factory-probe',
    enforce: 'pre',
    transform(source, id) {
      if (globeModule.test(id)) return { code: fixGlobeFactory(source), map: null }
      return null
    },
  }
}

export function globeLifecycleOptimizer() {
  return {
    name: 'dispose-three-globe-factory-probe',
    setup(build) {
      build.onLoad({ filter: globeModule }, async ({ path }) => ({
        contents: fixGlobeFactory(await readFile(path, 'utf8')),
        loader: 'js',
      }))
    },
  }
}
