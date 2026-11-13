# Sushi Thaï, Argenteuil
## Spécification : fonctionnalités, écrans et design

Magar Développement · Référence projet SUT · Version 1.0 du 12/11/2026
Devis lié : DEV-2026-SUT-001 · Maquette : https://claude.ai/artifact/DRTq4LtUCRvw3XJBNqMd3H

Document de travail interne. Les points marqués **[À CONFIRMER]** attendent une réponse du restaurant.

---

## Sommaire

1. Contexte et périmètre
2. Formules et légende
3. Règles métier
4. Liste complète des fonctionnalités
5. Liste des écrans
6. Design system
7. E-mails et notifications
8. Données et technique
9. Éléments à récupérer auprès du restaurant

---

## 1. Contexte et périmètre

**Le restaurant**
- Sushi Thaï, restaurant thaïlandais et japonais depuis 2017
- 120 bis boulevard Jean Allemane, 95100 Argenteuil **[À CONFIRMER : 95100 sur le site, 95120 sur le flyer]**
- 01 39 96 19 51 · Instagram, Snapchat, TikTok : sushithai95
- Sur place, à emporter, livraison maison, présent sur Uber Eats et Deliveroo
- Gérant : M. Larbi LAHMER

**Objectif du site**
Prendre les commandes à la place du téléphone et des plateformes, en emporter comme en livraison, payées en ligne et sans commission. Mettre en avant la marque et les plats signatures. Remplir la salle grâce à la réservation.

**Hors périmètre**
- Intégration aux caisses existantes
- Synchronisation avec Uber Eats ou Deliveroo
- Paiement des titres-restaurant en ligne (accepté au retrait uniquement)

---

## 2. Formules et légende

| Formule | Prix | Délai |
|---|---|---|
| **E**ssentiel | 1 490 € | 2 à 3 semaines |
| **P**ro (recommandée) | 2 290 € | 3 semaines |
| **Pm** Premium | 3 590 € | 4 à 5 semaines |
| Option | prix à part | |

Dans les tableaux, la colonne « Formule » indique **à partir de quelle formule** la fonctionnalité est incluse. E = toutes les formules, P = Pro et Premium, Pm = Premium seulement, Opt = option à la carte.

---

## 3. Règles métier

### 3.1 Horaires (carte imprimée) **[À CONFIRMER, différents du site actuel]**

| Jour | Midi | Soir |
|---|---|---|
| Lundi au vendredi | 11 h 30 à 14 h 30 | 18 h à minuit |
| Samedi, dimanche | Fermé | 18 h à minuit |

- Le statut « Ouvert / Fermé » se calcule en direct à partir de ces horaires
- Les horaires sont modifiables dans l’espace restaurant, avec fermetures exceptionnelles (jours fériés, congés)

### 3.2 Créneaux de commande
- Pas de 15 minutes
- Premier créneau proposé : heure actuelle + délai de préparation (20 min par défaut, réglable)
- Dernier créneau : 15 minutes avant la fermeture du service
- Capacité maximale de commandes par créneau, réglable (par défaut illimitée)
- Restaurant fermé : le client peut programmer pour le prochain service, la commande immédiate est désactivée
- Pause des commandes (rush) : bouton dans l’espace restaurant, le site affiche « Commandes en ligne momentanément suspendues »

### 3.3 Livraison (P)
| Zone | Frais | Condition |
|---|---|---|
| Argenteuil, Sannois, Saint-Gratien | Offerte | dès 15 € **[À CONFIRMER]** |
| Ces 3 villes sous 15 € | 2,50 € **[À CONFIRMER]** | |
| Villes alentour (Bezons, Cormeilles-en-Parisis, Ermont, etc.) | Selon la ville **[À CONFIRMER]** | Minimum de commande éventuel |
| Hors zone | Livraison refusée | Message et proposition de passer en « à emporter » |

