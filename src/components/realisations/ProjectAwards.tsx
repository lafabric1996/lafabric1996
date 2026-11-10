import { getLocale, getTranslations } from "next-intl/server";
import { awards } from "@/lib/press";
import { asLocale } from "@/lib/i18n-server";
import { Section } from "@/components/ui/Section";

export async function ProjectAwards({ slug }: { slug: string }) {
  const projectAwards = awards.filter(award => award.projectSlug === slug);
  if (!projectAwards.length) return null;
  const locale = asLocale(await getLocale());
  const t = await getTranslations("maisonAube");
  return <Section variant="surface">
    <h2 className="font-display text-3xl tracking-tight md:text-4xl">{t("awardsTitle")}</h2>
    <p className="mt-5 max-w-3xl leading-relaxed text-muted">{t("attribution")}</p>
    <ul className="mt-10 grid gap-8 md:grid-cols-2">
      {projectAwards.map(award => <li key={award.id} className="border-t border-border pt-6">
        <h3 className="font-display text-2xl">{award.name[locale]}</h3>
        <p className="mt-3 text-sm text-muted">{award.organisation}</p>
        {award.category ? <p className="mt-2 text-sm leading-relaxed text-muted">{award.category[locale]}</p> : null}
        <a href={award.organisationUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm underline underline-offset-4 hover:text-wood">{t("source")}<span className="sr-only"> — {award.organisation}, {t("newTab")}</span> ↗</a>
      </li>)}
    </ul>
  </Section>;
}
