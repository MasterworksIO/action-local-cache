import { defineConfig } from 'tsup'

export default defineConfig({
  noExternal: [/^(?!node:).+/],
  clean: true,
  treeshake: true,
  platform: 'node',
})
