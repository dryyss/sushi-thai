import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Sushi Thaï Argenteuil · Commande en ligne',
  description:
    'Restaurant thaï et japonais à Argenteuil depuis 2017. Commande à emporter ou en livraison, sans commission.',
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
