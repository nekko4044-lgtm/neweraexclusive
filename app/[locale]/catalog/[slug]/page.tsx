import CatalogSlugClient from './CatalogSlugClient'

const LOCALES = ['en', 'ru', 'ar']
const SLUGS = ['flexible-marbles', 'chandeliers', 'soft-wall-panels', 'smart-dryers']

export function generateStaticParams() {
  return LOCALES.flatMap(locale => SLUGS.map(slug => ({ locale, slug })))
}

export default function Page({ params }: { params: { locale: string; slug: string } }) {
  return <CatalogSlugClient slug={params.slug} />
}
