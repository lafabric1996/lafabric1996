// Territory confirmed by François on 2026-10-25. Montréal is refacing only.
export function serviceAreas(refacing: boolean, locale: string) {
  return [
    { "@type": "AdministrativeArea", name: locale === "en" ? "Laurentians" : "Laurentides" },
    ...(refacing ? [{ "@type": "City", name: "Montréal" }] : []),
  ];
}
