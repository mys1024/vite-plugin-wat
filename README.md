# vite-plugin-wat

A [Vite](https://vitejs.dev/) plugin for [WebAssembly Text Format](https://webassembly.github.io/spec/core/text/index.html).

## Install

```shell
npm install -D vite-plugin-wat
```

## Usage

`vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import Wat from 'vite-plugin-wat'

export default defineConfig({
  plugins: [Wat()]
})
```

`src/add.wat`:

```wat
(module
  (func $add (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    local.get $p1
    i32.add
  )
  (export "add" (func $add))
)
```

`src/index.js`:

```javascript
import initAddModule from './add.wat?init'

const { add } = (await initAddModule({})).exports
console.log(add(1, 2)) // 3
```

**NOTE**: See [this](https://vitejs.dev/guide/features.html#webassembly) for more information about `?init`.

## TypeScript Support

Create `src/shims.d.ts` with the following content:

```typescript
declare module '*.wat?init' {
  const initWasm: (
    options: WebAssembly.Imports
  ) => Promise<WebAssembly.Instance>
  export default initWasm
}
```

Use type casting when exporting WASM module:

```typescript
import initAddModule from './add.wat?init'

interface AddModuleExports {
  add(a: number, b: number): number
}

const { add } = (await initAddModule({})).exports as unknown as AddModuleExports
console.log(add(1, 2)) // 3
```

## License

MIT
