export interface AutomovelImagem {
  id: string
  imageUrl: string
  ordem: number
}

export interface Automovel {
  matricula: number
  placa: string
  ano: number
  marca: string
  modelo: string
  locadorOriginalId: string
  proprietarioAtualId: string
  valorDiaria: number
  disponivel: boolean
  imagens: AutomovelImagem[]
  criadoEm: string
  atualizadoEm: string
}
