import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { useScrollReveal } from '../utils/design'

const TABS = [
  { key: 'profile',      label: 'Profile' },
  { key: 'security',     label: 'Password & Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'preferences',  label: 'Preferences' },
]

function SaveBar({ saving, saved, onSave }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 mt-6">
      <button onClick={onSave} disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      {saved && (
        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Saved
        </span>
      )}
    </div>
  )
}

function Field({ label, sub, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="sm:w-48 flex-shrink-0">
        <p className="text-sm font-medium text-zinc-800">{label}</p>
        {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-zinc-900' : 'bg-zinc-200'
      }`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-4.5' : 'translate-x-0.5'
      }`} />
    </button>
  )
}

function ProfileTab({ user }) {
  const [form, setForm] = useState({
    full_name:  user?.full_name  || '',
    email:      user?.email      || '',
    bio:        user?.bio        || '',
    linkedin:   user?.linkedin   || '',
    phone:      user?.phone      || '',
    location:   user?.location   || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true); setSaved(false); setError('')
    try {
      await api.patch('/users/me/', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to save.')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4 pb-5 border-b border-zinc-100">
        <div className="w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
          {form.full_name?.[0] || user?.email?.[0] || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">{form.full_name || 'Your Name'}</p>
          <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <Field label="Full Name">
        <input className="input" value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" />
      </Field>
      <Field label="Email" sub="Used for login and notifications">
        <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
      </Field>
      <Field label="Phone">
        <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
      </Field>
      <Field label="Location">
        <input className="input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, Country" />
      </Field>
      <Field label="LinkedIn URL">
        <input className="input" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/you" />
      </Field>
      <Field label="Bio" sub="Shown on your founder/investor profile">
        <textarea className="input resize-none" rows={4} value={form.bio} onChange={e => set('bio', e.target.value)}
          placeholder="Tell investors or founders a bit about yourself..." />
      </Field>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  )
}

function SecurityTab() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function save() {
    if (form.new_password !== form.confirm_password) { setError('New passwords do not match.'); return }
    if (form.new_password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSaving(true); setSaved(false); setError('')
    try {
      await api.post('/users/change-password/', {
        current_password: form.current_password,
        new_password:     form.new_password,
      })
      setSaved(true)
      setForm({ current_password: '', new_password: '', confirm_password: '' })
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to change password.')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <Field label="Current Password">
        <input className="input" type="password" value={form.current_password}
          onChange={e => set('current_password', e.target.value)} placeholder="Enter your current password" />
      </Field>
      <Field label="New Password" sub="Minimum 8 characters">
        <input className="input" type="password" value={form.new_password}
          onChange={e => set('new_password', e.target.value)} placeholder="New password" />
      </Field>
      <Field label="Confirm New Password">
        <input className="input" type="password" value={form.confirm_password}
          onChange={e => set('confirm_password', e.target.value)} placeholder="Repeat new password" />
      </Field>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <SaveBar saving={saving} saved={saved} onSave={save} />

      {/* Danger zone */}
      <div className="mt-8 pt-6 border-t border-zinc-100">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Danger Zone</p>
        <div className="border border-red-200 rounded-xl p-4">
          <p className="text-sm font-medium text-zinc-900 mb-1">Delete Account</p>
          <p className="text-xs text-zinc-500 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
          <button className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    email_investor_interest: true,
    email_audit_update:      true,
    email_pitch_status:      true,
    email_new_message:       true,
    email_weekly_digest:     false,
    email_platform_news:     false,
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function toggle(k) { setPrefs(p => ({ ...p, [k]: !p[k] })) }

  async function save() {
    setSaving(true)
    try {
      await api.patch('/users/notification-prefs/', prefs)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { }
    finally { setSaving(false) }
  }

  const ITEMS = [
    { key: 'email_investor_interest', label: 'Investor expressed interest',    sub: 'When an investor expresses interest in your pitch' },
    { key: 'email_audit_update',      label: 'Audit report ready',             sub: 'When the audit team publishes or updates your audit report' },
    { key: 'email_pitch_status',      label: 'Pitch status changes',           sub: 'Approval, rejection, live status, and document requests' },
    { key: 'email_new_message',       label: 'New messages',                   sub: 'Direct messages from investors or the platform team' },
    { key: 'email_weekly_digest',     label: 'Weekly activity digest',         sub: 'A weekly summary of your pitch and investor activity' },
    { key: 'email_platform_news',     label: 'Platform news & announcements',  sub: 'New features, events, and platform updates' },
  ]

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-400">All notifications are sent to your account email address.</p>
      <div className="space-y-4">
        {ITEMS.map(item => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-800">{item.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{item.sub}</p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  )
}

function PreferencesTab({ user }) {
  const [prefs, setPrefs] = useState({
    currency:   'INR',
    timezone:   'Asia/Kolkata',
    language:   'en',
    theme:      'light',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function set(k, v) { setPrefs(p => ({ ...p, [k]: v })) }

  async function save() {
    setSaving(true)
    try {
      await api.patch('/users/preferences/', prefs)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <Field label="Currency" sub="Used in financial displays">
        <select className="input" value={prefs.currency} onChange={e => set('currency', e.target.value)}>
          <option value="INR">INR — Indian Rupee</option>
          <option value="USD">USD — US Dollar</option>
          <option value="EUR">EUR — Euro</option>
          <option value="GBP">GBP — British Pound</option>
          <option value="SGD">SGD — Singapore Dollar</option>
        </select>
      </Field>
      <Field label="Timezone">
        <select className="input" value={prefs.timezone} onChange={e => set('timezone', e.target.value)}>
          <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
          <option value="Asia/Dubai">Asia/Dubai (GST)</option>
        </select>
      </Field>
      <Field label="Language">
        <select className="input" value={prefs.language} onChange={e => set('language', e.target.value)}>
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
        </select>
      </Field>

      {user?.role === 'investor' && (
        <div className="pt-4 border-t border-zinc-100">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">Investment Preferences</p>
          <div className="space-y-5">
            <Field label="Preferred Sectors" sub="For deal recommendations">
              <input className="input" placeholder="e.g. Fintech, SaaS, Healthcare" />
            </Field>
            <Field label="Typical Check Size">
              <select className="input">
                <option>₹10L – ₹50L</option>
                <option>₹50L – ₹1Cr</option>
                <option>₹1Cr – ₹5Cr</option>
                <option>₹5Cr+</option>
              </select>
            </Field>
            <Field label="Stage Preference">
              <select className="input">
                <option>Idea / Pre-seed</option>
                <option>Seed</option>
                <option>Growth / Series A</option>
                <option>All stages</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      <SaveBar saving={saving} saved={saved} onSave={save} />
    </div>
  )
}

export default function Settings() {
  useScrollReveal()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Account</p>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your account, security, and platform preferences.</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <div className="w-44 flex-shrink-0">
            <nav className="flex flex-col gap-1 sticky top-6">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === t.key
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-6">
            <h2 className="text-base font-semibold text-zinc-900 mb-6">
              {TABS.find(t => t.key === activeTab)?.label}
            </h2>

            {activeTab === 'profile'       && <ProfileTab user={user} />}
            {activeTab === 'security'      && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'preferences'   && <PreferencesTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}
