/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { searchOffers, placeSuggestions } from './api/_duffel.ts'

// Dev-only fallback: serve /api/search and /api/places using the SAME Duffel
// proxy logic as the Vercel serverless functions, so plain `vite` works locally
// without the Vercel CLI. Applies to `serve` (dev) only — in production Vercel
// serves /api itself, and this plugin is not part of the build.
function duffelDevApi(): Plugin {
  return {
    name: 'duffel-dev-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      if (env.DUFFEL_TOKEN && !process.env.DUFFEL_TOKEN) {
        process.env.DUFFEL_TOKEN = env.DUFFEL_TOKEN
      }

      const send = (res: ServerResponse, status: number, payload: unknown) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(payload))
      }

      const readJson = (req: IncomingMessage) =>
        new Promise<unknown>((resolve, reject) => {
          let raw = ''
          req.on('data', (chunk) => (raw += chunk))
          req.on('end', () => {
            try {
              resolve(raw ? JSON.parse(raw) : {})
            } catch (err) {
              reject(err)
            }
          })
          req.on('error', reject)
        })

      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/api/')) return next()
        try {
          if (req.method === 'POST' && url.startsWith('/api/search')) {
            const body = await readJson(req)
            const { status, payload } = await searchOffers(body)
            return send(res, status, payload)
          }
          if (req.method === 'GET' && url.startsWith('/api/places')) {
            const q = (new URL(url, 'http://localhost').searchParams.get('query') ?? '').trim()
            if (q.length < 2) return send(res, 200, { data: [] })
            const { status, payload } = await placeSuggestions(q)
            return send(res, status, payload)
          }
          return send(res, 405, { error: 'Method not allowed' })
        } catch (err) {
          return send(res, 502, { error: 'Failed to reach Duffel', detail: String(err) })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), duffelDevApi()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
