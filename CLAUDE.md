# CLAUDE.md · Sushi Thaï, site de commande en ligne

Ce fichier est le contexte permanent du projet. Lis-le en entier avant chaque tâche.

## Le projet

Site sur mesure pour **Sushi Thaï**, restaurant thaï et japonais à Argenteuil (depuis 2017), réalisé par Magar Développement.

Objectif : prendre les commandes à emporter et en livraison, payées en ligne et sans commission, avec un espace de gestion pour le comptoir. Le site remplace un mini-site générique (eatbu.com) et réduit la dépendance à Uber Eats et Deliveroo.

**Formule signée : Pro** [À CONFIRMER]. Construis le périmètre Pro, mais garde une architecture prête pour le Premium (fidélité, club, statistiques, édition de carte par le restaurant).

## Documents de référence (dans /docs)

| Fichier | Rôle |
|---|---|
| `docs/spec.md` | **Source de vérité** : règles métier, 88 fonctionnalités numérotées (V1, C1, O1…), 37 écrans, design system complet |
| `docs/maquette.html` | Maquette v1 (première version, conservée pour référence) |
| `maquette/` | **Maquette v2**, site statique de présentation au client (déployable tel quel sur Vercel). Design retravaillé dans l’esprit Tasty Crousty. C’est la référence visuelle : reproduis fidèlement le design, la mise en page, les textes et le ton. Panneau « Devis » pour changer de formule et activer ou couper chaque fonctionnalité |
| `seed/menu.json` | Carte complète (rubriques, plats, prix, options) pour le seed |
| `seed/settings.json` | Horaires, créneaux, livraison, remise du midi |

En cas de doute : `spec.md` > `maquette.html` > ce fichier. Si un point n’est couvert nulle part, pose la question au lieu d’inventer.

## Fonctionnalités activables

Le projet n’est pas encore vendu : la formule peut changer. Tout ce qui dépasse le socle Essentiel passe par `src/config/features.ts` (clés `delivery`, `wokBuilder`, `club`, `promoCodes`…), réglé par `SITE_PLAN`, `FEATURES_ON` et `FEATURES_OFF` dans l’environnement.

- Ne code jamais une fonctionnalité Pro, Premium ou option sans la conditionner à `isEnabled('clé')` (serveur) ou aux flags passés en props (client).
- Une fonctionnalité coupée ne laisse aucune trace à l’écran (ni lien, ni bloc vide) et ses routes API répondent 404.
- Les mêmes clés servent dans `maquette/app.js` : garde les deux listes alignées.

## Stack

- **Next.js 15** (App Router, React Server Components, TypeScript strict)
- **Payload CMS v3**, installé dans la même app Next.js (`/admin`)
- **PostgreSQL** via `@payloadcms/db-postgres` (Neon ou Vercel Postgres)
- **Stripe Checkout** + webhook pour le paiement en ligne
- **Resend** + React Email pour les e-mails transactionnels
- **Tailwind CSS v4** avec les tokens du design system en variables CSS
- **Zod** pour valider toutes les entrées (formulaires, API, webhook)
- Hébergement **Vercel**, images via `next/image`
- Gestionnaire de paquets : **pnpm**

Pas de WordPress, pas de constructeur de page, pas de librairie de composants lourde (pas de MUI, pas de Chakra). Composants maison.

## Arborescence cible

```
src/
  app/
    (site)/                 pages publiques
      page.tsx              accueil
      carte/page.tsx        carte et commande
      commande/[id]/page.tsx confirmation (et suivi en Premium)
      reserver/page.tsx
      infos/page.tsx
      mentions-legales/ confidentialite/ cgv/
    (restaurant)/restaurant/  espace de gestion du comptoir (auth Payload)
      page.tsx              commandes en direct
      historique/ reservations/ reglages/ disponibilites/
    (payload)/admin/        admin Payload
    api/
      checkout/route.ts     crée la commande + session Stripe
      stripe/webhook/route.ts
      orders/live/route.ts  flux des commandes pour le comptoir
  collections/              Categories, Products, Orders, Reservations, Users, Media
  globals/                  Settings (horaires, livraison, remise, pause)
  components/
    ui/                     Button, Pill, Badge, Marquee, Modal, Drawer, Toast…
    menu/                   ProductCard, ProductModal, WokBuilder, CategoryNav
    cart/                   CartProvider, CartDrawer, CartLine, Totals
    restaurant/             OrderBoard, OrderCard
  lib/
    pricing.ts              calcul du panier (fonction pure, testée)
    hours.ts                ouvert/fermé, créneaux (fonction pure, testée)
    delivery.ts             zones, frais
    stripe.ts  email.ts  format.ts
  emails/                   templates React Email
  styles/tokens.css
seed/  docs/
```

## Règles métier (résumé, détail dans spec.md §3)

