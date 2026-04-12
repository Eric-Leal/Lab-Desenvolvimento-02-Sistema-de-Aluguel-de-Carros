'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

const navItems = [
  { href: '/', label: 'Início' },
  { href: '#veiculos', label: 'Veículos' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
      <div className="ds-shell">
        <nav className="flex h-20 items-center justify-between gap-4 px-2 sm:px-0">
          <Link href="/" className="inline-flex items-center">
            {/* Logo para Modo Claro */}
            <Image
              src="/images/logos/carflow_horizontal_light_fixed.png"
              alt="CarFlow"
              width={200}
              height={64}
              className="h-16 w-auto dark:hidden"
              priority
            />
            {/* Logo para Modo Escuro */}
            <Image
              src="/images/logos/carflow_horizontal_dark_fixed.png"
              alt="CarFlow"
              width={200}
              height={64}
              className="hidden h-16 w-auto dark:block"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
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
            <button
              type="button"
              aria-label="Abrir menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <AnimatedThemeToggler className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-text-secondary" />

            <Link
              href="/login"
              className="hidden h-10 items-center justify-center rounded-md border border-border bg-surface-2 px-4 text-sm font-medium text-text-primary transition hover:bg-surface md:inline-flex"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex h-10 items-center justify-center rounded-md bg-linear-to-br from-primary-700 to-primary-600 px-5 text-sm font-medium text-white shadow-lg shadow-primary-500/20 transition hover:brightness-110 active:scale-95"
            >
              Cadastrar
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}