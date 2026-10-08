import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = './assets-src';
const outDir = './src/assets/images';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processImages() {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const inputPath = path.join(srcDir, file);
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const outputPath = path.join(outDir, `${baseName}.webp`);
      console.log(`Processing: ${file} -> ${outputPath}`);
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
    }
  }
  console.log('Images converted successfully!');
}

processImages().catch(err => {
  console.error(err);
  process.exit(1);
});
