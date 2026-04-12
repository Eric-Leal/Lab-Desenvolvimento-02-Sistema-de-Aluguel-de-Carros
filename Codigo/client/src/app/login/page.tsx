import Image from 'next/image'
import Link from 'next/link'
import { FormField } from '@/components/forms/form-field'

export default function LoginPage() {
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
          <FormField label="E-mail" placeholder="cliente@email.com" type="email" />
          <FormField label="Senha" placeholder="********" type="password" />

          <button
            type="button"
            className="h-12 w-full rounded-lg bg-linear-to-br from-primary-700 to-primary-600 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95"
          >
            Entrar
          </button>

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
