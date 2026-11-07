'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let s = 0; const step = target / 50
      const t = setInterval(() => {
        s += step
        if (s >= target) { setCount(target); clearInterval(t) }
        else setCount(Math.floor(s))
      }, 20)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function About() {
  const t = useTranslations('about')
  const r1 = useReveal(0)
  const r2 = useReveal(150)
  const r3 = useReveal(300)

  return (
    <section id="about" className="py-32 md:py-40 px-6 md:px-16 relative overflow-hidden">

      {/* Section label — rotated side */}
      <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 -rotate-90 items-center gap-3 pointer-events-none">
        <div className="w-8 h-[1px] bg-gold/20" />
        <span className="font-body text-[9px] uppercase tracking-[0.35em] text-gold/25 whitespace-nowrap">{t('eyebrow')}</span>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-start">

        {/* LEFT — team photo */}
        <div ref={r1} className="reveal relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone md:sticky md:top-28">
          <Image
            src="/ksenia-bulgakova.webp"
            alt={t('portraitAlt')}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/15" />
        </div>

        {/* RIGHT — text */}
        <div className="flex flex-col justify-center gap-10">
          <div ref={r2} className="reveal flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-[1px] bg-gold/50" />
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-gold/70">{t('eyebrow')}</span>
            </div>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-light leading-[1.1] text-cream">
              {t('headline')}
            </h2>

            <p className="font-body text-[11px] uppercase tracking-[0.16em] text-gold/80 leading-relaxed">{t('role')}<br /><span dir="ltr" className="inline-block mt-2">NEW ERA INTERIOR DESIGN WORK</span></p>
            <p className="font-body text-[16px] leading-[1.8] text-cream/85">{t('intro').split('NEW ERA INTERIOR DESIGN WORK').map((part, i) => <span key={i}>{i > 0 && <bdi dir="ltr">NEW ERA INTERIOR DESIGN WORK</bdi>}{part}</span>)}</p>
            <div className="flex flex-col gap-5">
              {t('body').split('\n').map((para, i) => (
                <p key={i} className="font-body font-light text-cream/65 text-[15px] leading-[1.8]">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 font-body text-[15px] leading-[1.8]">
            <p className="text-cream/90 font-medium border-s-2 border-gold/50 ps-5">{t('responsibility')}</p>
            <p className="text-cream/65 font-light">{t('belief')}</p>
            <p className="text-cream/90 font-medium">{t('closing')}</p>
            <div className="pt-3">
              <p className="italic text-cream/50 text-sm">{t('regards')}</p>
              <p className="font-display text-2xl text-cream mt-2">{t('headline')}</p>
              <p className="text-xs text-gold/70 mt-2">{t('signatureRole')}</p>
            </div>
            <p dir="ltr" className="font-display text-xl italic text-gold/80 pt-4">From Vision to Perfection</p>
          </div>

          {/* NDA note */}
          <p className="font-body text-[13px] italic text-cream/80 leading-relaxed -mt-4">
            {t('nda')}
          </p>

          {/* Stats — editorial strip */}
          <div ref={r3} className="reveal relative">
            {/* Top/bottom gold hairlines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <div className="grid grid-cols-3 divide-x divide-white/8">
              {([
                { value: 150, suffix: '+', label: t('stat1'), sub: t('stat1desc') },
                { value: 20,  suffix: '+', label: t('stat2'), sub: t('stat2desc') },
                { value: 4,   suffix: '',  label: t('stat3'), sub: t('stat3desc') },
              ] as const).map((stat, i) => (
                <div key={i} className="py-6 px-4 md:px-6 flex flex-col gap-1.5">

                  {/* Number + suffix */}
                  <div className="flex items-start gap-0.5 leading-none">
                    <span className="font-stat text-[clamp(3rem,6.5vw,5.2rem)] font-normal text-cream/90 leading-none tabular-nums">
                      <Counter target={stat.value} />
                    </span>
                    {stat.suffix && (
                      <span className="font-stat text-[clamp(1.2rem,2.5vw,2.1rem)] text-gold leading-none mt-1.5">
                        {stat.suffix}
                      </span>
                    )}
                  </div>

                  {/* Label + sub */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-body text-[11px] uppercase tracking-[0.2em] text-cream/50 leading-tight">
                      {stat.label}
                    </span>
                    <span className="font-body text-[11px] italic text-cream/30 leading-tight">
                      {stat.sub}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