- **Horaires** : définis dans le global Settings, en minutes depuis minuit. Statut ouvert/fermé calculé en direct, fuseau `Europe/Paris`.
- **Créneaux** : pas de 15 min. Premier créneau = maintenant + délai de préparation (+ délai de livraison en livraison). Dernier créneau = 15 min avant la fermeture. Restaurant fermé : on propose le prochain service.
- **Pause des commandes** : un booléen dans Settings coupe la commande en ligne immédiatement.
- **Livraison** : zone déterminée par la ville puis vérifiée par le code postal. Offerte à partir du seuil de la zone, sinon frais de la zone. Hors zone : refus avec proposition de passer en « à emporter ».
- **Remise du midi** : −10 % sur le sous-total, à emporter uniquement, créneau du service du midi uniquement, sous-total ≥ 16 €.
- **Compose ton wok** : 10 €, 5 étapes (1 base, 1 protéine, jusqu’à 3 légumes, 1 sauce, 1 topping) + suppléments payants.
- **Options** : chaque produit a des groupes d’options (un choix ou plusieurs, obligatoire ou non, maximum, supplément par choix).
- **Plat épuisé** : visible, non commandable.

### Calcul des prix : règle absolue

- **Le serveur recalcule toujours le total** à partir de la base. Ne jamais faire confiance à un prix envoyé par le navigateur.
- Tous les montants sont stockés et calculés **en centimes (entiers)**. Conversion en euros seulement à l’affichage.
- `lib/pricing.ts` est une fonction pure partagée client et serveur, couverte par des tests (Vitest).

### Commandes et paiement

1. `POST /api/checkout` : validation Zod, recalcul, vérification des horaires, de la zone et du créneau, création de la commande en statut `pending_payment` (ou `new` si paiement sur place).
2. Paiement en ligne : création d’une session Stripe Checkout, redirection.
3. Webhook `checkout.session.completed` : signature vérifiée, commande passée en `new` et `paid: true`, e-mails envoyés. Le webhook doit être idempotent.
4. Statuts : `pending_payment`, `new`, `preparing`, `ready`, `completed`, `cancelled`.
5. Numéro de commande court et lisible (ex. 101, 102…), distinct de l’ID.

### Espace restaurant

- Protégé par l’authentification Payload (rôle `staff` ou `admin`).
- Écran des commandes en direct : rafraîchissement toutes les 5 s (polling) ou SSE, **alerte sonore** à chaque nouvelle commande, colonnes Nouvelles / En préparation / Prêtes.
- Doit être utilisable sur une tablette posée au comptoir : gros boutons, lisible de loin.

## Design system (détail dans spec.md §6)

Reproduis la maquette. Points non négociables :

- Fond `#0D0A0D` avec motif de briques SVG fixe, magenta de marque `#E5087F`, magenta clair `#FF3FA4`, blanc.
- Polices Google : **Baloo 2** 800 (logo, hero, téléphone), **Londrina Solid** 900/400 en majuscules (titres, boutons, onglets), **Yellowtail** (badges script « Signature »), **Nunito Sans** (texte). Charge-les avec `next/font/google`.
- Noms de plats dans des étiquettes blanches, visuels ronds avec halo magenta, prix de rubrique en bloc magenta (`10€90`).
- Bandeaux défilants inclinés, bouton « Je commande 🔥 » fixe en bas sur mobile.
- Mobile d’abord. Animations coupées si `prefers-reduced-motion`.
- Le site reste sombre dans tous les cas (c’est la charte du restaurant).

Mets tous les tokens dans `styles/tokens.css` et branche-les sur Tailwind v4 (`@theme`). Aucune couleur en dur dans les composants.

## Ton et textes

- **Tutoiement** sur tout le site (« Compose ton wok », « Je commande », « Une fois que t’as goûté, tu reviens »).
- Vouvoiement dans les pages légales et les e-mails transactionnels [À CONFIRMER].
- Typographie française : apostrophe ’, guillemets « », espace insécable avant : ; ? ! et avant €.
- **Jamais de tiret cadratin (—)** dans les textes affichés.
- Aucun chiffre ni avis inventé.
- Les points marqués [À CONFIRMER] dans les docs restent configurables (Settings) ou signalés par un `// TODO(client):`.

## Qualité

- TypeScript strict, pas de `any`.
- Tests Vitest pour `pricing.ts`, `hours.ts`, `delivery.ts` (cas limites : minuit, samedi midi fermé, seuil exact de 15 € et 16 €, hors zone).
- Accessibilité : focus visible, fenêtres fermables avec Échap, `aria-label` sur les boutons d’icône, contraste correct.
- Performance : images optimisées, pas de librairie inutile, Lighthouse mobile ≥ 90.
- SEO : métadonnées par page, données structurées `Restaurant` et `Menu`, `sitemap.xml`, `robots.txt`.
- Variables d’environnement documentées dans `.env.example`, jamais de secret dans le code.

## Façon de travailler

- Avance **phase par phase** (voir `PROMPTS.md`). Ne commence pas la phase suivante sans validation.
- Avant de coder une phase : annonce le plan en quelques lignes (fichiers créés ou modifiés).
- Après chaque phase : `pnpm lint`, `pnpm typecheck`, `pnpm test`, puis un résumé de ce qui a été fait et de ce qui reste.
- Petits commits clairs, en français (`feat: panier et calcul des totaux`).
- Si une info manque (prix, horaire, texte), mets une valeur configurable et signale-la, ne bloque pas.

## Commandes

```
pnpm dev          serveur local
pnpm build        build de production
pnpm lint         ESLint
pnpm typecheck    tsc --noEmit
pnpm test         Vitest
pnpm seed         import de seed/menu.json et seed/settings.json
```
