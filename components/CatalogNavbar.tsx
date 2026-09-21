'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'ar', label: 'AR' },
]

const homeLabels: Record<string, string> = {
  en: 'Home',
  ru: 'Главная',
  ar: 'الرئيسية',
}

export default function CatalogNavbar() {
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const homeLabel = homeLabels[locale] ?? 'Home'

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <nav
        className={`
          flex items-center gap-4 px-4 py-2.5 rounded-full border border-white/10
          transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${scrolled
            ? 'bg-ink/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-white/5 backdrop-blur-sm'}
        `}
      >
        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image
            src="/logo.webp"
            alt="New Era"
            width={40}
            height={40}
            className="rounded-full ring-1 ring-gold/30"
          />
        </Link>

        {/* Home link */}
        <Link
          href={`/${locale}`}
          className="font-body text-[11px] uppercase tracking-[0.2em] text-cream/60 hover:text-cream/90 transition-colors duration-300 whitespace-nowrap"
        >
          {homeLabel}
        </Link>

        {/* Divider */}
        <span className="w-[1px] h-4 bg-white/10 flex-shrink-0" aria-hidden="true" />

        {/* Language switcher */}
        <div className="flex gap-1">
          {locales.map((l) => (
            <Link
              key={l.code}
              href={`/${l.code}/catalog`}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-all duration-300 font-body ${
                locale === l.code
                  ? 'text-gold font-medium'
                  : 'text-cream/40 hover:text-cream/70'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
