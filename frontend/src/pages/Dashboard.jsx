import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState, useRef } from 'react'
import api from '../api/axios'
import DealFlowPipeline from '../components/DealFlowPipeline'
import SPVCard from '../components/SPVCard'
import PitchProgressTracker from '../components/PitchProgressTracker'
import FounderActionChecklist from '../components/FounderActionChecklist'
import { useDragScroll } from '../utils/design'
import {
  Briefcase, Eye, Envelope, Bank, PresentationChart, Users,
  CurrencyDollar, ArrowRight, TrendUp, Lightning,
} from '@phosphor-icons/react'

// ── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      const end = parseFloat(String(target).replace(/[^0-9.]/g, ''))
      const step = end / (duration / 16)
      let cur = 0
      const t = setInterval(() => {
        cur = Math.min(cur + step, end)
        setVal(cur)
        if (cur >= end) clearInterval(t)
      }, 16)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return { ref, val }
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, suffix = '', sub, iconColor = '#f59e0b' }) {
  const { ref, val } = useCountUp(value)
  const isDecimal = String(value).includes('.')
  const display = isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()
  return (
    <div ref={ref}
      className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${iconColor}15` }}>
        <Icon size={17} style={{ color: iconColor }} weight="fill" />
      </div>
      <div className="min-w-0">
        <p className="text-[22px] font-black leading-none text-gray-900">
          {display}{suffix}
        </p>
        <p className="text-xs font-medium text-gray-400 mt-1 leading-tight">{label}</p>
        {sub && <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────
function PageHeader({ greeting, sub, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[22px] font-black text-gray-900 leading-tight">{greeting}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{sub}</p>
      </div>
      {action}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, linkTo, linkLabel = 'View all' }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[13px] font-black uppercase tracking-wide text-gray-400">{title}</h2>
      {linkTo && (
        <Link to={linkTo}
          className="flex items-center gap-1 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors">
          {linkLabel} <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}

// ── Pitch mini-card (horizontal scroll) ──────────────────────────────────────
function PitchMiniCard({ pitch }) {
  const goal = pitch.funding_goal >= 1_000_000
    ? `$${(pitch.funding_goal / 1_000_000).toFixed(1)}M`
    : `$${(pitch.funding_goal / 1_000).toFixed(0)}K`
  const STAGE = { idea: '#8b5cf6', seed: '#10b981', growth: '#3b82f6' }
  const color = STAGE[pitch.stage] || '#f59e0b'

  return (
    <Link to={`/pitches/${pitch.id}`}
      className="flex-shrink-0 w-64 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow block">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}>
          {pitch.stage}
        </span>
        <span className="text-[10px] text-gray-300 font-medium">{pitch.industry}</span>
      </div>
      <h3 className="text-sm font-black text-gray-900 leading-snug mb-2 line-clamp-2">{pitch.title}</h3>
      <p className="text-lg font-black text-gray-900">{goal}</p>
      <p className="text-[10px] text-gray-300 mb-3">funding goal</p>
      <p className="text-xs text-gray-400 line-clamp-2">{pitch.description}</p>
    </Link>
  )
}

// ── Investor mini-card ────────────────────────────────────────────────────────
function InvestorMiniCard({ inv }) {
  const max = inv.investment_max >= 1_000_000
    ? `$${(inv.investment_max / 1_000_000).toFixed(1)}M`
    : `$${(inv.investment_max / 1_000).toFixed(0)}K`
  const min = `$${(inv.investment_min / 1_000).toFixed(0)}K`
  const sectors = inv.industry_focus?.split(',').slice(0, 2).map(s => s.trim()) || []

  return (
    <div className="flex-shrink-0 w-56 bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
          style={{ background: '#f59e0b', color: '#000' }}>
          {inv.user?.full_name?.[0] || 'I'}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-black text-gray-900 truncate">{inv.user?.full_name}</p>
          <p className="text-[10px] text-gray-400 truncate">{inv.firm_name}</p>
        </div>
      </div>
      <p className="text-xs font-black text-gray-900">{min} – {max}</p>
      <p className="text-[10px] text-gray-400 mb-2">investment range</p>
      <div className="flex flex-wrap gap-1">
        {sectors.map(s => (
          <span key={s} className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">{s}</span>
        ))}
      </div>
    </div>
  )
}

// ── Activity feed ─────────────────────────────────────────────────────────────
const ACTIVITY = [
  { text: 'EcoDeliver matched Impact Horizon Fund — $800K term sheet', time: '2m ago', color: '#10b981' },
  { text: 'MedBridge approved by audit — now live to 340+ investors',  time: '18m ago', color: '#f59e0b' },
  { text: 'PayLite LATAM Syndicate hit 43% of $750K target',           time: '41m ago', color: '#6366f1' },
  { text: 'TechBridge Capital joined as verified investor',             time: '1h ago',  color: '#3b82f6' },
  { text: 'AgriSense selected for LL Fast Track',                       time: '2h ago',  color: '#f59e0b' },
  { text: '14 new pitches approved across 6 industries today',          time: '3h ago',  color: '#10b981' },
]

function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Live Activity</p>
      </div>
      <div className="divide-y divide-gray-50">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
              <p className="text-[10px] text-gray-300 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Entrepreneur dashboard ────────────────────────────────────────────────────
function EntrepreneurDashboard({ user, myPitch, myPitchIds, spvs }) {
  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const dragPitches = useDragScroll()
  const [pitches, setPitches] = useState([])
  const [companyProfile, setCompanyProfile] = useState(null)
  useEffect(() => { api.get('/pitches/').then(r => setPitches(r.data)).catch(() => {}) }, [])
  useEffect(() => { api.get('/company-profile/').then(r => setCompanyProfile(r.data)).catch(() => {}) }, [])

  const relatedPitches = myPitch?.industry
    ? pitches.filter(p => p.industry === myPitch.industry && p.id !== myPitch.id)
    : []

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        greeting={`Welcome back, ${firstName}`}
        sub="Here's what's happening with your pitches today."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase}    label="Active Pitches"    value={myPitchIds.length || 1}  iconColor="#f59e0b" />
        <StatCard icon={Eye}          label="Investor Views"    value={48}                       iconColor="#6366f1" />
        <StatCard icon={Envelope}     label="Messages"          value={3}                        iconColor="#10b981" />
        <StatCard icon={Bank}         label="Syndicates on You" value={myPitchIds.length > 0 ? spvs.filter(s => myPitchIds.includes(s.pitch_id)).length : 2} iconColor="#3b82f6" />
      </div>

      {/* Pitch Progress + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <PitchProgressTracker
          status={(() => {
            const s = myPitch?.audit_status
            if (!s) return null
            const map = { open: 'draft', in_progress: 'audit_in_progress', approved_with_warnings: 'approved_warnings', proceed: 'approved' }
            return map[s] || s
          })()}
          pitchTitle={myPitch?.title || myPitch?.company_name || null}
        />
        <FounderActionChecklist pitch={myPitch} documents={[]} companyProfile={companyProfile} />
      </div>

      {/* Deal Flow Pipeline */}
      <div className="mb-8">
        <SectionHeader title="Deal Flow Pipeline" />
        <DealFlowPipeline />
      </div>

      {/* Syndicates */}
      <div className="mb-8">
        <SectionHeader title="Syndicate Activity" linkTo="/spvs" />
        {(() => {
          const mySpvs = spvs.filter(s => myPitchIds.includes(s.pitch_id)).slice(0, 3)
          return (
            <div className="space-y-6">
              {mySpvs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mySpvs.map(s => <SPVCard key={s.id} spv={s} />)}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <Bank size={32} className="mx-auto mb-3 text-gray-200" />
                  <p className="font-black text-gray-700 mb-1">No syndicates yet</p>
                  <p className="text-sm text-gray-400 mb-4">Investors can pool capital into a syndicate to fund your pitch.</p>
                  <Link to="/submit-pitch"
                    className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-lg"
                    style={{ background: '#060e1f', color: '#fff' }}>
                    Submit a Pitch <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* Same-industry pitches for co-syndication discovery */}
              {myPitch?.industry && (
                <div className="bg-white border border-zinc-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">Co-Syndication Opportunities</p>
                      <p className="text-sm font-semibold text-zinc-900">Other {myPitch.industry} startups</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Founders in your space — explore forming a joint syndicate</p>
                    </div>
                    <a href="/pitches" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex-shrink-0 mt-1">Browse all →</a>
                  </div>
                  {relatedPitches.length > 0 ? (
                    <div
                      ref={dragPitches.ref}
                      onMouseDown={dragPitches.onMouseDown}
                      onMouseMove={dragPitches.onMouseMove}
                      onMouseUp={dragPitches.onMouseUp}
                      className="flex gap-3 overflow-x-auto pb-1 select-none"
                      style={{ scrollbarWidth: 'none' }}>
                      {relatedPitches.map(p => <PitchMiniCard key={p.id} pitch={p} />)}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 py-2">No other <span className="font-semibold text-zinc-600">{myPitch.industry}</span> pitches yet — you're the first in this space.</p>
                  )}
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Activity + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <SectionHeader title="Platform Activity" />
          <ActivityFeed />
        </div>
        <div>
          <SectionHeader title="Resources" />
          <div className="flex flex-col gap-2">
            {[
              { title: 'How to pitch to US investors',      tag: 'Course',  to: '/education' },
              { title: 'Financial modeling for startups',   tag: 'Course',  to: '/education' },
              { title: 'Govt startup funding schemes',      tag: 'Schemes', to: '/government-schemes' },
              { title: 'Community — ask anything',          tag: 'Forum',   to: '/community' },
            ].map(r => (
              <Link key={r.title} to={r.to}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:shadow-sm transition-shadow">
                <Lightning size={14} className="text-amber-500 flex-shrink-0" weight="fill" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{r.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{r.tag}</p>
                </div>
                <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: '#060e1f' }}>
        <div>
          <p className="font-black text-white text-base">Ready to find your investor?</p>
          <p className="text-white/40 text-sm mt-0.5">340+ verified global investors. Zero commission on your raise.</p>
        </div>
        <Link to="/investors"
          className="flex-shrink-0 inline-flex items-center gap-2 font-black text-sm px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{ background: '#f59e0b', color: '#000' }}>
          Browse Investors <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// ── Investor dashboard ────────────────────────────────────────────────────────
function InvestorDashboard({ user, spvs }) {
  const firstName = user?.full_name?.split(' ')[0] || 'there'
  const dragPitches = useDragScroll()
  const dragInv = useDragScroll()
  const [pitches, setPitches] = useState([])
  const [investors, setInvestors] = useState([])
  useEffect(() => {
    api.get('/pitches/').then(r => setPitches(r.data)).catch(() => {})
    api.get('/investors/').then(r => setInvestors(r.data)).catch(() => {})
  }, [])

  const deployed = spvs.reduce((s, v) => s + (Number(v.current_amount) || 0), 0)
  const deployedStr = deployed >= 1_000_000
    ? `${(deployed / 1_000_000).toFixed(1)}M`
    : `${(deployed / 1_000).toFixed(0)}K`

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        greeting={`Welcome back, ${firstName}`}
        sub="Fresh deal flow is waiting. Discover your next investment."
        action={
          <Link to="/pitches"
            className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-lg transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: '#f59e0b', color: '#000' }}>
            View Deal Flow <ArrowRight size={14} />
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={PresentationChart} label="Live Pitches"         value={pitches.length}                                                iconColor="#f59e0b" />
        <StatCard icon={Bank}              label="Syndicates Forming"   value={spvs.filter(s => s.status === 'forming').length || spvs.length} iconColor="#6366f1" />
        <StatCard icon={CurrencyDollar}    label="Deployed ($K)"        value={deployed > 0 ? Number(deployedStr.replace(/[KM]/,'')) : 675}   iconColor="#10b981" suffix={deployed >= 1_000_000 ? 'M' : 'K'} />
        <StatCard icon={Users}             label="Platform Investors"   value={investors.length || 4}                                          iconColor="#3b82f6" />
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <SectionHeader title="Deal Flow Pipeline" />
        <DealFlowPipeline />
      </div>

      {/* Live pitches */}
      {pitches.length > 0 && (
        <div className="mb-8">
          <SectionHeader title="Live Pitches — Audit Vetted" linkTo="/pitches" />
          <div
            ref={dragPitches.ref}
            onMouseDown={dragPitches.onMouseDown}
            onMouseMove={dragPitches.onMouseMove}
            onMouseUp={dragPitches.onMouseUp}
            className="flex gap-3 overflow-x-auto pb-2 select-none"
            style={{ scrollbarWidth: 'none' }}>
            {pitches.map(p => <PitchMiniCard key={p.id} pitch={p} />)}
          </div>
        </div>
      )}

      {/* Syndicates */}
      <div className="mb-8">
        <SectionHeader title="Syndicates Forming Now" linkTo="/spvs" />
        {spvs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Bank size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="font-black text-gray-700 mb-1">No syndicates forming yet</p>
            <p className="text-gray-400 text-sm mb-4">Be the first to lead a syndicate and earn 20% carried interest.</p>
            <Link to="/lead-spv"
              className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-lg"
              style={{ background: '#060e1f', color: '#fff' }}>
              + Create Syndicate
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {spvs.slice(0, 4).map(s => <SPVCard key={s.id} spv={s} />)}
          </div>
        )}
        <div className="mt-3">
          <Link to="/lead-spv"
            className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: '#060e1f', color: '#fff' }}>
            + Create Syndicate
          </Link>
        </div>
      </div>

      {/* Investors scroll */}
      {investors.length > 0 && (
        <div className="mb-8">
          <SectionHeader title="Active Investors on Platform" linkTo="/investors" linkLabel="Connect" />
          <div
            ref={dragInv.ref}
            onMouseDown={dragInv.onMouseDown}
            onMouseMove={dragInv.onMouseMove}
            onMouseUp={dragInv.onMouseUp}
            className="flex gap-3 overflow-x-auto pb-2 select-none"
            style={{ scrollbarWidth: 'none' }}>
            {investors.map(inv => <InvestorMiniCard key={inv.id} inv={inv} />)}
          </div>
        </div>
      )}

      {/* Activity + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">
          <SectionHeader title="Platform Activity" />
          <ActivityFeed />
        </div>
        <div>
          <SectionHeader title="Market Insights" />
          <div className="flex flex-col gap-2">
            {[
              { title: 'AI sector: 2x revenue vs others',          sub: '24 pitches open',    color: '#6366f1' },
              { title: 'Top deal flow: India, Nigeria, Brazil',     sub: 'Global deal flow',   color: '#10b981' },
              { title: 'Reply within 48h = 3x faster close',       sub: 'Platform stat',      color: '#f59e0b' },
              { title: '50-point DD framework — new guide',         sub: 'Education resource', color: '#3b82f6' },
            ].map(ins => (
              <Link key={ins.title} to="/education"
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 hover:shadow-sm transition-shadow">
                <TrendUp size={14} style={{ color: ins.color }} className="flex-shrink-0" weight="fill" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{ins.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{ins.sub}</p>
                </div>
                <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ background: '#060e1f' }}>
        <div>
          <p className="font-black text-white text-base">Don't miss this week's top pitches</p>
          <p className="text-white/40 text-sm mt-0.5">
            {pitches.length} startups — audit-reviewed and quality-checked.
          </p>
        </div>
        <Link to="/pitches"
          className="flex-shrink-0 inline-flex items-center gap-2 font-black text-sm px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
          style={{ background: '#f59e0b', color: '#000' }}>
          View Deal Flow <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()
  const isE = user?.role === 'entrepreneur'

  const [spvs, setSpvs]             = useState([])
  const [myPitchIds, setMyPitchIds] = useState([])
  const [myPitch, setMyPitch]       = useState(null)

  useEffect(() => {
    if (!isE) return
    api.get('/pitches/')
      .then(r => {
        const mine = r.data.filter(p => p.owner_id === user?.id)
        setMyPitchIds(mine.map(p => p.id))
        if (mine.length > 0) setMyPitch(mine[0])
      })
      .catch(() => {})
  }, [isE, user?.id])

  useEffect(() => {
    const url = isE ? '/spvs/' : '/spvs/?status=forming'
    api.get(url).then(r => setSpvs(r.data)).catch(() => {})
  }, [isE])

  if (isE) return <EntrepreneurDashboard user={user} myPitch={myPitch} myPitchIds={myPitchIds} spvs={spvs} />
  return <InvestorDashboard user={user} spvs={spvs} />
}
