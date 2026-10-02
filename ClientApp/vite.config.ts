import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// A CSP do index.html libera localhost/ws e scripts inline só porque o servidor de
// desenvolvimento (HMR do React) precisa disso. No build de produção ela fica mais restrita.
const strictCspOnBuild = (): Plugin => ({
  name: 'strict-csp-on-build',
  apply: 'build',
  transformIndexHtml: (html) =>
    html
      .replace(' http://localhost:* ws://localhost:*', '')
      .replace("script-src 'self' 'unsafe-inline'", "script-src 'self'"),
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), strictCspOnBuild()],
})
