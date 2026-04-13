'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '@/lib/api'
import { useAuth } from '@/components/providers/auth-provider'

type UserRole = 'CLIENT' | 'AGENT'

type Address = {
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

type RawProfile = {
  id: string
  nome?: string
  email?: string
  profissao?: string
  documento?: string
  rendimentoTotal?: number
  endereco?: Address
  [key: string]: unknown
}

export type CurrentUserProfile = {
  id: string
  nome: string
  email: string
  profissao: string
  documento: string
  rendimentoTotal?: number
  endereco: Address
}

type JwtPayload = {
  sub?: string
  role?: string
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
}

function resolveAddress(data: RawProfile): Address {
  if (data.endereco && typeof data.endereco === 'object') {
    return data.endereco
  }

  for (const [key, value] of Object.entries(data)) {
    const normalized = normalizeKey(key)
    if ((normalized === 'endereco' || normalized.includes('ender')) && value && typeof value === 'object') {
      return value as Address
    }
  }

  return {}
}

export function useCurrentUser() {
  const { token, user } = useAuth()
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = useMemo(() => {
    if (!token) return null
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.sub || null
    } catch {
      return null
    }
  }, [token])

  const userRole = useMemo<UserRole | null>(() => {
    const roleFromUser = user?.role?.toUpperCase()
    if (roleFromUser === 'CLIENT' || roleFromUser === 'AGENT') return roleFromUser

    if (!token) return null
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const roleFromToken = decoded.role?.toUpperCase()
      if (roleFromToken === 'CLIENT' || roleFromToken === 'AGENT') return roleFromToken
    } catch {
      return null
    }

    return null
  }, [token, user?.role])

  const endpointCandidates = useMemo(() => {
    if (!userId) return [] as string[]

    const preferred = userRole === 'AGENT'
      ? `/usersService/agent/${userId}`
      : `/usersService/client/${userId}`

    const fallback = userRole === 'AGENT'
      ? `/usersService/client/${userId}`
      : `/usersService/agent/${userId}`

    return userRole ? [preferred, fallback] : [preferred, fallback]
  }, [userId, userRole])

  const refresh = useCallback(async () => {
    if (!userId || endpointCandidates.length === 0) {
      setProfile(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      let data: RawProfile | null = null
      let lastError: Error | null = null

      for (const endpoint of endpointCandidates) {
        try {
          const response = await api.get<RawProfile>(endpoint)
          data = response.data
          break
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Erro ao carregar usuario atual')
        }
      }

      if (!data) {
        throw lastError ?? new Error('Erro ao carregar usuario atual')
      }

      const address = resolveAddress(data)

      setProfile({
        id: data.id,
        nome: data.nome || '',
        email: data.email || '',
        profissao: data.profissao || '',
        documento: data.documento || '',
        rendimentoTotal: typeof data.rendimentoTotal === 'number' ? data.rendimentoTotal : undefined,
        endereco: address,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuario atual'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [endpointCandidates, userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    userId,
    profile,
    loading,
    error,
    refresh,
  }
}
