import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

/* ─── Map ───────────────────────────────────────────────────── */
const MAP_CITIES = [
  { name: 'NewYork',   x: 72,  y: 38, delay: '0s'   },
  { name: 'London',    x: 122, y: 24, delay: '0.5s'  },
  { name: 'Dubai',     x: 158, y: 46, delay: '1s'    },
  { name: 'Mumbai',    x: 170, y: 50, delay: '1.5s'  },
  { name: 'SaoPaulo',  x: 86,  y: 80, delay: '2s'    },
  { name: 'Tokyo',     x: 218, y: 36, delay: '2.5s'  },
  { name: 'Sydney',    x: 216, y: 84, delay: '3s'    },
  { name: 'Singapore', x: 198, y: 66, delay: '4s'    },
]
const HUB = { x: 130, y: 50 }

function GlobalMap({ accent }) {
  return (
    <svg viewBox="0 0 260 108" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        {MAP_CITIES.map(c => {
          const mx = (HUB.x + c.x) / 2
          const my = Math.min(HUB.y, c.y) - 18
          return <path key={c.name} id={`mp-${c.name}`} d={`M ${HUB.x},${HUB.y} Q ${mx},${my} ${c.x},${c.y}`} />
        })}
      </defs>
      {[0,1,2,3,4,5].map(i => (
        <line key={`h${i}`} x1="0" y1={i*21} x2="260" y2={i*21} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
        <line key={`v${i}`} x1={i*22} y1="0" x2={i*22} y2="108" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}
      <polygon points="28,14 96,14 93,27 86,38 89,50 79,58 69,58 61,52 49,54 39,47 28,37" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      <polygon points="68,58 94,58 99,68 101,80 97,95 86,100 76,95 70,82 65,70" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      <polygon points="116,14 150,14 153,24 146,32 138,34 127,31 119,24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      <polygon points="120,38 154,38 160,50 162,65 157,80 150,90 136,90 122,80 118,65 118,50" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      <polygon points="148,11 232,11 240,24 232,37 222,44 212,47 202,68 194,70 186,60 176,54 168,49 158,47 148,34 142,24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      <polygon points="198,72 228,72 234,82 226,92 210,94 198,88 195,78" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4"/>
      {MAP_CITIES.map(c => {
        const mx = (HUB.x + c.x) / 2
        const my = Math.min(HUB.y, c.y) - 18
        return (
          <g key={c.name}>
            <path d={`M ${HUB.x},${HUB.y} Q ${mx},${my} ${c.x},${c.y}`}
              fill="none" stroke={accent} strokeWidth="0.6" strokeDasharray="3 4" opacity="0.2" />
            <circle r="1.6" fill={accent} opacity="0.8">
              <animateMotion dur="2.5s" repeatCount="indefinite" begin={c.delay}>
                <mpath href={`#mp-${c.name}`} />
              </animateMotion>
            </circle>
          </g>
        )
      })}
      <circle cx={HUB.x} cy={HUB.y} r="5" fill={accent} opacity="0.95"/>
      <circle cx={HUB.x} cy={HUB.y} r="5" fill={accent} opacity="0">
        <animate attributeName="r" values="5;14;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x={HUB.x} y={HUB.y+1.8} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="4.5" fontWeight="900">LL</text>
      {MAP_CITIES.map(c => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r="2" fill={accent} opacity="0.65"/>
          <circle cx={c.x} cy={c.y} r="2" fill={accent} opacity="0">
            <animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite" begin={c.delay}/>
            <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite" begin={c.delay}/>
          </circle>
        </g>
      ))}
    </svg>
  )
}

/* ─── Persona configs ────────────────────────────────────────── */
const ENTREPRENEUR = {
  /*
   * Emotional story: One person. Millions of people around them.
   * But they're the one who dares to pitch.
   * NYC Times Square — a lone figure walking forward through the crowd.
   */
  image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1600&h=900&fit=crop&q=85',
  /* Dark left-side vignette so the form card reads clean */
  overlayStyle: {
    background: 'linear-gradient(105deg, rgba(4,6,14,0.97) 0%, rgba(8,14,28,0.93) 38%, rgba(10,18,35,0.7) 65%, rgba(0,0,0,0.15) 100%)',
  },
  accent: '#f59e0b',
  badgeBg: 'rgba(245,158,11,0.15)',
  badgeBorder: 'rgba(245,158,11,0.35)',
  badgeText: '#f59e0b',
  badgePing: '#fbbf24',
  tag: 'FOR ENTREPRENEURS',
  tagline: 'LIVE NOW',
  /* Headline: the emotional hook */
  headline: 'Millions dream it.',
  headlineBold: 'You\'re doing it.',
  sub: 'One city. Eight million people. One pitch. Your future starts the moment you submit.',
  quote: '"The ones who are crazy enough to think they can change the world are the ones who do."',
  features: [
    { icon: '→', text: 'Submit your pitch in 15 minutes' },
    { icon: '→', text: '340+ investors discover you — no cold emails' },
    { icon: '→', text: 'Zero commission. You keep every dollar.' },
  ],
  stats: [
    { v: '500+', l: 'Founders Funded' },
    { v: '$12M+', l: 'Capital Raised' },
    { v: '0%', l: 'Commission' },
  ],
  switchLabel: 'Looking to invest instead?',
  switchLink: '/login?type=investor',
  switchCta: 'Investor access',
  submitLabel: 'Sign in as Founder',
  ctaTextColor: '#000',
}

const INVESTOR = {
  /*
   * Emotional story: Looking DOWN from the top of a skyscraper.
   * The city is below you. You see the whole board.
   * Power. Control. The view only a few people ever see.
   */
  image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=900&fit=crop&q=85',
  /* Overlay: rich dark from right-to-left so image breathes on right */
  overlayStyle: {
    background: 'linear-gradient(100deg, rgba(2,4,10,0.3) 0%, rgba(4,8,18,0.7) 30%, rgba(6,10,22,0.95) 68%, rgba(4,8,16,0.98) 100%)',
  },
  accent: '#d4af37',
  badgeBg: 'rgba(212,175,55,0.12)',
  badgeBorder: 'rgba(212,175,55,0.3)',
  badgeText: '#d4af37',
  badgePing: '#d4af37',
  tag: 'FOR INVESTORS',
  tagline: 'DEAL FLOW LIVE',
  headline: 'The view from',
  headlineBold: 'the top.',
  sub: 'You\'ve earned the vantage point. Now see every opportunity before the market does. 340+ vetted deals. One platform.',
  quote: '"An investor without information is an investor without advantage."',
  features: [
    { icon: '→', text: 'Audit-verified deal flow — no noise' },
    { icon: '→', text: 'Lead syndicates. Earn 20% carried interest.' },
    { icon: '→', text: 'Deploy from $5K alongside institutional co-investors' },
  ],
  stats: [
    { v: '340+', l: 'Active Investors' },
    { v: '60+', l: 'Countries' },
    { v: '20%', l: 'Carry Earned' },
  ],
  switchLabel: 'Raising capital instead?',
  switchLink: '/login?type=entrepreneur',
  switchCta: 'Founder access',
  submitLabel: 'Sign in as Investor',
  ctaTextColor: '#000',
}

/* ─── Demo accounts ──────────────────────────────────────────── */
const DEMO_ACCOUNTS = [
  { role: 'Founder',  email: 'maya@ecodeliver.com',    password: 'password123', color: '#3b82f6' },
  { role: 'Investor', email: 'sarah@greencap.vc',       password: 'password123', color: '#f59e0b' },
  { role: 'Audit',    email: 'audit@launchinglaps.com', password: 'audit123',    color: '#6b7280' },
  { role: 'Admin',    email: 'admin@launchinglaps.com', password: 'admin123',    color: '#ef4444' },
]

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const searchParams = new URLSearchParams(location.search)
  const isInvestor = searchParams.get('type') === 'investor'
  const p = isInvestor ? INVESTOR : ENTREPRENEUR

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const loggedUser = await login(form.email, form.password)
      const dest = loggedUser?.role === 'admin' ? '/admin' : loggedUser?.role === 'audit' ? '/audit' : from
      if (loggedUser?.role === 'admin' || loggedUser?.role === 'audit') {
        window.location.href = dest
      } else {
        navigate(dest, { replace: true })
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  async function loginAsDemo(account) {
    setLoading(true); setError('')
    setForm({ email: account.email, password: account.password })
    try {
      const loggedUser = await login(account.email, account.password)
      const dest = loggedUser?.role === 'admin' ? '/admin' : loggedUser?.role === 'audit' ? '/audit' : '/dashboard'
      if (loggedUser?.role === 'admin' || loggedUser?.role === 'audit') {
        window.location.href = dest
      } else {
        navigate(dest, { replace: true })
      }
    } catch {
      setError('Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* Input focus/blur handlers */
  const onFocus = (e) => {
    e.target.style.border = `1px solid ${p.accent}60`
    e.target.style.background = 'rgba(255,255,255,0.1)'
  }
  const onBlur = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.1)'
    e.target.style.background = 'rgba(255,255,255,0.07)'
  }

  return (
    <div
      className="h-[calc(100vh-64px)] flex overflow-hidden relative"
      style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: isInvestor ? 'center top' : 'center center' }}
    >
      {/* Directional gradient overlay */}
      <div className="absolute inset-0" style={p.overlayStyle} />

      {/* ── LEFT PANEL ── */}
      {!isInvestor ? (
        <div className="hidden lg:flex lg:w-[55%] relative z-10 flex-col justify-between px-12 py-8 xl:px-16">

          {/* Emotional headline block */}
          <div>
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-none tracking-tight mb-2">
              {p.headline}
            </h1>
            <h1 className="text-5xl xl:text-6xl font-black leading-none tracking-tight mb-5" style={{ color: p.accent }}>
              {p.headlineBold}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-[340px] mb-4">
              {p.sub}
            </p>
            <p className="text-white/55 text-sm italic leading-relaxed max-w-[320px] mb-6 border-l-2 pl-4" style={{ borderColor: p.accent + '60' }}>
              {p.quote}
            </p>
            <div className="flex flex-col gap-2.5">
              {p.features.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: p.accent }}>{f.icon}</span>
                  <span className="text-white/80 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {p.stats.map(s => (
              <div key={s.l} className="rounded-xl px-4 py-3 text-center"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)' }}>
                <div className="font-black text-2xl" style={{ color: p.accent }}>{s.v}</div>
                <div className="text-white/35 text-[10px] mt-0.5 uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex lg:w-[48%] relative z-10 flex-col justify-between px-12 py-8 xl:px-16">

          {/* Bottom-left anchored copy */}
          <div>
            <h1 className="text-6xl xl:text-7xl font-black text-white leading-none tracking-tight mb-2">
              {p.headline}
            </h1>
            <h1 className="text-6xl xl:text-7xl font-black leading-none tracking-tight mb-5" style={{ color: p.accent }}>
              {p.headlineBold}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed max-w-[320px] mb-4">
              {p.sub}
            </p>
            <p className="text-white/55 text-sm italic leading-relaxed max-w-[300px] mb-6 border-l-2 pl-4" style={{ borderColor: p.accent + '60' }}>
              {p.quote}
            </p>
            <div className="flex flex-col gap-2.5 mb-6">
              {p.features.map(f => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: p.accent }}>{f.icon}</span>
                  <span className="text-white/80 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {p.stats.map(s => (
                <div key={s.l} className="rounded-xl px-4 py-3 text-center"
                  style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)' }}>
                  <div className="font-black text-xl" style={{ color: p.accent }}>{s.v}</div>
                  <div className="text-white/35 text-[10px] mt-0.5 uppercase tracking-wide">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RIGHT GLASS FORM ── */}
      <div className={`w-full ${isInvestor ? 'lg:w-[52%]' : 'lg:w-[45%]'} relative z-10 flex items-center justify-center px-6 py-4`}>
        <div
          className="w-full max-w-[400px] rounded-2xl p-6"
          style={{
            background: 'rgba(6, 8, 16, 0.88)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(48px) saturate(200%)',
            WebkitBackdropFilter: 'blur(48px) saturate(200%)',
            boxShadow: `0 40px 100px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.07)`,
          }}
        >
          {/* Form header */}
          <div className="mb-4">
            <h2 className="text-xl font-black text-white tracking-tight mb-1">
              {isInvestor ? 'Access your portfolio.' : 'Continue your journey.'}
            </h2>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.32)' }}>
              New here?{' '}
              <Link to="/register" className="font-semibold transition-colors hover:opacity-80" style={{ color: p.accent }}>
                Create a free account
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <div className="flex justify-center mb-3 rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                setLoading(true); setError('')
                try { await googleLogin(credential); navigate(from, { replace: true }) }
                catch { setError('Google sign-in failed.') }
                finally { setLoading(false) }
              }}
              onError={() => setError('Google sign-in failed.')}
              shape="rectangular" size="large" width="380" text="continue_with" theme="filled_black"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>or email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
                Email
              </label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={form.email} onChange={handleChange} placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', caretColor: p.accent }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.42)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" required
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', caretColor: p.accent }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 px-6 rounded-xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{ background: p.accent, color: p.ctaTextColor, boxShadow: `0 6px 24px ${p.accent}50` }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>{p.submitLabel} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>quick demo</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.email} onClick={() => loginAsDemo(acc)} disabled={loading}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all disabled:opacity-40 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.border = `1px solid ${acc.color}50` }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                    style={{ background: acc.color + '22', border: `1px solid ${acc.color}40`, color: acc.color }}>
                    {acc.role[0]}
                  </div>
                  <span className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.32)' }}>{acc.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Persona switch + legal */}
          <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{p.switchLabel}</span>
            <Link to={p.switchLink} className="text-[11px] font-semibold hover:opacity-75" style={{ color: p.accent }}>
              {p.switchCta} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
