import { FEATURES, FEATURE_KEYS, featuresFromEnv } from '@/config/features'

// Page provisoire de la phase 1 : confirme que l’app tourne et affiche les fonctionnalités actives.
export default function HomePage() {
  const flags = featuresFromEnv()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-4xl font-extrabold">Sushi Thaï</h1>
      <p className="mt-2 text-muted">Projet initialisé. Les pages publiques arrivent en phase 5.</p>
      <ul className="mt-6 grid gap-1 text-sm">
        {FEATURE_KEYS.map((key) => (
          <li key={key} className={flags[key] ? 'text-ok' : 'text-muted line-through'}>
            {FEATURES[key].label}
          </li>
        ))}
      </ul>
    </main>
  )
}
