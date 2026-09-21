'use client'

import { useEffect, useRef, useState } from 'react'

const TOTAL_FRAMES = 121
const PRELOAD_AHEAD_PX = 1200
const MAX_CONCURRENT_LOADS = 4
const PRIORITY_WINDOW = 12
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
  const targetIdx  = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const frameState = Array<'idle' | 'queued' | 'loading' | 'loaded' | 'failed'>(TOTAL_FRAMES).fill('idle')
    const queuedFrames: number[] = []
    let activeLoads = 0
    let hasStartedPreloading = false
    let disposed = false

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
      let frameIdx = idx
      if (frameState[frameIdx] !== 'loaded') {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const previous = idx - offset
          const next = idx + offset
          if (previous >= 0 && frameState[previous] === 'loaded') {
            frameIdx = previous
            break
          }
          if (next < TOTAL_FRAMES && frameState[next] === 'loaded') {
            frameIdx = next
            break
          }
        }
      }
      const img = framesRef.current[frameIdx]
      if (!img?.complete || !img.naturalWidth) return
      drawnIdx.current = frameIdx
      const cw = cssW.current, ch = cssH.current
      const fw = img.naturalWidth, fh = img.naturalHeight
      const s  = Math.max(cw / fw, ch / fh)
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - fw * s) / 2, (ch - fh * s) / 2, fw * s, fh * s)
    }

    const isMobile = window.innerWidth < 768 || window.innerHeight > window.innerWidth
    const loadQueue = () => {
      while (activeLoads < MAX_CONCURRENT_LOADS && queuedFrames.length > 0) {
        const idx = queuedFrames.shift()
        if (idx === undefined || frameState[idx] !== 'queued') continue

        frameState[idx] = 'loading'
        activeLoads++

        const img = new Image()
        img.decoding = 'async'
        const finishLoad = () => {
          if (disposed) return
          frameState[idx] = 'loaded'
          activeLoads--
          if (idx === 0) {
            resize()
            draw(0)
            setReady(true)
          }
          if (idx === targetIdx.current) draw(idx)
          loadQueue()
        }
        img.onload = () => {
          img.decode().then(finishLoad).catch(finishLoad)
        }
        img.onerror = () => {
          if (disposed) return
          frameState[idx] = 'failed'
          activeLoads--
          loadQueue()
        }
        framesRef.current[idx] = img
        img.src = frameSrc(idx, isMobile)
      }
    }

    const queueFrame = (idx: number, priority = false) => {
      if (idx < 0 || idx >= TOTAL_FRAMES) return
      if (frameState[idx] === 'idle') {
        frameState[idx] = 'queued'
        priority ? queuedFrames.unshift(idx) : queuedFrames.push(idx)
      } else if (priority && frameState[idx] === 'queued') {
        const position = queuedFrames.indexOf(idx)
        if (position >= 0) queuedFrames.splice(position, 1)
        queuedFrames.unshift(idx)
      }
    }

    const prioritizeFrames = (idx: number) => {
      const priorityFrames = [idx]
      for (let offset = 1; offset <= PRIORITY_WINDOW; offset++) {
        priorityFrames.push(idx + offset, idx - offset)
      }
      for (let i = priorityFrames.length - 1; i >= 0; i--) queueFrame(priorityFrames[i], true)
      loadQueue()
    }

    const startPreloading = () => {
      if (hasStartedPreloading) return
      hasStartedPreloading = true
      for (let i = 1; i < TOTAL_FRAMES; i++) queueFrame(i)
      prioritizeFrames(targetIdx.current)
    }

    const onScroll = () => {
      const el = wrapperRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      const progress   = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / scrollable))
      const rawIdx     = Math.floor(progress * TOTAL_FRAMES)
      const idx        = Math.min(rawIdx, TOTAL_FRAMES - 1)
      targetIdx.current = idx
      if (hasStartedPreloading) prioritizeFrames(idx)
      cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(() => draw(idx))
    }

    queueFrame(0, true)
    loadQueue()

    let observer: IntersectionObserver | undefined
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          startPreloading()
          observer?.disconnect()
        }
      }, { rootMargin: `${PRELOAD_AHEAD_PX}px 0px` })
      observer.observe(wrapperRef.current ?? canvas)
    } else {
      startPreloading()
    }

    resize()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId.current)
      observer?.disconnect()
      disposed = true
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
          style={{ background: 'rgba(8,8,8,0.4)' }} />

        {/* Top fade from previous section */}
        <div className="absolute top-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #080808, transparent)' }} />

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #080808, transparent)' }} />

        {/* Scroll hint */}
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-[11px] uppercase tracking-[0.25em] text-cream/50 pointer-events-none select-none whitespace-nowrap">
          Scroll to explore
        </p>
      </div>

      {/* Content scrolls over the canvas */}
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>

    </div>
  )
}
