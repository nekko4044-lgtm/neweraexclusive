'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const [open, setOpen] = useState(false)

  return (
    <>
      <footer className="relative bg-ink border-t border-white/8 py-10 px-4" style={{ zIndex: 20 }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Image src="/logo.jpeg" alt="New Era" width={48} height={48} className="rounded-full opacity-70" />
          <p className="font-body text-sm text-cream/50 text-center">{t('copy')}</p>

          <div className="flex items-center gap-4">
            {/* Thumbnail — click to open fullscreen */}
            <button
              onClick={() => setOpen(true)}
              className="group relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 hover:border-gold/40 transition-colors duration-300 shrink-0"
              aria-label="View certificate"
            >
              <Image src="/footer-thumb.jpg" alt="Certificate" fill className="object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            </button>

            <a
              href="https://t.me/neko_4044"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-cream/40 hover:text-gold/70 transition-colors duration-300 whitespace-nowrap"
            >
              Developed by NEKKO.DEV
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] bg-ink/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <div className="max-w-3xl w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/footer-thumb.jpg"
              alt="Certificate"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
