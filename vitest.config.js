import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    base: '/serialization/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./serialization/src', import.meta.url))
      }
    }
  })
)
