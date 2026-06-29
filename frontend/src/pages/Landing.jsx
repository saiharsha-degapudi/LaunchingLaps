import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import ScrollingBanner from '../components/ScrollingBanner'
import api from '../api/axios'

// ── DATA ─────────────────────────────────────────────────────────────────────
const ADS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=600&fit=crop&q=80',
    brand: 'FOR ENTREPRENEURS',
    tag: 'LIVE NOW',
    headline: 'Your Startup. US Capital. First Match in 48 Hours.',
    sub: 'Submit once. 340+ verified investors come to you. No cold emails. No gatekeepers. Zero commission.',
    cta: 'Submit Your Pitch Free',
    ctaLink: '/register',
    ctaBg: '#f59e0b',
    accentColor: '#f59e0b',
    overlay: 'from-[#080808]/96 via-[#0d1b2a]/88 to-[#0a0a0a]/20',
    badgeBg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&h=600&fit=crop&q=80',
    brand: 'FOR INVESTORS',
    tag: 'AUDIT-VETTED DEAL FLOW',
    headline: "Stop Missing the Next Unicorn. It's Right Here.",
    sub: 'Every pitch reviewed. Every founder verified. Invest from $5K alongside institutional co-investors.',
    cta: 'Access Live Deal Flow',
    ctaLink: '/register',
    ctaBg: '#ff6600',
    accentColor: '#ff6600',
    overlay: 'from-[#0a0500]/96 via-[#1a0a00]/88 to-transparent',
    badgeBg: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=600&fit=crop&q=80',
    brand: 'THE SYNDICATE MODEL',
    tag: 'ONE VEHICLE. CLEAN CAP TABLE.',
    headline: 'Pool 20 Investors Into One Check. Close Faster.',
    sub: 'Lead investors earn 20% carry. Founders get one cap table entry. Investors co-deploy from $5K.',
    cta: 'See How Syndicates Work',
    ctaLink: '/register',
    ctaBg: '#1e3a8a',
    accentColor: '#60a5fa',
    overlay: 'from-[#0c1929]/96 via-[#0c1929]/80 to-transparent',
    badgeBg: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&h=600&fit=crop&q=80',
    brand: 'FOUNDER WINS',
    tag: '$12M+ DEPLOYED · 0% COMMISSION',
    headline: '500 Founders Funded. You Keep Every Dollar.',
    sub: "EcoDeliver closed $1.2M. SwiftRoute got 3 term sheets in a week. MedAI matched Impact Horizon Fund. You're next.",
    cta: 'Join Free — No Commission',
    ctaLink: '/register',
    ctaBg: '#fff',
    accentColor: '#fbbf24',
    overlay: 'from-[#0a0800]/96 via-[#1a1200]/88 to-transparent',
    badgeBg: 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1400&h=600&fit=crop&q=80',
    brand: 'GLOBAL NETWORK',
    tag: '60+ COUNTRIES · GROWING',
    headline: '340 Investors. 60 Countries. All Looking for You.',
    sub: 'Silicon Valley angels to Southeast Asia VCs — verified, active, and searching for your category right now.',
    cta: 'Join 700+ Founders',
    ctaLink: '/register',
    ctaBg: '#10b981',
    accentColor: '#34d399',
    overlay: 'from-[#030d07]/96 via-[#051a0f]/82 to-transparent',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  },
]

const SECTORS = ['🤖 Artificial Intelligence', '🌿 Green Tech', '🏥 HealthTech', '💰 FinTech', '🛒 E-Commerce', '🏗️ PropTech', '📱 SaaS', '🎓 EdTech', '🚗 Mobility', '🌾 AgriTech', '⚡ CleanEnergy', '🔬 BioTech']

const SEC_NAV = [
  { label: 'Pitches', href: '/pitches' },
  { label: 'Syndicates', href: '/spvs' },
  { label: 'Investors', href: '/investors' },
  { label: 'Learn', href: '/education' },
  { label: 'Community', href: '/community' },
  { label: 'Govt Schemes', href: '/government-schemes' },
]

const LIVE_ACTIVITY = [
  { icon: '🤝', text: 'MedAI Diagnostics matched with Impact Horizon Fund — $800K term sheet signed', time: '2m' },
  { icon: '💰', text: 'EcoDeliver closed $1.2M seed — GreenCap Ventures led the syndicate', time: '18m' },
  { icon: '✅', text: 'FarmConnect approved by audit team — now live to 340+ investors', time: '41m' },
  { icon: '🚀', text: 'SwiftRoute received 3 competing term sheets — founders choose', time: '1h' },
  { icon: '👤', text: 'TechBridge Capital (Bangalore) joined as verified investor — $250K–$2M ticket', time: '2h' },
  { icon: '📊', text: '14 new pitches across 6 industries approved today', time: '3h' },
  { icon: '🏆', text: 'NovaPay selected for LaunchingLaps Fast Track — meeting 12 VCs this month', time: '4h' },
]

const GLOBAL_NEWS = [
  { tag: 'Funding', headline: 'Y Combinator backs 245 startups in its largest batch ever', time: '2h ago' },
  { tag: 'Markets', headline: 'Global VC investment rebounds 18% in Q2 2025 — Asia leads', time: '4h ago' },
  { tag: 'Policy', headline: 'India launches $1B startup fund for deep-tech founders', time: '5h ago' },
  { tag: 'Tech', headline: 'OpenAI Startup Fund closes $175M for early-stage AI companies', time: '7h ago' },
  { tag: 'Africa', headline: 'African fintech raises record $2.4B in H1 2025', time: '9h ago' },
  { tag: 'IPO', headline: 'Stripe confidentially files for IPO at $65B valuation', time: '11h ago' },
  { tag: 'Climate', headline: 'EU Green Deal unlocks €800M for cleantech syndicate investment', time: '13h ago' },
  { tag: 'LatAm', headline: 'Brazil surpasses Mexico as top VC destination in Latin America', time: '15h ago' },
  { tag: 'SEA', headline: 'Southeast Asia sees 3× surge in cross-border syndicate deals', time: '17h ago' },
  { tag: 'Angel', headline: 'AngelList syndicates hit $10B deployed milestone globally', time: '1d ago' },
]

const TAG_COLORS = {
  Funding: 'bg-amber-100 text-amber-700', Markets: 'bg-blue-100 text-blue-700',
  Policy: 'bg-purple-100 text-purple-700', Tech: 'bg-cyan-100 text-cyan-700',
  Africa: 'bg-green-100 text-green-700', IPO: 'bg-rose-100 text-rose-700',
  Climate: 'bg-emerald-100 text-emerald-700', LatAm: 'bg-orange-100 text-orange-700',
  SEA: 'bg-indigo-100 text-indigo-700', Angel: 'bg-yellow-100 text-yellow-700',
}

