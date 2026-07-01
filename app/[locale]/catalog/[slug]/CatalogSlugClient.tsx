'use client'

import React, { useEffect, useRef, useState } from 'react'
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

function DotPattern({ id }: { id: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
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

// ─── Category data ─────────────────────────────────────────────────────────────

interface CategoryMeta {
  eyebrowKey: string
  descKey: string
  nameKey: string
  placeholderCount: number
}

// Note: 'smart-toilet' is intentionally excluded — it has its own dedicated page.
const CATEGORIES: Record<string, CategoryMeta> = {
  'flexible-marbles': {
    eyebrowKey: 'categories.flexible_marbles.eyebrow',
    nameKey: 'categories.flexible_marbles.name',
    descKey: 'categories.flexible_marbles.description',
    placeholderCount: 6,
  },
  chandeliers: {
    eyebrowKey: 'categories.chandeliers.eyebrow',
    nameKey: 'categories.chandeliers.name',
    descKey: 'categories.chandeliers.description',
    placeholderCount: 6,
  },
  'soft-wall-panels': {
    eyebrowKey: 'categories.soft_wall_panels.eyebrow',
    nameKey: 'categories.soft_wall_panels.name',
    descKey: 'categories.soft_wall_panels.description',
    placeholderCount: 6,
  },
  'smart-dryers': {
    eyebrowKey: 'categories.smart_dryers.eyebrow',
    nameKey: 'categories.smart_dryers.name',
    descKey: 'categories.smart_dryers.description',
    placeholderCount: 4,
  },
}

// ─── Gallery images map ────────────────────────────────────────────────────────

const galleryImages: Record<string, string[]> = {
  'flexible-marbles': [
    '/catalog/flexible-marbles/01.jpeg',
    '/catalog/flexible-marbles/02.jpeg',
    '/catalog/flexible-marbles/03.jpeg',
    '/catalog/flexible-marbles/04.jpeg',
    '/catalog/flexible-marbles/07.jpeg',
    '/catalog/flexible-marbles/14.jpeg',
    '/catalog/flexible-marbles/20.jpeg',
  ],
  'chandeliers': [
    '/catalog/chandeliers/01.jpeg',
    '/catalog/chandeliers/02.jpeg',
    '/catalog/chandeliers/10.jpeg',
    '/catalog/chandeliers/13.jpeg',
    '/catalog/chandeliers/19.jpeg',
    '/catalog/chandeliers/22.jpeg',
  ],
  'soft-wall-panels': [
    '/catalog/soft-wall-panels/01.jpeg',
    '/catalog/soft-wall-panels/02.jpeg',
    '/catalog/soft-wall-panels/03.jpeg',
    '/catalog/soft-wall-panels/04.jpeg',
    '/catalog/soft-wall-panels/05.jpeg',
  ],
  'smart-dryers': [
    '/catalog/smart-dryers/01.jpeg',
    '/catalog/smart-dryers/02.jpeg',
    '/catalog/smart-dryers/03.jpeg',
    '/catalog/smart-dryers/04.jpeg',
  ],
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────────

function Thumb({ index, active, src }: { index: number; active: boolean; src: string | undefined }) {
  return (
    <div
      className={`relative w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer border transition-all duration-300 ${
        active
          ? 'border-gold opacity-100 scale-105'
          : 'border-white/10 opacity-50 hover:opacity-75'
      }`}
    >
      <div className="absolute inset-0 bg-stone">
        {src ? (
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-stat text-[13px] text-cream/20">
            {index + 1}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

function Gallery({ slug, categoryName }: { slug: string; categoryName: string }) {
  const images = galleryImages[slug] ?? []
  const count = images.length || 1

  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [fadingIn, setFadingIn] = useState(true)

  const activeImg = images[active] ?? null
  const prevImg = prev !== null ? (images[prev] ?? null) : null

  function select(idx: number) {
    if (idx === active || transitioning) return
    setPrev(active)
    setTransitioning(true)
    setFadingIn(false)
    setTimeout(() => {
      setActive(idx)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFadingIn(true))
      })
    }, 400)
    setTimeout(() => {
      setPrev(null)
      setTransitioning(false)
    }, 1000)
  }

  return (
    <div>
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone">
        {!activeImg && <DotPattern id="dots-gallery-bg" />}

        {/* Previous image — fades out */}
        {prevImg && (
          <img
            src={prevImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-[2]"
            style={{
              opacity: transitioning ? 0 : 1,
              transition: 'opacity 400ms cubic-bezier(0.32,0.72,0,1)',
            }}
          />
        )}

        {/* Active image — fades in */}
        {activeImg ? (
          <img
            src={activeImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-[3]"
            style={{
              opacity: fadingIn ? 1 : 0,
              transition: 'opacity 600ms cubic-bezier(0.32,0.72,0,1)',
            }}
          />
        ) : (
          <div
            className="absolute inset-0 z-[3] flex items-center justify-center"
            style={{
              opacity: fadingIn ? 1 : 0,
              transition: 'opacity 600ms cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="font-stat text-[clamp(3rem,8vw,6rem)] text-cream/10 select-none">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-cream/20">
                {categoryName}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            className="focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 rounded-xl"
            aria-label={`View image ${i + 1} of ${count}`}
          >
            <Thumb index={i} active={i === active} src={images[i]} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main client component ─────────────────────────────────────────────────────

export default function CatalogSlugClient({ slug }: { slug: string }) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const meta = CATEGORIES[slug]

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

  if (!meta) {
    return (
      <main className="min-h-[100dvh] bg-ink flex items-center justify-center">
        <span className="font-body text-cream/40 text-[13px] uppercase tracking-[0.3em]">
          Category not found
        </span>
      </main>
    )
  }

  const categoryName = t(meta.nameKey as Parameters<typeof t>[0])
  const eyebrowText = t(meta.eyebrowKey as Parameters<typeof t>[0])
  const description = t(meta.descKey as Parameters<typeof t>[0])

  return (
    <main className="min-h-[100dvh] bg-ink overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] overflow-hidden bg-stone">
        <div className="absolute inset-0">
          <DotPattern id="dots-hero" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />

        <DomeGhost />

        <div
          className="absolute ltr:left-6 rtl:right-6 md:ltr:left-14 md:rtl:right-14 top-0 w-[1px] h-[58%] overflow-hidden pointer-events-none z-[2]"
          aria-hidden="true"
        >
          <div
            ref={lineRef}
            className="w-full h-full bg-gold/30"
            style={{ transform: 'translateY(-100%)' }}
          />
        </div>

        <nav
          className="absolute top-28 md:top-32 ltr:left-6 rtl:right-6 md:ltr:left-16 md:rtl:right-16 z-10 flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.3em] text-cream/30"
          aria-label="Breadcrumb"
        >
          <Link
            href={`/${locale}/catalog`}
            className="hover:text-gold/60 transition-colors duration-300"
          >
            {t('breadcrumb_root')}
          </Link>
          <span className="text-cream/20">/</span>
          <span className="text-cream/50">{categoryName}</span>
        </nav>

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

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 md:px-16">
        <div
          ref={contentRef}
          className="reveal grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 max-w-7xl mx-auto"
        >
          <div className="col-span-1 md:col-span-7">
            <Gallery slug={slug} categoryName={categoryName} />
          </div>

          <div className="col-span-1 md:col-span-5 flex flex-col gap-8 md:pt-4">
            <div>
              <span className="block font-body text-[11px] uppercase tracking-[0.3em] text-gold/50 mb-3">
                {t('about_collection')}
              </span>
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-light text-cream mb-5 leading-snug">
                {categoryName}
              </h2>
              <p className="font-body font-light text-cream/65 text-[15px] leading-[1.9]">
                {description}
              </p>
            </div>

            {/* Features list */}
            {(() => {
              const slugKey = slug.replace(/-/g, '_')
              const featKey = `categories.${slugKey}.features` as Parameters<typeof t>[0]
              const raw = t(featKey)
              const items = raw ? raw.split('|') : []
              if (!items.length) return null
              return (
                <div className="flex flex-col gap-3">
                  <span className="font-body text-[10px] uppercase tracking-[0.35em] text-gold/40">
                    {t('features_label')}
                  </span>
                  <ul className="flex flex-col gap-2.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[6px] flex-shrink-0 w-1 h-1 rounded-full bg-gold/50" />
                        <span className="font-body font-light text-cream/60 text-[13px] leading-[1.75]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })()}

            <div
              className="w-full h-[1px]"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)',
              }}
            />

            <div>
              <span className="block font-body text-[13px] uppercase tracking-[0.25em] text-cream/40 mb-6">
                {t('cta_status')}
              </span>

              <a
                href="#contact"
                className="group flex-shrink-0 inline-flex items-center gap-3 border border-gold/35 hover:border-gold hover:bg-gold/8 text-gold font-body text-[13px] tracking-wide px-7 py-3.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
              >
                {t('cta_button')}
                <span className="w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center transition-all duration-500 group-hover:bg-gold/15 group-hover:border-gold/60 ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="rtl:rotate-180"
                  >
                    <path
                      d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
