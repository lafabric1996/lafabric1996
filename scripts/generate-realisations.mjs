import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.resolve(ROOT, "..", "content", "photos");
const PUBLIC_DIR = path.join(ROOT, "public", "realisations");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "realisations.json");

const WEB_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const COVER_EXTENSION_ORDER = [".jpg", ".jpeg", ".png", ".webp"];

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectImageCategory(filename) {
  const name = normalizeName(path.parse(filename).name);

  if (/resurfac|refacing/.test(name)) return "resurfacage";
  if (/cuisine/.test(name)) return "cuisine";
  if (/salle.?de.?bain|vanite|bathroom/.test(name)) return "salle-de-bain";
  if (/bureau|chambre|salon|entree|passage|lits|mobilier/.test(name)) {
    return "mobilier-integre";
  }

  return null;
}

function detectProjectCategory(images) {
  const categories = images
    .map((image) => image.category)
    .filter(Boolean);

  if (categories.length === 0) return "residential";

  const counts = new Map();
  for (const category of categories) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [topCategory, topCount] = sorted[0];

  if (sorted.length === 1) return topCategory;
  if (topCount >= categories.length * 0.5) return topCategory;

  return "residential";
}

function isDuplicateCopy(filename, allFiles) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const duplicateMarker = " (1)";

  if (base.endsWith(duplicateMarker)) {
    const original = `${base.slice(0, -duplicateMarker.length)}${ext}`;
    return allFiles.some((file) => file === original);
  }

  return false;
}

function hasRasterAlternative(filename, allFiles) {
  const ext = path.extname(filename).toLowerCase();
  if (ext !== ".heic") return false;

  const stem = path.basename(filename, ext);
  return allFiles.some((file) => {
    const fileExt = path.extname(file).toLowerCase();
    return (
      WEB_EXTENSIONS.has(fileExt) &&
      path.basename(file, fileExt).toLowerCase() === stem.toLowerCase()
    );
  });
}

function sortImages(a, b) {
  const rank = (filename) => {
    const name = normalizeName(path.parse(filename).name);
    if (name === "cuisine") return 0;
    if (name.startsWith("cuisine")) return 1;
    if (name.includes("salle de bain") || name.includes("vanite")) return 2;
    return 3;
  };

  const rankDiff = rank(a) - rank(b);
  if (rankDiff !== 0) return rankDiff;

  return a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" });
}

function detectBeforeAfterPairs(images) {
  const pairs = [];
  const byStem = new Map();

  for (const image of images) {
    const stem = path.parse(image.filename).name;
    const match = stem.match(/^(Boisclair)(HR)?_CLavallee-(\d+)$/i);
    if (!match) continue;

    const [, prefix, hrMarker, index] = match;
    const key = `${prefix.toLowerCase()}-${index}`;
    const entry = byStem.get(key) ?? {};
    if (hrMarker) entry.after = image.src;
    else entry.before = image.src;
    byStem.set(key, entry);
  }

  for (const entry of byStem.values()) {
    if (entry.before && entry.after) {
      pairs.push({
        before: entry.before,
        after: entry.after,
        enabled: false,
      });
    }
  }

  return pairs;
}

function isCoverFile(filename) {
  return normalizeName(path.parse(filename).name) === "cover";
}

function selectCoverFile(files) {
  const covers = files.filter((file) => isCoverFile(file.filename));
  if (covers.length === 0) return null;

  return covers.sort((a, b) => {
    const depthA = a.relativePath.split(path.sep).length;
    const depthB = b.relativePath.split(path.sep).length;
    if (depthA !== depthB) return depthA - depthB;

    const extA = path.extname(a.filename).toLowerCase();
    const extB = path.extname(b.filename).toLowerCase();
    return (
      COVER_EXTENSION_ORDER.indexOf(extA) - COVER_EXTENSION_ORDER.indexOf(extB)
    );
  })[0];
}

function collectProjectFiles(projectDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) continue;

      files.push({
        filename: entry.name,
        relativePath: path.relative(projectDir, absolutePath),
        absolutePath,
      });
    }
  }

  walk(projectDir);
  return files;
}

