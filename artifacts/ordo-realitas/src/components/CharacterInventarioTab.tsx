import { useState, useMemo } from "react";
import { useListItens, type ItemCompendio } from "@workspace/api-client-react";
import {
  Backpack, Plus, Trash2, Search, Star, Package,
  Sword, Shield, Zap, FlaskConical, Sparkles,
  ChevronUp, ChevronDown, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useUpdateCharacterMut } from "@/hooks/use-api-mutations";
import { useToast } from "@/hooks/use-toast";

// ── types ────────────────────────────────────────────────────

export type InventarioItem = {
  uid: string;
  itemId: string;
  nome: string;
  categoria: string;
  espacos: number;
  tipo: string;
  subtipo: string | null;
};

// ── constants ────────────────────────────────────────────────

const PATENTES = [
  { nome: "Recruta",              pp: 0,   limites: { I: 2, II: 0, III: 0, IV: 0 } },
  { nome: "Operador",             pp: 20,  limites: { I: 3, II: 1, III: 0, IV: 0 } },
  { nome: "Agente Especial",      pp: 50,  limites: { I: 3, II: 2, III: 1, IV: 0 } },
  { nome: "Oficial de Operações", pp: 100, limites: { I: 3, II: 3, III: 2, IV: 1 } },
  { nome: "Agente de Elite",      pp: 200, limites: { I: 3, II: 3, III: 3, IV: 2 } },
] as const;

const PP_EVENTOS = [
  { label: "Solução do caso",         delta: +10 },
  { label: "Pista adicional",         delta: +2  },
  { label: "Morte de inocente",       delta: -2  },
  { label: "Morte de membro do grupo",delta: -5  },
] as const;

const CATEGORIA_COLOR: Record<string, string> = {
  "0":   "bg-slate-700 text-slate-200",
  "I":   "bg-emerald-900 text-emerald-300",
  "II":  "bg-amber-900 text-amber-300",
  "III": "bg-red-900 text-red-300",
  "IV":  "bg-purple-900 text-purple-300",
};

const TIPO_ICON: Record<string, React.ReactNode> = {
  ARMA:    <Sword className="h-3.5 w-3.5" />,
  PROTECAO:<Shield className="h-3.5 w-3.5" />,
  MUNICAO: <Zap className="h-3.5 w-3.5" />,
  GERAL:   <Package className="h-3.5 w-3.5" />,
};

const SUBTIPO_PARANORMAL_LABEL: Record<string, React.ReactNode> = {
  PARANORMAL: <Sparkles className="h-3 w-3 text-violet-400" />,
  MEDICAMENTO: <FlaskConical className="h-3 w-3 text-cyan-400" />,
};

function calcPatente(pp: number) {
  for (let i = PATENTES.length - 1; i >= 0; i--) {
    if (pp >= PATENTES[i].pp) return PATENTES[i];
  }
  return PATENTES[0];
}

function capacidadeCarga(forca: number): number {
  return forca <= 0 ? 2 : forca * 5;
}

