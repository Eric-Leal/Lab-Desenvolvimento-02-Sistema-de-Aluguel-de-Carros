import { API_ENDPOINTS } from "@/config/endpoints";
import type { Automovel } from "@/types/vehicle";

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

  buscarPorMatricula: async (matricula: number): Promise<Automovel> => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/${matricula}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Veículo ${matricula} não encontrado`);
    return response.json();
  },
};