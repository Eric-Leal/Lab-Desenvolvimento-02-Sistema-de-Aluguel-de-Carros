import { API_ENDPOINTS } from "@/config/endpoints";

export const microsservicoService = {
  /**
   * Verifica a saúde do Microserviço A via Gateway
   */
  ping: async () => {
    const response = await fetch(`${API_ENDPOINTS.serviceA}/ping`);
    if (!response.ok) throw new Error("Erro ao conectar com Microserviço A");
    // Como o Micronaut retorna texto puro no ping padrão ou um objeto simples
    const text = await response.text();
    return text || "OK";
  }
};
