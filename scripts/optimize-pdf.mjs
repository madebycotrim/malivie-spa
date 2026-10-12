import { PDFDocument, PDFName, PDFNumber, PDFRef, PDFDict } from 'pdf-lib';
import fs from 'fs';
import zlib from 'zlib';
import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';

const targetPath = process.argv[2] || path.join(process.cwd(), 'public', 'menu-malivie-spa.pdf');

async function optimizePdf() {
  if (!fs.existsSync(targetPath)) {
    console.error(`Arquivo não encontrado: ${targetPath}`);
    process.exit(1);
  }

  const initialBytes = fs.readFileSync(targetPath);
  const initialSizeMb = (initialBytes.length / (1024 * 1024)).toFixed(2);
  console.log(`[PDF Optimizer] Iniciando otimização de: ${targetPath}`);
  console.log(`[PDF Optimizer] Tamanho inicial: ${initialSizeMb} MB`);

  const doc = await PDFDocument.load(initialBytes);

  // 1. Deduplicação de imagens idênticas (Canva frequentemente duplica backgrounds por página)
  const hashes = new Map();
  const replacements = new Map();

  for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj.constructor.name === 'PDFRawStream') {
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype && subtype.asString() === '/Image') {
        const hash = crypto.createHash('md5').update(obj.contents).digest('hex');
        if (!hashes.has(hash)) {
          hashes.set(hash, ref);
        } else {
          replacements.set(ref.tag, hashes.get(hash));
        }
      }
    }
  }

  if (replacements.size > 0) {
    console.log(`[PDF Optimizer] Encontradas ${replacements.size} imagens duplicadas para unificação.`);
    for (const [, obj] of doc.context.enumerateIndirectObjects()) {
      if (obj instanceof PDFDict) {
        for (const [key, val] of obj.entries()) {
          if (val instanceof PDFRef && replacements.has(val.tag)) {
            obj.set(key, replacements.get(val.tag));
          }
        }
      }
      if (obj.constructor.name === 'PDFRawStream') {
        const dict = obj.dict;
        for (const [key, val] of dict.entries()) {
          if (val instanceof PDFRef && replacements.has(val.tag)) {
            dict.set(key, replacements.get(val.tag));
          }
        }
      }
    }

    for (const [dupTag] of replacements) {
      const parts = dupTag.split(' ');
      doc.context.delete(PDFRef.of(parseInt(parts[0], 10), parseInt(parts[1], 10)));
    }
  }

  // 2. Compressão e otimização das imagens únicas
  let optimizedCount = 0;
  for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
    if (obj.constructor.name === 'PDFRawStream') {
      const dict = obj.dict;
      const subtype = dict.get(PDFName.of('Subtype'));
      if (subtype && subtype.asString() === '/Image') {
        const filter = dict.get(PDFName.of('Filter'))?.asString();
        const width = dict.get(PDFName.of('Width'))?.asNumber();
        const height = dict.get(PDFName.of('Height'))?.asNumber();

        let newJpegBuf = null;

        if (filter === '/FlateDecode' && width && height) {
          // Bitmaps RGB sem compressão DCT
          try {
            const decompressed = zlib.inflateSync(obj.contents);
            if (decompressed.length === width * height * 3) {
              newJpegBuf = await sharp(decompressed, { raw: { width, height, channels: 3 } })
                .jpeg({ quality: 82, mozjpeg: true })
                .toBuffer();
            }
          } catch (e) {
            console.warn(`[PDF Optimizer] Falha ao descomprimir stream Flate (${ref.tag}):`, e.message);
          }
        } else if (filter === '/DCTDecode') {
          // JPEGs já comprimidos - recompressão otimizada via mozjpeg
          try {
            newJpegBuf = await sharp(obj.contents)
              .jpeg({ quality: 82, mozjpeg: true })
              .toBuffer();
          } catch (e) {
            console.warn(`[PDF Optimizer] Falha ao reprocessar JPEG (${ref.tag}):`, e.message);
          }
        }

        if (newJpegBuf && newJpegBuf.length < obj.contents.length) {
          obj.contents = newJpegBuf;
          obj.dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
          obj.dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
          obj.dict.set(PDFName.of('Length'), PDFNumber.of(newJpegBuf.length));
          optimizedCount++;
        }
      }
    }
  }

  console.log(`[PDF Optimizer] Otimizadas ${optimizedCount} imagens com sucesso.`);

  const finalPdf = await doc.save();
  const finalSizeMb = (finalPdf.length / (1024 * 1024)).toFixed(2);
  const reductionPercent = (((initialBytes.length - finalPdf.length) / initialBytes.length) * 100).toFixed(1);

  fs.writeFileSync(targetPath, finalPdf);
  console.log(`[PDF Optimizer] Concluído! Tamanho final: ${finalSizeMb} MB (-${reductionPercent}%)`);
}

optimizePdf().catch((err) => {
  console.error('[PDF Optimizer] Erro fatal durante a otimização:', err);
  process.exit(1);
});
