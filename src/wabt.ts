import wabt from 'wabt'

export async function wat2wasm(wat: string) {
  const wabtModule = await wabt()
  const wasmModule = wabtModule.parseWat('', wat)
  return wasmModule.toBinary({}).buffer
}
