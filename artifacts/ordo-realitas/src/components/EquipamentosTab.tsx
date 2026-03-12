import { useState, useMemo } from "react";
import { useListItens, type ItemCompendio } from "@workspace/api-client-react";
import { Sword, Shield, Crosshair, Package, Search, BookOpen, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ── helpers ────────────────────────────────────────────────

const CATEGORIA_LABEL: Record<string, string> = {
  "0": "0",
  "I": "I",
  "II": "II",
  "III": "III",
  "IV": "IV",
};

const CATEGORIA_COLOR: Record<string, string> = {
  "0": "bg-slate-700 text-slate-200",
  "I": "bg-emerald-900 text-emerald-300",
  "II": "bg-amber-900 text-amber-300",
  "III": "bg-red-900 text-red-300",
  "IV": "bg-purple-900 text-purple-300",
};

const TIPO_ATAQUE_LABEL: Record<string, string> = {
  C: "Corte",
  I: "Impacto",
  P: "Perfuração",
  B: "Balístico",
  Fogo: "Fogo",
};

const SUBTIPO_LABEL: Record<string, string> = {
  CORPO_LEVE: "Corpo Leve",
  CORPO_UMA_MAO: "Uma Mão",
  CORPO_DUAS_MAOS: "Duas Mãos",
  DISPARO_DUAS_MAOS: "Disparo",
  FOGO_LEVE: "Fogo Leve",
  FOGO_UMA_MAO: "Fogo Uma Mão",
  FOGO_DUAS_MAOS: "Fogo Duas Mãos",
  PESADA: "Pesada",
  ARREMESSO: "Arremesso",
  ACESSORIO: "Acessório",
  EXPLOSIVO: "Explosivo",
  OPERACIONAL: "Operacional",
  MEDICAMENTO: "Medicamento",
  PARANORMAL: "Paranormal",
};

const PROP_LABEL: Record<string, string> = {
  agil: "Ágil",
  automatica: "Automática",
  area: "Área",
  arremesso: "Arremesso",
  forca_dano: "Força p/ Dano",
  versatil: "Versátil",
  linha: "Linha",
  discreta: "Discreta",
};

function catBadge(cat: string | null) {
  if (!cat) return null;
  const cls = CATEGORIA_COLOR[cat] ?? "bg-slate-700 text-slate-200";
  return (
    <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-bold font-mono ${cls}`}>
      {cat}
    </span>
  );
}

// ── sub-components ─────────────────────────────────────────

function WeaponStatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className="text-slate-200 text-xs font-mono font-semibold">{value}</span>
    </div>
  );
}

function ItemCard({ item }: { item: ItemCompendio }) {
  const [open, setOpen] = useState(false);
  const isArma = item.tipo === "ARMA";
  const isProtecao = item.tipo === "PROTECAO";

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600 transition-colors">
      {/* header */}
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {catBadge(item.categoria)}
          <span className="text-slate-100 font-medium truncate">{item.nome}</span>
          {item.fonte === "SOBREVIVENDO_AO_HORROR" && (
            <span className="shrink-0 text-xs text-amber-400/80 font-mono">SaH</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isArma && item.subtipo && (
            <span className="hidden sm:inline text-xs text-slate-400">
              {SUBTIPO_LABEL[item.subtipo] ?? item.subtipo}
            </span>
          )}
          {isArma && item.dano && (
            <span className="font-mono text-sm text-red-400 font-bold">{item.dano}</span>
          )}
          {isProtecao && item.defesa != null && (
            <span className="font-mono text-sm text-cyan-400 font-bold">+{item.defesa} DEF</span>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* expanded */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          {/* weapon stats */}
          {isArma && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {item.dano && <WeaponStatRow label="Dano" value={item.dano} />}
              {item.critico && <WeaponStatRow label="Crítico" value={item.critico} />}
              {item.alcance && <WeaponStatRow label="Alcance" value={item.alcance} />}
              {item.tipoAtaque && (
                <WeaponStatRow
                  label="Tipo"
                  value={TIPO_ATAQUE_LABEL[item.tipoAtaque] ?? item.tipoAtaque}
                />
              )}
              {item.espacos != null && <WeaponStatRow label="Espaços" value={item.espacos} />}
              {item.proficiencia && (
                <WeaponStatRow
                  label="Proficiência"
                  value={item.proficiencia.charAt(0) + item.proficiencia.slice(1).toLowerCase()}
                />
              )}
            </div>
          )}

          {/* protection stats */}
          {isProtecao && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {item.defesa != null && <WeaponStatRow label="Defesa" value={`+${item.defesa}`} />}
              {item.espacos != null && <WeaponStatRow label="Espaços" value={item.espacos} />}
            </div>
          )}

          {/* general stats */}
          {!isArma && !isProtecao && item.espacos != null && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <WeaponStatRow label="Espaços" value={item.espacos === 0 ? "—" : item.espacos} />
            </div>
          )}

          {/* propriedades */}
          {item.propriedades && item.propriedades.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.propriedades.map((p) => (
                <Badge key={p} variant="outline" className="text-xs border-slate-600 text-slate-300">
                  {PROP_LABEL[p] ?? p}
                </Badge>
              ))}
            </div>
          )}

          {/* description */}
          {item.descricao && (
            <p className="text-slate-400 text-sm leading-relaxed">{item.descricao}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── section groups ─────────────────────────────────────────

type SectionKey =
  | "armas_simples_corpo"
  | "armas_simples_disparo"
  | "armas_simples_fogo"
  | "armas_taticas_corpo"
  | "armas_taticas_disparo"
  | "armas_taticas_fogo"
  | "armas_pesadas"
  | "municoes"
  | "protecoes"
  | "gerais_acessorios"
  | "gerais_explosivos"
  | "gerais_operacionais"
  | "gerais_medicamentos";

function classifyItem(item: ItemCompendio): SectionKey | null {
  if (item.tipo === "MUNICAO") return "municoes";
  if (item.tipo === "PROTECAO") return "protecoes";
  if (item.tipo === "GERAL") {
    const s = item.subtipo ?? "";
    if (s === "ACESSORIO")  return "gerais_acessorios";
    if (s === "EXPLOSIVO")  return "gerais_explosivos";
    if (s === "OPERACIONAL") return "gerais_operacionais";
    if (s === "MEDICAMENTO") return "gerais_medicamentos";
    return null;
  }
  if (item.tipo === "ARMA") {
    const p = item.proficiencia ?? "";
    const s = item.subtipo ?? "";
    if (p === "PESADA") return "armas_pesadas";
    if (p === "TATICA") {
      if (s.startsWith("FOGO") || s === "ARREMESSO") return "armas_taticas_fogo";
      if (s.startsWith("DISPARO")) return "armas_taticas_disparo";
      return "armas_taticas_corpo";
    }
    // SIMPLES
    if (s.startsWith("FOGO")) return "armas_simples_fogo";
    if (s.startsWith("DISPARO")) return "armas_simples_disparo";
    return "armas_simples_corpo";
  }
  return null;
}

const SECTION_CONFIG: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "armas_simples_corpo",   label: "Armas Simples — Corpo a Corpo", icon: <Sword className="h-4 w-4" /> },
  { key: "armas_simples_disparo", label: "Armas Simples — Disparo",       icon: <Crosshair className="h-4 w-4" /> },
  { key: "armas_simples_fogo",    label: "Armas de Fogo Simples",         icon: <Crosshair className="h-4 w-4" /> },
  { key: "armas_taticas_corpo",   label: "Armas Táticas — Corpo a Corpo", icon: <Sword className="h-4 w-4" /> },
  { key: "armas_taticas_disparo", label: "Armas Táticas — Disparo",       icon: <Crosshair className="h-4 w-4" /> },
  { key: "armas_taticas_fogo",    label: "Armas Táticas de Fogo",         icon: <Crosshair className="h-4 w-4" /> },
  { key: "armas_pesadas",         label: "Armas Pesadas",                 icon: <Crosshair className="h-4 w-4" /> },
  { key: "municoes",              label: "Munições",                      icon: <Package className="h-4 w-4" /> },
  { key: "protecoes",             label: "Proteções",                     icon: <Shield className="h-4 w-4" /> },
  { key: "gerais_acessorios",     label: "Acessórios",                    icon: <Package className="h-4 w-4" /> },
  { key: "gerais_explosivos",     label: "Explosivos",                    icon: <Package className="h-4 w-4" /> },
  { key: "gerais_operacionais",   label: "Itens Operacionais",            icon: <Package className="h-4 w-4" /> },
  { key: "gerais_medicamentos",   label: "Medicamentos",                  icon: <Package className="h-4 w-4" /> },
];

// ── tab filters ────────────────────────────────────────────

type MainTab = "armas" | "equipamentos";

const MAIN_TABS: { key: MainTab; label: string; icon: React.ReactNode }[] = [
  { key: "armas",        label: "Armas & Proteções",    icon: <Sword className="h-3.5 w-3.5" /> },
  { key: "equipamentos", label: "Equipamentos Gerais",  icon: <Package className="h-3.5 w-3.5" /> },
];

const TAB_SECTIONS: Record<MainTab, SectionKey[]> = {
  armas: [
    "armas_simples_corpo", "armas_simples_disparo", "armas_simples_fogo",
    "armas_taticas_corpo", "armas_taticas_disparo", "armas_taticas_fogo",
    "armas_pesadas", "municoes", "protecoes",
  ],
  equipamentos: ["gerais_acessorios", "gerais_explosivos", "gerais_operacionais", "gerais_medicamentos"],
};

// ── main component ─────────────────────────────────────────

export function EquipamentosTab() {
  const { data: itens, isLoading, error } = useListItens();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<MainTab>("armas");

  const sections = useMemo<Record<SectionKey, ItemCompendio[]>>(() => {
    const acc = {} as Record<SectionKey, ItemCompendio[]>;
    SECTION_CONFIG.forEach((s) => { acc[s.key] = []; });

    const q = search.toLowerCase().trim();
    for (const item of itens ?? []) {
      const key = classifyItem(item);
      if (!key) continue;
      if (q && !item.nome.toLowerCase().includes(q) && !(item.descricao ?? "").toLowerCase().includes(q)) continue;
      acc[key].push(item);
    }
    return acc;
  }, [itens, search]);

  const visibleSections = SECTION_CONFIG.filter(
    (s) => TAB_SECTIONS[activeTab].includes(s.key) && sections[s.key].length > 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Carregando equipamentos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 py-10 text-center">
        Erro ao carregar equipamentos.
      </div>
    );
  }

  const totalVisible = visibleSections.reduce((s, sec) => s + sections[sec.key].length, 0);

  return (
    <div className="space-y-6">
      {/* search + tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar equipamento…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800/50 border-slate-700 focus:border-slate-500"
          />
        </div>
        <div className="flex gap-1 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
          {MAIN_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors
                ${activeTab === t.key
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* fonte legend */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5" />
          Livro Base
        </span>
        <span className="flex items-center gap-1">
          <span className="text-amber-400/80 font-mono font-semibold">SaH</span>
          Sobrevivendo ao Horror
        </span>
        <span className="ml-auto text-slate-600">{totalVisible} itens</span>
      </div>

      {/* sections */}
      {visibleSections.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          Nenhum equipamento encontrado.
        </div>
      ) : (
        <div className="space-y-8">
          {visibleSections.map(({ key, label, icon }) => (
            <section key={key}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/50">
                <span className="text-slate-400">{icon}</span>
                <h3 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">{label}</h3>
                <span className="ml-auto text-xs text-slate-600 font-mono">{sections[key].length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sections[key].map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