const DEMO_ENTREPRENEURS = [
  { name: 'EcoDeliver', sub: 'Green Last-Mile Logistics', stage: 'Seed', goal: '$500K', desc: 'All-electric fleet · AI routing · 80% lower carbon · $180K MRR.' },
  { name: 'HealthBridge AI', sub: 'Rural Telemedicine', stage: 'Pre-Seed', goal: '$250K', desc: 'AI diagnostics reaching 10M+ underserved patients in rural India.' },
  { name: 'FarmLink', sub: 'AgriTech Marketplace', stage: 'Series A', goal: '$2M', desc: 'Direct farm-to-market across 14 states · 3× farmer income.' },
  { name: 'FinSpark', sub: 'SME Working Capital', stage: 'Seed', goal: '$800K', desc: 'Instant credit scoring for micro-enterprises using GST data.' },
  { name: 'EdifyVR', sub: 'Immersive Skill Training', stage: 'Pre-Seed', goal: '$300K', desc: 'VR vocational training · Tier 2/3 cities · 3× better outcomes.' },
  { name: 'CleanWave', sub: 'Water Purification IoT', stage: 'Series A', goal: '$3M', desc: 'Smart IoT water monitoring · 500+ municipalities · 98% uptime.' },
]

const DEMO_INVESTORS = [
  { name: 'Sarah Williams', firm: 'GreenCap Ventures', range: '$100K–$1M', focus: 'Climate Tech · 12 yrs · 34 portfolio cos.' },
  { name: 'Ravi Mehta', firm: 'Blume Ventures', range: '$250K–$5M', focus: 'SaaS · Deep Tech · 9 yrs · Series A/B' },
  { name: 'Priya Kapoor', firm: 'Sequoia Surge', range: '$500K–$10M', focus: 'Consumer · FinTech · 15 yrs experience' },
  { name: 'James Okafor', firm: 'Y Combinator', range: '$125K–$500K', focus: 'Early Stage · Global Markets · 180+ bets' },
  { name: 'Elena Vasquez', firm: 'Tiger Global', range: '$2M–$50M', focus: 'Growth · B2B SaaS · HealthTech' },
  { name: 'Arjun Nair', firm: 'Accel India', range: '$1M–$20M', focus: 'EdTech · AgriTech · Series A/B specialist' },
]

// ── DESIGN TREND HOOKS ────────────────────────────────────────────────────────

