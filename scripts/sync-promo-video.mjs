import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.resolve(ROOT, "..", "content");
const PUBLIC_VIDEO_DIR = path.join(ROOT, "public", "videos");
const OUTPUT_FILE = path.join(ROOT, "src", "data", "promo-video.json");
const PUBLIC_FILENAME = "marie-mai";
const POSTER_BASENAME = "marie-mai-poster";

const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v"]);
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const POSTER_FILENAMES = [
  "marie-mai-poster",
  "poster",
  "thumbnail",
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

function scoreVideoCandidate(candidate) {
  const normalized = candidate.relativePath.toLowerCase();
  let score = 0;

  if (normalized.includes("marie")) score += 100;
  if (normalized.includes("promo")) score += 50;
  if (normalized.includes("video")) score += 25;
  if (normalized.startsWith(`videos${path.sep}`)) score += 40;
  if (!normalized.includes(`${path.sep}photos${path.sep}`)) score += 10;

  return score;
}

function selectVideo(candidates) {
  if (candidates.length === 0) return null;
  return [...candidates].sort((a, b) => scoreVideoCandidate(b) - scoreVideoCandidate(a))[0];
}

function findManualPoster() {
  const searchDirs = [
    CONTENT_DIR,
    path.join(CONTENT_DIR, "videos"),
  ];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    for (const basename of POSTER_FILENAMES) {
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

function getExistingPublicPoster() {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return null;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    if (!file.startsWith(`${POSTER_BASENAME}.`)) continue;
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

function syncPoster(publicPosterBasename) {
  const manualPoster = findManualPoster();

  if (manualPoster) {
    const publicName = `${publicPosterBasename}${manualPoster.extension}`;
    const publicPath = path.join(PUBLIC_VIDEO_DIR, publicName);
    fs.copyFileSync(manualPoster.absolutePath, publicPath);
    return {
      posterSrc: `/videos/${publicName}`,
      posterSource: manualPoster.relativePath.split(path.sep).join("/"),
      posterMethod: "manual",
      publicName,
    };
  }

  const existingPoster = getExistingPublicPoster();
  if (existingPoster) {
    return {
      posterSrc: `/videos/${existingPoster.publicName}`,
      posterSource: null,
      posterMethod: "existing",
      publicName: existingPoster.publicName,
    };
  }

  return {
    posterSrc: null,
    posterSource: null,
    posterMethod: null,
    publicName: null,
  };
}

function writeMetadata(payload) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function cleanupPublicVideo() {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    const extension = path.extname(file).toLowerCase();
    if (file.startsWith(`${PUBLIC_FILENAME}.`) && VIDEO_EXTENSIONS.has(extension)) {
      fs.unlinkSync(path.join(PUBLIC_VIDEO_DIR, file));
    }
  }
}

function cleanupPublicPosters(keepPublicName) {
  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) return;

  for (const file of fs.readdirSync(PUBLIC_VIDEO_DIR)) {
    if (!file.startsWith(`${POSTER_BASENAME}.`)) continue;
    if (file === keepPublicName) continue;
    fs.unlinkSync(path.join(PUBLIC_VIDEO_DIR, file));
  }
}

function main() {
  const candidates = walkVideos(CONTENT_DIR);
  const selected = selectVideo(candidates);

  if (!selected) {
    const existingVideo = fs.existsSync(PUBLIC_VIDEO_DIR)
      ? fs.readdirSync(PUBLIC_VIDEO_DIR).find(
          (file) =>
            file.startsWith(`${PUBLIC_FILENAME}.`) &&
            VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()),
        )
      : null;

    if (!existingVideo) {
      writeMetadata({
        available: false,
        src: null,
        posterSrc: null,
        sourceFile: null,
        posterSource: null,
        extension: null,
        posterMethod: null,
        syncedAt: new Date().toISOString(),
      });
      console.warn(
        "No promotional video found in content/. Add a .mp4, .mov, .webm or .m4v file and re-run.",
      );
      return;
    }

    const poster = syncPoster(POSTER_BASENAME);
    if (poster.publicName) cleanupPublicPosters(poster.publicName);

    writeMetadata({
      available: true,
      src: `/videos/${existingVideo}`,
      posterSrc: poster.posterSrc,
      sourceFile: null,
      posterSource: poster.posterSource,
      extension: path.extname(existingVideo).toLowerCase(),
      posterMethod: poster.posterMethod,
      syncedAt: new Date().toISOString(),
    });
    console.log(`No source video in content — using existing public file: ${existingVideo}`);
    if (!poster.posterSrc) {
      console.warn("No manual poster found. Add content/marie-mai-poster.jpg and re-run.");
    }
    return;
  }

  fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });
  cleanupPublicVideo();

  const publicName = `${PUBLIC_FILENAME}${selected.extension}`;
  const publicPath = path.join(PUBLIC_VIDEO_DIR, publicName);

  fs.copyFileSync(selected.absolutePath, publicPath);
  const poster = syncPoster(POSTER_BASENAME);
  if (poster.publicName) cleanupPublicPosters(poster.publicName);

  writeMetadata({
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
  console.log(`Synced promo video: ${selected.relativePath} → public/videos/${publicName} (${sizeMb} MB)`);
  if (poster.posterSrc) {
    console.log(`Poster synced (${poster.posterMethod}) → public/videos/${poster.publicName}`);
  } else {
    console.warn(
      "No manual poster found. Add content/marie-mai-poster.jpg (or .png) and re-run sync:video.",
    );
  }
}

main();