- La zone est déterminée par la ville choisie, puis vérifiée par le code postal de l’adresse
- Délai de livraison ajouté au délai de préparation (réglable, 30 min par défaut)

### 3.4 Remise du midi (P)
- −10 % sur le sous-total
- Uniquement en **à emporter**
- Uniquement si le créneau choisi est un créneau du service du midi
- À partir de 16 € de sous-total
- Non cumulable avec les codes promo **[À CONFIRMER]**
- Message d’incitation dans le panier : « Plus que X € pour profiter de −10 % le midi »

### 3.5 Compose ton wok (P) · 10 €
| Étape | Choix | Règle |
|---|---|---|
| 1. Base | Riz thaï, nouilles thaï, pad thaï, nouilles japonaises (udon) | 1 obligatoire |
| 2. Protéine | Poulet, bœuf, dinde, crevettes, saumon | 1 obligatoire |
| 3. Légumes | Champignons noirs, petits pois, épi de maïs, poivrons, soja, oignons, carottes, cœur de bambou, ananas | jusqu’à 3 **[À CONFIRMER le nombre]** |
| 4. Sauce | Piquante, thaï, saté, curry, soja, crème fraîche, aigre-douce, caramel | 1 obligatoire |
| 5. Topping | Oignons frits, graines de sésame, cacahuètes, ciboulette, menthe, gingembre, coriandre | 1 obligatoire |
| Suppléments | Viande +1,50 €, légume +0,50 €, œuf +1,00 €, gruyère +1,00 €, assaisonnement +0,50 € | facultatif |

### 3.6 Formules (P)
- **Formule Pattaya, 13,90 €** : 1 wok ou plat thaï (hors signature) + 2 nems ou 2 brochettes yakitori ou 2 crevettes tempura + 1 boisson 33 cl. Dessert au choix +3 €.
- **Menu enfant, 7,90 €** : mini riz thaï cantonais ou 3 fingers de poulet + 1 jus + 1 compote.
- **Mix Thaï, 7,90 €** : 2 nems poulet, 2 tempura, 1 brochette de poulet thaï, 3 gyozas.

### 3.7 Plats thaï · 10,90 €
Viande au choix : poulet, bœuf, crevettes, végétarien (sauf plats à viande fixe : pad kapao bœuf, poulet caramel).

### 3.8 Paiement
- En ligne : carte bancaire, Apple Pay, Google Pay (Stripe, fonds versés sur le compte du restaurant)
- Au retrait ou à la livraison : espèces, CB, titres-restaurant, chèques
- Option du restaurant : obliger le paiement en ligne au-delà d’un montant ou en livraison **[À CONFIRMER]**

---

## 4. Liste complète des fonctionnalités

### 4.1 Vitrine

| # | Fonctionnalité | Formule |
|---|---|---|
| V1 | Site sur mesure aux couleurs de Sushi Thaï, mobile d’abord | E |
| V2 | Statut « Ouvert / Fermé » en direct avec prochaine ouverture | E |
| V3 | Bandeaux défilants (fait maison, depuis 2017, livraison offerte…) | E |
| V4 | Mise en avant d’un plat signature (Thaï Crousty) | E |
| V5 | Bloc « Commander en 3 étapes » et chiffres clés | E |
| V6 | Mise en avant des promos : −10 % le midi, livraison offerte | E |
| V7 | Horaires avec le jour actuel mis en évidence | E |
| V8 | Adresse, plan, bouton itinéraire, téléphone cliquable | E |
| V9 | Moyens de paiement et services (PMR, climatisation, Wi-Fi, événements) | E |
| V10 | Liens Instagram, Snapchat, TikTok | E |
| V11 | Affichage des avis Google | E |
| V12 | Formulaire de contact | E |
| V13 | Bouton « Je commande » fixé en bas de l’écran sur mobile | E |
| V14 | Version anglaise | Opt (490 €) |
| V15 | Carte QR code à table | Opt (290 €) |
| V16 | Multi-restaurants : choix du restaurant, carte, horaires et commandes par établissement, accès gérant par resto | Opt (600 € + 150 € par resto en plus) |
| V17 | Encaissement séparé par restaurant (sociétés différentes) | Opt (500 €) |

