import { enPosts } from './blog-en'
import { ruPosts } from './blog-ru'
import { arPosts } from './blog-ar'

export interface BlogPost {
  slug: string
  locale: string
  title: string
  excerpt: string
  date: string        // ISO: "2026-06-28"
  readTime: number
  category: string
  content: string     // HTML
}

export const blogPosts: BlogPost[] = [...enPosts, ...ruPosts, ...arPosts]

export function getPostsByLocale(locale: string): BlogPost[] {
  const today = new Date()
  return blogPosts
    .filter(p => p.locale === locale && new Date(p.date) <= today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string, locale: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug && p.locale === locale)
}

export function getAllSlugs(): { slug: string; locale: string }[] {
  return blogPosts.map(p => ({ slug: p.slug, locale: p.locale }))
}
