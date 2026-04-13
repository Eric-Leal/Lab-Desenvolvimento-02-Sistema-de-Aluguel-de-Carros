'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/forms/form-field'
import { useAuth } from '@/components/providers/auth-provider'
import api from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPassword = password.trim()
    if (!normalizedEmail || !normalizedPassword) {
      setError('Informe e-mail e senha para entrar.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const response = await api.post<{ accessToken: string; email: string }>('/usersService/auth/login', {
        email: normalizedEmail,
        password: normalizedPassword,
      })

      login(response.data.email, response.data.accessToken)
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-1 items-start justify-center px-6 py-14 sm:px-8 lg:py-20">
      <div className="w-full max-w-[560px] space-y-5">
        <header className="space-y-3 text-center">
          <Image
            src="/images/logos/carflow_icon_only_light_fixed.png"
            alt="CarFlow icon"
            width={96}
            height={96}
            className="mx-auto h-24 w-24"
            priority
          />
          <h1 className="font-(--font-dm-serif) text-5xl leading-tight tracking-[-0.03em] text-text-primary sm:text-6xl">
            Bem-vindo de volta
          </h1>
          <p className="text-base text-text-secondary">Acesse sua conta no CarFlow</p>
        </header>

        <section className="space-y-6 rounded-2xl border border-border bg-surface p-6 shadow-[0px_10px_30px_rgba(16,19,30,0.04)] sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-danger-soft p-3 text-center text-sm text-danger">
                {error}
              </div>
            )}
            
            <FormField 
              label="E-mail" 
              placeholder="cliente@email.com" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField 
              label="Senha" 
              placeholder="********" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-lg bg-linear-to-br from-primary-700 to-primary-600 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            Não tem conta?{' '}
            <Link href="/cadastro" className="font-medium text-text-brand">
              Cadastre-se
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
