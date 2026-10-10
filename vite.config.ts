import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Protege os arquivos base iniciais importados estaticamente no código
const PROTECTED_ASSETS = new Set([
  'acupuntura.webp',
  'day-spa-cha.webp',
  'head-spa-arco-dourado.webp',
  'head-spa-detalhe.webp',
  'head-spa-jatos-agua.webp',
  'head-spa-terapeuta-acolhimento.webp',
  'hero-head-spa.webp',
  'logo-malivie-white.webp',
  'malivie-bandeja-reflexao.webp',
  'malivie-fachada-oficial.webp',
  'malivie-gift-card-instagram.webp',
  'malivie-roupao-chinelos.webp',
  'pedras-quentes.webp',
  'ritual-boas-vindas.webp',
  'spa-dos-pes.webp',
])

function assetUploadPlugin(): Plugin {
  return {
    name: 'vite-plugin-asset-upload',
    configureServer(server) {
      server.middlewares.use('/api/upload-asset', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB limite máximo
        let body = ''
        let bodyLength = 0
        let isExceeded = false

        req.on('data', (chunk) => {
          bodyLength += chunk.length
          if (bodyLength > MAX_UPLOAD_BYTES) {
            isExceeded = true
            res.statusCode = 413
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Payload excede o limite máximo permitido de 5MB' }))
            req.destroy()
            return
          }
          body += chunk
        })

        req.on('end', async () => {
          if (isExceeded) return
          try {
            const { serviceId, assetId, dataUrl, oldImage, prefix: reqPrefix } = JSON.parse(body || '{}')

            const targetId = assetId || serviceId
            if (!targetId || !dataUrl) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'assetId/serviceId e dataUrl são obrigatórios' }))
              return
            }

            // Extrai dados base64
            const base64Match = dataUrl.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/)
            const base64Data = base64Match ? base64Match[1] : dataUrl
            const buffer = Buffer.from(base64Data, 'base64')

            const imagesDir = path.resolve(process.cwd(), 'src/assets/images')
            if (!fs.existsSync(imagesDir)) {
              fs.mkdirSync(imagesDir, { recursive: true })
            }

            // Sanitiza estritamente o ID e o prefixo contra Path Traversal
            const cleanId = String(targetId).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
            const rawPrefix = reqPrefix || (serviceId ? 'ritual' : 'custom')
            const filePrefix = String(rawPrefix).replace(/[^a-zA-Z0-9_-]/g, '') || 'custom'
            const timestamp = Date.now()
            const newFileName = `${filePrefix}-${cleanId}-${timestamp}.webp`
            const newFilePath = path.join(imagesDir, newFileName)

            // Garante que o caminho resultante esteja estritamente contido em imagesDir
            if (!newFilePath.startsWith(imagesDir)) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Caminho de arquivo inválido detectado' }))
              return
            }

            // Otimiza e converte para WebP mantendo proporção original até 1400px
            await sharp(buffer)
              .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 85 })
              .toFile(newFilePath)

            console.log(`[Upload] Nova imagem salva em assets: ${newFileName}`)

            // 1. Exclui a imagem anterior enviada se não for um ativo base protegido
            if (oldImage) {
              const oldClean = oldImage.split('?')[0]
              const oldBase = path.basename(oldClean)
              if (!PROTECTED_ASSETS.has(oldBase) && (oldBase.startsWith(`${filePrefix}-`) || oldBase.startsWith('ritual-') || oldBase.startsWith('custom-'))) {
                const oldPath = path.join(imagesDir, oldBase)
                if (fs.existsSync(oldPath) && oldPath.startsWith(imagesDir)) {
                  try {
                    fs.unlinkSync(oldPath)
                    console.log(`[Upload] Imagem anterior removida: ${oldBase}`)
                  } catch (e) {
                    console.warn(`[Upload] Falha ao remover imagem anterior:`, e)
                  }
                }
              }
            }

            // 2. Garante exclusão de quaisquer versões antigas anteriores deste mesmo identificador
            const existingFiles = fs.readdirSync(imagesDir)
            for (const file of existingFiles) {
              if (file.startsWith(`${filePrefix}-${cleanId}-`) && file !== newFileName) {
                const targetOld = path.join(imagesDir, file)
                if (fs.existsSync(targetOld) && targetOld.startsWith(imagesDir)) {
                  try {
                    fs.unlinkSync(targetOld)
                    console.log(`[Upload] Versão anterior deste asset removida: ${file}`)
                  } catch (e) {
                    console.warn(`[Upload] Falha ao limpar versão anterior:`, e)
                  }
                }
              }
            }

            const relativeUrl = `/src/assets/images/${newFileName}`

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                success: true,
                imageUrl: relativeUrl,
                fileName: newFileName,
              })
            )
          } catch (err: unknown) {
            console.error('[Upload] Erro ao processar upload:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Erro interno no upload' }))
          }
        })
      })
    },
  }
}

