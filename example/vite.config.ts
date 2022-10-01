import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

import Wat from '../src/index'

const config = defineConfig({
  plugins: [
    Wat(),
    Inspect(),
  ],
  build: {
    target: 'ESNext',
  },
})

export default config
