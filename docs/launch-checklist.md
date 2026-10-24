# Publication de lafabric.ca

État au 24 octobre 2026. Ce document ne vaut pas autorisation de modifier les DNS.

## Périmètre

- Projet Vercel : lafabric1996 (prj_820sNoHWmoaXQBgXJmbgBjyXzbub).
- Dépôt : lafabric1996/lafabric1996 ; branche main.
- Adresse principale prévue : https://www.lafabric.ca ; redirection permanente de l'apex vers www.
- Domaine et messagerie restent chez leurs fournisseurs actuels.
- Ne pas modifier les serveurs de noms, MX, SPF, DKIM, DMARC, autodiscover ou validations Google existantes. Ne résilier aucun service.

## Conditions avant bascule

1. Déploiement READY du commit approuvé, contrôles FR/EN, redirections et formulaire réussis.
2. Domaine d'expédition Resend vérifié ; CONTACT_FROM_EMAIL configurée en production avec une adresse de ce domaine. La valeur de test onboarding@resend.dev n'est pas adaptée à l'envoi à info ET louis.
3. Envois tests ébénisterie et resurfaçage, puis confirmation de réception par les destinataires. Une réponse HTTP positive ne prouve pas la réception.
4. Export intégral de la zone DNS GoDaddy, avec valeurs et TTL, conservé avant changement.
5. Vérification du forfait Vercel approprié à l'usage commercial, sans activation payante non autorisée.
6. Présentation des changements exacts A/CNAME recommandés par Vercel pour CE projet et approbation explicite de François.

## Repères publics observés, à reconfirmer dans GoDaddy

- A @ : 13.248.243.5 et 76.223.105.230.
- CNAME www : lafabric.ca.
- NS : ns23.domaincontrol.com et ns24.domaincontrol.com.
- MX : 0 lafabric-ca.mail.protection.outlook.com.
- SPF : v=spf1 include:spf.protection.outlook.com -all.
- Cinq validations Google TXT présentes. Ceci n'est pas une sauvegarde complète de la zone.

## Bascule et surveillance

Après approbation, connecter les deux domaines au bon projet, modifier uniquement les enregistrements Web nécessaires et vérifier DNS, HTTPS, certificat, canonical, robots, sitemap et formulaires. Contrôler les anciennes URL sur le domaine final. Soumettre le sitemap à Search Console avec le compte propriétaire. Vérifier GA4 G-H3XMDY9CM0 après consentement ; les visites sur vercel.app ne sont pas envoyées à cette propriété.

## Retour arrière

Si une panne importante est confirmée après le changement, restaurer uniquement les A/CNAME Web et leurs TTL depuis l'export validé. Ne toucher à aucun enregistrement de messagerie. Garder l'ancien hébergement GoDaddy actif pendant la validation. La propagation DNS peut retarder le retour pour certains visiteurs ; contrôler plusieurs résolveurs puis HTTPS et l'ancien site.

Pour un défaut de code sur l'adresse temporaire, un déploiement Vercel antérieur peut être remis en production. Référence avant corrections : commit 37419ae39c5ce1dad1d6ac022cfe13e9f377deb6, déploiement dpl_6HbMVasri1aGFhHf2dBbvfgo8SpE. Ne pas rétablir ce code comme solution SEO définitive : il ne possède pas les redirections de migration.

## Limites restantes

- Core Web Vitals réels : à obtenir via PageSpeed/CrUX ou Search Console ; l'API PageSpeed a répondu 429 pendant l'audit.
- Les originaux haute résolution de la vidéo du héros et de certaines photos doivent être retrouvés avant toute amélioration réelle de leur définition. Ne pas remplacer les photos approuvées ni prétendre restaurer des détails absents.
- Le piège antispam et les limites de longueur du formulaire ne remplacent pas une limitation distribuée des envois.
