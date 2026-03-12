import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useListRolagens,
  useRolar,
  type CampanhaRolagem,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Dice5, Swords, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ATRIBUTOS = ["FOR", "AGI", "INT", "VIG", "PRE"] as const;
type Atributo = (typeof ATRIBUTOS)[number];

const TREINAMENTOS = [
  { label: "Não Treinado", bonus: 0 },
  { label: "Treinado", bonus: 5 },
  { label: "Veterano", bonus: 10 },
  { label: "Expert", bonus: 15 },
] as const;

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function rollerName(r: CampanhaRolagem): string {
  if (r.rolandoComo) return r.rolandoComo;
  if (r.userFirstName) return r.userFirstName;
  return r.userEmail.split("@")[0];
}

function DieBox({ value, highlight, penalty, faces = 20 }: { value: number; highlight: boolean; penalty: boolean; faces?: number }) {
  const isMax = value === faces;
  const baseClass = "w-9 h-9 flex items-center justify-center font-mono font-bold text-sm rounded-sm border transition-all";
  const colorClass = isMax && !penalty
    ? "bg-yellow-900/60 border-yellow-500 text-yellow-300 shadow-md shadow-yellow-900/40"
    : highlight
      ? "bg-primary/20 border-primary text-primary scale-110 shadow-md shadow-primary/30"
      : penalty
        ? "bg-blue-900/30 border-blue-700/50 text-blue-400"
        : "bg-secondary/30 border-border/50 text-muted-foreground";
  return (
    <div className={`${baseClass} ${colorClass}`}>{value}</div>
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
    ? (rolagem.expressaoDano?.match(/[+-]\d+$/) ? rolagem.resultadoFinal - rolagem.resultadoBase : 0)
    : rolagem.bonusPericia;

  return (
    <div className="border border-border/60 rounded-sm bg-card/40 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xs tracking-widest text-muted-foreground uppercase">
              {rollerName(rolagem)}
            </span>
            {rolagem.atributo && (
              <Badge variant="outline" className="text-[10px] font-mono border-border/50 text-muted-foreground">
                {rolagem.atributo}
              </Badge>
            )}
            {rolagem.tipo === "dano" && (
              <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary/70">
                DANO
              </Badge>
            )}
          </div>
          {rolagem.label && (
            <p className="font-sans text-sm text-foreground mt-0.5">{rolagem.label}</p>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60">{formatTimeAgo(rolagem.createdAt)}</span>
      </div>

      {rolagem.sucessoAutomatico && (
        <div className="bg-primary/10 border border-primary/40 rounded-sm px-3 py-1.5 text-center">
          <span className="font-display text-sm tracking-widest text-primary uppercase animate-pulse">
            ⚡ SUCESSO AUTOMÁTICO — 20 NATURAL
          </span>
        </div>
      )}

      {rolagem.modoPenalidade && (
        <div className="bg-blue-950/30 border border-blue-700/30 rounded-sm px-3 py-1.5 text-center flex items-center justify-center gap-2">
          <AlertTriangle className="w-3 h-3 text-blue-400" />
          <span className="font-display text-xs tracking-widest text-blue-400 uppercase">
            Modo Penalidade — pega o menor
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {rolagem.dadosRolados.map((v, i) => (
          <DieBox
            key={i}
            value={v}
            highlight={i === winIdx}
            penalty={rolagem.modoPenalidade}
            faces={isDano ? undefined : 20}
          />
        ))}
      </div>

      <div className="flex items-end gap-3">
        <div>
          <p className="text-[10px] font-display tracking-widest text-muted-foreground uppercase mb-0.5">Resultado Final</p>
          <p className="font-display text-5xl text-foreground tabular-nums leading-none">{rolagem.resultadoFinal}</p>
        </div>
        {bonus !== 0 && (
          <div className="pb-1">
            <span className="font-mono text-lg text-muted-foreground">
              = {rolagem.resultadoBase} {bonus > 0 ? "+" : ""}{bonus} bônus
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
            <span className="text-[10px] font-mono text-muted-foreground/50">({rolagem.atributo})</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {rolagem.dadosRolados.map((v, i) => (
            <span key={i} className={`text-[10px] font-mono px-1 rounded-sm border ${v === 20 && !isDano ? "bg-yellow-900/40 border-yellow-700/50 text-yellow-300" : "border-border/30 text-muted-foreground/60"}`}>
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

function Spinner({ num, onChange, min = 0, max = 10, label }: { num: number; onChange: (n: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs font-mono text-muted-foreground w-16">{label}</span>}
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

export default function RolagensTab({ campanhaId }: { campanhaId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const rolarMut = useRolar(campanhaId);
  const { data: rolagens = [] } = useListRolagens(campanhaId);
  const lastRollRef = useRef<CampanhaRolagem | null>(null);
  const [latestRoll, setLatestRoll] = useState<CampanhaRolagem | null>(null);

  const defaultNome = user?.firstName ?? user?.email?.split("@")[0] ?? "";

  const [tipo, setTipo] = useState<"pericia" | "dano">("pericia");
  const [rolandoComo, setRolandoComo] = useState(defaultNome);
  const [label, setLabel] = useState("");
  const [atributo, setAtributo] = useState<Atributo>("AGI");
  const [atributoVal, setAtributoVal] = useState(1);
  const [treinamento, setTreinamento] = useState(0);
  const [modificadoresO, setModificadoresO] = useState(0);
  const [expressaoDano, setExpressaoDano] = useState("1d6");
  const [showHistory, setShowHistory] = useState(true);

  const qtdTotal = atributoVal + modificadoresO;
  const previewText = qtdTotal > 0
    ? `${qtdTotal}d20 (maior) + ${treinamento}`
    : `${2 + Math.abs(qtdTotal)}d20 (menor) + ${treinamento}`;

  const handleRolar = async () => {
    try {
      let result: CampanhaRolagem;
      if (tipo === "dano") {
        result = await rolarMut.mutateAsync({ tipo: "dano", rolandoComo: rolandoComo || undefined, label: label || undefined, expressaoDano });
      } else {
        result = await rolarMut.mutateAsync({
          tipo: "pericia",
          rolandoComo: rolandoComo || undefined,
          label: label || undefined,
          atributo,
          qtdDadosBase: atributoVal,
          bonusPericia: treinamento,
          modificadoresO,
        });
      }
      setLatestRoll(result);
      lastRollRef.current = result;
      if (result.sucessoAutomatico) {
        toast({ title: "⚡ SUCESSO AUTOMÁTICO!", description: "20 natural na rolagem." });
      }
    } catch (e: any) {
      toast({ title: "ERRO NA ROLAGEM", description: e.message, variant: "destructive" });
    }
  };

  const history = rolagens.filter(r => latestRoll ? r.id !== latestRoll.id : true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="border border-border/50 rounded-sm bg-card/30 p-5 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Dice5 className="w-4 h-4 text-primary" />
            <h3 className="font-display text-sm tracking-widest text-muted-foreground uppercase">Mesa de Rolagens</h3>
          </div>

          <div className="flex gap-1.5">
            {(["pericia", "dano"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`flex-1 py-1.5 font-display text-xs tracking-widest uppercase border rounded-sm transition-all ${tipo === t ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}
              >
                {t === "pericia" ? "Perícia / Atributo" : "Dano"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Rolar como</Label>
              <Input
                value={rolandoComo}
                onChange={e => setRolandoComo(e.target.value)}
                placeholder="Nome do personagem"
                className="bg-secondary/30 border-border/60 font-mono text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Descrição</Label>
              <Input
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="ex: Furtividade, Ataque..."
                className="bg-secondary/30 border-border/60 font-mono text-sm h-8"
              />
            </div>
          </div>

          {tipo === "pericia" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Atributo</Label>
                <div className="flex flex-wrap gap-1.5">
                  {ATRIBUTOS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAtributo(a)}
                      className={`px-3 py-1 font-mono text-xs border rounded-sm transition-all ${atributo === a ? "bg-primary/20 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Valor do atributo</span>
                  <Spinner num={atributoVal} onChange={setAtributoVal} min={0} max={5} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Treinamento</Label>
                <div className="flex flex-wrap gap-1.5">
                  {TREINAMENTOS.map(t => (
                    <button
                      key={t.bonus}
                      onClick={() => setTreinamento(t.bonus)}
                      className={`px-2 py-1 font-mono text-xs border rounded-sm transition-all ${treinamento === t.bonus ? "bg-primary/20 border-primary text-primary" : "border-border/50 text-muted-foreground hover:border-border"}`}
                    >
                      {t.label} <span className="text-[10px] opacity-70">{t.bonus > 0 ? `+${t.bonus}` : "±0"}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Modificadores de Dado (+O / -O)</Label>
                <div className="flex items-center gap-3">
                  <Spinner num={modificadoresO} onChange={setModificadoresO} min={-5} max={5} />
                  {modificadoresO !== 0 && (
                    <span className={`text-xs font-mono ${modificadoresO > 0 ? "text-green-400" : "text-red-400"}`}>
                      {modificadoresO > 0 ? `+${modificadoresO}O (dado extra)` : `${modificadoresO}O (dado a menos)`}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-secondary/20 border border-border/30 rounded-sm px-3 py-2">
                <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-0.5">Prévia da rolagem</p>
                <p className="font-mono text-sm text-foreground">
                  {previewText}
                  {qtdTotal <= 0 && <span className="text-blue-400 text-xs ml-1">(penalidade)</span>}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">
                Expressão de Dano
              </Label>
              <Input
                value={expressaoDano}
                onChange={e => setExpressaoDano(e.target.value)}
                placeholder="ex: 2d6+4, 1d8, 3d4+2"
                className="bg-secondary/30 border-border/60 font-mono text-base h-10 tracking-wider"
              />
              <p className="text-[10px] text-muted-foreground/60 font-sans">
                Formato: NdF+B (ex: 2d6+4, 1d8, 3d4-1). Para Força, some ao bônus fixo.
              </p>
            </div>
          )}

          <Button
            onClick={handleRolar}
            disabled={rolarMut.isPending}
            className="w-full h-12 font-display text-sm tracking-[0.3em] uppercase bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {rolarMut.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : tipo === "pericia" ? (
              <><Dice5 className="w-4 h-4 mr-2" /> Rolar Dados</>
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
            <p className="font-display text-xs tracking-widest text-muted-foreground/40 uppercase">
              Nenhuma rolagem ainda
            </p>
            <p className="font-sans text-xs text-muted-foreground/30">
              Configure os dados ao lado e clique em Rolar
            </p>
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-2 text-[10px] font-display uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Histórico da sessão ({rolagens.length})</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHistory && (
            <div className="border border-border/40 rounded-sm bg-card/20 px-3 divide-y-0 max-h-[420px] overflow-y-auto">
              {rolagens.length === 0 ? (
                <p className="text-center text-muted-foreground/40 text-xs font-sans py-6">
                  Nenhuma rolagem registrada nesta operação
                </p>
              ) : (
                rolagens.map(r => <HistoryRow key={r.id} rolagem={r} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
