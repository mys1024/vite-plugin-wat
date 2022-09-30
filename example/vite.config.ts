import Inspect from 'vite-plugin-inspect'
import Wat from '../src/index'
import { defineConfig } from 'vite'

const config = defineConfig({
  plugins: [
    Wat(),
    Inspect(),
  ],
  build: {
    target: "ESNext"
  }
})

export default config
