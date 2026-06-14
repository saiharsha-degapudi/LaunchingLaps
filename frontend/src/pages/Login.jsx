import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const DEMO_ACCOUNTS = [
    {
      role: 'Entrepreneur',
      name: 'Maya Chen',
      email: 'maya@ecodeliver.com',
      password: 'password123',
      color: 'bg-brand-800 hover:bg-brand-700',
      icon: '🚀',
      desc: 'EcoDeliver · Green Tech Founder',
    },
    {
      role: 'Investor',
      name: 'Sarah Williams',
      email: 'sarah@greencap.vc',
      password: 'password123',
      color: 'bg-gold-500 hover:bg-gold-600',
      icon: '💼',
      desc: 'GreenCap Ventures · Partner',
    },
  ]

  async function loginAsDemo(account) {
    setLoading(true)
    setError('')
    setForm({ email: account.email, password: account.password })
    try {
      await login(account.email, account.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError('Demo login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Demo Quick Login */}
        <div className="mb-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => loginAsDemo(acc)}
                disabled={loading}
                className={`${acc.color} text-white rounded-xl p-4 text-left transition-colors disabled:opacity-60`}
              >
                <div className="text-2xl mb-1">{acc.icon}</div>
                <div className="font-bold text-sm">{acc.role}</div>
                <div className="text-xs font-semibold opacity-90">{acc.name}</div>
                <div className="text-xs opacity-70 mt-0.5">{acc.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Card */}
        <div className="card shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-brand-800">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your LaunchingLaps account</p>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center mb-5">
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                setLoading(true)
                setError('')
                try {
                  await googleLogin(credential)
                  navigate(from, { replace: true })
                } catch {
                  setError('Google sign-in failed. Please try again.')
                } finally {
                  setLoading(false)
                }
              }}
              onError={() => setError('Google sign-in failed. Please try again.')}
              shape="rectangular"
              size="large"
              width="360"
              text="continue_with"
            />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary justify-center w-full mt-1">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-700 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
