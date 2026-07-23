'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

export default function CatalogTab() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()

  return (
    <div
      className="fixed left-0 top-1/2 z-50 flex items-stretch"
      style={{
        transform: `translateY(-50%) translateX(${open ? '0px' : '-200px'})`,
        transition: 'transform 0.5s cubic-bezier(0.32,0.72,0,1)',
        width: '240px',
      }}
    >
      {/* Панель */}
      <div className="w-[200px] bg-ink/95 backdrop-blur-md border border-gold/20 border-r-0 rounded-l-2xl p-5 flex flex-col gap-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-[1px] bg-gold/40" />
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-gold/50">Our Exclusive</span>
        </div>
        <p className="font-display text-cream text-[1.15rem] font-light leading-snug">
          Luxury<br />Collections
        </p>
        <Link
          href={`/${locale}/catalog`}
          className="group inline-flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.2em] text-gold border border-gold/30 rounded-full px-4 py-2.5 hover:bg-gold/10 hover:border-gold/60 transition-all duration-300"
        >
          View Catalog
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Ручка */}
      <div className="relative w-10 flex-shrink-0 flex items-center justify-center">
        {/* Ping-пульсация — только когда закрыто */}
        <AnimatePresence>
          {!open && (
            <>
              <motion.span
                key="ping1"
                className="absolute inset-0 rounded-r-2xl"
                style={{ border: '1px solid rgba(201,168,76,0.6)' }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut' }}
              />
              <motion.span
                key="ping2"
                className="absolute inset-0 rounded-r-2xl"
                style={{ border: '1px solid rgba(201,168,76,0.35)' }}
                animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, delay: 0.3, ease: 'easeOut' }}
              />
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close catalog menu' : 'Open catalog menu'}
          className="absolute inset-0 bg-ink/95 backdrop-blur-md border border-gold/20 rounded-r-2xl flex items-center justify-center hover:bg-gold/5 transition-colors duration-300"
        >
          {open ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <span
              className="font-body text-[9px] uppercase tracking-[0.3em] text-gold/70 whitespace-nowrap select-none"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
            >
              Catalog
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
