import type { Metadata } from 'next'
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPostsByLocale } from '@/lib/blog'

const locales = ['en', 'ru', 'ar']
const BASE = 'https://neweraexclusive.ae'

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  unstable_setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${BASE}/${locale}/blog`,
      languages: {
        en: `${BASE}/en/blog`,
        ru: `${BASE}/ru/blog`,
        ar: `${BASE}/ar/blog`,
        'x-default': `${BASE}/en/blog`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'New Era Exclusive',
      title: t('title'),
      description: t('description'),
      url: `${BASE}/${locale}/blog`,
    },
  }
}

export default async function BlogPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = getPostsByLocale(locale)
  const isRtl = locale === 'ar'

  return (
    <div className="min-h-screen bg-ink text-cream" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero header */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-gold mb-4">
            New Era Exclusive
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-cream leading-[0.9] mb-6">
            {t('title')}
          </h1>
          <div className="h-px bg-gold/20 w-24 mb-0" />
        </div>
      </section>

      {/* Posts grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            /* Coming soon placeholder */
            <div className="border border-gold/20 rounded-2xl p-16 text-center">
              <div className="w-12 h-px bg-gold/40 mx-auto mb-8" />
              <p className="font-display text-3xl md:text-4xl font-light text-cream/60 mb-4">
                {t('coming_soon')}
              </p>
              <p className="font-body text-sm text-cream/35 max-w-md mx-auto leading-relaxed">
                {t('coming_soon_sub')}
              </p>
              <div className="w-12 h-px bg-gold/40 mx-auto mt-8" />
            </div>
          ) : (
            <div className="grid gap-px bg-gold/10 border border-gold/10 rounded-2xl overflow-hidden">
              {posts.map(post => (
                <article
                  key={`${post.locale}-${post.slug}`}
                  className="bg-ink p-8 md:p-10 hover:bg-stone/30 transition-colors duration-500 group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Meta column */}
                    <div className="md:w-48 flex-shrink-0">
                      <span className="inline-block font-body text-[10px] uppercase tracking-[0.25em] text-ink bg-gold px-3 py-1 rounded-full mb-3">
                        {post.category}
                      </span>
                      <p className="font-body text-[11px] text-cream/35 tracking-wide">
                        {new Date(post.date).toLocaleDateString(
                          locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </p>
                      <p className="font-body text-[11px] text-cream/25 mt-1">
                        {post.readTime} {t('min_read')}
                      </p>
                    </div>

                    {/* Content column */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-2xl md:text-3xl font-light text-cream group-hover:text-gold transition-colors duration-300 mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="font-body text-sm text-cream/50 leading-relaxed mb-5 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-gold hover:text-cream transition-colors duration-300"
                      >
                        {t('read_more')}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          {isRtl ? '←' : '→'}
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
