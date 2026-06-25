import { MetadataRoute } from 'next'

const BASE = 'https://neweraexclusive.ae'
const lastModified = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/ru`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE}/ar`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ]
}
