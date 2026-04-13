import { API_ENDPOINTS } from "@/config/endpoints";
import type { Automovel } from "@/types/vehicle";

export interface CreateAutomovelPayload {
  placa: string;
  ano: number;
  marca: string;
  modelo: string;
  valorDiaria: number;
  locadorOriginalId: string;
  imageBase64: string;
  imagesBase64?: string[];
}

export interface UpdateAutomovelPayload {
  placa?: string;
  ano?: number;
  marca?: string;
  modelo?: string;
  valorDiaria?: number;
}

export const vehiclesService = {
  ping: async (): Promise<string> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com vehiclesService");
    const text = await response.text();
    return text || "OK";
  },

  listar: async (): Promise<Automovel[]> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Erro ao buscar veículos");
    return response.json();
  },

  listarDisponiveis: async (): Promise<Automovel[]> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/disponiveis`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Erro ao buscar veículos disponíveis");
    return response.json();
  },

  listarMeus: async (locadorOriginalId: string): Promise<Automovel[]> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/meus?locadorOriginalId=${encodeURIComponent(locadorOriginalId)}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Erro ao buscar veículos do locador");
    return response.json();
  },

  buscarPorMatricula: async (matricula: number): Promise<Automovel> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Veículo ${matricula} não encontrado`);
    return response.json();
  },

  criar: async (payload: CreateAutomovelPayload): Promise<Automovel> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao criar veículo");
    }
    return response.json();
  },

  atualizar: async (matricula: number, payload: UpdateAutomovelPayload): Promise<Automovel> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao atualizar veículo");
    }
    return response.json();
  },

  adicionarImagem: async (matricula: number, file: File): Promise<Automovel> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}/imagens`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao adicionar imagem");
    }

    return response.json();
  },

  removerImagem: async (matricula: number, imageId: string): Promise<Automovel> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}/imagens/${imageId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao remover imagem");
    }

    return response.json();
  },

  excluir: async (matricula: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao excluir veículo");
    }
  },
};