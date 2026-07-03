'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getModelById } from '../modelData'
import type { ColorVariant, SmartToiletModel } from '../modelData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

function DotPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#F5EFE0" fillOpacity="0.04" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SmartToiletModelClient({ modelId }: { modelId: string }) {
  const t = useTranslations('catalog')
  const locale = useLocale()
  const model = getModelById(modelId)

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null)

  useEffect(() => {
    if (model) setSelectedColor(model.colors[0])
  }, [model])

  const eyebrowRef = useReveal(100)

  if (!model) {
    return (
      <main className="min-h-[100dvh] bg-ink flex items-center justify-center">
        <p className="text-cream/40 font-body">Model not found</p>
      </main>
    )
  }

  const currentImage = selectedColor?.imageSrc ?? model.imageSrc

  const waterSystemLabel: Record<SmartToiletModel['waterSystem'], string> = {
    tankless: locale === 'ru' ? 'Без бака' : locale === 'ar' ? 'بدون خزان' : 'Tankless',
    tank: locale === 'ru' ? 'С баком' : locale === 'ar' ? 'مع خزان' : 'With tank',
    'wall-tank': locale === 'ru' ? 'Встроенный бак' : locale === 'ar' ? 'خزان مدمج' : 'In-wall tank',
    lid: locale === 'ru' ? 'Крышка-биде' : locale === 'ar' ? 'غطاء بيديه' : 'Bidet lid',
  }

  return (
    <main className="min-h-[100dvh] bg-ink overflow-x-hidden">

      {/* ── Top bar: back link ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 pt-28 md:pt-32 pb-6">
        <Link
          href={`/${locale}/catalog/smart-toilet`}
          className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.3em] text-cream/30 hover:text-gold/60 transition-colors duration-300"
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="rtl:rotate-180">
            <path d="M13 5H1M1 5L5 1M1 5L5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('breadcrumb_root')} / {t('categories.smart_toilet.name')}
        </Link>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* ── LEFT: Image ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone/40">
              <img
                key={currentImage}
                src={currentImage}
                alt={t(model.nameKey as Parameters<typeof t>[0])}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
          </div>

          {/* ── RIGHT: Details ──────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* Eyebrow */}
            <div ref={eyebrowRef} className="reveal flex items-center gap-3">
              <div className="w-7 h-[1px] bg-gold/50" />
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">
                {t('categories.smart_toilet.eyebrow')}
              </span>
            </div>

            {/* Model name */}
            <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-light text-cream leading-[0.95]">
              {t(model.nameKey as Parameters<typeof t>[0])}
            </h1>

            {/* Gold divider */}
            <div className="w-12 h-[1px] bg-gold/40" />

            {/* Specs grid */}
            {(() => {
              const specs: { label: string; value: string }[] = []
              if (model.dimensions !== '—') specs.push({ label: locale === 'ru' ? 'Размеры' : locale === 'ar' ? 'الأبعاد' : 'Dimensions', value: model.dimensions })
              if (model.functions > 0) specs.push({ label: locale === 'ru' ? 'Функции' : locale === 'ar' ? 'الوظائف' : 'Functions', value: String(model.functions) })
              specs.push({ label: locale === 'ru' ? 'Система воды' : locale === 'ar' ? 'نظام المياه' : 'Water system', value: waterSystemLabel[model.waterSystem] })
              if (model.waterPressure) specs.push({ label: locale === 'ru' ? 'Давление воды' : locale === 'ar' ? 'ضغط الماء' : 'Water pressure', value: model.waterPressure })
              if (model.ipRating) specs.push({ label: locale === 'ru' ? 'Защита' : locale === 'ar' ? 'الحماية' : 'Protection', value: model.ipRating })
              const isOdd = specs.length % 2 !== 0
              return (
                <div className="grid grid-cols-2 gap-px bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.05]">
                  {specs.map((spec, i) => {
                    const isLast = i === specs.length - 1
                    const spanFull = isLast && isOdd
                    return (
                      <div
                        key={spec.label}
                        className={`bg-[#0F0F0F] p-4 flex flex-col gap-1 ${spanFull ? 'col-span-2 items-center text-center' : ''}`}
                      >
                        <span className="font-body text-[10px] uppercase tracking-[0.25em] text-cream/30">{spec.label}</span>
                        <span className="font-body text-[14px] text-cream/80">{spec.value}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* Color selector */}
            {model.colors.length > 1 && (
              <div className="flex flex-col gap-3">
                <span className="font-body text-[11px] uppercase tracking-[0.3em] text-cream/30">
                  {locale === 'ru' ? 'Цвет' : locale === 'ar' ? 'اللون' : 'Colour'}
                  {selectedColor && (
                    <span className="ltr:ml-3 rtl:mr-3 normal-case tracking-normal text-cream/50">{selectedColor.label}</span>
                  )}
                </span>
                <div className="flex gap-2 flex-wrap">
                  {model.colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      title={color.label}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
                        selectedColor?.id === color.id
                          ? 'border-gold scale-110'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {model.features.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="font-body text-[11px] uppercase tracking-[0.3em] text-cream/30">
                  {locale === 'ru' ? 'Ключевые функции' : locale === 'ar' ? 'الميزات الرئيسية' : 'Key features'}
                </span>
                <ul className="flex flex-col gap-2">
                  {model.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-[5px] w-1 h-1 rounded-full bg-gold/60" />
                      <span className="font-body text-[13px] text-cream/55 leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status + CTA */}
            <div className="flex flex-col gap-4 pt-2">
              <span className="font-body text-[12px] uppercase tracking-[0.25em] text-cream/30">
                {t('cta_status')}
              </span>
              <a
                href={`/${locale}#contact`}
                className="self-start inline-flex items-center gap-3 border border-gold/35 hover:border-gold hover:bg-gold/8 text-gold font-body text-[13px] tracking-wide px-7 py-3.5 rounded-full transition-all duration-500 active:scale-[0.97]"
              >
                {t('cta_button')}
                <span className="w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center transition-all duration-500 hover:bg-gold/15">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="rtl:rotate-180">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
