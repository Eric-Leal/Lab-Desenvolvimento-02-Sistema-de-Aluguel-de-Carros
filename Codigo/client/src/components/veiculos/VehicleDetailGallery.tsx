import Image from "next/image"
import type { Automovel } from "@/types/vehicle"

interface VehicleDetailGalleryProps {
  vehicle: Automovel
}

export function VehicleDetailGallery({ vehicle }: VehicleDetailGalleryProps) {
  const sorted = vehicle.imagens?.slice().sort((a, b) => a.ordem - b.ordem) ?? []
  const primary = sorted[0]

  return (
    <div className="space-y-3">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-surface-2 shadow-[0_4px_24px_rgba(26,77,168,0.10)]">
        {primary ? (
          <Image
            src={primary.imageUrl}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-disabled">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 5v5h-2" />
              <circle cx="8.5" cy="17.5" r="2.5" />
              <circle cx="17.5" cy="17.5" r="2.5" />
            </svg>
          </div>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {sorted.slice(1).map((img) => (
            <div key={img.id} className="relative aspect-4/3 overflow-hidden rounded-lg bg-surface-2">
              <Image
                src={img.imageUrl}
                alt={`${vehicle.marca} ${vehicle.modelo} — imagem adicional`}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
