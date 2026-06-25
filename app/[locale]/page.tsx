import { unstable_setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import DrawReveal from '@/components/DrawReveal'
import DistrictsFloat from '@/components/DistrictsFloat'
import VideoZone from '@/components/VideoZone'
import Services from '@/components/Services'
import WhyUs from '@/components/WhyUs'
import Contact from '@/components/Contact'
import WhatsAppButton from '@/components/WhatsAppButton'
import Footer from '@/components/Footer'

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale)

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'New Era Exclusive — Luxury Interior Design Dubai',
    description: 'Premium interior design and exclusive luxury materials in Dubai. Bespoke fit-out for villas, hotels and restaurants across UAE.',
    url: `https://neweraexclusive.ae/${locale}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'New Era Exclusive',
      url: 'https://neweraexclusive.ae',
    },
    inLanguage: locale,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
        suppressHydrationWarning
      />
      <main>
        <Navbar />
        <Hero />
        <Marquee />
        <About />
        <DistrictsFloat />
        <DrawReveal />
        <VideoZone>
          <Services />
          <WhyUs />
          <Contact />
        </VideoZone>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  )
}
