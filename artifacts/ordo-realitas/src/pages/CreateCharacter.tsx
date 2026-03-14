import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useListClasses, useListOrigins, useListRituals, type Ritual } from "@workspace/api-client-react";
import { useCreateCharacterMut } from "@/hooks/use-api-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Search, Lock, CheckCircle2, Circle, Sparkles } from "lucide-react";

// ── static pericias ───────────────────────────────────────────────────────
type PericiaStatic = {
  id: string;
  nome: string;
  atributo: "FOR" | "AGI" | "INT" | "PRE" | "VIG";
  somenteTrainada: boolean;
};

const PERICIAS_LISTA: PericiaStatic[] = [
  { id: "per-001", nome: "Acrobacia",     atributo: "AGI", somenteTrainada: false },
  { id: "per-002", nome: "Adestramento",  atributo: "PRE", somenteTrainada: true  },
  { id: "per-003", nome: "Artes",         atributo: "PRE", somenteTrainada: true  },
  { id: "per-004", nome: "Atletismo",     atributo: "FOR", somenteTrainada: false },
  { id: "per-005", nome: "Atualidades",   atributo: "INT", somenteTrainada: false },
  { id: "per-006", nome: "Ciências",      atributo: "INT", somenteTrainada: true  },
  { id: "per-007", nome: "Crime",         atributo: "AGI", somenteTrainada: true  },
  { id: "per-008", nome: "Diplomacia",    atributo: "PRE", somenteTrainada: false },
  { id: "per-009", nome: "Enganação",     atributo: "PRE", somenteTrainada: false },
  { id: "per-010", nome: "Fortitude",     atributo: "VIG", somenteTrainada: false },
  { id: "per-011", nome: "Furtividade",   atributo: "AGI", somenteTrainada: false },
  { id: "per-012", nome: "Iniciativa",    atributo: "AGI", somenteTrainada: false },
  { id: "per-013", nome: "Intimidação",   atributo: "PRE", somenteTrainada: false },
  { id: "per-014", nome: "Intuição",      atributo: "INT", somenteTrainada: false },
  { id: "per-015", nome: "Investigação",  atributo: "INT", somenteTrainada: false },
  { id: "per-016", nome: "Luta",          atributo: "FOR", somenteTrainada: false },
  { id: "per-017", nome: "Medicina",      atributo: "INT", somenteTrainada: false },
  { id: "per-018", nome: "Ocultismo",     atributo: "INT", somenteTrainada: true  },
  { id: "per-019", nome: "Percepção",     atributo: "PRE", somenteTrainada: false },
  { id: "per-020", nome: "Pilotagem",     atributo: "AGI", somenteTrainada: true  },
  { id: "per-021", nome: "Pontaria",      atributo: "AGI", somenteTrainada: false },
  { id: "per-022", nome: "Profissão",     atributo: "INT", somenteTrainada: true  },
  { id: "per-023", nome: "Reflexos",      atributo: "AGI", somenteTrainada: false },
  { id: "per-024", nome: "Religião",      atributo: "PRE", somenteTrainada: true  },
  { id: "per-025", nome: "Sobrevivência", atributo: "INT", somenteTrainada: false },
  { id: "per-026", nome: "Tática",        atributo: "INT", somenteTrainada: true  },
  { id: "per-027", nome: "Tecnologia",    atributo: "INT", somenteTrainada: true  },
  { id: "per-028", nome: "Vontade",       atributo: "PRE", somenteTrainada: false },
];

/** Normalise a péricia name for comparison (remove accents, lowercase) */
function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const ATR_COLOR: Record<string, string> = {
  FOR: "bg-red-500 text-white",
  AGI: "bg-blue-500 text-white",
  INT: "bg-amber-500 text-background",
  PRE: "bg-purple-500 text-white",
  VIG: "bg-green-600 text-white",
};

// ── class pericias config ─────────────────────────────────────────────────
type GrupoEscolha = { opcoes: string[]; label: string };
type ClassePericiaConfig = { fixas: string[]; grupos: GrupoEscolha[] };

const CLASSE_PERICIAS: Record<string, ClassePericiaConfig> = {
  Combatente: {
    fixas: [],
    grupos: [
      { opcoes: ["Luta", "Pontaria"],      label: "Escolha uma perícia de ataque" },
      { opcoes: ["Reflexos", "Fortitude"], label: "Escolha uma perícia de defesa" },
    ],
  },
  Especialista: { fixas: [], grupos: [] },
  Ocultista:    { fixas: ["Ocultismo", "Vontade"], grupos: [] },
  Sobrevivente: { fixas: [], grupos: [] },
};

