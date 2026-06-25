import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import api from '../api/axios'

// ── DATA ─────────────────────────────────────────────────────────────────────
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

// ── Counter hook ──────────────────────────────────────────────────────────────
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

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconPitch() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function IconAudit() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconFund() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  )
}

function IconSyndicate() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )
}

function IconCommunity() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  )
}

function IconEducation() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  )
}

function IconMessage() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
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
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-zinc-50 border-b border-zinc-100 py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-500 mb-8">
            The global startup-investor platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-900 tracking-tight mb-5 max-w-3xl mx-auto leading-[1.1]">
            Where great startups meet global capital
          </h1>
          <p className="text-base md:text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Submit your pitch once. Get in front of 340+ verified investors within 48 hours. No cold emails. No gatekeepers. Zero commission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Start as Entrepreneur
            </Link>
            <Link
              to="/register"
              state={{ defaultRole: 'investor' }}
              className="border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Explore as Investor
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-100">
            {[
              { value: '2400', suffix: '+', label: 'Startups' },
              { value: '48',   suffix: 'M+', label: 'USD Funded' },
              { value: '340',  suffix: '+', label: 'Investors' },
              { value: '60',   suffix: '+', label: 'Countries' },
            ].map(s => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight leading-none">
                  <Counter target={s.value} />{s.suffix}
                </p>
                <p className="text-xs text-zinc-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">How it works</h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">From pitch to funded in three steps. Simple process, serious results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-100 rounded-xl overflow-hidden">
            {[
              {
                num: '01',
                icon: <IconPitch />,
                title: 'Pitch',
                desc: 'Create your free profile and submit your pitch deck. Our audit team reviews every submission within 24 hours to ensure quality.',
              },
              {
                num: '02',
                icon: <IconAudit />,
                title: 'Audit',
                desc: 'Every pitch is screened and verified by our expert team before going live. Investors only see quality, vetted deal flow.',
              },
              {
                num: '03',
                icon: <IconFund />,
                title: 'Fund',
                desc: 'Get matched with 340+ active investors who fit your thesis. Close via structured syndicates — one check, clean cap table.',
              },
            ].map((step) => (
              <div key={step.num} className="bg-white px-8 py-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium text-zinc-400 tabular-nums">{step.num}</span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">Everything you need to close</h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">Six tools, one platform. Every feature earns its place by closing deals faster.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                to: '/spvs',
                icon: <IconSyndicate />,
                title: 'Investment Syndicates',
                desc: '5–50 investors pooled into one SPV. One cap table entry. One wire. Faster close for everyone.',
              },
              {
                to: '/pitches',
                icon: <IconPitch />,
                title: 'Audit-Vetted Pitches',
                desc: 'Every startup reviewed before it goes live. Investors get quality. Founders get credibility.',
              },
              {
                to: '/lead-spv',
                icon: <IconFund />,
                title: 'Lead & Earn Carry',
                desc: 'Lead a syndicate, curate the deal, earn 20% carried interest on returns. No minimum AUM.',
              },
              {
                to: '/community',
                icon: <IconCommunity />,
                title: 'Founder Community',
                desc: 'Ask questions, share wins, and learn from 500+ founders who have closed deals on the platform.',
              },
              {
                to: '/education',
                icon: <IconEducation />,
                title: 'Investor-Ready Courses',
                desc: 'Cap tables, valuations, term sheets, pitch structure — built by investors, free to access.',
              },
              {
                to: '/messages',
                icon: <IconMessage />,
                title: 'Secure Deal Messaging',
                desc: 'Private conversations between founders and investors. No email chains. No data leaks.',
              },
            ].map(f => (
              <Link key={f.title} to={f.to} className="group flex flex-col gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:border-zinc-300 transition-colors">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS TABS ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white border-t border-zinc-100" id="about">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">From zero to funded in 4 steps</h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">Whether you're raising or investing — designed to get you to a deal, fast.</p>
          </div>
          <div className="flex justify-center mb-10">
            <div className="bg-zinc-100 rounded-lg p-1 inline-flex gap-1">
              <button
                onClick={() => setActiveTab('entrepreneur')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'entrepreneur' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                I'm a Founder
              </button>
              <button
                onClick={() => setActiveTab('investor')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'investor' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                I'm an Investor
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 rounded-xl overflow-hidden">
            {(activeTab === 'entrepreneur' ? [
              { step: '01', time: '5 min',       title: 'Create Your Free Profile',   desc: 'Tell us about your startup — industry, stage, traction, vision. No credit card. No fees. Ever.' },
              { step: '02', time: '15 min',      title: 'Submit Your Pitch',          desc: 'Upload your deck, funding goal, and overview. Our audit team reviews within 24 hours.' },
              { step: '03', time: '48 hrs',      title: 'Investors Find You',         desc: '340+ active investors browse daily. Get notified the moment someone expresses interest.' },
              { step: '04', time: 'Your timeline', title: 'Close on Your Terms',       desc: 'Connect, negotiate, and close through our syndicate structure — one check, clean cap table.' },
            ] : [
              { step: '01', time: '5 min',  title: 'Join as Verified Investor',  desc: 'Set your thesis: industries, stages, check size. See only deals that match your strategy.' },
              { step: '02', time: 'Daily',  title: 'Browse Audit-Vetted Deals',  desc: 'Every pitch reviewed before it reaches you. No noise. Only quality deal flow.' },
              { step: '03', time: 'Yours',  title: 'Lead or Co-Invest',          desc: 'Express interest, connect with founders, or lead a syndicate and earn 20% carried interest.' },
              { step: '04', time: 'Ongoing', title: 'Build a Global Portfolio',  desc: 'Track deals, communicate with founders, build a diversified portfolio across 60+ countries.' },
            ]).map(item => (
              <div key={item.step} className="bg-white px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-medium text-zinc-400 tabular-nums">{item.step}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-500">{item.time}</span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/register"
              className="bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              {activeTab === 'entrepreneur' ? 'Submit Your Pitch — Free' : 'Access Deal Flow Now'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">Real results</h2>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">Founders who couldn't get meetings. Investors drowning in bad deal flow. Here's what changed.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Priya Sharma',
                role: 'Founder, MediReach',
                outcome: '$350K Raised',
                quote: 'I spent 6 months sending cold emails with zero traction. On LaunchingLaps, I had 3 investor conversations in my first week. Closed a $350K round 6 weeks later.',
              },
              {
                name: 'James Okafor',
                role: 'Angel Investor, New York',
                outcome: '2 Portfolio Companies',
                quote: 'The audit team does the vetting I used to spend hours doing myself. Two investments matching my thesis within 30 days. Deal flow quality here is elite.',
              },
              {
                name: 'Carlos Rivera',
                role: 'Founder, GreenLogix',
                outcome: '$250K Seed Round',
                quote: 'The education courses alone transformed how I pitch. Learning how US investors think gave me the framework to close our $250K seed.',
              },
            ].map(t => (
              <div key={t.name} className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">{t.outcome}</span>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-zinc-100">
                  <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA SECTION ─────────────────────────────────────────── */}
      <section className="bg-zinc-900 py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4 max-w-2xl mx-auto">
            Your next investor is already on LaunchingLaps
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed">
            Free to join. Zero commission on your raise. Audit-vetted deal flow for investors. The only platform where founders and investors close across 60+ countries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Submit Your Pitch — Free
            </Link>
            <Link
              to="/register"
              state={{ defaultRole: 'investor' }}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Investor Access
            </Link>
          </div>
          <p className="text-xs text-zinc-600 mt-8">No credit card · No hidden fees · No commission on your raise · Ever</p>
        </div>
      </section>

    </div>
  )
}
