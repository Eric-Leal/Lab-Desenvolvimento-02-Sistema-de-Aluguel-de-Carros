import { API_ENDPOINTS } from "@/config/endpoints";

export const vehiclesService = {
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com vehiclesService");
    const text = await response.text();
    return text || "OK";
  },

  listarDisponiveis: async () => {
    const response = await fetch(`${API_ENDPOINTS.vehiclesService}/automoveis/disponiveis`);
    if (!response.ok) throw new Error("Erro ao buscar automoveis disponiveis");
    return response.json();
  },
};