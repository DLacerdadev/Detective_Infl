import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListTrilhas, useListClasses } from "@workspace/api-client-react";
import {
  useCreateTrilha, useUpdateTrilha, useDeleteTrilha,
  getListTrilhasAdminQueryKey,
  type TrilhaProgressao,
} from "@workspace/api-client-react";
import {
  Search, Plus, Pencil, Trash2, X, Save, Loader2,
  ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Trilha } from "@workspace/api-client-react";

const FONTES = ["Livro Base", "Sobrevivendo ao Horror"] as const;

const CLASSE_BADGE: Record<string, string> = {
  Combatente:   "bg-red-900/50 text-red-300 border-red-700",
  Especialista: "bg-blue-900/50 text-blue-300 border-blue-700",
  Ocultista:    "bg-violet-900/50 text-violet-300 border-violet-700",
  Sobrevivente: "bg-green-900/50 text-green-300 border-green-700",
};

const NEX_COLORS: Record<string, string> = {
  "10%": "text-green-400 border-green-800/50",
  "40%": "text-blue-400 border-blue-800/50",
  "65%": "text-violet-400 border-violet-800/50",
  "99%": "text-primary border-primary/30",
};

const DEFAULT_MILESTONES_NORMAL: TrilhaProgressao[] = [
  { nex: "10%", nome: "", descricao: "" },
  { nex: "40%", nome: "", descricao: "" },
  { nex: "65%", nome: "", descricao: "" },
  { nex: "99%", nome: "", descricao: "" },
];

const DEFAULT_MILESTONES_SOBREVIVENTE: TrilhaProgressao[] = [
  { nex: "Estágio 2", nome: "", descricao: "" },
  { nex: "Estágio 4", nome: "", descricao: "" },
];

