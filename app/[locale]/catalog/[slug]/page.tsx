import type { Metadata } from 'next'
import CatalogSlugClient from './CatalogSlugClient'

const LOCALES = ['en', 'ru', 'ar']
const SLUGS = ['flexible-marbles', 'chandeliers', 'soft-wall-panels', 'smart-dryers']
const BASE = 'https://neweraexclusive.ae'

export function generateStaticParams() {
  return LOCALES.flatMap(locale => SLUGS.map(slug => ({ locale, slug })))
}

export function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}): Metadata {
  return {
    alternates: {
      canonical: `${BASE}/${locale}/catalog/${slug}/`,
      languages: {
        en: `${BASE}/en/catalog/${slug}/`,
        ru: `${BASE}/ru/catalog/${slug}/`,
        ar: `${BASE}/ar/catalog/${slug}/`,
        'x-default': `${BASE}/en/catalog/${slug}/`,
      },
    },
  }
}

export default function Page({ params }: { params: { locale: string; slug: string } }) {
  return <CatalogSlugClient slug={params.slug} />
}
