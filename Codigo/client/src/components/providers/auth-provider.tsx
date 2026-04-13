'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

type User = {
  email: string
  role?: string
}

type JwtPayload = {
  role?: string
}

function resolveRoleFromToken(token: string): string | undefined {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.role
  } catch {
    return undefined
  }
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

  useEffect(() => {
    const savedToken = Cookies.get('carflow_token')
    const savedUser = localStorage.getItem('carflow_user')

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User
        const tokenRole = resolveRoleFromToken(savedToken)
        const mergedUser: User = {
          ...parsedUser,
          role: tokenRole ?? parsedUser.role,
        }

        setToken(savedToken)
        setUser(mergedUser)
        localStorage.setItem('carflow_user', JSON.stringify(mergedUser))
      } catch {
        Cookies.remove('carflow_token')
        localStorage.removeItem('carflow_user')
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, token: string) => {
    const userData = { email, role: resolveRoleFromToken(token) }
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
    // Forca recarregamento para limpar estados em memoria e dados cacheados.
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
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
