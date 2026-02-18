import redwood from '@redwoodjs/vite'
import tailwindcss from '@tailwindcss/vite'
import dns from 'dns'
import { defineConfig, UserConfig } from 'vite'

// So that Vite will load on localhost instead of `127.0.0.1`.
// See: https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder('verbatim')

const viteConfig: UserConfig = {
  plugins: [redwood(), tailwindcss()],
}

export default defineConfig(viteConfig)
