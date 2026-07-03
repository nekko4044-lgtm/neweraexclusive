'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'

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
    '/catalog/flexible-marbles/top-picks/page009_img03.png',
    '/catalog/flexible-marbles/top-picks/page021_img02.png',
    '/catalog/flexible-marbles/top-picks/page024_img01.png',
    '/catalog/flexible-marbles/top-picks/page024_img03.png',
    '/catalog/flexible-marbles/top-picks/page024_img04.png',
    '/catalog/flexible-marbles/top-picks/page024_img05.png',
    '/catalog/flexible-marbles/top-picks/page025_img01.png',
    '/catalog/flexible-marbles/top-picks/page025_img02.png',
    '/catalog/flexible-marbles/top-picks/page025_img04.png',
    '/catalog/flexible-marbles/top-picks/page025_img05.png',
    '/catalog/flexible-marbles/top-picks/page026_img01.png',
    '/catalog/flexible-marbles/top-picks/page026_img02.png',
    '/catalog/flexible-marbles/top-picks/page026_img03.png',
    '/catalog/flexible-marbles/top-picks/page026_img04.png',
  ],
  'chandeliers': [
    '/catalog/chandeliers/page027_img01.png',
    '/catalog/chandeliers/page028_img01.png',
    '/catalog/chandeliers/page029_img01.png',
    '/catalog/chandeliers/page029_img02.png',
    '/catalog/chandeliers/page029_img03.png',
    '/catalog/chandeliers/page029_img04.png',
    '/catalog/chandeliers/page030_img02.png',
    '/catalog/chandeliers/page030_img03.png',
    '/catalog/chandeliers/page031_img01.png',
    '/catalog/chandeliers/page032_img01.png',
    '/catalog/chandeliers/page032_img02.png',
    '/catalog/chandeliers/page034_img01.png',
    '/catalog/chandeliers/page035_img02.png',
    '/catalog/chandeliers/photo_2026-07-03 21.24.16.jpeg',
    '/catalog/chandeliers/photo_2026-07-03 21.24.40.jpeg',
    '/catalog/chandeliers/photo_2026-07-03 21.25.43.jpeg',
  ],
  'soft-wall-panels': [
    '/catalog/soft-wall-panels/page036_img01.png',
    '/catalog/soft-wall-panels/page037_img01.png',
    '/catalog/soft-wall-panels/page037_img02.png',
    '/catalog/soft-wall-panels/page037_img03.png',
  ],
  'smart-dryers': [
    '/catalog/smart-dryers/page041_img02.png',
    '/catalog/smart-dryers/page042_img01.png',
    '/catalog/smart-dryers/page043_img01.png',
    '/catalog/smart-dryers/photo_2026-07-03 21.25.09.jpeg',
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
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone">
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

      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gold/70">
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

// ── Interior Gallery (horizontal film strip) ──────────────────────────────

const INTERIOR_IMAGES: Record<string, string[]> = {
  'flexible-marbles': [
    '/catalog/flexible-marbles/interior/page013_img01.png',
    '/catalog/flexible-marbles/interior/page014_img01.png',
    '/catalog/flexible-marbles/interior/page014_img02.png',
    '/catalog/flexible-marbles/interior/page015_img01.png',
    '/catalog/flexible-marbles/interior/page015_img02.png',
    '/catalog/flexible-marbles/interior/page015_img03.png',
    '/catalog/flexible-marbles/interior/page016_img01.png',
    '/catalog/flexible-marbles/interior/page016_img02.png',
    '/catalog/flexible-marbles/interior/page017_img01.png',
    '/catalog/flexible-marbles/interior/page017_img02.png',
    '/catalog/flexible-marbles/interior/page018_img01.png',
    '/catalog/flexible-marbles/interior/page019_img04.png',
    '/catalog/flexible-marbles/interior/page020_img03.png',
    '/catalog/flexible-marbles/interior/page022_img02.png',
    '/catalog/flexible-marbles/interior/page022_img03.png',
    '/catalog/flexible-marbles/interior/page023_img01.png',
    '/catalog/flexible-marbles/interior/page023_img02.png',
    '/catalog/flexible-marbles/interior/photo_2026-07-03 21.25.32.jpeg',
    '/catalog/flexible-marbles/interior/photo_2026-07-03 21.25.53.jpeg',
  ],
}

function InteriorMobileSwiper({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

  const cardVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '110%' : '-110%', opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.42, ease: EASE } },
    exit: (dir: number) => ({ x: dir > 0 ? '-110%' : '110%', opacity: 0, scale: 0.88, transition: { duration: 0.32, ease: EASE } }),
  }

  const go = (delta: number) => {
    setDirection(delta)
    setCurrent(c => (c + delta + photos.length) % photos.length)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full" style={{ paddingTop: '72%' }}>
        {[2, 1].map(offset => {
          const idx = (current + offset) % photos.length
          return (
            <div key={`bg-${offset}-${idx}`} className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.05]"
              style={{ transform: `scale(${1 - offset * 0.045}) translateY(${offset * 11}px)`, zIndex: 10 - offset, opacity: 0.45 - offset * 0.12 }}>
              <img src={photos[idx]} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          )
        })}
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div key={current} custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit"
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
            onDragEnd={(_, info) => { if (info.offset.x < -55) go(1); else if (info.offset.x > 55) go(-1) }}
            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/[0.12] touch-none select-none"
            style={{ zIndex: 20, cursor: 'grab' }} whileTap={{ scale: 1.01 }}>
            <img src={photos[current]} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-gold/35" />
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-gold/35" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={() => go(-1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-cream/35 hover:text-gold hover:border-gold/30 transition-all duration-300 active:scale-95">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2L3.5 6.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="flex items-center gap-3">
          <span className="font-body text-[10px] tracking-[0.3em] text-cream/40">{String(current + 1).padStart(2, '0')}</span>
          <div className="w-20 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
            <motion.div className="absolute inset-y-0 left-0 bg-gold/50 rounded-full" animate={{ width: `${((current + 1) / photos.length) * 100}%` }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }} />
          </div>
          <span className="font-body text-[10px] tracking-[0.3em] text-cream/20">{String(photos.length).padStart(2, '0')}</span>
        </div>
        <button onClick={() => go(1)} className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-cream/35 hover:text-gold hover:border-gold/30 transition-all duration-300 active:scale-95">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 2L9.5 6.5L4.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <p className="text-center font-body text-[9px] uppercase tracking-[0.3em] text-cream/18">swipe to explore</p>
    </div>
  )
}

