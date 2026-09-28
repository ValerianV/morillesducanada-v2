// Génère les images SEO statiques de public/ à partir des visuels de src/assets.
// À relancer seulement si le logo ou la photo change : node scripts/generate-seo-images.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const LOGO = "src/assets/logo.webp";
const PHOTO = "src/assets/hero-jars.webp";
const BG = { r: 26, g: 22, b: 18, alpha: 1 };

const squareLogo = (size, background) =>
  sharp(LOGO)
    .resize(size, size, { fit: "contain", background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 });

// ICO contenant une image PNG (format accepté par tous les navigateurs actuels).
async function writeIco(file, sizes) {
  const images = await Promise.all(sizes.map((s) => squareLogo(s).toBuffer()));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((img, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], entry);
    header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(img.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += img.length;
  });
  await writeFile(file, Buffer.concat([header, ...images]));
}

const ogOverlay = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#1a1612" stop-opacity="0"/>
      <stop offset="1" stop-color="#1a1612" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <text x="60" y="548" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="#fdfcf9">Morilles séchées sauvages du Canada</text>
  <text x="60" y="594" font-family="Helvetica, Arial, sans-serif" font-size="24" letter-spacing="3" fill="#c9a84c">ENTIÈRES · ÉQUEUTÉES · STOCK EN FRANCE</text>
</svg>`);

await sharp(PHOTO)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([{ input: ogOverlay }])
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
  .toFile("public/og-image.jpg");

await squareLogo(32).toFile("public/favicon-32.png");
await squareLogo(180, BG).toFile("public/apple-touch-icon.png");
await squareLogo(300).toFile("public/logo.png");
await writeIco("public/favicon.ico", [48]);

console.log("Images SEO générées dans public/.");
