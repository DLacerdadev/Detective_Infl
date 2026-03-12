import { useState, useMemo } from "react";
import { useListClasses } from "@workspace/api-client-react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type HabilidadeProgressao = {
  nex: string;
  nome: string;
  descricao: string;
};

type DbClasse = {
  id: string;
  nome: string;
  habilidadesBase?: HabilidadeProgressao[];
};

type FlatHabilidade = HabilidadeProgressao & { classe: string };

const GENERIC_PATTERNS = [
  "habilidade de trilha",
  "poder de ",
  "aumento de atributo",
  "grau de treinamento",
  "versatilidade",
  "engenhosidade",
];

function isGeneric(nome: string) {
  const lower = nome.toLowerCase();
  return GENERIC_PATTERNS.some((p) => lower.startsWith(p) || lower === p.trim());
}

const CLASS_FILTERS = ["Todas", "Combatente", "Especialista", "Ocultista", "Sobrevivente"];

const CLASS_COLORS: Record<string, { badge: string; border: string }> = {
  Combatente:   { badge: "bg-primary/15 text-primary border-primary/40",          border: "border-l-primary" },
  Especialista: { badge: "bg-blue-500/15 text-blue-400 border-blue-500/40",        border: "border-l-blue-400" },
  Ocultista:    { badge: "bg-violet-500/15 text-violet-400 border-violet-500/40",  border: "border-l-violet-400" },
  Sobrevivente: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/40",     border: "border-l-amber-400" },
};

function HabilidadeCard({ hab }: { hab: FlatHabilidade }) {
  const generic = isGeneric(hab.nome);
  const colors = CLASS_COLORS[hab.classe] ?? CLASS_COLORS["Combatente"];

  return (
    <div
      className={`bg-card/60 rounded-sm border-l-[3px] pl-4 pr-4 py-3 transition-opacity ${
        generic ? "opacity-50" : "opacity-100"
      } ${colors.border}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span
          className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${colors.badge}`}
        >
          {hab.classe}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-border/50 text-muted-foreground">
          NEX {hab.nex}
        </span>
        {generic && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">
            genérico
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-foreground mb-1">{hab.nome}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{hab.descricao}</div>
    </div>
  );
}

export function HabilidadesCompendioTab() {
  const { data: classes, isLoading } = useListClasses();
  const [activeClasse, setActiveClasse] = useState("Todas");
  const [search, setSearch] = useState("");

  const allHabilidades = useMemo<FlatHabilidade[]>(() => {
    if (!classes) return [];
    const flat: FlatHabilidade[] = [];
    (classes as DbClasse[]).forEach((c) => {
      (c.habilidadesBase ?? []).forEach((h) => {
        flat.push({ ...h, classe: c.nome });
      });
    });
    return flat;
  }, [classes]);

  const filtered = useMemo(() => {
    let list = allHabilidades;
    if (activeClasse !== "Todas") {
      list = list.filter((h) => h.classe === activeClasse);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.nome.toLowerCase().includes(q) ||
          h.descricao.toLowerCase().includes(q) ||
          h.nex.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allHabilidades, activeClasse, search]);

  const named   = filtered.filter((h) => !isGeneric(h.nome));
  const generic = filtered.filter((h) =>  isGeneric(h.nome));

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">
        Carregando habilidades...
      </div>
    );
  }

  return (
    <div>
      {/* filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-0 border border-border/60 rounded-sm overflow-hidden shrink-0">
          {CLASS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveClasse(f)}
              className={`px-4 py-2 text-xs font-semibold border-r border-border/60 last:border-r-0 transition-colors duration-150 ${
                activeClasse === f
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, descrição ou NEX…"
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
      </div>

      {/* result count */}
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">
        {named.length} habilidade{named.length !== 1 ? "s" : ""} encontrada{named.length !== 1 ? "s" : ""}
        {generic.length > 0 && ` · ${generic.length} genérica${generic.length !== 1 ? "s" : ""}`}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          Nenhuma habilidade encontrada.
        </div>
      ) : (
        <div className="space-y-2">
          {/* named abilities first */}
          {named.map((h, i) => (
            <HabilidadeCard key={`${h.classe}-${h.nex}-${i}`} hab={h} />
          ))}

          {/* divider if both sections present */}
          {named.length > 0 && generic.length > 0 && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 border-t border-border/30" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">
                Progressão genérica
              </span>
              <div className="flex-1 border-t border-border/30" />
            </div>
          )}

          {/* generic entries below */}
          {generic.map((h, i) => (
            <HabilidadeCard key={`${h.classe}-${h.nex}-gen-${i}`} hab={h} />
          ))}
        </div>
      )}
    </div>
  );
}