// Trend 1 & 7: Scroll progress + pageless indicator
function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const update = () => {
      const d = document.documentElement
      setP((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return p
}

// Trend 9/10: 3D tilt for flat cards
function useTilt3D(strength = 7) {
  const ref = useRef(null)
  const onMouseMove = useCallback((e) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateZ(8px)`
    el.style.transition = 'transform 0.08s ease'
  }, [strength])
  const onMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    ref.current.style.transition = 'transform 0.4s ease'
  }, [])
  return { ref, onMouseMove, onMouseLeave }
}

// Scroll reveal for dynamic storytelling
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── DESIGN TREND COMPONENTS ───────────────────────────────────────────────────

// Trend 8: Kinetic/animated typography — words slide up one by one
function KineticText({ text, color, baseDelay = 0, className = '' }) {
  const { ref, inView } = useInView(0.2)
  const words = text.split(' ')
  return (
    <span ref={ref} className={className} style={{ display: 'inline' }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
          <span style={{
            display: 'inline-block',
            color,
            animation: inView ? `wordSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards` : 'none',
            animationDelay: `${baseDelay + i * 0.08}s`,
            opacity: inView ? undefined : 0,
          }}>
            {w}{' '}
          </span>
        </span>
      ))}
    </span>
  )
}

// Trend 7: Horizontal drag-scroll sector browser
function HorizontalSectors() {
  const ref = useRef(null)
  const drag = useRef({ down: false, startX: 0, sl: 0 })
  const onMouseDown = (e) => { drag.current = { down: true, startX: e.pageX - ref.current.offsetLeft, sl: ref.current.scrollLeft }; if (ref.current) ref.current.style.cursor = 'grabbing' }
  const onMouseUp   = () => { drag.current.down = false; if (ref.current) ref.current.style.cursor = 'grab' }
  const onMouseMove = (e) => {
    if (!drag.current.down || !ref.current) return
    e.preventDefault()
    ref.current.scrollLeft = drag.current.sl - (e.pageX - ref.current.offsetLeft - drag.current.startX) * 1.6
  }

  const sectors = [
    { icon: '🤖', name: 'AI',          color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
    { icon: '💰', name: 'FinTech',     color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
    { icon: '🏥', name: 'HealthTech',  color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
    { icon: '🌿', name: 'CleanTech',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)'   },
    { icon: '📱', name: 'SaaS',        color: '#3b82f6', bg: 'rgba(59,130,246,0.08)'  },
    { icon: '🎓', name: 'EdTech',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)'  },
    { icon: '🛒', name: 'E-Commerce',  color: '#f97316', bg: 'rgba(249,115,22,0.08)'  },
    { icon: '🏗️', name: 'PropTech',    color: '#64748b', bg: 'rgba(100,116,139,0.08)' },
    { icon: '🚗', name: 'Mobility',    color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)'  },
    { icon: '🌾', name: 'AgriTech',    color: '#84cc16', bg: 'rgba(132,204,22,0.08)'  },
    { icon: '⚡', name: 'CleanEnergy', color: '#eab308', bg: 'rgba(234,179,8,0.08)'   },
    { icon: '🔬', name: 'BioTech',     color: '#ec4899', bg: 'rgba(236,72,153,0.08)'  },
  ]

  return (
    <div className="bg-white border-t border-b border-gray-100 py-6 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Browse by sector — drag to explore</p>
          <Link to="/pitches" className="text-xs font-black text-amber-500 hover:text-amber-600 transition">View all deals →</Link>
        </div>
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto select-none pb-1"
          style={{ scrollbarWidth: 'none', cursor: 'grab' }}
          onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
        >
          {sectors.map(s => (
            <Link
              key={s.name} to="/pitches" draggable={false}
              onMouseDown={e => e.preventDefault()}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-2xl transition-all hover:scale-105 hover:shadow-md"
              style={{ background: s.bg, border: `1.5px solid transparent`, minWidth: 86 }}
              onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${s.color}40`; e.currentTarget.style.background = `${s.bg.replace('0.08)', '0.14)')}` }}
              onMouseLeave={e => { e.currentTarget.style.border = '1.5px solid transparent'; e.currentTarget.style.background = s.bg }}
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-[10px] font-black text-center leading-tight" style={{ color: s.color }}>{s.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Trend 1: Dynamic storytelling — role-based auto-cycling narrative section
function DynamicStorySection() {
  const [active, setActive] = useState(0)
  const { ref, inView } = useInView(0.1)

  const stories = [
    {
      role: 'FOUNDER',
      icon: '🚀',
      label: 'Entrepreneurs',
      accent: '#f59e0b',
      bg: 'linear-gradient(135deg, #060e1f 0%, #0d1b2a 100%)',
      headline: 'Your pitch. Their capital. 48 hours.',
      sub: 'You built something real. Now get it in front of 340+ investors who are actively looking for exactly what you made. No cold emails. No gatekeepers.',
      stat: { v: '500+', l: 'Founders funded' },
      cta: 'Submit your pitch free',
      ctaLink: '/register',
      visual: '🚀',
    },
    {
      role: 'INVESTOR',
      icon: '💼',
      label: 'Investors',
      accent: '#d4af37',
      bg: 'linear-gradient(135deg, #0a0600 0%, #1a0e00 100%)',
      headline: 'Every deal, audit-vetted. No noise.',
      sub: 'Stop wading through unqualified pitches. Every startup passes expert audit review before you see it. Filter by thesis, stage, and geography.',
      stat: { v: '340+', l: 'Verified investors' },
      cta: 'Access deal flow',
      ctaLink: '/register',
      visual: '📊',
    },
    {
      role: 'SYNDICATE',
      icon: '🏦',
      label: 'Syndicates',
      accent: '#60a5fa',
      bg: 'linear-gradient(135deg, #02080f 0%, #060e1f 100%)',
      headline: 'Lead. Earn carry. Build legacy.',
      sub: '5–50 investors. One SPV. One cap table entry. Lead syndicates, earn 20% carried interest, and co-invest from $5K alongside institutional players.',
      stat: { v: '$12M+', l: 'Deployed via syndicates' },
      cta: 'Create a syndicate',
      ctaLink: '/lead-spv',
      visual: '🏦',
    },
    {
      role: 'AUDITOR',
      icon: '🔍',
      label: 'Auditors',
      accent: '#34d399',
      bg: 'linear-gradient(135deg, #021a0e 0%, #04261a 100%)',
      headline: 'Your expertise. Their compliance. Zero bottlenecks.',
      sub: 'Review startup financials, validate pitch decks, and issue audit-certified badges that unlock faster investor trust. Your sign-off moves deals forward.',
      stat: { v: '24hr', l: 'Avg turnaround per audit' },
      cta: 'Join as an Auditor',
      ctaLink: '/register',
      visual: '🔍',
    },
    {
      role: 'LAWYER',
      icon: '⚖️',
      label: 'Corp. Lawyers',
      accent: '#a78bfa',
      bg: 'linear-gradient(135deg, #0a0214 0%, #110620 100%)',
      headline: 'Structure the deal. Protect every party.',
      sub: 'Draft term sheets, SPV agreements, and cross-border investment contracts for founders and investors closing deals on LaunchingLaps. Get recurring mandates from verified deal flow.',
      stat: { v: '60+', l: 'Countries covered' },
      cta: 'List your practice',
      ctaLink: '/register',
      visual: '⚖️',
    },
    {
      role: 'BANKER',
      icon: '🏛️',
      label: 'Bankers',
      accent: '#38bdf8',
      bg: 'linear-gradient(135deg, #00101a 0%, #001a2c 100%)',
      headline: 'Connect capital to opportunity — at scale.',
      sub: 'Source high-growth startup clients, structure debt facilities, and co-invest alongside our syndicate network. LaunchingLaps is where the next generation of bankable businesses starts.',
      stat: { v: '$50M+', l: 'Deal pipeline value' },
      cta: 'Partner with us',
      ctaLink: '/register',
      visual: '🏛️',
    },
    {
      role: 'MSME',
      icon: '🏭',
      label: 'MSME',
      accent: '#fb923c',
      bg: 'linear-gradient(135deg, #140600 0%, #1e0b00 100%)',
      headline: 'Micro to mighty. Funding that fits your scale.',
      sub: 'Access government schemes, micro-investment syndicates, and growth capital tailored for small and medium businesses. Build your investor story — even without a flashy tech product.',
      stat: { v: '200+', l: 'MSME pitches funded' },
      cta: 'Find MSME funding',
      ctaLink: '/register',
      visual: '🏭',
    },
    {
      role: 'CREATOR',
      icon: '🎨',
      label: 'Creators',
      accent: '#f472b6',
      bg: 'linear-gradient(135deg, #140010 0%, #1e0018 100%)',
      headline: 'Monetise your audience. Raise like a founder.',
      sub: 'Your content is your traction. Turn subscribers, views, and brand deals into fundable metrics. Pitch your creator economy startup to investors who understand digital-first businesses.',
      stat: { v: '10M+', l: 'Audience reach represented' },
      cta: 'Pitch your creator biz',
      ctaLink: '/register',
      visual: '🎨',
    },
  ]

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActive(a => (a + 1) % stories.length), 4500)
    return () => clearInterval(t)
  }, [inView])

  const s = stories[active]

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: s.bg, minHeight: 420, transition: 'background 0.8s ease' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${s.accent}14 0%, transparent 70%)`,
        transition: 'background 0.8s ease',
      }} />
      {/* Floating orbs */}
      <div className="absolute top-8 left-8 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ background: s.accent, opacity: 0.06, animation: 'floatY 5s ease-in-out infinite' }} />
      <div className="absolute bottom-8 right-16 w-24 h-24 rounded-full blur-2xl pointer-events-none" style={{ background: s.accent, opacity: 0.05, animation: 'floatY2 7s ease-in-out infinite' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: text */}
        <div className="flex-1">
          {/* Role switcher tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {stories.map((st, i) => (
              <button key={st.role} onClick={() => setActive(i)}
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap"
                style={{
                  background: i === active ? st.accent : 'rgba(255,255,255,0.07)',
                  color: i === active ? '#000' : 'rgba(255,255,255,0.35)',
                  border: `1px solid ${i === active ? st.accent : 'rgba(255,255,255,0.12)'}`,
                  transform: i === active ? 'scale(1.05)' : 'scale(1)',
                }}>
                <span>{st.icon}</span>{st.label}
              </button>
            ))}
          </div>

          <p key={`label-${active}`} className="text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            style={{ color: s.accent, animation: 'fadeSlideIn 0.4s ease forwards' }}>
            Built for {s.label}
          </p>

          <h2 key={`h-${active}`} className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight mb-5"
            style={{ animation: 'fadeSlideIn 0.45s ease forwards' }}>
            {s.headline}
          </h2>

          <p key={`p-${active}`} className="text-white/50 text-lg leading-relaxed mb-8 max-w-md"
            style={{ animation: 'fadeSlideIn 0.5s ease 0.05s forwards', opacity: 0 }}>
            {s.sub}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <div key={`stat-${active}`} style={{ animation: 'fadeSlideIn 0.5s ease 0.1s forwards', opacity: 0 }}>
              <p className="text-3xl font-black" style={{ color: s.accent }}>{s.stat.v}</p>
              <p className="text-white/30 text-xs mt-0.5">{s.stat.l}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <Link to={s.ctaLink}
              className="inline-flex items-center gap-2 font-black text-sm px-6 py-3 rounded-full transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: s.accent, color: '#000', boxShadow: `0 8px 24px ${s.accent}40` }}>
              {s.cta} →
            </Link>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {stories.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all duration-300"
                style={{ width: i === active ? 24 : 6, height: 6, background: i === active ? s.accent : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>

        {/* Right: 3D floating visual */}
        <div className="flex-1 flex items-center justify-center">
          <div key={`vis-${active}`} style={{ fontSize: 120, lineHeight: 1, animation: 'floatY 3s ease-in-out infinite, fadeSlideIn 0.4s ease forwards', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.6))' }}>
            {s.visual}
          </div>
        </div>
      </div>

      {/* Auto-progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div key={`bar-${active}`} className="h-full" style={{ background: s.accent, animation: 'llprogress 4.5s linear' }} />
      </div>
      <style>{`@keyframes llprogress { from { width:0% } to { width:100% } }`}</style>
    </section>
  )
}

// Testimonial card with 3D tilt
function TestimonialCard({ t }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt3D(4)
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden cursor-default"
      style={{ transition: 'transform 0.15s ease' }}>
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">{t.outcome}</div>
      <div className="flex gap-0.5 mt-2 mb-4">{Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
      <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.quote}"</p>
      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#060e1f] to-amber-500 flex items-center justify-center text-lg">{t.avatar}</div>
        <div>
          <p className="font-black text-gray-900 text-sm">{t.name}</p>
          <p className="text-gray-400 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  )
}

// Trend 9/10: 3D tilt feature card (flat design + 3D depth)
function Feature3DCard({ emoji, title, desc, cta, to }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt3D(6)
  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <Link to={to} className="group bg-white p-6 hover:bg-[#060e1f] transition-colors duration-300 flex flex-col h-full">
        <div className="text-3xl mb-4 transition-transform group-hover:scale-110 duration-300">{emoji}</div>
        <h3 className="font-black text-gray-900 group-hover:text-white text-base mb-2 transition-colors">{title}</h3>
        <p className="text-gray-500 group-hover:text-white/50 text-sm leading-relaxed flex-1 transition-colors">{desc}</p>
        <p className="mt-4 text-xs font-black text-amber-500 group-hover:text-amber-400 inline-flex items-center gap-1 transition-colors">{cta} →</p>
      </Link>
    </div>
  )
}

// ── EXISTING COMPONENTS (unchanged) ──────────────────────────────────────────

function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      observer.disconnect()
      let start = 0
      const end = parseInt(target.replace(/\D/g, ''))
      const step = Math.ceil(end / (1800 / 16))
      const timer = setInterval(() => {
        start = Math.min(start + step, end)
        setVal(start)
        if (start >= end) clearInterval(timer)
      }, 16)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

function useAutoScroll(ref, paused) {
  const pos = useRef(0)
  const raf = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const step = () => {
      if (!paused.current) {
        pos.current += 0.5
        if (pos.current >= el.scrollHeight / 2) pos.current = 0
        el.scrollTop = pos.current
      }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [])
}

function ScrollPanel({ title, color, headerBg, borderColor, dotColor, children, items }) {
  const ref = useRef(null)
  const paused = useRef(false)
  useAutoScroll(ref, paused)
  return (
    <div className={`rounded-xl overflow-hidden border ${borderColor} ${headerBg} shadow-sm flex flex-col flex-1 min-h-0`}>
      <div className={`flex items-center gap-2 px-3 py-2 border-b ${borderColor} flex-shrink-0`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
        <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</p>
      </div>
      <div ref={ref} className="flex-1 overflow-hidden px-3 py-1"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}>
        {[...items, ...items].map((item, i) => children(item, i))}
      </div>
    </div>
  )
}

function RightInfoPanel({ pitches, investors }) {
  const entItems = pitches.length > 0
    ? pitches.map(p => ({ name: p.title, stage: p.stage, goal: p.funding_goal >= 1_000_000 ? `$${(p.funding_goal/1_000_000).toFixed(1)}M` : `$${(p.funding_goal/1_000).toFixed(0)}K`, desc: p.description }))
    : DEMO_ENTREPRENEURS
  const invItems = investors.length > 0
    ? investors.map(inv => ({ name: inv.user?.full_name || 'Investor', firm: inv.firm_name || '', range: inv.investment_min && inv.investment_max ? `$${(inv.investment_min/1_000).toFixed(0)}K–$${inv.investment_max>=1_000_000?`${(inv.investment_max/1_000_000).toFixed(1)}M`:`${(inv.investment_max/1_000).toFixed(0)}K`}` : '$100K–$1M', focus: inv.bio || 'Verified global investor.' }))
    : DEMO_INVESTORS

  return (
    <div className="flex flex-col gap-2" style={{ height: '440px' }}>
      <ScrollPanel title="🚀 Live Pitches" color="text-amber-700" headerBg="bg-gradient-to-br from-[#fffbf0] to-[#fff8e1]" borderColor="border-amber-200" dotColor="bg-amber-500" items={entItems}>
        {(e, i) => (
          <div key={i} className="py-1.5 border-b border-amber-50 last:border-0 cursor-pointer hover:bg-amber-50/60 -mx-1 px-1 rounded transition-colors">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <p className="text-[10px] font-black text-gray-900 truncate">{e.name}</p>
              <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 uppercase">{e.stage}</span>
            </div>
            <p className="text-[9px] text-gray-500 line-clamp-1 mb-0.5">{e.desc}</p>
            <p className="text-amber-600 font-black text-[9px]">{e.goal} goal</p>
          </div>
        )}
      </ScrollPanel>
      <ScrollPanel title="💼 Active Investors" color="text-blue-700" headerBg="bg-gradient-to-br from-[#f0f6ff] to-[#e8f2ff]" borderColor="border-blue-200" dotColor="bg-blue-500" items={invItems}>
        {(inv, i) => (
          <div key={i} className="py-1.5 border-b border-blue-50 last:border-0 cursor-pointer hover:bg-blue-50/60 -mx-1 px-1 rounded transition-colors">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white font-black text-[9px] flex-shrink-0">{inv.name[0]}</div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-900 truncate">{inv.name}</p>
                <p className="text-[8px] text-gray-400 truncate">{inv.firm}</p>
              </div>
              <span className="ml-auto bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0">{inv.range}</span>
            </div>
            <p className="text-[9px] text-gray-500 line-clamp-1">{inv.focus}</p>
          </div>
        )}
      </ScrollPanel>
      <ScrollPanel title="🌍 Global Startup News" color="text-gray-600" headerBg="bg-gray-50" borderColor="border-gray-200" dotColor="bg-red-500" items={GLOBAL_NEWS}>
        {(n, i) => (
          <div key={i} className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded transition-colors">
            <span className={`flex-shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${TAG_COLORS[n.tag] || 'bg-gray-100 text-gray-600'}`}>{n.tag}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-gray-800 leading-snug line-clamp-2">{n.headline}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        )}
      </ScrollPanel>
    </div>
  )
}

function LiveStrip() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % LIVE_ACTIVITY.length), 4000)
    return () => clearInterval(t)
  }, [])
  const item = LIVE_ACTIVITY[idx]
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#060e1f] border-t border-white/10 py-2.5 px-4">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hidden sm:block">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p key={idx} className="text-sm text-white/70 truncate" style={{ animation: 'fadeSlideIn 0.4s ease' }}>
            <span className="mr-1.5">{item.icon}</span>
            <span className="font-semibold text-white">{item.text}</span>
            <span className="text-white/30 ml-2 text-xs">· {item.time} ago</span>
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-5 flex-shrink-0">
          {[['500+', 'Founders'], ['$12M+', 'Raised'], ['340+', 'Investors'], ['0%', 'Commission']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-amber-400 font-black text-sm leading-none">{v}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AtlasSection({ label, headline, sub, benefits, cta, ctaLink, ctaSecondary, ctaSecondaryLink, dark = false, image, imageAlt, imageLeft = false }) {
  const { ref, inView } = useInView(0.1)
  const bg = dark ? 'bg-[#060e1f] text-white' : 'bg-white text-gray-900'
  const subColor = dark ? 'text-white/50' : 'text-gray-500'
  const labelColor = dark ? 'text-amber-400' : 'text-amber-600'
  const benefitTitleColor = dark ? 'text-white' : 'text-gray-900'
  const benefitDescColor = dark ? 'text-white/50' : 'text-gray-500'
  const dividerColor = dark ? 'border-white/10' : 'border-gray-100'

  return (
    <section ref={ref} className={`${bg} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col ${image ? (imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row') : ''} gap-16 items-center`}>
          <div className={`flex-1 ${image ? 'max-w-xl' : 'max-w-3xl mx-auto text-center'}`}
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <p className={`text-xs font-black uppercase tracking-[0.2em] ${labelColor} mb-4`}>{label}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-4">{headline}</h2>
            <p className={`text-lg leading-relaxed ${subColor} mb-10 ${!image && 'max-w-2xl mx-auto'}`}>{sub}</p>
            <div className={`grid ${image ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-0 mb-10 border-t ${dividerColor}`}>
              {benefits.map((b, i) => (
                <div key={i} className={`py-6 ${image ? '' : 'sm:px-6 sm:border-l'} ${i === 0 ? 'sm:pl-0 sm:border-l-0' : ''} border-b ${dividerColor}`}>
                  <p className="text-2xl mb-2">{b.icon}</p>
                  <p className={`font-black text-sm mb-1 ${benefitTitleColor}`}>{b.title}</p>
                  <p className={`text-sm leading-relaxed ${benefitDescColor}`}>{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {cta && <Link to={ctaLink} className={`inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-full transition-all hover:scale-105 ${dark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-[#060e1f] text-white hover:bg-[#0d1b3e]'}`}>{cta} →</Link>}
              {ctaSecondary && <Link to={ctaSecondaryLink} className={`inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-full border transition-all hover:scale-105 ${dark ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'}`}>{ctaSecondary}</Link>}
            </div>
          </div>
          {image && (
            <div className="flex-1 max-w-lg w-full"
              style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
                {dark && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── MAIN LANDING ──────────────────────────────────────────────────────────────
export default function Landing() {
  const [activeTab, setActiveTab] = useState('entrepreneur')
  const [pitches, setPitches]     = useState([])
  const [investors, setInvestors] = useState([])
  const scrollProgress = useScrollProgress()

  useEffect(() => {
    api.get('/pitches/').then(r => setPitches(r.data)).catch(() => {})
    api.get('/investors/').then(r => setInvestors(r.data)).catch(() => {})
  }, [])

  const FEATURES = [
    { to: '/spvs',      emoji: '🏦', title: 'Investment Syndicates',  desc: '5–50 investors pooled into one SPV. One cap table entry. One wire. Faster close for everyone.', cta: 'Browse Syndicates' },
    { to: '/lead-spv',  emoji: '🎯', title: 'Lead & Earn Carry',      desc: 'Lead a syndicate, curate the deal, earn 20% carried interest on returns. No minimum AUM.',        cta: 'Create a Syndicate' },
    { to: '/pitches',   emoji: '✅', title: 'Audit-Vetted Pitches',   desc: 'Every startup reviewed before it goes live. Investors get quality. Founders get credibility.',      cta: 'View Live Pitches' },
    { to: '/community', emoji: '💬', title: 'Founder Community',       desc: "Ask questions, share wins, learn from 500+ founders who've closed deals on the platform.",         cta: 'Join Community' },
    { to: '/education', emoji: '🎓', title: 'Investor-Ready Courses', desc: 'Cap tables, valuations, term sheets, pitch structure. Built by investors. Free to access.',          cta: 'Start Learning' },
    { to: '/messages',  emoji: '🔐', title: 'Secure Deal Messaging',  desc: 'Private conversations between founders and investors. No email chains. No data leaks.',             cta: 'Open Messages' },
  ]

  return (
    <>
      {/* ── TREND 6/7: Scroll progress bar (pageless / horizontal scroll indicator) ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
        style={{ background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', transform: `scaleX(${scrollProgress / 100})`, transformOrigin: 'left' }} />

      {/* ── SECONDARY NAV ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center overflow-x-auto">
          {SEC_NAV.map(item => (
            <Link key={item.label} to={item.href}
              className="flex-shrink-0 px-5 py-3.5 text-sm font-semibold text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition-all whitespace-nowrap">
              {item.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2 px-2 flex-shrink-0">
            <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-full transition whitespace-nowrap">Submit Pitch</Link>
            <Link to="/register" state={{ defaultRole: 'investor' }} className="bg-[#060e1f] hover:bg-[#0d1b3e] text-white text-xs font-black px-4 py-2 rounded-full transition whitespace-nowrap">Investor Access</Link>
          </div>
        </div>
      </div>

      {/* ── CAROUSEL + RIGHT PANEL ── */}
      <div className="bg-[#f5f5f3] py-4 px-4">
        <div className="max-w-screen-xl mx-auto flex gap-4">
          <div className="flex-1 min-w-0"><ControlledCarousel /></div>
          <div className="hidden lg:block w-[220px] flex-shrink-0">
            <RightInfoPanel pitches={pitches} investors={investors} />
          </div>
        </div>
      </div>

      {/* ── STATS BAR (counter animation) ── */}
      <div className="bg-white border-t border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex divide-x divide-gray-100">
            {[
              { value: '500', suffix: '+', label: 'Funded Founders', sub: 'From 60+ countries' },
              { value: '340', suffix: '+', label: 'Verified Investors', sub: 'Actively deploying capital' },
              { value: '12',  suffix: 'M+', label: 'USD Deployed', sub: 'Across all syndicates' },
              { value: '0',   suffix: '%', label: 'Commission', sub: 'Keep every dollar you raise' },
            ].map(s => (
              <div key={s.label} className="flex-1 px-5 py-5">
                <p className="text-3xl font-black text-gray-900 leading-none tracking-tight">
                  <Counter target={s.value} />{s.suffix}
                </p>
                <p className="text-gray-800 text-xs font-bold mt-1.5">{s.label}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LiveStrip />

      {/* ── DYNAMIC STORY SECTION ── */}
      <DynamicStorySection />

      {/* ── TREND 8: KINETIC HERO ── */}
      <section className="relative bg-[#060e1f] text-white py-16 px-4 overflow-hidden">
        {/* Trend 3/9: Ambient floating orbs (3D depth illusion) */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: '#f59e0b', opacity: 0.045, animation: 'floatY 7s ease-in-out infinite' }} />
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full blur-2xl pointer-events-none" style={{ background: '#60a5fa', opacity: 0.04, animation: 'floatY2 9s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full blur-3xl pointer-events-none" style={{ background: '#f59e0b', opacity: 0.03 }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400 mb-6 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            The Global Startup-Investor Platform
          </p>

          {/* Trend 8: Kinetic typography */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-7">
            <KineticText text="Where great startups" baseDelay={0.05} /><br />
            <KineticText text="meet global capital." color="#f59e0b" baseDelay={0.4} className="shimmer-text" />
          </h1>

          <p className="text-white/50 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
            Cold emails don't work. Warm intros take months. LaunchingLaps puts your pitch in front of 340+ verified investors — in 48 hours.
          </p>
          <p className="text-white/20 text-sm mb-10">Priya raised $350K in 6 weeks · EcoDeliver closed $1.2M · Carlos closed $250K seed</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 font-black text-base px-9 py-4 rounded-full transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-2">
              Submit Your Pitch Free <span className="text-gray-400 text-sm font-normal">→ 15 min</span>
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }} className="border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-black text-base px-9 py-4 rounded-full transition-all hover:scale-105">
              Investor Access →
            </Link>
          </div>
          <p className="text-white/20 text-xs">No credit card · No hidden fees · No commission on your raise · Ever</p>
        </div>
      </section>

      {/* ── 1. PLATFORM BENTO GRID ── */}
      <section style={{ background: '#060e1f' }} className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-4">

            {/* Left: Pitches — tall card with real image */}
            <div className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-8 min-h-[460px]"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(150deg, rgba(6,14,31,0.97) 0%, rgba(6,14,31,0.55) 100%)' }} />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Pitches
                </span>
                <h3 className="text-3xl font-black text-white leading-tight mb-3">Impossible to miss.<br />Impossible to ignore.</h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">Your pitch in front of 340+ verified investors. Audit-reviewed within 24 hours. First investor match in 48.</p>
                <div className="flex gap-2 flex-wrap mb-7">
                  {['Audit-Reviewed', '48hr Match', 'Zero Commission'].map(tag => (
                    <span key={tag} className="text-[10px] font-black px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Link to="/pitches" className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-full transition-all hover:scale-105"
                    style={{ background: '#f59e0b', color: '#000' }}>
                    See Live Pitches
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <Link to="/register" className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-full transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
                    Submit Your Pitch
                  </Link>
                </div>
              </div>
              <div className="relative z-10 grid grid-cols-3 gap-3 mt-8">
                {[{ v: '500+', l: 'Founders' }, { v: '$12M+', l: 'Raised' }, { v: '0%', l: 'Commission' }].map(s => (
                  <div key={s.l} className="rounded-2xl px-3 py-3 text-center"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-xl font-black text-amber-400">{s.v}</div>
                    <div className="text-[9px] text-white/40 uppercase tracking-wide mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: 3 stacked cards */}
            <div className="flex flex-col gap-4">

              {/* Syndicates */}
              <div className="rounded-3xl p-7 flex-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Syndicates</p>
                    <h3 className="text-xl font-black text-white leading-tight">One check.<br />Clean cap table.</h3>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-3xl font-black text-white">20%</div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wide">Carry Earned</div>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed mb-5">Pool 5 to 50 investors into one SPV. Founders get one cap table entry, not 20. Lead investors earn carried interest.</p>
                <div className="flex gap-3">
                  <Link to="/spvs" className="text-xs font-black text-amber-400 hover:text-amber-300 transition-colors">Browse Syndicates →</Link>
                  <Link to="/lead-spv" className="text-xs font-black text-white/40 hover:text-white transition-colors">Create a Syndicate →</Link>
                </div>
              </div>

              {/* Investors + Education side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl p-5 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Investors</p>
                  <h4 className="text-sm font-black text-white leading-snug mb-3 flex-1">Deal flow without the noise.</h4>
                  <div className="text-2xl font-black text-white">340+</div>
                  <div className="text-[9px] text-white/35 uppercase tracking-wide mb-4">Verified globally</div>
                  <Link to="/investors" className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors">Access Network →</Link>
                </div>
                <div className="rounded-3xl p-5 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Education</p>
                  <h4 className="text-sm font-black text-white leading-snug mb-3 flex-1">Learn how US investors think.</h4>
                  <div className="text-2xl font-black text-white">12+</div>
                  <div className="text-[9px] text-white/35 uppercase tracking-wide mb-4">Expert courses</div>
                  <Link to="/education" className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 transition-colors">Start Learning →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TESTIMONIALS — MAGAZINE SPLIT ── */}
      <section style={{ background: '#f7f7f5' }} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-14 items-start">

            {/* Left: large pull quote + stats */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600 mb-7">Real Results</p>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-[1.2] mb-7">
                "I spent 6 months sending cold emails. On LaunchingLaps, I had 3 investor conversations in week one."
              </p>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>PS</div>
                <div>
                  <div className="font-black text-gray-900 text-sm">Priya Sharma</div>
                  <div className="text-gray-400 text-xs">Founder, MediReach · $350K Raised</div>
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ background: '#060e1f' }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[{ v: '500+', l: 'Founders funded' }, { v: '$12M+', l: 'Total raised' }, { v: '48hrs', l: 'Avg first match' }].map(s => (
                    <div key={s.l}>
                      <div className="text-xl sm:text-2xl font-black text-amber-400">{s.v}</div>
                      <div className="text-[9px] text-white/35 mt-1 uppercase tracking-wide">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: 2 stacked testimonial cards */}
            <div className="flex flex-col gap-4">
              {[
                { name: 'James Okafor', role: 'Angel Investor, New York', outcome: '2 Portfolio Cos', initials: 'JO', color: '#3b82f6', quote: 'The audit team does the vetting I used to spend hours doing myself. Two investments matching my thesis within 30 days. Deal flow quality here is elite.' },
                { name: 'Carlos Rivera', role: 'Founder, GreenLogix', outcome: '$250K Seed', initials: 'CR', color: '#10b981', quote: 'The education courses transformed how I pitch. Learning how US investors think gave me the framework to close our seed round. Changed everything.' },
              ].map(t => (
                <div key={t.name} className="rounded-2xl p-7 bg-white" style={{ border: '1px solid #ececec' }}>
                  <p className="text-gray-700 text-base leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{ background: t.color + '18', color: t.color }}>{t.initials}</div>
                      <div>
                        <div className="font-black text-gray-900 text-sm">{t.name}</div>
                        <div className="text-gray-400 text-xs">{t.role}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{ background: t.color + '12', color: t.color }}>{t.outcome}</span>
                  </div>
                </div>
              ))}

              {/* Inline mini stat strip */}
              <div className="rounded-2xl p-5 flex items-center gap-6 flex-wrap" style={{ background: '#fff', border: '1px solid #ececec' }}>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
                <p className="text-sm font-black text-gray-900 flex-1">Rated 4.9/5 by 300+ founders and investors</p>
                <Link to="/register" className="text-xs font-black px-4 py-2 rounded-full transition-all hover:scale-105 flex-shrink-0"
                  style={{ background: '#060e1f', color: '#fff' }}>Join Free</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS — SIDE BY SIDE ── */}
      <section style={{ background: '#060e1f' }} className="py-20 px-6" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: headline + toggle + CTA */}
            <div className="lg:sticky lg:top-24">
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] mb-3">
                From zero to funded<br /><span style={{ color: '#f59e0b' }}>in 4 steps.</span>
              </h2>
              <p className="text-white/40 text-base mb-8 max-w-sm leading-relaxed">Whether raising or investing, designed to get you to a deal fast.</p>
              <div className="inline-flex rounded-full p-1 mb-8" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <button onClick={() => setActiveTab('entrepreneur')}
                  className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === 'entrepreneur' ? 'bg-white text-gray-900' : 'text-white/50 hover:text-white'}`}>
                  I'm a Founder
                </button>
                <button onClick={() => setActiveTab('investor')}
                  className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === 'investor' ? 'bg-amber-500 text-white' : 'text-white/50 hover:text-white'}`}>
                  I'm an Investor
                </button>
              </div>
              <div>
                <Link to="/register"
                  className="inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-full transition-all hover:scale-105"
                  style={{ background: activeTab === 'entrepreneur' ? '#f59e0b' : '#fff', color: '#060e1f' }}>
                  {activeTab === 'entrepreneur' ? 'Submit Your Pitch Free' : 'Access Deal Flow'} →
                </Link>
              </div>
            </div>

            {/* Right: step list */}
            <div className="flex flex-col gap-3">
              {(activeTab === 'entrepreneur'
                ? [
                    { step: '01', time: '5 min', title: 'Create Your Free Profile', desc: 'Tell us about your startup — industry, stage, traction, vision. No credit card. No fees. Ever.' },
                    { step: '02', time: '15 min', title: 'Submit Your Pitch', desc: 'Upload your deck, funding goal, and overview. Our audit team reviews within 24 hours.' },
                    { step: '03', time: '48 hrs', title: 'Investors Find You', desc: '340+ active investors browse daily. Get notified the moment someone expresses interest.' },
                    { step: '04', time: 'Your terms', title: 'Close on Your Terms', desc: 'Connect, negotiate, and close through our syndicate structure — one check, clean cap table.' },
                  ]
                : [
                    { step: '01', time: '5 min', title: 'Join as Verified Investor', desc: 'Set your thesis: industries, stages, check size. See only deals that match your strategy.' },
                    { step: '02', time: 'Daily', title: 'Browse Audit-Vetted Deals', desc: 'Every pitch reviewed before it reaches you. No noise. Only quality deal flow.' },
                    { step: '03', time: 'Your call', title: 'Lead or Co-Invest', desc: 'Express interest, connect with founders, or lead a syndicate and earn 20% carried interest.' },
                    { step: '04', time: 'Ongoing', title: 'Build a Global Portfolio', desc: 'Track deals, communicate with founders, and build a portfolio across 60+ countries.' },
                  ]
              ).map((item) => (
                <div key={item.step} className="flex items-start gap-4 rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                    style={{ background: activeTab === 'entrepreneur' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)', color: activeTab === 'entrepreneur' ? '#f59e0b' : '#fff' }}>
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-black text-white text-sm">{item.title}</h4>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>{item.time}</span>
                    </div>
                    <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. COMPARISON TABLE ── */}
      <section style={{ background: '#f7f7f5' }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Why founders switch.</h2>
            <p className="text-gray-400 text-sm max-w-xs">Most platforms add friction. LaunchingLaps removes it.</p>
          </div>
          <div className="rounded-3xl overflow-hidden" style={{ border: '1px solid #e0e0e0' }}>
            <div className="grid text-sm font-black" style={{ gridTemplateColumns: '1.1fr 1fr 1.1fr', background: '#060e1f' }}>
              <div className="px-6 py-4 text-white/30 uppercase tracking-widest text-[10px]">Alternative</div>
              <div className="px-6 py-4 text-white/30 uppercase tracking-widest text-[10px]" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>Their approach</div>
              <div className="px-6 py-4 text-amber-400 uppercase tracking-widest text-[10px]" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>LaunchingLaps</div>
            </div>
            {[
              { vs: 'Cold Email', them: 'Under 2% reply rate. Months of silence.', us: '340+ investors actively searching your category. First match in 48 hours.' },
              { vs: 'Traditional VC', them: 'Warm intro required. Geography-locked. Slow.', us: 'Global, borderless access. No gatekeepers. Pitch reviewed in 24 hours.' },
              { vs: 'Other Platforms', them: 'Commission on raise. Unvetted investors. Noise.', us: '0% commission. Verified investors. Audit-screened deal flow only.' },
            ].map((c, i) => (
              <div key={c.vs} className="grid" style={{ gridTemplateColumns: '1.1fr 1fr 1.1fr', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <div className="px-6 py-5 font-black text-gray-900 text-sm flex items-center" style={{ borderTop: '1px solid #ececec' }}>{c.vs}</div>
                <div className="px-6 py-5 text-sm text-gray-400 leading-relaxed flex items-center" style={{ borderTop: '1px solid #ececec', borderLeft: '1px solid #ececec' }}>{c.them}</div>
                <div className="px-6 py-5 text-sm font-semibold text-gray-900 leading-relaxed flex items-center"
                  style={{ borderTop: '1px solid #ececec', borderLeft: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.03)' }}>{c.us}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURES BENTO ── */}
      <section style={{ background: '#060e1f' }} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="text-4xl font-black text-white leading-tight">Built for the deal.<br /><span style={{ color: '#f59e0b' }}>Not the demo.</span></h2>
            <p className="text-white/30 text-sm max-w-xs sm:text-right leading-relaxed">Six tools. One platform. Every feature earns its place by closing deals faster.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Link key={f.title} to={f.to}
                className={`group rounded-3xl p-7 flex flex-col transition-all hover:scale-[1.02] ${i === 0 ? 'lg:col-span-2' : ''}`}
                style={{
                  background: i === 0 ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.04)',
                  border: i === 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                <div className="text-2xl mb-5">{f.emoji}</div>
                <h3 className="font-black text-white text-lg mb-2 leading-snug group-hover:text-amber-400 transition-colors">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed flex-1">{f.desc}</p>
                <p className="mt-5 text-xs font-black text-amber-500 group-hover:text-amber-400 transition-colors">{f.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ── */}
      <section className="relative py-20 px-6 overflow-hidden pb-24" style={{ background: '#060e1f' }}>
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[280px] rounded-full blur-3xl pointer-events-none" style={{ background: '#f59e0b', opacity: 0.05 }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] mb-4 tracking-tight">
                Your next investor is<br />
                <span style={{ color: '#f59e0b' }}>already on LaunchingLaps.</span>
              </h2>
              <p className="text-white/40 text-base max-w-lg leading-relaxed">
                Free to join. Zero commission on your raise. Audit-vetted deal flow for investors. Founders and investors close across 60+ countries.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 font-black text-base px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2 whitespace-nowrap">
                Submit Your Pitch Free →
              </Link>
              <Link to="/register" state={{ defaultRole: 'investor' }}
                className="font-black text-base px-8 py-4 rounded-full transition-all hover:scale-105 text-center whitespace-nowrap"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}>
                Investor Access
              </Link>
              <p className="text-white/20 text-[10px] text-center">No credit card · No hidden fees · Ever</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ── CAROUSEL ──────────────────────────────────────────────────────────────────
function ControlledCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % ADS.length), 5500)
  }
  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [])
  const goTo = (i) => { setCurrent(i); startTimer() }

  return (
    <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-xl" style={{ height: '440px' }}>
      {ADS.map((a, i) => (
        <div key={a.id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={a.image} alt={a.headline} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
          <div className={`absolute inset-0 bg-gradient-to-r ${a.overlay}`} />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 sm:px-12 max-w-2xl">
              <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-3 opacity-70" style={{ color: a.accentColor }}>{a.brand}</p>
              <span className={`inline-flex items-center gap-1.5 border text-[10px] font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase ${a.badgeBg}`}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: a.accentColor }} />{a.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.1] mb-4 tracking-tight drop-shadow-2xl">{a.headline}</h2>
              <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: a.accentColor }} />
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">{a.sub}</p>
              <Link to={a.ctaLink}
                className="inline-flex items-center gap-2 font-black text-sm tracking-wider px-6 py-3 rounded-full transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: a.ctaBg, color: a.ctaBg === '#fff' ? '#060e1f' : '#fff' }}>
                {a.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => goTo((current - 1 + ADS.length) % ADS.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-all text-lg">‹</button>
      <button onClick={() => goTo((current + 1) % ADS.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-all text-lg">›</button>
      <div className="absolute bottom-4 left-8 flex gap-1.5 z-10">
        {ADS.map((_, i) => <button key={i} onClick={() => goTo(i)} className="transition-all rounded-full" style={{ width: i === current ? 24 : 6, height: 6, backgroundColor: i === current ? ADS[current].accentColor : 'rgba(255,255,255,0.25)' }} />)}
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <span className="text-white/25 text-xs font-black tracking-widest">{String(current + 1).padStart(2, '0')} / {String(ADS.length).padStart(2, '0')}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
        <div key={current} className="h-full" style={{ backgroundColor: ADS[current].accentColor, animation: 'llprogress 5.5s linear' }} />
      </div>
    </div>
  )
}
