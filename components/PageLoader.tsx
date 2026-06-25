'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400)
    const t2 = setTimeout(() => setPhase('out'),  1800)
    const t3 = setTimeout(() => setPhase('done'), 2550)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-ink flex flex-col items-center justify-center gap-8 pointer-events-none"
      style={{
        opacity:    phase === 'out' ? 0 : 1,
        transform:  phase === 'out' ? 'scale(1.04)' : 'scale(1)',
        transition: phase === 'out'
          ? 'opacity 0.75s cubic-bezier(0.32,0.72,0,1), transform 0.75s cubic-bezier(0.32,0.72,0,1)'
          : 'none',
      }}
    >
      {/* Dome SVG — draws in */}
      <div
        className="w-36 h-36 md:w-44 md:h-44"
        style={{
          opacity:   phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'scale(0.88)' : 'scale(1)',
          transition: 'opacity 0.6s cubic-bezier(0.32,0.72,0,1), transform 0.6s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="200" cy="230" r="170" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
          <path d="M60 230 Q200 65 340 230"  stroke="rgba(201,168,76,0.95)" strokeWidth="1.5"
            style={{ strokeDasharray: 450, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 450,
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.32,0.72,0,1) 0.1s' }} />
          <path d="M90 230 Q200 95 310 230"  stroke="rgba(201,168,76,0.7)"  strokeWidth="1"
            style={{ strokeDasharray: 380, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 380,
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.32,0.72,0,1) 0.25s' }} />
          <path d="M120 230 Q200 125 280 230" stroke="rgba(201,168,76,0.5)" strokeWidth="0.9"
            style={{ strokeDasharray: 310, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 310,
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.32,0.72,0,1) 0.38s' }} />
          <path d="M155 230 Q200 158 245 230" stroke="rgba(201,168,76,0.3)" strokeWidth="0.8"
            style={{ strokeDasharray: 230, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 230,
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.32,0.72,0,1) 0.48s' }} />
          <path d="M200 60 L200 230" stroke="rgba(201,168,76,0.75)" strokeWidth="1"
            style={{ strokeDasharray: 170, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 170,
              transition: 'stroke-dashoffset 0.7s cubic-bezier(0.32,0.72,0,1) 0.05s' }} />
          <ellipse cx="200" cy="230" rx="130" ry="34" stroke="rgba(201,168,76,0.45)" strokeWidth="0.8"
            style={{ strokeDasharray: 900, strokeDashoffset: phase === 'hold' || phase === 'out' ? 0 : 900,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.32,0.72,0,1) 0.55s' }} />
          <circle cx="200" cy="58" r="4" fill="rgba(201,168,76,1)"
            style={{ opacity: phase === 'hold' || phase === 'out' ? 1 : 0,
              transition: 'opacity 0.4s 0.6s' }} />
        </svg>
      </div>

      {/* Label */}
      <div
        className="flex flex-col items-center gap-2"
        style={{
          opacity:   phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.7s cubic-bezier(0.32,0.72,0,1) 0.4s, transform 0.7s cubic-bezier(0.32,0.72,0,1) 0.4s',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-[1px] bg-gold/60" />
          <span className="font-display italic text-[clamp(1.1rem,2.5vw,1.4rem)] font-light text-cream tracking-[0.1em]">
            New Era
          </span>
          <div className="w-8 h-[1px] bg-gold/60" />
        </div>
        <span className="font-body text-[9px] uppercase tracking-[0.45em] text-gold/70">
          Interior Design · Dubai
        </span>
      </div>
    </div>
  )
}
