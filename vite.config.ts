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

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', async () => {
          try {
            const { serviceId, assetId, dataUrl, oldImage, prefix: reqPrefix } = JSON.parse(body)

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

            // Sanitiza o ID e define prefixo
            const cleanId = String(targetId).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
            const filePrefix = reqPrefix || (serviceId ? 'ritual' : 'custom')
            const timestamp = Date.now()
            const newFileName = `${filePrefix}-${cleanId}-${timestamp}.webp`
            const newFilePath = path.join(imagesDir, newFileName)

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
                if (fs.existsSync(oldPath)) {
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
                try {
                  fs.unlinkSync(path.join(imagesDir, file))
                  console.log(`[Upload] Versão anterior deste asset removida: ${file}`)
                } catch (e) {
                  console.warn(`[Upload] Falha ao limpar versão anterior:`, e)
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

      const loadStorage = (): Record<string, string> => {
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

      const saveStorage = (data: Record<string, string>) => {
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

        if (req.method === 'GET') {
          const overrides = loadStorage()
          res.statusCode = 200
          res.end(JSON.stringify({ success: true, overrides, count: Object.keys(overrides).length }))
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const current = loadStorage()

              if (parsed.overrides && typeof parsed.overrides === 'object') {
                Object.assign(current, parsed.overrides)
                saveStorage(current)
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, updated: Object.keys(parsed.overrides).length }))
                return
              }

              if (parsed.id && typeof parsed.content === 'string') {
                current[parsed.id] = parsed.content
                saveStorage(current)
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, id: parsed.id }))
                return
              }

              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'Parâmetros inválidos' }))
            } catch (err: unknown) {
              console.error('[D1 Local Dev POST Error]:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }))
            }
          })
          return
        }

        if (req.method === 'DELETE') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}')
              const current = loadStorage()
              if (parsed.id && typeof parsed.id === 'string') {
                delete current[parsed.id]
                saveStorage(current)
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, id: parsed.id }))
                return
              }
              res.statusCode = 400
              res.end(JSON.stringify({ success: false, error: 'ID inválido' }))
            } catch (err: unknown) {
              console.error('[D1 Local Dev DELETE Error]:', err)
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }))
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
              const ok = check.hash === current._auth.hash
              res.statusCode = ok ? 200 : 401
              res.end(JSON.stringify({ success: ok }))
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
              if (newPwd.length < 6) {
                res.statusCode = 400
                res.end(JSON.stringify({ success: false, error: 'Mínimo de 6 caracteres' }))
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
              res.statusCode = 200
              res.end(JSON.stringify({ success: true, message: 'Senha atualizada' }))
              return
            }

            res.statusCode = 400
            res.end(JSON.stringify({ success: false, error: 'Ação inválida' }))
          } catch (err: unknown) {
            console.error('[D1 Local Dev Auth Error]:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Erro' }))
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
