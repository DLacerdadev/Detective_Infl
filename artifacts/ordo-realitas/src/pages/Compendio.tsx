import { useState } from "react";
import { useListClasses } from "@workspace/api-client-react";
import { OrigensTab } from "@/components/OrigensTab";
import { PericiasTab } from "@/components/PericiasTab";
import { TrilhasTab } from "@/components/TrilhasTab";
import { RituaisTab } from "@/components/RituaisTab";
import { BookOpen, Brain, Sword, ScrollText, GitBranch, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── types ────────────────────────────────────────────────
type DbClasse = {
  id: string;
  nome: string;
  pvInicial?: number;
  pvPorNivel?: number;
  peInicial?: number;
  pePorNivel?: number;
  sanInicial?: number;
  sanPorNivel?: number;
};

type Habilidade = { nex: string; nome: string; desc: string };
type Trilha     = { nome: string; foco: string; supl?: boolean };
type NexEntry   = { nex: string; habilidade: string };

// ── static data per class ────────────────────────────────
type ClassExtra = {
  key: string;
  icon: string;
  descricao: string;
  periciasTexto: string;
  proficiencias: string;
  habilidades: Habilidade[];
  trilhas: Trilha[];
  nex: NexEntry[];
};

const EXTRAS: ClassExtra[] = [
  {
    key: "Combatente",
    icon: "⚔️",
    descricao: "Treinado para lutar com todo tipo de armas, e com a força e a coragem para encarar os perigos de frente.",
    periciasTexto: "Luta ou Pontaria e Fortitude ou Reflexos, mais 1 + Intelecto à sua escolha.",
    proficiencias: "Armas simples, armas táticas e proteções leves.",
    habilidades: [
      { nex: "5%", nome: "Ataque Especial", desc: "Gasta 2 PE para bônus no teste (+5) ou no dano (+5). Aumenta em +5 por 1 PE extra em NEX 50%, 80%, 99%." },
    ],
    trilhas: [
      { nome: "Aniquilador",          foco: "Dano massivo com uma arma favorita." },
      { nome: "Comandante de Campo",  foco: "Suporte tático e liderança." },
      { nome: "Guerreiro",            foco: "Combate corpo-a-corpo e manobras." },
      { nome: "Operações Especiais",  foco: "Iniciativa e múltiplas ações." },
      { nome: "Tropa de Choque",      foco: "Tanque e resistência física." },
      { nome: "Agente Secreto",       foco: "Disfarce, infiltração e ataques furtivos com armas de fogo.", supl: true },
      { nome: "Caçador",              foco: "Rastreio e bônus contra alvos específicos (criaturas).", supl: true },
      { nome: "Monstruoso",           foco: "Transformação física e combate com garras/mordidas.", supl: true },
    ],
    nex: [
      { nex: "5%",  habilidade: "Ataque especial (2 PE, +5)" },
      { nex: "10%", habilidade: "Habilidade de trilha" },
      { nex: "15%", habilidade: "Poder de combatente" },
      { nex: "20%", habilidade: "Aumento de atributo" },
      { nex: "25%", habilidade: "Ataque especial (3 PE, +10)" },
      { nex: "30%", habilidade: "Poder de combatente" },
      { nex: "35%", habilidade: "Grau de treinamento" },
      { nex: "40%", habilidade: "Habilidade de trilha" },
      { nex: "45%", habilidade: "Poder de combatente" },
      { nex: "50%", habilidade: "Aumento de atributo, versatilidade" },
      { nex: "55%", habilidade: "Ataque especial (4 PE, +15)" },
      { nex: "60%", habilidade: "Poder de combatente" },
      { nex: "65%", habilidade: "Habilidade de trilha" },
      { nex: "70%", habilidade: "Grau de treinamento" },
      { nex: "75%", habilidade: "Poder de combatente" },
      { nex: "80%", habilidade: "Aumento de atributo" },
      { nex: "85%", habilidade: "Ataque especial (5 PE, +20)" },
      { nex: "90%", habilidade: "Poder de combatente" },
      { nex: "95%", habilidade: "Aumento de atributo" },
      { nex: "99%", habilidade: "Habilidade de trilha" },
    ],
  },
  {
    key: "Especialista",
    icon: "🔍",
    descricao: "Profissional versátil que usa perícias e engenho para resolver problemas. Nada fica sem solução para um bom especialista.",
    periciasTexto: "Uma quantidade de perícias à sua escolha igual a 7 + Intelecto.",
    proficiencias: "Armas simples e proteções leves.",
    habilidades: [
      { nex: "5%", nome: "Perito", desc: "Escolha duas perícias. Gasta 2 PE para somar +1d6 no teste. Aumenta para +1d8, +1d10, +1d12 em NEX maiores." },
      { nex: "5%", nome: "Eclético", desc: "Gasta 2 PE para ser treinado em uma perícia não treinada até o fim da cena." },
    ],
    trilhas: [
      { nome: "Atirador de Elite", foco: "Ataques à distância precisos." },
      { nome: "Infiltrador",       foco: "Furtividade e dano furtivo." },
      { nome: "Médico de Campo",   foco: "Cura e suporte médico." },
      { nome: "Negociador",        foco: "Interação social e diplomacia." },
      { nome: "Técnico",           foco: "Inventário e uso de itens." },
      { nome: "Agente do Governo", foco: "Autoridade, contatos e recursos estatais.", supl: true },
      { nome: "Bibliotecário",     foco: "Pesquisa rápida e bônus por conhecimento de livros.", supl: true },
      { nome: "Muambeiro",         foco: "Itens de categoria menor e troca de equipamentos rápida.", supl: true },
      { nome: "Perseverante",      foco: "Rerolar dados e resistir a condições negativas.", supl: true },
    ],
    nex: [
      { nex: "5%",  habilidade: "Eclético, perito (2 PE, +1d6)" },
      { nex: "10%", habilidade: "Habilidade de trilha" },
      { nex: "15%", habilidade: "Poder de especialista" },
      { nex: "20%", habilidade: "Aumento de atributo" },
      { nex: "25%", habilidade: "Perito (3 PE, +1d8)" },
      { nex: "30%", habilidade: "Poder de especialista" },
      { nex: "35%", habilidade: "Grau de treinamento" },
      { nex: "40%", habilidade: "Engenhosidade (veterano), habilidade de trilha" },
      { nex: "45%", habilidade: "Poder de especialista" },
      { nex: "50%", habilidade: "Aumento de atributo, versatilidade" },
      { nex: "55%", habilidade: "Perito (4 PE, +1d10)" },
      { nex: "60%", habilidade: "Poder de especialista" },
      { nex: "65%", habilidade: "Habilidade de trilha" },
      { nex: "70%", habilidade: "Grau de treinamento" },
      { nex: "75%", habilidade: "Engenhosidade (expert), poder de especialista" },
      { nex: "80%", habilidade: "Aumento de atributo" },
      { nex: "85%", habilidade: "Perito (5 PE, +1d12)" },
      { nex: "90%", habilidade: "Poder de especialista" },
      { nex: "95%", habilidade: "Aumento de atributo" },
      { nex: "99%", habilidade: "Habilidade de trilha" },
    ],
  },
  {
    key: "Ocultista",
    icon: "✨",
    descricao: "Estudioso do sobrenatural com acesso a rituais e conhecimentos do Outro Lado. Frágil mas imensamente poderoso.",
    periciasTexto: "Ocultismo e Vontade (fixas), mais 3 + Intelecto à sua escolha.",
    proficiencias: "Armas simples.",
    habilidades: [
      { nex: "5%", nome: "Escolhido pelo Outro Lado", desc: "Começa com 3 rituais de 1º círculo. Ganha acesso a círculos superiores conforme avança de NEX." },
      { nex: "5%", nome: "Transcender", desc: "Pode escolher um Poder Paranormal em vez de habilidade de classe." },
    ],
    trilhas: [
      { nome: "Conduíte",         foco: "Alcance e velocidade de rituais." },
      { nome: "Flagelador",       foco: "Usa PV em vez de PE para rituais." },
      { nome: "Graduado",         foco: "Grimório e muitos rituais conhecidos." },
      { nome: "Intuitivo",        foco: "Resistência mental e paranormal." },
      { nome: "Lâmina Paranormal",foco: "Combate corpo-a-corpo com rituais." },
      { nome: "Exorcista",        foco: "Expulsar entidades e proteger aliados contra o Outro Lado.", supl: true },
      { nome: "Maledictólogo",    foco: "Maldições e debuffs em inimigos.", supl: true },
      { nome: "Parapsicólogo",    foco: "Estudo da mente e comunicação com o além.", supl: true },
      { nome: "Possuído",         foco: "Hospedar uma entidade para ganhar poderes físicos e mentais.", supl: true },
    ],
    nex: [
      { nex: "5%",  habilidade: "Escolhido pelo Outro Lado (1º círculo)" },
      { nex: "10%", habilidade: "Habilidade de trilha" },
      { nex: "15%", habilidade: "Poder de ocultista" },
      { nex: "20%", habilidade: "Aumento de atributo" },
      { nex: "25%", habilidade: "Escolhido pelo Outro Lado (2º círculo)" },
      { nex: "30%", habilidade: "Poder de ocultista" },
      { nex: "35%", habilidade: "Grau de treinamento" },
      { nex: "40%", habilidade: "Habilidade de trilha" },
      { nex: "45%", habilidade: "Poder de ocultista" },
      { nex: "50%", habilidade: "Aumento de atributo, versatilidade" },
      { nex: "55%", habilidade: "Escolhido pelo Outro Lado (3º círculo)" },
      { nex: "60%", habilidade: "Poder de ocultista" },
      { nex: "65%", habilidade: "Habilidade de trilha" },
      { nex: "70%", habilidade: "Grau de treinamento" },
      { nex: "75%", habilidade: "Poder de ocultista" },
      { nex: "80%", habilidade: "Aumento de atributo" },
      { nex: "85%", habilidade: "Escolhido pelo Outro Lado (4º círculo)" },
      { nex: "90%", habilidade: "Poder de ocultista" },
      { nex: "95%", habilidade: "Aumento de atributo" },
      { nex: "99%", habilidade: "Habilidade de trilha" },
    ],
  },
];

const SOBREVIVENTE_ESTAGIOS = [
  { nivel: 1, nome: "Empenho",         desc: "Gasta 1 PE para +2 em um teste." },
  { nivel: 2, nome: "Trilha (10%)",    desc: "Primeira habilidade da trilha de sobrevivente." },
  { nivel: 3, nome: "Aumento de Atributo", desc: "+1 em um atributo à escolha." },
  { nivel: 4, nome: "Trilha (40%)",    desc: "Segunda habilidade da trilha de sobrevivente." },
  { nivel: 5, nome: "Cicatrizado",     desc: "Resistência a dano e bônus em testes de resistência." },
];

const SOBREVIVENTE_TRILHAS: Trilha[] = [
  { nome: "Durão",    foco: "Sobrevivência física e combate bruto." },
  { nome: "Esperto",  foco: "Investigação, perícias e tecnologia." },
  { nome: "Esotérico",foco: "Sensibilidade paranormal e rituais simples." },
];

// ── stat helpers ─────────────────────────────────────────
function statLabel(base?: number, mod?: string) {
  if (base == null) return "—";
  return mod ? `${base} + ${mod}` : `${base}`;
}

// ── sub-components ────────────────────────────────────────
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/60 border border-border/60 rounded-sm p-3">
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className="text-base font-bold text-amber-400 font-display">{value}</div>
    </div>
  );
}

