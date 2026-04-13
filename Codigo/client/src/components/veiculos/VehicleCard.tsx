import Image from "next/image"
import Link from "next/link"
import type { Automovel } from "@/types/vehicle"

interface VehicleCardProps {
  vehicle: Automovel
  locadorNome?: string
}

export function VehicleCard({ vehicle, locadorNome }: VehicleCardProps) {
  const primaryImage = vehicle.imagens?.sort((a, b) => a.ordem - b.ordem)[0]

  return (
    <Link href={`/veiculos/${vehicle.matricula}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-surface shadow-[0_2px_16px_rgba(26,77,168,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(26,77,168,0.18)] hover:-translate-y-0.5">
        {/* Imagem */}
        <div className="relative aspect-4/3 overflow-hidden bg-surface-2">
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-disabled">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 5v5h-2" />
                <circle cx="8.5" cy="17.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
              </svg>
            </div>
          )}

          {/* Gradiente sutil na base da imagem */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent" />

          {/* Badge ano — top-right, cor neutra que funciona em dark/light */}
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur-sm">
              {vehicle.ano}
            </span>
          </div>

          {!vehicle.disponivel && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50 backdrop-blur-[2px]">
              <span className="rounded-full bg-surface/90 px-4 py-1.5 text-xs font-semibold text-text-primary">
                Indisponível
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-5">
          <div className="space-y-0.5">
            <p className="ds-caption font-medium uppercase tracking-wider text-text-secondary">
              {vehicle.marca}
            </p>
            <h3
              className="text-xl text-text-primary"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              {vehicle.modelo}
            </h3>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl text-accent"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  R$ {Number(vehicle.valorDiaria).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                </span>
                <span className="ds-caption">/dia</span>
              </div>
              {locadorNome && (
                <p className="ds-caption mt-1 text-text-secondary">
                  por {locadorNome}
                </p>
              )}
            </div>
            <span className="ds-caption self-start rounded-md bg-surface-2 px-2 py-1 font-mono">
              {vehicle.placa}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