### 4.2 Carte

| # | Fonctionnalité | Formule |
|---|---|---|
| C1 | Carte complète par rubriques : formules, wok, plats thaï, signatures, accompagnements, sushis, poke bowls, desserts, boissons | E |
| C2 | Navigation par rubriques collante, rubrique active surlignée au défilement | E |
| C3 | Fiche plat : photo, nom, nombre de pièces, description, prix | E |
| C4 | Badges « Signature » et « New » | E |
| C5 | Repères épicé, végétarien, allergènes | E |
| C6 | Plat « Épuisé » affiché mais non commandable | E |
| C7 | Prix de rubrique affiché à côté du titre (10€90, 10€) | E |
| C8 | Options simples sur un plat (viande au choix, sauce, parfum) | E |
| C9 | Compose ton wok en 5 étapes avec suppléments | P |
| C10 | Formules composables (Pattaya, Enfant) | P |

### 4.3 Panier et commande

| # | Fonctionnalité | Formule |
|---|---|---|
| O1 | Panier latéral toujours accessible avec compteur | E |
| O2 | Modifier les quantités, supprimer une ligne | E |
| O3 | Détail des options sous chaque ligne | E |
| O4 | Commentaire libre sur la commande (sans oignons, etc.) | E |
| O5 | À emporter avec choix du créneau | E |
| O6 | Commande programmée quand le restaurant est fermé | E |
| O7 | Coordonnées : nom, téléphone, e-mail | E |
| O8 | Paiement en ligne ou au retrait | E |
| O9 | Page de confirmation avec numéro de commande | E |
| O10 | E-mail de confirmation au client | E |
| O11 | Livraison : choix de la ville, adresse, frais calculés, livraison offerte dès 15 € | P |
| O12 | Messages d’incitation (montant restant pour la livraison offerte ou la remise) | P |
| O13 | Remise du midi appliquée automatiquement | P |
| O14 | Suivi de commande en temps réel (reçue, en préparation, prête, en livraison) | Pm |
| O15 | Recommander une commande précédente en un clic | Pm |
| O16 | Codes promo | Opt (250 €) |

### 4.4 Réservation

| # | Fonctionnalité | Formule |
|---|---|---|
| R1 | Formulaire : date, heure (selon horaires), nombre de personnes, nom, téléphone, message | P |
| R2 | Demande de groupe ou d’événement privé | P |
| R3 | E-mail au restaurant et accusé de réception au client | P |
| R4 | Confirmation ou refus par le restaurant depuis l’espace de gestion | P |

### 4.5 Fidélisation

| # | Fonctionnalité | Formule |
|---|---|---|
| F1 | Club Sushi Thaï : inscription e-mail | Pm |
| F2 | Offre de bienvenue sur la première commande en ligne **[À CONFIRMER le montant]** | Pm |
| F3 | Envoi de promos et nouveautés aux inscrits | Pm |
| F4 | Programme de fidélité à points (1 € = 1 point, X points = récompense) **[À CONFIRMER]** | Pm |
| F5 | Espace client : historique, points, coordonnées enregistrées | Pm |

### 4.6 Espace restaurant

| # | Fonctionnalité | Formule |
|---|---|---|
| B1 | Connexion protégée par mot de passe | E |
| B2 | Écran des commandes en direct avec alerte sonore | E |
| B3 | Statuts : nouvelle, en préparation, prête, retirée ou livrée, annulée | E |
| B4 | Fiche commande détaillée et imprimable | E |
| B5 | Historique des commandes avec recherche | E |
| B6 | Pause et reprise des commandes en ligne | E |
| B7 | Réglage des horaires et fermetures exceptionnelles | E |
| B8 | Réglage du délai de préparation | E |
| B9 | Fiche de livraison : adresse, téléphone, lien GPS | P |
| B10 | Réglage des zones et frais de livraison | P |
| B11 | Gestion des réservations | P |
| B12 | Mise en épuisé rapide d’un plat | P |
| B13 | Édition complète de la carte : plats, prix, photos, options | Pm |
| B14 | Statistiques : chiffre par jour, panier moyen, plats les plus vendus, part livraison / emporter | Pm |
| B15 | Impression automatique des tickets en cuisine | Pm |
| B16 | Liste des clients et inscrits au club, export | Pm |

