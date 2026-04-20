import { API_ENDPOINTS } from '@/config/endpoints';

function getAccessToken(): string | null {
  if (typeof document !== "undefined") {
    const cookie = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("carflow_token="));
    if (cookie) {
      const token = cookie.slice("carflow_token=".length);
      if (token) return decodeURIComponent(token);
    }
  }

  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }

  return null;
}

function withAuthHeaders(base: HeadersInit = {}): HeadersInit {
  const token = getAccessToken();
  if (!token) return base;
  return {
    ...base,
    Authorization: `Bearer ${token}`,
  };
}

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

export interface BancoFinanciamentoHistorico {
  pedidoId: string;
  decisao: "APROVADO" | "REPROVADO";
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
      headers: withAuthHeaders({ "Content-Type": "application/json" }),
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
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao submeter pedido");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  buscarPorId: async (id: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${id}`, {
      cache: "no-store",
      headers: withAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Pedido ${id} não encontrado`);
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  listarMeus: async (clienteId: string): Promise<PedidoResponse[]> => {
    const response = await fetch(`${BASE}/pedidos/meus?clienteId=${encodeURIComponent(clienteId)}`, {
      cache: "no-store",
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Erro ao buscar pedidos do cliente (HTTP ${response.status})`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizePedidoResponse) : [];
  },

  atualizar: async (pedidoId: string, payload: UpdatePedidoPayload): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: withAuthHeaders({ "Content-Type": "application/json" }),
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
      headers: withAuthHeaders(),
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
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao excluir rascunho");
    }
  },

  listarDisponiveisBanco: async (): Promise<PedidoResponse[]> => {
    const response = await fetch(`${BASE}/pedidos/banco/disponiveis`, {
      cache: "no-store",
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Erro ao buscar pedidos disponiveis para banco (HTTP ${response.status})`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizePedidoResponse) : [];
  },

  listarPendentesLocador: async (locadorId: string): Promise<PedidoResponse[]> => {
    const response = await fetch(
      `${BASE}/pedidos/agente/pendentes?locadorId=${encodeURIComponent(locadorId)}`,
      {
        cache: "no-store",
        headers: withAuthHeaders(),
      }
    );
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Erro ao buscar pedidos pendentes do locador (HTTP ${response.status})`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizePedidoResponse) : [];
  },

  aprovarLocador: async (pedidoId: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}/aprovar`, {
      method: "PATCH",
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao aprovar pedido do locador");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  reprovarLocador: async (pedidoId: string): Promise<PedidoResponse> => {
    const response = await fetch(`${BASE}/pedidos/${pedidoId}/reprovar`, {
      method: "PATCH",
      headers: withAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao reprovar pedido do locador");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  aprovarFinanciamento: async (pedidoId: string, bancoId: string): Promise<PedidoResponse> => {
    const response = await fetch(
      `${BASE}/pedidos/${pedidoId}/financiamento/aprovar?bancoId=${encodeURIComponent(bancoId)}`,
      {
        method: "PATCH",
        headers: withAuthHeaders(),
      }
    );
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao aprovar financiamento");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },

  reprovarFinanciamento: async (pedidoId: string, bancoId: string): Promise<PedidoResponse> => {
    const response = await fetch(
      `${BASE}/pedidos/${pedidoId}/financiamento/reprovar?bancoId=${encodeURIComponent(bancoId)}`,
      {
        method: "PATCH",
        headers: withAuthHeaders(),
      }
    );
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Erro ao reprovar financiamento");
    }
    const data = await response.json();
    return normalizePedidoResponse(data);
  },
};
