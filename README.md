# vite-plugin-wat

A vite plugin for WebAssembly text format.

## Usage

`vite.config.js`:

```javascript
import Wat from 'vite-plugin-wat'

export default {
  plugins: [
    Wat()
  ]
}
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
(await initAddModule({})).exports.add(1, 1) // 2
```

NOTE: See [this](https://vitejs.dev/guide/features.html#webassembly) for more information about `?init`.

## License

MIT