function AbilityCard({ hab }: { hab: Habilidade }) {
  return (
    <div className="bg-card/60 rounded-sm border-l-[3px] border-amber-400 pl-4 pr-3 py-3">
      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">NEX {hab.nex}</div>
      <div className="text-sm font-semibold text-foreground mb-1">{hab.nome}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{hab.desc}</div>
    </div>
  );
}

function TrilhaCard({ trilha }: { trilha: Trilha }) {
  return (
    <div className="bg-card/60 border border-border/60 rounded-sm p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_4px_15px_rgba(192,57,43,0.2)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-sm font-bold text-foreground">{trilha.nome}</div>
        {trilha.supl && (
          <span className="text-[9px] font-mono uppercase tracking-widest shrink-0 bg-primary/15 border border-primary/35 rounded-sm px-1.5 py-0.5 text-primary">
            SUPL
          </span>
        )}
      </div>
      <div className="text-xs text-muted-foreground leading-relaxed">{trilha.foco}</div>
    </div>
  );
}

function NexTable({ entries }: { entries: NexEntry[] }) {
  const isDim = (h: string) =>
    h.toLowerCase().includes("aumento") || h.toLowerCase().includes("trilha") || h.toLowerCase().includes("grau");

  return (
    <div className="rounded-sm border border-border/40 overflow-hidden">
      <div className="grid grid-cols-[4.5rem_1fr] bg-card/80 border-b border-border/40 text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="px-3 py-2">NEX</div>
        <div className="px-3 py-2">Habilidade</div>
      </div>
      <div className="divide-y divide-border/20">
        {entries.map((e) => (
          <div
            key={e.nex}
            className={`grid grid-cols-[4.5rem_1fr] text-xs ${isDim(e.habilidade) ? "text-muted-foreground" : "text-foreground/90"}`}
          >
            <div className="px-3 py-2 font-bold font-display text-amber-400">{e.nex}</div>
            <div className="px-3 py-2 leading-relaxed">{e.habilidade}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── class panels ─────────────────────────────────────────
function ClassPanel({ extra, db }: { extra: ClassExtra; db?: DbClasse }) {
  return (
    <div className="border border-border/60 rounded-sm overflow-hidden bg-card">
      {/* header */}
      <div className="bg-gradient-to-br from-primary/15 via-transparent to-blue-900/10 border-b border-border/60 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{extra.icon}</span>
          <h3 className="font-display text-2xl font-bold tracking-widest text-foreground">{extra.key.toUpperCase()}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{extra.descricao}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatItem label="PV Inicial"    value={statLabel(db?.pvInicial,   "VIG")} />
          <StatItem label="PV por Nível"  value={`+${statLabel(db?.pvPorNivel, "VIG")}`} />
          <StatItem label="PE Inicial"    value={statLabel(db?.peInicial,   "PRE")} />
          <StatItem label="PE por Nível"  value={`+${statLabel(db?.pePorNivel, "PRE")}`} />
          <StatItem label="SAN Inicial"   value={statLabel(db?.sanInicial)} />
          <StatItem label="SAN por Nível" value={`+${statLabel(db?.sanPorNivel)}`} />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* perícias e proficiências */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-2">Perícias treinadas</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{extra.periciasTexto}</p>
          </div>
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-2">Proficiências</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{extra.proficiencias}</p>
          </div>
        </div>

        {/* habilidades de classe */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Habilidades de Classe</p>
          <div className="space-y-3">
            {extra.habilidades.map((h) => <AbilityCard key={h.nome} hab={h} />)}
          </div>
        </div>

        {/* trilhas */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Trilhas Disponíveis</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {extra.trilhas.map((t) => <TrilhaCard key={t.nome} trilha={t} />)}
          </div>
        </div>

        {/* progressão nex */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Tabela de Progressão (NEX)</p>
          <NexTable entries={extra.nex} />
        </div>
      </div>
    </div>
  );
}

function SobreviventePanel() {
  return (
    <div className="border border-border/60 rounded-sm overflow-hidden bg-card">
      <div className="bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border-b border-border/60 p-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🏃</span>
          <h3 className="font-display text-2xl font-bold tracking-widest text-foreground">SOBREVIVENTE</h3>
          <span className="text-[9px] font-mono uppercase tracking-widest bg-primary/15 border border-primary/35 rounded-sm px-1.5 py-0.5 text-primary">SUPL</span>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-1">Sobrevivendo ao Horror</p>
      </div>

      <div className="p-6 space-y-8">
        {/* estágios */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Progressão por Estágios</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {SOBREVIVENTE_ESTAGIOS.map((e) => (
              <div key={e.nivel} className="bg-card/60 border border-border/60 rounded-sm p-4 text-center">
                <div className="text-2xl font-bold text-amber-400 font-display mb-1">{e.nivel}</div>
                <div className="text-sm font-semibold text-foreground mb-2">{e.nome}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* trilhas */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Trilhas Disponíveis</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SOBREVIVENTE_TRILHAS.map((t) => <TrilhaCard key={t.nome} trilha={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── classes tab ───────────────────────────────────────────
const CLASS_TABS = [
  { key: "combatente",   label: "⚔️ Combatente" },
  { key: "especialista", label: "🔍 Especialista" },
  { key: "ocultista",   label: "✨ Ocultista" },
  { key: "sobrevivente", label: "🏃 Sobrevivente" },
];

function ClassesTab() {
  const { data: classes, isLoading } = useListClasses();
  const [active, setActive] = useState("combatente");

  if (isLoading)
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando classes...</div>;

  const dbMap: Record<string, DbClasse> = {};
  (classes as DbClasse[] ?? []).forEach((c) => { dbMap[c.nome] = c; });

  const extra = EXTRAS.find((e) => e.key.toLowerCase() === active);
  const dbClasse = extra ? dbMap[extra.key] : undefined;

  return (
    <div>
      {/* sub-tabs */}
      <div className="flex gap-0 border-b border-border/60 mb-6 overflow-x-auto">
        {CLASS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 ${
              active === t.key
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "sobrevivente" ? (
        <SobreviventePanel />
      ) : extra ? (
        <ClassPanel extra={extra} db={dbClasse} />
      ) : null}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────
export default function Compendio() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8 border-b border-border/50 pb-4">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display tracking-widest">COMPÊNDIO PARANORMAL</h1>
          <p className="text-muted-foreground font-sans text-sm">Referências e informações sobre o sistema</p>
        </div>
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="mb-6 bg-secondary/20 p-1 border border-border">
          <TabsTrigger value="classes" className="gap-2">
            <Sword className="h-3.5 w-3.5" />
            CLASSES
          </TabsTrigger>
          <TabsTrigger value="trilhas" className="gap-2">
            <GitBranch className="h-3.5 w-3.5" />
            TRILHAS
          </TabsTrigger>
          <TabsTrigger value="origens" className="gap-2">
            <Brain className="h-3.5 w-3.5" />
            ORIGENS
          </TabsTrigger>
          <TabsTrigger value="pericias" className="gap-2">
            <ScrollText className="h-3.5 w-3.5" />
            PERÍCIAS
          </TabsTrigger>
          <TabsTrigger value="rituais" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            RITUAIS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <ClassesTab />
        </TabsContent>

        <TabsContent value="trilhas">
          <TrilhasTab />
        </TabsContent>

        <TabsContent value="origens">
          <OrigensTab />
        </TabsContent>

        <TabsContent value="pericias">
          <PericiasTab />
        </TabsContent>

        <TabsContent value="rituais">
          <RituaisTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
