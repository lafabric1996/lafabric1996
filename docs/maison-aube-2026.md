# Maison Aubé — contenu et médias

Version préparée le 10 novembre 2026. Publication en production soumise à l'approbation de François.

## Sources et attribution

- Histoire, lieu et équipe : https://www.yh2architecture.com/fr/projets/maison-aube
- Prix OAQ : https://www.oaq.com/laureats2026/ et https://www.yh2architecture.com/fr/atelier/prix
- Prix MŌNUMA, catégorie Architecture — Résidentiel — Rénovation — 1 M$ et plus : https://monuma.ca/les-laureats/ et https://monuma.ca/projets/maison-aube/?fl=true
- Entrevue fournie par François : https://www.youtube.com/watch?v=egzuchDIRKs

Les prix distinguent le projet architectural de YH2, pas La Fab'ric. Les données structurées de cette fiche attribuent la création architecturale à YH2 et la contribution à La Fab'ric. Aucun prix n'est ajouté à la fiche de l'entreprise.

La fabrication en chêne blanc, la cuisine, les rangements, la tête de lit cannelée et les relevés sur place proviennent du brief de François et de l'étude de cas préexistante. Aucun assemblage, tolérance, procédé ou délai inédit n'est affirmé.

Réutilisation exclusive des photos déjà présentes et approuvées dans cette galerie. Aucun téléchargement de photo, logo ou vignette externe. Le photographe crédité par YH2 est Maxime Brouillet ; le libellé de crédit l'indique précisément et n'attribue pas les photos de chantier à ce photographe. Les 12 entrées de galerie et la couverture sont conservées, dans le même ordre. Le compteur historique de données indique 13 ; il n'est pas utilisé pour cette galerie et n'est pas modifié ici.

## Future vidéo promotionnelle

Le composant serveur `ProjectVideo` est branché sur la fiche Maison Aubé et l'accueil. Le registre `src/lib/project-videos.ts` est volontairement vide. Aucun lecteur, message d'attente, requête vidéo ou bloc vide n'est produit sans une entrée complète.

À réception de la vidéo autorisée :

1. Préparer un MP4 adapté au Web et une affiche optimisée, puis confirmer les crédits et les droits.
2. Ajouter l'entrée `yh2-maison-aube` dans `projectVideos` : `src`, `poster`, `title` et `credits` en FR/EN ; sous-titres WebVTT si la capsule comporte des paroles.
3. Garder `showOnHome: false` jusqu'à validation de sa pertinence sur l'accueil. Passer à `true` seulement après approbation.
4. Le lecteur natif utilise `controls`, `playsInline` et `preload="none"`, sans lecture automatique. Tester la lecture, le cadrage et les sous-titres sur téléphone.

L'entrevue YouTube reste un lien externe accessible, sans iframe, vignette distante ni chargement YouTube au simple affichage de la page. La capsule de Marie-Mai et le héros animé restent intacts.
