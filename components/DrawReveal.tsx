'use client'

import { useEffect, useRef } from 'react'

export default function DrawReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const paths = el.querySelectorAll<SVGGeometryElement>('[data-draw]')
    paths.forEach((path) => {
      try {
        const len = path.getTotalLength()
        path.style.strokeDasharray = `${len}`
        path.style.strokeDashoffset = `${len}`
      } catch {
        path.style.strokeDasharray = '2000'
        path.style.strokeDashoffset = '2000'
      }
    })

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      paths.forEach((path, i) => {
        const delay = parseFloat(path.getAttribute('data-delay') || '0')
        const dur = parseFloat(path.getAttribute('data-dur') || '1.4')
        path.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(0.32,0.72,0,1) ${delay}s`
        path.style.strokeDashoffset = '0'
      })
    }, { threshold: 0.25 })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative py-20 md:py-28 px-6 md:px-16 overflow-hidden flex flex-col items-center gap-10"
    >
      {/* Ambient glow behind SVG */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
      />

      {/* Architectural SVG — draws on scroll */}
      <svg
        viewBox="0 0 900 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl"
      >
        {/* Outer arch */}
        <path
          data-draw data-delay="0" data-dur="1.8"
          d="M100 260 Q450 20 800 260"
          stroke="rgba(201,168,76,0.6)" strokeWidth="1.2"
        />
        {/* Second arch */}
        <path
          data-draw data-delay="0.15" data-dur="1.6"
          d="M160 260 Q450 70 740 260"
          stroke="rgba(201,168,76,0.35)" strokeWidth="0.8"
        />
        {/* Third arch */}
        <path
          data-draw data-delay="0.28" data-dur="1.5"
          d="M220 260 Q450 110 680 260"
          stroke="rgba(201,168,76,0.25)" strokeWidth="0.7"
        />
        {/* Inner arch */}
        <path
          data-draw data-delay="0.38" data-dur="1.3"
          d="M290 260 Q450 150 610 260"
          stroke="rgba(201,168,76,0.2)" strokeWidth="0.6"
        />

        {/* Vertical spine */}
        <path
          data-draw data-delay="0.1" data-dur="1.2"
          d="M450 0 L450 260"
          stroke="rgba(201,168,76,0.4)" strokeWidth="0.8"
        />

        {/* Horizontal ground line */}
        <path
          data-draw data-delay="0.5" data-dur="1.4"
          d="M50 260 L850 260"
          stroke="rgba(201,168,76,0.25)" strokeWidth="0.7"
        />

        {/* Left column */}
        <path
          data-draw data-delay="0.55" data-dur="1.0"
          d="M100 260 L100 180"
          stroke="rgba(201,168,76,0.3)" strokeWidth="0.7"
        />
        {/* Right column */}
        <path
          data-draw data-delay="0.6" data-dur="1.0"
          d="M800 260 L800 180"
          stroke="rgba(201,168,76,0.3)" strokeWidth="0.7"
        />

        {/* Horizontal cross lines */}
        <path
          data-draw data-delay="0.65" data-dur="1.0"
          d="M148 220 Q450 115 752 220"
          stroke="rgba(201,168,76,0.15)" strokeWidth="0.5"
        />
        <path
          data-draw data-delay="0.72" data-dur="1.0"
          d="M200 240 Q450 158 700 240"
          stroke="rgba(201,168,76,0.12)" strokeWidth="0.5"
        />

        {/* Apex dot glow — drawn as tiny cross */}
        <path
          data-draw data-delay="0.08" data-dur="0.4"
          d="M444 6 L456 6"
          stroke="rgba(201,168,76,0.8)" strokeWidth="1.5"
        />
        <path
          data-draw data-delay="0.08" data-dur="0.4"
          d="M450 0 L450 12"
          stroke="rgba(201,168,76,0.8)" strokeWidth="1.5"
        />
      </svg>

      {/* Label below */}
      <div className="flex items-center gap-5 opacity-0" style={{
        animation: 'fade-up 0.8s cubic-bezier(0.32,0.72,0,1) 2s both'
      }}>
        <div className="w-10 h-[1px] bg-gold/30" />
        <span className="font-body text-[10px] uppercase tracking-[0.35em] text-gold/40">Our Services</span>
        <div className="w-10 h-[1px] bg-gold/30" />
      </div>
    </div>
  )
}
