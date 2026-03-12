import { useState } from "react";
import { useListOrigins } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Users, Zap, ChevronDown, ChevronUp } from "lucide-react";

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

function OrigemCard({ origem }: { origem: Origem }) {
  const [expanded, setExpanded] = useState(false);
  const isSupl = origem.fonte === "Sobrevivendo ao Horror";

  return (
    <div
      className={`border rounded-sm overflow-hidden transition-all duration-200 cursor-pointer
        ${expanded ? "border-primary/60 bg-card" : "border-border/50 bg-card/60 hover:border-border hover:bg-card/80"}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-display font-bold text-foreground text-base leading-tight">{origem.nome}</span>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono tracking-wide shrink-0 ${
                  isSupl
                    ? "border-primary/50 text-primary bg-primary/10"
                    : "border-blue-500/50 text-blue-400 bg-blue-500/10"
                }`}
              >
                {isSupl ? "SUPL" : "LIVRO BASE"}
              </Badge>
            </div>
            {origem.criador && (
              <p className="text-[11px] text-muted-foreground font-mono italic truncate">
                {origem.criador}
              </p>
            )}
          </div>
          <div className="text-muted-foreground shrink-0 mt-0.5">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {origem.periciasConcedidas && origem.periciasConcedidas.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {origem.periciasConcedidas.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-sm px-2 py-0.5 text-[11px] font-mono"
              >
                <BookOpen className="h-2.5 w-2.5" />
                {p}
              </span>
            ))}
          </div>
        )}

        {origem.poderConcedido && (
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-400 font-display text-sm font-semibold">{origem.poderConcedido}</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-3">
          {origem.descricao && (
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">{origem.descricao}</p>
          )}
          {origem.poderDescricao && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-sm p-3">
              <p className="text-[10px] font-display uppercase tracking-widest text-amber-400/70 mb-1">Efeito do Poder</p>
              <p className="text-sm text-foreground/80 leading-relaxed font-sans">{origem.poderDescricao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function OrigensTab() {
  const { data: origins, isLoading } = useListOrigins();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Livro Base" | "Sobrevivendo ao Horror">("all");

  const filtered = (origins ?? []).filter((o: Origem) => {
    const matchSearch =
      !search ||
      o.nome.toLowerCase().includes(search.toLowerCase()) ||
      (o.periciasConcedidas ?? []).some((p) => p.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "all" || o.fonte === filter;
    return matchSearch && matchFilter;
  });

  const livroBase = (origins ?? []).filter((o: Origem) => o.fonte === "Livro Base").length;
  const supl = (origins ?? []).filter((o: Origem) => o.fonte === "Sobrevivendo ao Horror").length;

  if (isLoading)
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando origens...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="bg-card border border-border/50 rounded-sm px-4 py-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">
            <span className="text-foreground font-bold">{(origins ?? []).length}</span>{" "}
            <span className="text-muted-foreground">origens no total</span>
          </span>
        </div>
        <div className="bg-card border border-blue-500/25 rounded-sm px-4 py-2">
          <span className="font-mono text-sm">
            <span className="text-blue-400 font-bold">{livroBase}</span>{" "}
            <span className="text-muted-foreground">Livro Base</span>
          </span>
        </div>
        <div className="bg-card border border-primary/25 rounded-sm px-4 py-2">
          <span className="font-mono text-sm">
            <span className="text-primary font-bold">{supl}</span>{" "}
            <span className="text-muted-foreground">Sobrevivendo ao Horror</span>
          </span>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por nome ou perícia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 font-mono text-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "Livro Base", "Sobrevivendo ao Horror"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-sm text-xs font-display uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "bg-transparent border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
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

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
          Nenhuma origem encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((o: Origem) => (
            <OrigemCard key={o.id} origem={o} />
          ))}
        </div>
      )}
    </div>
  );
}
