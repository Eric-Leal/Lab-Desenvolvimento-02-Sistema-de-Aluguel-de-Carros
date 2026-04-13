import React, { forwardRef } from 'react'

type FormFieldProps = {
  label: string
  placeholder?: string
  type?: string
  name?: string
  required?: boolean
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, placeholder, type = 'text', error, ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-text-secondary">
          {label}
        </span>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`h-12 rounded-lg border bg-surface-2 px-4 text-sm text-text-primary outline-none transition focus:ring-2 ${
            error 
              ? 'border-danger focus:ring-danger/25' 
              : 'border-transparent focus:border-primary-600 focus:ring-primary-600/25'
          }`}
          {...props}
        />
        {error && <span className="text-[0.7rem] font-medium text-danger">{error}</span>}
      </label>
    )
  }
)

FormField.displayName = 'FormField'
