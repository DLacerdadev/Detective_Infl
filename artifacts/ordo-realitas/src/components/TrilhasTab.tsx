import { useState } from "react";
import { useListTrilhas } from "@workspace/api-client-react";
import type { Trilha } from "@workspace/api-client-react";

const CLASS_FILTERS = [
  { key: "Todas",       label: "Todas" },
  { key: "Combatente",  label: "⚔️ Combatente" },
  { key: "Especialista",label: "🔍 Especialista" },
  { key: "Ocultista",   label: "✨ Ocultista" },
  { key: "Sobrevivente",label: "🏃 Sobrevivente" },
];

const CLASS_COLORS: Record<string, string> = {
  Combatente:  "border-red-500/50 bg-red-950/20",
  Especialista:"border-blue-500/50 bg-blue-950/20",
  Ocultista:   "border-violet-500/50 bg-violet-950/20",
  Sobrevivente:"border-amber-500/50 bg-amber-950/20",
};

const CLASS_BADGE_COLORS: Record<string, string> = {
  Combatente:  "bg-red-900/40 text-red-300 border-red-700/50",
  Especialista:"bg-blue-900/40 text-blue-300 border-blue-700/50",
  Ocultista:   "bg-violet-900/40 text-violet-300 border-violet-700/50",
  Sobrevivente:"bg-amber-900/40 text-amber-300 border-amber-700/50",
};

const NEX_COLORS: Record<string, string> = {
  "10%":       "text-green-400",
  "40%":       "text-blue-400",
  "65%":       "text-violet-400",
  "99%":       "text-primary",
  "Estágio 2": "text-green-400",
  "Estágio 4": "text-primary",
};

function getNexColor(nex: string) {
  return NEX_COLORS[nex] ?? "text-amber-400";
}

function TrilhaCard({ trilha }: { trilha: Trilha }) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = CLASS_COLORS[trilha.classeNome] ?? "border-border/60 bg-card/60";
  const badgeColor  = CLASS_BADGE_COLORS[trilha.classeNome] ?? "bg-muted/40 text-muted-foreground border-border/50";
  const isSupl      = trilha.fonte !== "Livro Base";

  return (
    <div
      className={`border rounded-sm overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-[0_4px_20px_rgba(192,57,43,0.15)] ${borderColor}`}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="text-sm font-bold text-foreground leading-tight">{trilha.nome}</div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`text-[10px] font-mono uppercase tracking-widest border rounded-sm px-1.5 py-0.5 ${badgeColor}`}>
                {trilha.classeNome}
              </span>
              {isSupl && (
                <span className="text-[9px] font-mono uppercase tracking-widest bg-primary/15 border border-primary/35 rounded-sm px-1.5 py-0.5 text-primary">
                  SUPL
                </span>
              )}
              {!isSupl && (
                <span className="text-[9px] font-mono text-muted-foreground/60">
                  Livro Base
                </span>
              )}
            </div>
          </div>
          <div className="text-muted-foreground/50 text-xs mt-0.5 shrink-0 select-none">
            {expanded ? "▲" : "▼"}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {trilha.habilidades.map((h) => (
            <span
              key={h.nex}
              className={`text-[10px] font-bold font-display ${getNexColor(h.nex)}`}
            >
              {h.nex}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/40 divide-y divide-border/20">
          {trilha.habilidades.map((h) => (
            <div key={h.nex} className="px-4 py-3 flex gap-3">
              <div className={`text-[11px] font-bold font-display shrink-0 w-14 pt-0.5 ${getNexColor(h.nex)}`}>
                {h.nex}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground mb-1">{h.nome}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{h.descricao}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TrilhasTab() {
  const { data: trilhas, isLoading } = useListTrilhas();
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">
        Carregando trilhas...
      </div>
    );
  }

  const all = (trilhas as Trilha[] | undefined) ?? [];

  const filtered = all.filter((t) => {
    const matchClass = filter === "Todas" || t.classeNome === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.nome.toLowerCase().includes(q) ||
      t.classeNome.toLowerCase().includes(q) ||
      t.habilidades.some(
        (h) =>
          h.nome.toLowerCase().includes(q) ||
          h.descricao.toLowerCase().includes(q)
      );
    return matchClass && matchSearch;
  });

  const counts: Record<string, number> = {};
  all.forEach((t) => { counts[t.classeNome] = (counts[t.classeNome] ?? 0) + 1; });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-0 border border-border/60 rounded-sm overflow-x-auto shrink-0">
          {CLASS_FILTERS.map((f) => {
            const count = f.key === "Todas" ? all.length : (counts[f.key] ?? 0);
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-r last:border-r-0 border-border/40 transition-colors duration-150 flex items-center gap-1.5 ${
                  filter === f.key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                }`}
              >
                {f.label}
                <span className="text-[10px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="Buscar trilha, habilidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 bg-secondary/20 border border-border/60 rounded-sm px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          Nenhuma trilha encontrada.
        </div>
      ) : (
        <>
          <div className="text-xs text-muted-foreground mb-4 font-mono">
            {filtered.length} trilha{filtered.length !== 1 ? "s" : ""} — clique para expandir as habilidades
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <TrilhaCard key={t.id} trilha={t} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
