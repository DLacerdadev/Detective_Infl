import { useState, useMemo, Fragment } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListRituals,
  useCreateRitual,
  useUpdateRitual,
  useDeleteRitual,
  getListRitualsQueryKey,
} from "@workspace/api-client-react";
import {
  Search, ChevronDown, ChevronUp, Flame, Skull, Brain,
  Zap, Ghost, Shuffle, Plus, Pencil, Trash2, X, Save, Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Ritual = {
  id: string;
  nome: string;
  elemento: string;
  circulo: number;
  execucao?: string | null;
  alcance?: string | null;
  alvo?: string | null;
  duracao?: string | null;
  resistencia?: string | null;
  custoPe?: number;
  descricao?: string | null;
  discente?: string | null;
  verdadeiro?: string | null;
  dados?: string | null;
  dadosDiscente?: string | null;
  dadosVerdadeiro?: string | null;
  fonte?: string | null;
};

type RitualForm = Omit<Ritual, "id">;

const EMPTY_FORM: RitualForm = {
  nome: "", elemento: "Sangue", circulo: 1,
  execucao: "", alcance: "", alvo: "", duracao: "", resistencia: "",
  custoPe: 0, descricao: "", discente: "", verdadeiro: "",
  dados: "", dadosDiscente: "", dadosVerdadeiro: "",
  fonte: "Livro Base",
};

const ELEMENTOS = ["Sangue", "Morte", "Conhecimento", "Energia", "Medo", "Variável"] as const;
const FONTES = ["Livro Base", "Sobrevivendo ao Horror"] as const;

const ELEM_CONFIG: Record<string, {
  icon: React.ReactNode;
  iconLg: React.ReactNode;
  badge: string;
  row: string;
  active: string;
  border: string;
}> = {
  Sangue:      { icon: <Flame   className="w-3 h-3" />, iconLg: <Flame   className="w-5 h-5" />, badge: "bg-red-900/60 text-red-300 border-red-700",         row: "hover:bg-red-950/20",    active: "bg-red-900/50 text-red-200",    border: "border-red-600" },
  Morte:       { icon: <Skull   className="w-3 h-3" />, iconLg: <Skull   className="w-5 h-5" />, badge: "bg-slate-700/60 text-slate-300 border-slate-600",   row: "hover:bg-slate-900/20",  active: "bg-slate-700/50 text-slate-200",border: "border-slate-500" },
  Conhecimento:{ icon: <Brain   className="w-3 h-3" />, iconLg: <Brain   className="w-5 h-5" />, badge: "bg-violet-900/60 text-violet-300 border-violet-700", row: "hover:bg-violet-950/20", active: "bg-violet-900/50 text-violet-200",border: "border-violet-600" },
  Energia:     { icon: <Zap     className="w-3 h-3" />, iconLg: <Zap     className="w-5 h-5" />, badge: "bg-yellow-900/60 text-yellow-300 border-yellow-700", row: "hover:bg-yellow-950/20", active: "bg-yellow-900/50 text-yellow-200",border: "border-yellow-600" },
  Medo:        { icon: <Ghost   className="w-3 h-3" />, iconLg: <Ghost   className="w-5 h-5" />, badge: "bg-purple-900/60 text-purple-300 border-purple-700", row: "hover:bg-purple-950/20", active: "bg-purple-900/50 text-purple-200",border: "border-purple-600" },
  Variável:    { icon: <Shuffle className="w-3 h-3" />, iconLg: <Shuffle className="w-5 h-5" />, badge: "bg-amber-900/60 text-amber-300 border-amber-700",    row: "hover:bg-amber-950/20",  active: "bg-amber-900/50 text-amber-200", border: "border-amber-600" },
};

const CIRC_BADGE: Record<number, string> = {
  1: "bg-green-900/50 text-green-300 border-green-700",
  2: "bg-blue-900/50 text-blue-300 border-blue-700",
  3: "bg-violet-900/50 text-violet-300 border-violet-700",
  4: "bg-red-900/50 text-red-300 border-red-700",
};
const CIRC_LABEL: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };
const CIRC_CONFIG: Record<number, { active: string; border: string; label: string; pe: number }> = {
  1: { active: "bg-green-900/50 text-green-200",  border: "border-green-600",  label: "1º", pe: 1  },
  2: { active: "bg-blue-900/50 text-blue-200",    border: "border-blue-600",   label: "2º", pe: 3  },
  3: { active: "bg-violet-900/50 text-violet-200",border: "border-violet-600", label: "3º", pe: 6  },
  4: { active: "bg-red-900/50 text-red-200",      border: "border-red-600",    label: "4º", pe: 10 },
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RitualFormDialog({
  open, onClose, initial, editId,
}: {
  open: boolean;
  onClose: () => void;
  initial: RitualForm;
  editId: string | null;
}) {
  const [form, setForm] = useState<RitualForm>(initial);
  const qc = useQueryClient();
  const createMut = useCreateRitual();
  const updateMut = useUpdateRitual();
  const isLoading = createMut.isPending || updateMut.isPending;

  const set = (k: keyof RitualForm, v: string | number) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    const payload = {
      nome: form.nome,
      elemento: form.elemento as any,
      circulo: Number(form.circulo),
      execucao: form.execucao || undefined,
      alcance: form.alcance || undefined,
      alvo: form.alvo || undefined,
      duracao: form.duracao || undefined,
      resistencia: form.resistencia || undefined,
      custoPe: Number(form.custoPe ?? 0),
      descricao: form.descricao || undefined,
      discente: form.discente || null,
      verdadeiro: form.verdadeiro || null,
      dados: form.dados || null,
      dadosDiscente: form.dadosDiscente || null,
      dadosVerdadeiro: form.dadosVerdadeiro || null,
      fonte: form.fonte || "Livro Base",
    } as any;

    if (editId) {
      await updateMut.mutateAsync({ id: editId, data: payload });
    } else {
      await createMut.mutateAsync({ data: payload });
    }
    await qc.invalidateQueries({ queryKey: getListRitualsQueryKey() });
    onClose();
  };

  const inputCls = "bg-secondary/30 border-border text-sm font-mono focus-visible:ring-primary";

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-panel border-border">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-lg">
            {editId ? "EDITAR RITUAL" : "NOVO RITUAL"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Row 1: nome */}
          <FieldGroup label="Nome *">
            <Input value={form.nome} onChange={e => set("nome", e.target.value)}
              placeholder="Nome do ritual" className={inputCls} />
          </FieldGroup>

          {/* Row 2: elemento */}
          <FieldGroup label="Elemento *">
            <div className="grid grid-cols-3 gap-2">
              {ELEMENTOS.map(el => {
                const cfg = ELEM_CONFIG[el];
                const selected = form.elemento === el;
                return (
                  <button
                    key={el}
                    type="button"
                    onClick={() => set("elemento", el)}
                    className={[
                      "flex items-center gap-2 px-3 py-2 rounded border text-sm font-mono transition-all",
                      selected
                        ? `${cfg.active} ${cfg.border} ring-1 ring-offset-0 ring-current`
                        : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                    ].join(" ")}
                  >
                    {cfg.iconLg}
                    <span className="font-semibold">{el}</span>
                  </button>
                );
              })}
            </div>
          </FieldGroup>

          {/* Row 3a: círculo + fonte */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Círculo *">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(c => {
                  const cfg = CIRC_CONFIG[c];
                  const selected = form.circulo === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { set("circulo", c); set("custoPe", cfg.pe); }}
                      className={[
                        "flex-1 py-2 rounded border text-sm font-display tracking-wide transition-all",
                        selected
                          ? `${cfg.active} ${cfg.border} ring-1 ring-current`
                          : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                      ].join(" ")}
                    >
                      <span className="block leading-tight">{cfg.label}</span>
                      <span className="block text-[10px] opacity-70 font-mono tracking-normal">{cfg.pe} PE</span>
                    </button>
                  );
                })}
              </div>
            </FieldGroup>
            <FieldGroup label="Fonte">
              <div className="flex gap-2 h-full">
                {FONTES.map(f => {
                  const selected = (form.fonte ?? "Livro Base") === f;
                  const short = f === "Livro Base" ? "LB" : "SaH";
                  const title = f;
                  return (
                    <button
                      key={f}
                      type="button"
                      title={title}
                      onClick={() => set("fonte", f)}
                      className={[
                        "flex-1 py-2 rounded border text-sm font-mono transition-all",
                        selected
                          ? "bg-amber-900/40 text-amber-200 border-amber-600 ring-1 ring-amber-600"
                          : "bg-secondary/20 border-border text-muted-foreground hover:bg-secondary/40",
                      ].join(" ")}
                    >
                      {short}
                    </button>
                  );
                })}
              </div>
            </FieldGroup>
          </div>

          {/* Row 3: execucao + custo PE */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Execução">
              <Input value={form.execucao ?? ""} onChange={e => set("execucao", e.target.value)}
                placeholder="Padrão / Reação / Completa..." className={inputCls} />
            </FieldGroup>
            <FieldGroup label="Custo PE">
              <Input type="number" min={0} value={form.custoPe ?? 0}
                onChange={e => set("custoPe", Number(e.target.value))} className={inputCls} />
            </FieldGroup>
          </div>

          {/* Row 4: alcance + alvo */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Alcance">
              <Input value={form.alcance ?? ""} onChange={e => set("alcance", e.target.value)}
                placeholder="Pessoal / Toque / Curto..." className={inputCls} />
            </FieldGroup>
            <FieldGroup label="Alvo / Área">
              <Input value={form.alvo ?? ""} onChange={e => set("alvo", e.target.value)}
                placeholder="1 ser / Área: explosão 6m..." className={inputCls} />
            </FieldGroup>
          </div>

          {/* Row 5: duração + resistência */}
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Duração">
              <Input value={form.duracao ?? ""} onChange={e => set("duracao", e.target.value)}
                placeholder="Cena / Instantânea / Sustentada..." className={inputCls} />
            </FieldGroup>
            <FieldGroup label="Resistência">
              <Input value={form.resistencia ?? ""} onChange={e => set("resistencia", e.target.value)}
                placeholder="Vontade anula / Fortitude reduz..." className={inputCls} />
            </FieldGroup>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 pt-2">
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Texto do Ritual</p>
          </div>

          {/* Efeito base */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Efeito (descrição base)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Dados</span>
                <Input value={form.dados ?? ""} onChange={e => set("dados", e.target.value)}
                  placeholder="ex: 3d4+3" className={inputCls + " w-28 h-7 text-xs font-mono"} />
              </div>
            </div>
            <Textarea value={form.descricao ?? ""} onChange={e => set("descricao", e.target.value)}
              placeholder="Descreva o efeito do ritual..." rows={3}
              className={inputCls + " resize-none"} />
          </div>

          {/* Discente */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-display uppercase tracking-widest text-blue-400/80">Discente (versão aprimorada — opcional)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display uppercase tracking-widest text-blue-400/60">Dados</span>
                <Input value={form.dadosDiscente ?? ""} onChange={e => set("dadosDiscente", e.target.value)}
                  placeholder="ex: 4d4+4" className={inputCls + " w-28 h-7 text-xs font-mono border-blue-800/50 focus-visible:ring-blue-500"} />
              </div>
            </div>
            <Textarea value={form.discente ?? ""} onChange={e => set("discente", e.target.value)}
              placeholder="(+X PE): ..." rows={2}
              className={inputCls + " resize-none border-blue-800/50 focus-visible:ring-blue-500"} />
          </div>

          {/* Verdadeiro */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-display uppercase tracking-widest text-red-400/80">Verdadeiro (versão poderosa — opcional)</Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display uppercase tracking-widest text-red-400/60">Dados</span>
                <Input value={form.dadosVerdadeiro ?? ""} onChange={e => set("dadosVerdadeiro", e.target.value)}
                  placeholder="ex: 6d4+6" className={inputCls + " w-28 h-7 text-xs font-mono border-red-800/50 focus-visible:ring-red-500"} />
              </div>
            </div>
            <Textarea value={form.verdadeiro ?? ""} onChange={e => set("verdadeiro", e.target.value)}
              placeholder="(+X PE): ... Requer Xº círculo e afinidade." rows={2}
              className={inputCls + " resize-none border-red-800/50 focus-visible:ring-red-500"} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !form.nome || !form.elemento}
            className="bg-primary hover:bg-primary/80">
            {isLoading
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            {editId ? "Salvar alterações" : "Criar ritual"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RituaisAdminTab() {
  const { data: rituais, isLoading } = useListRituals();
  const [search, setSearch] = useState("");
  const [filterElem, setFilterElem] = useState<string | null>(null);
  const [filterCirc, setFilterCirc] = useState<number | null>(null);
  const [filterFonte, setFilterFonte] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Ritual | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ritual | null>(null);

  const qc = useQueryClient();
  const deleteMut = useDeleteRitual();

  const lista = useMemo(() => {
    let r = (rituais as Ritual[] ?? []);
    if (filterElem)  r = r.filter(x => x.elemento === filterElem);
    if (filterCirc)  r = r.filter(x => x.circulo === filterCirc);
    if (filterFonte) r = r.filter(x => x.fonte === filterFonte);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(x =>
        x.nome.toLowerCase().includes(q) ||
        (x.descricao ?? "").toLowerCase().includes(q) ||
        (x.execucao ?? "").toLowerCase().includes(q)
      );
    }
    return r;
  }, [rituais, filterElem, filterCirc, filterFonte, search]);

  const counts = useMemo(() => {
    const all = (rituais as Ritual[] ?? []);
    const byElem: Record<string, number> = {};
    const byCirc: Record<number, number> = {};
    all.forEach(r => {
      byElem[r.elemento] = (byElem[r.elemento] || 0) + 1;
      byCirc[r.circulo]  = (byCirc[r.circulo]  || 0) + 1;
    });
    return { total: all.length, byElem, byCirc };
  }, [rituais]);

  const openNew = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (r: Ritual) => { setEditTarget(r); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMut.mutateAsync({ id: deleteTarget.id });
    await qc.invalidateQueries({ queryKey: getListRitualsQueryKey() });
    setDeleteTarget(null);
  };

  const formInitial: RitualForm = editTarget
    ? { nome: editTarget.nome, elemento: editTarget.elemento, circulo: editTarget.circulo,
        execucao: editTarget.execucao ?? "", alcance: editTarget.alcance ?? "",
        alvo: editTarget.alvo ?? "", duracao: editTarget.duracao ?? "",
        resistencia: editTarget.resistencia ?? "", custoPe: editTarget.custoPe ?? 0,
        descricao: editTarget.descricao ?? "", discente: editTarget.discente ?? "",
        verdadeiro: editTarget.verdadeiro ?? "", fonte: editTarget.fonte ?? "Livro Base" }
    : EMPTY_FORM;

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando rituais...</div>;

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card className="glass-panel px-4 py-3 text-center">
          <p className="text-2xl font-display text-primary">{counts.total}</p>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Total</p>
        </Card>
        {[1, 2, 3, 4].map(c => (
          <Card key={c} className="glass-panel px-4 py-3 text-center">
            <p className="text-2xl font-display text-primary">{counts.byCirc[c] ?? 0}</p>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{CIRC_LABEL[c]}º Círculo</p>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ritual..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/30 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {Object.keys(ELEM_CONFIG).map(el => (
          <button key={el} onClick={() => setFilterElem(filterElem === el ? null : el)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterElem === el ? ELEM_CONFIG[el].badge + " opacity-100" : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}>
            {ELEM_CONFIG[el].icon}{el}
            <span className="ml-0.5 opacity-75">({counts.byElem[el] ?? 0})</span>
          </button>
        ))}

        {[1, 2, 3, 4].map(c => (
          <button key={c} onClick={() => setFilterCirc(filterCirc === c ? null : c)}
            className={`px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterCirc === c ? CIRC_BADGE[c] + " opacity-100" : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}>
            {CIRC_LABEL[c]}
          </button>
        ))}

        {FONTES.map(f => (
          <button key={f} onClick={() => setFilterFonte(filterFonte === f ? null : f)}
            className={`px-2.5 py-1 rounded border text-[11px] font-mono tracking-wide transition-all ${
              filterFonte === f ? "bg-primary/20 text-primary border-primary/50" : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}>
            {f === "Sobrevivendo ao Horror" ? "SUPL" : "LB"}
          </button>
        ))}

        <span className="text-xs font-mono text-muted-foreground">{lista.length} resultado{lista.length !== 1 ? "s" : ""}</span>

        <Button onClick={openNew} size="sm" className="ml-auto bg-primary hover:bg-primary/80 font-display tracking-wide">
          <Plus className="w-4 h-4 mr-1" /> Novo Ritual
        </Button>
      </div>

      {/* Table */}
      <Card className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Nome</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Elemento</th>
                <th className="text-center px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Círculo</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Execução</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Alcance</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Duração</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Fonte</th>
                <th className="text-center px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">D/V</th>
                <th className="px-3 py-2.5 text-[11px] uppercase font-display tracking-wider text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(r => {
                const ec = ELEM_CONFIG[r.elemento] ?? ELEM_CONFIG["Variável"];
                const isOpen = expanded === r.id;
                const hasDetail = !!(r.descricao || r.discente || r.verdadeiro);
                return (
                  <Fragment key={r.id}>
                    <tr className={`border-b border-border/40 transition-colors group ${ec.row}`}>
                      <td className="px-4 py-2.5 font-mono font-medium">
                        <div className="flex items-center gap-2">
                          <button onClick={() => hasDetail && setExpanded(isOpen ? null : r.id)}
                            className={hasDetail ? "cursor-pointer" : "cursor-default"}>
                            {hasDetail
                              ? isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              : <span className="w-3 h-3 block" />}
                          </button>
                          <span onClick={() => hasDetail && setExpanded(isOpen ? null : r.id)}
                            className={hasDetail ? "cursor-pointer" : ""}>{r.nome}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-display tracking-wide ${ec.badge}`}>
                          {ec.icon}{r.elemento}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-display tracking-wide ${CIRC_BADGE[r.circulo] ?? ""}`}>
                          {CIRC_LABEL[r.circulo]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.execucao || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.alcance || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.duracao || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono">
                        {r.fonte === "Sobrevivendo ao Horror"
                          ? <span className="px-1.5 py-0.5 rounded border border-amber-700 bg-amber-900/30 text-amber-300 text-[9px] font-display tracking-wide">SUPL</span>
                          : <span className="text-muted-foreground">LB</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs font-mono text-muted-foreground">
                        {r.discente && r.verdadeiro ? "D+V" : r.discente ? "D" : r.verdadeiro ? "V" : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(r)}
                            className="p-1.5 rounded hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                            title="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(r)}
                            className="p-1.5 rounded hover:bg-red-900/40 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Excluir">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isOpen && hasDetail && (
                      <tr className="border-b border-border/40 bg-black/20">
                        <td colSpan={9} className="px-10 py-4">
                          <div className="space-y-3 max-w-3xl">
                            {r.descricao && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Efeito</p>
                                <p className="text-xs font-mono text-foreground/80 leading-relaxed">{r.descricao}</p>
                              </div>
                            )}
                            {r.discente && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-blue-400 mb-1">Discente</p>
                                <p className="text-xs font-mono text-foreground/70 leading-relaxed">{r.discente}</p>
                              </div>
                            )}
                            {r.verdadeiro && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-red-400 mb-1">Verdadeiro</p>
                                <p className="text-xs font-mono text-foreground/70 leading-relaxed">{r.verdadeiro}</p>
                              </div>
                            )}
                            {r.alvo && (
                              <p className="text-[10px] font-mono text-muted-foreground">
                                Alvo: {r.alvo}{r.resistencia ? ` | Resistência: ${r.resistencia}` : ""}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && (
            <p className="text-center py-12 text-muted-foreground font-mono text-sm">Nenhum ritual encontrado.</p>
          )}
        </div>
      </Card>

      {/* Form dialog (create / edit) */}
      {formOpen && (
        <RitualFormDialog
          open={formOpen}
          onClose={closeForm}
          initial={formInitial}
          editId={editTarget?.id ?? null}
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <DialogContent className="glass-panel border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider text-red-400">CONFIRMAR EXCLUSÃO</DialogTitle>
          </DialogHeader>
          <p className="font-mono text-sm text-muted-foreground py-2">
            Tem certeza que deseja excluir o ritual{" "}
            <span className="text-foreground font-semibold">"{deleteTarget?.nome}"</span>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleteMut.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleDelete} disabled={deleteMut.isPending}
              className="bg-red-700 hover:bg-red-600 text-white font-display tracking-wide">
              {deleteMut.isPending
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
