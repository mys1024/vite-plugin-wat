import { describe, expect, it } from 'vitest'
import { wat2wasm } from '../src/wabt'

describe.concurrent('base64 encoding', () => {
  it('wat2wasm', async () => {
    const wasm = await wat2wasm(`
      (module
        (func $add (param i32) (param i32) (result i32)
          local.get 0
          local.get 1
          i32.add
        )
        (export "add" (func $add))
      )
    `)
    expect(wasm).toMatchSnapshot()
  })
})
