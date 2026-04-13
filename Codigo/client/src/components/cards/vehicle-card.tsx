import Image from 'next/image'

type VehicleCardProps = {
  imageSrc: string
  imageAlt: string
  year: string
  brand: string
  model: string
  price: string
  plate: string
  seller: string
}

export function VehicleCard({
  imageSrc,
  imageAlt,
  year,
  brand,
  model,
  price,
  plate,
  seller,
}: VehicleCardProps) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-surface shadow-[0px_10px_40px_0px_rgba(26,77,168,0.06)] transition-all duration-300 hover:shadow-2xl">
      <div className="relative h-60 overflow-hidden sm:h-67">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute right-3 top-3 rounded-full bg-surface-elevated/90 px-3 py-1 text-xs font-semibold text-text-primary backdrop-blur-sm">
          {year}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-secondary">{brand}</p>
          <h3 className="mt-1 font-(--font-dm-serif) text-[1.25rem] leading-tight text-text-primary transition-colors group-hover:text-text-brand">
            {model}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <p>
            <span className="font-(--font-dm-serif) text-2xl text-accent-500">{price}</span>
            <span className="ml-1 text-xs text-text-secondary">/dia</span>
          </p>
          <span className="text-xs text-text-secondary">{plate}</span>
        </div>

        <p className="text-xs text-text-secondary">por {seller}</p>
      </div>
    </article>
  )
}