### 4.7 Visibilité, conformité, sécurité

| # | Fonctionnalité | Formule |
|---|---|---|
| S1 | Référencement local : balises, données structurées « Restaurant » et « Menu », plan du site | E |
| S2 | Optimisation de la fiche Google et lien de commande | E |
| S3 | Mentions légales, confidentialité, CGV, bandeau cookies | E |
| S4 | HTTPS, sauvegardes, protection anti-spam des formulaires | E |
| S5 | Performances : images optimisées, chargement rapide sur mobile | E |

---

## 5. Liste des écrans

### 5.1 Site public

| # | Écran | Contenu principal | États particuliers | Formule |
|---|---|---|---|---|
| P01 | **Accueil** | En-tête, statut ouvert/fermé, logo et « Sushi Thaï depuis 2017 », accroche, boutons Je commande / Réserver, téléphone, adresse, bloc « Le midi −10 % », bloc livraison offerte, réseaux | Ouvert, fermé, commandes en pause | E |
| P02 | **Bandeau défilant** | Mots-clés de la marque, 2 bandeaux (rose, blanc) inclinés | Animation coupée si mouvement réduit | E |
| P03 | **Plat signature** | Titre géant Thaï Crousty, accroche script « La signature », description, prix, bouton « Je le veux » | Plat épuisé : bouton désactivé | E |
| P04 | **Commander en 3 étapes** | 3 cartes numérotées, 4 chiffres clés | | E |
| P05 | **Carte** | Navigation par rubriques, sections avec titre et prix de rubrique, grille de plats | Rubrique vide, plat épuisé, badges | E |
| P06 | **Fiche plat (fenêtre)** | Nom, description, groupes d’options, prix mis à jour, bouton Ajouter | Choix obligatoire manquant, maximum atteint | E |
| P07 | **Compose ton wok (bloc + fenêtre)** | 5 étapes numérotées et encadrés blancs, puis fenêtre de composition | Étape incomplète, maximum légumes atteint | P |
| P08 | **Formule (fenêtre)** | Plat, accompagnement, boisson, dessert facultatif | | P |
| P09 | **Panier (volet latéral)** | Lignes, quantités, mode emporter / livraison, ville, adresse, créneau, coordonnées, mode de paiement, totaux, bouton payer | Panier vide, sous le minimum, hors zone, remise appliquée, livraison offerte | E |
| P10 | **Paiement** | Page de paiement sécurisée (carte, Apple Pay, Google Pay) | Paiement refusé, annulé | E |
| P11 | **Confirmation de commande** | Merci + prénom, numéro, créneau, récapitulatif, rappel adresse | Payée / à régler sur place | E |
| P12 | **Suivi de commande** | Frise des statuts en direct, heure estimée, appel du restaurant | | Pm |
| P13 | **Réservation** | Titre « On vient se faire plaisir », formulaire | Jour fermé, plus de créneaux | P |
| P14 | **Confirmation de réservation** | Récapitulatif, mention « le restaurant vous confirme » | | P |
| P15 | **Club Sushi Thaï** | Bloc rose, titre, promesse, champ e-mail | Inscrit, déjà inscrit, erreur | Pm |
| P16 | **Espace client** | Connexion par lien e-mail, historique, points, recommander | | Pm |
| P17 | **Infos pratiques** | Horaires, livraison, paiements, services, réseaux, plan | Jour actuel mis en évidence | E |
| P18 | **Contact** | Formulaire, téléphone, adresse | Envoyé, erreur | E |
| P19 | **Pages légales** | Mentions légales, confidentialité, CGV, cookies | | E |
| P20 | **Page introuvable (404)** | Message dans le ton de la marque, bouton retour à la carte | | E |
| P21 | **Pied de page** | Marque, liens légaux, réseaux, accès espace restaurant | | E |
| P22 | **Bouton fixe mobile** | « Je commande 🔥 » en bas d’écran | Masqué quand le panier est ouvert | E |
| P23 | **Notification (toast)** | « Plat ajouté au panier », erreurs | | E |

