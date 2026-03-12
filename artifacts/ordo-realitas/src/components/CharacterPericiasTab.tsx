import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle2, Circle, ChevronUp, ChevronDown } from "lucide-react";

// ── types ─────────────────────────────────────────────────────────────────
type Atributo = "FOR" | "AGI" | "INT" | "PRE" | "VIG";

type PericiaRow = {
  id: string;
  nome: string;
  atributo: Atributo;
  somenteTrainada: boolean;
};

// ── static data ───────────────────────────────────────────────────────────
const PERICIAS: PericiaRow[] = [
  { id: "per-001", nome: "Acrobacia",     atributo: "AGI", somenteTrainada: false },
  { id: "per-002", nome: "Adestramento",  atributo: "PRE", somenteTrainada: true  },
  { id: "per-003", nome: "Artes",         atributo: "PRE", somenteTrainada: true  },
  { id: "per-004", nome: "Atletismo",     atributo: "FOR", somenteTrainada: false },
  { id: "per-005", nome: "Atualidades",   atributo: "INT", somenteTrainada: false },
  { id: "per-006", nome: "Ciências",      atributo: "INT", somenteTrainada: true  },
  { id: "per-007", nome: "Crime",         atributo: "AGI", somenteTrainada: true  },
  { id: "per-008", nome: "Diplomacia",    atributo: "PRE", somenteTrainada: false },
  { id: "per-009", nome: "Enganação",     atributo: "PRE", somenteTrainada: false },
  { id: "per-010", nome: "Fortitude",     atributo: "VIG", somenteTrainada: false },
  { id: "per-011", nome: "Furtividade",   atributo: "AGI", somenteTrainada: false },
  { id: "per-012", nome: "Iniciativa",    atributo: "AGI", somenteTrainada: false },
  { id: "per-013", nome: "Intimidação",   atributo: "PRE", somenteTrainada: false },
  { id: "per-014", nome: "Intuição",      atributo: "INT", somenteTrainada: false },
  { id: "per-015", nome: "Investigação",  atributo: "INT", somenteTrainada: false },
  { id: "per-016", nome: "Luta",          atributo: "FOR", somenteTrainada: false },
  { id: "per-017", nome: "Medicina",      atributo: "INT", somenteTrainada: false },
  { id: "per-018", nome: "Ocultismo",     atributo: "INT", somenteTrainada: true  },
  { id: "per-019", nome: "Percepção",     atributo: "PRE", somenteTrainada: false },
  { id: "per-020", nome: "Pilotagem",     atributo: "AGI", somenteTrainada: true  },
  { id: "per-021", nome: "Pontaria",      atributo: "AGI", somenteTrainada: false },
  { id: "per-022", nome: "Profissão",     atributo: "INT", somenteTrainada: true  },
  { id: "per-023", nome: "Reflexos",      atributo: "AGI", somenteTrainada: false },
  { id: "per-024", nome: "Religião",      atributo: "PRE", somenteTrainada: true  },
  { id: "per-025", nome: "Sobrevivência", atributo: "INT", somenteTrainada: false },
  { id: "per-026", nome: "Tática",        atributo: "INT", somenteTrainada: true  },
  { id: "per-027", nome: "Tecnologia",    atributo: "INT", somenteTrainada: true  },
  { id: "per-028", nome: "Vontade",       atributo: "PRE", somenteTrainada: false },
];

// ── NEX → training bonus ──────────────────────────────────────────────────
function getBonusTreinamento(nex: number): number {
  if (nex < 15) return 2;
  if (nex < 30) return 3;
  if (nex < 45) return 4;
  if (nex < 60) return 5;
  if (nex < 75) return 6;
  if (nex < 90) return 7;
  return 8;
}

// ── normalize for comparison (remove accents, lowercase) ──────────────────
function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ── attribute display helpers ─────────────────────────────────────────────
const ATR_BG: Record<Atributo, string> = {
  FOR: "bg-red-200 text-red-900 border-red-300",
  AGI: "bg-blue-200 text-blue-900 border-blue-300",
  INT: "bg-amber-200 text-amber-900 border-amber-300",
  PRE: "bg-purple-200 text-purple-900 border-purple-300",
  VIG: "bg-green-200 text-green-900 border-green-300",
};

