'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function ServiceCard({ num, title, body, index }: {
  num: string; title: string; body: string; index: number
}) {
  const ref = useReveal(index * 55)
  const isRight = index % 2 === 1

  return (
    <div
      ref={ref}
      className={`reveal border-b border-white/10 py-7 group ${
        isRight ? 'md:pl-10 md:border-l border-white/10' : 'md:pr-10'
      }`}
    >
      <span className="font-body text-[9px] uppercase tracking-[0.35em] text-gold/50 block mb-3">
        {num}
      </span>
      <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.7rem)] font-light text-cream group-hover:text-gold transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] leading-snug mb-3">
        {title}
      </h3>
      <p className="font-body font-light text-cream/75 text-[13px] leading-relaxed">
        {body}
      </p>
    </div>
  )
}

export default function Services() {
  const t = useTranslations('services')
  const headRef = useReveal()

  const services = [
    { num: '01', title: t('s1title'), body: t('s1body') },
    { num: '02', title: t('s2title'), body: t('s2body') },
    { num: '03', title: t('s3title'), body: t('s3body') },
    { num: '04', title: t('s4title'), body: t('s4body') },
    { num: '05', title: t('s5title'), body: t('s5body') },
    { num: '06', title: t('s6title'), body: t('s6body') },
    { num: '07', title: t('s7title'), body: t('s7body') },
    { num: '08', title: t('s8title'), body: t('s8body') },
  ]

  return (
    <section id="services" className="py-32 md:py-40 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">

        <div ref={headRef} className="reveal flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-gold/50" />
          <span className="font-body text-[11px] uppercase tracking-[0.25em] text-gold/70">
            {t('eyebrow')}
          </span>
        </div>

        <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-light text-cream mb-12 md:mb-16">
          {t('headline')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {services.map((svc, i) => (
            <ServiceCard key={i} {...svc} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
