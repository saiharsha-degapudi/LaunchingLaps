import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
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
    headline: 'Stop Missing the Next Unicorn. It\'s Right Here.',
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
    sub: 'EcoDeliver closed $1.2M. SwiftRoute got 3 term sheets in a week. MedAI matched Impact Horizon Fund. You\'re next.',
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
  { name: 'LogiNest', sub: 'Cold-Chain Logistics', stage: 'Seed', goal: '$1.2M', desc: 'Temperature-controlled last-mile for pharma & FMCG. SOC 2 certified.' },
]

const DEMO_INVESTORS = [
  { name: 'Sarah Williams', firm: 'GreenCap Ventures', range: '$100K–$1M', focus: 'Climate Tech · 12 yrs · 34 portfolio cos.' },
  { name: 'Ravi Mehta', firm: 'Blume Ventures', range: '$250K–$5M', focus: 'SaaS · Deep Tech · 9 yrs · Series A/B' },
  { name: 'Priya Kapoor', firm: 'Sequoia Surge', range: '$500K–$10M', focus: 'Consumer · FinTech · 15 yrs experience' },
  { name: 'James Okafor', firm: 'Y Combinator', range: '$125K–$500K', focus: 'Early Stage · Global Markets · 180+ bets' },
  { name: 'Elena Vasquez', firm: 'Tiger Global', range: '$2M–$50M', focus: 'Growth · B2B SaaS · HealthTech' },
  { name: 'Arjun Nair', firm: 'Accel India', range: '$1M–$20M', focus: 'EdTech · AgriTech · Series A/B specialist' },
  { name: 'Mei Lin', firm: 'a16z', range: '$5M–$100M', focus: 'AI/ML · Infrastructure · Web3 · Growth' },
]

// ── Hooks & Shared Components ─────────────────────────────────────────────────
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
    ? pitches.map(p => ({
        name: p.title, stage: p.stage,
        goal: p.funding_goal >= 1_000_000 ? `$${(p.funding_goal / 1_000_000).toFixed(1)}M` : `$${(p.funding_goal / 1_000).toFixed(0)}K`,
        desc: p.description,
      }))
    : DEMO_ENTREPRENEURS

  const invItems = investors.length > 0
    ? investors.map(inv => ({
        name: inv.user?.full_name || 'Investor', firm: inv.firm_name || '',
        range: inv.investment_min && inv.investment_max
          ? `$${(inv.investment_min / 1_000).toFixed(0)}K–$${inv.investment_max >= 1_000_000 ? `${(inv.investment_max / 1_000_000).toFixed(1)}M` : `${(inv.investment_max / 1_000).toFixed(0)}K`}`
          : '$100K–$1M',
        focus: inv.bio || 'Verified global investor.',
      }))
    : DEMO_INVESTORS

  return (
    <div className="flex flex-col gap-2" style={{ height: '440px' }}>
      <ScrollPanel title="🚀 Live Pitches" color="text-amber-700"
        headerBg="bg-gradient-to-br from-[#fffbf0] to-[#fff8e1]"
        borderColor="border-amber-200" dotColor="bg-amber-500" items={entItems}>
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
      <ScrollPanel title="💼 Active Investors" color="text-blue-700"
        headerBg="bg-gradient-to-br from-[#f0f6ff] to-[#e8f2ff]"
        borderColor="border-blue-200" dotColor="bg-blue-500" items={invItems}>
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
      <ScrollPanel title="🌍 Global Startup News" color="text-gray-600"
        headerBg="bg-gray-50" borderColor="border-gray-200" dotColor="bg-red-500" items={GLOBAL_NEWS}>
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
          <p key={idx} className="text-sm text-white/70 truncate" style={{ animation: 'fadeSlideUp 0.4s ease' }}>
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
      <style>{`@keyframes fadeSlideUp { from { opacity:0;transform:translateY(6px) } to { opacity:1;transform:translateY(0) } }`}</style>
    </div>
  )
}

// ── Atlas-style section components ────────────────────────────────────────────

