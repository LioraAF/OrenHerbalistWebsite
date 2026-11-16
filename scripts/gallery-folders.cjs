const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const folders = {
  home: 'home-gallery',
  main: 'main-gallery',
  treatment: 'treatment-gallery',
  products: 'products/gallery',
  gifts: 'products/gifts',
  adults: 'workshops',
  kids: 'workshops-kids',
};
const imageExtension = /\.(?:avif|gif|jpe?g|png|webp|svg)$/i;

function scan() {
  const images = {};
  for (const [key, folder] of Object.entries(folders)) {
    const directory = path.join(root, 'images', folder);
    const entries = fs.existsSync(directory) ? fs.readdirSync(directory, {withFileTypes: true}) : [];
    images[key] = entries
      .filter(entry => entry.isFile() && !entry.name.startsWith('.') && imageExtension.test(entry.name))
      .map(entry => `${folder}/${entry.name}`).sort();
  }
  return {images};
}

function manifest(images) {
  return '// Generated from gallery folders; do not edit by hand.\n'
    + `window.siteGalleryImages = ${JSON.stringify(images, null, 2)};\n`;
}

function generate() {
  const result = scan();
  const output = path.join(root, 'js/gallery-images.js');
  const content = manifest(result.images);
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== content) fs.writeFileSync(output, content);
  return result;
}

module.exports = {root, folders, scan, manifest, generate};

if (require.main === module) {
  const result = generate();
  console.log('Gallery images:', Object.fromEntries(Object.entries(result.images).map(([key, images]) => [key, images.length])));
}
