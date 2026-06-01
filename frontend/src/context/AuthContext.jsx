import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

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
    const { data } = await api.post('/auth/login', { email, password })
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
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
