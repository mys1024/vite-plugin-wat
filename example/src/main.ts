import './style.css'
import initAddModule from './add.wat?init'

interface AddModuleExports {
  add(a: number, b: number): number
  addAndMul(a: number, b: number, c: number): number
}

const addModuleInstance = await initAddModule({})
const addModuleExports = addModuleInstance.exports as unknown as AddModuleExports
const { add } = addModuleExports

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="center">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(add(counter, 1)))
  setCounter(0)
}

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
