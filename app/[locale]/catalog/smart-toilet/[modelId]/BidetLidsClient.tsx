'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

const VARIANTS = [
  { id: 'J-07A', dimensions: '680 × 420 × 500 mm', note: { en: 'Taller unit with tank', ru: 'Высокий блок с баком', ar: 'وحدة أطول مع خزان' } },
  { id: 'J-08V', dimensions: '515 × 390 × 120 mm', note: { en: 'Flat lid, standard oval', ru: 'Плоская крышка, стандартный овал', ar: 'غطاء مسطح، بيضاوي قياسي' } },
  { id: 'J-08U', dimensions: '515 × 370 × 120 mm', note: { en: 'Flat lid, narrow oval', ru: 'Плоская крышка, узкий овал', ar: 'غطاء مسطح، بيضاوي ضيق' } },
]

const FEATURES = ['Motion seat sensor', 'Instant constant-temp heating', 'Self-cleaning nozzle', 'Heated seat ring', 'Cold/hot massage', 'PP material', '220V 50Hz']

export default function BidetLidsClient() {
  const t = useTranslations('catalog')
  const locale = useLocale()

  const labels: Record<string, Record<string, string>> = {
    available_sizes: { en: 'Available sizes', ru: 'Доступные размеры', ar: 'الأحجام المتاحة' },
    dimensions: { en: 'Dimensions', ru: 'Размеры', ar: 'الأبعاد' },
    water_pressure: { en: 'Water pressure', ru: 'Давление воды', ar: 'ضغط الماء' },
    key_features: { en: 'Key features', ru: 'Ключевые функции', ar: 'الميزات الرئيسية' },
    desc: {
      en: 'Universal smart bidet lid compatible with most floor-standing and wall-mounted toilets. Features instant heating, self-cleaning nozzle, and motion sensor seat activation.',
      ru: 'Универсальная умная крышка-биде, совместима с большинством напольных и подвесных унитазов. Мгновенный нагрев, самоочищающаяся насадка, датчик движения.',
      ar: 'غطاء بيديه ذكي عالمي متوافق مع معظم المراحيض. تسخين فوري، فوهة ذاتية التنظيف، مستشعر حركة.',
    },
  }

  const l = (key: string) => labels[key]?.[locale] ?? labels[key]?.en ?? key

  return (
    <main className="min-h-[100dvh] bg-ink overflow-x-hidden">
      {/* Back */}
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

      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Image */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone/40">
              <img
                src="/catalog/smart-toilet/j07a.jpeg"
                alt="Smart Bidet Lids"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="w-7 h-[1px] bg-gold/50" />
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-gold/60">
                {t('categories.smart_toilet.eyebrow')}
              </span>
            </div>

            <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-light text-cream leading-[0.95]">
              {t('smart_toilet_model_bidet_lids_name' as Parameters<typeof t>[0])}
            </h1>

            <div className="w-12 h-[1px] bg-gold/40" />

            <p className="font-body text-[14px] text-cream/50 leading-relaxed">{l('desc')}</p>

            {/* Size variants */}
            <div className="flex flex-col gap-4">
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-cream/30">{l('available_sizes')}</span>
              <div className="flex flex-col gap-3">
                {VARIANTS.map(v => (
                  <div key={v.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.05] bg-[#0F0F0F]">
                    <span className="font-display text-[15px] text-gold/80 w-14 flex-shrink-0">{v.id}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-body text-[13px] text-cream/70">{v.dimensions}</span>
                      <span className="font-body text-[11px] text-cream/30">{v.note[locale as 'en' | 'ru' | 'ar'] ?? v.note.en}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-px bg-white/[0.05] rounded-xl overflow-hidden border border-white/[0.05]">
              <div className="bg-[#0F0F0F] p-4 flex flex-col gap-1">
                <span className="font-body text-[10px] uppercase tracking-[0.25em] text-cream/30">{l('water_pressure')}</span>
                <span className="font-body text-[14px] text-cream/80">0.15–0.7 MPa</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3">
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-cream/30">{l('key_features')}</span>
              <ul className="flex flex-col gap-2">
                {FEATURES.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-[5px] w-1 h-1 rounded-full bg-gold/60" />
                    <span className="font-body text-[13px] text-cream/55 leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4 pt-2">
              <span className="font-body text-[12px] uppercase tracking-[0.25em] text-cream/30">{t('cta_status')}</span>
              <a
                href={`/${locale}#contact`}
                className="self-start inline-flex items-center gap-3 border border-gold/35 hover:border-gold hover:bg-gold/8 text-gold font-body text-[13px] tracking-wide px-7 py-3.5 rounded-full transition-all duration-500 active:scale-[0.97]"
              >
                {t('cta_button')}
                <span className="w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center">
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