function catBadge(cat: string | null) {
  if (!cat) return null;
  const cls = CATEGORIA_COLOR[cat] ?? "bg-slate-700 text-slate-200";
  return (
    <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold font-mono ${cls}`}>
      {cat}
    </span>
  );
}

// ── sub: PP tracker ──────────────────────────────────────────

function PPTracker({
  pp, isOwner, onApplyDelta,
}: { pp: number; isOwner: boolean; onApplyDelta: (d: number) => void }) {
  const patente = calcPatente(pp);
  const nextPatente = PATENTES.find((p) => p.pp > pp);
  const progress = nextPatente
    ? ((pp - patente.pp) / (nextPatente.pp - patente.pp)) * 100
    : 100;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="text-slate-300 font-semibold text-sm">Pontos de Prestígio</span>
        </div>
        <span className="font-mono font-bold text-amber-300 text-lg">{pp} PP</span>
      </div>

      {/* patente badge */}
      <div className="flex items-center gap-2">
        <Badge className="bg-amber-900/60 text-amber-300 border-amber-700/50 font-semibold">
          {patente.nome}
        </Badge>
        {nextPatente && (
          <span className="text-slate-500 text-xs">
            próxima: {nextPatente.nome} em {nextPatente.pp - pp} PP
          </span>
        )}
      </div>

      {/* progress to next patente */}
      {nextPatente && (
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <span>{patente.pp}</span>
            <span>{nextPatente.pp}</span>
          </div>
        </div>
      )}

      {/* quick event buttons */}
      {isOwner && (
        <div className="pt-1 space-y-1">
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Registrar evento</p>
          <div className="flex flex-wrap gap-1.5">
            {PP_EVENTOS.map((ev) => (
              <button
                key={ev.label}
                onClick={() => onApplyDelta(ev.delta)}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors
                  ${ev.delta > 0
                    ? "border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/30"
                    : "border-red-800/50 text-red-400 hover:bg-red-900/30"
                  }
                `}
              >
                {ev.delta > 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {ev.delta > 0 ? "+" : ""}{ev.delta} {ev.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── sub: capacity + limits ───────────────────────────────────

function CargaLimites({
  forca, inventario, patente,
}: { forca: number; inventario: InventarioItem[]; patente: ReturnType<typeof calcPatente> }) {
  const safeInv = Array.isArray(inventario) ? inventario : [];
  const capacidade = capacidadeCarga(forca);
  const usados = safeInv.reduce((s, i) => s + (i.espacos ?? 1), 0);
  const pct = Math.min(100, (usados / capacidade) * 100);
  const sobrecarregado = usados > capacidade;
  const limite_abs = capacidade * 2;

  const usadosPorCat = { I: 0, II: 0, III: 0, IV: 0 };
  for (const item of safeInv) {
    const cat = item.categoria as keyof typeof usadosPorCat;
    if (cat in usadosPorCat) usadosPorCat[cat]++;
  }

  const CATS = ["I", "II", "III", "IV"] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* carrying capacity */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Backpack className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 font-semibold text-sm">Capacidade de Carga</span>
          </div>
          <span className={`font-mono font-bold text-sm ${sobrecarregado ? "text-red-400" : "text-slate-200"}`}>
            {usados}/{capacidade}
            {usados > limite_abs && <span className="text-red-500 ml-1">!!!</span>}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {sobrecarregado && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <AlertTriangle className="h-3 w-3" />
            Sobrecarregado: –5 Defesa e perícias, –3m deslocamento
          </div>
        )}
        <p className="text-xs text-slate-600">Força {forca} × 5 = {capacidade} espaços</p>
      </div>

      {/* item limits by category */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-slate-400" />
          <span className="text-slate-300 font-semibold text-sm">Limite de Itens</span>
        </div>
        <div className="space-y-1.5">
          {CATS.map((cat) => {
            const permitido = patente.limites[cat];
            const usado = usadosPorCat[cat];
            const over = usado > permitido;
            return (
              <div key={cat} className="flex items-center gap-2">
                {catBadge(cat)}
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-500" : "bg-slate-500"}`}
                    style={{ width: permitido === 0 ? "0%" : `${Math.min(100, (usado / permitido) * 100)}%` }}
                  />
                </div>
                <span className={`font-mono text-xs ${over ? "text-red-400" : "text-slate-400"}`}>
                  {usado}/{permitido}
                </span>
              </div>
            );
          })}
          <p className="text-xs text-slate-600 pt-0.5">Categoria 0: ilimitado</p>
        </div>
      </div>
    </div>
  );
}

// ── sub: add item dialog ─────────────────────────────────────

const CAT_ORDER: Record<string, number> = { "0": 0, "I": 1, "II": 2, "III": 3, "IV": 4 };

type SectionKey =
  | "arma_corpo_leve"
  | "arma_corpo_uma_mao"
  | "arma_corpo_duas_maos"
  | "arma_arremesso"
  | "arma_disparo"
  | "arma_fogo_leve"
  | "arma_fogo_uma_mao"
  | "arma_fogo_duas_maos"
  | "arma_pesada"
  | "municao"
  | "protecao"
  | "geral_acessorio"
  | "geral_explosivo"
  | "geral_operacional"
  | "geral_medicamento"
  | "geral_paranormal"
  | "geral_outro";

const SECTION_META: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "arma_corpo_leve",      label: "Corpo a Corpo · Leve",        icon: <Sword className="h-3.5 w-3.5" /> },
  { key: "arma_corpo_uma_mao",   label: "Corpo a Corpo · Uma Mão",     icon: <Sword className="h-3.5 w-3.5" /> },
  { key: "arma_corpo_duas_maos", label: "Corpo a Corpo · Duas Mãos",   icon: <Sword className="h-3.5 w-3.5" /> },
  { key: "arma_arremesso",       label: "Arremesso",                   icon: <Sword className="h-3.5 w-3.5" /> },
  { key: "arma_disparo",         label: "Disparo",                     icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "arma_fogo_leve",       label: "Fogo · Leve",                 icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "arma_fogo_uma_mao",    label: "Fogo · Uma Mão",              icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "arma_fogo_duas_maos",  label: "Fogo · Duas Mãos",            icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "arma_pesada",          label: "Arma Pesada",                 icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "municao",              label: "Munições",                    icon: <Package className="h-3.5 w-3.5" /> },
  { key: "protecao",             label: "Proteções",                   icon: <Shield className="h-3.5 w-3.5" /> },
  { key: "geral_acessorio",      label: "Gerais · Acessório",          icon: <Package className="h-3.5 w-3.5" /> },
  { key: "geral_explosivo",      label: "Gerais · Explosivo",          icon: <Package className="h-3.5 w-3.5" /> },
  { key: "geral_operacional",    label: "Gerais · Operacional",        icon: <Package className="h-3.5 w-3.5" /> },
  { key: "geral_medicamento",    label: "Gerais · Medicamento",        icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { key: "geral_paranormal",     label: "Gerais · Paranormal",         icon: <Sparkles className="h-3.5 w-3.5" /> },
  { key: "geral_outro",          label: "Gerais",                      icon: <Package className="h-3.5 w-3.5" /> },
];

function classifySection(item: ItemCompendio): SectionKey {
  const t = item.tipo;
  const s = item.subtipo ?? "";
  if (t === "ARMA") {
    if (s === "CORPO_LEVE")      return "arma_corpo_leve";
    if (s === "CORPO_UMA_MAO")   return "arma_corpo_uma_mao";
    if (s === "CORPO_DUAS_MAOS") return "arma_corpo_duas_maos";
    if (s === "ARREMESSO")       return "arma_arremesso";
    if (s === "DISPARO_DUAS_MAOS") return "arma_disparo";
    if (s === "FOGO_LEVE")       return "arma_fogo_leve";
    if (s === "FOGO_UMA_MAO")    return "arma_fogo_uma_mao";
    if (s === "FOGO_DUAS_MAOS")  return "arma_fogo_duas_maos";
    if (s === "PESADA")          return "arma_pesada";
    return "arma_corpo_uma_mao";
  }
  if (t === "MUNICAO")  return "municao";
  if (t === "PROTECAO") return "protecao";
  if (t === "GERAL") {
    if (s === "ACESSORIO")   return "geral_acessorio";
    if (s === "EXPLOSIVO")   return "geral_explosivo";
    if (s === "OPERACIONAL") return "geral_operacional";
    if (s === "MEDICAMENTO") return "geral_medicamento";
    if (s === "PARANORMAL")  return "geral_paranormal";
    return "geral_outro";
  }
  return "geral_outro";
}

type BlockReason = "patente" | "limite" | null;

function checkBlocked(
  item: ItemCompendio,
  patenteLimites: Record<string, number>,
  usadosPorCat: Record<string, number>,
): BlockReason {
  const cat = item.categoria ?? "0";
  if (cat === "0") return null;
  const limite = patenteLimites[cat] ?? 0;
  if (limite === 0) return "patente";
  const usado = usadosPorCat[cat] ?? 0;
  if (usado >= limite) return "limite";
  return null;
}

function ItemRow({ item, onAdd, onClose, setSearch, blocked }: {
  item: ItemCompendio;
  onAdd: (i: ItemCompendio) => void;
  onClose: () => void;
  setSearch: (s: string) => void;
  blocked: BlockReason;
}) {
  const isBlocked = blocked !== null;

  return (
    <div className="relative group/row">
      <button
        disabled={isBlocked}
        onClick={() => { if (!isBlocked) { onAdd(item); onClose(); setSearch(""); } }}
        className={`
          w-full text-left flex items-center gap-2 px-3 py-1.5 rounded transition-colors
          ${isBlocked
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-slate-800/80 cursor-pointer"
          }
        `}
      >
        {catBadge(item.categoria)}
        <span className={`flex-1 text-sm ${isBlocked ? "text-slate-500" : "text-slate-200"}`}>{item.nome}</span>
        <span className="text-xs text-slate-600 font-mono shrink-0">{(item.espacos ?? 1) === 0 ? "—" : `${item.espacos ?? 1}esp`}</span>
        {item.fonte === "SOBREVIVENDO_AO_HORROR" && (
          <span className="text-xs text-amber-400/60 font-mono shrink-0">SaH</span>
        )}
        {isBlocked ? (
          <AlertTriangle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
        ) : (
          <Plus className="h-3.5 w-3.5 text-slate-600 group-hover/row:text-emerald-400 transition-colors shrink-0" />
        )}
      </button>
      {isBlocked && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden group-hover/row:flex items-center z-10">
          <span className="bg-slate-950 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {blocked === "patente"
              ? "Patente insuficiente para esta categoria"
              : "Limite de itens desta categoria atingido"
            }
          </span>
        </div>
      )}
    </div>
  );
}

