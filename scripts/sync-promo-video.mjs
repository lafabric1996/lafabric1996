import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.resolve(ROOT, "..", "content");
const PUBLIC_VIDEO_DIR = path.join(ROOT, "public", "videos");

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Chaque rôle correspond à un emplacement vidéo distinct sur le site.
// Pour ajouter une vidéo : déposez le fichier dans content/ (n'importe où,
// sauf dans content/photos) avec un des mots-clés dans son nom de fichier,
// puis lancez `npm run sync:video`.
const VIDEO_ROLES = [
  {
    name: "marie-mai",
    outputFile: path.join(ROOT, "src", "data", "promo-video.json"),
    publicFilename: "marie-mai",
    posterBasename: "marie-mai-poster",
    keywords: ["marie", "promo"],
    posterFilenames: ["marie-mai-poster", "poster", "thumbnail"],
    missingMessage:
      "Aucune vidéo Marie-Mai trouvée dans content/. Ajoutez un fichier .mp4, .mov, .webm ou .m4v (nom contenant « marie » ou « promo ») et relancez.",
  },
  {
    name: "hero",
    outputFile: path.join(ROOT, "src", "data", "hero-video.json"),
    publicFilename: "hero",
    posterBasename: "hero-poster",
    keywords: ["hero", "accueil", "principale"],
    posterFilenames: ["hero-poster", "accueil-poster", "poster", "thumbnail"],
    missingMessage:
      "Aucune vidéo d'accueil trouvée dans content/. Ajoutez un fichier .mp4, .mov, .webm ou .m4v (nom contenant « hero », « accueil » ou « principale ») et relancez.",
  },
];

function walkVideos(dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "photos") continue;
      walkVideos(absolutePath, results);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!VIDEO_EXTENSIONS.has(extension)) continue;

    results.push({
      absolutePath,
      relativePath: path.relative(CONTENT_DIR, absolutePath),
      filename: entry.name,
      extension,
    });
  }

  return results;
}

function scoreVideoCandidate(candidate, role) {
  const normalized = candidate.relativePath.toLowerCase();
  let score = 0;

  for (const keyword of role.keywords) {
    if (normalized.includes(keyword)) score += 50;
  }
  if (normalized.includes("video")) score += 25;
  if (normalized.startsWith(`videos${path.sep}`)) score += 10;
  if (!normalized.includes(`${path.sep}photos${path.sep}`)) score += 10;

  return score;
}

function selectVideo(candidates, role) {
  const scored = candidates
    .map((candidate) => ({ candidate, score: scoreVideoCandidate(candidate, role) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0].candidate : null;
}

function findManualPoster(role) {
  const searchDirs = [CONTENT_DIR, path.join(CONTENT_DIR, "videos")];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    for (const basename of role.posterFilenames) {
      for (const extension of IMAGE_EXTENSIONS) {
        const candidate = path.join(dir, `${basename}${extension}`);
        if (fs.existsSync(candidate)) {
          return {
            absolutePath: candidate,
            relativePath: path.relative(CONTENT_DIR, candidate),
            extension,
          };
        }
      }
    }
  }

  return null;
}

function getExistingPublicPoster(role) {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return null;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    if (!file.startsWith(`${role.posterBasename}.`)) continue;
    const extension = path.extname(file).toLowerCase();
    if (IMAGE_EXTENSIONS.includes(extension)) {
      return {
        publicName: file,
        publicPath: path.join(PUBLIC_VIDEO_DIR, file),
      };
    }
  }

  return null;
}

function syncPoster(role) {
  const manualPoster = findManualPoster(role);

  if (manualPoster) {
    const publicName = `${role.posterBasename}${manualPoster.extension}`;
    const publicPath = path.join(PUBLIC_VIDEO_DIR, publicName);
    fs.copyFileSync(manualPoster.absolutePath, publicPath);
    return {
      posterSrc: `/videos/${publicName}`,
      posterSource: manualPoster.relativePath.split(path.sep).join("/"),
      posterMethod: "manual",
      publicName,
    };
  }

  const existingPoster = getExistingPublicPoster(role);
  if (existingPoster) {
    return {
      posterSrc: `/videos/${existingPoster.publicName}`,
      posterSource: null,
      posterMethod: "existing",
      publicName: existingPoster.publicName,
    };
  }

  return { posterSrc: null, posterSource: null, posterMethod: null, publicName: null };
}

