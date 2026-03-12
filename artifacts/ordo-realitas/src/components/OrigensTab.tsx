import { useState, useMemo } from "react";
import { useListOrigins } from "@workspace/api-client-react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type Origem = {
  id: string;
  nome: string;
  descricao?: string;
  periciasConcedidas?: string[];
  poderConcedido?: string;
  poderDescricao?: string;
  fonte?: string;
  criador?: string;
};

// simple emoji icon per origin name (first 2 chars fallback)
const ICONS: Record<string, string> = {
  "Acadêmico":              "🎓",
  "Agente de Saúde":        "🏥",
  "Amnésico":               "🌀",
  "Artista":                "🎨",
  "Chef":                   "👨‍🍳",
  "Combatente":             "⚔️",
  "Criminoso":              "🦹",
  "Detetive":               "🔍",
  "Esportista":             "🏃",
  "Herdeiro":               "💎",
  "Jornalista":             "📰",
  "Magnata":                "💰",
  "Mercenário":             "🔫",
  "Militar":                "🪖",
  "Operário":               "🔧",
  "Policial":               "🚔",
  "Religioso":              "✝️",
  "Servidor Público":       "🏛️",
  "Teórico da Conspiração": "🕵️",
  "T.I.":                   "💻",
  "Trabalhador Rural":      "🌾",
  "Trambiqueiro":           "🃏",
  "Vítima":                 "🩹",
  "Desaparecido":           "👤",
  "Agente Especial":        "🕶️",
  "Assassino":              "🗡️",
  "Ativista":               "✊",
  "Cultista Arrependido":   "📿",
  "Ex-Interno":             "🏚️",
  "Morador de Rua":         "🏕️",
  "Médium":                 "🔮",
  "Paramédico":             "🚑",
  "Policial Corrupto":      "🚨",
  "Presidiário":            "⛓️",
  "Profeta":                "📯",
  "Segurança":              "🛡️",
  "Vagabundo":              "🎒",
  "Veterano":               "🎖️",
};

function iconFor(nome: string) {
  return ICONS[nome] ?? nome.slice(0, 1).toUpperCase();
}

function OrigemCard({ origem }: { origem: Origem }) {
  const [expanded, setExpanded] = useState(false);
  const isSupl = origem.fonte === "Sobrevivendo ao Horror";
  const icon = iconFor(origem.nome);

  return (
    <div
      className={`border rounded-sm overflow-hidden transition-all duration-200 cursor-pointer select-none
        ${expanded
          ? "border-primary/60 shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(192,57,43,0.3)]"
          : "border-border/60 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_0_1px_rgba(192,57,43,0.2)]"
        }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* card header */}
      <div className="flex items-start gap-3 p-4 pb-3 border-b border-border/40">
        {/* icon box */}
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl shrink-0 ${isSupl ? "bg-primary/15" : "bg-blue-500/15"}`}>
          {icon}
        </div>

        {/* title + source */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-foreground text-sm leading-tight mb-0.5">{origem.nome}</div>
          <div className="text-[10px] text-muted-foreground">{origem.fonte ?? "—"}</div>
          {/* badges */}
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            <span className={`text-[9px] font-mono uppercase tracking-widest rounded-sm px-1.5 py-0.5 border ${
              isSupl
                ? "bg-primary/15 border-primary/35 text-primary"
                : "bg-blue-500/15 border-blue-500/35 text-blue-400"
            }`}>
              {isSupl ? "SUPL" : "LIVRO BASE"}
            </span>
          </div>
        </div>
      </div>

      {/* card body */}
      <div className="p-4 pt-3">
        {/* descrição truncada/completa */}
        <p className={`text-xs text-muted-foreground leading-relaxed mb-3 ${expanded ? "" : "line-clamp-3"}`}>
          {origem.descricao}
        </p>

        {/* perícias */}
        {origem.periciasConcedidas && origem.periciasConcedidas.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {origem.periciasConcedidas.map((p) => (
              <span
                key={p}
                className="bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-sm px-2 py-0.5 text-[10px] font-mono"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {/* poder (nome sempre visível, desc só expanded) */}
        {origem.poderConcedido && (
          <div className="bg-background/40 border border-border/50 rounded-sm p-3">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Poder</div>
            <div className="text-sm font-semibold text-foreground mb-1">{origem.poderConcedido}</div>
            {expanded && origem.poderDescricao && (
              <p className="text-xs text-muted-foreground leading-relaxed">{origem.poderDescricao}</p>
            )}
          </div>
        )}

        {origem.criador && (
          <p className="text-[10px] text-muted-foreground italic mt-2">{origem.criador}</p>
        )}
      </div>

      {/* card footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/40">
        <button className="flex items-center gap-1 text-xs text-primary font-medium">
          {expanded ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Ver menos</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> Ver mais</>
          )}
        </button>
      </div>
    </div>
  );
}

export function OrigensTab() {
  const { data: origins, isLoading } = useListOrigins();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Livro Base" | "Sobrevivendo ao Horror">("all");

  const all: Origem[] = origins ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return all.filter((o) => {
      const matchSearch =
        !q ||
        o.nome.toLowerCase().includes(q) ||
        (o.periciasConcedidas ?? []).some((p) => p.toLowerCase().includes(q)) ||
        (o.poderConcedido ?? "").toLowerCase().includes(q);
      const matchFilter = filter === "all" || o.fonte === filter;
      return matchSearch && matchFilter;
    });
  }, [all, search, filter]);

  const total   = all.length;
  const livroB  = all.filter((o) => o.fonte === "Livro Base").length;
  const supl    = all.filter((o) => o.fonte === "Sobrevivendo ao Horror").length;

  if (isLoading)
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando origens...</div>;

  return (
    <div className="space-y-5">
      {/* stat pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-foreground">
          <strong className="text-primary">{total}</strong> origens no total
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-foreground">
          <strong className="text-blue-400">{livroB}</strong> Livro Base
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-foreground">
          <strong className="text-primary">{supl}</strong> Sobrevivendo ao Horror
        </div>
      </div>

      {/* controls */}
      <div className="flex gap-3 flex-wrap items-center bg-card border border-border/60 rounded-sm p-3">
        {/* search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome, perícia ou poder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-background border border-border/60 rounded-sm py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors font-mono"
          />
        </div>

        {/* filter buttons */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "Livro Base", "Sobrevivendo ao Horror"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-sm px-3 py-1.5 text-xs font-display uppercase tracking-widest border transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "bg-background border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f === "Livro Base" ? "Livro Base" : "Suplemento"}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground font-mono ml-auto">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          <div className="text-4xl mb-4">🔍</div>
          Nenhuma origem encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((o: Origem) => (
            <OrigemCard key={o.id} origem={o} />
          ))}
        </div>
      )}
    </div>
  );
}
