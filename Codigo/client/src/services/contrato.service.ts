import { API_ENDPOINTS } from '@/config/endpoints';

type DateLike = string | number[] | null | undefined;

export interface ContratoResponse {
  id: string;
  clienteId: number;
  veiculoId: number;
  pedidoId: string;
  dataInicio: string;
  dataFim: string;
  valorDiario: number;
  valorTotal: number;
  valorEntrada: number;
  valorRestante: number;
  status: string;
  scoreFinanceiro?: string | null;
  motivo?: string | null;
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

function normalizeContratoResponse(raw: any): ContratoResponse {
  return {
    id: String(raw.id),
    clienteId: Number(raw.clienteId),
    veiculoId: Number(raw.veiculoId),
    pedidoId: String(raw.pedidoId),
    dataInicio: normalizeDateLike(raw.dataInicio),
    dataFim: normalizeDateLike(raw.dataFim),
    valorDiario: Number(raw.valorDiario ?? 0),
    valorTotal: Number(raw.valorTotal ?? 0),
    valorEntrada: Number(raw.valorEntrada ?? 0),
    valorRestante: Number(raw.valorRestante ?? 0),
    status: String(raw.status ?? ""),
    scoreFinanceiro: raw.scoreFinanceiro ?? null,
    motivo: raw.motivo ?? null,
    criadoEm: normalizeDateLike(raw.criadoEm),
    atualizadoEm: normalizeDateLike(raw.atualizadoEm),
  };
}

export const contratoService = {
  async ping(): Promise<string> {
    const res = await fetch(`${API_ENDPOINTS.contratoService}/ping`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  },

  async listarTodos(): Promise<ContratoResponse[]> {
    const res = await fetch(`${API_ENDPOINTS.contratoService}/contratos`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeContratoResponse) : [];
  },
};
