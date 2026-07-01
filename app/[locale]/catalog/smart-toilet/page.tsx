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

        {/* Status */}
        <span className="mt-auto pt-1 font-body text-[10px] uppercase tracking-[0.25em] text-gold/50">
          {t('cta_status')}
        </span>
      </div>
    </Link>
  )
}

function AccordionSection({
  id,
  label,
  models,
  isOpen,
  onToggle,
  locale,
  t,
}: {
  id: string
  label: string
  models: SmartToiletModel[]
  isOpen: boolean
  onToggle: () => void
  locale: string
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 md:py-8 group text-left"
      >
        <div className="flex items-center gap-4">
          <span className="font-display text-[clamp(1.3rem,3vw,2rem)] font-light text-cream group-hover:text-gold transition-colors duration-300">
            {label}
          </span>
          <span className="font-body text-[11px] text-cream/30 tracking-wider">
            {models.length}
          </span>
        </div>
        {/* Chevron */}
        <div
          className={`w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all duration-500 group-hover:border-gold/40 ${
            isOpen ? 'rotate-180 border-gold/40 bg-gold/[0.08]' : ''
          }`}
        >
          <svg width="13" height="8" viewBox="0 0 13 8" fill="none">
            <path
              d="M1 1.5L6.5 6.5L12 1.5"
              stroke={isOpen ? '#C9A84C' : 'rgba(245,239,224,0.4)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Collapsible grid */}
      <div
        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'max-h-[9999px] opacity-100 pb-12' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} locale={locale} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SmartToiletPage() {
  const t = useTranslations('catalog')
  const locale = useLocale()

  const [filter, setFilter] = useState<'all' | 'floor' | 'wall'>('all')
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

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

  const eyebrowRef = useReveal(200)
  const contentRef = useReveal(100)

  const categoryName = t('categories.smart_toilet.name')
  const eyebrowText = t('categories.smart_toilet.eyebrow')

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <main className="min-h-[100dvh] bg-ink overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] overflow-hidden bg-stone">
        <div className="absolute inset-0">
          <DotPattern id="dots-st-hero" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <DomeGhost />

        {/* Vertical gold line */}
        <div
          className="absolute ltr:left-6 rtl:right-6 md:ltr:left-14 md:rtl:right-14 top-0 w-[1px] h-[58%] overflow-hidden pointer-events-none z-[2]"
          aria-hidden="true"
        >
          <div ref={lineRef} className="w-full h-full bg-gold/30" style={{ transform: 'translateY(-100%)' }} />
        </div>

        {/* Breadcrumb */}
        <nav
          className="absolute top-28 md:top-32 ltr:left-6 rtl:right-6 md:ltr:left-16 md:rtl:right-16 z-10 flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.3em] text-cream/30"
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}/catalog`} className="hover:text-gold/60 transition-colors duration-300">
            {t('breadcrumb_root')}
          </Link>
          <span className="text-cream/20">/</span>
          <span className="text-cream/50">{categoryName}</span>
        </nav>

        {/* Hero content */}
        <div className="relative z-[3] flex flex-col justify-end min-h-[70vh] pb-20 px-6 md:px-16">
          <div className="flex flex-col gap-5">
            <div ref={eyebrowRef} className="reveal flex items-center gap-3">
              <div className="w-7 h-[1px] bg-gold/50" />
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">
                {eyebrowText}
              </span>
            </div>
            <h1>
              <WordReveal
                text={categoryName}
                delayStart={0.35}
                className="block text-[clamp(2.6rem,7vw,5.5rem)] font-light text-cream font-display leading-[0.92]"
              />
            </h1>
          </div>
        </div>
      </section>

      {/* ── Filter + Accordion ───────────────────────────────────────────────── */}
      <section
        ref={contentRef}
        className="reveal py-16 md:py-24 px-6 md:px-16 max-w-[1400px] mx-auto"
      >
        {/* Filter buttons */}
        <div className="flex gap-2 md:gap-3 mb-12 md:mb-16 flex-wrap">
          {(['all', 'floor', 'wall'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
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
                : t('smart_toilet_filter_wall')}
            </button>
          ))}
        </div>

        {/* Sections — accordion when filter = 'all', flat grid otherwise */}
        {filter === 'all' && (
          <div className="flex flex-col gap-0 divide-y divide-white/[0.06]">
            <AccordionSection id="floor" label={t('smart_toilet_section_floor')} models={floorModels} isOpen={!!openSections['floor']} onToggle={() => toggleSection('floor')} locale={locale} t={t} />
            <AccordionSection id="wall" label={t('smart_toilet_section_wall')} models={wallModels} isOpen={!!openSections['wall']} onToggle={() => toggleSection('wall')} locale={locale} t={t} />
            <AccordionSection id="bidet" label={t('smart_toilet_section_bidet')} models={bidetModels} isOpen={!!openSections['bidet']} onToggle={() => toggleSection('bidet')} locale={locale} t={t} />
          </div>
        )}

        {filter === 'floor' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {floorModels.map(model => <ModelCard key={model.id} model={model} locale={locale} t={t} />)}
          </div>
        )}

        {filter === 'wall' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {wallModels.map(model => <ModelCard key={model.id} model={model} locale={locale} t={t} />)}
          </div>
        )}
      </section>
    </main>
  )
}
