import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-brand-800">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Join LaunchingLaps — it's free</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Role selector */}
            <div>
              <label className="label">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {['entrepreneur', 'investor'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role }))}
                    className={`py-3 rounded-lg border-2 text-sm font-semibold capitalize transition ${
                      form.role === role
                        ? 'border-brand-800 bg-brand-800 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-brand-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="full_name" className="label">Full name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                value={form.full_name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="input"
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="bio" className="label">
                Short bio <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell investors or entrepreneurs a bit about yourself…"
                className="input resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold justify-center w-full mt-1">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-700 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
