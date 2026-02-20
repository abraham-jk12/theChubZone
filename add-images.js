/**
 * Add Images to Local Database
 * 
 * Run this script after adding images to the images/ folders:
 *   node add-images.js
 * 
 * Supported formats: jpg, jpeg, png, gif, webp
 * Folders: images/cat, images/dog, images/sheep, images/guinea
 */

const fs = require("fs");
const path = require("path");

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const IMAGES_DIR = path.join(__dirname, "images");
const DATA_FILE = path.join(__dirname, "data", "animals.json");
const ANIMAL_TYPES = ["cat", "dog", "sheep", "guinea"];

function scanFolder(animalType) {
  const folderPath = path.join(IMAGES_DIR, animalType);
  const images = [];

  if (!fs.existsSync(folderPath)) {
    return images;
  }

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (IMAGE_EXT.includes(ext)) {
      images.push(`images/${animalType}/${file}`);
    }
  }

  return images;
}

function main() {
  const database = {};

  for (const type of ANIMAL_TYPES) {
    database[type] = scanFolder(type);
    console.log(`  ${type}: ${database[type].length} image(s)`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
  const total = Object.values(database).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\nDone! ${total} total images saved to data/animals.json`);
}

console.log("Scanning images...\n");
main();
