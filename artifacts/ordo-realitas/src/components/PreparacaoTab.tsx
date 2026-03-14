import { useState, useMemo, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useListCampanhaPersonagens,
  useUpdatePreparacao,
  useListRituals,
  useListItens,
  type CampanhaPersonagemEntry,
  type PreparacaoData,
} from "@workspace/api-client-react";
import type { Ritual, ItemCompendio } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Shield, ScrollText, Package, Search,
  Check, X, Loader2, ChevronDown, ChevronRight, Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ELEM_COLORS: Record<string, string> = {
  Sangue: "border-red-500/50 text-red-400 bg-red-500/10",
  Morte: "border-stone-600/50 text-stone-500 bg-stone-900/30",
  Conhecimento: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  Energia: "border-purple-500/50 text-purple-400 bg-purple-500/10",
  Medo: "border-slate-400/50 text-slate-300 bg-slate-500/10",
  "Variável": "border-violet-500/50 text-violet-400 bg-violet-500/10",
};

function ownerName(entry: CampanhaPersonagemEntry): string {
  return entry.userFirstName ?? entry.userEmail.split("@")[0];
}

function RitualPickerDialog({
  open,
  onClose,
  allRituals,
  knownRitualIds,
  selectedIds,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  allRituals: Ritual[];
  knownRitualIds: string[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const knownRituals = useMemo(
    () => allRituals.filter((r) => knownRitualIds.includes(r.id)),
    [allRituals, knownRitualIds],
  );
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return knownRituals;
    return knownRituals.filter(
      (r) => r.nome.toLowerCase().includes(q) || r.elemento.toLowerCase().includes(q),
    );
  }, [knownRituals, search]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">SELECIONAR RITUAIS</DialogTitle>
        </DialogHeader>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ritual..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/30 border-border font-mono text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {filtered.length === 0 ? (
            <p className="text-sm font-mono text-muted-foreground text-center py-6">
              {knownRituals.length === 0 ? "Este agente não conhece rituais." : "Nenhum ritual encontrado."}
            </p>
          ) : (
            filtered.map((r) => {
              const active = selectedIds.has(r.id);
              const elemCls = ELEM_COLORS[r.elemento] ?? ELEM_COLORS["Variável"];
              return (
                <button
                  key={r.id}
                  onClick={() => onToggle(r.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all text-left ${
                    active
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/40 bg-secondary/20 hover:bg-secondary/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border/60"
                  }`}>
                    {active && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-mono text-foreground">{r.nome}</span>
                    <div className="flex gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-1 py-0.5 border rounded-sm ${elemCls}`}>
                        {r.elemento}
                      </span>
                      {r.custoPe != null && (
                        <span className="text-[9px] font-mono text-muted-foreground">{r.custoPe} PE</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="flex justify-end pt-2 border-t border-border/40">
          <Button size="sm" onClick={onClose} className="font-display tracking-widest text-xs">
            CONFIRMAR ({selectedIds.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  ARMA: "Armas",
  PROTECAO: "Proteções",
  GERAL: "Gerais",
  MUNICAO: "Munições",
};
const ITEM_TYPE_KEYS = ["ARMA", "PROTECAO", "GERAL", "MUNICAO"] as const;

function ItemPickerDialog({
  open,
  onClose,
  allItems,
  selectedIds,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  allItems: ItemCompendio[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const filtered = useMemo(() => {
    let items = allItems;
    if (typeFilter) items = items.filter((i) => i.tipo === typeFilter);
    const q = search.toLowerCase().trim();
    if (q) items = items.filter(
      (i) => i.nome.toLowerCase().includes(q) || (i.descricao ?? "").toLowerCase().includes(q),
    );
    return items;
  }, [allItems, search, typeFilter]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">SELECIONAR ITENS</DialogTitle>
        </DialogHeader>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar item por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/30 border-border font-mono text-sm"
          />
        </div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <button
            onClick={() => setTypeFilter(null)}
            className={`text-[10px] font-display tracking-widest px-2 py-1 rounded-sm border transition-colors ${
              typeFilter === null
                ? "border-primary bg-primary/20 text-primary"
                : "border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            TODOS
          </button>
          {ITEM_TYPE_KEYS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t === typeFilter ? null : t)}
              className={`text-[10px] font-display tracking-widest px-2 py-1 rounded-sm border transition-colors ${
                typeFilter === t
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {ITEM_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
          {filtered.length === 0 ? (
            <p className="text-sm font-mono text-muted-foreground text-center py-6">Nenhum item encontrado.</p>
          ) : (
            filtered.map((item) => {
              const active = selectedIds.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all text-left ${
                    active
                      ? "border-primary/60 bg-primary/10"
                      : "border-border/40 bg-secondary/20 hover:bg-secondary/40"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border/60"
                  }`}>
                    {active && <Check className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-foreground">{item.nome}</span>
                      <span className="text-[9px] font-mono text-muted-foreground/60">
                        {ITEM_TYPE_LABELS[item.tipo] ?? item.tipo}
                      </span>
                    </div>
                    {item.categoria && (
                      <span className="text-[9px] font-mono text-muted-foreground">Cat. {item.categoria}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="flex justify-end pt-2 border-t border-border/40">
          <Button size="sm" onClick={onClose} className="font-display tracking-widest text-xs">
            CONFIRMAR ({selectedIds.size})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AgentPrepCard({
  entry,
  canEdit,
  campanhaId,
  allRituals,
  allItems,
}: {
  entry: CampanhaPersonagemEntry;
  canEdit: boolean;
  campanhaId: string;
  allRituals: Ritual[];
  allItems: ItemCompendio[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [ritualPickerOpen, setRitualPickerOpen] = useState(false);
  const [itemPickerOpen, setItemPickerOpen] = useState(false);
  const updateMut = useUpdatePreparacao(campanhaId);
  const { toast } = useToast();

  const serverPrep: PreparacaoData = entry.preparacao ?? {};
  const [localRituais, setLocalRituais] = useState<string[] | null>(null);
  const [localItens, setLocalItens] = useState<string[] | null>(null);
  const [localPronto, setLocalPronto] = useState<boolean | null>(null);

  const rituaisRef = useRef<string[]>(serverPrep.rituais ?? []);
  const itensRef = useRef<string[]>(serverPrep.itens ?? []);

  const effectiveRituais = localRituais ?? serverPrep.rituais ?? [];
  const effectiveItens = localItens ?? serverPrep.itens ?? [];
  const isReady = localPronto ?? serverPrep.pronto ?? false;

  rituaisRef.current = effectiveRituais;
  itensRef.current = effectiveItens;

  const selectedRitualIds = useMemo(() => new Set(effectiveRituais), [effectiveRituais]);
  const selectedItemIds = useMemo(() => new Set(effectiveItens), [effectiveItens]);

  const knownRitualIds = entry.personagemRituals ?? [];
  const isOcultista = entry.classeNome?.toLowerCase().includes("ocultista");

  const prepRituals = useMemo(
    () => allRituals.filter((r) => selectedRitualIds.has(r.id)),
    [allRituals, selectedRitualIds],
  );
  const prepItems = useMemo(
    () => allItems.filter((i) => selectedItemIds.has(i.id)),
    [allItems, selectedItemIds],
  );

  const handleToggleRitual = useCallback(async (ritualId: string) => {
    const current = new Set(rituaisRef.current);
    if (current.has(ritualId)) current.delete(ritualId);
    else current.add(ritualId);
    const arr = Array.from(current);
    setLocalRituais(arr);
    try {
      await updateMut.mutateAsync({
        personagemId: entry.personagemId,
        data: { rituais: arr },
      });
      setLocalRituais(null);
    } catch (e: any) {
      setLocalRituais(null);
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [entry.personagemId, updateMut, toast]);

  const handleToggleItem = useCallback(async (itemId: string) => {
    const current = new Set(itensRef.current);
    if (current.has(itemId)) current.delete(itemId);
    else current.add(itemId);
    const arr = Array.from(current);
    setLocalItens(arr);
    try {
      await updateMut.mutateAsync({
        personagemId: entry.personagemId,
        data: { itens: arr },
      });
      setLocalItens(null);
    } catch (e: any) {
      setLocalItens(null);
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [entry.personagemId, updateMut, toast]);

  const handleToggleReady = useCallback(async () => {
    const next = !isReady;
    setLocalPronto(next);
    try {
      await updateMut.mutateAsync({
        personagemId: entry.personagemId,
        data: { pronto: next },
      });
      setLocalPronto(null);
    } catch (e: any) {
      setLocalPronto(null);
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [entry.personagemId, isReady, updateMut, toast]);

  const handleRemoveRitual = useCallback(async (ritualId: string) => {
    const current = new Set(rituaisRef.current);
    current.delete(ritualId);
    const arr = Array.from(current);
    setLocalRituais(arr);
    try {
      await updateMut.mutateAsync({
        personagemId: entry.personagemId,
        data: { rituais: arr },
      });
      setLocalRituais(null);
    } catch (e: any) {
      setLocalRituais(null);
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [entry.personagemId, updateMut, toast]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    const current = new Set(itensRef.current);
    current.delete(itemId);
    const arr = Array.from(current);
    setLocalItens(arr);
    try {
      await updateMut.mutateAsync({
        personagemId: entry.personagemId,
        data: { itens: arr },
      });
      setLocalItens(null);
    } catch (e: any) {
      setLocalItens(null);
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  }, [entry.personagemId, updateMut, toast]);

  return (
    <div className={`border rounded-sm transition-all ${
      isReady
        ? "border-green-600/50 bg-green-950/20"
        : "border-border/50 bg-card/30"
    }`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-muted-foreground shrink-0">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
        <div className="w-9 h-9 rounded-sm bg-secondary/40 border border-border/40 flex items-center justify-center text-sm font-display font-bold text-muted-foreground shrink-0">
          {entry.personagemNome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-foreground font-semibold">{entry.personagemNome}</span>
            {entry.classeNome && (
              <Badge variant="outline" className="text-[10px] font-display tracking-widest border-border/50 text-muted-foreground">
                {entry.classeNome}
              </Badge>
            )}
            <span className="text-[10px] font-mono text-muted-foreground/60">— {ownerName(entry)}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[10px] font-mono text-muted-foreground">
            {isOcultista && (
              <span className="flex items-center gap-1">
                <ScrollText className="w-3 h-3" /> {selectedRitualIds.size} rituais
              </span>
            )}
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" /> {selectedItemIds.size} itens
            </span>
          </div>
        </div>
        <div className="shrink-0">
          {isReady ? (
            <Badge className="bg-green-900/50 text-green-300 border-green-600/50 text-[10px] font-display tracking-widest">
              PRONTO
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-display tracking-widest border-amber-600/40 text-amber-400">
              PREPARANDO
            </Badge>
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-3">
          <div className="space-y-2">
            <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Atributos & Vitais
            </span>
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border bg-red-900/30 border-red-700/40 text-red-300">FOR {entry.personagemForca}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border bg-green-900/30 border-green-700/40 text-green-300">AGI {entry.personagemAgilidade}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border bg-blue-900/30 border-blue-700/40 text-blue-300">INT {entry.personagemIntelecto}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border bg-amber-900/30 border-amber-700/40 text-amber-300">VIG {entry.personagemVigor}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border bg-purple-900/30 border-purple-700/40 text-purple-300">PRE {entry.personagemPresenca}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-border/50 text-muted-foreground">DEF {entry.personagemDefesa}</span>
            </div>
            <div className="flex gap-3 text-[10px] font-mono text-muted-foreground">
              {entry.personagemPvAtual != null && entry.personagemPvMaximo != null && (
                <span className="text-red-400">PV {entry.personagemPvAtual}/{entry.personagemPvMaximo}</span>
              )}
              {entry.personagemPeAtual != null && entry.personagemPeMaximo != null && (
                <span className="text-blue-400">PE {entry.personagemPeAtual}/{entry.personagemPeMaximo}</span>
              )}
              {entry.personagemSanAtual != null && entry.personagemSanMaximo != null && (
                <span className="text-amber-400">SAN {entry.personagemSanAtual}/{entry.personagemSanMaximo}</span>
              )}
              <span>NEX {entry.personagemNex}%</span>
            </div>
          </div>

          {isOcultista && knownRitualIds.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                    Rituais Preparados ({selectedRitualIds.size})
                  </span>
                </div>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] font-display tracking-widest border-primary/40 text-primary hover:bg-primary/10"
                    onClick={(e) => { e.stopPropagation(); setRitualPickerOpen(true); }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Selecionar
                  </Button>
                )}
              </div>
              {prepRituals.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {prepRituals.map((r) => {
                    const elemCls = ELEM_COLORS[r.elemento] ?? ELEM_COLORS["Variável"];
                    return (
                      <span
                        key={r.id}
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 border rounded-sm ${elemCls}`}
                      >
                        {r.nome}
                        {r.custoPe != null && (
                          <span className="text-[9px] opacity-60">{r.custoPe}PE</span>
                        )}
                        {canEdit && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveRitual(r.id); }}
                            className="ml-0.5 opacity-60 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] font-mono text-muted-foreground/50 italic">Nenhum ritual selecionado</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                  Itens Preparados ({selectedItemIds.size})
                </span>
              </div>
              {canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] font-display tracking-widest border-primary/40 text-primary hover:bg-primary/10"
                  onClick={(e) => { e.stopPropagation(); setItemPickerOpen(true); }}
                >
                  <Package className="w-3 h-3 mr-1" />
                  Selecionar
                </Button>
              )}
            </div>
            {prepItems.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {prepItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 border border-border/50 bg-secondary/20 rounded-sm text-foreground/80"
                  >
                    {item.nome}
                    {item.categoria && (
                      <span className="text-[9px] opacity-50">({item.categoria})</span>
                    )}
                    {canEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                        className="ml-0.5 opacity-60 hover:opacity-100 text-muted-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-mono text-muted-foreground/50 italic">Nenhum item selecionado</p>
            )}
          </div>

          {canEdit && (
            <div className="flex justify-end pt-2 border-t border-border/30">
              <Button
                size="sm"
                variant={isReady ? "outline" : "default"}
                onClick={(e) => { e.stopPropagation(); handleToggleReady(); }}
                disabled={updateMut.isPending}
                className={`font-display tracking-widest text-xs ${
                  isReady
                    ? "border-amber-600/40 text-amber-400 hover:bg-amber-900/20"
                    : "bg-green-700 hover:bg-green-600 text-white"
                }`}
              >
                {updateMut.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : isReady ? (
                  <X className="w-3.5 h-3.5 mr-1.5" />
                ) : (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                )}
                {isReady ? "Cancelar Prontidão" : "Marcar como Pronto"}
              </Button>
            </div>
          )}
        </div>
      )}

      {canEdit && (
        <>
          <RitualPickerDialog
            open={ritualPickerOpen}
            onClose={() => setRitualPickerOpen(false)}
            allRituals={allRituals}
            knownRitualIds={knownRitualIds}
            selectedIds={selectedRitualIds}
            onToggle={handleToggleRitual}
          />
          <ItemPickerDialog
            open={itemPickerOpen}
            onClose={() => setItemPickerOpen(false)}
            allItems={allItems}
            selectedIds={selectedItemIds}
            onToggle={handleToggleItem}
          />
        </>
      )}
    </div>
  );
}

export default function PreparacaoTab({
  campanhaId,
  amMestre,
}: {
  campanhaId: string;
  amMestre: boolean;
}) {
  const { user } = useAuth();
  const { data: allEntries = [], isLoading } = useListCampanhaPersonagens(campanhaId);
  const { data: allRituals = [] } = useListRituals();
  const { data: allItems = [] } = useListItens();

  const visibleEntries = useMemo(
    () => amMestre ? allEntries : allEntries.filter((e) => e.userId === user?.id),
    [allEntries, amMestre, user?.id],
  );

  const readyCount = allEntries.filter((e) => (e.preparacao as PreparacaoData | null)?.pronto).length;
  const totalCount = allEntries.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground font-display tracking-widest animate-pulse text-xs">
        CARREGANDO PREPARAÇÃO...
      </div>
    );
  }

  if (allEntries.length === 0) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
        <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">
          Nenhum agente designado para esta operação.
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          Adicione agentes na aba "Agentes" antes de preparar a missão.
        </p>
      </div>
    );
  }

  if (visibleEntries.length === 0) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
        <Shield className="w-10 h-10 text-muted-foreground/30 mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">
          Você não tem agentes designados nesta operação.
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          Adicione seus personagens na aba "Agentes" para preparar a missão.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-sm tracking-widest text-muted-foreground uppercase">
            Preparação de Missão
          </h2>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] font-display tracking-widest ${
            readyCount === totalCount
              ? "border-green-600/50 text-green-400"
              : "border-amber-600/40 text-amber-400"
          }`}
        >
          {readyCount}/{totalCount} PRONTOS
        </Badge>
      </div>

      <div className="space-y-2">
        {visibleEntries.map((entry) => {
          const canEdit = amMestre || entry.userId === user?.id;
          return (
            <AgentPrepCard
              key={entry.id}
              entry={entry}
              canEdit={canEdit}
              campanhaId={campanhaId}
              allRituals={allRituals as Ritual[]}
              allItems={allItems as ItemCompendio[]}
            />
          );
        })}
      </div>
    </div>
  );
}
