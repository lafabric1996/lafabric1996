/**
 * Convertit en WebP les images PNG/JPEG de public/realisations et
 * public/resurfacage, puis réécrit les chemins dans les fichiers de données.
 *
 * Pourquoi : le dépôt contenait 148 Mo de PNG et de JPEG, dont un PNG de
 * 696 Ko pour une image de 755 px. Next.js réencode à la livraison, donc le
 * visiteur ne les téléchargeait pas en entier, mais le poids ralentit le
 * clone, le build et l'optimisation d'images côté Vercel.
 *
 *   node scripts/optimize-images.mjs            # simulation, n'écrit rien
 *   node scripts/optimize-images.mjs --write    # convertit et réécrit les JSON
 *   node scripts/optimize-images.mjs --write --delete-originals
 *
 * --delete-originals ne supprime un fichier QUE si plus rien ne le référence,
 * ni dans les JSON de données ni dans le code de src/.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WRITE = process.argv.includes("--write");
const DELETE = process.argv.includes("--delete-originals");
const QUALITY = 85;
const RASTER = /\.(png|jpe?g)$/i;
const DATA_FILES = ["src/data/realisations.json", "src/data/resurfacage.json"];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function referencedInSource(publicPath) {
  try {
    execFileSync("grep", ["-rqF", publicPath, "src"], { cwd: ROOT });
    return true;
  } catch {
    return false;
  }
}

const targets = [
  ...walk(path.join(ROOT, "public/realisations")),
  ...walk(path.join(ROOT, "public/resurfacage")),
].filter((f) => RASTER.test(f));

let before = 0;
let after = 0;
let count = 0;
const renames = new Map();

for (const file of targets) {
  const webp = file.replace(RASTER, ".webp");
  if (fs.existsSync(webp)) continue;
  const sizeBefore = fs.statSync(file).size;
  if (!WRITE) {
    before += sizeBefore;
    count += 1;
    continue;
  }
  try {
    await sharp(file).webp({ quality: QUALITY, effort: 5 }).toFile(webp);
    const sizeAfter = fs.statSync(webp).size;
    if (sizeAfter >= sizeBefore) {
      fs.unlinkSync(webp);
      continue;
    }
    before += sizeBefore;
    after += sizeAfter;
    count += 1;
    renames.set(
      "/" + path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/"),
      "/" + path.relative(path.join(ROOT, "public"), webp).split(path.sep).join("/"),
    );
  } catch (error) {
    console.error("Echec:", file, error.message);
  }
}

if (WRITE && renames.size) {
  for (const relative of DATA_FILES) {
    const full = path.join(ROOT, relative);
    if (!fs.existsSync(full)) continue;
    let raw = fs.readFileSync(full, "utf8");
    for (const [from, to] of renames) raw = raw.split(`"${from}"`).join(`"${to}"`);
    fs.writeFileSync(full, raw);
  }

  if (DELETE) {
    let freed = 0;
    for (const [from] of renames) {
      const full = path.join(ROOT, "public", from);
      const stillUsed =
        referencedInSource(from) ||
        DATA_FILES.some(
          (relative) =>
            fs.existsSync(path.join(ROOT, relative)) &&
            fs.readFileSync(path.join(ROOT, relative), "utf8").includes(`"${from}"`),
        );
      if (!stillUsed && fs.existsSync(full)) {
        freed += fs.statSync(full).size;
        fs.unlinkSync(full);
      }
    }
    console.log(`Originaux supprimes: ${(freed / 1048576).toFixed(1)} Mo`);
  }
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(
  WRITE
    ? `${count} images converties — ${mb(before)} Mo -> ${mb(after)} Mo`
    : `${count} images a convertir (${mb(before)} Mo). Relancer avec --write.`,
);
