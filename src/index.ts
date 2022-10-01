import type { Plugin } from 'vite'
import { relative, resolve } from 'pathe'
import fse from 'fs-extra'

import { wat2wasm } from './wabt'

const WAT_ID_REG = /\.wat\?init$/
const CWD = resolve(process.cwd())
const WASM_DIR = resolve(CWD, 'node_modules/.vite-plugin-wat/wasm')

function isWatId(id: string): boolean {
  return WAT_ID_REG.test(id)
}

function resolveWasmId(watId: string) {
  return resolve(WASM_DIR, relative(CWD, watId).replace(WAT_ID_REG, '.wasm'))
}

export default (): Plugin => {
  return {
    name: 'vite-plugin-wat',
    config: () => ({
      server: { watch: { ignored: [WASM_DIR] } },
    }),
    buildStart: () => {
      fse.removeSync(WASM_DIR)
    },
    resolveId: (id) => {
      return isWatId(id) ? id : undefined
    },
    transform: async (code, id) => {
      if (!isWatId(id))
        return
      const wasmId = resolveWasmId(id)
      await fse.ensureFile(wasmId)
      await fse.writeFile(wasmId, await wat2wasm(code))
      return `import initWasm from '${wasmId}?init';\nexport default initWasm;`
    },
  }
}