### 5.2 Espace restaurant

| # | Écran | Contenu principal | Formule |
|---|---|---|---|
| A01 | **Connexion** | E-mail, mot de passe, mot de passe oublié | E |
| A02 | **Commandes en direct** | Colonnes Nouvelles / En préparation / Prêtes, cartes commande avec numéro, nom, mode, créneau, plats, montant, payé ou à encaisser, bouton d’étape, alerte sonore | E |
| A03 | **Détail commande** | Tout le contenu, commentaire client, téléphone, impression, annulation | E |
| A04 | **Historique** | Liste filtrable par date, statut, mode, recherche par nom ou numéro | E |
| A05 | **Réglages service** | Pause commandes, délai de préparation, capacité par créneau | E |
| A06 | **Horaires** | Horaires par jour, fermetures exceptionnelles | E |
| A07 | **Fiche livraison** | Adresse, lien GPS, téléphone, montant à encaisser | P |
| A08 | **Zones de livraison** | Villes, frais, seuil de gratuité, minimum | P |
| A09 | **Réservations** | Liste du jour et à venir, confirmer, refuser, contacter | P |
| A10 | **Disponibilité des plats** | Liste des plats avec interrupteur Disponible / Épuisé | P |
| A11 | **Éditeur de carte** | Rubriques, plats, prix, photos, options, ordre d’affichage | Pm |
| A12 | **Statistiques** | Chiffre par jour et par mois, panier moyen, top plats, emporter vs livraison, midi vs soir | Pm |
| A13 | **Clients et club** | Liste, nombre de commandes, points, export | Pm |
| A14 | **Fidélité** | Règles de points et récompenses | Pm |

### 5.3 Parcours principaux

**Commande à emporter**
Accueil (P01) → Carte (P05) → Fiche plat (P06) → Panier (P09) → Paiement (P10) → Confirmation (P11) → arrivée en direct dans l’espace restaurant (A02)

**Commande en livraison**
Carte (P05) → Panier, mode Livraison, ville et adresse (P09) → Paiement (P10) → Confirmation (P11) → A02 → Fiche livraison (A07)

**Wok**
Bloc Compose ton wok (P07) → fenêtre 5 étapes → Panier (P09)

**Réservation**
Accueil → Réservation (P13) → Confirmation (P14) → Réservations (A09) → e-mail de confirmation au client

---

## 6. Design system

Inspiration : la carte imprimée de Sushi Thaï (charte rose et noire, mur de briques) et les codes street-food de Tasty Crousty (bandeaux défilants, titres géants, ton direct). La charte du restaurant prime toujours.

### 6.1 Couleurs

| Rôle | Nom | Valeur |
|---|---|---|
| Fond principal | Noir brique | `#0D0A0D` |
| Joints du motif briques | Brique | `#1C141B` |
| Fond des cartes et panneaux | Carte | `#181218` |
| Fond secondaire | Carte 2 | `#221A22` |
| Bordures | Ligne | `#33263A` |
| Couleur de marque | Magenta | `#E5087F` |
| Magenta clair (textes, accents sur fond noir) | Magenta 2 | `#FF3FA4` |
| Texte principal | Blanc | `#FFFFFF` |
| Texte secondaire | Gris rosé | `#C9BBC6` |
| Étiquettes de plats, chips | Blanc pill | `#FFFFFF` sur texte `#111111` |
| Accent secondaire (sushi, nouveautés) | Turquoise | `#33C3CC` |
| Succès, ouvert | Vert | `#4CC88A` |
| Alerte, fermé | Orange | `#F2A54A` |

