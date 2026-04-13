'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthShell } from '@/components/forms/auth-shell'
import { FormField } from '@/components/forms/form-field'
import { useAuth } from '@/components/providers/auth-provider'
import api from '@/lib/api'
import { maskCEP, maskCPFOrCNPJ, maskRG, maskCNPJ } from '@/lib/masks'
import { fetchAddressByCep } from '@/services/via-cep.service'
import {
  AccountType,
  buildCadastroRequest,
  cadastroSchema,
  CadastroFormData,
} from '@/validations/cadastro.validation'

const typeLabels: Record<AccountType, string> = {
  cliente: 'Cliente',
  locador: 'Locador',
  banco: 'Banco',
}

export function CadastroForm({ initialType = 'cliente' }: { initialType?: AccountType }) {
  const [accountType, setAccountType] = useState<AccountType>(initialType)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      documento: '',
      rg: '',
      cep: '',
      empregos: [{ empresaNome: '', cnpj: '', rendimento: '' }],
    },
  })

  const { fields, append } = useFieldArray({
    control,
    name: 'empregos',
  })

  const title = useMemo(() => `Cadastro de ${typeLabels[accountType]}`, [accountType])

  const addEmployer = () => {
    if (fields.length < 3) {
      append({ empresaNome: '', cnpj: '', rendimento: '' })
    }
  }

  // ViaCEP Integration
  const handleCEPBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length !== 8) return

    try {
      const address = await fetchAddressByCep(cep)
      if (address) {
        setValue('logradouro', address.logradouro)
        setValue('bairro', address.bairro)
        setValue('cidade', address.cidade)
        setValue('estado', address.estado)
      }
    } catch {
      // ViaCEP eh complementar; falha nao deve bloquear cadastro.
    }
  }

  const onSubmit = async (data: CadastroFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const { endpoint, body } = buildCadastroRequest(data, accountType)

      await api.post(endpoint, body)

      const loginResponse = await api.post<{ accessToken: string; email: string }>('/usersService/auth/login', {
        email: data.email,
        password: data.password,
      })

      login(loginResponse.data.email, loginResponse.data.accessToken)
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar cadastro. Verifique os dados.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell title={title} subtitle="Preencha seus dados para criar sua conta.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {error && (
          <div className="rounded-lg bg-danger-soft p-3 text-center text-sm text-danger font-medium border border-danger/10">
            {error}
          </div>
        )}

        {/* Tipo de Cadastro */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary/80">Tipo de Cadastro</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(typeLabels) as AccountType[]).map((type) => {
              const isSelected = accountType === type

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setAccountType(type)
                    reset()
                  }}
                  className={`h-11 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-elevated'
                  }`}
                >
                  {typeLabels[type]}
                </button>
              )
            })}
          </div>
        </section>

        {/* Dados Principais */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">Dados Principais</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField 
              label="Nome / Razão Social" 
              placeholder="Ex: João Silva ou Empresa S.A." 
              error={errors.nome?.message}
              {...register('nome')}
            />
            <FormField 
              label="E-mail" 
              placeholder="email@exemplo.com" 
              type="email" 
              error={errors.email?.message}
              {...register('email')}
            />
            <FormField 
              label="Senha" 
              placeholder="********" 
              type="password" 
              error={errors.password?.message}
              {...register('password')}
            />
            <FormField 
              label="Confirmar Senha" 
              placeholder="********" 
              type="password" 
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className={accountType !== 'cliente' ? 'sm:col-span-2' : ''}>
              <FormField 
                label="CPF / CNPJ" 
                placeholder="000.000.000-00" 
                error={errors.documento?.message}
                maxLength={18}
                {...register('documento', {
                  onChange: (e) => {
                    setValue('documento', maskCPFOrCNPJ(e.target.value))
                  }
                })}
              />
            </div>

            {accountType === 'cliente' && (
              <>
                <FormField 
                  label="RG" 
                  placeholder="00.000.000-0" 
                  error={errors.rg?.message}
                  maxLength={12}
                  {...register('rg', {
                    onChange: (e) => {
                      setValue('rg', maskRG(e.target.value))
                    }
                  })}
                />
                <div className="sm:col-span-2">
                  <FormField 
                    label="Profissão" 
                    placeholder="Engenheiro, Médico, etc." 
                    {...register('profissao')}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Endereço */}
        <section className="space-y-5">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">Endereço</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField 
                label="CEP" 
                placeholder="00000-000" 
                error={errors.cep?.message}
                maxLength={9}
                {...register('cep', {
                  onBlur: handleCEPBlur,
                  onChange: (e) => {
                    setValue('cep', maskCEP(e.target.value))
                  }
                })}
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-4 sm:col-span-2">
              <div className="sm:col-span-3">
                <FormField 
                  label="Logradouro" 
                  placeholder="Rua, Av, etc." 
                  error={errors.logradouro?.message}
                  {...register('logradouro')}
                />
              </div>
              <div className="sm:col-span-1">
                <FormField 
                  label="Estado" 
                  placeholder="SP" 
                  error={errors.estado?.message}
                  maxLength={2}
                  {...register('estado')}
                />
              </div>
            </div>

            <FormField 
              label="Número" 
              placeholder="123" 
              error={errors.numero?.message}
              {...register('numero')}
            />
            <FormField 
              label="Complemento" 
              placeholder="Apto, Bloco, etc." 
              {...register('complemento')}
            />
            <FormField 
              label="Bairro" 
              placeholder="Centro" 
              error={errors.bairro?.message}
              {...register('bairro')}
            />
            <FormField 
              label="Cidade" 
              placeholder="São Paulo" 
              error={errors.cidade?.message}
              {...register('cidade')}
            />
          </div>
        </section>

        {/* Entidades Empregadoras */}
        {accountType === 'cliente' && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">Entidades Empregadoras</h2>
              <button
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 disabled:opacity-50"
                type="button"
                onClick={addEmployer}
                disabled={fields.length >= 3}
              >
                <span className="text-lg font-bold">+</span>
                Adicionar
              </button>
            </div>

            <p className="text-sm font-medium text-text-secondary">Máximo de 3 empregadores</p>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="rounded-xl border border-border/40 bg-surface-2 p-6 shadow-[0px_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <p className="mb-5 text-sm font-bold text-text-primary">Empregador {index + 1}</p>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/70">Empresa</span>
                      <input 
                        type="text" 
                        placeholder="Empresa LTDA" 
                        className="h-11 rounded-lg border border-border/50 bg-surface px-4 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
                        {...register(`empregos.${index}.empresaNome` as const)}
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/70">CNPJ</span>
                      <input 
                        type="text" 
                        placeholder="00.000.000/0001-00" 
                        className="h-11 rounded-lg border border-border/50 bg-surface px-4 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
                        {...register(`empregos.${index}.cnpj` as const, {
                          onChange: (e) => {
                            setValue(`empregos.${index}.cnpj` as const, maskCNPJ(e.target.value))
                          }
                        })}
                      />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/70">Rendimento</span>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="5000.00" 
                        className="h-11 rounded-lg border border-border/50 bg-surface px-4 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
                        {...register(`empregos.${index}.rendimento` as const)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-xl bg-primary-600 text-base font-bold text-white shadow-xl shadow-primary-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? 'Processando...' : `Criar Conta de ${typeLabels[accountType]}`}
        </button>
      </form>
    </AuthShell>
  )
}