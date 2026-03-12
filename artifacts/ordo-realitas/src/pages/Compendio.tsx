import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListClasses } from "@workspace/api-client-react";
import { OrigensTab } from "@/components/OrigensTab";
import { BookOpen, Shield, Zap, Brain, HeartPulse, Star, ChevronRight } from "lucide-react";

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

const CLASS_LORE: Record<string, {
  icon: string;
  cor: string;
  corBg: string;
  corBorder: string;
  atributoFoco: string;
  playstyle: string;
  trilhas: { nome: string; descricao: string; habilidades: string[] }[];
  nexProgression: { nex: string; descricao: string }[];
}> = {
  Combatente: {
    icon: "⚔️",
    cor: "text-red-400",
    corBg: "bg-red-500/10",
    corBorder: "border-red-500/30",
    atributoFoco: "Força / Agilidade / Vigor",
    playstyle: "Linha de frente. Absorve dano, elimina ameaças e protege aliados. O Combatente prospera no caos do combate.",
    trilhas: [
      {
        nome: "Agente de Operações",
        descricao: "Especializado em combate corpo a corpo e armas de fogo. Maximiza dano e resistência em confrontos diretos.",
        habilidades: ["Ataque Duplo", "Resistência Paranormal", "Fúria de Combate", "Instinto de Sobrevivência"],
      },
      {
        nome: "Soldado Paranormal",
        descricao: "Treinado para enfrentar o sobrenatural diretamente. Usa equipamentos pesados e técnicas militares adaptadas ao Outro Lado.",
        habilidades: ["Armamento Pesado", "Tática Antientidade", "Comando de Campo", "Inquebrável"],
      },
    ],
    nexProgression: [
      { nex: "5%", descricao: "Habilidade inicial de classe + bônus de combate" },
      { nex: "10%", descricao: "Habilidade de trilha I" },
      { nex: "15%", descricao: "Melhoria de atributo ou nova habilidade" },
      { nex: "20%", descricao: "Habilidade de trilha II" },
      { nex: "25%+", descricao: "Habilidades avançadas e aprimoramentos" },
    ],
  },
  Especialista: {
    icon: "🔍",
    cor: "text-blue-400",
    corBg: "bg-blue-500/10",
    corBorder: "border-blue-500/30",
    atributoFoco: "Intelecto / Agilidade / Presença",
    playstyle: "Versátil e adaptável. O Especialista usa perícias, tecnologia e conhecimento para resolver problemas que brutos não conseguem.",
    trilhas: [
      {
        nome: "Investigador",
        descricao: "Mestre em coletar informações, seguir pistas e revelar segredos ocultos. Indispensável em missões de pesquisa.",
        habilidades: ["Faro Detetivesco", "Análise Forense", "Rede de Contatos", "Dedução Paranormal"],
      },
      {
        nome: "Infiltrador",
        descricao: "Especialista em se mover nas sombras, disfarces e sabotagem. Opera onde outros não podem.",
        habilidades: ["Mãos Leves", "Sombra Urbana", "Disfarce Perfeito", "Saída de Emergência"],
      },
    ],
    nexProgression: [
      { nex: "5%", descricao: "Habilidade inicial + bônus em perícias" },
      { nex: "10%", descricao: "Habilidade de trilha I" },
      { nex: "15%", descricao: "Perícias adicionais e especialização" },
      { nex: "20%", descricao: "Habilidade de trilha II" },
      { nex: "25%+", descricao: "Maestria em trilha e capacidades expandidas" },
    ],
  },
  Ocultista: {
    icon: "🔮",
    cor: "text-purple-400",
    corBg: "bg-purple-500/10",
    corBorder: "border-purple-500/30",
    atributoFoco: "Intelecto / Presença / Vigor",
    playstyle: "Manipula o Outro Lado através de rituais. Alta Sanidade e PE tornam o Ocultista poderoso mas frágil — um trunfo que exige proteção.",
    trilhas: [
      {
        nome: "Arcanista",
        descricao: "Domina rituais ofensivos e manipulação direta das forças paranormais. Causa dano devastador a entidades.",
        habilidades: ["Ritual Veloz", "Potência Arcana", "Escudo Élfico", "Canalização Extrema"],
      },
      {
        nome: "Médium",
        descricao: "Comunica-se com espíritos e entidades do Outro Lado. Obtém informações e pode manipular o campo paranormal sutilmente.",
        habilidades: ["Percepção Etérea", "Barganha com Espíritos", "Proteção Espiritual", "Portal Controlado"],
      },
    ],
    nexProgression: [
      { nex: "5%", descricao: "Acesso a rituais de 1º círculo" },
      { nex: "10%", descricao: "Habilidade de trilha I + rituais avançados" },
      { nex: "15%", descricao: "Poder arcano e novo círculo de rituais" },
      { nex: "20%", descricao: "Habilidade de trilha II" },
      { nex: "25%+", descricao: "Rituais de alto círculo e poderes únicos" },
    ],
  },
};

