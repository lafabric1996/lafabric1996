# Mise en œuvre SEO — 25 octobre 2026

## Décisions confirmées par François

- Conserver « Jusqu’à deux fois moins cher » : comparaison avec une cuisine neuve, validée par l'entreprise sur cinq années d'activité en resurfaçage.
- Conserver la promesse de transformation rapide.
- Correction confirmée par François : un seul positionnement régional pour les deux entreprises. Établis dans les Laurentides; projets évalués selon leur nature et leur emplacement. Montréal n’est ni exclue ni annoncée comme marché ciblé.
- François a autorisé la finalisation, les vérifications et la publication après cette correction.

## Travail implémenté sur la branche

- Contenus, titres et descriptions FR/EN; guide resurfaçage (admissibilité, prix, matériaux, choix avec cuisine neuve).
- Cuisine centrée sur le neuf; liens entre services, réalisations et demande de projet.
- Présentation distincte des entreprises et téléphones; positionnement régional commun dans les textes et données structurées.
- Trois fiches enrichies et traduites : Albatros, Maison Aubé et La Luge. Source : descriptions existantes de src/data/project-descriptions.json dans le patch approuvé; aucune nouvelle réalisation, certification ou citation client inventée.
- Formulaire : municipalité requise, source déclarée facultative, présélection du service et référence du projet consulté.
- Courriel : société destinataire, référence unique, source déclarée et municipalité. Acheminement inchangé : info; info + louis pour le resurfaçage.
- Idempotence de l'envoi Resend pour une nouvelle tentative du même formulaire; aucun envoi réel pendant les tests locaux.
- GA4 : generate_lead uniquement après acceptation de l'envoi par Resend; contact_phone_click distinct. Consentement requis, hôtes de production seulement, aucune coordonnée client transmise par ces événements.
- Important : « accepté par Resend » n'est pas « reçu en boîte », ni « demande qualifiée », ni « contrat signé ». Ne pas marquer les clics téléphone comme demandes qualifiées.
- Aucun suivi Ads, import de conversions hors ligne ni connexion CRM inventé. La source déclarée ne remplace pas l'attribution numérique.

## Registre commercial

Un classeur séparé des sources du site comporte un onglet par entreprise et un bilan. Ne jamais ajouter de données clients dans GitHub. Une ligne par référence, exclure tests/doublons. Qualification, soumission et contrat restent des étapes distinctes. Pour les appels, créer une référence interne stable; ne pas dupliquer un formulaire du même projet.

## À la publication

1. Déployer la branche approuvée et vérifier les chemins FR/EN, mobile, images, canoniques et données structurées.
2. Faire un test réel clairement identifié pour chacun des deux services, puis confirmer la réception. Les tests locaux simulés ne remplacent pas cette étape.
3. Dans GA4 G-H3XMDY9CM0 : vérifier generate_lead dans DebugView/temps réel, désactiver le suivi automatique d'interactions de formulaire si celui-ci est également importé comme conversion, vérifier consentement et propriétés d'événement. Ne pas importer deux fois la même action dans Ads.
4. Si generate_lead est retenu comme événement clé, documenter le périmètre. Conserver contact_phone_click comme interaction secondaire. Un appel connecté/qualifié exige une preuve séparée.
5. Dans Search Console : valider sitemap, indexation, redirections, positions et clics organiques par page et appareil. Ne pas confondre anciennes pages de résultats mises en cache avec le HTML actuel.
6. Dans Ads : exporter les actions de conversion, règles de comptage, fenêtres d'attribution, dates/filtres des tableaux et requêtes intégrales. Réconcilier les divergences du rapport de septembre : 13 conversions globales, 10 dans les campagnes visibles; dépenses 865,66 $ vs 797,21 $ dans les lignes visibles.

## Feuille de route et responsabilité

| Échéance | Travail | Mesure | Dépendance |
|---|---|---|---|
| 0–30 jours | Publier les changements approuvés; vérifier réception et événement; commencer le registre | Demandes uniques et qualifiées par société, source et municipalité | Publication; accès Google |
| 31–60 jours | Exploiter les requêtes organiques; enrichir les projets selon dossiers réels; vérifier fiches locales | Clics organiques pertinents, soumissions, territoire | Search Console et données commerciales |
| 61–90 jours | Comparer les cohortes et corriger les points de friction; mesurer Core Web Vitals | Contrats, valeur signée, taux sur demandes qualifiées; coûts publicitaires séparés | Données suffisantes et périodes comparables |

Les bilans sont intégrés à l'audit professionnel existant : 24 novembre 2026, 24 décembre 2026 et 23 janvier 2027, après 9 h America/Toronto. Si publication retardée, distinguer délai calendaire et jours réellement mesurés; ne pas présenter 90 jours de résultats sans 90 jours de données. Aucun changement de budget sans décision fondée sur les résultats.

## Limites d'accès

GA4, Google Ads, Search Console et Google Business Profile non accessibles par les connecteurs actifs lors de cette intervention. Windsor.ai identifié comme connecteur disponible mais non installé; aucune installation ou dépense effectuée. Connexion par François ou exports requis pour réconcilier les chiffres, configurer les événements clés et vérifier l'indexation.

La création d'une tâche SEO séparée a atteint la limite de cinq tâches actives. Les trois jalons ont été ajoutés à l'audit professionnel existant sans changer sa cadence ni supprimer d'autres tâches.
