import { z } from 'zod'

export const configuracoesSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().trim().email('E-mail invalido'),
  profissao: z.string().trim().optional(),
  documento: z
    .string()
    .trim()
    .regex(/^(\d{11}|\d{14})$/, 'CPF/CNPJ invalido (use 11 ou 14 digitos)'),
  cep: z.string().trim().min(8, 'CEP invalido'),
  logradouro: z.string().trim().min(2, 'Logradouro e obrigatorio'),
  numero: z.string().trim().min(1, 'Numero e obrigatorio'),
  bairro: z.string().trim().min(2, 'Bairro e obrigatorio'),
  cidade: z.string().trim().min(2, 'Cidade e obrigatoria'),
  estado: z.string().trim().length(2, 'Estado deve ter 2 letras'),
})

export type ConfiguracoesFormInput = z.infer<typeof configuracoesSchema>

export type ConfiguracoesNormalizedData = z.infer<typeof configuracoesSchema>

export type EnderecoPayload = {
  cep: string
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  estado: string
}

export type ConfiguracoesUpdatePayload = {
  nome: string
  email: string
  documento: string
  profissao?: string
  imageBase64?: string
  endereco: EnderecoPayload
  ['endereço']: EnderecoPayload
}

type ConfiguracoesValidationOptions = {
  includeProfissao?: boolean
}

export function parseConfiguracoesForm(
  input: ConfiguracoesFormInput,
  options: ConfiguracoesValidationOptions = {},
) {
  const { includeProfissao = true } = options

  return configuracoesSchema.safeParse({
    nome: input.nome.trim(),
    email: input.email.trim(),
    profissao: includeProfissao ? input.profissao?.trim() || '' : undefined,
    documento: input.documento.replace(/\D/g, ''),
    cep: input.cep.replace(/\D/g, ''),
    logradouro: input.logradouro.trim(),
    numero: input.numero.trim(),
    bairro: input.bairro.trim(),
    cidade: input.cidade.trim(),
    estado: input.estado.trim().toUpperCase(),
  })
}

export function buildConfiguracoesUpdatePayload(
  data: ConfiguracoesNormalizedData,
  options: ConfiguracoesValidationOptions = {},
): ConfiguracoesUpdatePayload {
  const { includeProfissao = true } = options

  const endereco: EnderecoPayload = {
    cep: data.cep,
    logradouro: data.logradouro,
    numero: data.numero,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
  }

  return {
    nome: data.nome,
    email: data.email,
    documento: data.documento,
    ...(includeProfissao ? { profissao: data.profissao || '' } : {}),
    endereco,
    ['endereço']: endereco,
  }
}