function StatBox({ label, value, color }: { label: string; value: number | undefined; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-sm border ${color} min-w-16`}>
      <span className="text-xl font-display font-bold">{value ?? "—"}</span>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  );
}

function ClasseCard({ classe }: { classe: Classe }) {
  const lore = CLASS_LORE[classe.nome];

  return (
    <div className={`border rounded-sm overflow-hidden ${lore?.corBorder ?? "border-border/50"} bg-card`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b border-border/50 ${lore?.corBg ?? ""}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{lore?.icon ?? "📋"}</span>
          <h3 className={`font-display text-2xl font-bold tracking-widest ${lore?.cor ?? "text-foreground"}`}>
            {classe.nome.toUpperCase()}
          </h3>
        </div>
        {lore?.atributoFoco && (
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Atributos principais: <span className="text-foreground">{lore.atributoFoco}</span>
          </p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Descrição */}
        {(classe.descricao || lore?.playstyle) && (
          <p className="text-sm text-muted-foreground leading-relaxed font-sans">
            {lore?.playstyle ?? classe.descricao}
          </p>
        )}

        {/* Stats iniciais */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">
            Estatísticas base
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 grid grid-cols-3 gap-2 mb-2">
              <StatBox label="PV Inicial" value={classe.pvInicial} color="border-red-500/25 text-red-400" />
              <StatBox label="PE Inicial" value={classe.peInicial} color="border-blue-500/25 text-blue-400" />
              <StatBox label="SAN Inicial" value={classe.sanInicial} color="border-purple-500/25 text-purple-400" />
            </div>
            <div className="col-span-3 grid grid-cols-4 gap-2">
              <StatBox label="PV/NEX" value={classe.pvPorNivel} color="border-red-500/15 text-red-400/70" />
              <StatBox label="PE/NEX" value={classe.pePorNivel} color="border-blue-500/15 text-blue-400/70" />
              <StatBox label="SAN/NEX" value={classe.sanPorNivel} color="border-purple-500/15 text-purple-400/70" />
              <StatBox label="Perícias" value={classe.periciasTreindasBase} color="border-amber-500/15 text-amber-400/70" />
            </div>
          </div>
        </div>

        {/* Progressão de NEX */}
        {lore?.nexProgression && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">
              Progressão de NEX
            </p>
            <div className="space-y-1.5">
              {lore.nexProgression.map((step) => (
                <div key={step.nex} className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold shrink-0 w-10 ${lore.cor}`}>{step.nex}</span>
                  <ChevronRight className="h-3 w-3 text-border shrink-0" />
                  <span className="text-xs text-muted-foreground font-sans">{step.descricao}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trilhas */}
        {lore?.trilhas && lore.trilhas.length > 0 && (
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">
              Trilhas disponíveis
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lore.trilhas.map((trilha) => (
                <div
                  key={trilha.nome}
                  className={`rounded-sm border p-4 ${lore.corBorder} ${lore.corBg}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={`h-3.5 w-3.5 ${lore.cor} shrink-0`} />
                    <span className={`font-display text-sm font-bold ${lore.cor}`}>{trilha.nome}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3">
                    {trilha.descricao}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trilha.habilidades.map((hab) => (
                      <span
                        key={hab}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${lore.corBorder} ${lore.corBg} ${lore.cor}`}
                      >
                        {hab}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    <div className="space-y-6">
      <div className="bg-amber-950/20 border border-amber-800/30 rounded-sm px-4 py-3 text-xs text-amber-200/70 font-mono leading-relaxed">
        <span className="text-amber-300 font-bold">CLASSIFICADO — ORDEM PARANORMAL:</span> As trilhas desbloqueiam habilidades especiais conforme o agente avança de NEX (Nível de Exposição). Escolha sua trilha ao atingir 10% de NEX.
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(classes as Classe[]).map((c) => (
          <ClasseCard key={c.id} classe={c} />
        ))}
      </div>
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
            <Shield className="h-3.5 w-3.5" />
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
