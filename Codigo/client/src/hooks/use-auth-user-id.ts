'use client'

import { useMemo } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/components/providers/auth-provider'

type JwtPayload = {
  sub?: string
}

export function useAuthUserId() {
  const { token } = useAuth()

  return useMemo(() => {
    if (!token) return null
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.sub || null
    } catch {
      return null
    }
  }, [token])
}
