'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, token: string) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = Cookies.get('carflow_token')
    const savedUser = localStorage.getItem('carflow_user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, token: string) => {
    const userData = { email }
    setUser(userData)
    setToken(token)
    
    // Configura cookie e localStorage
    Cookies.set('carflow_token', token, { expires: 7 }) // 7 dias
    localStorage.setItem('carflow_user', JSON.stringify(userData))
    localStorage.setItem('token', token) // Para o axios/api instance
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove('carflow_token')
    localStorage.removeItem('carflow_user')
    localStorage.removeItem('token')
    // Força um recarregamento total para limpar cache do navegador e estados globais
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
