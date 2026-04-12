import Image from 'next/image'
import Link from 'next/link'
import { Shield, Timer, Sparkles } from 'lucide-react'
import { VehicleCard } from '@/components/cards/vehicle-card'

const benefits = [
  {
    icon: Shield,
    title: 'Seguro Total',
    description: 'Protecao completa em todas as locacoes',
  },
  {
    icon: Timer,
    title: 'Processo Rapido',
    description: 'Aprovacao e analise em ate 24h',
  },
  {
    icon: Sparkles,
    title: 'Frota Premium',
    description: 'Veiculos selecionados e bem cuidados',
  },
]

const featuredCars = [
  {
    imageSrc: '/images/home/car-bmw-serie5-76e555.png',
    imageAlt: 'BMW Serie 5',
    year: '2024',
    brand: 'BMW',
    model: 'Serie 5',
    price: 'R$ 450',
    plate: 'ABC-1234',
    seller: 'AutoPrime Locacoes',
  },
  {
    imageSrc: '/images/home/car-mercedes-gle450-76e555.png',
    imageAlt: 'Mercedes-Benz GLE 450',
    year: '2024',
    brand: 'Mercedes-Benz',
    model: 'GLE 450',
    price: 'R$ 520',
    plate: 'DEF-5678',
    seller: 'AutoPrime Locacoes',
  },
  {
    imageSrc: '/images/home/car-porsche-911-3161e1.png',
    imageAlt: 'Porsche 911 Carrera',
    year: '2023',
    brand: 'Porsche',
    model: '911 Carrera',
    price: 'R$ 890',
    plate: 'GHI-9012',
    seller: 'Elite Motors',
  },
  {
    imageSrc: '/images/home/car-audi-a3-76e555.png',
    imageAlt: 'Audi A3 Sportback',
    year: '2024',
    brand: 'Audi',
    model: 'A3 Sportback',
    price: 'R$ 280',
    plate: 'JKL-3456',
    seller: 'Elite Motors',
  },
  {
    imageSrc: '/images/home/car-toyota-hilux-76e555.png',
    imageAlt: 'Toyota Hilux SRX',
    year: '2023',
    brand: 'Toyota',
    model: 'Hilux SRX',
    price: 'R$ 350',
    plate: 'MNO-7890',
    seller: 'AutoPrime Locacoes',
  },
]

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-linear-to-br from-primary-700 to-primary-600 px-6 py-20 sm:px-8 lg:px-0 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <Image src="/images/home/hero-pattern.svg" alt="" fill className="object-cover" aria-hidden="true" />
        </div>

        <div className="ds-shell relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_500px]">
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-200">
                Locação Premium
              </p>
              <h1 className="ds-display text-white">
                Dirija com Elegância
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-primary-100 opacity-90">
                Descubra nossa coleção exclusiva de veículos. Experiência de locação premium com atendimento
                personalizado.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#veiculos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-8 text-sm font-semibold text-primary-700 transition-all hover:bg-neutral-50 hover:shadow-lg active:scale-95"
              >
                Ver Veículos
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-white/10 px-8 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
              >
                Criar Conta
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <Image
              src="/images/home/hero-car-56bb0f.png"
              alt="Carro esportivo premium"
              width={800}
              height={512}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-10 sm:px-8 lg:px-0">
        <div className="ds-shell grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="flex items-start gap-5 rounded-xl border border-border/50 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-surface-2">
              <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                <benefit.icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base leading-6 text-text-primary">{benefit.title}</h2>
                <p className="mt-1 text-sm text-text-secondary">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="veiculos" className="px-6 py-14 sm:px-8 lg:px-0 lg:py-16">
        <div className="ds-shell space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-primary-600">Destaques</p>
              <h2 className="ds-h2 text-text-primary">
                Veículos Disponíveis
              </h2>
            </div>

            <Link
              href="#"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-6 text-sm font-semibold text-primary-600 transition-all hover:bg-surface-2 active:scale-95"
            >
              Ver todos
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredCars.map((vehicle) => (
              <VehicleCard key={`${vehicle.plate}-${vehicle.model}`} {...vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-16 text-center sm:px-8 lg:px-0">
        <div className="ds-shell max-w-4xl space-y-4">
          <h2 className="ds-h2 text-text-primary">
            Pronto para sua próxima viagem?
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-secondary">
            Cadastre-se agora e tenha acesso a nossa frota exclusiva de veiculos premium.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              href="/cadastro"
              className="inline-flex h-13 items-center justify-center rounded-md bg-linear-to-br from-primary-700 to-primary-600 px-10 text-sm font-semibold text-white shadow-xl shadow-primary-500/20 transition-all hover:brightness-110 active:scale-95"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
