/**
 * Fonctionnalités activables, alignées sur les formules du devis (docs/spec.md §2 et §4).
 *
 * Le socle Essentiel (vitrine, carte, panier, à emporter, paiement, espace restaurant de base)
 * est toujours actif et n’apparaît pas ici. Tout le reste passe par `isEnabled()`.
 *
 * Réglage par variables d’environnement :
 *   SITE_PLAN=essentiel | pro | premium
 *   FEATURES_ON=promoCodes,club      (ajouts à la carte)
 *   FEATURES_OFF=reservations        (retraits)
 */

export const PLANS = ['essentiel', 'pro', 'premium'] as const
export type Plan = (typeof PLANS)[number]

/** Prix des formules, en centimes. */
export const PLAN_PRICES: Record<Plan, number> = {
  essentiel: 149_000,
  pro: 229_000,
  premium: 359_000,
}

type FeatureDef = {
  label: string
  /** Formule à partir de laquelle la fonctionnalité est incluse, ou option facturée à part. */
  from: Exclude<Plan, 'essentiel'> | 'option'
  /** Prix en centimes, pour les options uniquement. */
  price?: number
  /** Références dans docs/spec.md §4. */
  refs: string[]
}

export const FEATURES = {
  // Pro
  delivery: { label: 'Livraison : villes, adresse, frais, fiche livreur', from: 'pro', refs: ['O11', 'B9', 'B10'] },
  incentives: { label: 'Messages d’incitation dans le panier', from: 'pro', refs: ['O12'] },
  lunchDiscount: { label: 'Remise du midi automatique', from: 'pro', refs: ['O13'] },
  wokBuilder: { label: 'Compose ton wok en 5 étapes', from: 'pro', refs: ['C9'] },
  combos: { label: 'Formules composables (Pattaya, Enfant)', from: 'pro', refs: ['C10'] },
  reservations: { label: 'Réservation de table', from: 'pro', refs: ['R1', 'R2', 'R3', 'R4', 'B11'] },
  availability: { label: 'Mise en épuisé rapide d’un plat', from: 'pro', refs: ['B12'] },
  // Premium
  tracking: { label: 'Suivi de commande en temps réel', from: 'premium', refs: ['O14'] },
  reorder: { label: 'Recommander en un clic', from: 'premium', refs: ['O15'] },
  club: { label: 'Club Sushi Thaï et offre de bienvenue', from: 'premium', refs: ['F1', 'F2', 'F3'] },
  loyalty: { label: 'Fidélité à points et espace client', from: 'premium', refs: ['F4', 'F5'] },
  menuEditor: { label: 'Édition de la carte par le restaurant', from: 'premium', refs: ['B13'] },
  stats: { label: 'Statistiques de vente', from: 'premium', refs: ['B14'] },
  autoPrint: { label: 'Impression automatique des tickets', from: 'premium', refs: ['B15'] },
  customers: { label: 'Liste des clients et export', from: 'premium', refs: ['B16'] },
  // Options à la carte
  promoCodes: { label: 'Codes promo', from: 'option', price: 25_000, refs: ['O16'] },
  english: { label: 'Version anglaise', from: 'option', price: 49_000, refs: ['V14'] },
  qrTable: { label: 'Carte QR code à table', from: 'option', price: 29_000, refs: ['V15'] },
  multiRestaurant: { label: 'Multi-restaurants', from: 'option', price: 60_000, refs: ['V16'] },
  splitPayout: { label: 'Encaissement séparé par restaurant', from: 'option', price: 50_000, refs: ['V17'] },
} as const satisfies Record<string, FeatureDef>

export type FeatureKey = keyof typeof FEATURES
export type FeatureFlags = Record<FeatureKey, boolean>

export const FEATURE_KEYS = Object.keys(FEATURES) as FeatureKey[]

const RANK: Record<Plan, number> = { essentiel: 0, pro: 1, premium: 2 }

export function isPlan(value: unknown): value is Plan {
  return typeof value === 'string' && (PLANS as readonly string[]).includes(value)
}

function isFeatureKey(value: string): value is FeatureKey {
  return value in FEATURES
}

/** Une fonctionnalité est-elle incluse d’office dans la formule ? */
export function includedInPlan(key: FeatureKey, plan: Plan): boolean {
  const from = FEATURES[key].from
  return from !== 'option' && RANK[plan] >= RANK[from]
}

export type FeatureConfig = { plan: Plan; on?: readonly string[]; off?: readonly string[] }

/** Calcule l’état de chaque fonctionnalité. `off` l’emporte sur `on`. Les clés inconnues sont ignorées. */
export function resolveFeatures({ plan, on = [], off = [] }: FeatureConfig): FeatureFlags {
  const flags = {} as FeatureFlags
  for (const key of FEATURE_KEYS) flags[key] = includedInPlan(key, plan)
  for (const key of on) if (isFeatureKey(key)) flags[key] = true
  for (const key of off) if (isFeatureKey(key)) flags[key] = false
  return flags
}

/** Montant du devis en centimes : formule + options activées (hors fonctionnalités déjà incluses). */
export function quoteTotal(plan: Plan, flags: FeatureFlags): number {
  let total = PLAN_PRICES[plan]
  for (const key of FEATURE_KEYS) {
    const def: FeatureDef = FEATURES[key]
    if (def.from === 'option' && flags[key]) total += def.price ?? 0
  }
  return total
}

const list = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

/** Lecture de la configuration dans l’environnement (côté serveur). Formule par défaut : Pro. */
export function featuresFromEnv(env: Record<string, string | undefined> = process.env): FeatureFlags {
  const plan = isPlan(env.SITE_PLAN) ? env.SITE_PLAN : 'pro'
  return resolveFeatures({ plan, on: list(env.FEATURES_ON), off: list(env.FEATURES_OFF) })
}

/** Raccourci côté serveur. Côté client, passe les flags en props depuis un Server Component. */
export function isEnabled(key: FeatureKey): boolean {
  return featuresFromEnv()[key]
}