function d1LocalMiddlewarePlugin(): Plugin {
  return {
    name: 'vite-plugin-d1-local',
    configureServer(server) {
      const storageFile = path.resolve(process.cwd(), 'src/data/d1-local-storage.json')

      // Cache de Rate Limit em memória no ambiente de dev local
      const rateLimits = new Map<string, { count: number; resetAt: number }>()

      // Cache de Idempotência em memória: idempotencyKey -> { status: number, body: string }
      const idempotencyCache = new Map<string, { status: number; body: string }>()

      // Sessões ativas autenticadas em memória no servidor de dev
      const activeSessions = new Set<string>()

      const ID_REGEX = /^[a-zA-Z0-9_.\-:\[\]#]{1,120}$/
      const MAX_CONTENT_LENGTH = 10000

      const getReqIp = (req: any): string => {
        const header = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
        return String(header).split(',')[0].trim()
      }

      const checkRate = (ip: string, action: string, maxReq: number, windowSec: number) => {
        const now = Math.floor(Date.now() / 1000)
        const key = `${action}:${ip}`
        const record = rateLimits.get(key)
        if (record && record.resetAt > now) {
          if (record.count >= maxReq) {
            return { allowed: false, retryAfter: Math.max(1, record.resetAt - now) }
          }
          record.count++
          return { allowed: true, retryAfter: 0 }
        }
        rateLimits.set(key, { count: 1, resetAt: now + windowSec })
        return { allowed: true, retryAfter: 0 }
      }

      const checkAuthorization = (req: any): boolean => {
        const auth = String(req.headers['authorization'] || '').trim()
        if (!auth.startsWith('Bearer ')) return false
        const token = auth.slice(7).trim()
        return activeSessions.has(token)
      }

      const loadStorage = (): Record<string, any> => {
        try {
          if (fs.existsSync(storageFile)) {
            const raw = fs.readFileSync(storageFile, 'utf-8')
            return JSON.parse(raw)
          }
        } catch (e) {
          console.warn('[D1 Local Dev] Falha ao carregar d1-local-storage.json:', e)
        }
        return {}
      }

      const saveStorage = (data: Record<string, any>) => {
        try {
          const dir = path.dirname(storageFile)
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf-8')
        } catch (e) {
          console.error('[D1 Local Dev] Falha ao salvar d1-local-storage.json:', e)
        }
      }

      server.middlewares.use('/api/content', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const clientIp = getReqIp(req)

        if (req.method === 'GET') {
          const rate = checkRate(clientIp, 'content:get', 120, 60)
          if (!rate.allowed) {
            res.statusCode = 429
            res.setHeader('Retry-After', String(rate.retryAfter))
            res.end(JSON.stringify({ success: false, error: 'Rate limit excedido' }))
            return
          }

          const current = loadStorage()
          const overrides: Record<string, string> = {}
          const versions = current._versions || {}

          Object.keys(current).forEach((k) => {
            if (!k.startsWith('_') && typeof current[k] === 'string') {
              overrides[k] = current[k]
            }
          })

          res.statusCode = 200
          res.end(JSON.stringify({ success: true, overrides, versions, count: Object.keys(overrides).length }))
          return
        }

        if (req.method === 'POST') {
          // Autorização obrigatória
          if (!checkAuthorization(req)) {
            res.statusCode = 401
            res.end(JSON.stringify({ success: false, error: 'Acesso não autorizado. Faça login no modo editor.' }))
            return
          }

          const rate = checkRate(clientIp, 'content:post', 60, 60)
          if (!rate.allowed) {
            res.statusCode = 429
            res.setHeader('Retry-After', String(rate.retryAfter))
            res.end(JSON.stringify({ success: false, error: 'Rate limit excedido' }))
            return
          }

          // Idempotência
          const idempotencyKey = String(req.headers['idempotency-key'] || req.headers['x-idempotency-key'] || '').trim()
          if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
            const cached = idempotencyCache.get(idempotencyKey)!
            res.statusCode = cached.status
            res.setHeader('X-Idempotent-Replay', 'true')
            res.end(cached.body)
            return
          }

          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const current = loadStorage()
              if (!current._versions) current._versions = {}

              // Salvamento em lote
              if (parsed.overrides && typeof parsed.overrides === 'object') {
                const entries = Object.entries(parsed.overrides)
                if (entries.length > 100) {
                  res.statusCode = 400
                  res.end(JSON.stringify({ success: false, error: 'Lote excede 100 itens' }))
                  return
                }

                for (const [k, v] of entries) {
                  if (!ID_REGEX.test(k) || typeof v !== 'string' || v.length > MAX_CONTENT_LENGTH) {
                    res.statusCode = 400
                    res.end(JSON.stringify({ success: false, error: `Item inválido: ${k}` }))
                    return
                  }
                  current[k] = v
                  current._versions[k] = (current._versions[k] || 1) + 1
                }

                saveStorage(current)
                const resBody = JSON.stringify({ success: true, updated: entries.length })
                if (idempotencyKey) idempotencyCache.set(idempotencyKey, { status: 200, body: resBody })
                res.statusCode = 200
                res.end(resBody)
                return
              }

              // Salvamento individual
              if (parsed.id && typeof parsed.content === 'string') {
                const cleanId = String(parsed.id).trim()
                if (!ID_REGEX.test(cleanId) || parsed.content.length > MAX_CONTENT_LENGTH) {
                  res.statusCode = 400
                  res.end(JSON.stringify({ success: false, error: 'ID ou tamanho de conteúdo inválido' }))
                  return
                }

                current[cleanId] = parsed.content
                current._versions[cleanId] = (current._versions[cleanId] || 1) + 1
                saveStorage(current)
                const resBody = JSON.stringify({ success: true, id: cleanId })
                if (idempotencyKey) idempotencyCache.set(idempotencyKey, { status: 200, body: resBody })
                res.statusCode = 200
                res.end(resBody)
                return
              }

              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'Parâmetros inválidos' }))
            } catch (err: unknown) {
              console.error('[D1 Local Dev POST Error]:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: 'Erro interno ao processar requisição' }))
            }
          })
          return
        }

        if (req.method === 'DELETE') {
          if (!checkAuthorization(req)) {
            res.statusCode = 401
            res.end(JSON.stringify({ success: false, error: 'Acesso não autorizado' }))
            return
          }

          const rate = checkRate(clientIp, 'content:delete', 60, 60)
          if (!rate.allowed) {
            res.statusCode = 429
            res.setHeader('Retry-After', String(rate.retryAfter))
            res.end(JSON.stringify({ success: false, error: 'Rate limit excedido' }))
            return
          }

          const idempotencyKey = String(req.headers['idempotency-key'] || req.headers['x-idempotency-key'] || '').trim()
          if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
            const cached = idempotencyCache.get(idempotencyKey)!
            res.statusCode = cached.status
            res.setHeader('X-Idempotent-Replay', 'true')
            res.end(cached.body)
            return
          }

          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const current = loadStorage()
              const cleanId = String(parsed.id || '').trim()
              if (cleanId && ID_REGEX.test(cleanId)) {
                delete current[cleanId]
                if (current._versions) delete current._versions[cleanId]
                saveStorage(current)
                const resBody = JSON.stringify({ success: true, id: cleanId })
                if (idempotencyKey) idempotencyCache.set(idempotencyKey, { status: 200, body: resBody })
                res.statusCode = 200
                res.end(resBody)
                return
              }
              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'ID inválido' }))
            } catch (err: unknown) {
              console.error('[D1 Local Dev DELETE Error]:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: 'Erro interno ao processar requisição' }))
            }
          })
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ success: false, error: 'Método não permitido' }))
      })

      async function hashLocalPassword(password: string, saltHex?: string) {
        const enc = new TextEncoder()
        const salt = saltHex
          ? Uint8Array.from(saltHex.match(/.{1,2}/g) || [], (b) => parseInt(b, 16))
          : crypto.getRandomValues(new Uint8Array(16))
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          enc.encode(password),
          { name: 'PBKDF2' },
          false,
          ['deriveBits']
        )
        const derivedBits = await crypto.subtle.deriveBits(
          { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
          keyMaterial,
          256
        )
        const hash = Array.from(new Uint8Array(derivedBits))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
        const saltStr = Array.from(salt)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
        return { hash, salt: saltStr }
      }

      server.middlewares.use('/api/auth', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ success: false, error: 'Método não permitido' }))
          return
        }

        const clientIp = getReqIp(req)
        const rate = checkRate(clientIp, 'auth:attempt', 10, 60)
        if (!rate.allowed) {
          res.statusCode = 429
          res.setHeader('Retry-After', String(rate.retryAfter))
          res.end(JSON.stringify({ success: false, error: 'Muitas tentativas de autenticação. Aguarde.' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body || '{}')
            const current = loadStorage() as Record<string, any>
            if (!current._auth) {
              current._auth = await hashLocalPassword('malivie2026')
              saveStorage(current)
            }

            if (parsed.action === 'verify') {
              const pwd = typeof parsed.password === 'string' ? parsed.password.trim() : ''
              const check = await hashLocalPassword(pwd, current._auth.salt)
              let ok = check.hash === current._auth.hash
              if (!ok && (pwd === 'malivie' || pwd === 'malivie2026')) {
                const checkInit = await hashLocalPassword('malivie2026', current._auth.salt)
                if (checkInit.hash === current._auth.hash) {
                  ok = true
                }
              }
              if (!ok) {
                res.statusCode = 401
                res.end(JSON.stringify({ success: false, error: 'Senha incorreta' }))
                return
              }

              // Gera token de sessão seguro
              const tokenBytes = new Uint8Array(32)
              crypto.getRandomValues(tokenBytes)
              const sessionToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')
              activeSessions.add(sessionToken)

              res.statusCode = 200
              res.end(JSON.stringify({ success: true, token: sessionToken, expiresAt: Math.floor(Date.now() / 1000) + 86400 }))
              return
            }

            if (parsed.action === 'change-password') {
              const currentPwd = typeof parsed.currentPassword === 'string' ? parsed.currentPassword.trim() : ''
              const newPwd = typeof parsed.newPassword === 'string' ? parsed.newPassword.trim() : ''
              if (!currentPwd || !newPwd) {
                res.statusCode = 400
                res.end(JSON.stringify({ success: false, error: 'Campos obrigatórios' }))
                return
              }
              if (newPwd.length < 8) {
                res.statusCode = 400
                res.end(JSON.stringify({ success: false, error: 'Mínimo de 8 caracteres' }))
                return
              }
              const verifyCurrent = await hashLocalPassword(currentPwd, current._auth.salt)
              if (verifyCurrent.hash !== current._auth.hash) {
                res.statusCode = 401
                res.end(JSON.stringify({ success: false, error: 'Senha atual incorreta' }))
                return
              }

              current._auth = await hashLocalPassword(newPwd)
              saveStorage(current)

              // Invalida sessões anteriores e cria nova
              activeSessions.clear()
              const tokenBytes = new Uint8Array(32)
              crypto.getRandomValues(tokenBytes)
              const newSessionToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')
              activeSessions.add(newSessionToken)

              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'Senha atualizada', token: newSessionToken, expiresAt: Math.floor(Date.now() / 1000) + 86400 }))
              return
            }

            res.statusCode = 400
            res.end(JSON.stringify({ success: false, error: 'Ação inválida' }))
          } catch (err: unknown) {
            console.error('[D1 Local Dev Auth Error]:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: 'Erro interno ao autenticar' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    assetUploadPlugin(),
    d1LocalMiddlewarePlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
        },
      },
    },
  },
})
