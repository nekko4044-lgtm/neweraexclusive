'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

const neighborhoods = [
  { name: 'Bluewaters Island',  desktop: '/hero/bluewaters.webp',   mobile: '/hero/bluewaters-mobile.webp' },
  { name: '22 Carat',           desktop: '/hero/22carat.webp',      mobile: '/hero/22carat-mobile.webp' },
  { name: 'Dubai Hills Estate', desktop: '/hero/dubailhills.webp',  mobile: '/hero/dubailhills-mobile.webp' },
  { name: 'W Residences',       desktop: '/hero/wresidences.webp',  mobile: '/hero/wresidences-mobile.webp' },
  { name: 'Palm Jumeirah',      desktop: '/hero/palmjumeirah.webp', mobile: '/hero/palmjumeirah-mobile.webp' },
  { name: 'Abu Dhabi Islands',  desktop: '/hero/abudhabi.webp',     mobile: '/hero/abudhabi-mobile.webp' },
]

function WordReveal({ text, delayStart = 0, className = '', style }: {
  text: string; delayStart?: number; className?: string; style?: React.CSSProperties
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
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

function SlideBackground({ desktopSrc, mobileSrc, name, visible, onReady }: {
  desktopSrc: string; mobileSrc: string; name: string; visible: boolean; onReady?: () => void
}) {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current?.complete) onReady?.()
  }, [desktopSrc, mobileSrc, onReady])

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <picture className="absolute inset-0 block">
        <source media="(min-width: 768px)" srcSet={desktopSrc} type="image/webp" />
        <img
          ref={imageRef}
          src={mobileSrc}
          alt={name}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onLoad={onReady}
        />
      </picture>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/85" />
    </div>
  )
}

