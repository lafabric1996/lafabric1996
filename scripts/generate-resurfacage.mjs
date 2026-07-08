import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Dossier source : les photos avant/après brutes par projet (jamais touché/supprimé par ce script)
const SOURCE_DIR = path.resolve(ROOT, "..", "content", "photos-resurfacage");
// Dossier de sortie généré : peut être vidé et régénéré sans risque à chaque run
const PUBLIC_DIR = path.resolve(ROOT, "public", "resurfacage");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "resurfacage.json");

const WEB_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value) {
  return normalizeName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isBeforeFolder(name) {
  const n = normalizeName(name);
  return n === "avant" || n === "before";
}

function isAfterFolder(name) {
  const n = normalizeName(name);
  return n === "apres" || n === "after";
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => WEB_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" }));
}

function deriveProjectName(folderName) {
  const stripped = folderName.replace(/\s*avant\s*apr[eè]s\s*$/i, "").trim();
  return titleCase(stripped || folderName);
}

function collectProjects() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Content directory not found: ${SOURCE_DIR}`);
  }

  const projectDirs = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "fr"));

  const projects = [];

  for (const folderName of projectDirs) {
    const projectDir = path.join(SOURCE_DIR, folderName);
    const subdirs = fs
      .readdirSync(projectDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory());

    const beforeDir = subdirs.find((entry) => isBeforeFolder(entry.name));
    const afterDir = subdirs.find((entry) => isAfterFolder(entry.name));
    if (!beforeDir || !afterDir) {
      console.warn(`⚠ ${folderName} : dossier Avant/ ou Après/ manquant, ignoré.`);
      continue;
    }

    const beforeFiles = listImages(path.join(projectDir, beforeDir.name));
    const afterFiles = listImages(path.join(projectDir, afterDir.name));
    const pairCount = Math.min(beforeFiles.length, afterFiles.length);
    if (pairCount === 0) continue;

    const projectName = deriveProjectName(folderName);
    const slug = slugify(projectName);
    const targetDir = path.join(PUBLIC_DIR, slug);
    fs.mkdirSync(targetDir, { recursive: true });

    const pairs = [];
    for (let i = 0; i < pairCount; i += 1) {
      const beforeFile = beforeFiles[i];
      const afterFile = afterFiles[i];
      const beforePublicName = `avant-${i + 1}${path.extname(beforeFile).toLowerCase()}`;
      const afterPublicName = `apres-${i + 1}${path.extname(afterFile).toLowerCase()}`;

      fs.copyFileSync(
        path.join(projectDir, beforeDir.name, beforeFile),
        path.join(targetDir, beforePublicName),
      );
      fs.copyFileSync(
        path.join(projectDir, afterDir.name, afterFile),
        path.join(targetDir, afterPublicName),
      );

      pairs.push({
        before: `/resurfacage/${slug}/${beforePublicName}`,
        after: `/resurfacage/${slug}/${afterPublicName}`,
      });
    }

    projects.push({
      slug,
      name: projectName,
      pairs,
    });
  }

  return projects;
}

function main() {
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const projects = collectProjects();
  const payload = {
    generatedAt: new Date().toISOString(),
    projectCount: projects.length,
    pairCount: projects.reduce((total, project) => total + project.pairs.length, 0),
    projects,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Generated ${payload.projectCount} projects (${payload.pairCount} paires avant/après)`,
  );
  for (const project of projects) {
    console.log(`✓ ${project.slug} → ${project.pairs.length} paires`);
  }
}

main();
