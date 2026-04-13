import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  maxWidthClass?: string
}

export function AuthShell({ title, subtitle, children, maxWidthClass = 'max-w-[760px]' }: AuthShellProps) {
  return (
    <main className="flex-1 px-6 py-12 sm:px-8 lg:py-16">
      <div className={`mx-auto w-full ${maxWidthClass}`}>
        <header className="mb-6 space-y-1">
          <h1 className="font-(--font-dm-serif) text-5xl leading-tight tracking-[-0.03em] text-text-primary sm:text-6xl">
            {title}
          </h1>
          <p className="text-base text-text-secondary">{subtitle}</p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0px_10px_30px_rgba(16,19,30,0.04)] sm:p-8">
          {children}
        </section>
      </div>
    </main>
  )
}
