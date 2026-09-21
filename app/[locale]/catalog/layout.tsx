import type { Metadata } from 'next'
import { type ReactNode } from 'react'
import Navbar from '@/components/Navbar'

const BASE = 'https://neweraexclusive.ae'

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Metadata {
  return {
    alternates: {
      canonical: `${BASE}/${locale}/catalog/`,
      languages: {
        en: `${BASE}/en/catalog/`,
        ru: `${BASE}/ru/catalog/`,
        ar: `${BASE}/ar/catalog/`,
        'x-default': `${BASE}/en/catalog/`,
      },
    },
  }
}

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
