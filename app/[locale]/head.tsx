function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}

export default function Head() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'InteriorDesigner'],
    name: 'New Era Exclusive',
    description: 'Luxury interior design and exclusive materials in Dubai',
    url: 'https://neweraexclusive.ae',
    telephone: '+971502541717',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressRegion: 'Dubai',
    },
    sameAs: ['https://www.instagram.com/newera_uae', 'https://parametrika.ae'],
    knowsAbout: ['Interior Design', 'Luxury Fit-out', 'Bespoke Furniture', 'Exclusive Materials'],
    brand: {
      '@type': 'Brand',
      name: 'New Era Exclusive',
      sameAs: ['https://parametrika.ae'],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
    </>
  )
}
