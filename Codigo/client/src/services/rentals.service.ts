import { API_ENDPOINTS } from '@/config/endpoints';

export interface CreatePedidoPayload {
  clienteId: string;
  automovelMatricula: number;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string;    // YYYY-MM-DD
  valorTotal: number;
}

export interface PedidoResponse {
  id: string;
  clienteId: string;
  automovelMatricula: number;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  requerFinanciamento: boolean;
  bancoId: string | null;
  statusLocador: string;
  statusGeral: string;
  criadoEm: string;
  atualizadoEm: string;
}

const BASE = API_ENDPOINTS.rentalsService;

export const rentalsService = {
  ping: async (): Promise<string> => {
    const res = await fetch(`${BASE}/ping`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },

  criarRascunho: async (payload: CreatePedidoPayload): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao criar pedido");
    }
    return response.json();
  },

  submeter: async (pedidoId: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}/submeter`, {
      method: "PATCH",
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao submeter pedido");
    }
    return response.json();
  },

  buscarPorId: async (id: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Pedido ${id} não encontrado`);
    return response.json();
  },
};
