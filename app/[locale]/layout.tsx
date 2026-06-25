import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import PageLoader from '@/components/PageLoader'

const locales = ['en', 'ru', 'ar']
const BASE = 'https://neweraexclusive.ae'

const SEO = {
  en: {
    title: 'New Era Exclusive — Luxury Interior Design Dubai',
    description: 'Premium interior design & full renovation turnkey in the UAE. 20+ years of expertise. Transform your home or commercial space with New Era Exclusive.',
  },
  ru: {
    title: 'New Era Exclusive — Дизайн интерьера и ремонт в Дубае',
    description: 'Дизайн интерьера и ремонт под ключ в ОАЭ. Более 20 лет опыта. Превращаем пространства в шедевры — от концепции до финальной сдачи.',
  },
  ar: {
    title: 'New Era Exclusive — تصميم داخلي فاخر في دبي',
    description: 'تصميم داخلي وتجديد متكامل في الإمارات. أكثر من ٢٠ عاماً من الخبرة. نحوّل مساحاتك إلى تحف معمارية.',
  },
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  unstable_setRequestLocale(locale)
  const s = SEO[locale as keyof typeof SEO] ?? SEO.en

  return {
    metadataBase: new URL(BASE),
    title: s.title,
    description: s.description,
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: {
        en: `${BASE}/en`,
        ru: `${BASE}/ru`,
        ar: `${BASE}/ar`,
        'x-default': `${BASE}/en`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'New Era Exclusive',
      title: s.title,
      description: s.description,
      url: `${BASE}/${locale}`,
      locale: locale === 'ar' ? 'ar_AE' : locale === 'ru' ? 'ru_RU' : 'en_US',
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'New Era Exclusive' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: s.title,
      description: s.description,
      images: ['/og.jpg'],
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()
  unstable_setRequestLocale(locale)

  const messages = await getMessages({ locale })
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {locale === 'ar' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500&display=swap"
            rel="stylesheet"
          />
        )}
      </head>
      <body>
        <PageLoader />
        <SmoothScroll />
        <Cursor />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
