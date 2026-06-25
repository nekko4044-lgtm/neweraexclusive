'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'ar', label: 'AR' },
]

export default function Navbar() {
  const t      = useTranslations('nav')
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const links = [
    { href: '#about',    label: t('about') },
    { href: '#services', label: t('services') },
    { href: '#why',      label: t('why') },
    { href: '#contact',  label: t('contact') },
  ]

  return (
    <div ref={menuRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">

      {/* Pill */}
      <nav className={`
        flex items-center gap-4 px-4 py-2.5 rounded-full border border-white/10
        transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${scrolled || open
          ? 'bg-ink/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : 'bg-white/5 backdrop-blur-sm'}
      `}>
        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image src="/logo.png" alt="New Era" width={40} height={40} className="rounded-full ring-1 ring-gold/30" />
        </Link>

        {/* Menu toggle — all devices */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 hover:border-gold/30 transition-all duration-300"
          aria-label="Menu"
        >
          <span className="font-body text-[11px] uppercase tracking-[0.2em] text-cream/60">
            {open ? 'Close' : 'Menu'}
          </span>
          <div className="flex flex-col gap-[4px]">
            <span className={`block w-4 h-[1px] bg-cream/70 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-4 h-[1px] bg-cream/70 transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? '-rotate-45 -translate-y-[0px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Floating card dropdown */}
      <div className={`
        absolute top-[calc(100%+8px)] w-64
        rounded-2xl border border-white/10
        bg-stone/95 backdrop-blur-2xl
        shadow-[0_24px_60px_rgba(0,0,0,0.6)]
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-3 pointer-events-none'}
      `}>
        <div className="p-2">

          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/6 group transition-all duration-300"
              style={{
                opacity:   open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.4s cubic-bezier(0.32,0.72,0,1) ${i * 50}ms, transform 0.4s cubic-bezier(0.32,0.72,0,1) ${i * 50}ms, background 0.3s`,
              }}
            >
              <span className="font-display text-[1.35rem] font-light text-cream/85 group-hover:text-gold transition-colors duration-300 leading-none">
                {link.label}
              </span>
              <span className="text-cream/20 group-hover:text-gold/60 transition-all duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          ))}

          {/* Divider */}
          <div className="h-[1px] bg-white/8 mx-4 my-1.5" />

          {/* Lang switcher */}
          <div className="flex gap-1 px-4 py-2">
            {locales.map(l => (
              <Link key={l.code} href={`/${l.code}`} onClick={() => setOpen(false)}
                className={`text-[11px] px-3 py-1.5 rounded-full transition-all duration-300 ${
                  locale === l.code
                    ? 'bg-gold/20 text-gold font-medium'
                    : 'text-cream/35 hover:text-cream/65'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}
