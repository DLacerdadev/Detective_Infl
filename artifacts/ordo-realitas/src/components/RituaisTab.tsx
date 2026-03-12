import { useState } from "react";
import { useListRituals } from "@workspace/api-client-react";
import type { Ritual } from "@workspace/api-client-react";
import { ChevronDown, ChevronRight } from "lucide-react";

type Elemento = "Todos" | "Sangue" | "Morte" | "Conhecimento" | "Energia" | "Medo" | "Variável";
type Circulo = 0 | 1 | 2 | 3 | 4;

const ELEM_CONFIG: Record<string, { label: string; color: string; border: string; bg: string; dot: string }> = {
  "Sangue":      { label: "🩸 Sangue",      color: "text-red-400",    border: "border-red-500/50",    bg: "bg-red-500/10",    dot: "bg-red-400" },
  "Morte":       { label: "💀 Morte",        color: "text-slate-300",  border: "border-slate-400/50",  bg: "bg-slate-500/10",  dot: "bg-slate-300" },
  "Conhecimento":{ label: "🧠 Conhecimento", color: "text-violet-400", border: "border-violet-500/50", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  "Energia":     { label: "⚡ Energia",      color: "text-yellow-400", border: "border-yellow-500/50", bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
  "Medo":        { label: "👁 Medo",         color: "text-purple-400", border: "border-purple-500/50", bg: "bg-purple-500/10", dot: "bg-purple-400" },
  "Variável":    { label: "✦ Variável",      color: "text-amber-400",  border: "border-amber-500/50",  bg: "bg-amber-500/10",  dot: "bg-amber-400" },
};

const CIRCULO_LABELS: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

function circuloColor(c: number) {
  if (c === 1) return "text-green-400 border-green-500/50 bg-green-500/10";
  if (c === 2) return "text-blue-400 border-blue-500/50 bg-blue-500/10";
  if (c === 3) return "text-violet-400 border-violet-500/50 bg-violet-500/10";
  return "text-red-400 border-red-500/50 bg-red-500/10";
}

function RitualCard({ ritual }: { ritual: Ritual }) {
  const [open, setOpen] = useState(false);
  const cfg = ELEM_CONFIG[ritual.elemento] ?? ELEM_CONFIG["Variável"];

  return (
    <div
      className={`border rounded-sm transition-all duration-200 ${open ? cfg.border + " " + cfg.bg : "border-border/50 bg-card/40 hover:border-border"}`}
    >
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mt-0.5 text-muted-foreground shrink-0">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-bold text-foreground">{ritual.nome}</span>
            {ritual.fonte === "Sobrevivendo ao Horror" && (
              <span className="text-[9px] font-mono uppercase tracking-widest bg-primary/15 border border-primary/35 rounded-sm px-1.5 py-0.5 text-primary shrink-0">
                SUPL
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-1.5 py-0.5 border rounded-sm ${cfg.color} ${cfg.border} bg-transparent`}>
              {ritual.elemento}
            </span>
            <span className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-1.5 py-0.5 border rounded-sm ${circuloColor(ritual.circulo)}`}>
              {CIRCULO_LABELS[ritual.circulo]}º Círculo
            </span>
            {ritual.execucao && (
              <span className="text-[10px] text-muted-foreground font-mono">{ritual.execucao}</span>
            )}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ritual.alcance && (
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Alcance</div>
                <div className="text-xs text-foreground/80">{ritual.alcance}</div>
              </div>
            )}
            {ritual.alvo && (
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Alvo/Área</div>
                <div className="text-xs text-foreground/80">{ritual.alvo}</div>
              </div>
            )}
            {ritual.duracao && (
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Duração</div>
                <div className="text-xs text-foreground/80">{ritual.duracao}</div>
              </div>
            )}
            {ritual.resistencia && (
              <div>
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-0.5">Resistência</div>
                <div className="text-xs text-foreground/80">{ritual.resistencia}</div>
              </div>
            )}
          </div>

          {ritual.descricao && (
            <div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Efeito</div>
              <p className="text-xs text-foreground/90 leading-relaxed">{ritual.descricao}</p>
            </div>
          )}

          {ritual.discente && (
            <div className="border-l-2 border-blue-500/60 pl-3">
              <div className="text-[9px] uppercase tracking-widest text-blue-400 mb-0.5 font-bold">Discente</div>
              <p className="text-xs text-foreground/80 leading-relaxed">{ritual.discente}</p>
            </div>
          )}

          {ritual.verdadeiro && (
            <div className="border-l-2 border-primary/70 pl-3">
              <div className="text-[9px] uppercase tracking-widest text-primary mb-0.5 font-bold">Verdadeiro</div>
              <p className="text-xs text-foreground/80 leading-relaxed">{ritual.verdadeiro}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ELEMENTOS: Elemento[] = ["Todos", "Sangue", "Morte", "Conhecimento", "Energia", "Medo", "Variável"];
const CIRCULOS: Circulo[] = [0, 1, 2, 3, 4];

export function RituaisTab() {
  const { data: rituais, isLoading } = useListRituals();
  const [filtroElem, setFiltroElem] = useState<Elemento>("Todos");
  const [filtroCirc, setFiltroCirc] = useState<Circulo>(0);
  const [busca, setBusca] = useState("");

  if (isLoading)
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando rituais...</div>;

  const lista = (rituais as Ritual[] ?? []);

  const filtrados = lista.filter((r) => {
    if (filtroElem !== "Todos" && r.elemento !== filtroElem) return false;
    if (filtroCirc !== 0 && r.circulo !== filtroCirc) return false;
    if (busca) {
      const q = busca.toLowerCase();
      return (
        r.nome.toLowerCase().includes(q) ||
        r.elemento.toLowerCase().includes(q) ||
        (r.descricao ?? "").toLowerCase().includes(q) ||
        (r.alcance ?? "").toLowerCase().includes(q) ||
        (r.execucao ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countByElem = (e: string) => lista.filter((r) => r.elemento === e).length;
  const countByCirc = (c: number) => lista.filter((r) => r.circulo === c).length;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {ELEMENTOS.map((e) => {
            const cfg = e !== "Todos" ? ELEM_CONFIG[e] : null;
            const count = e === "Todos" ? lista.length : countByElem(e);
            const isActive = filtroElem === e;
            return (
              <button
                key={e}
                onClick={() => setFiltroElem(e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold border transition-all duration-150 ${
                  isActive
                    ? cfg
                      ? `${cfg.color} ${cfg.border} ${cfg.bg}`
                      : "text-foreground border-border bg-secondary/40"
                    : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
                }`}
              >
                {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />}
                {e === "Todos" ? "Todos" : e}
                <span className="text-[10px] opacity-60 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {CIRCULOS.map((c) => (
            <button
              key={c}
              onClick={() => setFiltroCirc(c)}
              className={`px-3 py-1 rounded-sm text-xs font-mono border transition-all duration-150 ${
                filtroCirc === c
                  ? c === 0
                    ? "text-foreground border-border bg-secondary/40"
                    : circuloColor(c) + " font-bold"
                  : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"
              }`}
            >
              {c === 0 ? `Todos (${lista.length})` : `${CIRCULO_LABELS[c]}º Círculo (${countByCirc(c)})`}
            </button>
          ))}

          <input
            type="text"
            placeholder="Buscar ritual..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="ml-auto flex-1 min-w-[180px] max-w-xs px-3 py-1.5 text-xs bg-secondary/20 border border-border/60 rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-secondary/30"
          />
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground font-mono">
        {filtrados.length} de {lista.length} ritual{lista.length !== 1 ? "is" : ""}
      </div>

      {filtrados.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm font-mono">
          Nenhum ritual encontrado.
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map((r) => (
            <RitualCard key={r.id} ritual={r} />
          ))}
        </div>
      )}
    </div>
  );
}