type TrilhaForm = {
  classeId: string;
  classeNome: string;
  nome: string;
  fonte: string;
  habilidades: TrilhaProgressao[];
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function MilestoneEditor({
  milestones,
  onChange,
}: {
  milestones: TrilhaProgressao[];
  onChange: (ms: TrilhaProgressao[]) => void;
}) {
  const inputCls = "bg-secondary/30 border-border text-sm font-mono focus-visible:ring-primary";

  const updateField = (i: number, field: keyof TrilhaProgressao, val: string) => {
    const next = milestones.map((m, idx) => idx === i ? { ...m, [field]: val } : m);
    onChange(next);
  };

  const addMilestone = () =>
    onChange([...milestones, { nex: "", nome: "", descricao: "" }]);

  const removeMilestone = (i: number) =>
    onChange(milestones.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => {
        const nexColor = NEX_COLORS[m.nex] ?? "text-amber-400 border-amber-800/50";
        return (
          <div
            key={i}
            className={`rounded border bg-secondary/10 p-3 space-y-2 border-l-2 ${nexColor.split(" ")[1] ?? "border-border"}`}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div>
                  <Label className="text-[9px] font-display uppercase tracking-widest text-muted-foreground/70 mb-0.5 block">
                    Marco (NEX / Estágio)
                  </Label>
                  <Input
                    value={m.nex}
                    onChange={e => updateField(i, "nex", e.target.value)}
                    placeholder="10%, 40%, Estágio 2..."
                    className={`${inputCls} h-7 text-xs ${nexColor.split(" ")[0]}`}
                  />
                </div>
                <div>
                  <Label className="text-[9px] font-display uppercase tracking-widest text-muted-foreground/70 mb-0.5 block">
                    Nome da habilidade
                  </Label>
                  <Input
                    value={m.nome}
                    onChange={e => updateField(i, "nome", e.target.value)}
                    placeholder="Ex: Técnica Letal"
                    className={`${inputCls} h-7 text-xs`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeMilestone(i)}
                className="p-1 rounded hover:bg-red-950/40 text-muted-foreground hover:text-red-400 transition-colors shrink-0"
                title="Remover marco"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <Label className="text-[9px] font-display uppercase tracking-widest text-muted-foreground/70 mb-0.5 block">
                Descrição do efeito
              </Label>
              <Textarea
                value={m.descricao}
                onChange={e => updateField(i, "descricao", e.target.value)}
                placeholder="Descreva o que o personagem ganha neste marco..."
                rows={3}
                className={`${inputCls} resize-none text-xs`}
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={addMilestone}
        className="w-full py-2 rounded border border-dashed border-border text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-1"
      >
        <Plus className="w-3 h-3" /> Adicionar marco
      </button>
    </div>
  );
}

function TrilhaFormDialog({
  open, onClose, initial, editId, classes,
}: {
  open: boolean;
  onClose: () => void;
  initial: TrilhaForm;
  editId: string | null;
  classes: { id: string; nome: string }[];
}) {
  const [form, setForm] = useState<TrilhaForm>(initial);
  const qc = useQueryClient();
  const createMut = useCreateTrilha();
  const updateMut = useUpdateTrilha();
  const isLoading = createMut.isPending || updateMut.isPending;

  const set = <K extends keyof TrilhaForm>(k: K, v: TrilhaForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleClasseChange = (classeId: string) => {
    const cl = classes.find(c => c.id === classeId);
    const isSobrevivente = cl?.nome === "Sobrevivente";
    setForm(prev => ({
      ...prev,
      classeId,
      classeNome: cl?.nome ?? "",
      habilidades: editId ? prev.habilidades :
        isSobrevivente ? [...DEFAULT_MILESTONES_SOBREVIVENTE] : [...DEFAULT_MILESTONES_NORMAL],
    }));
  };

  const handleSave = async () => {
    const payload = {
      classeId: form.classeId,
      nome: form.nome,
      fonte: form.fonte,
      habilidades: form.habilidades.filter(m => m.nex.trim()),
    };
    if (editId) {
      await updateMut.mutateAsync({ id: editId, data: payload });
    } else {
      await createMut.mutateAsync(payload);
    }
    await qc.invalidateQueries({ queryKey: getListTrilhasAdminQueryKey() });
    onClose();
  };

  const inputCls = "bg-secondary/30 border-border text-sm font-mono focus-visible:ring-primary";
  const canSave = !!form.classeId && !!form.nome.trim() &&
    form.habilidades.every(m => !m.nex || (m.nome.trim() && m.descricao.trim()));

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-lg">
            {editId ? "EDITAR TRILHA" : "NOVA TRILHA"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Classe */}
          <FieldGroup label="Classe *">
            <div className="grid grid-cols-4 gap-2">
              {classes.map(cl => {
                const badge = CLASSE_BADGE[cl.nome] ?? "bg-secondary/30 text-muted-foreground border-border";
                const selected = form.classeId === cl.id;
                return (
                  <button
                    key={cl.id}
                    type="button"
                    onClick={() => handleClasseChange(cl.id)}
                    className={[
                      "px-3 py-2 rounded border text-xs font-mono transition-all",
                      selected ? `${badge} ring-1 ring-current` : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                    ].join(" ")}
                  >
                    {cl.nome}
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          {/* Nome + Fonte */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <FieldGroup label="Nome da trilha *">
                <Input
                  value={form.nome}
                  onChange={e => set("nome", e.target.value)}
                  placeholder="Ex: Guerreiro, Conduíte..."
                  className={inputCls}
                />
              </FieldGroup>
            </div>
            <FieldGroup label="Fonte">
              <div className="flex gap-2 h-full items-end">
                {FONTES.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("fonte", f)}
                    className={[
                      "flex-1 py-2 rounded border text-xs font-mono transition-all",
                      form.fonte === f
                        ? "bg-amber-900/40 text-amber-200 border-amber-600 ring-1 ring-amber-600"
                        : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                    ].join(" ")}
                  >
                    {f === "Livro Base" ? "LB" : "SaH"}
                  </button>
                ))}
              </div>
            </FieldGroup>
          </div>

          {/* Progressão */}
          <div>
            <div className="border-t border-border/50 pt-3 mb-3">
              <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                Progressão da trilha
              </p>
              <p className="text-[10px] text-muted-foreground/60 font-sans mt-0.5">
                Cada marco representa uma evolução ao atingir o NEX correspondente.
              </p>
            </div>
            <MilestoneEditor
              milestones={form.habilidades}
              onChange={ms => set("habilidades", ms)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !canSave}
            className="bg-primary hover:bg-primary/80"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            {editId ? "Salvar alterações" : "Criar trilha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TrilhasAdminTab() {
  const { data: trilhas, isLoading: loadingTrilhas } = useListTrilhas();
  const { data: classes, isLoading: loadingClasses } = useListClasses();
  const [search, setSearch] = useState("");
  const [filterClasse, setFilterClasse] = useState<string | null>(null);
  const [filterFonte, setFilterFonte] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Trilha | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Trilha | null>(null);

  const qc = useQueryClient();
  const deleteMut = useDeleteTrilha();

  const classesList = (classes as { id: string; nome: string }[] | undefined) ?? [];

  const lista = useMemo(() => {
    let r = (trilhas as Trilha[] | undefined) ?? [];
    if (filterClasse) r = r.filter(t => t.classeNome === filterClasse);
    if (filterFonte)  r = r.filter(t => t.fonte === filterFonte);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(t =>
        t.nome.toLowerCase().includes(q) ||
        t.classeNome.toLowerCase().includes(q) ||
        t.habilidades.some(h =>
          h.nome.toLowerCase().includes(q) ||
          h.descricao.toLowerCase().includes(q)
        )
      );
    }
    return r;
  }, [trilhas, filterClasse, filterFonte, search]);

  const counts = useMemo(() => {
    const all = (trilhas as Trilha[] | undefined) ?? [];
    const byClasse: Record<string, number> = {};
    all.forEach(t => { byClasse[t.classeNome] = (byClasse[t.classeNome] ?? 0) + 1; });
    return { total: all.length, byClasse };
  }, [trilhas]);

  const classeNames = ["Combatente", "Especialista", "Ocultista", "Sobrevivente"];

  const openNew = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (t: Trilha) => { setEditTarget(t); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync({ id: deleteTarget.id });
    await qc.invalidateQueries({ queryKey: getListTrilhasAdminQueryKey() });
    setDeleteTarget(null);
  };

  const formInitial: TrilhaForm = editTarget
    ? {
        classeId: editTarget.classeId,
        classeNome: editTarget.classeNome,
        nome: editTarget.nome,
        fonte: editTarget.fonte,
        habilidades: editTarget.habilidades ?? [],
      }
    : {
        classeId: classesList[0]?.id ?? "",
        classeNome: classesList[0]?.nome ?? "",
        nome: "",
        fonte: "Livro Base",
        habilidades: [...DEFAULT_MILESTONES_NORMAL],
      };

  const NEX_COLOR_MAP: Record<string, string> = {
    "10%": "text-green-400", "40%": "text-blue-400",
    "65%": "text-violet-400", "99%": "text-primary",
    "Estágio 2": "text-green-400", "Estágio 4": "text-primary",
  };

  if (loadingTrilhas || loadingClasses) {
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando trilhas...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <Card className="glass-panel px-4 py-3 text-center">
          <p className="text-2xl font-display text-primary">{counts.total}</p>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Total</p>
        </Card>
        {classeNames.map(c => (
          <Card key={c} className="glass-panel px-4 py-3 text-center">
            <p className="text-2xl font-display text-primary">{counts.byClasse[c] ?? 0}</p>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{c}</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar trilha ou habilidade..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/30 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {classeNames.map(c => (
          <button
            key={c}
            onClick={() => setFilterClasse(filterClasse === c ? null : c)}
            className={`px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterClasse === c
                ? (CLASSE_BADGE[c] ?? "") + " opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {c} <span className="opacity-75">({counts.byClasse[c] ?? 0})</span>
          </button>
        ))}

        {FONTES.map(f => (
          <button
            key={f}
            onClick={() => setFilterFonte(filterFonte === f ? null : f)}
            className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-all ${
              filterFonte === f
                ? "bg-amber-900/30 text-amber-300 border-amber-700 opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {f === "Livro Base" ? "LB" : "SaH"}
          </button>
        ))}

        <span className="text-xs font-mono text-muted-foreground">
          {lista.length} resultado{lista.length !== 1 ? "s" : ""}
        </span>

        <Button onClick={openNew} size="sm" className="ml-auto bg-primary hover:bg-primary/80 font-display tracking-wide">
          <Plus className="w-4 h-4 mr-1" /> Nova Trilha
        </Button>
      </div>

      {/* Table */}
      <Card className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Nome</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Classe</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Progressão</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Fonte</th>
                <th className="text-right px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(t => {
                const badge = CLASSE_BADGE[t.classeNome] ?? "bg-secondary/30 text-muted-foreground border-border";
                const isOpen = expanded === t.id;
                return (
                  <>
                    <tr key={t.id} className="border-b border-border/40 hover:bg-secondary/20 group transition-colors">
                      <td className="px-4 py-2.5 font-mono font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {t.nome}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-display tracking-wide ${badge}`}>
                          {t.classeNome}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5 flex-wrap">
                          {t.habilidades.map(h => (
                            <span
                              key={h.nex}
                              className={`text-[10px] font-bold font-display ${NEX_COLOR_MAP[h.nex] ?? "text-amber-400"}`}
                              title={h.nome}
                            >
                              {h.nex}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          t.fonte !== "Livro Base"
                            ? "bg-amber-900/30 text-amber-300 border-amber-700/50"
                            : "bg-secondary/30 text-muted-foreground border-border/50"
                        }`}>
                          {t.fonte === "Livro Base" ? "LB" : "SaH"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(t)}
                            className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="p-1.5 rounded hover:bg-red-950/40 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${t.id}-detail`} className="border-b border-border/30 bg-secondary/5">
                        <td colSpan={5} className="px-10 py-3">
                          <div className="space-y-2">
                            {t.habilidades.map(h => (
                              <div key={h.nex} className="flex gap-3">
                                <span className={`text-[11px] font-bold font-display shrink-0 w-16 pt-0.5 ${NEX_COLOR_MAP[h.nex] ?? "text-amber-400"}`}>
                                  {h.nex}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-foreground mb-0.5">{h.nome}</div>
                                  <div className="text-xs text-muted-foreground leading-relaxed">{h.descricao}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground font-mono text-sm">
                    Nenhuma trilha encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Dialog */}
      {formOpen && (
        <TrilhaFormDialog
          open={formOpen}
          onClose={closeForm}
          initial={formInitial}
          editId={editTarget?.id ?? null}
          classes={classesList}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent className="glass-panel border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display tracking-widest text-red-400">CONFIRMAR EXCLUSÃO</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-sans text-muted-foreground">
            Deseja remover a trilha <span className="font-mono text-foreground font-semibold">"{deleteTarget?.nome}"</span> e todas as suas progressões? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleteMut.isPending}>
              <X className="w-4 h-4 mr-2" />Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMut.isPending}
              className="bg-red-900 hover:bg-red-800 border-red-700"
            >
              {deleteMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir trilha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
