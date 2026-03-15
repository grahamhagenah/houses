const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageFolder = 'Cropped Houses';
const outputFolder = 'Cropped Houses Transparent';

// Create output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Get all image files
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
const images = fs.readdirSync(imageFolder)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

async function removeWhiteBackground(inputPath, outputPath) {
    const image = sharp(inputPath);
    const { width, height } = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Process pixels - make white/near-white pixels transparent
    const threshold = 240; // Pixels with R, G, B all above this become transparent

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is white or near-white
        if (r > threshold && g > threshold && b > threshold) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }

    // Save with transparency
    await sharp(data, {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    })
    .png()
    .toFile(outputPath);
}

async function processAllImages() {
    console.log(`Processing ${images.length} images...`);

    for (const image of images) {
        const inputPath = path.join(imageFolder, image);
        const outputPath = path.join(outputFolder, path.parse(image).name + '.png');

        try {
            await removeWhiteBackground(inputPath, outputPath);
            console.log(`Processed: ${image}`);
        } catch (err) {
            console.error(`Error processing ${image}:`, err.message);
        }
    }

    console.log(`\nDone! Transparent images saved to "${outputFolder}"`);
}

processAllImages();