Règles
- Le magenta est réservé aux actions (boutons, prix de rubrique, onglet actif) et aux accents de marque
- Halo magenta (dégradé radial) derrière le logo et les visuels de plats
- Fond : motif de briques en SVG répété (tuile 120 × 48 px), fixe au défilement
- Le site reste sombre en mode clair comme en mode sombre, c’est la marque

### 6.2 Typographie

| Usage | Police | Graisse | Taille indicative |
|---|---|---|---|
| Logo, nom du restaurant, téléphone | Baloo 2 | 800 | 50 à 98 px (hero), 24 px (en-tête) |
| Titres de section, noms de plats, boutons, onglets | Londrina Solid, majuscules | 900 (titres), 400 (boutons, onglets) | 40 à 128 px titres, 19 à 22 px boutons |
| Badges « Signature », accroches | Yellowtail (script) | 400 | 30 à 38 px |
| Texte courant, descriptions, formulaires | Nunito Sans | 400 à 800 | 14 à 18 px |

Toutes les polices viennent de Google Fonts, avec des polices de secours système.

### 6.3 Composants

| Composant | Description |
|---|---|
| **En-tête** | Noir, filet magenta de 2 px en bas, logo rond + nom, liens en Londrina, bouton Panier magenta avec compteur blanc |
| **Bouton principal** | Magenta, texte blanc Londrina majuscules, coins 14 px, ombre magenta |
| **Bouton secondaire** | Blanc, texte noir |
| **Onglets de rubriques** | Étiquettes blanches texte noir, actif en magenta, barre collante sous l’en-tête |
| **Titre de section** | Londrina géant blanc + bloc prix magenta (`10€90`, centimes en exposant) |
| **Carte plat** | Visuel rond (150 px) avec halo magenta, nom dans une étiquette blanche, nombre de pièces en pastille magenta, description grise, prix Londrina 26 px, bouton Ajouter |
| **Badge Signature** | Script blanc sur dégradé rose, incliné de −14° |
| **Badge New** | Londrina sur magenta, incliné de 8° |
| **Bandeau défilant** | Pleine largeur, magenta ou blanc, incliné de ±1°, texte Londrina 26 px séparé par des points |
| **Bloc promo** | « LE MIDI » / « −10% » géant magenta lumineux / « À PARTIR DE 16 € », incliné de −3° |
| **Étapes du wok** | Grand chiffre blanc + titre magenta, choix dans un encadré blanc |
| **Fenêtre d’options** | Fond noir, bordure magenta 2 px, groupes titrés en magenta, choix en pastilles blanches, sélection magenta, bouton Ajouter avec prix en direct |
| **Panier** | Volet droit 420 px, bordure magenta, sélecteur à 2 segments (À emporter / Livraison), totaux, gros bouton Payer |
| **Statut** | Pastille ronde verte (ouvert) ou orange (fermé) + texte |
| **Carte commande (espace restaurant)** | Fond blanc, numéro Londrina, statut en pastille magenta, liste des plats, montant et bouton d’étape |
| **Notification** | Pastille magenta en bas d’écran, 1,8 s |

### 6.4 Mise en page et responsive
- Conteneur maximum 1 120 px, marges 20 px
- Mobile d’abord, points de rupture à 560, 760 et 820 px
- Grille des plats : colonnes automatiques de 240 px minimum
- Sur mobile : liens de navigation masqués, bouton « Je commande » fixe en bas, visuel du hero au-dessus du texte
- Zones de sécurité iPhone respectées (encoche, barre du bas)

