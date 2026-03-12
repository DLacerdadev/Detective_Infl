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

export interface CampanhaMembro {
  id: string;
  userId: string;
  papel: string;
  joinedAt: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

export interface Campanha {
  id: string;
  nome: string;
  descricao?: string | null;
  codigoConvite?: string | null;
  createdAt: string;
  updatedAt: string;
  membros: CampanhaMembro[];
}

export interface CreateCampanhaBody {
  nome: string;
  descricao?: string;
}

export const CAMPANHAS_KEY = ["campanhas"] as const;
export const campanhaKey = (id: string) => ["campanhas", id] as const;

export function useListCampanhas() {
  return useQuery<Campanha[]>({
    queryKey: CAMPANHAS_KEY,
    queryFn: () => apiFetch("/api/campanhas"),
  });
}

export function useGetCampanha(id: string) {
  return useQuery<Campanha>({
    queryKey: campanhaKey(id),
    queryFn: () => apiFetch(`/api/campanhas/${id}`),
    enabled: !!id,
  });
}

export function useCreateCampanha() {
  const qc = useQueryClient();
  return useMutation<Campanha, Error, CreateCampanhaBody>({
    mutationFn: (data) => apiFetch("/api/campanhas", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPANHAS_KEY }),
  });
}

export function useUpdateCampanha(id: string) {
  const qc = useQueryClient();
  return useMutation<Campanha, Error, Partial<CreateCampanhaBody>>({
    mutationFn: (data) => apiFetch(`/api/campanhas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPANHAS_KEY });
      qc.invalidateQueries({ queryKey: campanhaKey(id) });
    },
  });
}

export function useDeleteCampanha() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => apiFetch(`/api/campanhas/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPANHAS_KEY }),
  });
}

export function useEntrarCampanha() {
  const qc = useQueryClient();
  return useMutation<Campanha, Error, string>({
    mutationFn: (codigo) => apiFetch("/api/campanhas/entrar", { method: "POST", body: JSON.stringify({ codigo }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPANHAS_KEY }),
  });
}

export function useTransferirMestre(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (userId) =>
      apiFetch(`/api/campanhas/${campanhaId}/membros/${userId}/papel`, {
        method: "PUT",
        body: JSON.stringify({ papel: "mestre" }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPANHAS_KEY });
      qc.invalidateQueries({ queryKey: campanhaKey(campanhaId) });
    },
  });
}

export function useRemoverMembro(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (userId) =>
      apiFetch(`/api/campanhas/${campanhaId}/membros/${userId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPANHAS_KEY });
      qc.invalidateQueries({ queryKey: campanhaKey(campanhaId) });
    },
  });
}
