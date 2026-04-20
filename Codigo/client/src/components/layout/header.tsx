'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UserDropdown } from '@/components/layout/user-dropdown'

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/veiculos', label: 'Veículos' },
]

const authenticatedOnlyNavItems = [
  { href: '/pedidos', label: 'Pedidos' },
  { href: '/veiculos/gestao', label: 'Gestão' },
]

export function Header() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const { profile } = useCurrentUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const agentType = profile?.tipo?.toUpperCase()
  const isBankAgent = user?.role === 'AGENT' && agentType === 'BANCO'
  const isLocadorAgent = user?.role === 'AGENT' && (agentType === 'LOCADOR' || agentType === 'EMPRESA')
  const isAgentWithoutType = user?.role === 'AGENT' && !isBankAgent && !isLocadorAgent

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const visibleNavItems = isAuthenticated
    ? [
        ...navItems,
        ...(user?.role === 'CLIENT' ? [authenticatedOnlyNavItems[0]] : []),
        ...(isLocadorAgent || isAgentWithoutType ? [authenticatedOnlyNavItems[1]] : []),
        ...(isBankAgent ? [{ href: '/dashboard/banco', label: 'Dashboard Banco' }] : []),
        ...(isLocadorAgent ? [{ href: '/dashboard/financeiro', label: 'Dashboard Financeiro' }] : []),
      ]
    : navItems

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="ds-shell">
        <nav className="relative flex h-20 items-center justify-between gap-4 px-2 sm:px-0">
          <Link href="/" className="inline-flex items-center">
            {/* Logo para Modo Claro */}
            <Image
              src="/images/logos/carflow_horizontal_light_fixed.png"
              alt="CarFlow"
              width={200}
              height={64}
              style={{ height: 'auto' }}
              className="h-16 w-auto dark:hidden"
              priority
            />
            {/* Logo para Modo Escuro */}
            <Image
              src="/images/logos/carflow_horizontal_dark_fixed.png"
              alt="CarFlow"
              width={200}
              height={64}
              style={{ height: 'auto' }}
              className="hidden h-16 w-auto dark:block"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {visibleNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={mobileMenuRef} className="relative md:hidden">
              <button
                type="button"
                aria-label="Abrir menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary transition hover:bg-surface-elevated active:scale-95"
              >
                <Menu className="h-5 w-5" />
              </button>

              {isMobileMenuOpen && (
                <div
                  id="mobile-navigation"
                  className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-border bg-surface p-3 shadow-2xl"
                >
                  <div className="flex flex-col gap-1">
                    {visibleNavItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-2 hover:text-text-brand"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-3 border-t border-border/60 pt-3 md:hidden">
                    <AnimatedThemeToggler className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary transition hover:bg-surface-elevated" />
                  </div>

                  {!isLoading && !isAuthenticated && (
                    <div className="mt-3 grid gap-2 border-t border-border/60 pt-3">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface-2 px-4 text-sm font-medium text-text-primary transition hover:bg-surface-elevated"
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/cadastro"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-linear-to-br from-primary-700 to-primary-600 px-4 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition hover:brightness-110 active:scale-95"
                      >
                        Cadastrar
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <AnimatedThemeToggler className="hidden h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary md:inline-flex" />

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hidden h-10 items-center justify-center rounded-md border border-border bg-surface-2 px-4 text-sm font-medium text-text-primary transition hover:bg-surface md:inline-flex"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/cadastro"
                      className="hidden h-10 items-center justify-center rounded-md bg-linear-to-br from-primary-700 to-primary-600 px-5 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition hover:brightness-110 active:scale-95 md:inline-flex"
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
