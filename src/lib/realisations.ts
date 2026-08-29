import realisationsData from "@/data/realisations.json";

export type ProjectCategory =
  | "cuisine"
  | "salle-de-bain"
  | "mobilier-integre"
  | "resurfacage"
  | "residential";

export type RealisationImage = {
  src: string;
  filename: string;
  alt: string;
  category: ProjectCategory | null;
  order: number;
};

export type BeforeAfterPair = {
  before: string;
  after: string;
  enabled: boolean;
};

export type RealisationProject = {
  slug: string;
  title: string;
  description?: string | null;
  category: ProjectCategory;
  cover: string;
  imageCount: number;
  images: RealisationImage[];
  beforeAfterPairs: BeforeAfterPair[];
};

export type RealisationsData = {
  generatedAt: string;
  projectCount: number;
  imageCount: number;
  projects: RealisationProject[];
};

const data = realisationsData as RealisationsData;

export const realisations = data.projects;

export const projectCategories: ProjectCategory[] = [
  "cuisine",
  "salle-de-bain",
  "mobilier-integre",
  "resurfacage",
  "residential",
];

export function getProjectBySlug(slug: string): RealisationProject | undefined {
  return realisations.find((project) => project.slug === slug);
}

export function getProjectsByCategory(
  category: ProjectCategory | "all",
): RealisationProject[] {
  if (category === "all") return realisations;
  return realisations.filter((project) => project.category === category);
}

const featuredProjectSlugs = [
  "entre-4-murs-projet-takacsy",
  "mu-architecture-l-albatros",
  "yh2-maison-aube",
] as const;

export function getFeaturedProjects(): RealisationProject[] {
  return featuredProjectSlugs.flatMap((slug) => {
    const project = getProjectBySlug(slug);
    return project ? [project] : [];
  });
}

export function groupImagesByCategory(images: RealisationImage[]) {
  const groups = new Map<ProjectCategory | "other", RealisationImage[]>();

  for (const image of images) {
    const key = image.category ?? "other";
    const current = groups.get(key) ?? [];
    current.push(image);
    groups.set(key, current);
  }

  return groups;
}
