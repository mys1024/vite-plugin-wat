import initAddModule from './add.wat?init'
import './style.css'

interface AddModuleExports {
  add(a: number, b: number): number
}

// import from WASM module
const addModuleExports = (await initAddModule({}))
  .exports as unknown as AddModuleExports // type casting
const { add } = addModuleExports

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="center">
    <button id="counter" type="button">count is 0</button>
  </div>
`

const Counter = document.querySelector<HTMLButtonElement>('#counter')
let cnt = 0
Counter!.addEventListener('click', () => {
  cnt = add(cnt, 1)
  Counter!.innerHTML = `count is ${cnt}`
})
