import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListClasses } from "@workspace/api-client-react";
import { OrigensTab } from "@/components/OrigensTab";
import { BookOpen, Shield, Brain, ChevronRight, Sword } from "lucide-react";

type Classe = {
  id: string;
  nome: string;
  descricao?: string;
  pvInicial?: number;
  pvPorNivel?: number;
  peInicial?: number;
  pePorNivel?: number;
  sanInicial?: number;
  sanPorNivel?: number;
  periciasTreindasBase?: number;
};

type NexEntry = { nex: string; habilidade: string };

const CLASS_EXTRA: Record<string, {
  icon: string;
  cor: string;
  corBg: string;
  corBorder: string;
  pvMod: string;
  pvNexMod: string;
  peMod: string;
  peNexMod: string;
  periciasTexto: string;
  proficiencias: string;
  nex: NexEntry[];
}> = {
  Combatente: {
    icon: "⚔️",
    cor: "text-red-400",
    corBg: "bg-red-500/10",
    corBorder: "border-red-500/30",
    pvMod: "+Vigor",
    pvNexMod: "+Vig",
    peMod: "+Presença",
    peNexMod: "+Pre",
    periciasTexto: "Luta ou Pontaria (uma das duas) e Fortitude ou Reflexos (uma das duas), mais 1 + Intelecto à sua escolha.",
    proficiencias: "Armas simples, armas táticas e proteções leves.",
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
  Especialista: {
    icon: "🔍",
    cor: "text-blue-400",
    corBg: "bg-blue-500/10",
    corBorder: "border-blue-500/30",
    pvMod: "+Vigor",
    pvNexMod: "+Vig",
    peMod: "+Presença",
    peNexMod: "+Pre",
    periciasTexto: "Uma quantidade de perícias à sua escolha igual a 7 + Intelecto.",
    proficiencias: "Armas simples e proteções leves.",
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
  Ocultista: {
    icon: "🔮",
    cor: "text-purple-400",
    corBg: "bg-purple-500/10",
    corBorder: "border-purple-500/30",
    pvMod: "+Vigor",
    pvNexMod: "+Vig",
    peMod: "+Presença",
    peNexMod: "+Pre",
    periciasTexto: "Ocultismo e Vontade (fixas), mais 3 + Intelecto à sua escolha.",
    proficiencias: "Armas simples.",
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
};

function StatBox({ label, value, mod, color }: { label: string; value: number | undefined; mod?: string; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-sm border ${color} min-w-16 text-center`}>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-bold leading-none">{value ?? "—"}</span>
        {mod && <span className="text-[10px] font-mono opacity-80 leading-none">{mod}</span>}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function ClasseCard({ classe }: { classe: Classe }) {
  const extra = CLASS_EXTRA[classe.nome];

  const isHighlighted = (entry: NexEntry) =>
    entry.habilidade.toLowerCase().includes("trilha") ||
    entry.habilidade.toLowerCase().includes("aumento");

  return (
    <div className={`border rounded-sm overflow-hidden ${extra?.corBorder ?? "border-border/50"} bg-card`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b border-border/50 ${extra?.corBg ?? ""}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{extra?.icon ?? "📋"}</span>
          <h3 className={`font-display text-2xl font-bold tracking-widest ${extra?.cor ?? "text-foreground"}`}>
            {classe.nome.toUpperCase()}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">
            Características
          </p>
          <div className="space-y-2">
            {/* Iniciais */}
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="PV Inicial" value={classe.pvInicial} mod={extra?.pvMod} color={`border-red-500/30 text-red-400 ${extra?.corBg ?? ""}`} />
              <StatBox label="PE Inicial" value={classe.peInicial} mod={extra?.peMod} color={`border-blue-500/30 text-blue-400 ${extra?.corBg ?? ""}`} />
              <StatBox label="SAN Inicial" value={classe.sanInicial} color="border-purple-500/25 text-purple-400 bg-purple-500/5" />
            </div>
            {/* Por NEX */}
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="PV / NEX" value={classe.pvPorNivel} mod={extra?.pvNexMod} color="border-red-500/15 text-red-300/70" />
              <StatBox label="PE / NEX" value={classe.pePorNivel} mod={extra?.peNexMod} color="border-blue-500/15 text-blue-300/70" />
              <StatBox label="SAN / NEX" value={classe.sanPorNivel} color="border-purple-500/15 text-purple-300/70" />
            </div>
          </div>
        </div>

        {/* Perícias e Proficiências */}
        {extra && (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">
                Perícias treinadas
              </p>
              <p className="text-sm text-foreground/80 font-sans leading-relaxed">{extra.periciasTexto}</p>
            </div>
            <div>
              <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">
                Proficiências
              </p>
              <p className="text-sm text-foreground/80 font-sans leading-relaxed">{extra.proficiencias}</p>
            </div>
          </div>
        )}

        {/* Progressão NEX */}
        {extra?.nex && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">
              Tabela de progressão
            </p>
            <div className="rounded-sm border border-border/40 overflow-hidden">
              <div className="grid grid-cols-[4rem_1fr] text-[10px] font-display uppercase tracking-widest bg-secondary/40 border-b border-border/40">
                <div className="px-3 py-2 text-muted-foreground">NEX</div>
                <div className="px-3 py-2 text-muted-foreground">Habilidade</div>
              </div>
              <div className="divide-y divide-border/20">
                {extra.nex.map((entry) => {
                  const dim = isHighlighted(entry);
                  return (
                    <div
                      key={entry.nex}
                      className={`grid grid-cols-[4rem_1fr] text-sm ${
                        dim ? "bg-secondary/10 text-muted-foreground" : "bg-transparent text-foreground/90"
                      }`}
                    >
                      <div className={`px-3 py-2 font-display font-bold text-xs ${extra.cor}`}>{entry.nex}</div>
                      <div className="px-3 py-2 font-sans text-xs leading-relaxed">{entry.habilidade}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trilhas — placeholder */}
        <div className={`rounded-sm border ${extra?.corBorder ?? "border-border/50"} ${extra?.corBg ?? ""} px-4 py-3`}>
          <p className={`text-[10px] font-display uppercase tracking-widest mb-1 ${extra?.cor ?? "text-muted-foreground"}`}>
            Trilhas
          </p>
          <p className="text-xs text-muted-foreground font-mono italic">
            As trilhas disponíveis serão adicionadas em breve.
          </p>
        </div>
      </div>
    </div>
  );
}

function ClassesTab() {
  const { data: classes, isLoading } = useListClasses();

  if (isLoading)
    return <div className="p-8 text-muted-foreground animate-pulse font-mono text-sm">Carregando classes...</div>;

  if (!classes || classes.length === 0)
    return <div className="p-8 text-muted-foreground font-mono text-sm">Nenhuma classe encontrada.</div>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {(classes as Classe[]).map((c) => (
        <ClasseCard key={c.id} classe={c} />
      ))}
    </div>
  );
}

export default function Compendio() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8 border-b border-border/50 pb-4">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display tracking-widest">COMPÊNDIO PARANORMAL</h1>
          <p className="text-muted-foreground font-sans">Referências e informações sobre o sistema</p>
        </div>
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="mb-6 bg-secondary/20 p-1 border border-border">
          <TabsTrigger value="classes" className="gap-2">
            <Sword className="h-3.5 w-3.5" />
            CLASSES
          </TabsTrigger>
          <TabsTrigger value="origens" className="gap-2">
            <Brain className="h-3.5 w-3.5" />
            ORIGENS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <ClassesTab />
        </TabsContent>

        <TabsContent value="origens">
          <OrigensTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
