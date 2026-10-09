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
          } catch (err: any) {
            console.error('[Upload] Erro ao processar upload:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Erro interno no upload' }))
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
