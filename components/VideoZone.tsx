'use client'

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 121
const frameSrc = (i: number, mobile: boolean) =>
  `/${mobile ? 'frames-mobile' : 'frames'}/frame_${String(i + 1).padStart(4, '0')}.webp`

export default function VideoZone({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const framesRef  = useRef<HTMLImageElement[]>([])
  const drawnIdx   = useRef(-1)
  const rafId      = useRef(0)
  const cssW       = useRef(0)
  const cssH       = useRef(0)
  const [ready, setReady] = useState(false)

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

    const isMobile = window.innerWidth < 768 || window.innerHeight > window.innerWidth
    const frameStep = isMobile ? 2 : 1

    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      const progress   = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / scrollable))
      const rawIdx     = Math.floor(progress * TOTAL_FRAMES)
      const idx        = Math.min(rawIdx - (rawIdx % frameStep), TOTAL_FRAMES - 1)
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => draw(idx))
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = frameSrc(i, isMobile)
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
    <div ref={wrapperRef} className="relative">

      {/* Sticky canvas — stays behind, moves with content scroll */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ zIndex: 0, marginBottom: '-100vh' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            background: '#080808',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Readability overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(8,8,8,0.75)' }} />

        {/* Top fade from previous section */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />
      </div>

      {/* Content scrolls over the canvas */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>

    </div>
  )
}
