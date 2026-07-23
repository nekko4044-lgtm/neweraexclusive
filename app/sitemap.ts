import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'

const BASE = 'https://neweraexclusive.ae'
const lastModified = new Date()
const locales = ['en', 'ru', 'ar'] as const

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

  return [...homePages, ...blogIndexPages, ...blogPostPages]
}
