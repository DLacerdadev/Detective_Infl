import { useState, useMemo, Fragment } from "react";
import { useListRituals } from "@workspace/api-client-react";
import { Search, ChevronDown, ChevronUp, Flame, Skull, Brain, Zap, Ghost, Shuffle } from "lucide-react";
import { Card } from "@/components/ui/card";

type Ritual = {
  id: string;
  nome: string;
  elemento: string;
  circulo: number;
  execucao?: string | null;
  alcance?: string | null;
  alvo?: string | null;
  duracao?: string | null;
  resistencia?: string | null;
  custoPe?: number;
  descricao?: string | null;
  discente?: string | null;
  verdadeiro?: string | null;
  fonte?: string | null;
};

const ELEM_CONFIG: Record<string, { label: string; icon: React.ReactNode; badge: string; row: string }> = {
  Sangue:      { label: "Sangue",      icon: <Flame   className="w-3 h-3" />, badge: "bg-red-900/60 text-red-300 border-red-700",    row: "hover:bg-red-950/20" },
  Morte:       { label: "Morte",       icon: <Skull   className="w-3 h-3" />, badge: "bg-slate-700/60 text-slate-300 border-slate-600", row: "hover:bg-slate-900/20" },
  Conhecimento:{ label: "Conhecimento",icon: <Brain   className="w-3 h-3" />, badge: "bg-violet-900/60 text-violet-300 border-violet-700", row: "hover:bg-violet-950/20" },
  Energia:     { label: "Energia",     icon: <Zap     className="w-3 h-3" />, badge: "bg-yellow-900/60 text-yellow-300 border-yellow-700", row: "hover:bg-yellow-950/20" },
  Medo:        { label: "Medo",        icon: <Ghost   className="w-3 h-3" />, badge: "bg-purple-900/60 text-purple-300 border-purple-700", row: "hover:bg-purple-950/20" },
  Variável:    { label: "Variável",    icon: <Shuffle className="w-3 h-3" />, badge: "bg-amber-900/60 text-amber-300 border-amber-700",  row: "hover:bg-amber-950/20" },
};

const CIRC_BADGE: Record<number, string> = {
  1: "bg-green-900/50 text-green-300 border-green-700",
  2: "bg-blue-900/50 text-blue-300 border-blue-700",
  3: "bg-violet-900/50 text-violet-300 border-violet-700",
  4: "bg-red-900/50 text-red-300 border-red-700",
};

const CIRC_LABEL: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

