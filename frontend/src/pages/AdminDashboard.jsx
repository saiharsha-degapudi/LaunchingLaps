import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import api from '../api/axios'

// Default carousel ads — mirrors AdCarousel.jsx
const DEFAULT_ADS = [
  {
    id: 1,
    brand: 'LAUNCHINGLAPS CAPITAL ACCESS',
    tag: 'ENTREPRENEUR FUNDING',
    headline: 'Raise Your Round — One Syndicate, Clean Cap Table',
    sub: 'Pool capital from multiple global investors into a single legal entity. One cap table entry, faster due diligence, one wiring instruction.',
    cta: 'Submit Your Pitch',
    ctaLink: '/register',
    ctaBg: '#f59e0b',
    accentColor: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=600&fit=crop&q=80',
  },
  {
    id: 2,
    brand: 'LAUNCHINGLAPS DEAL FLOW',
    tag: 'INVESTOR INTELLIGENCE',
    headline: 'Lead a Syndicate. Earn Carried Interest.',
    sub: 'Identify great startups, form a syndicate, invite co-investors. Earn 20% carry on returns. Build your global investment track record.',
    cta: 'Access Deal Flow',
    ctaLink: '/register',
    ctaBg: '#ff6600',
    accentColor: '#ff6600',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&h=600&fit=crop&q=80',
  },
  {
    id: 3,
    brand: 'LAUNCHINGLAPS EDUCATION',
    tag: 'BUSINESS MASTERY',
    headline: 'Invest from $5K — Join a Global Syndicate',
    sub: 'Join institutional-quality syndicates from as little as $5,000. Access deals previously reserved for top-tier VCs and family offices worldwide.',
    cta: 'Start Learning Free',
    ctaLink: '/register',
    ctaBg: '#1e3a8a',
    accentColor: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&h=600&fit=crop&q=80',
  },
  {
    id: 4,
    brand: 'LAUNCHINGLAPS SUCCESS',
    tag: 'FOUNDER STORIES',
    headline: '$12M+ Raised Through LaunchingLaps Syndicates',
    sub: 'Founders from 60+ countries have closed syndicate rounds on our platform. One vehicle. One wire. One cap table entry. Total clarity.',
    cta: "Join Now — It's Free",
    ctaLink: '/register',
    ctaBg: '#fff',
    accentColor: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&h=600&fit=crop&q=80',
  },
  {
    id: 5,
    brand: 'LAUNCHINGLAPS NETWORK',
    tag: 'GLOBAL COMMUNITY',
    headline: 'The Syndicate Model is the Future of Startup Investing',
    sub: 'Join 700+ entrepreneurs and investors already using the syndicate model to invest smarter, raise faster, and build lasting relationships worldwide.',
    cta: 'Join the Network',
    ctaLink: '/register',
    ctaBg: '#10b981',
    accentColor: '#34d399',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1400&h=600&fit=crop&q=80',
  },
]

const TABS = [
  { id: 'overview', label: 'Overview', icon: '🏠' },
  { id: 'ads', label: 'Ads Manager', icon: '📢' },
  { id: 'landing', label: 'Landing Page', icon: '🌐' },
  { id: 'entrepreneurs', label: 'Entrepreneurs', icon: '🚀' },
  { id: 'investors', label: 'Investors', icon: '💼' },
  { id: 'audit', label: 'Audit', icon: '🔍' },
]

function StatCard({ label, value, icon, color = 'text-gold-400' }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">{icon}</div>
      <div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        <div className="text-gray-500 text-sm">{label}</div>
      </div>
    </div>
  )
}

