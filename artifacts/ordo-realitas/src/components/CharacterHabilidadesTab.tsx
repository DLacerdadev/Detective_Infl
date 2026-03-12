import { useState, useEffect } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronUp, Zap, FlameKindling,
  Shield, Star, Sparkles, BookMarked, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export type HabilidadeTipo =
  | "poder_origem"
  | "habilidade_fixa"
  | "poder_classe"
  | "habilidade_trilha"
  | "poder_geral";

export interface Habilidade {
  id: string;
  nome: string;
  tipo: HabilidadeTipo;
  descricao: string;
  custo_pe?: number | null;
  trilha?: string;
  pre_requisitos?: string;
  nex_minimo?: number | null;
}

interface HabilidadeProgressao {
  nex: string;
  nome: string;
  descricao: string;
}

interface ClasseInfo {
  nome: string;
  habilidadesBase?: HabilidadeProgressao[];
}

interface OrigemInfo {
  nome: string;
  poderConcedido?: string | null;
  poderDescricao?: string | null;
}

const CHOICE_PATTERNS = [
  "Habilidade de Trilha",
  "Poder de ",
  "Aumento de Atributo",
  "Grau de Treinamento",
  "Versatilidade",
];

function isChoiceEntry(nome: string): boolean {
  return CHOICE_PATTERNS.some((p) => nome.includes(p));
}

function nexToNumber(nexStr: string): number {
  const n = parseInt(nexStr);
  return isNaN(n) ? 0 : n;
}

function computeSystemHabilidades(
  classe?: ClasseInfo | null,
  origem?: OrigemInfo | null,
  nex?: number,
): Habilidade[] {
  const result: Habilidade[] = [];
  // All characters start at NEX 5% minimum — treat NEX 0 as NEX 5
  const currentNex = Math.max(nex ?? 0, 5);

  if (origem?.poderConcedido) {
    result.push({
      id: "sys-origin",
      nome: origem.poderConcedido,
      tipo: "poder_origem",
      descricao: origem.poderDescricao ?? "",
      custo_pe: null,
    });
  }

  if (classe?.habilidadesBase) {
    classe.habilidadesBase
      .filter((entry) => {
        const entryNex = nexToNumber(entry.nex);
        const nexOk = entryNex === 0 || entryNex <= currentNex;
        return nexOk && !isChoiceEntry(entry.nome);
      })
      .forEach((entry, i) => {
        const entryNex = nexToNumber(entry.nex);
        result.push({
          id: `sys-class-${i}`,
          nome: entry.nome,
          tipo: "habilidade_fixa",
          descricao: entry.descricao,
          nex_minimo: entryNex || null,
          custo_pe: null,
        });
      });
  }

  return result;
}

const TIPO_META: Record<
  HabilidadeTipo,
  { label: string; color: string; border: string; icon: React.ReactNode }
> = {
  poder_origem: {
    label: "Origem",
    color: "text-amber-300",
    border: "border-amber-700/50 bg-amber-900/20",
    icon: <Star className="w-3 h-3" />,
  },
  habilidade_fixa: {
    label: "Classe (Fixa)",
    color: "text-cyan-300",
    border: "border-cyan-700/50 bg-cyan-900/20",
    icon: <Shield className="w-3 h-3" />,
  },
  poder_classe: {
    label: "Poder de Classe",
    color: "text-red-300",
    border: "border-red-700/50 bg-red-900/20",
    icon: <FlameKindling className="w-3 h-3" />,
  },
  habilidade_trilha: {
    label: "Trilha",
    color: "text-green-300",
    border: "border-green-700/50 bg-green-900/20",
    icon: <BookMarked className="w-3 h-3" />,
  },
  poder_geral: {
    label: "Poder Geral",
    color: "text-purple-300",
    border: "border-purple-700/50 bg-purple-900/20",
    icon: <Sparkles className="w-3 h-3" />,
  },
};

const TIPOS_ORDERED: HabilidadeTipo[] = [
  "poder_origem",
  "habilidade_fixa",
  "poder_classe",
  "habilidade_trilha",
  "poder_geral",
];

function storageKey(charId: string) {
  return `char-${charId}-habilidades-v1`;
}

function loadHabilidades(charId: string): Habilidade[] {
  try {
    const raw = localStorage.getItem(storageKey(charId));
    if (!raw) return [];
    return JSON.parse(raw) as Habilidade[];
  } catch {
    return [];
  }
}