function AddItemDialog({
  open, onClose, onAdd, inventario, patenteLimites,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: ItemCompendio) => void;
  inventario: InventarioItem[];
  patenteLimites: Record<string, number>;
}) {
  const { data: itens } = useListItens();
  const [search, setSearch] = useState("");

  const searching = search.trim().length > 0;

  const usadosPorCat = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of (Array.isArray(inventario) ? inventario : [])) {
      const cat = item.categoria ?? "0";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [inventario]);

  const flatFiltered = useMemo(() => {
    if (!itens || !searching) return [];
    const q = search.toLowerCase().trim();
    return itens.filter((i) => i.nome.toLowerCase().includes(q));
  }, [itens, search, searching]);

  const grouped = useMemo(() => {
    if (!itens) return new Map<SectionKey, ItemCompendio[]>();
    const map = new Map<SectionKey, ItemCompendio[]>();
    for (const item of itens) {
      const key = classifySection(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => {
        const ca = CAT_ORDER[a.categoria ?? "0"] ?? 0;
        const cb = CAT_ORDER[b.categoria ?? "0"] ?? 0;
        return ca !== cb ? ca - cb : a.nome.localeCompare(b.nome, "pt-BR");
      });
    }
    return map;
  }, [itens]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="font-display text-slate-100">Adicionar Item ao Inventário</DialogTitle>
        </DialogHeader>

        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            autoFocus
            placeholder="Buscar item por nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {searching ? (
            /* ── flat search results ── */
            <div className="space-y-0.5 py-1">
              {flatFiltered.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onAdd={onAdd}
                  onClose={onClose}
                  setSearch={setSearch}
                  blocked={checkBlocked(item, patenteLimites, usadosPorCat)}
                />
              ))}
              {flatFiltered.length === 0 && (
                <p className="text-center py-8 text-slate-500 text-sm">Nenhum item encontrado.</p>
              )}
            </div>
          ) : (
            /* ── grouped sections ── */
            <div className="space-y-3 py-1">
              {SECTION_META.map((sec) => {
                const items = grouped.get(sec.key);
                if (!items || items.length === 0) return null;
                return (
                  <div key={sec.key}>
                    <div className="flex items-center gap-1.5 px-1 py-1 mb-0.5">
                      <span className="text-slate-500">{sec.icon}</span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                        {sec.label}
                      </span>
                      <div className="flex-1 h-px bg-slate-800 ml-1" />
                    </div>
                    <div className="space-y-0.5">
                      {items.map((item) => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          onAdd={onAdd}
                          onClose={onClose}
                          setSearch={setSearch}
                          blocked={checkBlocked(item, patenteLimites, usadosPorCat)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── main component ───────────────────────────────────────────

interface CharacterInventarioTabProps {
  charId: string;
  forca: number;
  pontosPrestígio: number;
  inventario: InventarioItem[];
  isOwner: boolean;
}

export default function CharacterInventarioTab({
  charId, forca, pontosPrestígio, inventario: inventarioRaw, isOwner,
}: CharacterInventarioTabProps) {
  const inventario = Array.isArray(inventarioRaw) ? inventarioRaw : [];
  const [addOpen, setAddOpen] = useState(false);
  const updateMut = useUpdateCharacterMut(charId);
  const { toast } = useToast();

  const patente = calcPatente(pontosPrestígio);

  function pushUpdate(patch: Record<string, unknown>) {
    updateMut.mutate({ id: charId, data: patch as any }, {
      onError: () => toast({ title: "Erro ao salvar", variant: "destructive" }),
    });
  }

  function handlePPDelta(delta: number) {
    const novosPP = Math.max(0, pontosPrestígio + delta);
    pushUpdate({ pontosPrestígio: novosPP });
  }

  function handleAddItem(item: ItemCompendio) {
    const slot: InventarioItem = {
      uid: crypto.randomUUID(),
      itemId: item.id,
      nome: item.nome,
      categoria: item.categoria ?? "0",
      espacos: item.espacos ?? 1,
      tipo: item.tipo,
      subtipo: item.subtipo ?? null,
    };
    pushUpdate({ inventario: [...inventario, slot] });
  }

  function handleRemoveItem(uid: string) {
    pushUpdate({ inventario: inventario.filter((i) => i.uid !== uid) });
  }

  const SUBTIPO_LABEL: Record<string, string> = {
    CORPO_LEVE: "Corpo Leve", CORPO_UMA_MAO: "Uma Mão", CORPO_DUAS_MAOS: "Duas Mãos",
    DISPARO_DUAS_MAOS: "Disparo", FOGO_LEVE: "Fogo Leve", FOGO_UMA_MAO: "Fogo Uma Mão",
    FOGO_DUAS_MAOS: "Fogo Duas Mãos", PESADA: "Pesada", ARREMESSO: "Arremesso",
    ACESSORIO: "Acessório", EXPLOSIVO: "Explosivo", OPERACIONAL: "Operacional",
    MEDICAMENTO: "Medicamento", PARANORMAL: "Paranormal",
  };

  return (
    <div className="space-y-4">
      {/* PP tracker */}
      <PPTracker
        pp={pontosPrestígio}
        isOwner={isOwner}
        onApplyDelta={handlePPDelta}
      />

      {/* capacity + limits */}
      <CargaLimites forca={forca} inventario={inventario} patente={patente} />

      {/* inventory list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider font-mono">
            Inventário · {inventario.length} {inventario.length === 1 ? "item" : "itens"}
          </h3>
          {isOwner && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddOpen(true)}
              className="h-7 gap-1 border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar
            </Button>
          )}
        </div>

        {inventario.length === 0 ? (
          <div className="border border-dashed border-slate-700/50 rounded-lg p-8 text-center">
            <Backpack className="h-8 w-8 text-slate-700 mx-auto mb-2" />
            <p className="text-slate-600 text-sm">Inventário vazio.</p>
            {isOwner && (
              <button
                onClick={() => setAddOpen(true)}
                className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                Adicionar primeiro item
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {inventario.map((item) => (
              <div
                key={item.uid}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 border border-slate-700/40 rounded-lg hover:border-slate-600/60 transition-colors group"
              >
                <span className="text-slate-500 shrink-0">
                  {TIPO_ICON[item.tipo] ?? <Package className="h-3.5 w-3.5" />}
                </span>
                {catBadge(item.categoria)}
                <span className="flex-1 text-slate-200 text-sm">{item.nome}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.subtipo && SUBTIPO_PARANORMAL_LABEL[item.subtipo]}
                  {item.subtipo && !SUBTIPO_PARANORMAL_LABEL[item.subtipo] && (
                    <span className="hidden sm:inline text-xs text-slate-500">
                      {SUBTIPO_LABEL[item.subtipo] ?? item.subtipo}
                    </span>
                  )}
                  <span className="text-xs text-slate-600 font-mono">
                    {item.espacos === 0 ? "—" : `${item.espacos}esp`}
                  </span>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleRemoveItem(item.uid)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 ml-1"
                    title="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* add item dialog */}
      <AddItemDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddItem}
        inventario={inventario}
        patenteLimites={patente.limites}
      />
    </div>
  );
}