export function RituaisAdminTab() {
  const { data: rituais, isLoading } = useListRituals();
  const [search, setSearch] = useState("");
  const [filterElem, setFilterElem] = useState<string | null>(null);
  const [filterCirc, setFilterCirc] = useState<number | null>(null);
  const [filterFonte, setFilterFonte] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const lista = useMemo(() => {
    let r = (rituais as Ritual[] ?? []);
    if (filterElem) r = r.filter(x => x.elemento === filterElem);
    if (filterCirc) r = r.filter(x => x.circulo === filterCirc);
    if (filterFonte) r = r.filter(x => x.fonte === filterFonte);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(x =>
        x.nome.toLowerCase().includes(q) ||
        (x.descricao ?? "").toLowerCase().includes(q) ||
        (x.execucao ?? "").toLowerCase().includes(q)
      );
    }
    return r;
  }, [rituais, filterElem, filterCirc, filterFonte, search]);

  const counts = useMemo(() => {
    const all = (rituais as Ritual[] ?? []);
    const byElem: Record<string, number> = {};
    const byCirc: Record<number, number> = {};
    all.forEach(r => {
      byElem[r.elemento] = (byElem[r.elemento] || 0) + 1;
      byCirc[r.circulo]  = (byCirc[r.circulo]  || 0) + 1;
    });
    return { total: all.length, byElem, byCirc };
  }, [rituais]);

  if (isLoading) return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando rituais...</div>;

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="glass-panel px-4 py-3 text-center">
          <p className="text-2xl font-display text-primary">{counts.total}</p>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Total</p>
        </Card>
        {[1,2,3,4].map(c => (
          <Card key={c} className="glass-panel px-4 py-3 text-center">
            <p className="text-2xl font-display text-primary">{counts.byCirc[c] ?? 0}</p>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">{CIRC_LABEL[c]}º Círculo</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ritual..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondary/30 border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Elemento */}
        {Object.keys(ELEM_CONFIG).map(el => (
          <button
            key={el}
            onClick={() => setFilterElem(filterElem === el ? null : el)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterElem === el
                ? ELEM_CONFIG[el].badge + " opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {ELEM_CONFIG[el].icon}
            {el}
            <span className="ml-0.5 opacity-75">({counts.byElem[el] ?? 0})</span>
          </button>
        ))}

        {/* Círculo */}
        {[1,2,3,4].map(c => (
          <button
            key={c}
            onClick={() => setFilterCirc(filterCirc === c ? null : c)}
            className={`px-2.5 py-1 rounded border text-[11px] font-display tracking-wide transition-all ${
              filterCirc === c
                ? CIRC_BADGE[c] + " opacity-100"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {CIRC_LABEL[c]}
          </button>
        ))}

        {/* Fonte */}
        {["Livro Base", "Sobrevivendo ao Horror"].map(f => (
          <button
            key={f}
            onClick={() => setFilterFonte(filterFonte === f ? null : f)}
            className={`px-2.5 py-1 rounded border text-[11px] font-mono tracking-wide transition-all ${
              filterFonte === f
                ? "bg-primary/20 text-primary border-primary/50"
                : "border-border text-muted-foreground opacity-60 hover:opacity-90"
            }`}
          >
            {f === "Sobrevivendo ao Horror" ? "SUPL" : "LB"}
          </button>
        ))}

        <span className="ml-auto text-xs font-mono text-muted-foreground">{lista.length} resultado{lista.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <Card className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Nome</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Elemento</th>
                <th className="text-center px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Círculo</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Execução</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Alcance</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Duração</th>
                <th className="text-left px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">Fonte</th>
                <th className="text-center px-3 py-2.5 font-display tracking-wider text-muted-foreground text-[11px] uppercase">D/V</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(r => {
                const ec = ELEM_CONFIG[r.elemento] ?? ELEM_CONFIG["Variável"];
                const isOpen = expanded === r.id;
                const hasDetail = !!(r.descricao || r.discente || r.verdadeiro);
                return (
                  <Fragment key={r.id}>
                    <tr
                      onClick={() => hasDetail && setExpanded(isOpen ? null : r.id)}
                      className={`border-b border-border/40 transition-colors ${ec.row} ${hasDetail ? "cursor-pointer" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-mono font-medium">
                        <div className="flex items-center gap-2">
                          {hasDetail ? (
                            isOpen ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                          ) : <span className="w-3 h-3 shrink-0" />}
                          {r.nome}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-display tracking-wide ${ec.badge}`}>
                          {ec.icon}{r.elemento}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-display tracking-wide ${CIRC_BADGE[r.circulo] ?? ""}`}>
                          {CIRC_LABEL[r.circulo]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.execucao || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.alcance || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground capitalize">{r.duracao || "—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono">
                        {r.fonte === "Sobrevivendo ao Horror"
                          ? <span className="px-1.5 py-0.5 rounded border border-amber-700 bg-amber-900/30 text-amber-300 text-[9px] font-display tracking-wide">SUPL</span>
                          : <span className="text-muted-foreground">LB</span>
                        }
                      </td>
                      <td className="px-3 py-2.5 text-center text-xs font-mono text-muted-foreground">
                        {r.discente && r.verdadeiro ? "D+V" : r.discente ? "D" : r.verdadeiro ? "V" : "—"}
                      </td>
                    </tr>
                    {isOpen && hasDetail && (
                      <tr className="border-b border-border/40 bg-black/20">
                        <td colSpan={8} className="px-8 py-4">
                          <div className="space-y-3 max-w-3xl">
                            {r.descricao && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Efeito</p>
                                <p className="text-xs font-mono text-foreground/80 leading-relaxed">{r.descricao}</p>
                              </div>
                            )}
                            {r.discente && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-blue-400 mb-1">Discente</p>
                                <p className="text-xs font-mono text-foreground/70 leading-relaxed">{r.discente}</p>
                              </div>
                            )}
                            {r.verdadeiro && (
                              <div>
                                <p className="text-[10px] font-display uppercase tracking-widest text-red-400 mb-1">Verdadeiro</p>
                                <p className="text-xs font-mono text-foreground/70 leading-relaxed">{r.verdadeiro}</p>
                              </div>
                            )}
                            {r.alvo && (
                              <p className="text-[10px] font-mono text-muted-foreground">Alvo: {r.alvo} {r.resistencia ? `| Resistência: ${r.resistencia}` : ""}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {lista.length === 0 && (
            <p className="text-center py-12 text-muted-foreground font-mono text-sm">Nenhum ritual encontrado.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
