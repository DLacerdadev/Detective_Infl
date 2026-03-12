import { useState, useMemo, Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListHabilidades,
  useCreateHabilidade,
  useUpdateHabilidade,
  useDeleteHabilidade,
  getListHabilidadesQueryKey,
  type HabilidadeCompendio,
} from "@workspace/api-client-react";
import { Search, Plus, Pencil, Trash2, X, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const CLASSES = ["COMBATENTE", "ESPECIALISTA", "OCULTISTA", "SOBREVIVENTE", "GERAL"] as const;
const CATEGORIAS = ["HABILIDADE_CLASSE", "PODER_CLASSE", "PODER_GERAL", "ORIGEM"] as const;
const FONTES = ["LIVRO_BASE", "SOBREVIVENDO_AO_HORROR"] as const;

type ClasseType = typeof CLASSES[number];
type CategoriaType = typeof CATEGORIAS[number];

const CLASSE_BADGE: Record<ClasseType, string> = {
  COMBATENTE:   "bg-red-900/50 text-red-300 border-red-700",
  ESPECIALISTA: "bg-blue-900/50 text-blue-300 border-blue-700",
  OCULTISTA:    "bg-violet-900/50 text-violet-300 border-violet-700",
  SOBREVIVENTE: "bg-green-900/50 text-green-300 border-green-700",
  GERAL:        "bg-amber-900/50 text-amber-300 border-amber-700",
};

const CLASSE_LABEL: Record<ClasseType, string> = {
  COMBATENTE: "Combatente", ESPECIALISTA: "Especialista", OCULTISTA: "Ocultista",
  SOBREVIVENTE: "Sobrevivente", GERAL: "Geral",
};

const CATEGORIA_LABEL: Record<CategoriaType, string> = {
  HABILIDADE_CLASSE: "Hab. Classe", PODER_CLASSE: "Poder", PODER_GERAL: "Poder Geral",
  ORIGEM: "Origem",
};

const FONTE_LABEL: Record<string, string> = {
  LIVRO_BASE: "LB", SOBREVIVENDO_AO_HORROR: "SaH",
};

type HabForm = Omit<HabilidadeCompendio, "id" | "alterada">;

const EMPTY_FORM: HabForm = {
  nome: "", categoria: "PODER_CLASSE", classe: "COMBATENTE",
  descricao: "", fonte: "LIVRO_BASE", nex: null,
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleGroup<T extends string>({
  options, value, onChange, labelMap, badgeMap, cols = 3,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labelMap: Record<T, string>;
  badgeMap?: Record<T, string>;
  cols?: number;
}) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map(opt => {
        const selected = value === opt;
        const badge = badgeMap?.[opt] ?? "";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "px-3 py-2 rounded border text-xs font-mono transition-all text-left",
              selected
                ? badge || "bg-primary/30 text-primary border-primary/60 ring-1 ring-primary/40"
                : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
            ].join(" ")}
          >
            {labelMap[opt]}
          </button>
        );
      })}
    </div>
  );
}