function InteriorDesktopStrip({ photos }: { photos: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(-3000)
  const [progress, setProgress] = useState(0)
  const x = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      if (containerRef.current && trackRef.current) {
        const max = -(trackRef.current.scrollWidth - containerRef.current.clientWidth + 1)
        setMaxDrag(Math.min(-10, max))
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    return x.on('change', v => {
      setProgress(Math.min(1, Math.max(0, Math.abs(v) / Math.abs(maxDrag))))
    })
  }, [x, maxDrag])

  return (
    <div className="flex flex-col gap-5">
      <div ref={containerRef} className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
        <motion.div ref={trackRef} drag="x" dragConstraints={{ left: maxDrag, right: 0 }} dragElastic={0.04}
          dragTransition={{ timeConstant: 220, power: 0.28 }} style={{ x, cursor: 'grab' }} whileDrag={{ cursor: 'grabbing' }}
          className="flex gap-4 px-16 w-fit py-3 select-none">
          {photos.map((src, i) => (
            <div key={src} className="relative flex-shrink-0 w-[360px] h-[268px] rounded-2xl overflow-hidden border border-white/8 bg-stone group">
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-3.5 right-4 font-body text-[9px] tracking-[0.25em] text-cream/25">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="px-16">
        <div className="h-[1px] bg-white/8 relative overflow-hidden rounded-full">
          <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/30 to-gold/60 rounded-full"
            animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ duration: 0.08 }} />
        </div>
      </div>
    </div>
  )
}

function InteriorGallery({ slug, locale }: { slug: string; locale: string }) {
  const photos = INTERIOR_IMAGES[slug]
  if (!photos || photos.length === 0) return null

  const label = locale === 'ru' ? 'В интерьере' : locale === 'ar' ? 'في الداخل' : 'In Interior'

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-7 h-[1px] bg-gold/50" />
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">{label}</span>
        </div>
        <div className="flex justify-end">
          <span className="hidden md:flex items-center gap-2 font-body text-[9px] uppercase tracking-[0.3em] text-cream/22">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="opacity-40">
              <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            drag
          </span>
        </div>
      </div>
      <div className="md:hidden px-6">
        <InteriorMobileSwiper photos={photos} />
      </div>
      <div className="hidden md:block">
        <InteriorDesktopStrip photos={photos} />
      </div>
    </section>
  )
}

// ─── Main client component ─────────────────────────────────────────────────────

export default function CatalogSlugClient({ slug }: { slug: string }) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const meta = CATEGORIES[slug]

  const lineRef = useRef<HTMLDivElement>(null)
  const bgOverlayRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLDivElement>(null)

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
    <div className="relative">
      {/* Fixed background */}
      <div className="fixed top-0 left-0 w-full h-[100svh] overflow-hidden z-0">
        <img
          src="/catalog/flexible-marbles/bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darkening overlay — starts at 0.35, driven by scroll up to 0.88 */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 bg-ink pointer-events-none"
          style={{ opacity: 0.35 }}
        />
        {/* Gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-transparent pointer-events-none" />

          {/* Hero title — fades out on scroll */}
          <div
            ref={heroTitleRef}
            className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24"
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Breadcrumb */}
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
                <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">
                  {eyebrowText}
                </span>
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

        {/* Spacer — pushes content below the fixed viewport */}
        <div className="h-[100svh]" />

        {/* Scrollable content — floats over the fixed bg */}
        <div className="relative z-10">
          {/* ── Main content ────────────────────────────────────────────── */}
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

                <div className="w-full h-[1px]" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />

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
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="rtl:rotate-180">
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <InteriorGallery slug={slug} locale={locale} />
        </div>
      </div>
    )
}
