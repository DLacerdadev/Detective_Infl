import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env?.VITE_API_URL ?? "";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface EmCenaPista {
  id: string;
  titulo: string;
  descricao: string;
  tipo: "pista" | "anotacao" | "local" | "pessoa" | "objeto";
  visivel: boolean;
  criadoEm: string;
}

export interface EmCenaCombatente {
  id: string;
  nome: string;
  tipo: "jogador" | "monstro" | "aliado" | "neutro";
  personagemId?: string | null;
  iniciativa: number;
  pvAtual: number;
  pvMaximo: number;
  defesa?: number | null;
  ataque?: string | null;
  notas?: string | null;
  visivelParaJogadores: boolean;
}

export interface EmCenaToken {
  id: string;
  nome: string;
  tipo: "jogador" | "monstro" | "aliado" | "neutro";
  personagemId?: string | null;
  combatenteId?: string | null;
  x: number;
  y: number;
}

export interface EmCenaState {
  id: string;
  campanhaId: string;
  ativa: boolean;
  imagemCena: string | null;
  notasMestre: string | null;
  pistas: EmCenaPista[];
  combatentes: EmCenaCombatente[];
  tokens: EmCenaToken[];
  ordemIniciativa: string[];
  turnoAtual: number;
  updatedAt: string;
}

export const emCenaKey = (campanhaId: string) => ["campanhas", campanhaId, "emcena"] as const;

export function useGetEmCena(campanhaId: string) {
  return useQuery<EmCenaState>({
    queryKey: emCenaKey(campanhaId),
    queryFn: () => apiFetch(`/api/campanhas/${campanhaId}/emcena`),
    enabled: !!campanhaId,
    refetchInterval: 5000,
  });
}

export interface UpdateEmCenaBody {
  ativa?: boolean;
  imagemCena?: string | null;
  notasMestre?: string;
}

export function useUpdateEmCena(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<EmCenaState, Error, UpdateEmCenaBody>({
    mutationFn: (data) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export function useUpdateTokens(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<EmCenaState, Error, EmCenaToken[]>({
    mutationFn: (tokens) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/tokens`, { method: "PUT", body: JSON.stringify({ tokens }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export interface CreatePistaBody {
  titulo: string;
  descricao?: string;
  tipo?: EmCenaPista["tipo"];
  visivel?: boolean;
}

export function useAddPista(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<{ pista: EmCenaPista; emCena: EmCenaState }, Error, CreatePistaBody>({
    mutationFn: (data) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/pistas`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export interface UpdatePistaBody {
  titulo?: string;
  descricao?: string;
  tipo?: EmCenaPista["tipo"];
  visivel?: boolean;
}

export function useUpdatePista(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<{ pista: EmCenaPista; emCena: EmCenaState }, Error, { pistaId: string; data: UpdatePistaBody }>({
    mutationFn: ({ pistaId, data }) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/pistas/${pistaId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export function useDeletePista(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (pistaId) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/pistas/${pistaId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export interface CreateCombatenteBody {
  nome: string;
  tipo?: EmCenaCombatente["tipo"];
  personagemId?: string | null;
  iniciativa?: number;
  pvAtual?: number;
  pvMaximo?: number;
  defesa?: number | null;
  ataque?: string | null;
  notas?: string | null;
  visivelParaJogadores?: boolean;
}

export function useAddCombatente(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<{ combatente: EmCenaCombatente; emCena: EmCenaState }, Error, CreateCombatenteBody>({
    mutationFn: (data) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/combatentes`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export interface UpdateCombatenteBody {
  nome?: string;
  tipo?: EmCenaCombatente["tipo"];
  personagemId?: string | null;
  iniciativa?: number;
  pvAtual?: number;
  pvMaximo?: number;
  defesa?: number | null;
  ataque?: string | null;
  notas?: string | null;
  visivelParaJogadores?: boolean;
}

export function useUpdateCombatente(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<{ combatente: EmCenaCombatente; emCena: EmCenaState }, Error, { combatenteId: string; data: UpdateCombatenteBody }>({
    mutationFn: ({ combatenteId, data }) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/combatentes/${combatenteId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export function useDeleteCombatente(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (combatenteId) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/combatentes/${combatenteId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}

export interface UpdateIniciativaBody {
  ordemIniciativa?: string[];
  turnoAtual?: number;
}

export function useUpdateIniciativa(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<EmCenaState, Error, UpdateIniciativaBody>({
    mutationFn: (data) =>
      apiFetch(`/api/campanhas/${campanhaId}/emcena/iniciativa`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: emCenaKey(campanhaId) }),
  });
}
