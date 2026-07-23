import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'

const BASE = 'https://neweraexclusive.ae'
const lastModified = new Date()
const locales = ['en', 'ru', 'ar'] as const
const catalogSlugs = ['flexible-marbles', 'chandeliers', 'soft-wall-panels', 'smart-dryers']

export default function sitemap(): MetadataRoute.Sitemap {
  const homePages: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${BASE}/${locale}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === 'en' ? 1.0 : 0.95,
  }))

  const blogIndexPages: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${BASE}/${locale}/blog`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${BASE}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const catalogIndexPages: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${BASE}/${locale}/catalog`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const catalogSlugPages: MetadataRoute.Sitemap = locales.flatMap(locale =>
    catalogSlugs.map(slug => ({
      url: `${BASE}/${locale}/catalog/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  const smartToiletPage: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${BASE}/${locale}/catalog/smart-toilet`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...homePages, ...catalogIndexPages, ...catalogSlugPages, ...smartToiletPage, ...blogIndexPages, ...blogPostPages]
}
