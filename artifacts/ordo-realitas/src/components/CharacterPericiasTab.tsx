import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle2, Circle, ChevronUp, ChevronDown, Dice5, Loader2 } from "lucide-react";
import {
  useCharacterCampanhas,
  useRolarEmCampanha,
  type CharacterCampanha,
  type CampanhaRolagem,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Atributo = "FOR" | "AGI" | "INT" | "PRE" | "VIG";
type GrauTreinamento = "Destreinado" | "Treinado" | "Veterano" | "Expert";

type PericiaRow = {
  id: string;
  nome: string;
  atributo: Atributo;
  somenteTrainada: boolean;
};

const GRAU_BONUS: Record<GrauTreinamento, number> = {
  Destreinado: 0,
  Treinado: 5,
  Veterano: 10,
  Expert: 15,
};

const GRAUS: GrauTreinamento[] = ["Destreinado", "Treinado", "Veterano", "Expert"];

const PERICIAS: PericiaRow[] = [
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

function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const ATR_BADGE: Record<Atributo, string> = {
  FOR: "bg-red-900/30 border-red-700/50 text-red-300",
  AGI: "bg-green-900/30 border-green-700/50 text-green-300",
  INT: "bg-blue-900/30 border-blue-700/50 text-blue-300",
  PRE: "bg-purple-900/30 border-purple-700/50 text-purple-300",
  VIG: "bg-amber-900/30 border-amber-700/50 text-amber-300",
};

const GRAU_STYLE: Record<GrauTreinamento, string> = {
  Destreinado: "text-muted-foreground/40",
  Treinado:    "text-green-400 font-semibold",
  Veterano:    "text-blue-400 font-semibold",
  Expert:      "text-amber-400 font-semibold",
};

const GRAU_BTN_ACTIVE: Record<GrauTreinamento, string> = {
  Destreinado: "bg-secondary/60 border-border/60 text-muted-foreground",
  Treinado:    "bg-green-900/40 border-green-600/60 text-green-300",
  Veterano:    "bg-blue-900/40 border-blue-600/60 text-blue-300",
  Expert:      "bg-amber-900/40 border-amber-600/60 text-amber-300",
};

type Props = {
  charId: string;
  charNome: string;
  pericias: string[];
  atributos: {
    forca: number;
    agilidade: number;
    intelecto: number;
    vigor: number;
    presenca: number;
  };
};

function getAttrVal(atributo: Atributo, atributos: Props["atributos"]): number {
  switch (atributo) {
    case "FOR": return atributos.forca;
    case "AGI": return atributos.agilidade;
    case "INT": return atributos.intelecto;
    case "VIG": return atributos.vigor;
    case "PRE": return atributos.presenca;
  }
}

function RollResultToast({ result }: { result: CampanhaRolagem }) {
  const sorted = [...result.dadosRolados].sort((a, b) => b - a);
  const winVal = result.dadosRolados.length > 0 ? Math.max(...result.dadosRolados) : 0;
  return (
    <div className="space-y-1">
      <div className="flex gap-1 flex-wrap">
        {sorted.map((v, i) => (
          <span key={i} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded-sm border ${
            v === winVal ? "bg-primary/20 border-primary text-primary" : "bg-secondary/30 border-border/50 text-muted-foreground"
          }`}>{v}</span>
        ))}
      </div>
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">resultado: </span>
        <span className="text-foreground font-bold">{result.resultadoFinal}</span>
        {result.bonusPericia > 0 && (
          <span className="text-muted-foreground"> (+{result.bonusPericia} bônus)</span>
        )}
      </div>
    </div>
  );
}

function CampanhaPicker({
  open, onClose, campanhas, onPick,
}: {
  open: boolean;
  onClose: () => void;
  campanhas: CharacterCampanha[];
  onPick: (campanhaId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-panel border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest">SELECIONAR OPERAÇÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <p className="text-xs font-mono text-muted-foreground">Este agente está em várias operações. Onde rolar?</p>
          {campanhas.map((c) => (
            <button
              key={c.id}
              className="w-full flex items-center justify-between px-4 py-3 border border-border/50 rounded-sm bg-secondary/20 hover:bg-secondary/40 hover:border-border/80 transition-all"
              onClick={() => { onPick(c.id); onClose(); }}
            >
              <span className="font-mono text-sm text-foreground">{c.nome}</span>
              <span className={`text-[10px] font-display tracking-widest ${c.meuPapel === "mestre" ? "text-yellow-400" : "text-muted-foreground"}`}>
                {c.meuPapel === "mestre" ? "MESTRE" : "JOGADOR"}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CharacterPericiasTab({ charId, charNome, pericias, atributos }: Props) {
  const storageKey = `char-${charId}-pericias-v2`;
  const outroStorageKey = `char-${charId}-pericias-outro-v2`;

  const [grauMap, setGrauMap] = useState<Record<string, GrauTreinamento>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "{}"); } catch { return {}; }
  });
  const [outroMap, setOutroMap] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(outroStorageKey) ?? "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(grauMap)); }, [grauMap, storageKey]);
  useEffect(() => { localStorage.setItem(outroStorageKey, JSON.stringify(outroMap)); }, [outroMap, outroStorageKey]);

  const trainedSet = useMemo(() => new Set(pericias.map(norm)), [pericias]);

  const getGrau = (p: PericiaRow): GrauTreinamento => {
    if (grauMap[p.id]) return grauMap[p.id];
    return trainedSet.has(norm(p.nome)) ? "Treinado" : "Destreinado";
  };

  const [search, setSearch] = useState("");
  const [filterAttr, setFilterAttr] = useState<Atributo | "TODAS">("TODAS");
  const [soTreinadas, setSoTreinadas] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingPericia, setPendingPericia] = useState<PericiaRow | null>(null);
  const [rollingId, setRollingId] = useState<string | null>(null);

  const { data: campanhas = [] } = useCharacterCampanhas(charId);
  const rolarMut = useRolarEmCampanha();
  const { toast } = useToast();

  const rows = useMemo(() => {
    const q = norm(search);
    return PERICIAS.filter((p) => {
      if (filterAttr !== "TODAS" && p.atributo !== filterAttr) return false;
      if (soTreinadas && getGrau(p) === "Destreinado") return false;
      if (q && !norm(p.nome).includes(q)) return false;
      return true;
    });
  }, [search, filterAttr, soTreinadas, grauMap, trainedSet]); // eslint-disable-line react-hooks/exhaustive-deps

  const countByGrau = useMemo(() => {
    const acc: Record<GrauTreinamento, number> = { Destreinado: 0, Treinado: 0, Veterano: 0, Expert: 0 };
    for (const p of PERICIAS) acc[getGrau(p)]++;
    return acc;
  }, [grauMap, trainedSet]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRolarPericia = async (p: PericiaRow, campanhaId: string) => {
    setRollingId(p.id);
    const grau = getGrau(p);
    const bonus = GRAU_BONUS[grau];
    const outro = outroMap[p.id] ?? 0;
    const attrVal = getAttrVal(p.atributo, atributos);
    try {
      const result = await rolarMut.mutateAsync({
        campanhaId,
        tipo: "pericia",
        rolandoComo: charNome,
        label: p.nome,
        atributo: p.atributo,
        qtdDadosBase: attrVal,
        bonusPericia: bonus + outro,
        modificadoresO: 0,
      });
      toast({
        title: result.sucessoAutomatico
          ? "⚡ SUCESSO AUTOMÁTICO!"
          : `${p.nome} — ${result.resultadoFinal}`,
        description: <RollResultToast result={result} />,
      });
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    } finally {
      setRollingId(null);
    }
  };

  const handleClickRolar = (p: PericiaRow) => {
    if (campanhas.length === 0) {
      toast({ title: "SEM OPERAÇÃO ATIVA", description: "Adicione este agente a uma operação na aba Campanhas.", variant: "destructive" });
      return;
    }
    if (campanhas.length === 1) {
      handleRolarPericia(p, campanhas[0].id);
    } else {
      setPendingPericia(p);
      setPickerOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["Treinado", "Veterano", "Expert"] as GrauTreinamento[]).map((g) => (
          <div key={g} className="border border-border/50 rounded-sm px-3 py-2 bg-card/30 text-center min-w-20">
            <div className={`font-display font-bold text-xl ${GRAU_STYLE[g]}`}>{countByGrau[g]}</div>
            <div className="font-display text-[9px] tracking-widest text-muted-foreground uppercase">{g}</div>
            <div className="font-mono text-[10px] text-muted-foreground/50">{g === "Treinado" ? "+5" : g === "Veterano" ? "+10" : "+15"}</div>
          </div>
        ))}
        <div className="border border-border/50 rounded-sm px-3 py-2 bg-card/30 text-center min-w-20">
          <div className="font-display font-bold text-xl text-foreground">{PERICIAS.length - countByGrau.Destreinado}</div>
          <div className="font-display text-[9px] tracking-widest text-muted-foreground uppercase">TOTAL</div>
        </div>
        {campanhas.length > 0 && (
          <div className="border border-primary/30 rounded-sm px-3 py-2 bg-primary/5 text-center min-w-20">
            <div className="font-display font-bold text-xl text-primary">{campanhas.length}</div>
            <div className="font-display text-[9px] tracking-widest text-primary/70 uppercase">OPERAÇÕES</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar perícia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary/30 border border-border/50 rounded-sm py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 font-mono outline-none focus:border-border transition-colors"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["TODAS", "FOR", "AGI", "INT", "PRE", "VIG"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setFilterAttr(a)}
              className={`px-2.5 py-1 rounded-sm text-[10px] font-display tracking-wider border transition-colors ${
                filterAttr === a
                  ? a === "TODAS"
                    ? "bg-foreground text-background border-foreground"
                    : ATR_BADGE[a as Atributo] + " border-current"
                  : "bg-secondary/20 text-muted-foreground border-border/40 hover:border-border"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSoTreinadas((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-display tracking-wider border transition-colors ${
            soTreinadas ? "bg-foreground text-background border-foreground" : "bg-secondary/20 text-muted-foreground border-border/40 hover:border-border"
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Só treinadas
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase">Perícia</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-10">Atr</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-10">Dados</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-36">Treino</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-16">Bônus</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-20">Outro</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-14">Total</th>
              <th className="text-center py-2 px-2 font-display text-[9px] tracking-widest text-muted-foreground/60 uppercase w-10">Rolar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, idx) => {
              const grau = getGrau(p);
              const bonus = GRAU_BONUS[grau];
              const outro = outroMap[p.id] ?? 0;
              const total = bonus + outro;
              const trained = grau !== "Destreinado";
              const attrVal = getAttrVal(p.atributo, atributos);
              const isRolling = rollingId === p.id;

              return (
                <tr
                  key={p.id}
                  className={`border-b border-border/20 transition-colors hover:bg-secondary/10 ${idx % 2 === 0 ? "bg-card/10" : ""}`}
                >
                  <td className="py-1.5 px-2">
                    <div className="flex items-center gap-1.5">
                      {trained
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500/70 shrink-0" />
                        : <Circle className="h-3.5 w-3.5 text-muted-foreground/20 shrink-0" />}
                      <span className={`font-sans text-sm ${trained ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {p.nome}
                      </span>
                      {p.somenteTrainada && !trained && (
                        <span className="text-[9px] font-mono text-destructive/40 hidden sm:inline">*</span>
                      )}
                    </div>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm border ${ATR_BADGE[p.atributo]}`}>
                      {p.atributo}
                    </span>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <span className="font-mono text-sm text-foreground font-bold">{attrVal}</span>
                  </td>

                  <td className="py-1.5 px-2">
                    <div className="flex gap-0.5 justify-center">
                      {GRAUS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          title={g}
                          onClick={() => setGrauMap((prev) => ({ ...prev, [p.id]: g }))}
                          className={`px-1.5 py-0.5 rounded-sm text-[9px] font-display tracking-wider border transition-colors ${
                            grau === g
                              ? GRAU_BTN_ACTIVE[g]
                              : "bg-secondary/10 border-border/20 text-muted-foreground/40 hover:border-border/50 hover:text-muted-foreground"
                          }`}
                        >
                          {g === "Destreinado" ? "—" : g.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <span className={`font-display font-bold text-base ${GRAU_STYLE[grau]}`}>
                      {bonus === 0 ? "0" : `+${bonus}`}
                    </span>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setOutroMap((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) - 1 }))}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-border/30 bg-secondary/20 hover:bg-secondary/50 text-muted-foreground transition-colors"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <span className={`font-mono text-sm w-7 text-center ${outro !== 0 ? "text-blue-400 font-bold" : "text-muted-foreground/40"}`}>
                        {outro >= 0 ? `+${outro}` : outro}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOutroMap((prev) => ({ ...prev, [p.id]: (prev[p.id] ?? 0) + 1 }))}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-border/30 bg-secondary/20 hover:bg-secondary/50 text-muted-foreground transition-colors"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-sm border font-display font-bold text-sm transition-colors ${
                      grau === "Expert"
                        ? "border-amber-700/60 bg-amber-900/20 text-amber-300"
                        : grau === "Veterano"
                        ? "border-blue-700/60 bg-blue-900/20 text-blue-300"
                        : trained
                        ? "border-border/50 bg-secondary/20 text-foreground"
                        : "border-border/20 bg-transparent text-muted-foreground/30"
                    }`}>
                      {total === 0 ? "0" : total > 0 ? `+${total}` : total}
                    </div>
                  </td>

                  <td className="py-1.5 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleClickRolar(p)}
                      disabled={isRolling || rolarMut.isPending}
                      title={campanhas.length === 0 ? "Adicione à uma operação para rolar" : `Rolar ${p.nome}`}
                      className={`h-7 w-7 flex items-center justify-center rounded-sm border transition-colors mx-auto ${
                        campanhas.length === 0
                          ? "border-border/20 text-muted-foreground/20 cursor-not-allowed"
                          : "border-primary/40 text-primary/70 hover:bg-primary/10 hover:border-primary/60 hover:text-primary"
                      }`}
                    >
                      {isRolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Dice5 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground/40 font-display tracking-widest text-xs uppercase">
                  Nenhuma perícia encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border border-border/30 rounded-sm bg-card/10 p-3 space-y-1">
        <p className="font-display text-[9px] tracking-widest text-muted-foreground/50 uppercase">Legenda</p>
        <div className="flex flex-wrap gap-x-5 gap-y-0.5 font-mono text-[10px] text-muted-foreground/50">
          <span>Dados = valor do atributo (nº de d20s)</span>
          <span>Destreinado = +0</span>
          <span className="text-green-500/70">Treinado = +5</span>
          <span className="text-blue-500/70">Veterano = +10</span>
          <span className="text-amber-500/70">Expert = +15</span>
        </div>
        <p className="font-mono text-[9px] text-muted-foreground/40">* Somente treinada — penalidade se não treinado</p>
      </div>

      <CampanhaPicker
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPendingPericia(null); }}
        campanhas={campanhas}
        onPick={(campanhaId) => {
          if (pendingPericia) handleRolarPericia(pendingPericia, campanhaId);
        }}
      />
    </div>
  );
}
