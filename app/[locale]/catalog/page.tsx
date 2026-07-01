'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function WordReveal({
  text,
  delayStart = 0,
  className = '',
  style,
}: {
  text: string
  delayStart?: number
  className?: string
  style?: React.CSSProperties
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="word-mask">
            <span
              className="word-inner"
              style={{ animationDelay: `${delayStart + i * 0.09}s` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  )
}

// ─── Dot pattern SVG ───────────────────────────────────────────────────────────

function DotPattern({ id }: { id: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#F5EFE0" fillOpacity="0.04" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// ─── Dome ghost SVG ─────────────────────────────────────────────────────────────

function DomeGhost() {
  return (
    <div className="absolute right-[-6%] top-[8%] w-[52vw] max-w-[580px] aspect-square pointer-events-none select-none opacity-[0.04] z-[1] rtl:right-auto rtl:left-[-6%] rtl:scale-x-[-1]">
      <svg viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="230" r="175" stroke="#C9A84C" strokeWidth="0.8" />
        <path d="M200 50 L200 230" stroke="#C9A84C" strokeWidth="0.7" />
        <path d="M60 230 Q200 65 340 230" stroke="#C9A84C" strokeWidth="1.1" />
        <path d="M85 230 Q200 90 315 230" stroke="#C9A84C" strokeWidth="0.7" />
        <path d="M115 230 Q200 115 285 230" stroke="#C9A84C" strokeWidth="0.7" />
        <path d="M145 230 Q200 140 255 230" stroke="#C9A84C" strokeWidth="0.7" />
        <ellipse cx="200" cy="230" rx="140" ry="36" stroke="#C9A84C" strokeWidth="0.5" />
        <ellipse cx="200" cy="230" rx="95" ry="24" stroke="#C9A84C" strokeWidth="0.5" />
        <ellipse cx="200" cy="230" rx="50" ry="12" stroke="#C9A84C" strokeWidth="0.5" />
        <circle cx="200" cy="48" r="3.5" fill="#C9A84C" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

// ─── Category card ─────────────────────────────────────────────────────────────

interface CategoryCardProps {
  slug: string
  locale: string
  name: string
  subEyebrow: string
  revealDelay: number
  imageSrc: string
}

function CategoryCard({ slug, locale, name, subEyebrow, revealDelay, imageSrc }: CategoryCardProps) {
  const ref = useReveal(revealDelay)

  return (
    <div ref={ref} className="reveal h-full">
      <Link
        href={`/${locale}/catalog/${slug}`}
        className="block relative h-full rounded-2xl overflow-hidden group cursor-pointer"
      >
        {/* Real product image */}
        <div className="absolute inset-0 bg-stone">
          <img
            src={imageSrc}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Gold-tinted gradient overlay */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            background:
              'linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Hover overlay — subtle gold wash */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            background:
              'linear-gradient(to top, rgba(201,168,76,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Content — bottom */}
        <div className="absolute bottom-0 ltr:left-0 rtl:right-0 ltr:right-0 rtl:left-0 p-6 md:p-8">
          {/* Sub-eyebrow */}
          <span className="block font-body text-[9px] uppercase tracking-[0.35em] text-gold/45 mb-2">
            {subEyebrow}
          </span>

          {/* Title */}
          <h2 className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-light text-cream group-hover:text-gold transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] leading-snug">
            {name}
          </h2>

          {/* Gold expanding line */}
          <div className="mt-3 h-[1px] bg-gold/60 w-0 group-hover:w-8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ltr:origin-left rtl:origin-right" />
        </div>

        {/* Hover arrow — bottom right (bottom left for RTL) */}
        <div className="absolute bottom-6 ltr:right-6 rtl:left-6 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-gold/60">
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            className="rtl:rotate-180"
          >
            <path
              d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const t = useTranslations('catalog')
  const locale = useLocale()

  // Vertical gold line animation on mount
  const lineRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    el.style.transform = 'translateY(-100%)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'transform 1.6s cubic-bezier(0.32,0.72,0,1)'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  // Eyebrow reveal
  const eyebrowRef = useReveal(200)

  const categories = [
    {
      slug: 'flexible-marbles',
      eyebrow: t('categories.flexible_marbles.eyebrow'),
      name: t('categories.flexible_marbles.name'),
      imageSrc: '/catalog/flexible-marbles/01.jpeg',
      rowIndex: 0,
    },
    {
      slug: 'chandeliers',
      eyebrow: t('categories.chandeliers.eyebrow'),
      name: t('categories.chandeliers.name'),
      imageSrc: '/catalog/chandeliers/01.jpeg',
      rowIndex: 0,
    },
    {
      slug: 'soft-wall-panels',
      eyebrow: t('categories.soft_wall_panels.eyebrow'),
      name: t('categories.soft_wall_panels.name'),
      imageSrc: '/catalog/soft-wall-panels/01.jpeg',
      rowIndex: 1,
    },
    {
      slug: 'smart-toilet',
      eyebrow: t('categories.smart_toilet.eyebrow'),
      name: t('categories.smart_toilet.name'),
      imageSrc: '/catalog/smart-toilet/01.jpeg',
      rowIndex: 1,
    },
    {
      slug: 'smart-dryers',
      eyebrow: t('categories.smart_dryers.eyebrow'),
      name: t('categories.smart_dryers.name'),
      imageSrc: '/catalog/smart-dryers/01.jpeg',
      rowIndex: 1,
    },
  ]

  const rowDelays = [
    [0, 80],       // row 1: card 0, card 1
    [0, 80, 160],  // row 2: card 0, card 1, card 2
  ]

  return (
    <main className="min-h-[100dvh] bg-ink overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] bg-ink overflow-hidden flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24">
        {/* Architectural grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[0]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C9A84C" strokeWidth="0.3" strokeOpacity="0.07" />
            </pattern>
            <pattern id="hero-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#F5EFE0" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>

        {/* Film grain */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[0] opacity-[0.035]" aria-hidden="true">
          <filter id="catalog-hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#catalog-hero-noise)" />
        </svg>

        {/* Gold halo */}
        <div
          className="absolute pointer-events-none z-[0]"
          aria-hidden="true"
          style={{
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70vw',
            height: '45vh',
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
          }}
        />

        {/* Vertical gold line */}
        <div
          className="absolute ltr:left-6 rtl:right-6 md:ltr:left-14 md:rtl:right-14 top-0 w-[1px] h-[58%] overflow-hidden pointer-events-none z-[1]"
          aria-hidden="true"
        >
          <div
            ref={lineRef}
            className="w-full h-full bg-gold/30"
            style={{ transform: 'translateY(-100%)' }}
          />
        </div>

        {/* Dome ghost */}
        <DomeGhost />

        {/* Hero content */}
        <div className="relative z-[2] flex flex-col gap-5 pt-32 md:pt-40">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="reveal flex items-center gap-3">
            <div className="w-7 h-[1px] bg-gold/50" />
            <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">
              {t('eyebrow')}
            </span>
          </div>

          {/* H1 */}
          <h1 className="flex flex-col gap-1">
            <WordReveal
              text={t('hero_line1')}
              delayStart={0.35}
              className="block text-[clamp(2.6rem,11.5vw,9rem)] font-light text-cream/90 font-display leading-[0.92]"
            />
            <WordReveal
              text={t('hero_line2')}
              delayStart={0.55}
              className="block text-[clamp(2.6rem,11.5vw,9rem)] italic text-gold font-display leading-[0.92]"
            />
          </h1>
        </div>
      </section>

      {/* ── Category grid ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Row 1 — три маленькие карточки */}
          <div className="col-span-1 md:col-span-4 aspect-[4/3] md:aspect-square">
            <CategoryCard
              slug={categories[2].slug}
              locale={locale}
              name={categories[2].name}
              subEyebrow={categories[2].eyebrow}
              revealDelay={rowDelays[1][0]}
              imageSrc={categories[2].imageSrc}
            />
          </div>
          <div className="col-span-1 md:col-span-4 aspect-[4/3] md:aspect-square">
            <CategoryCard
              slug={categories[3].slug}
              locale={locale}
              name={categories[3].name}
              subEyebrow={categories[3].eyebrow}
              revealDelay={rowDelays[1][1]}
              imageSrc={categories[3].imageSrc}
            />
          </div>
          <div className="col-span-1 md:col-span-4 aspect-[4/3] md:aspect-square">
            <CategoryCard
              slug={categories[4].slug}
              locale={locale}
              name={categories[4].name}
              subEyebrow={categories[4].eyebrow}
              revealDelay={rowDelays[1][2]}
              imageSrc={categories[4].imageSrc}
            />
          </div>

          {/* Row 2 — две большие карточки */}
          <div className="col-span-1 md:col-span-7 aspect-[4/3] md:aspect-[16/10]">
            <CategoryCard
              slug={categories[0].slug}
              locale={locale}
              name={categories[0].name}
              subEyebrow={categories[0].eyebrow}
              revealDelay={rowDelays[0][0]}
              imageSrc={categories[0].imageSrc}
            />
          </div>
          <div className="col-span-1 md:col-span-5 aspect-[4/3] md:aspect-[16/10]">
            <CategoryCard
              slug={categories[1].slug}
              locale={locale}
              name={categories[1].name}
              subEyebrow={categories[1].eyebrow}
              revealDelay={rowDelays[0][1]}
              imageSrc={categories[1].imageSrc}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
