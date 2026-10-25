/**
 * Parutions et reconnaissances liées aux projets fabriqués par La Fab'ric.
 *
 * Les prix sont remis aux projets et aux bureaux d'architecture, pas à
 * La Fab'ric. Les textes de la page le disent explicitement : il ne faut
 * jamais laisser croire que l'entreprise a reçu le prix elle-même.
 *
 * Noms de publications et de projets : noms propres, identiques en français
 * et en anglais, donc volontairement hors des fichiers de traduction.
 *
 * À compléter : la date de parution de chaque article. Les années ci-dessous
 * sont celles de l'achèvement du projet, telles que publiées par les revues.
 */

export type PressProject = {
  slug: string;
  name: string;
  architect: string;
  year: string;
};

export type PressMention = {
  publication: string;
  url: string;
  projectSlug: string;
};

export type Award = {
  year: string;
  organisation: string;
  organisationUrl: string;
  projectSlug: string;
};

export const pressProjects: PressProject[] = [
  {
    slug: "yh2-maison-aube",
    name: "Maison Aubé",
    architect: "yh2 — Yiacouvakis Hamelin Architectes",
    year: "2025",
  },
  {
    slug: "mu-architecture-l-albatros",
    name: "L'Albatros",
    architect: "Mu Architecture",
    year: "2024",
  },
  {
    slug: "yh2-la-luge",
    name: "La Luge",
    architect: "yh2 — Yiacouvakis Hamelin Architectes",
    year: "2011",
  },
];

/** Vérifié sur oaq.com/laureats2026 et sur Canadian Architect. */
export const awards: Award[] = [
  {
    year: "2026",
    organisation: "Ordre des architectes du Québec",
    organisationUrl: "https://www.oaq.com/laureats2026/",
    projectSlug: "yh2-maison-aube",
  },
];

export const pressMentions: PressMention[] = [
  {
    publication: "ArchDaily",
    url: "https://www.archdaily.com/1039135/maison-aube-yh2-architecture",
    projectSlug: "yh2-maison-aube",
  },
  {
    publication: "Archiscene",
    url: "https://www.archiscene.net/residential/maison-aube-by-yh2/",
    projectSlug: "yh2-maison-aube",
  },
  {
    publication: "e-architect",
    url: "https://www.e-architect.com/canada/the-albatross-house-la-conception-quebec",
    projectSlug: "mu-architecture-l-albatros",
  },
  {
    publication: "ADF Web Magazine",
    url: "https://www.adfwebmagazine.jp/en/architect/lakeside-residence-in-quebec-by-mu-architecture-the-albatross/",
    projectSlug: "mu-architecture-l-albatros",
  },
  {
    publication: "Contemporist",
    url: "https://www.contemporist.com/this-mountain-home-in-canada-was-designed-like-a-bird-in-flight/",
    projectSlug: "mu-architecture-l-albatros",
  },
  {
    publication: "Westmount Magazine",
    url: "https://www.westmountmag.ca/residence-albatros/",
    projectSlug: "mu-architecture-l-albatros",
  },
  {
    publication: "Forma",
    url: "https://www.formathemagazine.com/article/the-albatross-a-modern-marvel-in-the-laurentians",
    projectSlug: "mu-architecture-l-albatros",
  },
  {
    publication: "ArchDaily",
    url: "https://www.archdaily.com/275993/la-luge-yh2-architecture",
    projectSlug: "yh2-la-luge",
  },
  {
    publication: "Archello",
    url: "https://archello.com/project/la-luge",
    projectSlug: "yh2-la-luge",
  },
  {
    publication: "Gessato",
    url: "https://www.gessato.com/la-luge-by-yh2-architecture/",
    projectSlug: "yh2-la-luge",
  },
];

export function getPressProject(slug: string): PressProject | undefined {
  return pressProjects.find((project) => project.slug === slug);
}
