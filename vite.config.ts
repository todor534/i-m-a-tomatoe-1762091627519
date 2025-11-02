import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

function devApi(): Plugin {
  async function readBody(req: IncomingMessage): Promise<Buffer> {
    const chunks: Buffer[] = []
    return new Promise((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', reject)
    })
  }

  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const rawUrl = req.url || '/'
        const pathname = rawUrl.split('?')[0] || '/'
        if (!pathname.startsWith('/api/')) return next()

        try {
          const method = (req.method || 'GET').toUpperCase()

          // Map /api/foo -> /api/foo.ts for local dev
          const modPath = pathname.endsWith('.ts') ? pathname : `${pathname}.ts`

          // Load the API module using Vite's SSR loader (supports TS)
          const mod: any = await server.ssrLoadModule(modPath)

          // Choose a handler: handle, default, or method-named export
          let handler: ((req: Request) => Promise<Response>) | undefined
          if (typeof mod.handle === 'function') handler = mod.handle
          else if (typeof mod.default === 'function') handler = mod.default
          else if (typeof mod[method] === 'function') handler = mod[method]

          if (!handler) {
            res.statusCode = 500
            res.end(`No handler found in ${modPath}. Expected export: handle, default, or ${method}`)
            return
          }

          // Build a Fetch Request from Node req
          const host = (req.headers.host as string) || 'localhost'
          const scheme = 'http'
          const fullUrl = `${scheme}://${host}${rawUrl}`

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) headers.set(key, value.join(', '))
            else if (typeof value === 'string') headers.set(key, value)
          }

          const bodyBuffer = await readBody(req)
          const requestInit: RequestInit = {
            method,
            headers,
            body: bodyBuffer.length > 0 ? bodyBuffer : undefined,
          }

          const request = new Request(fullUrl, requestInit)

          // Invoke API handler
          const response: Response = await handler(request)

          // Write back to Node res
          res.statusCode = response.status
          response.headers.forEach((v, k) => {
            // Some headers like set-cookie can be multiple values
            if (k.toLowerCase() === 'set-cookie') {
              const cookies = response.headers.getSetCookie?.() || [v]
              res.setHeader('set-cookie', cookies)
            } else {
              res.setHeader(k, v)
            }
          })

          // Stream/return body
          if (response.body) {
            const reader = response.body.getReader()
            const pump = () =>
              reader.read().then(({ done, value }) => {
                if (done) {
                  res.end()
                  return
                }
                res.write(Buffer.from(value))
                return pump()
              })
            await pump()
          } else {
            res.end()
          }
        } catch (err) {
          console.error('[dev-api] Error handling', req.url, err)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})