function filterUsableFiles(fileEntries) {
  const byDir = new Map();

  for (const file of fileEntries) {
    const dir = path.dirname(file.absolutePath);
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push(file);
  }

  const usable = [];

  for (const filesInDir of byDir.values()) {
    const rawNames = filesInDir.map((file) => file.filename);

    for (const file of filesInDir) {
      const extension = path.extname(file.filename).toLowerCase();
      if (!WEB_EXTENSIONS.has(extension)) continue;
      if (isDuplicateCopy(file.filename, rawNames)) continue;
      if (hasRasterAlternative(file.filename, rawNames)) continue;
      usable.push(file);
    }
  }

  return usable;
}

function buildPublicFilename(file) {
  if (isCoverFile(file.filename)) {
    return `cover${path.extname(file.filename).toLowerCase()}`;
  }

  const flattened = file.relativePath.split(path.sep).join("-");
  return sanitizePublicFilename(flattened);
}

function sanitizePublicFilename(filename) {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-");
}

function copyProjectImage(file, targetDir, slug, folderName, order) {
  const safeName = buildPublicFilename(file);
  const targetPath = path.join(targetDir, safeName);
  fs.copyFileSync(file.absolutePath, targetPath);

  return {
    src: `/realisations/${slug}/${safeName}`,
    filename: file.filename,
    alt: folderName,
    category: detectImageCategory(file.filename),
    order,
  };
}

function collectProjects() {
  if (!fs.existsSync(CONTENT_DIR)) {
    throw new Error(`Content directory not found: ${CONTENT_DIR}`);
  }

  const projectDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "fr"));

  const projects = [];

  for (const folderName of projectDirs) {
    const sourceDir = path.join(CONTENT_DIR, folderName);
    const slug = slugify(folderName);
    const targetDir = path.join(PUBLIC_DIR, slug);

    const projectFiles = collectProjectFiles(sourceDir);
    const usableFiles = filterUsableFiles(projectFiles);

    if (usableFiles.length === 0) continue;

    fs.mkdirSync(targetDir, { recursive: true });

    const coverFile = selectCoverFile(usableFiles);
    const galleryFiles = usableFiles
      .filter((file) => file !== coverFile)
      .sort((a, b) => sortImages(a.filename, b.filename));

    let coverImage;
    let galleryImages;

    if (coverFile) {
      coverImage = copyProjectImage(coverFile, targetDir, slug, folderName, 0);
      galleryImages = galleryFiles.map((file, index) =>
        copyProjectImage(file, targetDir, slug, folderName, index + 1),
      );
    } else {
      const sortedFiles = [...usableFiles].sort((a, b) =>
        sortImages(a.filename, b.filename),
      );
      coverImage = copyProjectImage(
        sortedFiles[0],
        targetDir,
        slug,
        folderName,
        0,
      );
      galleryImages = sortedFiles
        .slice(1)
        .map((file, index) =>
          copyProjectImage(file, targetDir, slug, folderName, index + 1),
        );
    }

    const beforeAfterPairs = detectBeforeAfterPairs(galleryImages);
    const category = detectProjectCategory([coverImage, ...galleryImages]);

    projects.push({
      slug,
      title: folderName,
      category,
      cover: coverImage.src,
      imageCount: 1 + galleryImages.length,
      images: galleryImages,
      beforeAfterPairs,
    });
  }

  return projects;
}

function main() {
  if (fs.existsSync(PUBLIC_DIR)) {
    fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  }

  const projects = collectProjects();
  const payload = {
    generatedAt: new Date().toISOString(),
    projectCount: projects.length,
    imageCount: projects.reduce((total, project) => total + project.imageCount, 0),
    projects,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `Generated ${payload.projectCount} projects (${payload.imageCount} images)`,
  );

  const coverChecks = projects.map((project) => {
    const coverBasename = path.basename(project.cover);
    return {
      slug: project.slug,
      cover: coverBasename,
      usesNamedCover: /^cover\.(jpg|jpeg|png|webp)$/i.test(coverBasename),
    };
  });

  const namedCoverCount = coverChecks.filter((item) => item.usesNamedCover).length;
  console.log(`Cover files used: ${namedCoverCount}/${projects.length}`);

  for (const item of coverChecks) {
    console.log(
      `${item.usesNamedCover ? "✓" : "○"} ${item.slug} → ${item.cover}`,
    );
  }
}

main();
