import { useQuery, useMutation } from "@tanstack/react-query";

const BASE = import.meta.env?.VITE_API_URL ?? "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface HabilidadeCompendio {
  id: string;
  nome: string;
  categoria: string;
  classe: string;
  descricao: string | null;
  fonte: string;
  alterada: boolean;
  nex: number | null;
}

export function getListHabilidadesQueryKey() {
  return ["habilidades"] as const;
}

export function useListHabilidades() {
  return useQuery<HabilidadeCompendio[]>({
    queryKey: getListHabilidadesQueryKey(),
    queryFn: () => apiFetch<HabilidadeCompendio[]>("/api/habilidades"),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateHabilidade() {
  return useMutation({
    mutationFn: (data: Omit<HabilidadeCompendio, "id" | "alterada">) =>
      apiFetch<HabilidadeCompendio>("/api/habilidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
}

export function useUpdateHabilidade() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<HabilidadeCompendio, "id" | "alterada">> }) =>
      apiFetch<HabilidadeCompendio>(`/api/habilidades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
}

export function useDeleteHabilidade() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiFetch<void>(`/api/habilidades/${id}`, { method: "DELETE" }),
  });
}

// ── Trilhas mutations ──────────────────────────────────────────────────────

export interface TrilhaProgressao {
  nex: string;
  nome: string;
  descricao: string;
}

export interface TrilhaAdmin {
  id: string;
  classeId: string;
  classeNome: string;
  nome: string;
  fonte: string;
  habilidades: TrilhaProgressao[];
  createdAt: string;
}

export function getListTrilhasAdminQueryKey() {
  return ["listTrilhas"] as const;
}

export function useCreateTrilha() {
  return useMutation({
    mutationFn: (data: { classeId: string; nome: string; fonte: string; habilidades: TrilhaProgressao[] }) =>
      apiFetch<TrilhaAdmin>("/api/trilhas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
}

export function useUpdateTrilha() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { classeId: string; nome: string; fonte: string; habilidades: TrilhaProgressao[] } }) =>
      apiFetch<TrilhaAdmin>(`/api/trilhas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });
}

export function useDeleteTrilha() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      apiFetch<void>(`/api/trilhas/${id}`, { method: "DELETE" }),
  });
}

// ── Itens ──────────────────────────────────────────────────────────────────

export interface ItemCompendio {
  id: string;
  nome: string;
  tipo: string;
  subtipo: string | null;
  proficiencia: string | null;
  descricao: string | null;
  espacos: number | null;
  categoria: string | null;
  dano: string | null;
  critico: string | null;
  alcance: string | null;
  tipoAtaque: string | null;
  defesa: number | null;
  propriedades: string[];
  fonte: string;
}

export type ItensFilter = {
  tipo?: string;
  subtipo?: string;
  proficiencia?: string;
  fonte?: string;
};

export function getListItensQueryKey(filter?: ItensFilter) {
  return ["itens", filter ?? {}] as const;
}

export function useListItens(filter?: ItensFilter) {
  const params = new URLSearchParams();
  if (filter?.tipo)         params.set("tipo", filter.tipo);
  if (filter?.subtipo)      params.set("subtipo", filter.subtipo);
  if (filter?.proficiencia) params.set("proficiencia", filter.proficiencia);
  if (filter?.fonte)        params.set("fonte", filter.fonte);
  const qs = params.toString();
  return useQuery<ItemCompendio[]>({
    queryKey: getListItensQueryKey(filter),
    queryFn: () => apiFetch<ItemCompendio[]>(`/api/items${qs ? `?${qs}` : ""}`),
    staleTime: 1000 * 60 * 10,
  });
}
