'use client'

import { useMemo, useState } from 'react'
import { AuthShell } from '@/components/forms/auth-shell'
import { FormField } from '@/components/forms/form-field'

type AccountType = 'cliente' | 'locador' | 'banco'

type CadastroFormProps = {
  initialType?: AccountType
}

const typeLabels: Record<AccountType, string> = {
  cliente: 'Cliente',
  locador: 'Locador',
  banco: 'Banco',
}

const fieldInputClass =
  'h-12 rounded-lg border border-transparent bg-white px-4 text-sm text-text-primary outline-none transition focus:border-[#1B53A7] focus:ring-2 focus:ring-[#1B53A7]/25'

export function CadastroForm({ initialType = 'cliente' }: CadastroFormProps) {
  const [accountType, setAccountType] = useState<AccountType>(initialType)
  const [employerCount, setEmployerCount] = useState(1)

  const title = useMemo(() => `Cadastro de ${typeLabels[accountType]}`, [accountType])

  const addEmployer = () => {
    setEmployerCount((current) => Math.min(3, current + 1))
  }

  return (
    <AuthShell title={title} subtitle="Preencha seus dados para criar sua conta.">
      <div className="space-y-8">
        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Tipo de Cadastro</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(typeLabels) as AccountType[]).map((type) => {
              const isSelected = accountType === type

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`h-11 rounded-lg text-sm transition ${
                    isSelected
                      ? 'bg-linear-to-br from-[#1B53A7] to-[#2668C9] text-white'
                      : 'bg-surface-2 text-text-secondary hover:bg-[#e7ecf8]'
                  }`}
                >
                  {typeLabels[type]}
                </button>
              )
            })}
          </div>
        </section>

        {accountType === 'cliente' && (
          <>
            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Dados Pessoais</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome Completo" placeholder="Joao Silva" />
                <FormField label="E-mail" placeholder="joao@email.com" type="email" />
                <FormField label="Senha" placeholder="********" type="password" />
                <FormField label="CPF" placeholder="000.000.000-00" />
                <FormField label="RG" placeholder="00.000.000-0" />
                <FormField label="Profissao" placeholder="Engenheiro" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Endereco</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField label="Logradouro" placeholder="Rua das Flores" />
                </div>
                <FormField label="Numero" placeholder="123" />
                <FormField label="Complemento" placeholder="Apto 45" />
                <FormField label="Bairro" placeholder="Centro" />
                <FormField label="Cidade" placeholder="Sao Paulo" />
                <FormField label="Estado" placeholder="SP" />
                <FormField label="CEP" placeholder="01000-000" />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl text-text-primary">Entidades Empregadoras</h2>
                <button
                  className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-text-primary disabled:opacity-50"
                  type="button"
                  onClick={addEmployer}
                  disabled={employerCount >= 3}
                >
                  <span className="text-xl">+</span>
                  Adicionar
                </button>
              </div>

              <p className="text-sm text-text-secondary">Maximo de 3 empregadores</p>

              {Array.from({ length: employerCount }).map((_, index) => (
                <div key={`employer-${index + 1}`} className="space-y-4 rounded-xl bg-surface-2 p-4">
                  <p className="text-sm text-text-primary">Empregador {index + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Empresa</span>
                      <input type="text" placeholder="Empresa LTDA" className={fieldInputClass} />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">CNPJ</span>
                      <input type="text" placeholder="00.000.000/0001-00" className={fieldInputClass} />
                    </label>

                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Rendimento</span>
                      <input type="text" placeholder="5000.00" className={fieldInputClass} />
                    </label>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {accountType === 'locador' && (
          <>
            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Dados do Agente</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome / Razao Social" placeholder="AutoPrime Locacoes" />
                <FormField label="E-mail" placeholder="contato@empresa.com" type="email" />
                <FormField label="Senha" placeholder="********" type="password" />
                <FormField label="CPF/CNPJ" placeholder="00.000.000/0001-00" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Endereco</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField label="Logradouro" placeholder="Av. Paulista" />
                </div>
                <FormField label="Numero" placeholder="1000" />
                <FormField label="Complemento" placeholder="Sala 20" />
                <FormField label="Bairro" placeholder="Bela Vista" />
                <FormField label="Cidade" placeholder="Sao Paulo" />
                <FormField label="Estado" placeholder="SP" />
                <FormField label="CEP" placeholder="01310-100" />
              </div>
            </section>
          </>
        )}

        {accountType === 'banco' && (
          <>
            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Dados do Banco</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome da Instituicao" placeholder="Banco Nacional S.A." />
                <FormField label="E-mail" placeholder="contato@banco.com" type="email" />
                <FormField label="Senha" placeholder="********" type="password" />
                <FormField label="CNPJ" placeholder="00.000.000/0001-00" />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl text-text-primary">Endereco</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField label="Logradouro" placeholder="Av. Brigadeiro Faria Lima" />
                </div>
                <FormField label="Numero" placeholder="3500" />
                <FormField label="Complemento" placeholder="Andar 12" />
                <FormField label="Bairro" placeholder="Itaim Bibi" />
                <FormField label="Cidade" placeholder="Sao Paulo" />
                <FormField label="Estado" placeholder="SP" />
                <FormField label="CEP" placeholder="04538-132" />
              </div>
            </section>
          </>
        )}

        <button
          type="button"
          className="h-12 w-full rounded-lg bg-linear-to-br from-[#1B53A7] to-[#2668C9] text-sm text-white transition hover:brightness-110"
        >
          Criar Conta de {typeLabels[accountType]}
        </button>
      </div>
    </AuthShell>
  )
}