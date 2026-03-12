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
