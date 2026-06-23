import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'maya@ecodeliver.com': {
    id: 1, full_name: 'Maya Chen', email: 'maya@ecodeliver.com',
    role: 'entrepreneur', bio: 'Green Tech founder at EcoDeliver', is_active: true,
  },
  'sarah@greencap.vc': {
    id: 2, full_name: 'Sarah Williams', email: 'sarah@greencap.vc',
    role: 'investor', bio: 'Partner at GreenCap Ventures', is_active: true,
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ll_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('ll_token') || null)

  const login = useCallback(async (email, password) => {
    // Demo accounts work offline
    if (DEMO_USERS[email] && password === 'password123') {
      const demoUser = DEMO_USERS[email]
      const fakeToken = 'demo-token-' + demoUser.id
      localStorage.setItem('ll_token', fakeToken)
      localStorage.setItem('ll_user', JSON.stringify(demoUser))
      setToken(fakeToken)
      setUser(demoUser)
      return demoUser
    }
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('ll_token', data.access_token)
    localStorage.setItem('ll_user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }, [])

  const googleLogin = useCallback(async (credential, role = 'entrepreneur') => {
    const { data } = await api.post('/auth/google', { credential, role })
    localStorage.setItem('ll_token', data.access_token)
    localStorage.setItem('ll_user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('ll_token', data.access_token)
    localStorage.setItem('ll_user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ll_token')
    localStorage.removeItem('ll_user')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token && user)

  return (
    <AuthContext.Provider value={{ user, token, login, googleLogin, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
