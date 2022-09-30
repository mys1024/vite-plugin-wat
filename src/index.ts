import type { Plugin } from 'vite'
import type { VitePluginWatOptions } from './types'

import fse from 'fs-extra'
import { resolve, relative, isAbsolute } from 'pathe'
import { wat2wasm } from './wabt'

const watIdSuffixReg = /\.wat\?init$/

function isWatId(id: string): boolean {
  return watIdSuffixReg.test(id)
}

function toWasmId(watId: string, cwd: string, wasmDir: string) {
  return resolve(wasmDir, relative(cwd, watId).replace(watIdSuffixReg, '.wasm'))
}

export default (options?: VitePluginWatOptions): Plugin => {
  // default options
  const {
    wasmDir = 'node_modules/.vite-plugin-wat/wasm'
  } = options || {}

  // paths
  const cwd = resolve(process.cwd())
  const resolvedWasmDir = isAbsolute(wasmDir)
    ? wasmDir
    : resolve(cwd, wasmDir)

  // plugin
  return {
    name: 'vite-plugin-wat',

    config: () => ({
      server: {
        watch: {
          ignored: [resolvedWasmDir]
        }
      }
    }),

    resolveId(id) {
      if (!isWatId(id))
        return
      return id
    },

    async transform(code, id) {
      if (!isWatId(id))
        return
      const wasmId = toWasmId(id, cwd, resolvedWasmDir)
      await fse.ensureFile(wasmId)
      await fse.writeFile(wasmId, await wat2wasm(code))
      return `import initWasm from '${wasmId}?init';\nexport default initWasm;`
    }
  }
}
