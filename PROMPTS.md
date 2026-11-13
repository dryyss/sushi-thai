# PROMPTS.md · À coller dans Cursor, dans l’ordre

Mode d’emploi
1. Mets tout le kit à la racine du projet (`CLAUDE.md`, `PROMPTS.md`, `docs/`, `seed/`).
2. Ouvre le chat Claude de Cursor en mode Agent.
3. Colle les prompts **un par un**. Teste, valide, commit, puis passe au suivant.
4. Si Claude dévie, rappelle-lui : « Relis CLAUDE.md et docs/spec.md ».

---

## Phase 0 · Prise de connaissance

```
Lis entièrement CLAUDE.md, docs/spec.md, seed/menu.json, seed/settings.json, puis ouvre docs/maquette.html.

Ne code rien pour l’instant. Réponds-moi avec :
1. Ton résumé du projet en 10 lignes maximum
2. La liste des collections Payload et du global Settings que tu proposes, avec leurs champs
3. Les points flous ou contradictoires que tu as repérés
4. Ton plan de phases si tu vois une meilleure organisation que PROMPTS.md
```

---

## Phase 1 · Installation

```
Phase 1 : installation du projet.

- Crée l’app Next.js 15 (App Router, TypeScript strict, ESLint, src/) avec pnpm
- Installe et configure Payload CMS v3 dans la même app, admin sur /admin, base PostgreSQL (@payloadcms/db-postgres)
- Installe Tailwind CSS v4, Zod, Vitest, Stripe, Resend, React Email
- Crée .env.example avec toutes les variables (DATABASE_URI, PAYLOAD_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, RESEND_API_KEY, EMAIL_FROM, RESTAURANT_EMAIL, NEXT_PUBLIC_SITE_URL)
- Ajoute les scripts : dev, build, lint, typecheck, test, seed
- Mets en place l’arborescence décrite dans CLAUDE.md (dossiers vides avec un index si besoin)

Critères : pnpm dev démarre, /admin permet de créer le premier utilisateur, pnpm typecheck et pnpm lint passent.
```

---

## Phase 2 · Design system

```
Phase 2 : design system, d’après docs/spec.md §6 et docs/maquette.html.

- styles/tokens.css : toutes les couleurs, rayons, ombres, branchés sur Tailwind v4 avec @theme
- Polices via next/font/google : Baloo 2 (700, 800), Londrina Solid (400, 900), Yellowtail, Nunito Sans
- Fond noir avec motif de briques SVG fixe (repris de la maquette)
- Composants dans components/ui : Button (primaire magenta, secondaire blanc), Pill (étiquette blanche), PriceTag (10€90 avec exposant), Badge (Signature en script, New), Marquee (bandeau défilant incliné, coupé si prefers-reduced-motion), Modal, Drawer, Toast, StatusDot
- Une page /styleguide (non indexée) qui affiche tous les composants

Critères : rendu identique à la maquette, aucune couleur en dur hors tokens.css, accessible au clavier.
```

---

## Phase 3 · Données : collections Payload et seed

```
Phase 3 : modèle de données.

Collections :
- Categories : nom, slug, ordre, sous-titre, priceTag, builder (bool), note interne
- Products : nom, slug, catégorie, prix en centimes, pièces, description, image (Media), badge (signature | new | aucun), featured, disponible (bool), repères (épicé, végétarien), allergènes, groupes d’options (array : nom, type one|multi, obligatoire, max, choix avec supplément en centimes)
- Orders : numéro court auto-incrémenté, client (nom, téléphone, e-mail), mode (takeaway | delivery), ville, adresse, code postal, créneau (date), lignes (produit, nom figé, prix unitaire figé, options figées, quantité), sous-total, remise, frais de livraison, total (centimes), mode de paiement (online | on_site), payée, statut (pending_payment | new | preparing | ready | completed | cancelled), stripeSessionId, commentaire
- Reservations : date, heure, personnes, nom, téléphone, e-mail, message, événement privé, statut (pending | confirmed | refused)
- Users : rôles admin et staff
- Media

Global Settings : horaires par jour, fermetures exceptionnelles, délais, pas des créneaux, capacité, pause des commandes, remise du midi, zones de livraison (ville, codes postaux, frais, seuil de gratuité).

Accès : public en lecture sur Categories, Products, Settings. Orders et Reservations lisibles et modifiables uniquement par staff et admin, création uniquement via nos routes API.

Script pnpm seed : importe seed/menu.json (prix convertis en centimes) et seed/settings.json, idempotent.

Critères : pnpm seed remplit la base, tout est visible et éditable dans /admin.
```

