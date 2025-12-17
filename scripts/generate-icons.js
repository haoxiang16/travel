import sharp from 'sharp';
import { writeFileSync } from 'fs';

// 創建 SVG 圖標
const createSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d9488"/>
      <stop offset="100%" style="stop-color:#14b8a6"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">✈</text>
</svg>
`;

async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    const svg = Buffer.from(createSvg(size));
    
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(`public/pwa-${size}x${size}.png`);
    
    console.log(`✅ Generated pwa-${size}x${size}.png`);
  }
  
  console.log('🎉 All icons generated!');
}

generateIcons().catch(console.error);