function saveHabilidades(charId: string, list: Habilidade[]) {
  localStorage.setItem(storageKey(charId), JSON.stringify(list));
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const EMPTY_FORM: Omit<Habilidade, "id"> = {
  nome: "",
  tipo: "poder_classe",
  descricao: "",
  custo_pe: null,
  trilha: "",
  pre_requisitos: "",
  nex_minimo: null,
};

function AddHabilidadeDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (h: Omit<Habilidade, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Habilidade, "id">>(EMPTY_FORM);

  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: (typeof EMPTY_FORM)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.nome.trim()) return;
    onSave({
      ...form,
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      trilha: form.trilha?.trim() || undefined,
      pre_requisitos: form.pre_requisitos?.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            ADICIONAR HABILIDADE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Nome *
            </Label>
            <Input
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              placeholder="ex: Ataque Especial"
              className="bg-secondary/30 border-border font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Tipo
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {TIPOS_ORDERED.map((t) => {
                const meta = TIPO_META[t];
                const active = form.tipo === t;
                return (
                  <button
                    key={t}
                    onClick={() => set("tipo", t)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-display tracking-wide transition-all text-left ${
                      active
                        ? `${meta.border} ${meta.color} border-opacity-100`
                        : "border-border/40 text-muted-foreground hover:border-border/70"
                    }`}
                  >
                    {meta.icon}
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {form.tipo === "habilidade_trilha" && (
            <div className="space-y-1">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                Nome da Trilha
              </Label>
              <Input
                value={form.trilha ?? ""}
                onChange={(e) => set("trilha", e.target.value)}
                placeholder="ex: Aniquilador"
                className="bg-secondary/30 border-border font-mono text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                Custo PE
              </Label>
              <Input
                type="number"
                min={0}
                value={form.custo_pe ?? ""}
                onChange={(e) =>
                  set("custo_pe", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="0"
                className="bg-secondary/30 border-border font-mono text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                NEX Mínimo %
              </Label>
              <Input
                type="number"
                min={5}
                max={99}
                step={5}
                value={form.nex_minimo ?? ""}
                onChange={(e) =>
                  set("nex_minimo", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="5"
                className="bg-secondary/30 border-border font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Pré-requisitos
            </Label>
            <Input
              value={form.pre_requisitos ?? ""}
              onChange={(e) => set("pre_requisitos", e.target.value)}
              placeholder="ex: For 2, treinado em Luta"
              className="bg-secondary/30 border-border font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
              Descrição / Efeito
            </Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => set("descricao", e.target.value)}
              rows={4}
              placeholder="Descreva o efeito mecânico desta habilidade..."
              className="bg-secondary/30 border-border font-mono text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!form.nome.trim()}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HabilidadeCard({
  hab,
  isOwner,
  isSystem,
  onDelete,
}: {
  hab: Habilidade;
  isOwner: boolean;
  isSystem: boolean;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = TIPO_META[hab.tipo];

  return (
    <div className={`border rounded-sm overflow-hidden ${isSystem ? "border-border/30 bg-card/10" : "border-border/40 bg-card/20"}`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-secondary/20 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className={`shrink-0 ${meta.color}`}>{meta.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-sm tracking-wide text-foreground uppercase">
              {hab.nome}
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm border ${meta.border} ${meta.color}`}
            >
              {meta.label}
              {hab.tipo === "habilidade_trilha" && hab.trilha
                ? ` · ${hab.trilha}`
                : ""}
            </span>
            {hab.custo_pe != null && hab.custo_pe > 0 && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border border-blue-700/40 bg-blue-900/20 text-blue-300">
                {hab.custo_pe} PE
              </span>
            )}
            {hab.nex_minimo != null && hab.nex_minimo > 0 && (
              <span className="text-[9px] font-mono text-muted-foreground/50">
                NEX {hab.nex_minimo}%+
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isSystem ? (
            <span className="p-1.5 text-muted-foreground/20" title="Concedido por classe/origem">
              <Lock className="w-3 h-3" />
            </span>
          ) : isOwner ? (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(hab.id);
              }}
              className="p-1.5 rounded-sm text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </span>
          ) : null}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/60" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border/20">
          {hab.pre_requisitos && (
            <p className="text-[10px] font-mono text-muted-foreground/60">
              <span className="text-muted-foreground/40">PRÉ-REQUISITO:</span>{" "}
              {hab.pre_requisitos}
            </p>
          )}
          {isSystem && (
            <p className="text-[9px] font-mono text-muted-foreground/30 italic flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              Concedido automaticamente pela sua {hab.tipo === "poder_origem" ? "origem" : "classe"}
            </p>
          )}
          {hab.descricao ? (
            <p className="text-sm font-sans text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {hab.descricao}
            </p>
          ) : (
            <p className="text-xs font-mono text-muted-foreground/40 italic">
              Sem descrição registrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const FILTER_OPTIONS: { label: string; value: HabilidadeTipo | "all" }[] = [
  { label: "Todas", value: "all" },
  { label: "Origem", value: "poder_origem" },
  { label: "Classe (Fixa)", value: "habilidade_fixa" },
  { label: "Poder", value: "poder_classe" },
  { label: "Trilha", value: "habilidade_trilha" },
  { label: "Geral", value: "poder_geral" },
];

export default function CharacterHabilidadesTab({
  charId,
  isOwner,
  classe,
  origem,
  nex,
}: {
  charId: string;
  isOwner: boolean;
  classe?: ClasseInfo | null;
  origem?: OrigemInfo | null;
  nex?: number;
}) {
  const [userHabilidades, setUserHabilidades] = useState<Habilidade[]>(() =>
    loadHabilidades(charId)
  );
  const [filter, setFilter] = useState<HabilidadeTipo | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const systemHabilidades = computeSystemHabilidades(classe, origem, nex);
  const systemIds = new Set(systemHabilidades.map((h) => h.id));

  const allHabilidades = [...systemHabilidades, ...userHabilidades];

  const save = (list: Habilidade[]) => {
    setUserHabilidades(list);
    saveHabilidades(charId, list);
  };

  const handleAdd = (data: Omit<Habilidade, "id">) => {
    save([...userHabilidades, { ...data, id: genId() }]);
  };

  const handleDelete = (id: string) => {
    save(userHabilidades.filter((h) => h.id !== id));
  };

  const filtered =
    filter === "all"
      ? allHabilidades
      : allHabilidades.filter((h) => h.tipo === filter);

  const grouped = TIPOS_ORDERED.reduce<Record<HabilidadeTipo, Habilidade[]>>(
    (acc, t) => {
      acc[t] = filtered.filter((h) => h.tipo === t);
      return acc;
    },
    {} as Record<HabilidadeTipo, Habilidade[]>
  );

  const total = allHabilidades.length;
  const filteredCount = filtered.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">
            Habilidades
          </span>
          <span className="font-mono text-xs text-muted-foreground/50">
            ({filteredCount}/{total})
          </span>
        </div>
        {isOwner && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs font-display tracking-widest border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="w-3 h-3 mr-1.5" />
            ADICIONAR
          </Button>
        )}
      </div>

      <div className="flex gap-1 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === "all"
              ? total
              : allHabilidades.filter((h) => h.tipo === opt.value).length;
          const active = filter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1 text-[10px] font-display tracking-wide rounded-sm border transition-all ${
                active
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground"
              }`}
            >
              {opt.label}
              {count > 0 && (
                <span className="ml-1 font-mono opacity-60">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {filteredCount === 0 ? (
        <div className="border border-border/30 border-dashed rounded-sm p-10 text-center space-y-2">
          <Zap className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="font-mono text-sm text-muted-foreground/50">
            {total === 0
              ? "Nenhuma habilidade registrada para este agente."
              : "Nenhuma habilidade nesta categoria."}
          </p>
          {isOwner && total === 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Adicionar primeira habilidade
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {TIPOS_ORDERED.map((tipo) => {
            const list = grouped[tipo];
            if (list.length === 0) return null;
            const meta = TIPO_META[tipo];
            return (
              <div key={tipo} className="space-y-1.5">
                <div className="flex items-center gap-2 pb-1 border-b border-border/20">
                  <span className={`${meta.color}`}>{meta.icon}</span>
                  <span
                    className={`text-[10px] font-display tracking-widest uppercase ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/40">
                    {list.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {list.map((hab) => (
                    <HabilidadeCard
                      key={hab.id}
                      hab={hab}
                      isOwner={isOwner}
                      isSystem={systemIds.has(hab.id)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddHabilidadeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />
    </div>
  );
}
