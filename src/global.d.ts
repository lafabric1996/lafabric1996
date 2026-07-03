import type messages from "@/messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: "fr" | "en";
    Messages: typeof messages;
  }
}
