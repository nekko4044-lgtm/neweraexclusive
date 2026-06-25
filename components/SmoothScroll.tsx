'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    let lenis: any

    // Skip smooth scroll on touch devices — native momentum scroll is better
    if (window.innerWidth < 768 || window.innerHeight > window.innerWidth) return

    async function init() {
      const Lenis = (await import('lenis')).default
      lenis = new Lenis({
        duration: 1.35,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      // Lenis + anchor links
      document.querySelectorAll('a[href^="#"]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault()
          const target = document.querySelector((el as HTMLAnchorElement).getAttribute('href')!)
          if (target) lenis.scrollTo(target, { offset: -80, duration: 1.6 })
        })
      })
    }
    init()

    return () => { if (lenis) lenis.destroy() }
  }, [])

  return null
}
