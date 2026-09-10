import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

const proofKeys = ["founded", "rbq", "architects", "marieMai"] as const;

/**
 * Bande de repères vérifiables, juste sous le hero. Répond à la question
 * « puis-je leur faire confiance ? » avant que le visiteur ait à chercher.
 */
export async function ProofBar() {
  const t = await getTranslations("home.proof");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="border-b border-border bg-surface"
    >
      <Container className="py-6 lg:py-7">
        <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {proofKeys.map((key) => (
            <li
              key={key}
              className="flex items-baseline gap-2.5 text-sm leading-snug text-muted"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground"
              />
              {t(`items.${key}`)}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
