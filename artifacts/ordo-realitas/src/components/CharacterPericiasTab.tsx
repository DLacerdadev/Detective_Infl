import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle2, Circle, ChevronUp, ChevronDown } from "lucide-react";

// ── types ─────────────────────────────────────────────────────────────────
type Atributo = "FOR" | "AGI" | "INT" | "PRE" | "VIG";
type GrauTreinamento = "Destreinado" | "Treinado" | "Veterano" | "Expert";

type PericiaRow = {
  id: string;
  nome: string;
  atributo: Atributo;
  somenteTrainada: boolean;
};

// ── grau → bônus ──────────────────────────────────────────────────────────
const GRAU_BONUS: Record<GrauTreinamento, number> = {
  Destreinado:  0,
  Treinado:    +5,
  Veterano:   +10,
  Expert:     +15,
};

const GRAUS: GrauTreinamento[] = ["Destreinado", "Treinado", "Veterano", "Expert"];

// ── static péricia data ───────────────────────────────────────────────────
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

// ── helpers ───────────────────────────────────────────────────────────────
function norm(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const ATR_BADGE: Record<Atributo, string> = {
  FOR: "bg-red-200   text-red-900   border-red-300",
  AGI: "bg-blue-200  text-blue-900  border-blue-300",
  INT: "bg-amber-200 text-amber-900 border-amber-300",
  PRE: "bg-purple-200 text-purple-900 border-purple-300",
  VIG: "bg-green-200 text-green-900 border-green-300",
};

const GRAU_STYLE: Record<GrauTreinamento, string> = {
  Destreinado: "text-gray-900/35",
  Treinado:    "text-green-800 font-bold",
  Veterano:    "text-blue-800  font-bold",
  Expert:      "text-amber-800 font-bold",
};

const GRAU_BONUS_STYLE: Record<GrauTreinamento, string> = {
  Destreinado: "text-gray-900/30",
  Treinado:    "text-green-800",
  Veterano:    "text-blue-800",
  Expert:      "text-amber-800",
};

// ── props ─────────────────────────────────────────────────────────────────
type Props = {
  charId: string;
  pericias: string[];
};

// ── component ─────────────────────────────────────────────────────────────
export default function CharacterPericiasTab({ charId, pericias }: Props) {
  const storageKey = `char-${charId}-pericias-v2`;

  // graus saved per péricia id (defaults to Destreinado or Treinado based on char.pericias)
  const [grauMap, setGrauMap] = useState<Record<string, GrauTreinamento>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // "outro" bonus per péricia id
  const outroStorageKey = `char-${charId}-pericias-outro-v2`;
  const [outroMap, setOutroMap] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(outroStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(grauMap));
  }, [grauMap, storageKey]);

  useEffect(() => {
    localStorage.setItem(outroStorageKey, JSON.stringify(outroMap));
  }, [outroMap, outroStorageKey]);

  const trainedSet = useMemo(() => new Set(pericias.map(norm)), [pericias]);

  // Get effective grau: uses grauMap if set, otherwise derives from trainedSet
  const getGrau = (p: PericiaRow): GrauTreinamento => {
    if (grauMap[p.id]) return grauMap[p.id];
    return trainedSet.has(norm(p.nome)) ? "Treinado" : "Destreinado";
  };

  const setGrau = (id: string, grau: GrauTreinamento) => {
    setGrauMap((prev) => ({ ...prev, [id]: grau }));
  };

  const setOutro = (id: string, val: number) => {
    setOutroMap((prev) => ({ ...prev, [id]: val }));
  };

  // Filters
  const [search,       setSearch]       = useState("");
  const [filterAttr,   setFilterAttr]   = useState<Atributo | "TODAS">("TODAS");
  const [soTreinadas,  setSoTreinadas]  = useState(false);

  const rows = useMemo(() => {
    const q = norm(search);
    return PERICIAS.filter((p) => {
      const grau = getGrau(p);
      if (filterAttr !== "TODAS" && p.atributo !== filterAttr) return false;
      if (soTreinadas && grau === "Destreinado") return false;
      if (q && !norm(p.nome).includes(q)) return false;
      return true;
    });
  }, [search, filterAttr, soTreinadas, grauMap, trainedSet]); // eslint-disable-line react-hooks/exhaustive-deps

  // Summary stats
  const countByGrau = useMemo(() => {
    const acc: Record<GrauTreinamento, number> = { Destreinado: 0, Treinado: 0, Veterano: 0, Expert: 0 };
    for (const p of PERICIAS) {
      acc[getGrau(p)]++;
    }
    return acc;
  }, [grauMap, trainedSet]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalTreinadas = PERICIAS.length - countByGrau.Destreinado;

  return (
    <div className="space-y-4">

      {/* ── summary ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {(["Treinado", "Veterano", "Expert"] as GrauTreinamento[]).map((g) => (
          <div key={g} className="border-2 border-gray-900/20 rounded-sm px-4 py-2 bg-white/30 text-center min-w-28">
            <div className={`font-display font-bold text-2xl ${GRAU_BONUS_STYLE[g]}`}>
              {countByGrau[g]}
            </div>
            <div className="font-display text-[10px] tracking-widest text-gray-900/60 uppercase">{g}</div>
            <div className="font-mono text-xs text-gray-900/40">{g === "Treinado" ? "+5" : g === "Veterano" ? "+10" : "+15"}</div>
          </div>
        ))}
        <div className="border-2 border-gray-900/20 rounded-sm px-4 py-2 bg-white/30 text-center min-w-28">
          <div className="font-display font-bold text-2xl text-gray-900">{totalTreinadas}</div>
          <div className="font-display text-[10px] tracking-widest text-gray-900/60">TOTAL TREINADAS</div>
        </div>
      </div>

      {/* ── filters ─────────────────────────────────────────────── */}
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
                    : `${ATR_BADGE[a as Atributo]} border-current`
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

      {/* ── table ───────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900/30">
              <th className="text-left py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50">PERÍCIA</th>
              <th className="text-center py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50 w-12">ATR</th>
              <th className="text-center py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50 w-40">GRAU DE TREINAMENTO</th>
              <th className="text-center py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50 w-20">BÔNUS</th>
              <th className="text-center py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50 w-24">OUTRO</th>
              <th className="text-center py-2 px-2 font-display text-[10px] tracking-widest text-gray-900/50 w-20">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, idx) => {
              const grau    = getGrau(p);
              const bonus   = GRAU_BONUS[grau];
              const outro   = outroMap[p.id] ?? 0;
              const total   = bonus + outro;
              const trained = grau !== "Destreinado";
              const isEven  = idx % 2 === 0;

              return (
                <tr
                  key={p.id}
                  className={`border-b border-gray-900/10 transition-colors hover:bg-gray-900/5 ${isEven ? "bg-white/20" : "bg-white/5"}`}
                >
                  {/* name */}
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      {trained
                        ? <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0" />
                        : <Circle       className="h-4 w-4 text-gray-900/20 shrink-0" />}
                      <span className={`font-display font-bold ${trained ? "text-gray-900" : "text-gray-900/50"}`}>
                        {p.nome}
                      </span>
                      {p.somenteTrainada && !trained && (
                        <span className="text-[9px] font-mono text-red-700/50 uppercase tracking-wider hidden md:inline">
                          só treinada
                        </span>
                      )}
                    </div>
                  </td>

                  {/* atributo badge */}
                  <td className="py-2 px-2 text-center">
                    <span className={`text-[10px] font-bold rounded-sm px-1.5 py-0.5 border ${ATR_BADGE[p.atributo]}`}>
                      {p.atributo}
                    </span>
                  </td>

                  {/* grau selector */}
                  <td className="py-2 px-2">
                    <div className="flex gap-1 justify-center">
                      {GRAUS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          title={g}
                          onClick={() => setGrau(p.id, g)}
                          className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold border transition-colors ${
                            grau === g
                              ? g === "Destreinado"
                                ? "bg-gray-900/10 border-gray-900/30 text-gray-900/60"
                                : g === "Treinado"
                                ? "bg-green-100 border-green-700 text-green-800"
                                : g === "Veterano"
                                ? "bg-blue-100 border-blue-700 text-blue-800"
                                : "bg-amber-100 border-amber-700 text-amber-800"
                              : "bg-white/30 border-gray-900/15 text-gray-900/30 hover:border-gray-900/30 hover:text-gray-900/60"
                          }`}
                        >
                          {g === "Destreinado" ? "—" : g.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </td>

                  {/* bônus */}
                  <td className="py-2 px-2 text-center">
                    <span className={`font-display font-bold text-xl ${GRAU_BONUS_STYLE[grau]}`}>
                      {bonus === 0 ? "0" : `+${bonus}`}
                    </span>
                  </td>

                  {/* outro */}
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => setOutro(p.id, outro - 1)}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-gray-900/20 bg-white/40 hover:bg-gray-900/10 text-gray-900"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <span className={`font-display font-bold text-base w-8 text-center ${outro !== 0 ? "text-blue-800" : "text-gray-900/30"}`}>
                        {outro >= 0 ? `+${outro}` : outro}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOutro(p.id, outro + 1)}
                        className="h-5 w-5 flex items-center justify-center rounded-sm border border-gray-900/20 bg-white/40 hover:bg-gray-900/10 text-gray-900"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  {/* total */}
                  <td className="py-2 px-2 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-display font-bold text-lg transition-colors
                      ${grau === "Expert"
                        ? "border-amber-700 bg-amber-50 text-amber-900"
                        : grau === "Veterano"
                        ? "border-blue-700 bg-blue-50 text-blue-900"
                        : trained
                        ? "border-gray-900/40 bg-gray-900/10 text-gray-900"
                        : "border-gray-900/15 bg-white/20 text-gray-900/40"}`}
                    >
                      {total === 0 ? "0" : total > 0 ? `+${total}` : total}
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-900/40 font-display">
                  NENHUMA PERÍCIA ENCONTRADA
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── legend ──────────────────────────────────────────────── */}
      <div className="rounded-sm border border-gray-900/15 bg-white/20 p-3 space-y-1">
        <p className="font-display text-[10px] tracking-widest text-gray-900/50 mb-2">BÔNUS DE PERÍCIA</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-gray-900/60">
          <span><span className="font-bold text-gray-900/40">Destreinado</span> = 0</span>
          <span><span className="font-bold text-green-800">Treinado</span> = +5</span>
          <span><span className="font-bold text-blue-800">Veterano</span> = +10</span>
          <span><span className="font-bold text-amber-800">Expert</span> = +15</span>
        </div>
        <p className="font-mono text-[10px] text-gray-900/40 pt-1">
          Total = Bônus de Perícia + Outro. Esse valor é somado ao maior resultado entre os dados rolados.
        </p>
      </div>
    </div>
  );
}