// ── Ad Editor ────────────────────────────────────────────────────────────────
function AdEditor({ ad, onSave, onCancel }) {
  const [form, setForm] = useState({
    active: true,
    audience: 'all',
    placement: 'carousel',
    ...ad,
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-4">{ad.id ? `Edit Ad #${ad.id}` : 'New Ad'}</h3>

      {/* Preview */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-5 bg-black">
        <img src={form.image} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-6 text-center">
          <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: form.accentColor }}>{form.brand}</p>
          <p className="text-xl font-black leading-tight">{form.headline}</p>
          <span className="mt-2 px-4 py-1 rounded text-xs font-bold" style={{ backgroundColor: form.ctaBg, color: '#fff' }}>{form.cta}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Brand Line', key: 'brand' },
          { label: 'Tag Badge', key: 'tag' },
          { label: 'Headline', key: 'headline' },
          { label: 'Body Text', key: 'sub' },
          { label: 'CTA Button Text', key: 'cta' },
          { label: 'CTA Link', key: 'ctaLink' },
          { label: 'Image URL', key: 'image' },
        ].map(f => (
          <div key={f.key} className={f.key === 'sub' || f.key === 'image' ? 'col-span-2' : ''}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
            {f.key === 'sub' ? (
              <textarea rows={2} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
            ) : (
              <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            )}
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Accent Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.accentColor || '#ffffff'} onChange={e => set('accentColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
            <input value={form.accentColor || ''} onChange={e => set('accentColor', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">CTA Button Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={form.ctaBg || '#000000'} onChange={e => set('ctaBg', e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
            <input value={form.ctaBg || ''} onChange={e => set('ctaBg', e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none" />
          </div>
        </div>

        {/* Targeting & Placement */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Target Audience</label>
          <select value={form.audience || 'all'} onChange={e => set('audience', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none">
            <option value="all">All Users</option>
            <option value="entrepreneur">Entrepreneurs Only</option>
            <option value="investor">Investors Only</option>
            <option value="guest">Guests (Not Logged In)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Placement</label>
          <select value={form.placement || 'carousel'} onChange={e => set('placement', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none">
            <option value="carousel">Landing Carousel</option>
            <option value="sidebar">Sidebar Banner</option>
            <option value="dashboard">Dashboard Banner</option>
            <option value="pitches">Pitches List Banner</option>
          </select>
        </div>

        {/* Active toggle */}
        <div className="col-span-2 flex items-center justify-between border border-gray-100 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">Ad Status</p>
            <p className="text-xs text-gray-400">Inactive ads are hidden from users</p>
          </div>
          <button type="button" onClick={() => set('active', !form.active)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${form.active ? 'bg-green-500' : 'bg-gray-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.active ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(form)}
          className="flex-1 py-2.5 bg-brand-800 hover:bg-brand-700 text-white font-bold rounded-lg text-sm transition-all">
          Save Changes
        </button>
        <button onClick={onCancel}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-all">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ── Ads Manager Tab ──────────────────────────────────────────────────────────
function AdsManager() {
  const [ads, setAds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ll_admin_ads')) || DEFAULT_ADS }
    catch { return DEFAULT_ADS }
  })
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState(false)

  const saveAd = (updated) => {
    const isNew = !updated.id
    const newAd = isNew ? { ...updated, id: Date.now(), views: 0, clicks: 0 } : updated
    const next = isNew ? [...ads, newAd] : ads.map(a => a.id === updated.id ? updated : a)
    setAds(next)
    localStorage.setItem('ll_admin_ads', JSON.stringify(next))
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleActive = (id) => {
    const next = ads.map(a => a.id === id ? { ...a, active: !(a.active ?? true) } : a)
    setAds(next)
    localStorage.setItem('ll_admin_ads', JSON.stringify(next))
  }

  const deleteAd = (id) => {
    const next = ads.filter(a => a.id !== id)
    setAds(next)
    localStorage.setItem('ll_admin_ads', JSON.stringify(next))
  }

  const resetAds = () => {
    setAds(DEFAULT_ADS)
    localStorage.removeItem('ll_admin_ads')
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const PLACEMENT_LABELS = { carousel: 'Landing Carousel', sidebar: 'Sidebar', dashboard: 'Dashboard', pitches: 'Pitches List' }
  const AUDIENCE_LABELS = { all: 'All Users', entrepreneur: 'Entrepreneurs', investor: 'Investors', guest: 'Guests' }

  // Summary stats
  const totalViews = ads.reduce((s, a) => s + (a.views || 0), 0)
  const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0)
  const activeCount = ads.filter(a => a.active !== false).length

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-gray-900">Marketing & Ads Manager</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage banners across all platform placements</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm font-semibold">✓ Saved!</span>}
          <button onClick={() => setEditing({ brand: '', tag: '', headline: '', sub: '', cta: 'Learn More', ctaLink: '/', image: '', accentColor: '#2563eb', ctaBg: '#2563eb', audience: 'all', placement: 'carousel', active: true })}
            className="px-4 py-2 bg-brand-800 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-all">
            + New Ad
          </button>
          <button onClick={resetAds} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
            Reset to Default
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Ads', value: activeCount, color: 'text-green-600' },
          { label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-blue-600' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-gray-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {editing ? (
        <AdEditor ad={editing} onSave={saveAd} onCancel={() => setEditing(null)} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ads.map((ad, i) => (
            <div key={ad.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm flex ${ad.active === false ? 'opacity-50 border-gray-100' : 'border-gray-100'}`}>
              {/* Thumbnail */}
              <div className="relative w-48 h-28 flex-shrink-0 bg-black">
                {ad.image ? (
                  <img src={ad.image} alt="" className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded">
                  #{i + 1}
                </div>
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded ${ad.active === false ? 'bg-red-500/80 text-white' : 'bg-green-500/80 text-white'}`}>
                  {ad.active === false ? 'Off' : 'Live'}
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 p-4 flex items-center justify-between min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black tracking-widest uppercase mb-1 truncate" style={{ color: ad.accentColor }}>{ad.brand}</p>
                  <p className="text-sm font-bold text-gray-900 leading-snug truncate">{ad.headline}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ad.sub}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
                      {PLACEMENT_LABELS[ad.placement] || ad.placement || 'Carousel'}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600">
                      {AUDIENCE_LABELS[ad.audience] || ad.audience || 'All'}
                    </span>
                    <span className="text-[10px] text-gray-400">{(ad.views || 0).toLocaleString()} views · {(ad.clicks || 0).toLocaleString()} clicks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button onClick={() => toggleActive(ad.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${ad.active === false ? 'border-green-200 text-green-700 hover:bg-green-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}>
                    {ad.active === false ? 'Activate' : 'Pause'}
                  </button>
                  <button onClick={() => setEditing(ad)}
                    className="px-3 py-1.5 bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-all">
                    Edit
                  </button>
                  <button onClick={() => deleteAd(ad.id)}
                    className="px-2 py-1.5 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 text-xs rounded-lg transition-all">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Users Table ──────────────────────────────────────────────────────────────
function UsersTable({ role, icon }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/users').then(r => {
      setUsers((r.data || []).filter(u => u.role === role))
    }).catch(() => {
      setUsers([])
    }).finally(() => setLoading(false))
  }, [role])

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-xl font-black text-gray-900 capitalize">{role}s</h2>
          <p className="text-sm text-gray-500">{users.length} registered</p>
        </div>
      </div>
      {users.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-400">
          <p className="text-4xl mb-2">{icon}</p>
          <p className="font-semibold">No {role}s found</p>
          <p className="text-sm mt-1">Backend may be offline or no users registered yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Name', 'Email', 'Status', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u, i) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{u.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Audit Tab ────────────────────────────────────────────────────────────────
function AdminAuditTab() {
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/pitches/').then(r => setPitches(r.data || [])).catch(() => setPitches([])).finally(() => setLoading(false))
  }, [])

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  }

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🔍</span>
        <div>
          <h2 className="text-xl font-black text-gray-900">Audit Overview</h2>
          <p className="text-sm text-gray-500">{pitches.length} total pitches</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', count: pitches.filter(p => p.audit_status === 'pending' || !p.audit_status).length, color: 'text-yellow-500' },
          { label: 'Approved', count: pitches.filter(p => p.audit_status === 'approved').length, color: 'text-green-500' },
          { label: 'Rejected', count: pitches.filter(p => p.audit_status === 'rejected').length, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <div className={`text-3xl font-black ${s.color}`}>{s.count}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Title', 'Industry', 'Stage', 'Goal', 'Audit Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pitches.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-gray-900 max-w-[180px] truncate">{p.title}</td>
                <td className="px-4 py-3 text-gray-500">{p.industry}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 capitalize">{p.stage}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">${(p.funding_goal || 0).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[p.audit_status] || 'bg-yellow-100 text-yellow-700'}`}>
                    {p.audit_status || 'pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Landing Page Settings ────────────────────────────────────────────────────
function LandingSettings() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ll_landing_settings')) || { ticker: true, liveStrip: true, sideColumns: true } }
    catch { return { ticker: true, liveStrip: true, sideColumns: true } }
  })

  const toggle = (key) => {
    const next = { ...settings, [key]: !settings[key] }
    setSettings(next)
    localStorage.setItem('ll_landing_settings', JSON.stringify(next))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🌐</span>
        <div>
          <h2 className="text-xl font-black text-gray-900">Landing Page Settings</h2>
          <p className="text-sm text-gray-500">Control which sections appear on the public landing page</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {[
          { key: 'ticker', label: 'Sector Ticker Banner', desc: 'Scrolling industry tags at the very top of the page' },
          { key: 'sideColumns', label: 'Side Columns (Pitches + Investors)', desc: 'Left pitch list and right investor list alongside the carousel' },
          { key: 'liveStrip', label: 'Live Activity Strip', desc: 'Fixed bottom bar showing real-time platform activity' },
        ].map((item, i, arr) => (
          <div key={item.key} className={`flex items-center justify-between px-6 py-4 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key] ? 'bg-brand-700' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings[item.key] ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <strong>Note:</strong> Toggle changes are saved instantly and will reflect on the landing page on next reload.
      </div>
    </div>
  )
}

// ── Overview ─────────────────────────────────────────────────────────────────
function Overview({ pitches, users }) {
  const entrepreneurs = users.filter(u => u.role === 'entrepreneur').length
  const investors = users.filter(u => u.role === 'investor').length

  return (
    <div>
      <h2 className="text-xl font-black text-gray-900 mb-6">Platform Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pitches" value={pitches.length} icon="📋" />
        <StatCard label="Entrepreneurs" value={entrepreneurs || '—'} icon="🚀" />
        <StatCard label="Investors" value={investors || '—'} icon="💼" />
        <StatCard label="Active Ads" value="5" icon="📢" color="text-orange-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-wide">Recent Pitches</h3>
          <div className="space-y-2">
            {pitches.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">{p.title}</span>
                <span className="text-xs text-gray-400 capitalize">{p.stage}</span>
              </div>
            ))}
            {pitches.length === 0 && <p className="text-sm text-gray-400">No pitches yet</p>}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-wide">Admin Quick Access</h3>
          <div className="space-y-2">
            {[
              { label: '📢 Edit Carousel Ads', tab: 'ads' },
              { label: '🌐 Landing Page Settings', tab: 'landing' },
              { label: '🚀 View Entrepreneurs', tab: 'entrepreneurs' },
              { label: '💼 View Investors', tab: 'investors' },
              { label: '🔍 Audit Overview', tab: 'audit' },
            ].map(item => (
              <div key={item.tab} className="text-sm text-brand-700 font-semibold py-1.5 border-b border-gray-50 last:border-0 cursor-pointer hover:text-brand-900">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [pitches, setPitches] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/pitches/').then(r => setPitches(r.data || [])).catch(() => {})
    api.get('/auth/users').then(r => setUsers(r.data || [])).catch(() => {})
  }, [])

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d1b3e] flex flex-col py-6 px-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <p className="text-white font-black text-sm">Admin Panel</p>
            <p className="text-white/40 text-xs">LaunchingLaps</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all ${
                tab === t.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
              <span className="text-gold-400 text-xs font-black">
                {user.full_name?.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user.full_name}</p>
              <p className="text-white/40 text-[10px]">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-black text-gray-900">
              {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
            </h1>
            <p className="text-xs text-gray-400">LaunchingLaps Admin · Full Access</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">● Live</span>
            <a href="/" target="_blank" className="text-sm text-brand-700 font-semibold hover:underline">View Site →</a>
          </div>
        </header>

        <div className="p-8">
          {tab === 'overview' && <Overview pitches={pitches} users={users} />}
          {tab === 'ads' && <AdsManager />}
          {tab === 'landing' && <LandingSettings />}
          {tab === 'entrepreneurs' && <UsersTable role="entrepreneur" icon="🚀" />}
          {tab === 'investors' && <UsersTable role="investor" icon="💼" />}
          {tab === 'audit' && <AdminAuditTab />}
        </div>
      </div>
    </div>
  )
}
