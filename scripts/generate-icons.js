// Rasterizes the Marriage Scorer "M" mark (defined inline in www/index.html's
// favicon/apple-touch-icon data URIs) into the source PNGs @capacitor/assets
// needs to generate the full Android/iOS icon set.
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const GREEN = '#0f3d2e';
const GOLD = '#c9a24b';
const CREAM = '#f4ecd8';

const OUT_DIR = path.join(__dirname, '..', 'resources');
fs.mkdirSync(OUT_DIR, { recursive: true });

function markSvg({ size, withBackground, contentScale }) {
  // Original mark is authored on a 192x192 grid: green rounded square,
  // gold ring inset by 14px with 6px stroke, cream serif "M".
  const scale = contentScale != null ? contentScale : 1;
  const vb = 192;
  const cx = vb / 2, cy = vb / 2;
  const bg = withBackground ? `<rect width="${vb}" height="${vb}" rx="36" fill="${GREEN}"/>` : '';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${vb} ${vb}">
  <g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">
    ${bg}
    <rect x="14" y="14" width="164" height="164" rx="26" fill="none" stroke="${GOLD}" stroke-width="6"/>
    <text x="96" y="132" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-weight="700" fill="${CREAM}" text-anchor="middle">M</text>
  </g>
</svg>`;
}

async function main() {
  const size = 1024;

  // icon-only.png: full mark with background, used as the flat icon (iOS, legacy Android).
  await sharp(Buffer.from(markSvg({ size, withBackground: true, contentScale: 1 })))
    .png()
    .toFile(path.join(OUT_DIR, 'icon-only.png'));

  // icon-background.png: solid felt-green fill; Android applies the adaptive mask shape.
  await sharp({
    create: { width: size, height: size, channels: 4, background: GREEN }
  }).png().toFile(path.join(OUT_DIR, 'icon-background.png'));

  // icon-foreground.png: ring + "M" only, transparent background, shrunk to
  // Android's adaptive-icon safe zone (~66% of canvas) so it survives circle/squircle masks.
  await sharp(Buffer.from(markSvg({ size, withBackground: false, contentScale: 0.62 })))
    .png()
    .toFile(path.join(OUT_DIR, 'icon-foreground.png'));

  console.log('Generated resources/icon-only.png, icon-background.png, icon-foreground.png');
}

main().catch((err) => { console.error(err); process.exit(1); });