export default function Hero() {
  const t = useTranslations('hero')
  const lineRef   = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  const [outgoingSlide, setOutgoingSlide] = useState<number | null>(null)
  const [incomingReady, setIncomingReady] = useState(true)
  const slideRef = useRef(0)
  const activeNeighborhood = neighborhoods[slide]

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    setVh()
  }, [])

  const revealIncoming = useCallback(() => setIncomingReady(true), [])

  const goTo = useCallback((target: number) => {
    if (target === slideRef.current) return

    setOutgoingSlide(slideRef.current)
    setIncomingReady(false)
    slideRef.current = target
    setSlide(target)
  }, [])

  const next = useCallback(() => goTo((slideRef.current + 1) % neighborhoods.length), [goTo])
  const prev = useCallback(() => goTo((slideRef.current - 1 + neighborhoods.length) % neighborhoods.length), [goTo])

  useEffect(() => {
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [next])

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const preload = (index: number) => {
      const image = new window.Image()
      image.src = isDesktop ? neighborhoods[index].desktop : neighborhoods[index].mobile
    }

    preload((slide + 1) % neighborhoods.length)
    preload((slide - 1 + neighborhoods.length) % neighborhoods.length)
  }, [slide])

  useEffect(() => {
    if (outgoingSlide === null || !incomingReady) return

    const timer = window.setTimeout(() => setOutgoingSlide(null), 1050)
    return () => window.clearTimeout(timer)
  }, [incomingReady, outgoingSlide])

  const touchStartX = useRef(0)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }, [next, prev])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lineRef.current) lineRef.current.style.transform = 'translateY(0)'
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 overflow-hidden"
      style={{ minHeight: 'calc(var(--vh, 1svh) * 100)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {outgoingSlide !== null && (
          <SlideBackground
            key={`outgoing-${neighborhoods[outgoingSlide].name}`}
            desktopSrc={neighborhoods[outgoingSlide].desktop}
            mobileSrc={neighborhoods[outgoingSlide].mobile}
            name={neighborhoods[outgoingSlide].name}
            visible={!incomingReady}
          />
        )}
        <SlideBackground
          key={`incoming-${activeNeighborhood.name}`}
          desktopSrc={activeNeighborhood.desktop}
          mobileSrc={activeNeighborhood.mobile}
          name={activeNeighborhood.name}
          visible={incomingReady}
          onReady={revealIncoming}
        />
      </div>

      {/* Dome ghost */}
      <div className="absolute right-[-6%] top-[8%] w-[52vw] max-w-[580px] aspect-square pointer-events-none select-none opacity-[0.04] z-[1]">
        <svg viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="230" r="175" stroke="#C9A84C" strokeWidth="0.8"/>
          <path d="M200 50 L200 230" stroke="#C9A84C" strokeWidth="0.7"/>
          <path d="M60 230 Q200 65 340 230" stroke="#C9A84C" strokeWidth="1.1"/>
          <path d="M85 230 Q200 90 315 230" stroke="#C9A84C" strokeWidth="0.7"/>
          <path d="M115 230 Q200 115 285 230" stroke="#C9A84C" strokeWidth="0.7"/>
          <path d="M145 230 Q200 140 255 230" stroke="#C9A84C" strokeWidth="0.7"/>
          <ellipse cx="200" cy="230" rx="140" ry="36" stroke="#C9A84C" strokeWidth="0.5"/>
          <ellipse cx="200" cy="230" rx="95"  ry="24" stroke="#C9A84C" strokeWidth="0.5"/>
          <ellipse cx="200" cy="230" rx="50"  ry="12" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle  cx="200" cy="48"  r="3.5"  fill="#C9A84C" fillOpacity="0.5"/>
        </svg>
      </div>

      {/* Vertical gold line */}
      <div className="absolute left-6 md:left-14 top-0 w-[1px] h-[58%] overflow-hidden pointer-events-none z-[1]">
        <div
          ref={lineRef}
          style={{
            height: '100%',
            transform: 'translateY(-100%)',
            transition: 'transform 1.6s cubic-bezier(0.32,0.72,0,1)',
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5) 40%, rgba(201,168,76,0.3) 70%, transparent)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-[2] max-w-5xl">

        <div
          className="flex items-center gap-3 mb-7"
          style={{ animation: 'fade-up 0.7s cubic-bezier(0.32,0.72,0,1) 0.2s both' }}
        >
          <div className="w-7 h-[1px] bg-gold/50" />
          <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">{t('eyebrow')}</span>
        </div>

        <h1 className="font-display leading-[0.88] mb-9">
          <WordReveal
            text={t('headline1')}
            delayStart={0.35}
            className="block text-[clamp(2.6rem,11.5vw,9rem)] font-light text-cream/90"
          />
          <WordReveal
            text={t('headline2')}
            delayStart={0.55}
            className="block text-[clamp(2.6rem,11.5vw,9rem)] italic"
            style={{ color: '#C9A84C' }}
          />
        </h1>

        <div
          className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-14"
          style={{ animation: 'fade-up 0.9s cubic-bezier(0.32,0.72,0,1) 0.85s both' }}
        >
          <p className="font-body font-light text-cream/40 text-sm md:text-[15px] leading-[1.85] max-w-[280px]">
            {t('sub')}
          </p>
          <a
            href="#contact"
            className="group flex-shrink-0 inline-flex items-center gap-3 border border-gold/35 hover:border-gold hover:bg-gold/8 text-gold font-body text-[13px] tracking-wide px-7 py-3.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
          >
            {t('cta')}
            <span className="w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center transition-all duration-500 group-hover:bg-gold/15 group-hover:border-gold/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Neighborhood navigator — bottom left */}
      <div
        className="absolute bottom-8 left-6 md:left-16 z-[2] flex items-center gap-4"
        style={{ animation: 'fade-up 0.8s cubic-bezier(0.32,0.72,0,1) 1.8s both' }}
      >
        <button
          onClick={prev}
          aria-label="Previous"
          className="text-cream/25 hover:text-gold/70 transition-colors duration-300 p-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex flex-col gap-1.5">
          <span className="font-body text-[9px] uppercase tracking-[0.35em] text-gold/35 leading-none">
            Location
          </span>
          <span className="font-body text-[11px] uppercase tracking-[0.2em] text-cream/45 leading-none min-w-[140px] transition-all duration-500">
            {neighborhoods[slide].name}
          </span>
        </div>

        <button
          onClick={next}
          aria-label="Next"
          className="text-cream/25 hover:text-gold/70 transition-colors duration-300 p-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5 ml-1">
          {neighborhoods.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                i === slide ? 'w-4 h-[3px] bg-gold/60' : 'w-[3px] h-[3px] bg-cream/20 hover:bg-cream/40'
              }`}
              aria-label={neighborhoods[i].name}
            />
          ))}
        </div>
      </div>


    </section>
  )
}
