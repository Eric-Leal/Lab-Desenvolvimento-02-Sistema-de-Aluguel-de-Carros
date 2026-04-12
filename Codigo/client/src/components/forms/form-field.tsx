type FormFieldProps = {
  label: string
  placeholder?: string
  type?: string
}

export function FormField({ label, placeholder, type = 'text' }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-lg border border-transparent bg-surface-2 px-4 text-sm text-text-primary outline-none transition focus:border-[#1B53A7] focus:ring-2 focus:ring-[#1B53A7]/25"
      />
    </label>
  )
}