---

## Phase 4 · Logique métier et tests

```
Phase 4 : logique métier pure, sans interface.

- lib/hours.ts : isOpenNow, nextOpening, getServiceAt (midi ou soir), getAvailableSlots(mode, now, settings), fuseau Europe/Paris
- lib/delivery.ts : findZone(ville, codePostal), deliveryFee(zone, sousTotal)
- lib/pricing.ts : lineUnitPrice(produit, optionsChoisies), validateOptions (obligatoire, max), computeTotals(lignes, mode, créneau, zone, settings) qui renvoie sous-total, remise, frais, total en centimes
- Tests Vitest complets : minuit, samedi midi fermé, dimanche, dernier créneau, seuil exact 15 € et 16 €, remise refusée en livraison ou le soir, hors zone, wok avec 4 légumes refusé, suppléments, option obligatoire manquante

Critères : pnpm test au vert, couverture élevée sur ces trois fichiers.
```

---

## Phase 5 · Pages publiques

```
Phase 5 : pages publiques, fidèles à docs/maquette.html.

- Accueil : en-tête, hero (statut ouvert/fermé en direct, logo, accroche, CTA, téléphone, adresse, bloc −10 % le midi, bloc livraison offerte, réseaux), bandeau défilant, bloc Thaï Crousty (produit featured), « Commander, c’est simple », chiffres clés, club (visuel seulement en Pro), pied de page
- Carte (/carte) : navigation par rubriques collante avec rubrique active au défilement, sections avec titre et priceTag, grille de ProductCard, bloc Compose ton wok, encart « à compléter » pour une rubrique vide
- Réservation, Infos pratiques (horaires avec jour actuel en évidence), pages légales (contenu provisoire signalé)
- Bouton « Je commande 🔥 » fixe en bas sur mobile
- Données lues depuis Payload en Server Components, revalidation à la modification

Critères : comparaison côte à côte avec la maquette sur mobile (390 px) et desktop (1280 px), Lighthouse mobile ≥ 90.
```

---

## Phase 6 · Panier

```
Phase 6 : panier.

- CartProvider (contexte React + persistance localStorage), clé de ligne = produit + options
- ProductModal : groupes d’options, règles obligatoire et max, prix mis à jour en direct, bouton « Ajouter · 12,90 € »
- WokBuilder : les 5 étapes + suppléments, mêmes règles
- CartDrawer : lignes avec options, quantités, choix À emporter / Livraison, ville, adresse, code postal, créneau (getAvailableSlots), nom, téléphone, e-mail, commentaire, choix du paiement, totaux via computeTotals, messages d’incitation (« Plus que X € pour… »)
- Toast à l’ajout, compteur dans l’en-tête
- Restaurant fermé ou commandes en pause : message clair, commande programmée pour le prochain service si possible

Critères : tous les cas de spec.md §3 se comportent correctement à l’écran.
```

---

## Phase 7 · Commande et paiement Stripe

```
Phase 7 : commande et paiement.

- POST /api/checkout : validation Zod, recalcul serveur complet (jamais le prix client), vérification horaires, créneau, zone, disponibilité des produits, création de la commande
- Paiement en ligne : session Stripe Checkout (lignes détaillées, remise, frais de livraison), success_url vers /commande/[id], cancel_url vers /carte
- Paiement sur place : commande créée directement en statut new
- POST /api/stripe/webhook : vérification de signature, idempotent, passe la commande en new et payée
- Page /commande/[id] : « Merci [prénom] ! », numéro, créneau, récapitulatif, payée ou à régler sur place. Accès protégé par un jeton dans l’URL
- Vider le panier après succès

Critères : parcours complet en mode test Stripe (carte 4242…), webhook testé avec stripe listen, aucune commande payée sans webhook valide.
```

