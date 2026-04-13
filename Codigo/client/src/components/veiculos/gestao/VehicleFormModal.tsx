"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Trash2, Upload } from "lucide-react"
import { vehiclesService } from "@/services/vehicles.service"
import type { Automovel, AutomovelImagem } from "@/types/vehicle"

interface VehicleFormModalProps {
  open: boolean
  mode: "create" | "edit"
  locadorId: string
  vehicle?: Automovel | null
  onClose: () => void
  onSaved: () => void
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Falha ao ler imagem"))
  })
}

export function VehicleFormModal({ open, mode, locadorId, vehicle, onClose, onSaved }: VehicleFormModalProps) {
  const currentYear = new Date().getFullYear()

  const [placa, setPlaca] = useState("")
  const [ano, setAno] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [valorDiariaInput, setValorDiariaInput] = useState("")
  const [existingImages, setExistingImages] = useState<AutomovelImagem[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isDraggingImages, setIsDraggingImages] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCreate = mode === "create"

  function parseCurrency(value: string): number {
    const normalized = value.replace(/\./g, "").replace(",", ".")
    const number = Number(normalized)
    return Number.isFinite(number) ? number : NaN
  }

  function formatCurrencyInput(raw: string): string {
    const digits = raw.replace(/\D/g, "")
    if (!digits) return ""
    const number = Number(digits) / 100
    return number.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  function appendImageFiles(newFiles: File[]) {
    if (newFiles.length === 0) return

    const imageOnly = newFiles.filter((file) => file.type.startsWith("image/"))
    const maxNewFiles = 3 - existingImages.length
    if (maxNewFiles <= 0) {
      setError("Limite de 3 imagens atingido. Remova uma imagem para adicionar outra.")
      return
    }

    setImageFiles((prev) => {
      const room = maxNewFiles - prev.length
      if (room <= 0) {
        setError("Limite de 3 imagens atingido. Remova uma imagem para adicionar outra.")
        return prev
      }

      const accepted = imageOnly.slice(0, room)
      if (accepted.length < imageOnly.length) {
        setError("Você pode manter no máximo 3 imagens por veículo.")
      } else {
        setError(null)
      }

      return [...prev, ...accepted]
    })
  }

  function removeNewImage(index: number) {
    setImageFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  function removeExistingImage(imageId: string) {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId))
  }

  useEffect(() => {
    if (!open) return
    setError(null)
    if (vehicle) {
      setPlaca(vehicle.placa)
      setAno(String(vehicle.ano))
      setMarca(vehicle.marca)
      setModelo(vehicle.modelo)
      setValorDiariaInput(Number(vehicle.valorDiaria).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      setExistingImages(vehicle.imagens ?? [])
      setImageFiles([])
    } else {
      setPlaca("")
      setAno("")
      setMarca("")
      setModelo("")
      setValorDiariaInput("")
      setExistingImages([])
      setImageFiles([])
    }
  }, [open, vehicle])

  const previewImages = useMemo(() => {
    return imageFiles.map((file, index) => ({
      id: `new-${index}-${file.name}`,
      src: URL.createObjectURL(file),
      label: file.name,
      isExisting: false,
    }))
  }, [imageFiles])

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image.src))
    }
  }, [previewImages])

  const anoNumber = Number(ano)
  const valorDiaria = parseCurrency(valorDiariaInput)
  const totalImagesCount = existingImages.length + imageFiles.length

  const anoValid = Number.isInteger(anoNumber) && anoNumber > 0 && anoNumber <= currentYear
  const valorValid = Number.isFinite(valorDiaria) && valorDiaria > 0

  const valid = useMemo(() => {
    if (!placa || !ano || !marca || !modelo || !valorDiariaInput) return false
    if (!anoValid || !valorValid) return false
    if (totalImagesCount < 1 || totalImagesCount > 3) return false
    return true
  }, [placa, ano, marca, modelo, valorDiariaInput, anoValid, valorValid, totalImagesCount])

  async function handleSubmit() {
    if (!valid || loading) return
    setLoading(true)
    setError(null)

    try {
      if (isCreate) {
        const files = imageFiles.slice(0, 3)
        const imageBase64List = await Promise.all(files.map(toBase64))
        const [imageBase64, ...imagesBase64] = imageBase64List
        await vehiclesService.criar({
          placa: placa.trim().toUpperCase(),
          ano: anoNumber,
          marca: marca.trim(),
          modelo: modelo.trim(),
          valorDiaria,
          locadorOriginalId: locadorId,
          imageBase64,
          imagesBase64,
        })
      } else if (vehicle) {
        await vehiclesService.atualizar(vehicle.matricula, {
          placa: placa.trim().toUpperCase(),
          ano: anoNumber,
          marca: marca.trim(),
          modelo: modelo.trim(),
          valorDiaria,
        })

        const originalImageIds = new Set((vehicle.imagens ?? []).map((image) => image.id))
        const keptImageIds = new Set(existingImages.map((image) => image.id))
        const removeQueue = (vehicle.imagens ?? [])
          .filter((image) => originalImageIds.has(image.id) && !keptImageIds.has(image.id))
          .map((image) => image.id)
        let addQueue = [...imageFiles]
        let currentImagesCount = (vehicle.imagens ?? []).length

        while (addQueue.length > 0 || removeQueue.length > 0) {
          if (addQueue.length > 0 && currentImagesCount < 3) {
            const nextFile = addQueue.shift()
            if (nextFile) {
              await vehiclesService.adicionarImagem(vehicle.matricula, nextFile)
              currentImagesCount += 1
            }
            continue
          }

          if (removeQueue.length > 0 && currentImagesCount > 1) {
            const nextImageId = removeQueue.shift()
            if (nextImageId) {
              await vehiclesService.removerImagem(vehicle.matricula, nextImageId)
              currentImagesCount -= 1
            }
            continue
          }

          if (addQueue.length > 0 && removeQueue.length === 0) {
            throw new Error("Não foi possível adicionar mais imagens. O limite máximo é 3.")
          }

          if (removeQueue.length > 0 && addQueue.length === 0) {
            throw new Error("Não foi possível remover todas as imagens. O veículo deve manter ao menos 1 foto.")
          }

          throw new Error("Não foi possível aplicar as alterações de imagens do veículo.")
        }
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar veículo")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(16,19,31,0.28)]">
        <h3 className="text-2xl text-text-primary" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {isCreate ? "Cadastrar Novo Veículo" : "Editar Veículo"}
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Placa</label>
            <input value={placa} onChange={(e) => setPlaca(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand" />
          </div>
          <div className="space-y-1.5">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Ano</label>
            <input type="number" min="1" max={currentYear} value={ano} onChange={(e) => setAno(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand" />
            {!anoValid && ano && (
              <p className="ds-caption text-red-700 dark:text-red-300">Ano inválido. Informe um ano entre 1 e {currentYear}.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Marca</label>
            <input value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand" />
          </div>
          <div className="space-y-1.5">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Modelo</label>
            <input value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Valor da diária (R$)</label>
            <input
              inputMode="decimal"
              value={valorDiariaInput}
              onChange={(e) => setValorDiariaInput(formatCurrencyInput(e.target.value))}
              placeholder="0,00"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-border-brand"
            />
            {!valorValid && valorDiariaInput && (
              <p className="ds-caption text-red-700 dark:text-red-300">Valor da diária deve ser maior que zero.</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="ds-caption font-semibold uppercase tracking-wider text-text-secondary">Imagens do veículo</label>
            <label
              onDragOver={(event) => {
                event.preventDefault()
                setIsDraggingImages(true)
              }}
              onDragLeave={() => setIsDraggingImages(false)}
              onDrop={(event) => {
                event.preventDefault()
                setIsDraggingImages(false)
                appendImageFiles(Array.from(event.dataTransfer.files ?? []))
              }}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-4 text-sm transition ${
                isDraggingImages
                  ? "border-border-brand bg-surface"
                  : "border-border-strong bg-surface-2 text-text-secondary hover:bg-surface"
              }`}
            >
              <Upload size={16} />
              <span>Arraste imagens aqui ou clique para selecionar (mínimo 1, máximo 3)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => appendImageFiles(Array.from(e.target.files ?? []))}
              />
            </label>

            {totalImagesCount > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-lg border border-border bg-surface-2">
                    <img src={image.imageUrl} alt={`Imagem atual ${index + 1}`} className="h-24 w-full object-cover" />
                    <div className="flex items-center justify-between px-2 py-2">
                      <p className="ds-caption text-text-secondary">Imagem atual {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={12} /> Remover
                      </button>
                    </div>
                  </div>
                ))}

                {previewImages.map((image, index) => (
                  <div key={image.id} className="overflow-hidden rounded-lg border border-border bg-surface-2">
                    <img src={image.src} alt={`Nova imagem ${index + 1}`} className="h-24 w-full object-cover" />
                    <div className="flex items-center justify-between px-2 py-2">
                      <p className="ds-caption max-w-[70%] truncate text-text-secondary" title={image.label}>{image.label}</p>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-red-700 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={12} /> Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="ds-caption text-red-700 dark:text-red-300">Adicione ao menos 1 imagem para continuar.</p>
            )}

            <p className="ds-caption text-text-secondary">
              A primeira imagem da ordem será tratada como principal. Você pode remover e adicionar imagens antes de salvar.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-primary transition hover:bg-surface disabled:opacity-60">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!valid || loading} className="flex-1 rounded-lg bg-(--primary-700) px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-800) disabled:opacity-60">
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Salvando...</span>
            ) : (isCreate ? "Cadastrar veículo" : "Salvar alterações")}
          </button>
        </div>
      </div>
    </div>
  )
}