// Reusable "Atlas section" pattern: label → headline → 3 benefits → cta → visual
function AtlasSection({ label, headline, sub, benefits, cta, ctaLink, ctaSecondary, ctaSecondaryLink, dark = false, image, imageAlt, imageLeft = false, children }) {
  const bg = dark ? 'bg-[#060e1f] text-white' : 'bg-white text-gray-900'
  const subColor = dark ? 'text-white/50' : 'text-gray-500'
  const labelColor = dark ? 'text-amber-400' : 'text-amber-600'
  const benefitTitleColor = dark ? 'text-white' : 'text-gray-900'
  const benefitDescColor = dark ? 'text-white/50' : 'text-gray-500'
  const dividerColor = dark ? 'border-white/10' : 'border-gray-100'

  return (
    <section className={`${bg} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col ${image ? (imageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row') : ''} gap-16 items-center`}>

          {/* Text block */}
          <div className={`flex-1 ${image ? 'max-w-xl' : 'max-w-3xl mx-auto text-center'}`}>
            <p className={`text-xs font-black uppercase tracking-[0.2em] ${labelColor} mb-4`}>{label}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-4">{headline}</h2>
            <p className={`text-lg leading-relaxed ${subColor} mb-10 ${!image && 'max-w-2xl mx-auto'}`}>{sub}</p>

            {/* 3-benefit blocks — the Atlas pattern */}
            <div className={`grid ${image ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'} gap-0 mb-10 border-t ${dividerColor}`}>
              {benefits.map((b, i) => (
                <div key={i} className={`py-6 ${image ? '' : 'sm:px-6 sm:border-l'} ${i === 0 ? 'sm:pl-0 sm:border-l-0' : ''} border-b ${dividerColor}`}>
                  <p className={`text-2xl mb-2`}>{b.icon}</p>
                  <p className={`font-black text-sm mb-1 ${benefitTitleColor}`}>{b.title}</p>
                  <p className={`text-sm leading-relaxed ${benefitDescColor}`}>{b.desc}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {cta && (
                <Link to={ctaLink}
                  className={`inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-full transition-all hover:scale-105 ${dark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-[#060e1f] text-white hover:bg-[#0d1b3e]'}`}>
                  {cta} →
                </Link>
              )}
              {ctaSecondary && (
                <Link to={ctaSecondaryLink}
                  className={`inline-flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-full border transition-all hover:scale-105 ${dark ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'}`}>
                  {ctaSecondary}
                </Link>
              )}
            </div>
          </div>

          {/* Visual block */}
          {image && (
            <div className="flex-1 max-w-lg w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <img src={image} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
                {dark && <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />}
              </div>
            </div>
          )}

          {/* Slot for custom visuals */}
          {children && <div className="flex-1">{children}</div>}
        </div>
      </div>
    </section>
  )
}

// ── Main Landing ──────────────────────────────────────────────────────────────
export default function Landing() {
  const [activeTab, setActiveTab] = useState('entrepreneur')
  const [pitches, setPitches] = useState([])
  const [investors, setInvestors] = useState([])

  useEffect(() => {
    api.get('/pitches/').then(r => setPitches(r.data)).catch(() => {})
    api.get('/investors/').then(r => setInvestors(r.data)).catch(() => {})
  }, [])

  return (
    <>

      {/* ── SECONDARY NAV — clean, minimal ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-hide">
          {SEC_NAV.map(item => (
            <Link key={item.label} to={item.href}
              className="flex-shrink-0 px-5 py-3.5 text-sm font-semibold text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-900 transition-all whitespace-nowrap">
              {item.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2 px-2 flex-shrink-0">
            <Link to="/register"
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-full transition whitespace-nowrap">
              Submit Pitch
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }}
              className="bg-[#060e1f] hover:bg-[#0d1b3e] text-white text-xs font-black px-4 py-2 rounded-full transition whitespace-nowrap">
              Investor Access
            </Link>
          </div>
        </div>
      </div>

      {/* ── CAROUSEL + RIGHT PANEL ── */}
      <div className="bg-[#f5f5f3] py-4 px-4">
        <div className="max-w-screen-xl mx-auto flex gap-4">
          <div className="flex-1 min-w-0">
            <ControlledCarousel />
          </div>
          <div className="hidden lg:block w-[220px] flex-shrink-0">
            <RightInfoPanel pitches={pitches} investors={investors} />
          </div>
        </div>
      </div>

      {/* ── STATS BAR — atlas-style large number anchors ── */}
      <div className="bg-white border-t border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex divide-x divide-gray-100">
            {[
              { value: '500', suffix: '+', label: 'Funded Founders', sub: 'From 60+ countries' },
              { value: '340', suffix: '+', label: 'Verified Investors', sub: 'Actively deploying capital' },
              { value: '12', suffix: 'M+', label: 'USD Deployed', sub: 'Across all syndicates' },
              { value: '0', suffix: '%', label: 'Commission', sub: 'Keep every dollar you raise' },
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

      {/* ── LIVE STRIP ── */}
      <LiveStrip />

      {/* ── HERO — Atlas-style: minimal, centered, punchy ── */}
      <section className="relative bg-[#060e1f] text-white py-16 px-4 overflow-hidden">
        {/* Subtle grain texture effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500 opacity-[0.04] blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Atlas-style: tiny label, big headline, short sub, one CTA */}
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400 mb-6">
            The Global Startup-Investor Platform
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-7">
            Where great startups<br />
            <span className="text-amber-400">meet global capital.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-4 leading-relaxed">
            Cold emails don't work. Warm intros take months. LaunchingLaps puts your pitch in front of 340+ verified investors — in 48 hours.
          </p>
          <p className="text-white/25 text-sm mb-10">
            Priya raised $350K in 6 weeks · EcoDeliver closed $1.2M · Carlos closed $250K seed
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to="/register"
              className="bg-white text-gray-900 hover:bg-gray-100 font-black text-base px-9 py-4 rounded-full transition-all shadow-2xl hover:scale-105 inline-flex items-center gap-2">
              Submit Your Pitch Free
              <span className="text-gray-400 text-sm font-normal">→ 15 min</span>
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }}
              className="border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-black text-base px-9 py-4 rounded-full transition-all hover:scale-105">
              Investor Access →
            </Link>
          </div>
          <p className="text-white/20 text-xs">No credit card · No hidden fees · No commission on your raise · Ever</p>
        </div>
      </section>

      {/* ── SECTOR TICKER ── */}
      <ScrollingBanner items={SECTORS} bgColor="bg-[#060e1f]" textColor="text-white/40" speed={30} />

      {/* ── SECTION 1: PITCHES (light bg, image right) ── */}
      <AtlasSection
        label="LaunchingLaps Pitches"
        headline="Impossible to miss. Impossible to ignore."
        sub="Your pitch, in front of 340+ verified investors. Audit-reviewed within 24 hours. First investor match in 48. No cold emails required."
        benefits={[
          { icon: '🔒', title: 'Audit-Reviewed', desc: 'Every pitch is screened by our expert audit team before going live. Investors only see quality.' },
          { icon: '⚡', title: 'First Match in 48 Hours', desc: 'Structured matching gets your pitch to the right investors — by category, stage, and thesis.' },
          { icon: '🔔', title: 'Instant Notifications', desc: 'Know the moment an investor views, saves, or expresses interest in your pitch.' },
        ]}
        cta="See Live Pitches"
        ctaLink="/pitches"
        ctaSecondary="Submit Your Pitch"
        ctaSecondaryLink="/register"
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80"
        imageAlt="Startup pitch platform"
      />

      {/* ── SECTION 2: SYNDICATES (dark bg, image left) ── */}
      <AtlasSection
        dark
        label="LaunchingLaps Syndicates"
        headline="One check. Clean cap table. Faster close."
        sub="Pool capital from 5 to 50 investors into a single SPV. Founders get one entry on their cap table — not 20. Lead investors earn 20% carried interest."
        benefits={[
          { icon: '🏛️', title: 'Single Cap Table Entry', desc: 'No matter how many investors join, you get one entity on your cap table. Clean, simple, investor-friendly.' },
          { icon: '💸', title: 'Lead & Earn 20% Carry', desc: 'Experienced investors lead syndicates, curate deals, and earn carry on returns. No minimum AUM required.' },
          { icon: '⚙️', title: 'Fully Structured SPVs', desc: 'Legal entity setup, KYC, wiring — all handled. Close deals without the legal overhead.' },
        ]}
        cta="Browse Syndicates"
        ctaLink="/spvs"
        ctaSecondary="Create a Syndicate"
        ctaSecondaryLink="/lead-spv"
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80"
        imageAlt="Investment syndicate structure"
        imageLeft
      />

      {/* ── SECTION 3: INVESTORS (light bg, image right) ── */}
      <AtlasSection
        label="LaunchingLaps Investors"
        headline="The deal flow you've been missing."
        sub="340+ active investors, 60+ countries, audit-vetted pitches. No noise. No cold inbound. Just quality deal flow filtered to your exact thesis."
        benefits={[
          { icon: '✅', title: 'Audit-Vetted Only', desc: 'Every startup is reviewed before you see it. Your time goes to real deals, not raw submissions.' },
          { icon: '🎯', title: 'Filter by Your Thesis', desc: 'Industry, stage, geography, check size — see only what matches exactly how you invest.' },
          { icon: '📊', title: 'Track Your Pipeline', desc: 'Manage interest, follow-ups, and live conversations across your full pipeline in one place.' },
        ]}
        cta="Access Deal Flow"
        ctaLink="/investors"
        image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80"
        imageAlt="Investor dashboard"
      />

      {/* ── SECTION 4: EDUCATION (dark, no image — centered 3-col) ── */}
      <AtlasSection
        dark
        label="LaunchingLaps Education"
        headline="Learn how US investors actually think."
        sub="Most founders pitch to US investors the wrong way. Our courses were built by investors — covering cap tables, valuations, term sheets, and what gets a yes."
        benefits={[
          { icon: '🎓', title: 'Built by Investors', desc: 'Not theory. Real frameworks from active investors who have deployed capital across 60+ countries.' },
          { icon: '📋', title: 'Term Sheet Mastery', desc: 'Understand every line before you sign. Dilution, liquidation preferences, pro-rata rights — decoded.' },
          { icon: '🚀', title: 'Pitch Clinic', desc: 'Submit your deck for structured review. Get feedback that changes your conversion rate — not just your deck.' },
        ]}
        cta="Start Learning Free"
        ctaLink="/education"
      />

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#f5f5f3] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 mb-4">Real Results</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
              They were stuck.<br />Then they found LaunchingLaps.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Founders who couldn't get meetings. Investors drowning in bad deal flow. Here's what changed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Priya Sharma', role: 'Founder, MediReach', avatar: '👩‍💼', outcome: '$350K Raised', stars: 5,
                quote: 'I spent 6 months sending cold emails with zero traction. On LaunchingLaps, I had 3 investor conversations in my first week. Closed a $350K round 6 weeks later.',
              },
              {
                name: 'James Okafor', role: 'Angel Investor, New York', avatar: '👨‍💰', outcome: '2 Portfolio Companies', stars: 5,
                quote: 'The audit team does the vetting I used to spend hours doing myself. Two investments matching my thesis within 30 days. Deal flow quality here is elite.',
              },
              {
                name: 'Carlos Rivera', role: 'Founder, GreenLogix', avatar: '🧑‍🚀', outcome: '$250K Seed Round', stars: 5,
                quote: 'The education courses alone transformed how I pitch. Learning how US investors think gave me the framework to close our $250K seed. Changed everything.',
              },
            ].map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">{t.outcome}</div>
                <div className="flex gap-0.5 mt-2 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#060e1f] to-amber-500 flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-12 px-4" id="about">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 mb-4">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">From zero to funded<br />in 4 steps.</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Whether you're raising or investing — designed to get you to a deal, fast.</p>
          </div>
          <div className="flex justify-center mb-10">
            <div className="bg-[#f5f5f3] rounded-full p-1 inline-flex gap-1">
              <button onClick={() => setActiveTab('entrepreneur')}
                className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${activeTab === 'entrepreneur' ? 'bg-[#060e1f] text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
                I'm a Founder
              </button>
              <button onClick={() => setActiveTab('investor')}
                className={`px-6 py-2.5 rounded-full font-black text-sm transition-all ${activeTab === 'investor' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}>
                I'm an Investor
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {([
              activeTab === 'entrepreneur'
                ? [
                    { step: '01', icon: '⚡', time: '5 min', title: 'Create Your Free Profile', desc: 'Tell us about your startup — industry, stage, traction, vision. No credit card. No fees. Ever.' },
                    { step: '02', icon: '📋', time: '15 min', title: 'Submit Your Pitch', desc: 'Upload your deck, funding goal, and overview. Our audit team reviews within 24 hours.' },
                    { step: '03', icon: '🔔', time: '48 hrs', title: 'Investors Find You', desc: '340+ active investors browse daily. Get notified the moment someone expresses interest.' },
                    { step: '04', icon: '🤝', time: 'Your timeline', title: 'Close on Your Terms', desc: 'Connect, negotiate, and close through our syndicate structure — one check, clean cap table.' },
                  ]
                : [
                    { step: '01', icon: '✅', time: '5 min', title: 'Join as Verified Investor', desc: 'Set your thesis: industries, stages, check size. See only deals that match your strategy.' },
                    { step: '02', icon: '🔍', time: 'Daily', title: 'Browse Audit-Vetted Deals', desc: 'Every pitch reviewed before it reaches you. No noise. Only quality deal flow.' },
                    { step: '03', icon: '💡', time: 'Your call', title: 'Lead or Co-Invest', desc: 'Express interest, connect with founders, or lead a syndicate and earn 20% carried interest.' },
                    { step: '04', icon: '📈', time: 'Ongoing', title: 'Build a Global Portfolio', desc: 'Track deals, communicate with founders, build a diversified portfolio across 60+ countries.' },
                  ]
            ][0]).map((item, idx) => (
              <div key={item.step} className="bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${activeTab === 'entrepreneur' ? 'bg-[#060e1f] text-white' : 'bg-amber-100 text-amber-700'}`}>{item.time}</span>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeTab === 'entrepreneur' ? 'text-amber-500' : 'text-blue-500'}`}>Step {item.step}</p>
                <h3 className="font-black text-gray-900 text-base mb-2 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/register"
              className={`inline-flex items-center gap-2 font-black px-8 py-3.5 rounded-full transition-all shadow-lg hover:scale-105 ${activeTab === 'entrepreneur' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-[#060e1f] hover:bg-[#0d1b3e] text-white'}`}>
              {activeTab === 'entrepreneur' ? 'Submit Your Pitch — Free' : 'Access Deal Flow Now'} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VS ALTERNATIVES ── */}
      <div className="bg-[#f5f5f3] border-y border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">Why Founders Switch to LaunchingLaps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { vs: 'Cold Email Outreach', them: 'Under 2% reply rate. Months of silence.', us: '340+ investors actively searching your category. First match in 48 hours.' },
              { vs: 'Traditional VC Networks', them: 'Warm intro required. Geography-locked. Slow.', us: 'Global, borderless access. No gatekeepers. Pitch reviewed in 24 hours.' },
              { vs: 'Other Platforms', them: 'Commission on raise. Unvetted investors. Noise.', us: '0% commission. Verified investor pool. Audit-screened deal flow only.' },
            ].map(c => (
              <div key={c.vs} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{c.vs}</p>
                <div className="flex gap-2 mb-3">
                  <span className="text-red-400 text-xs font-black mt-0.5 flex-shrink-0">✕</span>
                  <p className="text-gray-400 text-xs leading-relaxed">{c.them}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500 text-xs font-black mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-gray-800 text-xs font-semibold leading-relaxed">{c.us}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PLATFORM FEATURES — atlas-style icon grid ── */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 mb-4">Platform Features</p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">Built for the deal.<br />Not the demo.</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Six tools. One platform. Every feature earns its place by closing deals faster.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {[
              { to: '/spvs',      emoji: '🏦', title: 'Investment Syndicates',  desc: '5–50 investors pooled into one SPV. One cap table entry. One wire. Faster close for everyone.', cta: 'Browse Syndicates' },
              { to: '/lead-spv',  emoji: '🎯', title: 'Lead & Earn Carry',      desc: 'Lead a syndicate, curate the deal, earn 20% carried interest on returns. No minimum AUM.',        cta: 'Create a Syndicate' },
              { to: '/pitches',   emoji: '✅', title: 'Audit-Vetted Pitches',   desc: 'Every startup reviewed before it goes live. Investors get quality. Founders get credibility.',      cta: 'View Live Pitches' },
              { to: '/community', emoji: '💬', title: 'Founder Community',       desc: 'Ask questions, share wins, learn from 500+ founders who\'ve closed deals on the platform.',         cta: 'Join Community' },
              { to: '/education', emoji: '🎓', title: 'Investor-Ready Courses', desc: 'Cap tables, valuations, term sheets, pitch structure. Built by investors. Free to access.',          cta: 'Start Learning' },
              { to: '/messages',  emoji: '🔐', title: 'Secure Deal Messaging',  desc: 'Private conversations between founders and investors. No email chains. No data leaks.',             cta: 'Open Messages' },
            ].map(f => (
              <Link key={f.title} to={f.to} className="group bg-white p-6 hover:bg-[#060e1f] transition-all duration-300 flex flex-col">
                <div className="text-3xl mb-4">{f.emoji}</div>
                <h3 className="font-black text-gray-900 group-hover:text-white text-base mb-2 transition-colors">{f.title}</h3>
                <p className="text-gray-500 group-hover:text-white/50 text-sm leading-relaxed flex-1 transition-colors">{f.desc}</p>
                <p className="mt-4 text-xs font-black text-amber-500 group-hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                  {f.cta} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — Atlas membership section style ── */}
      <section className="relative bg-[#060e1f] py-14 px-4 overflow-hidden pb-12">
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-amber-500 opacity-[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400 mb-6">Begin Your Adventure</p>
          <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Your next investor is<br />
            <span className="text-amber-400">already on LaunchingLaps.</span>
          </h2>
          <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Free to join. Zero commission on your raise. Audit-vetted deal flow for investors.
            The only platform where founders and investors close across 60+ countries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register"
              className="bg-white text-gray-900 hover:bg-gray-100 font-black text-lg px-10 py-4 rounded-full transition-all shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2">
              Submit Your Pitch — Free →
            </Link>
            <Link to="/register" state={{ defaultRole: 'investor' }}
              className="border border-white/20 hover:border-white/50 text-white/60 hover:text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:scale-105">
              Investor Access
            </Link>
          </div>
          <p className="text-white/20 text-xs">No credit card · No hidden fees · No commission on your raise · Ever</p>
        </div>
      </section>
    </>
  )
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function ControlledCarousel() {
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

  const goTo = (i) => { setCurrent(i); startTimer() }

  return (
    <div className="relative w-full overflow-hidden bg-black rounded-xl shadow-xl" style={{ height: '440px' }}>
      {ADS.map((a, i) => (
        <div key={a.id} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => goTo((current - 1 + ADS.length) % ADS.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-all text-lg">‹</button>
      <button onClick={() => goTo((current + 1) % ADS.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-all text-lg">›</button>

      <div className="absolute bottom-4 left-8 flex gap-1.5 z-10">
        {ADS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="transition-all rounded-full"
            style={{ width: i === current ? 24 : 6, height: 6, backgroundColor: i === current ? ADS[current].accentColor : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <span className="text-white/25 text-xs font-black tracking-widest">{String(current + 1).padStart(2, '0')} / {String(ADS.length).padStart(2, '0')}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
        <div key={current} className="h-full" style={{ backgroundColor: ADS[current].accentColor, animation: 'llprogress 5.5s linear' }} />
      </div>
      <style>{`@keyframes llprogress { from { width:0% } to { width:100% } }`}</style>
    </div>
  )
}
