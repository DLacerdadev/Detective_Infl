import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env?.VITE_API_URL ?? "";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
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

export function useListHabilidades() {
  return useQuery<HabilidadeCompendio[]>({
    queryKey: ["habilidades"],
    queryFn: () => apiFetch<HabilidadeCompendio[]>("/api/habilidades"),
    staleTime: 1000 * 60 * 10,
  });
}
