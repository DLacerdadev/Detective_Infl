import { useState, useMemo, useEffect } from "react";
import {
  useListItens, useCreateItemMut, useUpdateItemMut, useDeleteItemMut,
  ItemCompendio, ItemInput,
} from "@workspace/api-client-react";
import {
  Plus, Pencil, Trash2, Search, X, Save, Loader2, Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// ── Constants ──────────────────────────────────────────────────────────────

const TIPOS = ["ARMA", "PROTECAO", "MUNICAO", "GERAL"] as const;

const SUBTIPOS_ARMA = [
  "CORPO_LEVE", "CORPO_UMA_MAO", "CORPO_DUAS_MAOS",
  "DISPARO_DUAS_MAOS", "FOGO_LEVE", "FOGO_UMA_MAO", "FOGO_DUAS_MAOS",
  "PESADA", "ARREMESSO",
];
const SUBTIPOS_GERAL = [
  "ACESSORIO", "EXPLOSIVO", "OPERACIONAL", "MEDICAMENTO", "PARANORMAL",
];

const PROFICIENCIAS = ["SIMPLES", "TATICA", "PESADA"] as const;

const CATEGORIAS = ["0", "I", "II", "III", "IV"] as const;

const FONTES: { value: string; label: string }[] = [
  { value: "LIVRO_BASE",          label: "Livro Base" },
  { value: "SOBREVIVENDO_AO_HORROR", label: "Sobrevivendo ao Horror" },
  { value: "OUTRO",               label: "Outro" },
];

const PROPRIEDADES = [
  { value: "agil",       label: "Ágil" },
  { value: "automatica", label: "Automática" },
  { value: "area",       label: "Área" },
  { value: "arremesso",  label: "Arremesso" },
  { value: "forca_dano", label: "Força no Dano" },
  { value: "versatil",   label: "Versátil" },
  { value: "linha",      label: "Linha" },
  { value: "discreta",   label: "Discreta" },
];

const TIPO_ATAQUE_OPTS = ["C", "I", "P", "B", "Fogo", "Varia"];

// ── Helpers ────────────────────────────────────────────────────────────────

function subtitleLabel(item: ItemCompendio) {
  if (item.subtipo) return formatSnake(item.subtipo);
  return formatSnake(item.tipo);
}

function formatSnake(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoriaColor(cat: string | null) {
  switch (cat) {
    case "I":   return "bg-blue-900/60 text-blue-200 border-blue-700";
    case "II":  return "bg-yellow-900/60 text-yellow-200 border-yellow-700";
    case "III": return "bg-orange-900/60 text-orange-200 border-orange-700";
    case "IV":  return "bg-red-900/60 text-red-200 border-red-700";
    default:    return "bg-secondary text-muted-foreground border-border";
  }
}

function fonteLabel(f: string) {
  return FONTES.find((x) => x.value === f)?.label ?? f;
}

// ── Empty form ─────────────────────────────────────────────────────────────

const EMPTY: ItemInput = {
  nome: "", tipo: "GERAL", subtipo: null, proficiencia: null, descricao: null,
  espacos: 1, categoria: "0", dano: null, critico: null, alcance: null,
  tipoAtaque: null, defesa: null, propriedades: [], fonte: "LIVRO_BASE",
};

function toForm(item: ItemCompendio): ItemInput {
  return {
    nome: item.nome, tipo: item.tipo, subtipo: item.subtipo ?? null,
    proficiencia: item.proficiencia ?? null, descricao: item.descricao ?? null,
    espacos: item.espacos ?? 1, categoria: item.categoria ?? "0",
    dano: item.dano ?? null, critico: item.critico ?? null,
    alcance: item.alcance ?? null, tipoAtaque: item.tipoAtaque ?? null,
    defesa: item.defesa ?? null, propriedades: item.propriedades ?? [],
    fonte: item.fonte,
  };
}

// ── Form dialog ────────────────────────────────────────────────────────────

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: ItemInput;
  onSave: (data: ItemInput) => void;
  saving: boolean;
  title: string;
}

function ItemFormDialog({ open, onClose, initial = EMPTY, onSave, saving, title }: FormDialogProps) {
  const [form, setForm] = useState<ItemInput>(initial);

  // Reset when dialog opens with new initial
  useEffect(() => { if (open) setForm(initial); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof ItemInput>(key: K, val: ItemInput[K]) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      // Reset tipo-specific fields when tipo changes
      if (key === "tipo") {
        next.subtipo = null;
        next.proficiencia = null;
        next.dano = null; next.critico = null; next.alcance = null; next.tipoAtaque = null;
        next.defesa = null; next.propriedades = [];
      }
      return next;
    });
  }

  const isArma = form.tipo === "ARMA";
  const isProtecao = form.tipo === "PROTECAO";
  const isGeral = form.tipo === "GERAL";
  const subtipos = isArma ? SUBTIPOS_ARMA : isGeral ? SUBTIPOS_GERAL : [];

  function toggleProp(p: string) {
    const props = form.propriedades ?? [];
    set("propriedades", props.includes(p) ? props.filter((x) => x !== p) : [...props, p]);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-mono text-primary">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Nome */}
          <div className="col-span-2">
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">NOME *</Label>
            <Input value={form.nome} onChange={(e) => set("nome", e.target.value)}
              placeholder="Nome do item" className="bg-secondary/30 border-border font-mono" />
          </div>

          {/* Tipo */}
          <div>
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">TIPO</Label>
            <Select value={form.tipo} onValueChange={(v) => set("tipo", v)}>
              <SelectTrigger className="bg-secondary/30 border-border font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t} value={t}>{formatSnake(t)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtipo */}
          {subtipos.length > 0 && (
            <div>
              <Label className="font-mono text-xs text-muted-foreground mb-1 block">SUBTIPO</Label>
              <Select value={form.subtipo ?? "_none"} onValueChange={(v) => set("subtipo", v === "_none" ? null : v)}>
                <SelectTrigger className="bg-secondary/30 border-border font-mono">
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— Nenhum —</SelectItem>
                  {subtipos.map((s) => (
                    <SelectItem key={s} value={s}>{formatSnake(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Proficiência (armas) */}
          {isArma && (
            <div>
              <Label className="font-mono text-xs text-muted-foreground mb-1 block">PROFICIÊNCIA</Label>
              <Select value={form.proficiencia ?? "_none"} onValueChange={(v) => set("proficiencia", v === "_none" ? null : v)}>
                <SelectTrigger className="bg-secondary/30 border-border font-mono">
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">— Nenhuma —</SelectItem>
                  {PROFICIENCIAS.map((p) => (
                    <SelectItem key={p} value={p}>{formatSnake(p)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Categoria */}
          <div>
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">CATEGORIA</Label>
            <Select value={form.categoria ?? "0"} onValueChange={(v) => set("categoria", v)}>
              <SelectTrigger className="bg-secondary/30 border-border font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c} value={c}>Cat. {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Espaços */}
          <div>
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">ESPAÇOS</Label>
            <Input type="number" min={0} step={0.5} value={form.espacos ?? 1}
              onChange={(e) => set("espacos", parseFloat(e.target.value) || 0)}
              className="bg-secondary/30 border-border font-mono" />
          </div>

          {/* Fonte */}
          <div>
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">FONTE</Label>
            <Select value={form.fonte} onValueChange={(v) => set("fonte", v)}>
              <SelectTrigger className="bg-secondary/30 border-border font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTES.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weapon stats */}
          {isArma && (
            <>
              <Separator className="col-span-2 my-1" />
              <div className="col-span-2 font-mono text-xs text-muted-foreground font-semibold tracking-widest">ESTATÍSTICAS DE ARMA</div>

              <div>
                <Label className="font-mono text-xs text-muted-foreground mb-1 block">DANO</Label>
                <Input value={form.dano ?? ""} onChange={(e) => set("dano", e.target.value || null)}
                  placeholder="ex: 1d6+2" className="bg-secondary/30 border-border font-mono" />
              </div>
              <div>
                <Label className="font-mono text-xs text-muted-foreground mb-1 block">CRÍTICO</Label>
                <Input value={form.critico ?? ""} onChange={(e) => set("critico", e.target.value || null)}
                  placeholder="ex: 19-20/×2" className="bg-secondary/30 border-border font-mono" />
              </div>
              <div>
                <Label className="font-mono text-xs text-muted-foreground mb-1 block">ALCANCE</Label>
                <Input value={form.alcance ?? ""} onChange={(e) => set("alcance", e.target.value || null)}
                  placeholder="ex: 9m / 18m" className="bg-secondary/30 border-border font-mono" />
              </div>
              <div>
                <Label className="font-mono text-xs text-muted-foreground mb-1 block">TIPO DE ATAQUE</Label>
                <Select value={form.tipoAtaque ?? "_none"} onValueChange={(v) => set("tipoAtaque", v === "_none" ? null : v)}>
                  <SelectTrigger className="bg-secondary/30 border-border font-mono">
                    <SelectValue placeholder="Selecionar…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">— Nenhum —</SelectItem>
                    {TIPO_ATAQUE_OPTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Propriedades */}
              <div className="col-span-2">
                <Label className="font-mono text-xs text-muted-foreground mb-2 block">PROPRIEDADES</Label>
                <div className="flex flex-wrap gap-3">
                  {PROPRIEDADES.map((p) => (
                    <label key={p.value} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox checked={(form.propriedades ?? []).includes(p.value)}
                        onCheckedChange={() => toggleProp(p.value)}
                        className="border-border" />
                      <span className="font-mono text-xs">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Protection stats */}
          {isProtecao && (
            <>
              <Separator className="col-span-2 my-1" />
              <div className="col-span-2 font-mono text-xs text-muted-foreground font-semibold tracking-widest">ESTATÍSTICAS DE PROTEÇÃO</div>
              <div>
                <Label className="font-mono text-xs text-muted-foreground mb-1 block">DEFESA</Label>
                <Input type="number" min={0} value={form.defesa ?? ""}
                  onChange={(e) => set("defesa", e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-secondary/30 border-border font-mono" />
              </div>
            </>
          )}

          {/* Descrição */}
          <Separator className="col-span-2 my-1" />
          <div className="col-span-2">
            <Label className="font-mono text-xs text-muted-foreground mb-1 block">DESCRIÇÃO</Label>
            <Textarea value={form.descricao ?? ""} onChange={(e) => set("descricao", e.target.value || null)}
              rows={3} placeholder="Descrição do item…"
              className="bg-secondary/30 border-border font-mono text-sm resize-none" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="font-mono gap-1.5">
            <X className="h-3.5 w-3.5" /> Cancelar
          </Button>
          <Button onClick={() => onSave(form)} disabled={saving || !form.nome.trim()}
            className="font-mono gap-1.5 bg-primary hover:bg-primary/80">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function EquipamentosAdminTab() {
  const { data: itens = [], isLoading } = useListItens();
  const createMut = useCreateItemMut();
  const updateMut = useUpdateItemMut();
  const deleteMut = useDeleteItemMut();

  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("_all");
  const [filterCat, setFilterCat] = useState<string>("_all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemCompendio | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return itens.filter((i) => {
      if (filterTipo !== "_all" && i.tipo !== filterTipo) return false;
      if (filterCat !== "_all" && (i.categoria ?? "0") !== filterCat) return false;
      if (q && !i.nome.toLowerCase().includes(q) && !(i.subtipo ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [itens, search, filterTipo, filterCat]);

  function handleCreate(data: ItemInput) {
    createMut.mutate(data, { onSuccess: () => setCreateOpen(false) });
  }

  function handleUpdate(data: ItemInput) {
    if (!editItem) return;
    updateMut.mutate({ id: editItem.id, data }, { onSuccess: () => setEditItem(null) });
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  }

  const deleteTarget = itens.find((i) => i.id === deleteId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item…"
              className="pl-8 font-mono text-sm bg-secondary/30 border-border" />
          </div>
          {/* Tipo filter */}
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todos os tipos</SelectItem>
              {TIPOS.map((t) => <SelectItem key={t} value={t}>{formatSnake(t)}</SelectItem>)}
            </SelectContent>
          </Select>
          {/* Categoria filter */}
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-32 bg-secondary/30 border-border font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todas cats.</SelectItem>
              {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>Cat. {c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setCreateOpen(true)}
          className="font-mono gap-1.5 bg-primary hover:bg-primary/80 shrink-0">
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </div>

      {/* Count */}
      <p className="font-mono text-xs text-muted-foreground">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        {itens.length !== filtered.length && ` de ${itens.length}`}
      </p>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground font-mono text-sm animate-pulse">Carregando equipamentos…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
          Nenhum item encontrado.
        </div>
      ) : (
        <Card className="border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="font-mono text-xs text-muted-foreground text-left px-3 py-2 w-16">CAT.</th>
                  <th className="font-mono text-xs text-muted-foreground text-left px-3 py-2">NOME</th>
                  <th className="font-mono text-xs text-muted-foreground text-left px-3 py-2 hidden sm:table-cell">TIPO</th>
                  <th className="font-mono text-xs text-muted-foreground text-left px-3 py-2 hidden md:table-cell">STATS</th>
                  <th className="font-mono text-xs text-muted-foreground text-left px-3 py-2 hidden lg:table-cell">FONTE</th>
                  <th className="font-mono text-xs text-muted-foreground text-right px-3 py-2">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.id}
                    className={`border-b border-border/50 hover:bg-secondary/10 transition-colors ${idx % 2 === 0 ? "" : "bg-secondary/5"}`}>
                    <td className="px-3 py-2">
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded border ${categoriaColor(item.categoria)}`}>
                        {item.categoria ?? "0"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-sm font-medium">{item.nome}</span>
                      {item.propriedades?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.propriedades.map((p) => (
                            <span key={p} className="font-mono text-[10px] text-muted-foreground bg-secondary/30 px-1 rounded">{p}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      <div className="font-mono text-xs">{formatSnake(item.tipo)}</div>
                      {item.subtipo && <div className="font-mono text-[10px] text-muted-foreground">{formatSnake(item.subtipo)}</div>}
                      {item.proficiencia && <div className="font-mono text-[10px] text-primary/70">{formatSnake(item.proficiencia)}</div>}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell font-mono text-xs text-muted-foreground">
                      {item.dano && <div>Dano: <span className="text-foreground">{item.dano}</span></div>}
                      {item.defesa != null && <div>Def: <span className="text-foreground">{item.defesa}</span></div>}
                      <div>{item.espacos ?? 1} espaço{(item.espacos ?? 1) !== 1 ? "s" : ""}</div>
                    </td>
                    <td className="px-3 py-2 hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {fonteLabel(item.fonte)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost"
                          className="h-7 w-7 hover:text-primary hover:bg-primary/10"
                          onClick={() => setEditItem(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost"
                          className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteId(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create dialog */}
      <ItemFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        saving={createMut.isPending}
        title="NOVO EQUIPAMENTO"
      />

      {/* Edit dialog */}
      <ItemFormDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        initial={editItem ? toForm(editItem) : EMPTY}
        onSave={handleUpdate}
        saving={updateMut.isPending}
        title="EDITAR EQUIPAMENTO"
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-destructive">CONFIRMAR EXCLUSÃO</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-sm">
              Tem certeza que deseja excluir <strong>{deleteTarget?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              disabled={deleteMut.isPending}
              className="font-mono bg-destructive hover:bg-destructive/80 gap-1.5">
              {deleteMut.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
