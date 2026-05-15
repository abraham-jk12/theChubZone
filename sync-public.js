/**
 * Copies /data and /images into /public so Vite can serve them at /data/* and /images/*.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(from, to);
    else fs.copyFileSync(from, to);
  }
}

copyRecursive(path.join(__dirname, "data"), path.join(__dirname, "public", "data"));
copyRecursive(path.join(__dirname, "images"), path.join(__dirname, "public", "images"));
console.log("Synced data/ and images/ → public/");