---

## Phase 8 · Espace restaurant

```
Phase 8 : espace restaurant (/restaurant), pensé pour une tablette au comptoir.

- Connexion avec l’auth Payload (rôles staff et admin)
- Commandes en direct : colonnes Nouvelles / En préparation / Prêtes, rafraîchissement toutes les 5 s, alerte sonore et clignotement à chaque nouvelle commande (avec un bouton pour activer le son, contrainte des navigateurs)
- OrderCard : numéro en grand, nom, mode, créneau, plats et options, commentaire, montant, payée ou à encaisser, bouton d’étape (Lancer, Prête, Terminée), annulation avec confirmation
- Fiche livraison : adresse, téléphone cliquable, lien Google Maps
- Impression d’une commande (feuille de style print adaptée aux tickets)
- Historique filtrable, réglages (pause, délai, horaires, fermetures), disponibilités (interrupteur Disponible / Épuisé par plat), réservations (confirmer, refuser)

Critères : une commande passée sur le site apparaît en moins de 10 s avec le son, utilisable au doigt sur tablette.
```

---

## Phase 9 · E-mails

```
Phase 9 : e-mails transactionnels avec Resend et React Email, aux couleurs du site.

- Client : confirmation de commande (numéro, récapitulatif, créneau, adresse si livraison, payée ou à régler)
- Restaurant : nouvelle commande (secours de l’alerte sonore)
- Réservation : accusé de réception client, notification restaurant, confirmation ou refus
- Formulaire de contact

Critères : rendu correct sur Gmail mobile et Outlook, envoi déclenché aux bons moments, aucun envoi en double.
```

---

## Phase 10 · SEO, légal, finitions

```
Phase 10 : finitions.

- Métadonnées par page, Open Graph avec visuel de marque, favicon
- Données structurées JSON-LD : Restaurant (adresse, horaires, téléphone, servesCuisine, acceptsReservations, hasMenu) et Menu
- sitemap.xml, robots.txt (exclure /restaurant, /admin, /styleguide)
- Pages légales, bandeau cookies minimal
- Page 404 dans le ton de la marque
- Audit accessibilité et performance, corrections

Critères : Lighthouse mobile ≥ 90 partout, test des résultats enrichis Google valide.
```

---

## Phase 11 · Mise en ligne

```
Phase 11 : préparation de la mise en ligne sur Vercel.

- Liste de vérification : variables d’environnement de production, base de données de production, webhook Stripe de production, domaine d’envoi Resend vérifié, compte admin du restaurant
- Rédige docs/GUIDE-RESTAURANT.md : comment suivre les commandes, mettre un plat en épuisé, mettre les commandes en pause, changer les horaires (langage simple, sans jargon)
- Vérifie le build de production et corrige les erreurs

Critères : pnpm build sans erreur, guide restaurant prêt.
```

---

## Prompts utiles à tout moment

**Revue de code**
```
Fais une revue de ce qui a été fait dans cette phase : bugs, failles de sécurité (prix, accès, webhook), écarts avec CLAUDE.md et docs/spec.md, code mort. Liste les problèmes par gravité avant de corriger quoi que ce soit.
```

**Comparaison avec la maquette**
```
Compare la page [nom] avec docs/maquette.html, en mobile et desktop. Liste chaque écart visuel (couleurs, tailles, espacements, textes) puis corrige-les.
```

**Ajout de la carte sushi** (quand tu as la carte nette)
```
Voici la carte sushi : [colle le texte ou décris la photo]. Ajoute-la dans seed/menu.json dans la rubrique « sushis » au même format que les autres rubriques, crée les groupes d’options nécessaires, puis relance le seed.
```

**Passage en Premium** (si le client monte de formule)
```
Le client passe en formule Premium. Relis docs/spec.md (fonctionnalités marquées Pm) et propose un plan pour : programme de fidélité, club e-mail avec offre de première commande, statistiques, édition de la carte par le restaurant, impression automatique des tickets, suivi de commande en temps réel.
```
