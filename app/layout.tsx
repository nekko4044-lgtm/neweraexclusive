import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://neweraexclusive.ae'),
  title: { default: 'New Era Exclusive — Luxury Interior Design Dubai', template: '%s | New Era Exclusive' },
  description: 'Premium interior design and exclusive luxury materials in Dubai. Bespoke fit-out for villas, hotels and restaurants across UAE.',
  keywords: ['luxury interior design dubai', 'interior design uae', 'bespoke fit-out dubai', 'luxury materials dubai', 'exclusive interiors uae'],
  openGraph: { type: 'website', siteName: 'New Era Exclusive', locale: 'en_AE' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
