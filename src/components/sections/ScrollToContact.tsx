"use client";

import { useEffect } from "react";

/**
 * /contact redirige vers /#contact. Sur une navigation Next.js (App Router),
 * le défilement natif du navigateur vers l'ancre n'est pas garanti après une
 * redirection côté serveur suivie d'une transition client. On force donc le
 * défilement manuellement une fois la page d'accueil montée.
 */
export function ScrollToContact() {
  useEffect(() => {
    if (window.location.hash !== "#contact") return;

    const target = document.getElementById("contact");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return null;
}
