'use client'

import { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import Link from 'next/link'

export function UserDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-md border border-border bg-surface-2 p-1.5 pl-3 transition hover:bg-surface-elevated active:scale-95"
      >
        <span className="text-sm font-medium text-text-primary hidden sm:inline-block">
          {user.email.split('@')[0]}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
          <User className="h-4 w-4" />
        </div>
        <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-surface p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none z-50">
          <div className="px-3 py-2 border-b border-border/50 mb-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Sua Conta</p>
            <p className="text-sm font-medium text-text-primary truncate">{user.email}</p>
          </div>
          
          <Link
            href="/configuracoes"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary transition hover:bg-surface-2"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>

          <button
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger transition hover:bg-danger-soft"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
