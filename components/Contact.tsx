'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.disconnect() }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

const WA_NUMBER      = '971502541717'
const WEB3FORMS_KEY  = 'cbbee918-b5e4-4969-875c-7a27a3fd1324'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const t = useTranslations('contact')
  const headRef = useReveal()
  const formRef = useReveal(150)
  const formEl  = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const data = new FormData(e.currentTarget)
    data.append('access_key', WEB3FORMS_KEY)
    data.append('subject', 'New Era Exclusive — New Inquiry')
    data.append('from_name', 'New Era Website')

    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (json.success) {
        setStatus('success')
        formEl.current?.reset()
        setTimeout(() => setStatus('idle'), 10000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 8000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 8000)
    }
  }

  const inputCls = `
    w-full bg-stone border border-white/10 rounded-2xl px-5 py-4
    font-body font-light text-cream text-sm placeholder:text-cream/25
    focus:outline-none focus:border-gold/50 focus:bg-stone/80
    transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
  `

  return (
    <section id="contact" className="relative z-10 py-32 md:py-40 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div ref={headRef} className="reveal mb-4 flex items-center gap-4">
          <div className="gold-line drawn w-12" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-body">{t('eyebrow')}</span>
        </div>

        <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-light text-cream mb-4">
          {t('headline')}
        </h2>
        <p className="font-body font-light text-cream/50 text-base mb-8">{t('sub')}</p>

        <div ref={formRef} className="reveal p-2 rounded-[2rem] border border-white/8 bg-white/3 mb-8">
          <div className="rounded-[calc(2rem-0.5rem)] bg-stone p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
            <form ref={formEl} onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Honeypot — invisible to humans, bots fill it → submission blocked */}
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="name"
                  type="text"
                  placeholder={t('name')}
                  required
                  className={inputCls}
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder={t('phone') || '+971 XX XXX XXXX'}
                  className={inputCls}
                />
              </div>

              <textarea
                name="message"
                placeholder={t('message')}
                rows={4}
                required
                maxLength={500}
                className={`${inputCls} resize-none`}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold hover:bg-gold-light disabled:opacity-60 text-ink font-body font-medium text-sm px-8 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                >
                  {status === 'loading' && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  )}
                  {status === 'success' ? '✓ Message sent!' : status === 'error' ? 'Error — try again' : t('send')}
                  {status === 'idle' && (
                    <span className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>

                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border border-gold/50 hover:border-gold text-gold hover:text-gold-light font-body font-medium text-sm px-8 py-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('whatsapp')} ↗
                </a>
              </div>

              {status === 'error' && (
                <p className="font-body text-sm text-cream/40 pt-1">
                  или{' '}
                  <a
                    href={`https://wa.me/${WA_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold-light transition-colors duration-300"
                  >
                    напишите нам в WhatsApp →
                  </a>
                </p>
              )}

            </form>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-8">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0 text-gold/60">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
          </svg>
          <a
            href="https://maps.google.com/?q=Dubai+UAE"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[13px] text-cream/55 leading-relaxed hover:text-cream/75 transition-colors duration-300"
          >{t('address')}</a>
        </div>
      </div>
    </section>
  )
}
