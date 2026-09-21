import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'

const BASE = 'https://neweraexclusive.ae'

export function generateStaticParams() {
  const slugs = getAllSlugs()
  if (slugs.length === 0) {
    return [{ locale: 'en', slug: '_' }, { locale: 'ru', slug: '_' }, { locale: 'ar', slug: '_' }]
  }
  return slugs.map(({ slug, locale }) => ({ slug, locale }))
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  unstable_setRequestLocale(locale)
  const post = getPostBySlug(slug, locale)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE}/${locale}/blog/${slug}/`,
    },
    openGraph: {
      type: 'article',
      siteName: 'New Era Exclusive',
      title: post.title,
      description: post.excerpt,
      url: `${BASE}/${locale}/blog/${slug}/`,
      publishedTime: post.date,
      locale: locale === 'ar' ? 'ar_AE' : locale === 'ru' ? 'ru_RU' : 'en_US',
    },
  }
}

export default async function BlogPostPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string }
}) {
  unstable_setRequestLocale(locale)
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: 'blog' })
  const isRtl = locale === 'ar'

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="min-h-screen bg-ink text-cream" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Breadcrumb */}
      <nav className="pt-32 pb-0 px-6" aria-label="Breadcrumb">
        <div className="max-w-3xl mx-auto">
          <ol className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.15em] text-cream/30">
            <li>
              <Link href={`/${locale}`} className="hover:text-gold transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="text-cream/15">/</li>
            <li>
              <Link href={`/${locale}/blog`} className="hover:text-gold transition-colors duration-200">
                {t('title')}
              </Link>
            </li>
            <li className="text-cream/15">/</li>
            <li className="text-cream/50 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article header */}
      <header className="pt-10 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Category badge */}
          <span className="inline-block font-body text-[10px] uppercase tracking-[0.3em] text-ink bg-gold px-4 py-1.5 rounded-full mb-6">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-6xl font-light text-cream leading-[1.05] mb-8">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="font-body text-sm text-cream/40">{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-cream/20" />
            <span className="font-body text-sm text-cream/40">
              {post.readTime} {t('min_read')}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gold/20" />
        </div>
      </header>

      {/* Article content */}
      <article className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Excerpt lead */}
          <p className="font-display text-xl md:text-2xl font-light text-cream/60 leading-relaxed mb-10 italic">
            {post.excerpt}
          </p>

          {/* Main content */}
          <div
            className="
              font-body text-base leading-[1.85] text-cream/65
              [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-light [&_h2]:text-cream [&_h2]:mt-12 [&_h2]:mb-5
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-light [&_h3]:text-cream/90 [&_h3]:mt-8 [&_h3]:mb-4
              [&_p]:mb-6
              [&_ul]:mb-6 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-gold/60
              [&_ol]:mb-6 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:marker:text-gold/60
              [&_li]:mb-2
              [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-gold/30 [&_a]:hover:decoration-gold [&_a]:transition-all [&_a]:duration-200
              [&_blockquote]:border-l-2 [&_blockquote]:border-gold/40 [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:text-cream/50 [&_blockquote]:italic [&_blockquote]:font-display [&_blockquote]:text-lg
              [&_strong]:text-cream [&_strong]:font-medium
              [&_em]:text-cream/80
              [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gold/15 [&_hr]:my-12
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-gold/15">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.2em] text-gold hover:text-cream transition-colors duration-300"
            >
              <span>{isRtl ? '→' : '←'}</span>
              {t('back_to_blog')}
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