// ── form schema ───────────────────────────────────────────────────────────
const characterSchema = z.object({
  nome:      z.string().min(2, "Nome muito curto"),
  historia:  z.string().optional(),
  classeId:  z.string().min(1, "Selecione uma classe"),
  origemId:  z.string().min(1, "Selecione uma origem"),
  forca:     z.number().min(0).max(3),
  agilidade: z.number().min(0).max(3),
  intelecto: z.number().min(0).max(3),
  vigor:     z.number().min(0).max(3),
  presenca:  z.number().min(0).max(3),
  pericias:  z.array(z.string()).default([]),
});

type FormData = z.infer<typeof characterSchema>;

// ── locked badge helper ───────────────────────────────────────────────────
function LockedBadge({ nome, color }: { nome: string; color: "amber" | "blue" }) {
  const p = PERICIAS_LISTA.find((x) => norm(x.nome) === norm(nome));
  const bg   = color === "amber" ? "bg-amber-500/15 border-amber-500/40" : "bg-blue-500/15 border-blue-500/35";
  const text = color === "amber" ? "text-amber-300" : "text-blue-400";
  const icon = color === "amber" ? "text-amber-400" : "text-blue-400";
  return (
    <div className={`flex items-center gap-1.5 ${bg} border rounded-sm px-3 py-1.5`}>
      <Lock className={`h-3 w-3 ${icon} shrink-0`} />
      <span className={`text-sm font-semibold ${text}`}>{nome}</span>
      {p && <span className={`text-[9px] font-bold rounded-sm px-1 py-0.5 ml-1 ${ATR_COLOR[p.atributo]}`}>{p.atributo}</span>}
    </div>
  );
}

// ── element config ─────────────────────────────────────────────────────────
const ELEM_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Sangue:       { label: "Sangue",       color: "text-red-400",    bg: "bg-red-900/20",    border: "border-red-700/50" },
  Morte:        { label: "Morte",        color: "text-slate-400",  bg: "bg-slate-900/30",  border: "border-slate-600/50" },
  Conhecimento: { label: "Conhecimento", color: "text-cyan-400",   bg: "bg-cyan-900/20",   border: "border-cyan-700/50" },
  Energia:      { label: "Energia",      color: "text-yellow-400", bg: "bg-yellow-900/20", border: "border-yellow-700/50" },
  Medo:         { label: "Medo",         color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-700/50" },
  "Variável":   { label: "Variável",     color: "text-slate-400",  bg: "bg-slate-800/20",  border: "border-slate-600/50" },
};

