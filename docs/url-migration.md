# Migration URL — préparation du 24 octobre 2026

Branche prepare-migration-seo. Base production 76f6119. Aucun DNS modifié, aucune fusion.

Inventaire : sitemap.xml, sitemap.website.xml et liens internes des six pages publiques actuelles (racine incluse) de www.lafabric.ca, lus le 24 octobre. Sans export Search Console ni journaux GoDaddy, des URL historiques non liées peuvent manquer.

| Ancienne URL (chemin) | Future URL sur https://www.lafabric.ca | Résultat |
| --- | --- | --- |
| / | / | 200 conservée |
| /accueil | / | 308 |
| /réalisations (encodée /r%C3%A9alisations) | /realisations | 308 |
| /resurfaçage (encodée /resurfa%C3%A7age) | /resurfacage | 308 |
| /historique-1 | /a-propos | 308 |
| /contact | /#contact | 308 vers la section contact |
| /sitemap.website.xml | /sitemap.xml | 308 |
| /en/contact | /en#contact | 308 |
| /fr/contact | /#contact | 308 |

Les URL anglaises existantes du nouveau site sont conservées. Aucune ancienne page identifiée n'est supprimée sans équivalent. Une URL inconnue reçoit une véritable 404 bilingue, sans redirection générique. Aucun 410 ajouté sans preuve d'une suppression définitive.

## Correctifs supplémentaires
- Domaines canonical, sitemap, robots et données structurées fixés à https://www.lafabric.ca ; aucun domaine temporaire provenant d'une variable publique.
- X-Robots-Tag noindex, follow pour les hôtes autres que www.lafabric.ca. Robots permet l'exploration afin que les robots puissent lire noindex.
- Redirection permanente lafabric.ca vers www ; anciennes URL sur lafabric.ca directement vers la destination finale www.
- Français par défaut indépendamment de la langue du navigateur ; anglais via /en.
- Hreflang fr-CA, en-CA et x-default français ; suppression des en-têtes alternates next-intl qui utilisaient le domaine de prévisualisation.
- Titres, descriptions, photos services et sitemap déjà corrigés dans 76f6119 conservés.

## Validation et limites
Build et lint réussis. Script scripts/verify-migration.py : 54 pages 200, un h1 chacune, meta robots sans noindex, en-tête HTTP noindex en test ; sept redirections 308 ; deux 404 ; politique par hôte ; langue française même avec Accept-Language anglais.
Les tests locaux utilisent le build de production en environnement isolé. Le certificat, les DNS Web réels et la redirection HTTP vers HTTPS chez Vercel ne sont pas modifiés ou simulés comme acquis.
Contact : expéditeur configuré lors de l'étape précédente, mais livraison aux deux destinataires encore à confirmer après validation Resend.
Restent : export des anciennes URL Search Console/journaux, performances mobiles mesurées, test final des formulaires, vérification de la configuration de domaine Vercel au lancement. Aucun outil ne peut garantir l'absence de fluctuation SEO.
