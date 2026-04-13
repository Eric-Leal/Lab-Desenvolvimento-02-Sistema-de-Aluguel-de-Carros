import { API_ENDPOINTS } from '@/config/endpoints';

type DateLike = string | number[] | null | undefined;

export interface CreatePedidoPayload {
  clienteId: string;
  automovelMatricula: number;
  dataInicio: string; // YYYY-MM-DD
  dataFim: string;    // YYYY-MM-DD
  valorTotal: number;
}

export interface UpdatePedidoPayload {
  dataInicio?: string;
  dataFim?: string;
  valorTotal?: number;
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

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function normalizeDateLike(value: DateLike): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value) || value.length < 3) return "";

  const [year, month, day, hour = 0, minute = 0, second = 0] = value;
  if (value.length >= 6) {
    return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }
  return `${year}-${pad(month)}-${pad(day)}`;
}

function normalizePedidoResponse(raw: any): PedidoResponse {
  return {
    id: String(raw.id),
    clienteId: String(raw.clienteId),
    automovelMatricula: Number(raw.automovelMatricula),
    dataInicio: normalizeDateLike(raw.dataInicio),
    dataFim: normalizeDateLike(raw.dataFim),
    valorTotal: Number(raw.valorTotal),
    requerFinanciamento: Boolean(raw.requerFinanciamento),
    bancoId: raw.bancoId ? String(raw.bancoId) : null,
    statusLocador: String(raw.statusLocador),
    statusGeral: String(raw.statusGeral),
    criadoEm: normalizeDateLike(raw.criadoEm),
    atualizadoEm: normalizeDateLike(raw.atualizadoEm),
  };
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
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  submeter: async (pedidoId: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}/submeter`, {
      method: "PATCH",
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao submeter pedido");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  buscarPorId: async (id: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Pedido ${id} não encontrado`);
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  listarMeus: async (clienteId: string): Promise<PedidoResponse[]> => {
    const response = await fetch(`${BASE}/pedidos/meus?clienteId=${encodeURIComponent(clienteId)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Erro ao buscar pedidos do cliente");
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizePedidoResponse) : [];
  },

  atualizar: async (pedidoId: string, payload: UpdatePedidoPayload): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao atualizar pedido");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  cancelar: async (pedidoId: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}/cancelar`, {
      method: "PATCH",
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao cancelar pedido");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  excluirRascunho: async (pedidoId: string): Promise<void> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao excluir rascunho");
    }
  },
};
