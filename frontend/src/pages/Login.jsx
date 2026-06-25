import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

/* ─── Demo accounts ──────────────────────────────────────────── */
const DEMO_ACCOUNTS = [
  { role: 'Founder',  email: 'maya@ecodeliver.com',    password: 'password123' },
  { role: 'Investor', email: 'sarah@greencap.vc',       password: 'password123' },
  { role: 'Audit',    email: 'audit@launchinglaps.com', password: 'audit123'    },
  { role: 'Admin',    email: 'admin@launchinglaps.com', password: 'admin123'    },
]

/* ─── Eye icon ───────────────────────────────────────────────── */
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

/* ─── Left panel feature list ────────────────────────────────── */
const ENTREPRENEUR_FEATURES = [
  'Submit your pitch in 15 minutes — free forever',
  '340+ verified investors discover you, no cold emails',
  'Audit-reviewed within 24 hours, first match in 48',
  'Zero commission. You keep every dollar you raise.',
]

const INVESTOR_FEATURES = [
  'Audit-verified deal flow — zero noise, only quality',
  'Filter by industry, stage, geography, and check size',
  'Lead syndicates and earn 20% carried interest',
  'Deploy from $5K alongside institutional co-investors',
]

/* ─── Main ───────────────────────────────────────────────────── */
export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const searchParams = new URLSearchParams(location.search)
  const isInvestor = searchParams.get('type') === 'investor'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeType, setActiveType] = useState(isInvestor ? 'investor' : 'entrepreneur')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
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
    setLoading(true)
    setError('')
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

  const features = activeType === 'investor' ? INVESTOR_FEATURES : ENTREPRENEUR_FEATURES

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-zinc-900 flex-col justify-between px-10 py-10 xl:px-14 flex-shrink-0">

        {/* Logo + tagline */}
        <div>
          <div className="mb-10">
            <span className="text-white text-lg font-semibold tracking-tight">LaunchingLaps</span>
            <p className="text-zinc-500 text-sm mt-1">The global startup-investor platform</p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-2 leading-snug">
              {activeType === 'investor'
                ? 'Audit-vetted deal flow. No noise.'
                : 'Your pitch. Global investors. 48 hours.'}
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {activeType === 'investor'
                ? 'Every startup reviewed before you see it. Deploy capital with confidence across 60+ countries.'
                : 'Submit once, get discovered by 340+ verified investors — no cold emails, no gatekeepers.'}
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-3.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-sm text-zinc-400 leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(activeType === 'investor' ? [
              { v: '340+', l: 'Active Investors' },
              { v: '60+',  l: 'Countries' },
              { v: '20%',  l: 'Carry Earned' },
            ] : [
              { v: '500+', l: 'Founders Funded' },
              { v: '$48M+', l: 'Capital Raised' },
              { v: '0%',   l: 'Commission' },
            ]).map(s => (
              <div key={s.l} className="rounded-lg border border-zinc-800 px-3 py-3 text-center">
                <div className="text-white font-semibold text-lg leading-none">{s.v}</div>
                <div className="text-zinc-600 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <p className="text-zinc-700 text-xs">
            &copy; {new Date().getFullYear()} LaunchingLaps. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-[380px]">

          {/* Type switcher pill */}
          <div className="flex justify-center mb-8">
            <div className="bg-zinc-100 rounded-lg p-1 inline-flex gap-1">
              <button
                onClick={() => setActiveType('entrepreneur')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeType === 'entrepreneur' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Entrepreneur
              </button>
              <button
                onClick={() => setActiveType('investor')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeType === 'investor' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Investor
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-500">
              New here?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Create a free account
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm border border-red-200 bg-red-50 text-red-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          {/* Google OAuth */}
          <div className="flex justify-center mb-5 rounded-lg overflow-hidden border border-zinc-200">
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                setLoading(true)
                setError('')
                try {
                  await googleLogin(credential)
                  navigate(from, { replace: true })
                } catch {
                  setError('Google sign-in failed.')
                } finally {
                  setLoading(false)
                }
              }}
              onError={() => setError('Google sign-in failed.')}
              shape="rectangular"
              size="large"
              width="380"
              text="continue_with"
              theme="outline"
            />
          </div>

          {/* Demo logins */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-xs text-zinc-400">Quick demo</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => loginAsDemo(acc)}
                  disabled={loading}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors disabled:opacity-40 text-center"
                >
                  <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-xs font-semibold text-zinc-600">
                    {acc.role[0]}
                  </div>
                  <span className="text-xs text-zinc-500">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Switch persona */}
          <div className="text-center">
            {activeType === 'entrepreneur' ? (
              <p className="text-xs text-zinc-400">
                Looking to invest?{' '}
                <Link to="/login?type=investor" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                  Investor access
                </Link>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Raising capital?{' '}
                <Link to="/login?type=entrepreneur" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                  Founder access
                </Link>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