function HabilidadeFormDialog({
  open, onClose, initial, editId,
}: {
  open: boolean;
  onClose: () => void;
  initial: HabForm;
  editId: string | null;
}) {
  const [form, setForm] = useState<HabForm>(initial);
  const qc = useQueryClient();
  const createMut = useCreateHabilidade();
  const updateMut = useUpdateHabilidade();
  const isLoading = createMut.isPending || updateMut.isPending;

  const set = <K extends keyof HabForm>(k: K, v: HabForm[K]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    const payload: HabForm = {
      nome: form.nome,
      categoria: form.categoria,
      classe: form.classe,
      descricao: form.descricao || null,
      fonte: form.fonte,
      nex: form.nex ? Number(form.nex) : null,
    };
    if (editId) {
      await updateMut.mutateAsync({ id: editId, data: payload });
    } else {
      await createMut.mutateAsync(payload);
    }
    await qc.invalidateQueries({ queryKey: getListHabilidadesQueryKey() });
    onClose();
  };

  const inputCls = "bg-secondary/30 border-border text-sm font-mono focus-visible:ring-primary";

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-lg">
            {editId ? "EDITAR HABILIDADE" : "NOVA HABILIDADE"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <FieldGroup label="Nome *">
            <Input
              value={form.nome}
              onChange={e => set("nome", e.target.value)}
              placeholder="Nome da habilidade"
              className={inputCls}
            />
          </FieldGroup>

          <FieldGroup label="Classe *">
            <ToggleGroup
              options={CLASSES}
              value={form.classe as ClasseType}
              onChange={v => set("classe", v)}
              labelMap={CLASSE_LABEL}
              badgeMap={CLASSE_BADGE}
              cols={5}
            />
          </FieldGroup>

          <FieldGroup label="Categoria *">
            <ToggleGroup
              options={CATEGORIAS}
              value={form.categoria as CategoriaType}
              onChange={v => set("categoria", v)}
              labelMap={CATEGORIA_LABEL}
              cols={5}
            />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Fonte">
              <div className="flex gap-2">
                {FONTES.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("fonte", f)}
                    className={[
                      "flex-1 py-2 rounded border text-sm font-mono transition-all",
                      form.fonte === f
                        ? "bg-amber-900/40 text-amber-200 border-amber-600 ring-1 ring-amber-600"
                        : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                    ].join(" ")}
                  >
                    {FONTE_LABEL[f]}
                  </button>
                ))}
              </div>
            </FieldGroup>

            <FieldGroup label="NEX mínimo (opcional)">
              <Input
                type="number"
                min={0}
                max={99}
                step={5}
                value={form.nex ?? ""}
                onChange={e => set("nex", e.target.value === "" ? null : Number(e.target.value) as any)}
                placeholder="ex: 25"
                className={inputCls}
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Descrição">
            <Textarea
              value={form.descricao ?? ""}
              onChange={e => set("descricao", e.target.value)}
              placeholder="Descreva o efeito da habilidade..."
              rows={6}
              className={inputCls + " resize-none"}
            />
          </FieldGroup>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !form.nome || !form.classe || !form.categoria}
            className="bg-primary hover:bg-primary/80"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            {editId ? "Salvar alterações" : "Criar habilidade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HabilidadesAdminTab() {
  const { data: habilidades, isLoading } = useListHabilidades();
  const [search, setSearch] = useState("");
  const [filterClasse, setFilterClasse] = useState<ClasseType | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<CategoriaType | null>(null);
  const [filterFonte, setFilterFonte] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HabilidadeCompendio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HabilidadeCompendio | null>(null);

  const qc = useQueryClient();
  const deleteMut = useDeleteHabilidade();

  const lista = useMemo(() => {
    let r = habilidades ?? [];
    if (filterClasse)    r = r.filter(x => x.classe === filterClasse);
    if (filterCategoria) r = r.filter(x => x.categoria === filterCategoria);
    if (filterFonte)     r = r.filter(x => x.fonte === filterFonte);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(x =>
        x.nome.toLowerCase().includes(q) ||
        (x.descricao ?? "").toLowerCase().includes(q)
      );
    }
    return r;
  }, [habilidades, filterClasse, filterCategoria, filterFonte, search]);

  const counts = useMemo(() => {
    const all = habilidades ?? [];
    const byClasse: Record<string, number> = {};
    const byCategoria: Record<string, number> = {};
    all.forEach(h => {
      byClasse[h.classe]       = (byClasse[h.classe] ?? 0) + 1;
      byCategoria[h.categoria] = (byCategoria[h.categoria] ?? 0) + 1;
    });
    return { total: all.length, byClasse, byCategoria };
  }, [habilidades]);

  const openNew = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (h: HabilidadeCompendio) => { setEditTarget(h); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync({ id: deleteTarget.id });
    await qc.invalidateQueries({ queryKey: getListHabilidadesQueryKey() });
    setDeleteTarget(null);
  };

  const formInitial: HabForm = editTarget
    ? {
        nome: editTarget.nome,
        categoria: editTarget.categoria,
        classe: editTarget.classe,
        descricao: editTarget.descricao ?? "",
        fonte: editTarget.fonte,
        nex: editTarget.nex,
      }
    : EMPTY_FORM;

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando habilidades...</div>;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Card className="glass-panel px-4 py-3 text-center col-span-1">
          <p className="text-2xl font-display text-primary">{counts.total}</p>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Total</p>
        </Card>
        {CLASSES.map(c => (
          <Card key={c} className="glass-panel px-4 py-3 text-center">
            <p className="text-2xl font-display text-primary">{counts.byClasse[c] ?? 0}</p>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{CLASSE_LABEL[c]}</p>
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
            placeholder="Buscar habilidade..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/30 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {CLASSES.map(c => (
          <button
            key={c}
            onClick={() => setFilterClasse(filterClasse === c ? null : c)}
            className={`px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterClasse === c
                ? CLASSE_BADGE[c] + " opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {CLASSE_LABEL[c]}
            <span className="ml-1 opacity-75">({counts.byClasse[c] ?? 0})</span>
          </button>
        ))}

        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategoria(filterCategoria === cat ? null : cat)}
            className={`px-2.5 py-1 rounded border text-[11px] font-mono tracking-wide transition-all ${
              filterCategoria === cat
                ? "bg-primary/20 text-primary border-primary/50 opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {CATEGORIA_LABEL[cat]}
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
            {FONTE_LABEL[f]}
          </button>
        ))}

        <span className="text-xs font-mono text-muted-foreground">
          {lista.length} resultado{lista.length !== 1 ? "s" : ""}
        </span>

        <Button onClick={openNew} size="sm" className="ml-auto bg-primary hover:bg-primary/80 font-display tracking-wide">
          <Plus className="w-4 h-4 mr-1" /> Nova Habilidade
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
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Categoria</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Fonte</th>
                <th className="text-center px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">NEX</th>
                <th className="text-right px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(h => {
                const isOpen = expanded === h.id;
                const hasDesc = !!h.descricao;
                const classeBadge = CLASSE_BADGE[h.classe as ClasseType] ?? "bg-secondary/30 text-muted-foreground border-border";
                return (
                  <Fragment key={h.id}>
                    <tr className="border-b border-border/40 transition-colors hover:bg-secondary/20 group">
                      <td className="px-4 py-2.5 font-mono font-medium">
                        <div className="flex items-center gap-2">
                          {hasDesc && (
                            <button
                              onClick={() => setExpanded(isOpen ? null : h.id)}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          {!hasDesc && <span className="w-3.5" />}
                          <span className="text-foreground">{h.nome}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-sm border text-[10px] font-display tracking-wide ${classeBadge}`}>
                          {CLASSE_LABEL[h.classe as ClasseType] ?? h.classe}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                        {CATEGORIA_LABEL[h.categoria as CategoriaType] ?? h.categoria}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          h.fonte === "SOBREVIVENDO_AO_HORROR"
                            ? "bg-amber-900/30 text-amber-300 border-amber-700/50"
                            : "bg-secondary/30 text-muted-foreground border-border/50"
                        }`}>
                          {FONTE_LABEL[h.fonte] ?? h.fonte}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-xs text-muted-foreground">
                        {h.nex != null ? `${h.nex}%` : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(h)}
                            className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(h)}
                            className="p-1.5 rounded hover:bg-red-950/40 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && h.descricao && (
                      <tr className="border-b border-border/30 bg-secondary/10">
                        <td colSpan={6} className="px-10 py-3">
                          <p className="text-xs font-sans text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {h.descricao}
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-mono text-sm">
                    Nenhuma habilidade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Dialog */}
      {formOpen && (
        <HabilidadeFormDialog
          open={formOpen}
          onClose={closeForm}
          initial={formInitial}
          editId={editTarget?.id ?? null}
        />
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent className="glass-panel border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display tracking-widest text-red-400">CONFIRMAR EXCLUSÃO</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-sans text-muted-foreground">
            Deseja remover <span className="font-mono text-foreground font-semibold">"{deleteTarget?.nome}"</span>?
            Esta ação não pode ser desfeita.
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
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
