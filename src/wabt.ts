import wabt from 'wabt'

export async function wat2wasm(wat: string) {
  const wabtModule = await wabt()
  const wasmModule = wabtModule.parseWat('', wat)
  const wasm = wasmModule.toBinary({}).buffer
  wasmModule.destroy()
  return wasm
}
