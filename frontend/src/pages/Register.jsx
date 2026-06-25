import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const defaultRole = location.state?.defaultRole || 'entrepreneur'

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: defaultRole,
    bio: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      if (!payload.bio) delete payload.bio
      await register(payload)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const ROLES = [
    { value: 'entrepreneur', label: 'Entrepreneur' },
    { value: 'investor',     label: 'Investor'     },
    { value: 'audit',        label: 'Auditor'      },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] bg-zinc-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px]">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6">

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm border border-red-200 bg-red-50 text-red-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Role selector — shown above Google button so role is sent with Google sign-up */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">I am a</label>
            <div className="flex gap-2">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: r.value }))}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                    form.role === r.value
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google Sign-Up */}
          <div className="flex justify-center mb-4 rounded-lg overflow-hidden border border-zinc-200">
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                setLoading(true)
                setError('')
                try {
                  await googleLogin(credential, form.role)
                  navigate('/dashboard', { replace: true })
                } catch {
                  setError('Google sign-up failed. Please try again.')
                } finally {
                  setLoading(false)
                }
              }}
              onError={() => setError('Google sign-up failed. Please try again.')}
              shape="rectangular"
              size="large"
              width="356"
              text="continue_with"
              theme="outline"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-xs text-zinc-400">or sign up with email</span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="full_name" className="block text-xs font-medium text-zinc-500 mb-1.5">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-500 mb-1.5">
                Email address
              </label>
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
              <label htmlFor="password" className="block text-xs font-medium text-zinc-500 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-xs font-medium text-zinc-500 mb-1.5">
                Short bio <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell investors or entrepreneurs a bit about yourself…"
                className="w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white resize-none"
              />
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-5">
            By creating an account you agree to our{' '}
            <span className="text-zinc-600">Terms of Service</span> and{' '}
            <span className="text-zinc-600">Privacy Policy</span>.
          </p>
        </div>

      </div>
    </div>
  )
}
