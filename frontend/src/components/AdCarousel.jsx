import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const ADS = [
  {
    id: 1,
    // Goldman Sachs style — dark, authoritative, institutional
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=600&fit=crop&q=80',
    brand: 'LAUNCHINGLAPS CAPITAL ACCESS',
    tag: 'ENTREPRENEUR FUNDING',
    headline: 'World-Class Capital. Global Entrepreneurs.',
    sub: 'Access a curated network of 200+ accredited US investors — from seed angels to growth-stage VCs. Submit a structured pitch and get noticed.',
    cta: 'Submit Your Pitch',
    ctaLink: '/register',
    ctaBg: '#f59e0b',
    ctaText: '#fff',
    accentColor: '#f59e0b',
    overlay: 'from-[#0a0a0a]/95 via-[#0d1b2a]/85 to-[#0a0a0a]/40',
    badgeBg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
    style: 'dark',
  },
  {
    id: 2,
    // Bloomberg style — orange/black, data-forward
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&h=600&fit=crop&q=80',
    brand: 'LAUNCHINGLAPS DEAL FLOW',
    tag: 'INVESTOR INTELLIGENCE',
    headline: 'Premium Deal Flow. Verified Startups.',
    sub: 'Get access to a weekly curated pipeline of pre-screened global startups. Filter by sector, stage, and check size. Move fast on the best opportunities.',
    cta: 'Access Deal Flow',
    ctaLink: '/register',
    ctaBg: '#ff6600',
    ctaText: '#fff',
    accentColor: '#ff6600',
    overlay: 'from-[#0a0500]/95 via-[#1a0a00]/85 to-transparent',
    badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    style: 'dark',
  },
  {
    id: 3,
    // JP Morgan / BlackRock style — navy, institutional, trust
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=600&fit=crop&q=80',
    brand: 'LAUNCHINGLAPS EDUCATION',
    tag: 'BUSINESS MASTERY',
    headline: 'The Knowledge That Closes Deals.',
    sub: '50+ expert-led courses built by seasoned investors and Fortune 500 advisors. Learn fundraising, US legal structure, financial modeling, and how to scale globally.',
    cta: 'Start Learning Free',
    ctaLink: '/register',
    ctaBg: '#1e3a8a',
    ctaText: '#fff',
    accentColor: '#60a5fa',
    overlay: 'from-[#0c1929]/95 via-[#0c1929]/80 to-transparent',
    badgeBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    style: 'dark',
  },
  {
    id: 4,
    // Forbes / prestige style — gold, achievement
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&h=600&fit=crop&q=80',
    brand: 'LAUNCHINGLAPS SUCCESS',
    tag: 'FOUNDER STORIES',
    headline: '$12M+ Raised Through Our Platform.',
    sub: 'Founders from 40+ countries have secured seed and Series A funding through LaunchingLaps. Join a community of entrepreneurs who are changing the world — backed by US capital.',
    cta: 'Join Now — It\'s Free',
    ctaLink: '/register',
    ctaBg: '#fff',
    ctaText: '#1e3a8a',
    accentColor: '#fbbf24',
    overlay: 'from-[#0a0800]/95 via-[#1a1200]/85 to-transparent',
    badgeBg: 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300',
    style: 'dark',
  },
  {
    id: 5,
    // Sequoia / VC firm style — clean, minimal, premium white
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1400&h=600&fit=crop&q=80',
    brand: 'LAUNCHINGLAPS NETWORK',
    tag: 'GLOBAL COMMUNITY',
    headline: 'Where the Next Unicorn Finds Its Investor.',
    sub: 'Connect, collaborate, and grow with a global community of 700+ entrepreneurs and investors. Share insights, get pitch feedback, and build relationships that last.',
    cta: 'Join the Network',
    ctaLink: '/register',
    ctaBg: '#10b981',
    ctaText: '#fff',
    accentColor: '#34d399',
    overlay: 'from-[#030d07]/95 via-[#051a0f]/80 to-transparent',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    style: 'dark',
  },
]

export default function AdCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % ADS.length)
    }, 5500)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (index) => {
    setCurrent(index)
    startTimer()
  }

  const ad = ADS[current]

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: '560px' }}>

      {/* Slides */}
      {ADS.map((a, i) => (
        <div
          key={a.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={a.image}
            alt={a.headline}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${a.overlay}`} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8 sm:px-12 w-full">
              <div className="max-w-2xl">

                {/* Brand line */}
                <p className="text-xs font-black tracking-[0.25em] uppercase mb-4" style={{ color: a.accentColor }}>
                  {a.brand}
                </p>

                {/* Tag badge */}
                <span className={`inline-flex items-center gap-1.5 border text-[11px] font-bold px-3 py-1 rounded-sm mb-5 tracking-widest uppercase ${a.badgeBg}`}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: a.accentColor }} />
                  {a.tag}
                </span>

                {/* Headline */}
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight drop-shadow-2xl">
                  {a.headline}
                </h2>

                {/* Divider */}
                <div className="w-16 h-0.5 mb-5" style={{ backgroundColor: a.accentColor }} />

                {/* Body */}
                <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg">
                  {a.sub}
                </p>

                {/* CTA */}
                <Link
                  to={a.ctaLink}
                  className="inline-flex items-center gap-3 font-black text-sm tracking-wider px-8 py-4 rounded-sm transition-all hover:scale-105 hover:shadow-2xl uppercase"
                  style={{ backgroundColor: a.ctaBg, color: a.ctaText }}
                >
                  {a.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative vertical accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: ad.accentColor, opacity: 0.8 }} />
        </div>
      ))}

      {/* Left/Right Arrows */}
      <button
        onClick={() => goTo((current - 1 + ADS.length) % ADS.length)}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/30 hover:border-white/70 bg-black/40 hover:bg-black/70 backdrop-blur text-white flex items-center justify-center transition-all text-xl font-light"
      >‹</button>
      <button
        onClick={() => goTo((current + 1) % ADS.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/30 hover:border-white/70 bg-black/40 hover:bg-black/70 backdrop-blur text-white flex items-center justify-center transition-all text-xl font-light"
      >›</button>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-8 pb-6">
        {/* Slide counter */}
        <p className="text-white/40 text-xs font-bold tracking-widest uppercase">
          {String(current + 1).padStart(2, '0')} / {String(ADS.length).padStart(2, '0')}
        </p>

        {/* Dot nav */}
        <div className="flex gap-2">
          {ADS.map((a, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all h-0.5"
              style={{
                width: i === current ? 32 : 12,
                backgroundColor: i === current ? ADS[current].accentColor : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>

        {/* Auto-play label */}
        <p className="text-white/30 text-xs tracking-widest uppercase">AUTO</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <div
          key={current}
          className="h-full"
          style={{
            backgroundColor: ADS[current].accentColor,
            animation: 'llprogress 5.5s linear',
          }}
        />
      </div>

      <style>{`
        @keyframes llprogress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  )
}
