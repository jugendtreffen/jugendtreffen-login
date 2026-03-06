import redwood from '@redwoodjs/vite'
import tailwindcss from '@tailwindcss/vite'
import dns from 'dns'
import { defineConfig, UserConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// So that Vite will load on localhost instead of `127.0.0.1`.
// See: https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder('verbatim')

const viteConfig: UserConfig = {
  plugins: [
    redwood(),
    tailwindcss(),
    nodePolyfills({
      // Nur die benötigten Module angeben:
      include: ['stream', 'crypto', 'buffer', 'process'],
      globals: { global: true, process: true, Buffer: true },
    }),
  ],
}

export default defineConfig(viteConfig)
