'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const TOTAL_FRAMES = 121
const VIDEO_END    = 0.45   // video finishes at 45% scroll
// Cards appear at: 50%, 62%, 74%, 86%
const CARD_AT      = [0.50, 0.62, 0.74, 0.86]
const CARD_RANGE   = 0.07   // each card fades in over 7% of scroll

function frameSrc(i: number) {
  return `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`
}

export default function ScrollScrubbing() {
  const t = useTranslations('why')

  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const framesRef  = useRef<HTMLImageElement[]>([])
  const drawnIdx   = useRef(-1)
  const rafId      = useRef(0)
  const cssW       = useRef(0)
  const cssH       = useRef(0)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])
  const labelRef   = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  const cards = [
    { num: '01', title: t('w1title'), body: t('w1body') },
    { num: '02', title: t('w2title'), body: t('w2body') },
    { num: '03', title: t('w3title'), body: t('w3body') },
    { num: '04', title: t('w4title'), body: t('w4body') },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      cssW.current = canvas.offsetWidth
      cssH.current = canvas.offsetHeight
      canvas.width  = cssW.current * dpr
      canvas.height = cssH.current * dpr
      ctx.scale(dpr, dpr)
      if (drawnIdx.current >= 0) draw(drawnIdx.current)
    }

    const draw = (idx: number) => {
      const img = framesRef.current[idx]
      if (!img?.complete || !img.naturalWidth) return
      drawnIdx.current = idx
      const cw = cssW.current, ch = cssH.current
      const fw = img.naturalWidth, fh = img.naturalHeight
      const s  = Math.max(cw / fw, ch / fh)
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - fw * s) / 2, (ch - fh * s) / 2, fw * s, fh * s)
    }

    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      const progress   = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / scrollable))

      // Video: plays during 0 → VIDEO_END, frozen after
      const videoP = Math.min(1, progress / VIDEO_END)
      const idx    = Math.min(Math.floor(videoP * TOTAL_FRAMES), TOTAL_FRAMES - 1)
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => draw(idx))

      // Section label fade in
      if (labelRef.current) {
        const lp = Math.max(0, Math.min(1, (progress - (VIDEO_END + 0.02)) / 0.06))
        labelRef.current.style.opacity = String(lp)
        labelRef.current.style.transform = `translateY(${(1 - lp) * -20}px)`
      }

      // Cards — each appears at its threshold, slides from top
      CARD_AT.forEach((threshold, i) => {
        const p  = Math.max(0, Math.min(1, (progress - threshold) / CARD_RANGE))
        const el = cardRefs.current[i]
        if (el) {
          el.style.opacity   = String(p)
          el.style.transform = `translateY(${(1 - p) * -36}px)`
        }
      })
    }

    // Preload frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      if (i === 0) img.onload = () => { resize(); draw(0); setReady(true) }
      framesRef.current[i] = img
    }

    resize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: '500vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">

        {/* Loading */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-gold/20" />
              <span className="font-body text-[9px] uppercase tracking-[0.4em] text-gold/25">Loading</span>
              <div className="w-6 h-[1px] bg-gold/20" />
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ background: '#080808', opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'rgba(8,8,8,0.32)' }} />

        {/* Top fade */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />

        {/* Scroll hint (only during video phase) */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-gold/25" />
            <span className="font-body text-[9px] uppercase tracking-[0.45em] text-gold/35">
              scroll to reveal
            </span>
            <div className="w-8 h-[1px] bg-gold/25" />
          </div>
        </div>

        {/* Section label — appears when cards start */}
        <div
          ref={labelRef}
          className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none z-20"
          style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'none' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-6 h-[1px] bg-gold/40" />
            <span className="font-body text-[11px] uppercase tracking-[0.28em] text-gold/60">
              {t('eyebrow')}
            </span>
            <div className="w-6 h-[1px] bg-gold/40" />
          </div>
        </div>

        {/* Cards — 2×2 grid, appears over the frozen luxury frame */}
        <div className="absolute inset-x-6 md:inset-x-16 bottom-16 z-20 grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map((card, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              style={{ opacity: 0, transform: 'translateY(-36px)', transition: 'none' }}
            >
              <div className="h-full p-1.5 rounded-2xl border border-white/8 bg-ink/75 backdrop-blur-md hover:border-gold/25 transition-colors duration-500">
                <div className="h-full rounded-[calc(1rem-0.375rem)] p-5 flex flex-col gap-3 min-h-[140px]">
                  <span className="font-display text-[2.4rem] leading-none font-light text-gold/12 select-none">
                    {card.num}
                  </span>
                  <div className="mt-auto flex flex-col gap-1">
                    <h3 className="font-display text-base md:text-lg font-light text-cream leading-snug">
                      {card.title}
                    </h3>
                    <p className="font-body text-cream/40 text-xs leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
