import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const BASE = 'https://neweraexclusive.ae'

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Metadata {
  return {
    alternates: {
      canonical: `${BASE}/${locale}/catalog/smart-toilet/`,
      languages: {
        en: `${BASE}/en/catalog/smart-toilet/`,
        ru: `${BASE}/ru/catalog/smart-toilet/`,
        ar: `${BASE}/ar/catalog/smart-toilet/`,
        'x-default': `${BASE}/en/catalog/smart-toilet/`,
      },
    },
  }
}

export default function SmartToiletLayout({ children }: { children: ReactNode }) {
  return children
}
