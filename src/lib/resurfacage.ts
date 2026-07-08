import resurfacageData from "@/data/resurfacage.json";

export type ResurfacagePair = {
  before: string;
  after: string;
};

export type ResurfacageProject = {
  slug: string;
  name: string;
  pairs: ResurfacagePair[];
};

type ResurfacageData = {
  generatedAt: string;
  projectCount: number;
  pairCount: number;
  projects: ResurfacageProject[];
};

const data = resurfacageData as ResurfacageData;

export function getResurfacageProjects(): ResurfacageProject[] {
  return data.projects;
}

export function getAllResurfacagePairs(): ResurfacagePair[] {
  return data.projects.flatMap((project) => project.pairs);
}
