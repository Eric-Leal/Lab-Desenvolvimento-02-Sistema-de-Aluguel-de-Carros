'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '@/lib/api'
import { useAuth } from '@/components/providers/auth-provider'

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
  endereco?: Address
  [key: string]: unknown
}

export type CurrentUserProfile = {
  id: string
  nome: string
  email: string
  profissao: string
  documento: string
  endereco: Address
}

type JwtPayload = {
  sub?: string
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
  const { token } = useAuth()
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

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await api.get<RawProfile>(`/usersService/client/${userId}`)
      const data = response.data
      const address = resolveAddress(data)

      setProfile({
        id: data.id,
        nome: data.nome || '',
        email: data.email || '',
        profissao: data.profissao || '',
        documento: data.documento || '',
        endereco: address,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuario atual'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [userId])

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
