import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useListRolagens,
  useRolar,
  useListCampanhaPersonagens,
  type CampanhaRolagem,
  type CampanhaPersonagemEntry,
} from "@workspace/api-client-react";
import {
  useListPericias,
  type Pericia,
} from "@workspace/api-client-react";

interface CharLike {
  id: string;
  nome: string;
  userId: string;
  forca: number;
  agilidade: number;
  intelecto: number;
  vigor: number;
  presenca: number;
  pericias: string[] | null;
  classe?: { nome: string } | null;
}

function entryToChar(e: CampanhaPersonagemEntry): CharLike {
  return {
    id: e.personagemId,
    nome: e.personagemNome,
    userId: e.userId,
    forca: e.personagemForca,
    agilidade: e.personagemAgilidade,
    intelecto: e.personagemIntelecto,
    vigor: e.personagemVigor,
    presenca: e.personagemPresenca,
    pericias: e.personagemPericias,
    classe: e.classeNome ? { nome: e.classeNome } : null,
  };
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Dice5, Swords, AlertTriangle,
  ChevronUp, ChevronDown, Search, User, Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GrauTreinamento = "Destreinado" | "Treinado" | "Veterano" | "Expert";
type Modo = "pericia" | "atributo" | "dano";

const GRAU_BONUS: Record<GrauTreinamento, number> = {
  Destreinado: 0,
  Treinado: 5,
  Veterano: 10,
  Expert: 15,
};

const GRAUS: GrauTreinamento[] = ["Destreinado", "Treinado", "Veterano", "Expert"];

const ATTR_KEYS: Record<string, keyof CharLike> = {
  FOR: "forca",
  AGI: "agilidade",
  INT: "intelecto",
  VIG: "vigor",
  PRE: "presenca",
};

const ATTR_LABEL: Record<string, string> = {
  FOR: "Força",
  AGI: "Agilidade",
  INT: "Intelecto",
  VIG: "Vigor",
  PRE: "Presença",
};

const ATTR_COLOR: Record<string, string> = {
  FOR: "bg-red-900/40 border-red-700/50 text-red-300",
  AGI: "bg-green-900/40 border-green-700/50 text-green-300",
  INT: "bg-blue-900/40 border-blue-700/50 text-blue-300",
  VIG: "bg-amber-900/40 border-amber-700/50 text-amber-300",
  PRE: "bg-purple-900/40 border-purple-700/50 text-purple-300",
};

const ATTR_BADGE: Record<string, string> = {
  FOR: "border-red-700/60 text-red-400",
  AGI: "border-green-700/60 text-green-400",
  INT: "border-blue-700/60 text-blue-400",
  VIG: "border-amber-700/60 text-amber-400",
  PRE: "border-purple-700/60 text-purple-400",
};

function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getCharAttrValue(char: CharLike | null, atributo: string): number {
  if (!char) return 1;
  const key = ATTR_KEYS[atributo] as keyof CharLike;
  return (char[key] as number | undefined) ?? 1;
}

function getTrainingFromStorage(charId: string): Record<string, GrauTreinamento> {
  try {
    const raw = localStorage.getItem(`char-${charId}-pericias-v2`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function getOutroFromStorage(charId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(`char-${charId}-pericias-outro-v2`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function getGrau(
  pericia: Pericia,
  charPericias: string[] | undefined,
  grauMap: Record<string, GrauTreinamento>,
): GrauTreinamento {
  if (grauMap[pericia.id]) return grauMap[pericia.id];
  const trained = new Set((charPericias ?? []).map(norm));
  return trained.has(norm(pericia.nome)) ? "Treinado" : "Destreinado";
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

function rollerName(r: CampanhaRolagem): string {
  if (r.rolandoComo) return r.rolandoComo;
  if (r.userFirstName) return r.userFirstName;
  return r.userEmail.split("@")[0];
}

function DieBox({ value, highlight, penalty }: { value: number; highlight: boolean; penalty: boolean }) {
  const isNatural20 = value === 20 && !penalty;
  const cls = isNatural20
    ? "bg-yellow-900/60 border-yellow-500 text-yellow-300 shadow-md shadow-yellow-900/40"
    : highlight
      ? "bg-primary/20 border-primary text-primary scale-110 shadow-md shadow-primary/30"
      : penalty
        ? "bg-blue-900/30 border-blue-700/50 text-blue-400"
        : "bg-secondary/30 border-border/50 text-muted-foreground";
  return (
    <div className={`w-9 h-9 flex items-center justify-center font-mono font-bold text-sm rounded-sm border transition-all ${cls}`}>
      {value}
    </div>
  );
}

function RollResultCard({ rolagem }: { rolagem: CampanhaRolagem }) {
  const isDano = rolagem.tipo === "dano";
  const winIdx = isDano
    ? -1
    : rolagem.modoPenalidade
      ? rolagem.dadosRolados.indexOf(Math.min(...rolagem.dadosRolados))
      : rolagem.dadosRolados.indexOf(Math.max(...rolagem.dadosRolados));

  const bonus = isDano
    ? rolagem.resultadoFinal - rolagem.resultadoBase
    : rolagem.bonusPericia;

  return (
    <div className="border border-border/60 rounded-sm bg-card/40 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">
              {rollerName(rolagem)}
            </span>
            {rolagem.atributo && (
              <Badge variant="outline" className={`text-[10px] font-mono ${ATTR_BADGE[rolagem.atributo] ?? "border-border/50 text-muted-foreground"}`}>
                {rolagem.atributo}
              </Badge>
            )}
            {rolagem.tipo === "dano" && (
              <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary/70">DANO</Badge>
            )}
          </div>
          {rolagem.label && (
            <p className="font-sans text-base text-foreground mt-0.5 font-medium">{rolagem.label}</p>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60">{formatTimeAgo(rolagem.createdAt)}</span>
      </div>

      {rolagem.sucessoAutomatico && (
        <div className="bg-primary/10 border border-primary/40 rounded-sm px-3 py-2 text-center">
          <span className="font-display text-sm tracking-widest text-primary uppercase animate-pulse">
            ⚡ SUCESSO AUTOMÁTICO — 20 NATURAL
          </span>
        </div>
      )}

      {rolagem.modoPenalidade && (
        <div className="bg-blue-950/30 border border-blue-700/30 rounded-sm px-3 py-1.5 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3 text-blue-400" />
          <span className="font-display text-xs tracking-widest text-blue-400 uppercase">
            Modo Penalidade — pega o menor
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {rolagem.dadosRolados.map((v, i) => (
          <DieBox key={i} value={v} highlight={i === winIdx} penalty={rolagem.modoPenalidade} />
        ))}
      </div>

      <div className="flex items-end gap-3">
        <div>
          <p className="text-[10px] font-display tracking-widest text-muted-foreground uppercase mb-0.5">Resultado Final</p>
          <p className={`font-display text-5xl tabular-nums leading-none ${rolagem.sucessoAutomatico ? "text-primary" : "text-foreground"}`}>
            {rolagem.resultadoFinal}
          </p>
        </div>
        {bonus !== 0 && (
          <div className="pb-1">
            <span className="font-mono text-lg text-muted-foreground">
              = {rolagem.resultadoBase} {bonus > 0 ? `+ ${bonus}` : `− ${Math.abs(bonus)}`} bônus
            </span>
          </div>
        )}
        {isDano && rolagem.expressaoDano && (
          <div className="pb-1">
            <span className="font-mono text-sm text-muted-foreground/60">{rolagem.expressaoDano}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ rolagem }: { rolagem: CampanhaRolagem }) {
  const isDano = rolagem.tipo === "dano";
  const minVal = Math.min(...rolagem.dadosRolados);
  const maxVal = Math.max(...rolagem.dadosRolados);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0 hover:bg-secondary/10 px-3 -mx-3 rounded-sm transition-colors">
      <div className="w-7 h-7 rounded-sm bg-secondary/30 border border-border/40 flex items-center justify-center text-xs font-display font-bold text-muted-foreground shrink-0">
        {rollerName(rolagem).charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-foreground">{rollerName(rolagem)}</span>
          {rolagem.label && (
            <span className="text-xs text-muted-foreground/70 truncate">— {rolagem.label}</span>
          )}
          {rolagem.atributo && !isDano && (
            <span className={`text-[10px] font-mono px-1 rounded-sm border ${ATTR_BADGE[rolagem.atributo] ?? ""}`}>{rolagem.atributo}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {rolagem.dadosRolados.map((v, i) => (
            <span key={i} className={`text-[10px] font-mono px-1 rounded-sm border ${v === 20 && !isDano ? "bg-yellow-900/40 border-yellow-700/50 text-yellow-300" : v === (rolagem.modoPenalidade ? minVal : maxVal) && !isDano ? "border-primary/50 text-primary/80" : "border-border/30 text-muted-foreground/60"}`}>
              {v}
            </span>
          ))}
          {!isDano && rolagem.bonusPericia > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground/50">+{rolagem.bonusPericia}</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={`font-display text-lg tabular-nums ${rolagem.sucessoAutomatico ? "text-primary" : "text-foreground"}`}>
          {rolagem.resultadoFinal}
        </div>
        <div className="text-[10px] font-mono text-muted-foreground/50">{formatTimeAgo(rolagem.createdAt)}</div>
      </div>
      {rolagem.sucessoAutomatico && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0" title="Sucesso Automático" />
      )}
    </div>
  );
}

function Spinner({ num, onChange, min = 0, max = 10 }: { num: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={() => onChange(Math.max(min, num - 1))} disabled={num <= min}>
        <ChevronDown className="w-3 h-3" />
      </Button>
      <span className="font-mono text-sm w-6 text-center tabular-nums text-foreground">{num}</span>
      <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={() => onChange(Math.min(max, num + 1))} disabled={num >= max}>
        <ChevronUp className="w-3 h-3" />
      </Button>
    </div>
  );
}

export default function RolagensTab({ campanhaId, amMestre }: { campanhaId: string; amMestre: boolean }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const rolarMut = useRolar(campanhaId);
  const { data: rolagens = [] } = useListRolagens(campanhaId);
  const { data: campPersonagens = [] } = useListCampanhaPersonagens(campanhaId);
  const { data: pericias = [] } = useListPericias();

  const myChars = useMemo<CharLike[]>(() => {
    const all = campPersonagens.map(entryToChar);
    if (amMestre) return all;
    return all.filter((c) => c.userId === user?.id);
  }, [campPersonagens, amMestre, user?.id]);

  const [latestRoll, setLatestRoll] = useState<CampanhaRolagem | null>(null);
  const [modo, setModo] = useState<Modo>("pericia");
  const [selectedCharId, setSelectedCharId] = useState<string>("");
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedPericia, setSelectedPericia] = useState<Pericia | null>(null);
  const [grauOverride, setGrauOverride] = useState<GrauTreinamento | null>(null);
  const [modificadoresO, setModificadoresO] = useState(0);
  const [selectedAtributo, setSelectedAtributo] = useState<string>("AGI");
  const [expressaoDano, setExpressaoDano] = useState("1d6");
  const [labelDano, setLabelDano] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  const selectedChar = useMemo(
    () => myChars.find((c) => c.id === selectedCharId) ?? null,
    [myChars, selectedCharId],
  );

  const grauMap = useMemo(
    () => (selectedChar ? getTrainingFromStorage(selectedChar.id) : {}),
    [selectedChar],
  );

  const outroMap = useMemo(
    () => (selectedChar ? getOutroFromStorage(selectedChar.id) : {}),
    [selectedChar],
  );

  const filteredPericias = useMemo(() => {
    if (!searchSkill.trim()) return pericias;
    const q = norm(searchSkill);
    return pericias.filter((p) => norm(p.nome).includes(q));
  }, [pericias, searchSkill]);

  const periciaGrau = useMemo(() => {
    if (!selectedPericia) return "Destreinado" as GrauTreinamento;
    if (grauOverride) return grauOverride;
    return getGrau(selectedPericia, selectedChar?.pericias as string[] | undefined, grauMap);
  }, [selectedPericia, grauOverride, selectedChar, grauMap]);

  const periciaOutroBonus = useMemo(() => {
    if (!selectedPericia) return 0;
    return outroMap[selectedPericia.id] ?? 0;
  }, [selectedPericia, outroMap]);

  const periciaAttrVal = useMemo(() => {
    if (!selectedPericia) return 1;
    return getCharAttrValue(selectedChar, selectedPericia.atributoBase as string);
  }, [selectedPericia, selectedChar]);

  const periciaBonusTotal = GRAU_BONUS[periciaGrau] + periciaOutroBonus;

  const atributoAtualVal = getCharAttrValue(selectedChar, selectedAtributo);

  const qtdDadosPericia = periciaAttrVal + modificadoresO;
  const previewPericia = qtdDadosPericia > 0
    ? `${qtdDadosPericia}d20 (maior) + ${periciaBonusTotal} bônus`
    : `${2 + Math.abs(qtdDadosPericia)}d20 (MENOR — penalidade) + ${periciaBonusTotal}`;

  const qtdDadosAtributo = atributoAtualVal + modificadoresO;
  const previewAtributo = qtdDadosAtributo > 0
    ? `${qtdDadosAtributo}d20 (maior)`
    : `${2 + Math.abs(qtdDadosAtributo)}d20 (MENOR — penalidade)`;

  const charName = selectedChar?.nome ?? user?.firstName ?? user?.email?.split("@")[0] ?? "";

  const handleSelectPericia = (p: Pericia) => {
    setSelectedPericia(p);
    setGrauOverride(null);
    setSearchSkill("");
  };

  const handleRolar = async () => {
    try {
      let result: CampanhaRolagem;

      if (modo === "pericia") {
        if (!selectedPericia) {
          toast({ title: "Selecione uma perícia", variant: "destructive" }); return;
        }
        result = await rolarMut.mutateAsync({
          tipo: "pericia",
          rolandoComo: charName || undefined,
          label: selectedPericia.nome,
          atributo: selectedPericia.atributoBase as string,
          qtdDadosBase: periciaAttrVal,
          bonusPericia: periciaBonusTotal,
          modificadoresO,
        });
      } else if (modo === "atributo") {
        result = await rolarMut.mutateAsync({
          tipo: "pericia",
          rolandoComo: charName || undefined,
          label: `${ATTR_LABEL[selectedAtributo]} (seco)`,
          atributo: selectedAtributo,
          qtdDadosBase: atributoAtualVal,
          bonusPericia: 0,
          modificadoresO,
        });
      } else {
        result = await rolarMut.mutateAsync({
          tipo: "dano",
          rolandoComo: charName || undefined,
          label: labelDano || undefined,
          expressaoDano,
        });
      }

      setLatestRoll(result);
      if (result.sucessoAutomatico) {
        toast({ title: "⚡ SUCESSO AUTOMÁTICO!", description: "20 natural!" });
      }
    } catch (e: any) {
      toast({ title: "ERRO", description: e.message, variant: "destructive" });
    }
  };

  const canRoll = modo === "dano"
    ? !!expressaoDano.trim()
    : modo === "pericia"
      ? !!selectedPericia
      : true;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="border border-border/50 rounded-sm bg-card/30 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Dice5 className="w-4 h-4 text-primary" />
            <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">Mesa de Rolagens</h3>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <User className="w-3 h-3" /> Personagem
            </Label>
            <Select value={selectedCharId} onValueChange={setSelectedCharId}>
              <SelectTrigger className="bg-secondary/30 border-border/60 font-mono text-sm h-9">
                <SelectValue placeholder="Selecionar personagem…" />
              </SelectTrigger>
              <SelectContent>
                {myChars.length === 0 && (
                  <SelectItem value="__none" disabled>
                    {amMestre ? "Nenhum agente na operação" : "Adicione seus personagens na aba Agentes"}
                  </SelectItem>
                )}
                {myChars.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome} {c.classe?.nome ? `— ${c.classe.nome}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChar && (
              <div className="flex gap-2 mt-1 flex-wrap">
                {(["FOR", "AGI", "INT", "VIG", "PRE"] as const).map((a) => (
                  <span key={a} className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${ATTR_COLOR[a]}`}>
                    {a} {getCharAttrValue(selectedChar, a)}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-1">
            {([
              { id: "pericia", label: "Perícia", icon: <Search className="w-3 h-3" /> },
              { id: "atributo", label: "Atributo seco", icon: <Zap className="w-3 h-3" /> },
              { id: "dano", label: "Dano", icon: <Swords className="w-3 h-3" /> },
            ] as { id: Modo; label: string; icon: React.ReactNode }[]).map((m) => (
              <button
                key={m.id}
                onClick={() => setModo(m.id)}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 font-display text-[11px] tracking-widest uppercase border rounded-sm transition-all ${modo === m.id ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {modo === "pericia" && (
            <div className="space-y-3">
              {selectedPericia ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-secondary/20 border border-border/40 rounded-sm px-3 py-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border ${ATTR_BADGE[selectedPericia.atributoBase as string] ?? ""}`}>
                      {selectedPericia.atributoBase}
                    </span>
                    <span className="font-display text-sm text-foreground tracking-wide">{selectedPericia.nome}</span>
                    {selectedChar && (
                      <span className="font-mono text-xs text-muted-foreground ml-auto">
                        {ATTR_LABEL[selectedPericia.atributoBase as string]} = <strong className="text-foreground">{periciaAttrVal}</strong>
                      </span>
                    )}
                    <button
                      onClick={() => { setSelectedPericia(null); setGrauOverride(null); }}
                      className="text-muted-foreground hover:text-foreground text-xs font-mono ml-1"
                    >✕</button>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Grau de treinamento</Label>
                    <div className="flex gap-1 flex-wrap">
                      {GRAUS.map((g) => {
                        const isActive = periciaGrau === g;
                        const isFromStorage = !grauOverride && grauMap[selectedPericia.id] === g;
                        const isFromChar = !grauOverride && !grauMap[selectedPericia.id] && g === getGrau(selectedPericia, selectedChar?.pericias as string[] | undefined, {});
                        const autoDetected = isFromStorage || isFromChar;
                        return (
                          <button
                            key={g}
                            onClick={() => setGrauOverride(g)}
                            className={`px-2 py-1 text-[11px] font-mono border rounded-sm transition-all flex items-center gap-1 ${isActive ? "bg-primary/20 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}
                          >
                            {g}
                            <span className="opacity-60">{GRAU_BONUS[g] > 0 ? `+${GRAU_BONUS[g]}` : "±0"}</span>
                            {isActive && autoDetected && <span className="text-[9px] opacity-60">auto</span>}
                          </button>
                        );
                      })}
                    </div>
                    {periciaOutroBonus !== 0 && (
                      <p className="text-[10px] font-mono text-muted-foreground/70">
                        Bônus extra (da ficha): {periciaOutroBonus > 0 ? "+" : ""}{periciaOutroBonus}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Modificadores +O / -O</Label>
                    <div className="flex items-center gap-2">
                      <Spinner num={modificadoresO} onChange={setModificadoresO} min={-5} max={5} />
                      {modificadoresO !== 0 && (
                        <span className={`text-xs font-mono ${modificadoresO > 0 ? "text-green-400" : "text-blue-400"}`}>
                          {modificadoresO > 0 ? `+${modificadoresO}O` : `${modificadoresO}O`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-secondary/20 border border-border/30 rounded-sm px-3 py-2">
                    <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-0.5">Prévia</p>
                    <p className="font-mono text-sm text-foreground">{previewPericia}</p>
                    {!selectedChar && (
                      <p className="text-[10px] text-amber-400/80 mt-1">⚠ Selecione um personagem para usar atributos reais</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      placeholder="Buscar perícia…"
                      className="bg-secondary/30 border-border/60 font-mono text-sm h-9 pl-8"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                    {filteredPericias.map((p) => {
                      const grau = getGrau(p, selectedChar?.pericias as string[] | undefined, grauMap);
                      const attrVal = getCharAttrValue(selectedChar, p.atributoBase as string);
                      const trained = grau !== "Destreinado";
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPericia(p)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm hover:bg-secondary/30 transition-colors text-left group"
                        >
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm border shrink-0 ${ATTR_BADGE[p.atributoBase as string] ?? ""}`}>
                            {p.atributoBase}
                          </span>
                          <span className="text-sm font-sans text-foreground flex-1">{p.nome}</span>
                          {selectedChar && (
                            <span className="text-xs font-mono text-muted-foreground shrink-0 tabular-nums">
                              {attrVal}
                            </span>
                          )}
                          {selectedChar && trained && (
                            <span className={`text-[10px] font-mono shrink-0 ${grau === "Expert" ? "text-amber-400" : grau === "Veterano" ? "text-blue-400" : "text-green-400"}`}>
                              +{GRAU_BONUS[grau]}
                            </span>
                          )}
                          {p.somenteTrainada && !trained && (
                            <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">só treinada</span>
                          )}
                        </button>
                      );
                    })}
                    {filteredPericias.length === 0 && (
                      <p className="text-center text-muted-foreground/40 text-xs py-4">Nenhuma perícia encontrada</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {modo === "atributo" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Selecione o atributo</Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["FOR", "AGI", "INT", "VIG", "PRE"] as const).map((a) => {
                    const val = getCharAttrValue(selectedChar, a);
                    const active = selectedAtributo === a;
                    return (
                      <button
                        key={a}
                        onClick={() => setSelectedAtributo(a)}
                        className={`flex flex-col items-center py-2.5 rounded-sm border transition-all ${active ? `${ATTR_COLOR[a]} scale-105 shadow-sm` : "border-border/40 bg-secondary/20 text-muted-foreground hover:border-border"}`}
                      >
                        <span className="font-display text-xs tracking-widest">{a}</span>
                        <span className={`font-mono text-xl font-bold tabular-nums mt-0.5 ${active ? "" : "text-foreground"}`}>{val}</span>
                        <span className="text-[9px] font-sans opacity-60 mt-0.5">{ATTR_LABEL[a].split("").slice(0, 3).join("")}.</span>
                      </button>
                    );
                  })}
                </div>
                {!selectedChar && (
                  <p className="text-[10px] text-amber-400/80">⚠ Selecione um personagem para usar atributos reais</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Modificadores +O / -O</Label>
                <div className="flex items-center gap-2">
                  <Spinner num={modificadoresO} onChange={setModificadoresO} min={-5} max={5} />
                  {modificadoresO !== 0 && (
                    <span className={`text-xs font-mono ${modificadoresO > 0 ? "text-green-400" : "text-blue-400"}`}>
                      {modificadoresO > 0 ? `+${modificadoresO}O` : `${modificadoresO}O`}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-secondary/20 border border-border/30 rounded-sm px-3 py-2">
                <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-0.5">Prévia</p>
                <p className="font-mono text-sm text-foreground">{previewAtributo}</p>
              </div>
            </div>
          )}

          {modo === "dano" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Expressão de Dano</Label>
                <Input
                  value={expressaoDano}
                  onChange={(e) => setExpressaoDano(e.target.value)}
                  placeholder="ex: 2d6+4, 1d8, 3d4+2"
                  className="bg-secondary/30 border-border/60 font-mono text-base h-10 tracking-wider"
                />
                <p className="text-[10px] text-muted-foreground/60">Formato: NdF±B (ex: 2d6+4, 1d8, 3d4-1)</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Descrição (opcional)</Label>
                <Input
                  value={labelDano}
                  onChange={(e) => setLabelDano(e.target.value)}
                  placeholder="ex: Faca Serrilhada, Ataque Furtivo…"
                  className="bg-secondary/30 border-border/60 font-mono text-sm h-9"
                />
              </div>
            </div>
          )}

          <Button
            onClick={handleRolar}
            disabled={rolarMut.isPending || !canRoll}
            className="w-full h-12 font-display text-sm tracking-[0.3em] uppercase bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {rolarMut.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : modo === "pericia" && selectedPericia ? (
              <><Dice5 className="w-4 h-4 mr-2" /> Rolar {selectedPericia.nome}</>
            ) : modo === "atributo" ? (
              <><Dice5 className="w-4 h-4 mr-2" /> Rolar {ATTR_LABEL[selectedAtributo]}</>
            ) : (
              <><Swords className="w-4 h-4 mr-2" /> Rolar Dano</>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {latestRoll ? (
          <div className="space-y-2">
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Último resultado</p>
            <RollResultCard rolagem={latestRoll} />
          </div>
        ) : (
          <div className="border border-border/30 rounded-sm bg-card/20 p-8 text-center space-y-3">
            <Dice5 className="w-8 h-8 text-muted-foreground/30 mx-auto" />
            <p className="font-display text-xs tracking-widest text-muted-foreground/40 uppercase">Nenhuma rolagem ainda</p>
            <p className="font-sans text-xs text-muted-foreground/30">
              Selecione seu personagem, escolha a perícia e clique em Rolar
            </p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setShowHistory((h) => !h)}
            className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Histórico da sessão ({rolagens.length})</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHistory && (
            <div className="border border-border/40 rounded-sm bg-card/20 px-3 max-h-[480px] overflow-y-auto">
              {rolagens.length === 0 ? (
                <p className="text-center text-muted-foreground/40 text-xs font-sans py-6">Nenhuma rolagem registrada nesta operação</p>
              ) : (
                rolagens.map((r) => <HistoryRow key={r.id} rolagem={r} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
