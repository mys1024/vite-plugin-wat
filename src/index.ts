import type { Plugin } from 'vite'
import { relative, resolve } from 'pathe'
import fse from 'fs-extra'

import { wat2wasm } from './wabt'

const PLUGIN_NAME = 'vite-plugin-wat'
const WAT_ID_REG = /\.wat\?init$/

function isWatId(id: string): boolean {
  return WAT_ID_REG.test(id)
}

function resolveWasmId(watId: string, cwd: string, wasmDir: string) {
  return resolve(wasmDir, relative(cwd, watId).replace(WAT_ID_REG, '.wasm'))
}

export default (): Plugin => {
  const cwd = resolve('./')
  const storeDir = resolve(cwd, 'node_modules', `.${PLUGIN_NAME}`)
  const wasmDir = resolve(storeDir, 'wasm')

  return {
    name: PLUGIN_NAME,
    config: () => ({
      server: { watch: { ignored: [wasmDir] } },
    }),
    buildStart: () => {
      fse.removeSync(wasmDir)
    },
    transform: async (code, id) => {
      if (!isWatId(id))
        return
      // wasmId will be a string like '/path/to/store/wasm/generated.wasm'
      const wasmId = resolveWasmId(id, cwd, wasmDir)
      // compile `.wat` to `.wasm`, save `.wasm` in `wasmDir`
      await fse.ensureFile(wasmId)
      await fse.writeFile(wasmId, await wat2wasm(code))
      return `export { default } from '${wasmId}?init';`
    },
  }
}
