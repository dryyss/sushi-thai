import { describe, expect, it } from 'vitest'

import { featuresFromEnv, quoteTotal, resolveFeatures } from './features'

describe('resolveFeatures', () => {
  it('Essentiel : aucune fonctionnalité Pro ou Premium', () => {
    const f = resolveFeatures({ plan: 'essentiel' })
    expect(Object.values(f).some(Boolean)).toBe(false)
  })

  it('Pro : livraison et wok, sans le club ni les options', () => {
    const f = resolveFeatures({ plan: 'pro' })
    expect(f.delivery).toBe(true)
    expect(f.wokBuilder).toBe(true)
    expect(f.club).toBe(false)
    expect(f.promoCodes).toBe(false)
  })

  it('Premium : tout sauf les options', () => {
    const f = resolveFeatures({ plan: 'premium' })
    expect(f.tracking).toBe(true)
    expect(f.stats).toBe(true)
    expect(f.english).toBe(false)
  })

  it('ajouts et retraits à la carte, le retrait l’emporte', () => {
    const f = resolveFeatures({
      plan: 'pro',
      on: ['club', 'promoCodes', 'inconnue'],
      off: ['reservations', 'club'],
    })
    expect(f.promoCodes).toBe(true)
    expect(f.reservations).toBe(false)
    expect(f.club).toBe(false)
  })
})

describe('quoteTotal', () => {
  it('formule seule', () => {
    expect(quoteTotal('pro', resolveFeatures({ plan: 'pro' }))).toBe(229_000)
  })

  it('formule + options', () => {
    const flags = resolveFeatures({ plan: 'essentiel', on: ['promoCodes', 'english'] })
    expect(quoteTotal('essentiel', flags)).toBe(149_000 + 25_000 + 49_000)
  })
})

describe('featuresFromEnv', () => {
  it('formule Pro par défaut, listes tolérantes aux espaces', () => {
    const f = featuresFromEnv({ SITE_PLAN: 'nimporte', FEATURES_ON: ' stats , club ', FEATURES_OFF: '' })
    expect(f.delivery).toBe(true)
    expect(f.stats).toBe(true)
    expect(f.club).toBe(true)
  })
})
