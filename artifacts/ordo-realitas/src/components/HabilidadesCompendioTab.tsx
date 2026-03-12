import { useState, useMemo } from "react";
import { useListHabilidades, type HabilidadeCompendio } from "@workspace/api-client-react";
import { Search, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

// ── categorias ───────────────────────────────────────────
const CATEGORIA_LABELS: Record<string, string> = {
  HABILIDADE_CLASSE: "Habilidade de Classe",
  PODER_CLASSE:      "Poder de Classe",
  PODER_GERAL:       "Poder Geral",
  TRILHA:            "Trilha",
  ORIGEM:            "Origem",
};

const CATEGORIA_COLORS: Record<string, string> = {
  HABILIDADE_CLASSE: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  PODER_CLASSE:      "bg-primary/15 text-primary border-primary/40",
  PODER_GERAL:       "bg-green-500/15 text-green-400 border-green-500/40",
  TRILHA:            "bg-violet-500/15 text-violet-400 border-violet-500/40",
  ORIGEM:            "bg-blue-500/15 text-blue-400 border-blue-500/40",
};

// ── classe ───────────────────────────────────────────────
const CLASSE_COLORS: Record<string, { badge: string; border: string }> = {
  COMBATENTE:   { badge: "bg-primary/15 text-primary border-primary/40",          border: "border-l-primary" },
  ESPECIALISTA: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/40",       border: "border-l-blue-400" },
  OCULTISTA:    { badge: "bg-violet-500/15 text-violet-400 border-violet-500/40", border: "border-l-violet-400" },
  SOBREVIVENTE: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/40",    border: "border-l-amber-400" },
  GERAL:        { badge: "bg-green-500/15 text-green-400 border-green-500/40",    border: "border-l-green-400" },
};

// ── filters ──────────────────────────────────────────────
const CLASSE_FILTERS = ["Todas", "COMBATENTE", "ESPECIALISTA", "OCULTISTA", "SOBREVIVENTE", "GERAL"];
const CLASSE_LABELS: Record<string, string> = {
  Todas: "Todas",
  COMBATENTE: "Combatente",
  ESPECIALISTA: "Especialista",
  OCULTISTA: "Ocultista",
  SOBREVIVENTE: "Sobrevivente",
  GERAL: "Geral",
};

const CATEGORIA_FILTERS = ["Todas", "HABILIDADE_CLASSE", "PODER_CLASSE", "PODER_GERAL", "TRILHA", "ORIGEM"];

// ── card ─────────────────────────────────────────────────
function HabilidadeCard({ hab }: { hab: HabilidadeCompendio }) {
  const classeColor = CLASSE_COLORS[hab.classe] ?? CLASSE_COLORS["GERAL"];
  const catColor    = CATEGORIA_COLORS[hab.categoria] ?? "bg-muted/30 text-muted-foreground border-border";

  return (
    <div className={`bg-card/60 rounded-sm border-l-[3px] pl-4 pr-4 py-3 ${classeColor.border}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* classe badge */}
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${classeColor.badge}`}>
          {CLASSE_LABELS[hab.classe] ?? hab.classe}
        </span>
        {/* categoria badge */}
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${catColor}`}>
          {CATEGORIA_LABELS[hab.categoria] ?? hab.categoria}
        </span>
        {/* nex badge */}
        {hab.nex != null && (
          <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-border/50 text-muted-foreground">
            NEX {hab.nex}%
          </span>
        )}
        {/* supl badge */}
        {hab.fonte === "SOBREVIVENDO_AO_HORROR" && (
          <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-primary/35 bg-primary/10 text-primary">
            SUPL
          </span>
        )}
        {/* alterada badge */}
        {hab.alterada && (
          <span className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest text-yellow-500">
            <AlertTriangle className="w-2.5 h-2.5" />
            ALTERADA
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-foreground mb-1">{hab.nome}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{hab.descricao}</div>
    </div>
  );
}

// ── main component ────────────────────────────────────────
export function HabilidadesCompendioTab() {
  const { data: habilidades, isLoading } = useListHabilidades();
  const [activeClasse,    setActiveClasse]    = useState("Todas");
  const [activeCategoria, setActiveCategoria] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = useMemo<HabilidadeCompendio[]>(() => {
    let list = habilidades ?? [];
    if (activeClasse !== "Todas")    list = list.filter((h) => h.classe    === activeClasse);
    if (activeCategoria !== "Todas") list = list.filter((h) => h.categoria === activeCategoria);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.nome.toLowerCase().includes(q) ||
          (h.descricao ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [habilidades, activeClasse, activeCategoria, search]);

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">
        Carregando habilidades...
      </div>
    );
  }

  if (!habilidades?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground font-mono text-sm">
        Nenhuma habilidade encontrada no banco de dados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* classe filter */}
      <div className="flex flex-wrap gap-1">
        {CLASSE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveClasse(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors duration-150 ${
              activeClasse === f
                ? "bg-primary/15 text-primary border-primary/50"
                : "text-muted-foreground border-border/50 hover:text-foreground hover:bg-card/60"
            }`}
          >
            {CLASSE_LABELS[f] ?? f}
          </button>
        ))}
      </div>

      {/* categoria filter */}
      <div className="flex flex-wrap gap-1">
        {CATEGORIA_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveCategoria(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors duration-150 ${
              activeCategoria === f
                ? "bg-card text-foreground border-border"
                : "text-muted-foreground border-border/40 hover:text-foreground hover:bg-card/40"
            }`}
          >
            {f === "Todas" ? "Todas as Categorias" : (CATEGORIA_LABELS[f] ?? f)}
          </button>
        ))}
      </div>

      {/* search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou descrição…"
          className="pl-9 h-9 bg-card/60 border-border/60 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* count */}
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        {filtered.length} habilidade{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
        {" "}· {habilidades.length} total no banco
      </p>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          Nenhuma habilidade encontrada com esses filtros.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((h) => (
            <HabilidadeCard key={h.id} hab={h} />
          ))}
        </div>
      )}
    </div>
  );
}