function writeMetadata(outputFile, payload) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function cleanupPublicVideo(role) {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    const extension = path.extname(file).toLowerCase();
    if (file.startsWith(`${role.publicFilename}.`) && VIDEO_EXTENSIONS.has(extension)) {
      fs.unlinkSync(path.join(PUBLIC_VIDEO_DIR, file));
    }
  }
}

function cleanupPublicPosters(role, keepPublicName) {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    if (!file.startsWith(`${role.posterBasename}.`)) continue;
    if (file === keepPublicName) continue;
    fs.unlinkSync(path.join(PUBLIC_VIDEO_DIR, file));
  }
}

function syncRole(role) {
  const candidates = walkVideos(CONTENT_DIR);
  const selected = selectVideo(candidates, role);

  if (!selected) {
    const existingVideo = fs.existsSync(PUBLIC_VIDEO_DIR)
      ? fs.readdirSync(PUBLIC_VIDEO_DIR).find(
          (file) =>
            file.startsWith(`${role.publicFilename}.`) &&
            VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()),
        )
      : null;

    if (!existingVideo) {
      writeMetadata(role.outputFile, {
        available: false,
        src: null,
        posterSrc: null,
        sourceFile: null,
        posterSource: null,
        extension: null,
        posterMethod: null,
        syncedAt: new Date().toISOString(),
      });
      console.warn(`[${role.name}] ${role.missingMessage}`);
      return;
    }

    const poster = syncPoster(role);
    if (poster.publicName) cleanupPublicPosters(role, poster.publicName);

    writeMetadata(role.outputFile, {
      available: true,
      src: `/videos/${existingVideo}`,
      posterSrc: poster.posterSrc,
      sourceFile: null,
      posterSource: poster.posterSource,
      extension: path.extname(existingVideo).toLowerCase(),
      posterMethod: poster.posterMethod,
      syncedAt: new Date().toISOString(),
    });
    console.log(`[${role.name}] No source video in content — using existing public file: ${existingVideo}`);
    if (!poster.posterSrc) {
      console.warn(`[${role.name}] No manual poster found. Add content/${role.posterBasename}.jpg and re-run.`);
    }
    return;
  }

  fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });
  cleanupPublicVideo(role);

  const publicName = `${role.publicFilename}${selected.extension}`;
  const publicPath = path.join(PUBLIC_VIDEO_DIR, publicName);

  fs.copyFileSync(selected.absolutePath, publicPath);
  const poster = syncPoster(role);
  if (poster.publicName) cleanupPublicPosters(role, poster.publicName);

  writeMetadata(role.outputFile, {
    available: true,
    src: `/videos/${publicName}`,
    posterSrc: poster.posterSrc,
    sourceFile: selected.relativePath.split(path.sep).join("/"),
    posterSource: poster.posterSource,
    extension: selected.extension,
    posterMethod: poster.posterMethod,
    syncedAt: new Date().toISOString(),
  });

  const sizeMb = (fs.statSync(publicPath).size / 1024 / 1024).toFixed(1);
  console.log(`[${role.name}] Synced: ${selected.relativePath} → public/videos/${publicName} (${sizeMb} MB)`);
  if (poster.posterSrc) {
    console.log(`[${role.name}] Poster synced (${poster.posterMethod}) → public/videos/${poster.publicName}`);
  } else {
    console.warn(
      `[${role.name}] No manual poster found. Add content/${role.posterBasename}.jpg (or .png) and re-run sync:video.`,
    );
  }
}

function main() {
  for (const role of VIDEO_ROLES) {
    syncRole(role);
  }
}

main();
