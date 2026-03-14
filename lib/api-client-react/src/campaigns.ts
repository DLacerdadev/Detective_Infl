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

export interface CampanhaRolagem {
  id: string;
  campanhaId: string;
  userId: string;
  rolandoComo: string | null;
  label: string | null;
  tipo: string;
  atributo: string | null;
  qtdDadosBase: number;
  bonusPericia: number;
  modificadoresO: number;
  expressaoDano: string | null;
  dadosRolados: number[];
  resultadoBase: number;
  resultadoFinal: number;
  sucessoAutomatico: boolean;
  modoPenalidade: boolean;
  createdAt: string;
  userFirstName: string | null;
  userEmail: string;
}

export interface RolarPericiaBody {
  tipo: "pericia";
  rolandoComo?: string;
  label?: string;
  atributo?: string;
  qtdDadosBase: number;
  bonusPericia: number;
  modificadoresO: number;
}

export interface RolarDanoBody {
  tipo: "dano";
  rolandoComo?: string;
  label?: string;
  expressaoDano: string;
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

export interface PreparacaoData {
  rituais?: string[];
  itens?: string[];
  pronto?: boolean;
}

export interface CampanhaPersonagemEntry {
  id: string;
  campanhaId: string;
  personagemId: string;
  userId: string;
  addedAt: string;
  preparacao: PreparacaoData | null;
  personagemNome: string;
  personagemNex: number;
  personagemNivel: number;
  personagemPatente: string | null;
  personagemForca: number;
  personagemAgilidade: number;
  personagemIntelecto: number;
  personagemVigor: number;
  personagemPresenca: number;
  personagemDefesa: number;
  personagemPvAtual: number | null;
  personagemPvMaximo: number | null;
  personagemPeAtual: number | null;
  personagemPeMaximo: number | null;
  personagemSanAtual: number | null;
  personagemSanMaximo: number | null;
  personagemPericias: string[] | null;
  personagemRituals: string[] | null;
  classeNome: string | null;
  classeId: string | null;
  userFirstName: string | null;
  userEmail: string;
}

export const personagensKey = (campanhaId: string) => ["campanhas", campanhaId, "personagens"] as const;

export function useListCampanhaPersonagens(campanhaId: string) {
  return useQuery<CampanhaPersonagemEntry[]>({
    queryKey: personagensKey(campanhaId),
    queryFn: () => apiFetch(`/api/campanhas/${campanhaId}/personagens`),
    enabled: !!campanhaId,
  });
}

export function useAdicionarPersonagem(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<CampanhaPersonagemEntry, Error, string>({
    mutationFn: (personagemId) =>
      apiFetch(`/api/campanhas/${campanhaId}/personagens`, { method: "POST", body: JSON.stringify({ personagemId }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: personagensKey(campanhaId) }),
  });
}

export function useRemoverPersonagemDaCampanha(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (personagemId) =>
      apiFetch(`/api/campanhas/${campanhaId}/personagens/${personagemId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: personagensKey(campanhaId) }),
  });
}

export function useUpdatePreparacao(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<PreparacaoData, Error, { personagemId: string; data: Partial<PreparacaoData> }>({
    mutationFn: ({ personagemId, data }) =>
      apiFetch(`/api/campanhas/${campanhaId}/personagens/${personagemId}/preparacao`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: personagensKey(campanhaId) }),
  });
}

export interface CharacterCampanha {
  id: string;
  nome: string;
  meuPapel: string;
}

export const characterCampanhasKey = (charId: string) => ["characters", charId, "campanhas"] as const;

export function useCharacterCampanhas(charId: string) {
  return useQuery<CharacterCampanha[]>({
    queryKey: characterCampanhasKey(charId),
    queryFn: () => apiFetch(`/api/characters/${charId}/campanhas`),
    enabled: !!charId,
  });
}

export function useRolarEmCampanha() {
  const qc = useQueryClient();
  return useMutation<CampanhaRolagem, Error, { campanhaId: string } & (RolarPericiaBody | RolarDanoBody)>({
    mutationFn: ({ campanhaId, ...body }) =>
      apiFetch(`/api/campanhas/${campanhaId}/rolagens`, { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (data) => qc.invalidateQueries({ queryKey: rolagensKey(data.campanhaId) }),
  });
}

export const rolagensKey = (campanhaId: string) => ["campanhas", campanhaId, "rolagens"] as const;

export function useListRolagens(campanhaId: string) {
  return useQuery<CampanhaRolagem[]>({
    queryKey: rolagensKey(campanhaId),
    queryFn: () => apiFetch(`/api/campanhas/${campanhaId}/rolagens`),
    enabled: !!campanhaId,
    refetchInterval: 5000,
  });
}

export function useRolar(campanhaId: string) {
  const qc = useQueryClient();
  return useMutation<CampanhaRolagem, Error, RolarPericiaBody | RolarDanoBody>({
    mutationFn: (data) =>
      apiFetch(`/api/campanhas/${campanhaId}/rolagens`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rolagensKey(campanhaId) });
    },
  });
}
