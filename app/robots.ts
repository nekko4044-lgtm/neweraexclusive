import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/.next', '/private'],
      },
    ],
    sitemap: 'https://neweraexclusive.ae/sitemap.xml',
  }
}
