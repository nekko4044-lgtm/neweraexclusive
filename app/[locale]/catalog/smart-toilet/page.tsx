'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { floorModels, wallModels, bidetModels } from './modelData'
import type { SmartToiletModel } from './modelData'

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
}: {
  text: string
  delayStart?: number
  className?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="word-mask">
            <span className="word-inner" style={{ animationDelay: `${delayStart + i * 0.09}s` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  )
}

function DotPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#F5EFE0" fillOpacity="0.04" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

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

// ─── Sub-components ────────────────────────────────────────────────────────────

function ModelCard({
  model,
  locale,
  t,
}: {
  model: SmartToiletModel
  locale: string
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <Link
      href={`/${locale}/catalog/smart-toilet/${model.id}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-stone/40 border border-white/[0.05] hover:border-gold/20 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone/60">
        <img
          src={model.imageSrc}
          alt={t(model.nameKey as Parameters<typeof t>[0])}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.opacity = '0.3'
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2.5">
        <span className="font-display text-[clamp(0.9rem,1.5vw,1.1rem)] font-light text-cream leading-snug">
          {t(model.nameKey as Parameters<typeof t>[0])}
        </span>

        {/* Color swatches */}
        {model.colors && model.colors.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {model.colors.map((c) => (
              <div
                key={c.id}
                title={c.label}
                className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

      </div>
    </Link>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SmartToiletPage() {
  const t = useTranslations('catalog')
  const locale = useLocale()

  const [filter, setFilter] = useState<'all' | 'floor' | 'wall' | 'bidet'>('all')

  const bgOverlayRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)
  const contentRef = useReveal(100)

  // Restore filter from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('smartToiletFilter') as 'all' | 'floor' | 'wall' | 'bidet' | null
    if (saved) setFilter(saved)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (bgOverlayRef.current) bgOverlayRef.current.style.opacity = '0.35'
    if (heroTitleRef.current) {
      heroTitleRef.current.style.opacity = '1'
      heroTitleRef.current.style.transform = 'translateY(0)'
    }
    const handler = () => {
      const progress = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
      if (bgOverlayRef.current) bgOverlayRef.current.style.opacity = String(0.35 + progress * 0.53)
      if (heroTitleRef.current) {
        heroTitleRef.current.style.opacity = String(1 - progress * 1.5)
        heroTitleRef.current.style.transform = `translateY(${-progress * 40}px)`
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const categoryName = t('categories.smart_toilet.name')
  const eyebrowText = t('categories.smart_toilet.eyebrow')

  function handleFilterChange(f: 'all' | 'floor' | 'wall' | 'bidet') {
    setFilter(f)
    sessionStorage.setItem('smartToiletFilter', f)
  }

  return (
    <div className="relative">
      {/* Fixed background */}
      <div className="fixed top-0 left-0 w-full h-[100svh] overflow-hidden z-0">
        <img
          src="/catalog/flexible-marbles/bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div ref={bgOverlayRef} className="absolute inset-0 bg-ink pointer-events-none" style={{ opacity: 0.35 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-transparent pointer-events-none" />

        {/* Hero title */}
        <div
          ref={heroTitleRef}
          className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24"
          style={{ willChange: 'opacity, transform' }}
        >
          <nav className="absolute top-28 md:top-32 ltr:left-6 rtl:right-6 md:ltr:left-16 md:rtl:right-16 flex items-center gap-2 font-body text-[14px] uppercase tracking-[0.2em] text-cream/40" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
            <Link href={`/${locale}/catalog`} className="hover:text-gold/80 transition-colors duration-300">
              {t('breadcrumb_root')}
            </Link>
            <span className="text-cream/25">/</span>
            <span className="text-cream/70">{categoryName}</span>
          </nav>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-[1px] bg-gold/50" />
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">{eyebrowText}</span>
            </div>
            <h1 style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 6px 48px rgba(0,0,0,0.7)', wordSpacing: '-0.12em' }}>
              <WordReveal
                text={categoryName}
                delayStart={0.35}
                className="block text-[clamp(3.4rem,10vw,8rem)] font-light text-cream font-display leading-[0.88]"
              />
            </h1>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[100svh]" />

      {/* Scrollable content */}
      <div className="relative z-10">
        {/* ── Filter + Grid ──────────────────────────────────────────────────── */}
        <section
          ref={contentRef}
          className="reveal py-16 md:py-24 px-6 md:px-16 max-w-[1400px] mx-auto"
        >
        {/* Filter buttons */}
        <div className="flex gap-2 md:gap-3 mb-12 md:mb-16 flex-wrap">
          {(['all', 'floor', 'wall', 'bidet'] as const).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-5 py-2.5 rounded-full font-body text-[12px] uppercase tracking-[0.25em] transition-all duration-300 border ${
                filter === f
                  ? 'bg-gold/15 border-gold text-gold'
                  : 'border-white/15 text-cream/40 hover:border-white/30 hover:text-cream/65'
              }`}
            >
              {f === 'all'
                ? t('smart_toilet_filter_all')
                : f === 'floor'
                ? t('smart_toilet_filter_floor')
                : f === 'wall'
                ? t('smart_toilet_filter_wall')
                : t('smart_toilet_filter_bidet')}
            </button>
          ))}
        </div>

        {/* Models grid */}
        {(() => {
          const models = filter === 'floor' ? floorModels
            : filter === 'wall' ? wallModels
            : filter === 'bidet' ? bidetModels
            : [...floorModels, ...wallModels, ...bidetModels]
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {models.map(model => <ModelCard key={model.id} model={model} locale={locale} t={t} />)}
            </div>
          )
        })()}
        </section>
      </div>
    </div>
  )
}
