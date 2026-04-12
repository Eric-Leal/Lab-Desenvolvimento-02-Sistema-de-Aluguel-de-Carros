import Image from "next/image"
import Link from "next/link"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-surface/80 backdrop-blur-[18px]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/carflow_horizontal_light_fixed.png"
            alt="CarFlow — aluguel de carros"
            width={140}
            height={40}
            className="h-9 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logos/carflow_horizontal_dark_fixed.png"
            alt="CarFlow — aluguel de carros"
            width={140}
            height={40}
            className="hidden h-9 w-auto dark:block"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="ds-body font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Início
          </Link>
          <Link
            href="/veiculos"
            className="ds-body font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Veículos
          </Link>
          <Link
            href="/pedidos"
            className="ds-body font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Meus Pedidos
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedThemeToggler />
          <Link
            href="/entrar"
            className="hidden rounded-md px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2 md:inline-flex"
          >
            Entrar
          </Link>
          <Link
            href="/cadastrar"
            className="hidden rounded-md bg-(--primary-700) px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-(--primary-800) md:inline-flex"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  )
}
