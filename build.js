const fs = require('fs');
const path = require('path');

const imageFolder = 'Cropped Houses Transparent';

// Get all image files from the folder
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const images = fs.readdirSync(imageFolder)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map(file => `${imageFolder}/${file}`);

fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
console.log(`Generated images.json with ${images.length} images from "${imageFolder}"`);
