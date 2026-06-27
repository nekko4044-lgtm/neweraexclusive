import clsx from 'clsx'

const ITEMS_A = [
  'Interior Design',
  '✦',
  'Turnkey Renovation',
  '✦',
  'Smart Home',
  '✦',
  'Bluewaters Island',
  '✦',
  'Palm Jumeirah',
  '✦',
  'New Era Exclusive',
  '✦',
  'Dubai · UAE',
  '✦',
  'Parametric Design',
  '✦',
  'Premium Living',
  '✦',
]

const ITEMS_B = [
  'From Vision to Perfection',
  '✦',
  '22 Carat',
  '✦',
  'W Residences',
  '✦',
  'Dubai Hills Estate',
  '✦',
  'Luxury Interiors',
  '✦',
  'Smart Home Systems',
  '✦',
  'White-Glove Service',
  '✦',
  'Pre-Sale Prep',
  '✦',
  'Fully Managed',
  '✦',
]

function MarqueeTrack({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden relative" style={{
      background: 'linear-gradient(to right, #080808 0%, #1C1A17 18%, #1C1A17 82%, #080808 100%)',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
    }}>
      {/* Gold glow hairline */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 30%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent 100%)' }}
      />

      <div
        className={clsx('flex whitespace-nowrap py-[13px]', reverse ? 'marquee-run-reverse' : 'marquee-run')}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={clsx(
              'font-display text-[13px] tracking-[0.22em] px-3 select-none',
              item === '✦'
                ? 'text-gold/60 text-[8px] mx-1'
                : 'italic text-gold/70'
            )}
            style={item !== '✦' ? { textShadow: '0 0 24px rgba(201,168,76,0.25)' } : undefined}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 30%, rgba(201,168,76,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent 100%)' }}
      />
    </div>
  )
}

export default function MarqueeSection() {
  return (
    <div className="flex flex-col gap-0">
      <MarqueeTrack items={ITEMS_A} reverse={false} />
      <MarqueeTrack items={ITEMS_B} reverse={true} />
    </div>
  )
}
