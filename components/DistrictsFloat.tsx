'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

const DISTRICTS_MD = [
  { name: 'Palm Jumeirah',      dx: -290, dy: -115 },
  { name: 'Bluewaters Island',  dx:  210, dy: -135 },
  { name: '22 Carat',           dx:  335, dy:    0 },
  { name: 'Dubai Hills Estate', dx:  180, dy:  125 },
  { name: 'Abu Dhabi Islands',  dx: -230, dy:  130 },
  { name: 'W Residences',       dx: -355, dy:    0 },
]

const DISTRICTS_SM = [
  { name: 'Palm Jumeirah',      dx: -115, dy: -78 },
  { name: 'Bluewaters Island',  dx:   90, dy: -90 },
  { name: '22 Carat',           dx:  140, dy:   0 },
  { name: 'Dubai Hills Estate', dx:   75, dy:  85 },
  { name: 'Abu Dhabi Islands',  dx: -100, dy:  88 },
  { name: 'W Residences',       dx: -140, dy:    0 },
]

const DURS   = [7.2, 8.5, 6.8, 9.1, 7.6, 8.0]
const DELAYS = [0,   1.1, 0.6, 1.8, 0.3, 1.4]

const STYLES = `
@keyframes df-float-0{0%,100%{transform:translate(0,0)}33%{transform:translate(7px,-11px)}66%{transform:translate(-5px,8px)}}
@keyframes df-float-1{0%,100%{transform:translate(0,0)}33%{transform:translate(-9px,7px)}66%{transform:translate(6px,-10px)}}
@keyframes df-float-2{0%,100%{transform:translate(0,0)}33%{transform:translate(5px,12px)}66%{transform:translate(-7px,-5px)}}
@keyframes df-float-3{0%,100%{transform:translate(0,0)}33%{transform:translate(-6px,-8px)}66%{transform:translate(9px,6px)}}
@keyframes df-float-4{0%,100%{transform:translate(0,0)}33%{transform:translate(10px,5px)}66%{transform:translate(-4px,-12px)}}
@keyframes df-float-5{0%,100%{transform:translate(0,0)}33%{transform:translate(-8px,10px)}66%{transform:translate(5px,-7px)}}
@keyframes df-reveal{from{opacity:0;transform:scale(0.82)}to{opacity:1;transform:scale(1)}}
@keyframes df-center-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
`

function Anchor({ districts, fontSize }: { districts: typeof DISTRICTS_MD; fontSize: number }) {
  return (
    <>
      {districts.map((d, i) => (
        <div
          key={d.name}
          className="absolute whitespace-nowrap"
          style={{ transform: `translate(calc(-50% + ${d.dx}px), calc(-50% + ${d.dy}px))` }}
        >
          <div data-df-reveal style={{ opacity: 0 }}>
            <div data-df-float className="flex items-center gap-2 cursor-default select-none group">
              <span className="h-px bg-gold/35 group-hover:bg-gold/65 transition-all duration-500" style={{ width: 8 }} />
              <span
                className="font-body uppercase text-cream/35 group-hover:text-gold/65 transition-colors duration-400"
                style={{ fontSize, letterSpacing: '0.2em' }}
              >
                {d.name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default function DistrictsFloat() {
  const t = useTranslations('districts')
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || revealed.current) return
      revealed.current = true

      el.querySelectorAll<HTMLElement>('[data-df-reveal]').forEach((layer, i) => {
        const idx = i % DISTRICTS_MD.length
        layer.style.animation = `df-reveal 0.7s cubic-bezier(0.32,0.72,0,1) ${0.15 + idx * 0.1}s both`
      })
      el.querySelectorAll<HTMLElement>('[data-df-float]').forEach((layer, i) => {
        const idx = i % DISTRICTS_MD.length
        layer.style.animation = `df-float-${idx} ${DURS[idx]}s ease-in-out ${DELAYS[idx] + 0.9}s infinite`
      })
      el.querySelectorAll<HTMLElement>('[data-df-center]').forEach(c => {
        c.style.animation = 'df-center-in 0.9s cubic-bezier(0.32,0.72,0,1) 0.1s both'
      })
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const CenterText = () => (
    <div className="absolute text-center pointer-events-none" style={{ transform: 'translate(-50%, -50%)', width: 210 }}>
      <div data-df-center style={{ opacity: 0 }}>
        <div style={{ width: 26, height: 1, background: 'rgba(201,168,76,0.4)', margin: '0 auto 9px' }} />
        <p className="font-body text-[10px] uppercase tracking-[0.35em] text-gold/35 mb-1.5">{t('eyebrow')}</p>
        <h2 className="font-display font-light text-cream/60 leading-snug" style={{ fontSize: 'clamp(1.15rem,2.2vw,1.65rem)' }}>
          {t('heading')}
        </h2>
        <div style={{ width: 26, height: 1, background: 'rgba(201,168,76,0.4)', margin: '9px auto 0' }} />
      </div>
    </div>
  )

  return (
    <div ref={ref} className="relative overflow-hidden h-[220px] md:h-[300px]">
      <style>{STYLES}</style>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{ width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />
      </div>

      {/* Desktop anchor */}
      <div className="absolute hidden md:block" style={{ left: '50%', top: '50%', width: 0, height: 0 }}>
        <CenterText />
        <Anchor districts={DISTRICTS_MD} fontSize={16} />
      </div>

      {/* Mobile anchor */}
      <div className="absolute md:hidden" style={{ left: '50%', top: '50%', width: 0, height: 0 }}>
        <CenterText />
        <Anchor districts={DISTRICTS_SM} fontSize={11} />
      </div>
    </div>
  )
}
