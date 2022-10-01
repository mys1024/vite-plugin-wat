import { describe, expect, it } from 'vitest'
import { wat2wasm } from '../src/wabt'

describe('wat2wasm', () => {
  const wat = `
    (module
      (func $add (param i32) (param i32) (result i32)
        local.get 0
        local.get 1
        i32.add
      )
      (export "add" (func $add))
    )
  `

  it('compiling', async () => {
    const wasm = await wat2wasm(wat)
    expect(wasm).toMatchSnapshot()
  })

  it('correctness', async () => {
    const wasm = await wat2wasm(wat)
    const { add } = (
      await (WebAssembly.instantiate(wasm, {}))
    ).instance.exports
    if (add instanceof Function)
      expect(add(1, 2)).toBe(3)
    else
      throw new Error('\'add\' is not a function')
  })
})
