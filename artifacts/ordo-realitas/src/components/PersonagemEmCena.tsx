import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUpdateCharacter,
  useListRituals,
  useListItens,
  personagensKey,
  type CampanhaPersonagemEntry,
  type Ritual,
  type ItemCompendio,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart, Zap, Brain, Shield, Minus, Plus, User,
  ChevronDown, ChevronRight, Swords, ScrollText, Package,
} from "lucide-react";

const ATTR_LABELS: Record<string, string> = {
  forca: "FOR",
  agilidade: "AGI",
  intelecto: "INT",
  vigor: "VIG",
  presenca: "PRE",
};

const ATTR_COLORS: Record<string, string> = {
  forca: "bg-red-900/40 border-red-700/50 text-red-300",
  agilidade: "bg-green-900/40 border-green-700/50 text-green-300",
  intelecto: "bg-blue-900/40 border-blue-700/50 text-blue-300",
  vigor: "bg-amber-900/40 border-amber-700/50 text-amber-300",
  presenca: "bg-purple-900/40 border-purple-700/50 text-purple-300",
};

interface Props {
  campanhaId: string;
  amMestre: boolean;
  personagens: CampanhaPersonagemEntry[];
  userId: string;
}

function ResourceBar({
  label,
  icon,
  current,
  max,
  color,
  onChange,
  readOnly,
}: {
  label: string;
  icon: React.ReactNode;
  current: number;
  max: number;
  color: string;
  onChange: (val: number) => void;
  readOnly: boolean;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          {!readOnly && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => onChange(Math.max(0, current - 1))}
              disabled={current <= 0}
            >
              <Minus className="w-3 h-3" />
            </Button>
          )}
          <span className="font-mono text-sm tabular-nums min-w-[48px] text-center text-foreground">
            {current} / {max}
          </span>
          {!readOnly && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => onChange(Math.min(max, current + 1))}
              disabled={current >= max}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="h-2 bg-secondary/30 rounded-full border border-border/30 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FichaView({
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
  const updateMut = useUpdateCharacter();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [showRituais, setShowRituais] = useState(false);
  const [showItens, setShowItens] = useState(false);
  const [showPericias, setShowPericias] = useState(false);

  const handleResourceChange = useCallback(
    async (field: string, val: number) => {
      try {
        await updateMut.mutateAsync({ id: entry.personagemId, data: { [field]: val } });
        qc.invalidateQueries({ queryKey: personagensKey(campanhaId) });
      } catch (e: any) {
        toast({ title: "ERRO", description: e.message, variant: "destructive" });
      }
    },
    [entry.personagemId, campanhaId, updateMut, qc, toast],
  );

  const prepRituais = useMemo(() => {
    const ids = new Set(entry.preparacao?.rituais ?? entry.personagemRituals ?? []);
    return allRituals.filter((r) => ids.has(r.id));
  }, [allRituals, entry.preparacao, entry.personagemRituals]);

  const prepItens = useMemo(() => {
    const ids = new Set(entry.preparacao?.itens ?? []);
    return allItems.filter((i) => ids.has(i.id));
  }, [allItems, entry.preparacao]);

  const pericias = entry.personagemPericias ?? [];

  return (
    <div className="border border-border/40 rounded-sm bg-card/30 p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-display font-bold text-primary text-lg">
          {entry.personagemNome.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-display text-lg tracking-widest text-foreground">{entry.personagemNome}</h3>
          <div className="flex items-center gap-2">
            {entry.classeNome && (
              <span className="text-xs font-mono text-muted-foreground">{entry.classeNome}</span>
            )}
            <span className="text-xs font-mono text-muted-foreground/50">NEX {entry.personagemNex}%</span>
          </div>
        </div>
        {!canEdit && (
          <Badge variant="outline" className="ml-auto text-[9px] font-display tracking-widest border-border/40 text-muted-foreground">
            SOMENTE LEITURA
          </Badge>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["forca", "agilidade", "intelecto", "vigor", "presenca"] as const).map((attr) => {
          const key = `personagem${attr.charAt(0).toUpperCase()}${attr.slice(1)}` as keyof CampanhaPersonagemEntry;
          const val = (entry[key] as number) ?? 1;
          return (
            <span key={attr} className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${ATTR_COLORS[attr]}`}>
              {ATTR_LABELS[attr]} {val}
            </span>
          );
        })}
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-stone-600/50 text-stone-400 bg-stone-900/30">
          DEF {entry.personagemDefesa}
        </span>
      </div>

      <div className="space-y-3">
        <ResourceBar
          label="Pontos de Vida"
          icon={<Heart className="w-3.5 h-3.5 text-red-400" />}
          current={entry.personagemPvAtual ?? 0}
          max={entry.personagemPvMaximo ?? 0}
          color="bg-red-600"
          onChange={(v) => handleResourceChange("pvAtual", v)}
          readOnly={!canEdit}
        />
        <ResourceBar
          label="Pontos de Esforço"
          icon={<Zap className="w-3.5 h-3.5 text-blue-400" />}
          current={entry.personagemPeAtual ?? 0}
          max={entry.personagemPeMaximo ?? 0}
          color="bg-blue-600"
          onChange={(v) => handleResourceChange("peAtual", v)}
          readOnly={!canEdit}
        />
        <ResourceBar
          label="Sanidade"
          icon={<Brain className="w-3.5 h-3.5 text-purple-400" />}
          current={entry.personagemSanAtual ?? 0}
          max={entry.personagemSanMaximo ?? 0}
          color="bg-purple-600"
          onChange={(v) => handleResourceChange("sanAtual", v)}
          readOnly={!canEdit}
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowRituais(!showRituais)}
          className="flex items-center gap-2 w-full text-left"
        >
          {showRituais ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          <ScrollText className="w-3.5 h-3.5 text-primary/60" />
          <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
            Rituais ({prepRituais.length})
          </span>
        </button>
        {showRituais && (
          <div className="pl-6 space-y-1">
            {prepRituais.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground/50">Nenhum ritual preparado.</p>
            ) : (
              prepRituais.map((r) => (
                <div key={r.id} className="flex items-center gap-2 text-xs font-mono text-foreground/80">
                  <span className="text-primary/40">•</span>
                  <span>{r.nome}</span>
                  <span className="text-muted-foreground/40">{r.elemento}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowItens(!showItens)}
          className="flex items-center gap-2 w-full text-left"
        >
          {showItens ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          <Package className="w-3.5 h-3.5 text-amber-600/60" />
          <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
            Itens ({prepItens.length})
          </span>
        </button>
        {showItens && (
          <div className="pl-6 space-y-1">
            {prepItens.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground/50">Nenhum item preparado.</p>
            ) : (
              prepItens.map((i) => (
                <div key={i.id} className="flex items-center gap-2 text-xs font-mono text-foreground/80">
                  <span className="text-amber-600/40">•</span>
                  <span>{i.nome}</span>
                  <span className="text-muted-foreground/40">{i.tipo}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowPericias(!showPericias)}
          className="flex items-center gap-2 w-full text-left"
        >
          {showPericias ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
          <Swords className="w-3.5 h-3.5 text-green-600/60" />
          <span className="font-display text-[10px] tracking-widest text-muted-foreground uppercase">
            Perícias ({pericias.length})
          </span>
        </button>
        {showPericias && (
          <div className="pl-6 flex flex-wrap gap-1">
            {pericias.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground/50">Nenhuma perícia registrada.</p>
            ) : (
              pericias.map((p) => (
                <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-border/30 text-muted-foreground bg-secondary/20">
                  {p}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PersonagemEmCena({ campanhaId, amMestre, personagens, userId }: Props) {
  const [selectedCharId, setSelectedCharId] = useState<string>("");
  const { data: allRituals = [] } = useListRituals();
  const { data: allItems = [] } = useListItens();

  const myEntries = useMemo(
    () => (amMestre ? personagens : personagens.filter((p) => p.userId === userId)),
    [personagens, amMestre, userId],
  );

  const selectedEntry = useMemo(() => {
    if (amMestre) {
      return personagens.find((p) => p.personagemId === selectedCharId) ?? null;
    }
    return myEntries[0] ?? null;
  }, [personagens, myEntries, selectedCharId, amMestre]);

  const canEdit = selectedEntry ? selectedEntry.userId === userId : false;

  if (personagens.length === 0) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
        <User className="w-10 h-10 text-muted-foreground/30 mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">Nenhum personagem na operação.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {amMestre && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <User className="w-3 h-3" /> Selecionar Personagem
          </label>
          <Select value={selectedCharId} onValueChange={setSelectedCharId}>
            <SelectTrigger className="bg-secondary/30 border-border/60 font-mono text-sm h-9 max-w-sm">
              <SelectValue placeholder="Escolha um personagem…" />
            </SelectTrigger>
            <SelectContent>
              {personagens.map((p) => (
                <SelectItem key={p.personagemId} value={p.personagemId}>
                  {p.personagemNome} — {p.userFirstName ?? p.userEmail.split("@")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedEntry ? (
        <FichaView entry={selectedEntry} canEdit={canEdit} campanhaId={campanhaId} allRituals={allRituals} allItems={allItems} />
      ) : (
        <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
          <User className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="font-mono text-sm text-muted-foreground">
            {amMestre ? "Selecione um personagem para visualizar." : "Você não tem personagens nesta operação."}
          </p>
        </div>
      )}
    </div>
  );
}
