// Shared regional focus; projects elsewhere are considered individually.
// Do not publish a separate Montréal service area for either company.
export function serviceAreas(locale: string) {
  return [{ "@type": "AdministrativeArea", name: locale === "en" ? "Laurentians" : "Laurentides" }];
}
