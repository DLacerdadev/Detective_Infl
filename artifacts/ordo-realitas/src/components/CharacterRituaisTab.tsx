import { useState } from "react";
import { useListRituals } from "@workspace/api-client-react";
import type { Ritual } from "@workspace/api-client-react";
import { ChevronDown, ChevronRight, ScrollText, Sparkles } from "lucide-react";

const ELEM_CONFIG: Record<string, { label: string; color: string; border: string; bg: string; dot: string }> = {
  "Sangue":       { label: "🩸 Sangue",      color: "text-red-400",    border: "border-red-500/50",    bg: "bg-red-500/10",    dot: "bg-red-400" },
  "Morte":        { label: "💀 Morte",        color: "text-stone-500",  border: "border-stone-600/50",  bg: "bg-stone-900/30",  dot: "bg-stone-600" },
  "Conhecimento": { label: "🧠 Conhecimento", color: "text-yellow-400", border: "border-yellow-500/50", bg: "bg-yellow-500/10", dot: "bg-yellow-400" },
  "Energia":      { label: "⚡ Energia",      color: "text-purple-400", border: "border-purple-500/50", bg: "bg-purple-500/10", dot: "bg-purple-400" },
  "Medo":         { label: "👁 Medo",         color: "text-slate-300",  border: "border-slate-400/50",  bg: "bg-slate-500/10",  dot: "bg-slate-300" },
  "Variável":     { label: "✦ Variável",      color: "text-violet-400", border: "border-violet-500/50", bg: "bg-violet-500/10", dot: "bg-violet-400" },
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
    <div className={`border rounded-sm transition-all duration-200 ${open ? cfg.border + " " + cfg.bg : "border-border/50 bg-card/40 hover:border-border"}`}>
      <button className="w-full text-left p-4 flex items-start gap-3" onClick={() => setOpen((v) => !v)}>
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
            {ritual.custoPe != null && (
              <span className="text-[10px] text-muted-foreground font-mono">{ritual.custoPe} PE</span>
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
              <div className="flex items-center gap-2 mb-1">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Efeito</div>
                {(ritual as any).dados && (
                  <span className="font-mono text-[11px] bg-muted/40 border border-border/60 rounded px-1.5 py-0.5 text-foreground/80 tracking-wide">
                    🎲 {(ritual as any).dados}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">{ritual.descricao}</p>
            </div>
          )}

          {ritual.discente && (
            <div className="border-l-2 border-blue-500/60 pl-3">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="text-[9px] uppercase tracking-widest text-blue-400 font-bold">Discente</div>
                {(ritual as any).dadosDiscente && (
                  <span className="font-mono text-[11px] bg-blue-950/40 border border-blue-700/50 rounded px-1.5 py-0.5 text-blue-300 tracking-wide">
                    🎲 {(ritual as any).dadosDiscente}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{ritual.discente}</p>
            </div>
          )}

          {ritual.verdadeiro && (
            <div className="border-l-2 border-red-500/60 pl-3">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="text-[9px] uppercase tracking-widest text-red-400 font-bold">Forma Verdadeira</div>
                {(ritual as any).dadosVerdadeiro && (
                  <span className="font-mono text-[11px] bg-red-950/40 border border-red-700/50 rounded px-1.5 py-0.5 text-red-300 tracking-wide">
                    🎲 {(ritual as any).dadosVerdadeiro}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{ritual.verdadeiro}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  ritualIds: string[];
  classeNome?: string | null;
}

export default function CharacterRituaisTab({ ritualIds, classeNome }: Props) {
  const { data: allRituals, isLoading } = useListRituals();

  const isOcultista = classeNome?.toLowerCase().includes("ocultista");

  const myRituals: Ritual[] = (allRituals as Ritual[] | undefined ?? []).filter(
    (r) => ritualIds.includes(r.id)
  );

  const byCirculo = myRituals.reduce<Record<number, Ritual[]>>((acc, r) => {
    if (!acc[r.circulo]) acc[r.circulo] = [];
    acc[r.circulo].push(r);
    return acc;
  }, {});

  const circulos = Object.keys(byCirculo).map(Number).sort((a, b) => a - b);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary/20 border border-border/30 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (!isOcultista) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
        <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">
          Rituais são exclusivos da classe Ocultista.
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          Classe atual: {classeNome ?? "nenhuma"}
        </p>
      </div>
    );
  }

  if (myRituals.length === 0) {
    return (
      <div className="border border-border/40 border-dashed rounded-sm p-10 text-center space-y-2">
        <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">
          Nenhum ritual registrado neste dossiê.
        </p>
        <p className="font-mono text-xs text-muted-foreground/50">
          Rituais podem ser adicionados durante a criação do personagem ou por um mestre.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-display tracking-widest text-muted-foreground uppercase">
          {myRituals.length} {myRituals.length === 1 ? "ritual conhecido" : "rituais conhecidos"}
        </p>
      </div>

      {circulos.map((c) => (
        <div key={c} className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 border rounded-sm ${circuloColor(c)}`}>
              {CIRCULO_LABELS[c] ?? c}º Círculo
            </div>
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] text-muted-foreground/50 font-mono">{byCirculo[c].length}</span>
          </div>
          <div className="space-y-2">
            {byCirculo[c].map((r) => (
              <RitualCard key={r.id} ritual={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
