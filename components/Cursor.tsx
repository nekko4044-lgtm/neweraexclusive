'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let hovering = false
    let raf: number

    document.documentElement.classList.add('custom-cursor')

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })

    const onEnter = () => { hovering = true }
    const onLeave = () => { hovering = false }

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attach()
    const mo = new MutationObserver(attach)
    mo.observe(document.body, { childList: true, subtree: true })

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

    function tick() {
      const dot = dotRef.current
      const ring = ringRef.current
      if (dot) {
        dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
      }
      rx = lerp(rx, mx, 0.11)
      ry = lerp(ry, my, 0.11)
      if (ring) {
        const size = hovering ? 56 : 36
        const offset = size / 2
        ring.style.transform = `translate(${rx - offset}px, ${ry - offset}px)`
        ring.style.width = `${size}px`
        ring.style.height = `${size}px`
        ring.style.borderColor = hovering ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.3)'
        ring.style.backgroundColor = hovering ? 'rgba(201,168,76,0.05)' : 'transparent'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      mo.disconnect()
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full bg-gold pointer-events-none mix-blend-screen"
        style={{ willChange: 'transform', transform: 'translate(-200px, -200px)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] rounded-full border pointer-events-none"
        style={{
          willChange: 'transform, width, height',
          transition: 'width 0.35s cubic-bezier(0.32,0.72,0,1), height 0.35s cubic-bezier(0.32,0.72,0,1), border-color 0.3s, background-color 0.3s',
          width: '36px', height: '36px',
          borderColor: 'rgba(201,168,76,0.3)',
          transform: 'translate(-200px, -200px)',
        }}
      />
    </>
  )
}