const ATR_HEADER: Record<Atributo, string> = {
  FOR: "bg-red-100 text-red-800",
  AGI: "bg-blue-100 text-blue-800",
  INT: "bg-amber-100 text-amber-800",
  PRE: "bg-purple-100 text-purple-800",
  VIG: "bg-green-100 text-green-800",
};

const ATR_LABELS: Record<Atributo, string> = {
  FOR: "Força",
  AGI: "Agilidade",
  INT: "Intelecto",
  PRE: "Presença",
  VIG: "Vigor",
};

// ── props ─────────────────────────────────────────────────────────────────
type Props = {
  charId: string;
  pericias: string[];   // names of trained péricias from DB
  nex: number;
  forca: number;
  agilidade: number;
  intelecto: number;
  vigor: number;
  presenca: number;
};

// ── component ─────────────────────────────────────────────────────────────
export default function CharacterPericiasTab({
  charId, pericias, nex, forca, agilidade, intelecto, vigor, presenca,
}: Props) {
  const storageKey = `char-${charId}-pericias-outro`;

  // "Outro" bonus per péricia, persisted in localStorage
  const [outroMap, setOutroMap] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(outroMap));
  }, [outroMap, storageKey]);

  const setOutro = (id: string, val: number) => {
    setOutroMap((prev) => ({ ...prev, [id]: val }));
  };

  // Filters
  const [search, setSearch]         = useState("");
  const [filterAttr, setFilterAttr] = useState<Atributo | "TODAS">("TODAS");
  const [soTreinadas, setSoTreinadas] = useState(false);

  // Helpers
  const trainedSet = useMemo(
    () => new Set(pericias.map(norm)),
    [pericias]
  );

  const attrValue: Record<Atributo, number> = {
    FOR: forca,
    AGI: agilidade,
    INT: intelecto,
    PRE: presenca,
    VIG: vigor,
  };

  const bonusTreinamento = getBonusTreinamento(nex);

  // Filtered + sorted list
  const rows = useMemo(() => {
    const q = norm(search);
    return PERICIAS.filter((p) => {
      if (filterAttr !== "TODAS" && p.atributo !== filterAttr) return false;
      if (soTreinadas && !trainedSet.has(norm(p.nome))) return false;
      if (q && !norm(p.nome).includes(q)) return false;
      return true;
    });
  }, [search, filterAttr, soTreinadas, trainedSet]);

  // Summary stats
  const totalTreinadas = PERICIAS.filter((p) => trainedSet.has(norm(p.nome))).length;

  return (
    <div className="space-y-4">
      {/* summary bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="border-2 border-gray-900/20 rounded-sm px-4 py-2 bg-white/30 text-center min-w-28">
          <div className="font-display font-bold text-2xl text-gray-900">{totalTreinadas}</div>
          <div className="font-display text-[10px] tracking-widest text-gray-900/60">TREINADAS</div>
        </div>
        <div className="border-2 border-gray-900/20 rounded-sm px-4 py-2 bg-white/30 text-center min-w-28">
          <div className="font-display font-bold text-2xl text-gray-900">{PERICIAS.length - totalTreinadas}</div>
          <div className="font-display text-[10px] tracking-widest text-gray-900/60">NÃO TREINADAS</div>
        </div>
        <div className="border-2 border-gray-900/20 rounded-sm px-4 py-2 bg-white/30 text-center min-w-28">
          <div className="font-display font-bold text-2xl text-gray-900">+{bonusTreinamento}</div>
          <div className="font-display text-[10px] tracking-widest text-gray-900/60">BÔN. TREINO (NEX {nex}%)</div>
        </div>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar perícia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/50 border-2 border-gray-900/20 rounded-sm py-1.5 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-900/40 font-mono outline-none focus:border-gray-900/40 transition-colors"
          />
        </div>

        {/* attr filter buttons */}
        <div className="flex gap-1 flex-wrap">
          {(["TODAS", "FOR", "AGI", "INT", "PRE", "VIG"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setFilterAttr(a)}
              className={`px-2.5 py-1 rounded-sm text-xs font-bold border-2 transition-colors ${
                filterAttr === a
                  ? a === "TODAS"
                    ? "bg-gray-900 text-white border-gray-900"
                    : `${ATR_BG[a as Atributo]} border-current`
                  : "bg-white/30 text-gray-900/60 border-gray-900/20 hover:border-gray-900/40"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSoTreinadas((v) => !v)}
          className={`px-3 py-1 rounded-sm text-xs font-bold border-2 transition-colors flex items-center gap-1 ${
            soTreinadas
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white/30 text-gray-900/60 border-gray-900/20 hover:border-gray-900/40"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Só treinadas
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900/30">
              <th className="text-left py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-8"></th>
              <th className="text-left py-2 px-3 font-display text-xs tracking-widest text-gray-900/60">PERÍCIA</th>
              <th className="text-center py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-16">ATR</th>
              <th className="text-center py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-20">MOD ATR</th>
              <th className="text-center py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-24">TREINO</th>
              <th className="text-center py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-24">OUTRO</th>
              <th className="text-center py-2 px-3 font-display text-xs tracking-widest text-gray-900/60 w-20">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, idx) => {
              const treinada     = trainedSet.has(norm(p.nome));
              const modAtributo  = attrValue[p.atributo];
              const modTreino    = treinada ? bonusTreinamento : 0;
              const outro        = outroMap[p.id] ?? 0;
              const total        = modAtributo + modTreino + outro;
              const isEven       = idx % 2 === 0;

              return (
                <tr
                  key={p.id}
                  className={`border-b border-gray-900/10 transition-colors hover:bg-gray-900/5 ${isEven ? "bg-white/20" : "bg-white/5"}`}
                >
                  {/* trained icon */}
                  <td className="py-2 px-3 text-center">
                    {treinada
                      ? <CheckCircle2 className="h-4 w-4 text-green-700 inline-block" />
                      : <Circle className="h-4 w-4 text-gray-900/20 inline-block" />}
                  </td>

                  {/* name */}
                  <td className="py-2 px-3">
                    <span className={`font-display font-bold text-gray-900 ${treinada ? "" : "opacity-60"}`}>
                      {p.nome}
                    </span>
                    {p.somenteTrainada && !treinada && (
                      <span className="ml-2 text-[9px] font-mono text-red-700/60 uppercase tracking-wider">só treinada</span>
                    )}
                  </td>

                  {/* attribute badge */}
                  <td className="py-2 px-3 text-center">
                    <span className={`text-[10px] font-bold rounded-sm px-1.5 py-0.5 border ${ATR_BG[p.atributo]}`}>
                      {p.atributo}
                    </span>
                  </td>

                  {/* mod atributo */}
                  <td className="py-2 px-3 text-center">
                    <span className={`font-display font-bold text-lg ${treinada ? "text-gray-900" : "text-gray-900/50"}`}>
                      +{modAtributo}
                    </span>
                  </td>

                  {/* treino bonus */}
                  <td className="py-2 px-3 text-center">
                    {treinada ? (
                      <span className="font-display font-bold text-lg text-green-800">+{modTreino}</span>
                    ) : (
                      <span className="font-display text-gray-900/30 text-lg">—</span>
                    )}
                  </td>

                  {/* outro (editable) */}
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setOutro(p.id, outro - 1)}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-gray-900/20 bg-white/40 hover:bg-gray-900/10 text-gray-900 font-bold leading-none text-xs"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <span className={`font-display font-bold text-base w-8 text-center ${outro !== 0 ? "text-blue-800" : "text-gray-900/40"}`}>
                        {outro >= 0 ? `+${outro}` : outro}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOutro(p.id, outro + 1)}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-gray-900/20 bg-white/40 hover:bg-gray-900/10 text-gray-900 font-bold leading-none text-xs"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  {/* total */}
                  <td className="py-2 px-3 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-display font-bold text-lg
                      ${treinada
                        ? "border-gray-900/40 bg-gray-900/10 text-gray-900"
                        : "border-gray-900/15 bg-white/20 text-gray-900/50"
                      }`}
                    >
                      {total >= 0 ? `+${total}` : total}
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-900/40 font-display">
                  NENHUMA PERÍCIA ENCONTRADA
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* legend */}
      <div className="flex flex-wrap gap-4 text-[10px] font-mono text-gray-900/50 pt-2 border-t border-gray-900/15">
        <span><strong className="text-gray-900/70">MOD ATR</strong> = valor do atributo base da perícia</span>
        <span><strong className="text-gray-900/70">TREINO</strong> = bônus por ser treinado (escala com NEX)</span>
        <span><strong className="text-gray-900/70">OUTRO</strong> = bônus/penalidade extra (itens, habilidades etc.)</span>
        <span><strong className="text-gray-900/70">TOTAL</strong> = resultado adicionado ao d20</span>
      </div>
    </div>
  );
}