### 6.5 Mouvement
- Bandeaux défilants (28 s par boucle, sens inverse pour le second)
- Ouverture du panier en glissement (0,25 s)
- Apparition des notifications en glissement
- Tout est désactivé si l’utilisateur a demandé à réduire les animations

### 6.6 Ton et rédaction
- **Tutoiement**, comme sur le flyer (« Compose ton wok », « Choisis ta base »)
- Phrases courtes et directes : « Une fois que t’as goûté, tu reviens », « On vient se faire plaisir », « Je commande 🔥 »
- Émojis avec parcimonie (🔥 sur les appels à commander)
- Aucun chiffre inventé : seulement des faits vrais (2017, 7 j/7, 3 villes, −10 %)
- Pages légales et e-mails transactionnels au vouvoiement **[À CONFIRMER avec le gérant]**

### 6.7 Images
- Photos HD de la carte imprimée, détourées, présentées dans des bols ronds avec halo magenta **[fichiers à récupérer auprès de l’imprimeur]**
- Logo en vectoriel
- Pas de photos de banque d’images ni de photos d’autres enseignes

### 6.8 Accessibilité
- Contraste suffisant (texte blanc ou gris rosé sur noir)
- Navigation au clavier, contour de focus magenta visible
- Fenêtres fermables avec Échap
- Libellés sur tous les boutons d’icône et champs de formulaire

---

## 7. E-mails et notifications

| Déclencheur | Destinataire | Contenu | Formule |
|---|---|---|---|
| Commande passée | Client | Numéro, récapitulatif, créneau, mode, montant, payé ou à régler | E |
| Commande passée | Restaurant | Alerte sonore dans l’espace + e-mail de secours | E |
| Commande prête | Client | « Ta commande est prête » (emporter) | Pm |
| Commande en livraison | Client | « Ton livreur arrive » | Pm |
| Demande de réservation | Restaurant + client | Récapitulatif, accusé de réception | P |
| Réservation confirmée ou refusée | Client | Confirmation ou proposition d’un autre créneau | P |
| Inscription au club | Client | Bienvenue + offre de première commande | Pm |
| Formulaire de contact | Restaurant | Message du client | E |

---

## 8. Données et technique

**Stack**
- Next.js (site et espace restaurant), hébergement Vercel
- Paiement Stripe (compte au nom du restaurant)
- Base de données pour la carte, les commandes, les réservations et les clients
- Mises à jour en temps réel pour l’écran des commandes
- E-mails transactionnels via un service d’envoi dédié

**Principales données**
- Rubrique : nom, ordre, prix affiché, description
- Plat : nom, rubrique, prix, pièces, description, photo, badges, repères, disponible, groupes d’options
- Groupe d’options : nom, type (un choix / plusieurs), obligatoire, maximum, choix avec supplément
- Commande : numéro, client, mode, ville, adresse, créneau, lignes avec options, sous-total, remise, frais, total, paiement, statut, horodatages
- Réservation : date, heure, personnes, nom, téléphone, message, statut
- Réglages : horaires, fermetures, délai de préparation, capacité, zones, remise midi, pause commandes
- Client et club (Pm) : e-mail, téléphone, historique, points

---

## 9. Éléments à récupérer auprès du restaurant

- [ ] Photo nette ou PDF de la carte sushi (menus midi, solo, Duo 1, Duo 2, Family Box, rolls, signatures, poke bowls)
- [ ] Confirmation des prix de toute la carte
- [ ] Logo en vectoriel et photos HD des plats (imprimeur)
- [ ] Horaires exacts (le site et le flyer ne disent pas la même chose)
- [ ] Code postal exact (95100 ou 95120)
- [ ] Montant de la livraison offerte et frais des villes alentour
- [ ] Nombre de légumes inclus dans le wok
- [ ] Accès à la fiche Google et aux réseaux sociaux
- [ ] SIRET, raison sociale, adresse de facturation
- [ ] Ouverture du compte Stripe (accompagnement inclus)
- [ ] Choix de la formule et décision sur l’offre de première commande (Premium)
