'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useCurrentUser } from '@/hooks/use-current-user'
import { FormField } from '@/components/forms/form-field'
import { User, MapPin, Trash2, Edit2, Save, X, AlertOctagon, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import {
  buildConfiguracoesUpdatePayload,
  parseConfiguracoesForm,
} from '@/validations/configuracoes.validation'

export default function ConfiguracoesPage() {
  const { logout } = useAuth()
  const { userId, profile, loading, refresh } = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    profissao: '',
    documento: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  })

  const syncFormWithProfile = () => {
    if (!profile) return
    setFormData({
      nome: profile.nome || '',
      email: profile.email || '',
      profissao: profile.profissao || '',
      documento: profile.documento || '',
      cep: profile.endereco?.cep || '',
      logradouro: profile.endereco?.logradouro || '',
      numero: profile.endereco?.numero || '',
      bairro: profile.endereco?.bairro || '',
      cidade: profile.endereco?.cidade || '',
      estado: profile.endereco?.estado || '',
    })
  }

  useEffect(() => {
    syncFormWithProfile()
  }, [profile])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !isEditing) return

    const validated = parseConfiguracoesForm(formData)

    if (!validated.success) {
      toast.error(validated.error.issues[0]?.message || 'Dados invalidos.')
      return
    }

    setIsSaving(true)
    try {
      const payload = buildConfiguracoesUpdatePayload(validated.data)
      await api.patch(`/usersService/client/${userId}`, payload)
      toast.success('Configurações salvas!')
      setIsEditing(false)
      await refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar.'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await api.delete(`/usersService/client/${userId}`)
      toast.success('Sua conta foi excluída com sucesso.')
      logout()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir conta.'
      setDeleteError(message)
      toast.error(message)
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-surface-2/30 py-12 px-6 sm:px-8">
      <div className="ds-shell max-w-5xl">
        
        {/* Top Header com Ações */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-text-primary font-serif tracking-tight">Configurações</h1>
            <p className="text-text-secondary font-medium">Gerencie sua conta e informações de cadastro</p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary-600 px-10 text-sm font-bold text-white shadow-xl shadow-primary-500/30 transition hover:bg-primary-700 active:scale-95"
              >
                <Edit2 className="h-4 w-4" />
                Editar Perfil
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    syncFormWithProfile()
                    setIsEditing(false)
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-white border border-border px-6 text-sm font-bold text-text-primary transition hover:bg-neutral-50 active:scale-95"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </button>
                <button
                  form="settings-form"
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-12 items-center gap-2 rounded-md bg-emerald-600 px-10 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-700 active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-10">
          {/* Card Principal de Formulário */}
          <div className="rounded-2xl border border-border/80 bg-white shadow-2xl shadow-black/5 overflow-hidden">
            <form id="settings-form" onSubmit={handleSave}>
              
              {/* SEÇÃO: DADOS PESSOAIS (GRID 2 COLUNAS) */}
              <div className="p-10 sm:p-12">
                <div className="mb-12 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Dados Pessoais</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <FormField
                    label="Nome Completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="E-mail de Acesso"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Profissão"
                    value={formData.profissao}
                    onChange={(e) => setFormData({ ...formData, profissao: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="CPF / CNPJ"
                    value={formData.documento}
                    disabled
                  />
                </div>
              </div>

              <div className="h-px w-full bg-border/40" />

              {/* SEÇÃO: ENDEREÇO (GRID 2 COLUNAS IGUAL AO CADASTRO) */}
              <div className="p-10 sm:p-12">
                <div className="mb-12 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary uppercase tracking-tight">Endereço Residencial</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <FormField
                    label="CEP"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Logradouro"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Número"
                    value={formData.numero}
                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                    disabled={!isEditing}
                  />
                  <FormField
                    label="Cidade"
                    value={formData.cidade}
                    disabled
                  />
                  <FormField
                    label="Estado (UF)"
                    value={formData.estado}
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>

          {/* BOTÃO EXCLUIR - SEÇÃO ULTRA DESTACADA */}
          <div className="rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40 p-10 sm:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-start gap-6">
                <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertOctagon className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-red-700">Atenção!</h2>
                  <p className="text-text-secondary font-medium text-lg max-w-md">
                    Ao excluir sua conta, todos os seus dados serão deletados permanentemente. Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteError(null)
                  setShowDeleteModal(true)
                }}
                className="inline-flex h-16 items-center justify-center gap-3 rounded-xl bg-red-600 px-12 text-base font-black text-white shadow-2xl shadow-red-500/40 transition hover:bg-red-700 active:scale-95"
              >
                <Trash2 className="h-6 w-6" />
                EXCLUIR CONTA AGORA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO REAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
                 <AlertTriangle className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-text-primary">Tem certeza absoluta?</h3>
                <p className="text-text-secondary font-medium text-lg">
                  Sua conta será permanentemente removida. Seus aluguéis e histórico serão perdidos.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {deleteError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {deleteError}
                </p>
              )}
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-red-600 text-base font-bold text-white shadow-lg hover:bg-red-700 transition active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? 'Processando...' : 'Sim, excluir permanentemente'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-surface-elevated text-base font-bold text-text-primary hover:bg-border transition active:scale-95"
              >
                Não, manter minha conta
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