// ── component ─────────────────────────────────────────────────────────────
export default function CreateCharacter() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [periciaSearch, setPericiaSearch] = useState("");
  const [classeGrupoChoices, setClasseGrupoChoices] = useState<(string | null)[]>([null, null]);
  const [selectedRituais, setSelectedRituais] = useState<string[]>([]);
  const [ritualSearch, setRitualSearch] = useState("");
  const [ritualElementFilter, setRitualElementFilter] = useState<string>("todos");

  const { data: classes } = useListClasses();
  const { data: origins } = useListOrigins();
  const { data: allRituais } = useListRituals();
  const createMut = useCreateCharacterMut();

  const form = useForm<FormData>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      nome: "", historia: "", classeId: "", origemId: "",
      forca: 1, agilidade: 1, intelecto: 1, vigor: 1, presenca: 1,
      pericias: [],
    },
  });

  // ── watched values ────────────────────────────────────────────────────
  const watchedClasseId  = form.watch("classeId");
  const watchedOrigemId  = form.watch("origemId");
  const watchedPericias  = form.watch("pericias");
  const watchedIntelecto = form.watch("intelecto");

  const selectedClass  = (classes as any[])?.find((c: any) => c.id === watchedClasseId);
  const selectedOrigin = (origins as any[])?.find((o: any) => o.id === watchedOrigemId);
  const isOcultista = selectedClass?.nome === "Ocultista";

  const classeConfig: ClassePericiaConfig =
    CLASSE_PERICIAS[selectedClass?.nome ?? ""] ?? { fixas: [], grupos: [] };

  // Reset grupo choices when class changes
  useMemo(() => {
    setClasseGrupoChoices(new Array(Math.max(classeConfig.grupos.length, 2)).fill(null));
  }, [watchedClasseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset ritual selection and clamp step when class changes
  useEffect(() => {
    setSelectedRituais([]);
    setRitualSearch("");
    setRitualElementFilter("todos");
    setStep((s) => Math.min(s, isOcultista ? 6 : 5));
  }, [watchedClasseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // First-circle rituals filtered and searched
  const rituaisPrimeirCirculo = useMemo(() => {
    const q = ritualSearch.toLowerCase().trim();
    return ((allRituais as Ritual[]) ?? [])
      .filter((r) => r.circulo === 1)
      .filter((r) => ritualElementFilter === "todos" || r.elemento === ritualElementFilter)
      .filter((r) => !q || r.nome.toLowerCase().includes(q) || r.elemento.toLowerCase().includes(q));
  }, [allRituais, ritualSearch, ritualElementFilter]);

  const ritualElementos = useMemo(() => {
    const set = new Set<string>();
    ((allRituais as Ritual[]) ?? []).filter((r) => r.circulo === 1).forEach((r) => set.add(r.elemento));
    return Array.from(set).sort();
  }, [allRituais]);

  const toggleRitual = (id: string) => {
    setSelectedRituais((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  // Pericias from class (fixas + grupo selections)
  const periciasDaClasse: string[] = [
    ...classeConfig.fixas,
    ...classeGrupoChoices.slice(0, classeConfig.grupos.length).filter(Boolean) as string[],
  ];

  // Pericias from origin
  const periciasDaOrigem: string[] = selectedOrigin?.periciasConcedidas ?? [];

  // Normalised set of all granted names (used for filtering)
  const bloqueadasSet = useMemo(() => {
    return new Set([...periciasDaClasse, ...periciasDaOrigem].map(norm));
  }, [periciasDaClasse, periciasDaOrigem]);

  // Free choices limit
  const limiteEscolhas = (selectedClass?.periciasTreindasBase ?? 3) + watchedIntelecto;

  // Free manual selections (excluding already granted)
  const periciasManuais = watchedPericias.filter((p) => !bloqueadasSet.has(norm(p)));

  // Filtered grid (excluding granted)
  const periciasFiltradas = useMemo(() => {
    const q = norm(periciaSearch);
    return PERICIAS_LISTA.filter((p) => {
      if (bloqueadasSet.has(norm(p.nome))) return false;
      if (!q) return true;
      return norm(p.nome).includes(q) || p.atributo.toLowerCase().includes(q);
    });
  }, [periciaSearch, bloqueadasSet]);

  const togglePericia = (nome: string) => {
    if (bloqueadasSet.has(norm(nome))) return;
    const current = form.getValues("pericias");
    const isSelected = current.includes(nome);
    if (isSelected) {
      form.setValue("pericias", current.filter((p) => p !== nome));
    } else {
      if (periciasManuais.length >= limiteEscolhas) return;
      form.setValue("pericias", [...current, nome]);
    }
  };

  const setGrupoChoice = (gi: number, nome: string) => {
    setClasseGrupoChoices((prev) => {
      const next = [...prev];
      next[gi] = next[gi] === nome ? null : nome;
      return next;
    });
  };

  // ── atributos ─────────────────────────────────────────────────────────
  const attrPointsTotal = 4;
  const currentTotal =
    form.watch("forca") + form.watch("agilidade") + form.watch("intelecto") +
    form.watch("vigor") + form.watch("presenca");
  const pointsRemaining = attrPointsTotal - (currentTotal - 5);

  // ── navigation ────────────────────────────────────────────────────────
  const TOTAL_STEPS = isOcultista ? 6 : 5;

  const STEP_LABELS = isOcultista
    ? ["Identificação", "Classe", "Origem", "Atributos", "Perícias", "Rituais"]
    : ["Identificação", "Classe", "Origem", "Atributos", "Perícias"];

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await form.trigger(["nome"]);
    if (step === 2) valid = await form.trigger(["classeId"]);
    if (step === 3) valid = await form.trigger(["origemId"]);
    if (step === 4) {
      valid = await form.trigger(["forca", "agilidade", "intelecto", "vigor", "presenca"]);
      if (valid && pointsRemaining < 0) valid = false;
    }
    if (step === 5) valid = true;
    if (valid) setStep((s) => s + 1);
  };

  const handleFinalize = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;
    const data = form.getValues();
    const allPericias = Array.from(
      new Set([...periciasDaClasse, ...periciasDaOrigem, ...data.pericias])
    );
    try {
      const result = await createMut.mutateAsync({
        data: {
          ...data,
          pericias: allPericias,
          rituals: isOcultista ? selectedRituais : [],
        },
      });
      toast({ title: "Dossiê Criado", description: "Agente registrado com sucesso." });
      setLocation(`/characters/${result.id}`);
    } catch {
      toast({ title: "Erro", description: "Falha ao registrar agente.", variant: "destructive" });
    }
  };

  // ── render ────────────────────────────────────────────────────────────
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-foreground mb-2">NOVO RECRUTAMENTO</h1>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-sm transition-colors ${step >= i ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${step === i + 1 ? "text-primary" : "text-muted-foreground/50"}`}
              style={{ width: `${100 / TOTAL_STEPS}%`, textAlign: i === 0 ? "left" : i === TOTAL_STEPS - 1 ? "right" : "center" }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <Card className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 text-muted/10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="relative z-10">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Identificação ──────────────────────────── */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">I. IDENTIFICAÇÃO</h2>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Agente</Label>
                  <Input id="nome" {...form.register("nome")} className="font-display text-lg tracking-widest placeholder:font-sans placeholder:tracking-normal" placeholder="ex: Arthur Cervero" />
                  {form.formState.errors.nome && <p className="text-destructive text-sm">{form.formState.errors.nome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="historia">Histórico (Opcional)</Label>
                  <Textarea id="historia" {...form.register("historia")} rows={5} className="font-sans resize-none" placeholder="Qual a relação deste agente com o paranormal?" />
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Classe ─────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">II. ESPECIALIDADE (CLASSE)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(classes as any[])?.map((c: any) => (
                    <div
                      key={c.id}
                      onClick={() => form.setValue("classeId", c.id)}
                      className={`cursor-pointer p-4 border rounded-sm transition-all ${watchedClasseId === c.id ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "border-border bg-secondary/30 hover:border-primary/50"}`}
                    >
                      <h3 className="font-display font-bold text-lg mb-2 text-foreground">{c.nome}</h3>
                      <p className="text-sm text-muted-foreground font-sans line-clamp-3">{c.descricao || "Sem descrição"}</p>
                    </div>
                  ))}
                </div>
                {form.formState.errors.classeId && <p className="text-destructive text-sm mt-2">{form.formState.errors.classeId.message}</p>}
              </motion.div>
            )}

            {/* ── Step 3: Origem ─────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">III. ORIGEM</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
                  {(origins as any[])?.map((o: any) => (
                    <div
                      key={o.id}
                      onClick={() => form.setValue("origemId", o.id)}
                      className={`cursor-pointer p-4 border rounded-sm transition-all ${watchedOrigemId === o.id ? "border-primary bg-primary/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]" : "border-border bg-secondary/30 hover:border-primary/50"}`}
                    >
                      <h3 className="font-display font-bold text-lg text-foreground">{o.nome}</h3>
                      <p className="text-sm text-muted-foreground font-sans mt-1">{o.poderConcedido}</p>
                      {o.periciasConcedidas?.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {o.periciasConcedidas.map((p: string) => (
                            <span key={p} className="text-[10px] font-mono bg-blue-500/15 border border-blue-500/25 text-blue-400 rounded-sm px-1.5 py-0.5">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {form.formState.errors.origemId && <p className="text-destructive text-sm mt-2">{form.formState.errors.origemId.message}</p>}
              </motion.div>
            )}

            {/* ── Step 4: Atributos ──────────────────────────────── */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                  <h2 className="text-xl font-display text-primary">IV. ATRIBUTOS</h2>
                  <div className={`font-display text-sm px-3 py-1 rounded-sm ${pointsRemaining === 0 ? "bg-green-900/30 text-green-500 border border-green-800" : pointsRemaining < 0 ? "bg-destructive/30 text-destructive border border-destructive/50" : "bg-secondary text-foreground border border-border"}`}>
                    {pointsRemaining < 0
                      ? `${Math.abs(pointsRemaining)} PONTO${Math.abs(pointsRemaining) > 1 ? "S" : ""} A MAIS`
                      : `${pointsRemaining} PONTO${pointsRemaining !== 1 ? "S" : ""} RESTANTE${pointsRemaining !== 1 ? "S" : ""}`}
                  </div>
                </div>
                <div className="bg-amber-950/20 border border-amber-800/30 rounded-sm px-4 py-3 text-xs text-amber-200/70 font-mono space-y-1 leading-relaxed">
                  <p>Todos os atributos começam em <strong className="text-amber-300">1</strong>. Você tem <strong className="text-amber-300">4 pontos</strong> para distribuir.</p>
                  <p>Reduza um atributo para <strong className="text-amber-300">0</strong> para receber <strong className="text-amber-300">+1 ponto</strong> adicional. Máximo inicial: <strong className="text-amber-300">3</strong>.</p>
                </div>
                <div className="w-full max-w-md mx-auto space-y-4 bg-background/50 p-6 rounded-sm border border-border">
                  {([
                    { key: "forca",     label: "FORÇA"     },
                    { key: "agilidade", label: "AGILIDADE" },
                    { key: "intelecto", label: "INTELECTO" },
                    { key: "vigor",     label: "VIGOR"     },
                    { key: "presenca",  label: "PRESENÇA"  },
                  ] as const).map(({ key, label }) => {
                    const val = form.watch(key);
                    const isZero = val === 0;
                    const isMax  = val === 3;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <Label className={`w-36 text-base font-display tracking-widest ${isZero ? "text-destructive/70" : "text-foreground"}`}>
                          {label}
                          {isZero && <span className="ml-2 text-[10px] text-amber-400 font-sans normal-case tracking-normal">+1 pt</span>}
                        </Label>
                        <div className="flex items-center space-x-4">
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={val <= 0} onClick={() => form.setValue(key, Math.max(0, val - 1))}>−</Button>
                          <span className={`w-8 text-center font-display text-2xl ${isZero ? "text-destructive" : isMax ? "text-amber-400" : "text-primary"}`}>{val}</span>
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full" disabled={isMax || pointsRemaining <= 0} onClick={() => form.setValue(key, Math.min(3, val + 1))}>+</Button>
                        </div>
                        <div className="flex gap-1 ml-4">
                          {[1, 2, 3].map((pip) => (
                            <div key={pip} className={`h-3 w-3 rounded-sm border transition-colors ${pip <= val ? pip === 3 ? "bg-amber-500 border-amber-400" : "bg-primary border-primary/80" : "bg-secondary border-border/50"}`} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {pointsRemaining < 0 && <p className="text-destructive text-sm text-center font-mono">Distribua menos {Math.abs(pointsRemaining)} ponto{Math.abs(pointsRemaining) > 1 ? "s" : ""}.</p>}
              </motion.div>
            )}

            {/* ── Step 5: Perícias ───────────────────────────────── */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-xl font-display text-primary border-b border-border/50 pb-2">V. PERÍCIAS TREINADAS</h2>

                {/* Perícias da Classe */}
                <div className="bg-card border border-border/60 rounded-sm p-4 space-y-3">
                  <p className="text-[10px] font-display uppercase tracking-widest text-amber-400/80">
                    Perícias da Classe — {selectedClass?.nome}
                  </p>

                  {/* Fixas (ex: Ocultista — Ocultismo + Vontade) */}
                  {classeConfig.fixas.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {classeConfig.fixas.map((nome) => (
                        <LockedBadge key={nome} nome={nome} color="amber" />
                      ))}
                    </div>
                  )}

                  {/* Grupos de escolha (ex: Combatente — Luta/Pontaria e Reflexos/Fortitude) */}
                  {classeConfig.grupos.map((grupo, gi) => {
                    const chosen = classeGrupoChoices[gi] ?? null;
                    return (
                      <div key={gi} className="space-y-1.5">
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{grupo.label}</p>
                        <div className="flex gap-2 flex-wrap">
                          {grupo.opcoes.map((nome) => {
                            const p = PERICIAS_LISTA.find((x) => x.nome === nome);
                            const isChosen = chosen === nome;
                            return (
                              <button
                                key={nome}
                                type="button"
                                onClick={() => setGrupoChoice(gi, nome)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-sm font-semibold transition-all ${
                                  isChosen
                                    ? "border-amber-500 bg-amber-500/20 text-amber-300"
                                    : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-amber-500/50 hover:text-foreground"
                                }`}
                              >
                                <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${isChosen ? "border-amber-400 bg-amber-400" : "border-muted-foreground/40"}`}>
                                  {isChosen && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                                </div>
                                {nome}
                                {p && <span className={`text-[9px] font-bold rounded-sm px-1 py-0.5 ${ATR_COLOR[p.atributo]}`}>{p.atributo}</span>}
                              </button>
                            );
                          })}
                        </div>
                        {chosen === null && (
                          <p className="text-[10px] text-amber-500/60 font-mono">
                            Nenhuma selecionada — você pode pegar ambas via escolhas livres abaixo.
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {classeConfig.fixas.length === 0 && classeConfig.grupos.length === 0 && (
                    <p className="text-xs text-muted-foreground font-mono italic">
                      Esta classe não concede perícias fixas — todas as escolhas são livres.
                    </p>
                  )}
                </div>

                {/* Perícias da Origem */}
                {periciasDaOrigem.length > 0 && (
                  <div className="bg-card border border-border/60 rounded-sm p-4 space-y-2">
                    <p className="text-[10px] font-display uppercase tracking-widest text-blue-400/80">
                      Perícias da Origem — {selectedOrigin?.nome}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {periciasDaOrigem.map((nome: string) => (
                        <LockedBadge key={nome} nome={nome} color="blue" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Escolhas Livres */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Escolhas Livres</span>
                      <span className="ml-2 text-[10px] font-mono text-muted-foreground/60">
                        ({selectedClass?.periciasTreindasBase ?? 3} da classe + {watchedIntelecto} de Intelecto)
                      </span>
                    </div>
                    <div className={`font-display text-sm px-3 py-1 rounded-sm border ${periciasManuais.length >= limiteEscolhas ? "bg-green-900/30 text-green-500 border-green-800" : "bg-secondary text-foreground border-border"}`}>
                      {periciasManuais.length}/{limiteEscolhas}
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filtrar perícias..."
                      value={periciaSearch}
                      onChange={(e) => setPericiaSearch(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-sm py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[36vh] overflow-y-auto pr-1">
                    {periciasFiltradas.map((p) => {
                      const isSelected = watchedPericias.includes(p.nome);
                      const isDisabled = !isSelected && periciasManuais.length >= limiteEscolhas;
                      return (
                        <div
                          key={p.id}
                          onClick={() => !isDisabled && togglePericia(p.nome)}
                          className={`cursor-pointer p-3 border rounded-sm flex items-center gap-2 transition-all select-none ${
                            isSelected
                              ? "border-primary bg-primary/15 text-foreground"
                              : isDisabled
                              ? "border-border/30 bg-secondary/10 text-muted-foreground/40 cursor-not-allowed"
                              : "border-border/60 bg-secondary/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          <div className="shrink-0">
                            {isSelected
                              ? <CheckCircle2 className="h-4 w-4 text-primary" />
                              : <Circle className="h-4 w-4 opacity-40" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold leading-tight truncate">{p.nome}</div>
                            {p.somenteTrainada && <div className="text-[9px] text-red-400/70 font-mono mt-0.5">Somente treinada</div>}
                          </div>
                          <span className={`text-[9px] font-bold rounded-sm px-1.5 py-0.5 shrink-0 ${ATR_COLOR[p.atributo]}`}>{p.atributo}</span>
                        </div>
                      );
                    })}
                    {periciasFiltradas.length === 0 && (
                      <div className="col-span-3 text-center py-6 text-muted-foreground font-mono text-sm">Nenhuma perícia encontrada.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 6: Rituais (Ocultista only) ──────────────── */}
            {step === 6 && isOcultista && (
              <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex items-end justify-between border-b border-border/50 pb-2">
                  <div>
                    <h2 className="text-xl font-display text-primary flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      VI. RITUAIS INICIAIS
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Poder de classe Ocultista — escolha 3 rituais de 1º círculo
                    </p>
                  </div>
                  <div className={`font-display text-sm px-3 py-1 rounded-sm border transition-colors ${selectedRituais.length === 3 ? "bg-green-900/30 text-green-500 border-green-800" : "bg-secondary text-foreground border-border"}`}>
                    {selectedRituais.length}/3
                  </div>
                </div>

                {/* info box */}
                <div className="bg-purple-950/20 border border-purple-800/30 rounded-sm px-4 py-3 text-xs text-purple-200/70 font-mono space-y-1 leading-relaxed">
                  <p>Rituais podem ser de <strong className="text-purple-300">qualquer elemento</strong>. Você pode trocar rituais por outros de 1º círculo durante interlúdios.</p>
                  <p>A seleção é opcional — avance sem escolher se preferir definir depois.</p>
                </div>

                {/* search + element filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Buscar ritual..."
                      value={ritualSearch}
                      onChange={(e) => setRitualSearch(e.target.value)}
                      className="w-full bg-background border border-border/60 rounded-sm py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors font-mono"
                    />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setRitualElementFilter("todos")}
                      className={`px-2.5 py-1.5 rounded-sm text-xs font-mono border transition-colors ${ritualElementFilter === "todos" ? "bg-secondary border-primary/50 text-foreground" : "border-border/50 text-muted-foreground hover:border-border"}`}
                    >
                      Todos
                    </button>
                    {ritualElementos.map((el) => {
                      const cfg = ELEM_CONFIG[el] ?? ELEM_CONFIG["Variável"];
                      const isActive = ritualElementFilter === el;
                      return (
                        <button
                          key={el}
                          type="button"
                          onClick={() => setRitualElementFilter(el)}
                          className={`px-2.5 py-1.5 rounded-sm text-xs font-mono border transition-colors ${isActive ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "border-border/50 text-muted-foreground hover:border-border"}`}
                        >
                          {el}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* selected rituais preview */}
                {selectedRituais.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRituais.map((id) => {
                      const r = ((allRituais as Ritual[]) ?? []).find((x) => x.id === id);
                      if (!r) return null;
                      const cfg = ELEM_CONFIG[r.elemento] ?? ELEM_CONFIG["Variável"];
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleRitual(id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors ${cfg.bg} ${cfg.border} ${cfg.color} hover:opacity-80`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {r.nome}
                          <span className="text-[10px] opacity-60">✕</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ritual grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[42vh] overflow-y-auto pr-1">
                  {rituaisPrimeirCirculo.map((r) => {
                    const cfg = ELEM_CONFIG[r.elemento] ?? ELEM_CONFIG["Variável"];
                    const isSelected = selectedRituais.includes(r.id);
                    const isDisabled = !isSelected && selectedRituais.length >= 3;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleRitual(r.id)}
                        className={`w-full text-left p-3 border rounded-sm transition-all ${
                          isSelected
                            ? `${cfg.bg} ${cfg.border} ring-1 ring-inset ring-current/20`
                            : isDisabled
                            ? "border-border/20 bg-secondary/5 opacity-40 cursor-not-allowed"
                            : "border-border/40 bg-secondary/20 hover:border-border/70 hover:bg-secondary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`shrink-0 h-4 w-4 rounded-sm border flex items-center justify-center transition-colors ${isSelected ? `${cfg.bg} ${cfg.border}` : "border-border/50 bg-background"}`}>
                              {isSelected && <CheckCircle2 className={`h-3 w-3 ${cfg.color}`} />}
                            </div>
                            <span className={`text-sm font-semibold leading-tight truncate ${isSelected ? cfg.color : "text-foreground"}`}>{r.nome}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${cfg.bg} ${cfg.border} ${cfg.color}`}>{r.elemento}</span>
                            {r.custoPe != null && (
                              <span className="text-[10px] font-mono text-muted-foreground">{r.custoPe} PE</span>
                            )}
                          </div>
                        </div>
                        {r.descricao && (
                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed text-left">{r.descricao}</p>
                        )}
                        {r.execucao && (
                          <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">{r.execucao}</p>
                        )}
                      </button>
                    );
                  })}
                  {rituaisPrimeirCirculo.length === 0 && (
                    <div className="col-span-2 text-center py-6 text-muted-foreground font-mono text-sm">Nenhum ritual encontrado.</div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
            {step > 1
              ? <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>VOLTAR</Button>
              : <div />}
            {step < TOTAL_STEPS
              ? <Button type="button" onClick={nextStep}>AVANÇAR</Button>
              : (
                <Button
                  type="button"
                  onClick={handleFinalize}
                  disabled={createMut.isPending}
                  className="animate-pulse hover:animate-none"
                >
                  {createMut.isPending ? "REGISTRANDO..." : "FINALIZAR DOSSIÊ"}
                </Button>
              )}
          </div>
        </form>
      </Card>
    </div>
  );
}
