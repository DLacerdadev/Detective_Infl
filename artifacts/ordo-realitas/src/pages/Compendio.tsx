import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListClasses } from "@workspace/api-client-react";
import { OrigensTab } from "@/components/OrigensTab";
import { BookOpen, Brain, Sword } from "lucide-react";

type Classe = {
  id: string;
  nome: string;
  pvInicial?: number;
  pvPorNivel?: number;
  peInicial?: number;
  pePorNivel?: number;
  sanInicial?: number;
  sanPorNivel?: number;
  periciasTreindasBase?: number;
};

type NexEntry = { nex: string; habilidade: string };
type Habilidade = { nex: string; nome: string; desc: string };
type Trilha = { nome: string; foco: string; fonte?: string };

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
  habilidades: Habilidade[];
  trilhasBase: Trilha[];
  trilhasSupl: Trilha[];
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
    habilidades: [
      { nex: "5%", nome: "Ataque Especial", desc: "Gasta 2 PE para bônus no teste (+5) ou no dano (+5). Aumenta em +5 por 1 PE extra em NEX 50%, 80%, 99%." },
    ],
    trilhasBase: [
      { nome: "Aniquilador", foco: "Dano massivo com uma arma favorita." },
      { nome: "Comandante de Campo", foco: "Suporte tático e liderança." },
      { nome: "Guerreiro", foco: "Combate corpo-a-corpo e manobras." },
      { nome: "Operações Especiais", foco: "Iniciativa e múltiplas ações." },
      { nome: "Tropa de Choque", foco: "Tanque e resistência física." },
    ],
    trilhasSupl: [
      { nome: "Agente Secreto", foco: "Disfarce, infiltração e ataques furtivos com armas de fogo." },
      { nome: "Caçador", foco: "Rastreio e bônus contra alvos específicos (criaturas)." },
      { nome: "Monstruoso", foco: "Transformação física e combate com garras/mordidas." },
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
    habilidades: [
      { nex: "5%", nome: "Perito", desc: "Escolha duas perícias. Gasta 2 PE para somar +1d6 no teste. Aumenta para +1d8, +1d10, +1d12 em NEX maiores." },
      { nex: "5%", nome: "Eclético", desc: "Gasta 2 PE para ser treinado em uma perícia não treinada até o fim da cena." },
    ],
    trilhasBase: [
      { nome: "Atirador de Elite", foco: "Ataques à distância precisos." },
      { nome: "Infiltrador", foco: "Furtividade e dano furtivo." },
      { nome: "Médico de Campo", foco: "Cura e suporte médico." },
      { nome: "Negociador", foco: "Interação social e diplomacia." },
      { nome: "Técnico", foco: "Inventário e uso de itens." },
    ],
    trilhasSupl: [
      { nome: "Agente do Governo", foco: "Autoridade, contatos e recursos estatais." },
      { nome: "Bibliotecário", foco: "Pesquisa rápida e bônus por conhecimento de livros." },
      { nome: "Muambeiro", foco: "Itens de categoria menor e troca de equipamentos rápida." },
      { nome: "Perseverante", foco: "Rerolar dados e resistir a condições negativas." },
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

  Ocultista: {
    icon: "✨",
    cor: "text-purple-400",
    corBg: "bg-purple-500/10",
    corBorder: "border-purple-500/30",
    pvMod: "+Vigor",
    pvNexMod: "+Vig",
    peMod: "+Presença",
    peNexMod: "+Pre",
    periciasTexto: "Ocultismo e Vontade (fixas), mais 3 + Intelecto à sua escolha.",
    proficiencias: "Armas simples.",
    habilidades: [
      { nex: "5%", nome: "Escolhido pelo Outro Lado", desc: "Começa com rituais de 1º círculo. Ganha acesso a círculos superiores conforme avança de NEX." },
    ],
    trilhasBase: [
      { nome: "Conduíte", foco: "Alcance e velocidade de rituais." },
      { nome: "Flagelador", foco: "Usa PV em vez de PE para rituais." },
      { nome: "Graduado", foco: "Grimório e muitos rituais conhecidos." },
      { nome: "Intuitivo", foco: "Resistência mental e paranormal." },
      { nome: "Lâmina Paranormal", foco: "Combate corpo-a-corpo com rituais." },
    ],
    trilhasSupl: [
      { nome: "Exorcista", foco: "Expulsar entidades e proteger aliados contra o Outro Lado." },
      { nome: "Maledictólogo", foco: "Maldições e debuffs em inimigos." },
      { nome: "Parapsicólogo", foco: "Estudo da mente e comunicação com o além." },
      { nome: "Possuído", foco: "Hospedar uma entidade para ganhar poderes físicos e mentais." },
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
};

const SOBREVIVENTE_ESTAGIOS = [
  { nivel: 1, nome: "Empenho", desc: "Gasta 1 PE para +2 em um teste." },
  { nivel: 2, nome: "Trilha (10%)", desc: "Primeira habilidade da trilha de sobrevivente." },
  { nivel: 3, nome: "Aumento de Atributo", desc: "+1 em um atributo à escolha." },
  { nivel: 4, nome: "Trilha (40%)", desc: "Segunda habilidade da trilha de sobrevivente." },
  { nivel: 5, nome: "Cicatrizado", desc: "Resistência a dano e bônus em testes de resistência." },
];

const SOBREVIVENTE_TRILHAS: Trilha[] = [
  { nome: "Durão", foco: "Sobrevivência física e combate bruto." },
  { nome: "Esperto", foco: "Investigação, perícias e tecnologia." },
  { nome: "Esotérico", foco: "Sensibilidade paranormal e rituais simples." },
];

function StatBox({ label, value, mod, color }: { label: string; value: number | undefined; mod?: string; color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-sm border ${color} text-center`}>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-display font-bold leading-none">{value ?? "—"}</span>
        {mod && <span className="text-[10px] font-mono opacity-80 leading-none">{mod}</span>}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

function TrilhaCard({ trilha, cor, corBg, corBorder, fonte }: { trilha: Trilha; cor: string; corBg: string; corBorder: string; fonte?: string }) {
  return (
    <div className={`rounded-sm border ${corBorder} bg-card hover:${corBg} transition-colors p-4`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`font-display text-sm font-bold ${cor}`}>{trilha.nome}</span>
        {fonte && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-primary/70 border border-primary/25 bg-primary/10 rounded-sm px-1.5 py-0.5 shrink-0">
            SUPL
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{trilha.foco}</p>
    </div>
  );
}

function HabilidadeCard({ hab, cor, corBg, corBorder }: { hab: Habilidade; cor: string; corBg: string; corBorder: string }) {
  return (
    <div className={`rounded-sm border-l-2 ${corBorder.replace("border-", "border-l-")} ${corBg} px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${cor}`}>{hab.nex}</span>
        <span className="font-display text-sm font-bold text-foreground">{hab.nome}</span>
      </div>
      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{hab.desc}</p>
    </div>
  );
}

function ClasseCard({ classe }: { classe: Classe }) {
  const extra = CLASS_EXTRA[classe.nome];
  if (!extra) return null;

  const isHighlighted = (entry: NexEntry) =>
    entry.habilidade.toLowerCase().includes("trilha") ||
    entry.habilidade.toLowerCase().includes("aumento");

  return (
    <div className={`border rounded-sm overflow-hidden ${extra.corBorder} bg-card`}>
      {/* Header */}
      <div className={`px-6 py-5 border-b border-border/50 ${extra.corBg}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{extra.icon}</span>
          <h3 className={`font-display text-2xl font-bold tracking-widest ${extra.cor}`}>
            {classe.nome.toUpperCase()}
          </h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Características</p>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="PV Inicial" value={classe.pvInicial} mod={extra.pvMod} color={`border-red-500/30 text-red-400 ${extra.corBg}`} />
              <StatBox label="PE Inicial" value={classe.peInicial} mod={extra.peMod} color={`border-blue-500/30 text-blue-400 ${extra.corBg}`} />
              <StatBox label="SAN Inicial" value={classe.sanInicial} color="border-purple-500/25 text-purple-400 bg-purple-500/5" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="PV / NEX" value={classe.pvPorNivel} mod={extra.pvNexMod} color="border-red-500/15 text-red-300/70" />
              <StatBox label="PE / NEX" value={classe.pePorNivel} mod={extra.peNexMod} color="border-blue-500/15 text-blue-300/70" />
              <StatBox label="SAN / NEX" value={classe.sanPorNivel} color="border-purple-500/15 text-purple-300/70" />
            </div>
          </div>
        </div>

        {/* Perícias e Proficiências */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Perícias treinadas</p>
            <p className="text-sm text-foreground/80 font-sans leading-relaxed">{extra.periciasTexto}</p>
          </div>
          <div>
            <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Proficiências</p>
            <p className="text-sm text-foreground/80 font-sans leading-relaxed">{extra.proficiencias}</p>
          </div>
        </div>

        {/* Habilidades de classe */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Habilidades de classe</p>
          <div className="space-y-2">
            {extra.habilidades.map((h) => (
              <HabilidadeCard key={h.nome} hab={h} cor={extra.cor} corBg={extra.corBg} corBorder={extra.corBorder} />
            ))}
          </div>
        </div>

        {/* Tabela NEX */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Tabela de progressão</p>
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
                    className={`grid grid-cols-[4rem_1fr] ${dim ? "bg-secondary/10 text-muted-foreground" : "bg-transparent text-foreground/90"}`}
                  >
                    <div className={`px-3 py-2 font-display font-bold text-xs ${extra.cor}`}>{entry.nex}</div>
                    <div className="px-3 py-2 font-sans text-xs leading-relaxed">{entry.habilidade}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trilhas */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Trilhas disponíveis</p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Livro Base</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {extra.trilhasBase.map((t) => (
                  <TrilhaCard key={t.nome} trilha={t} cor={extra.cor} corBg={extra.corBg} corBorder={extra.corBorder} />
                ))}
              </div>
            </div>
            {extra.trilhasSupl.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Sobrevivendo ao Horror</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {extra.trilhasSupl.map((t) => (
                    <TrilhaCard key={t.nome} trilha={t} cor={extra.cor} corBg={extra.corBg} corBorder={extra.corBorder} fonte="supl" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SobreviventeCard() {
  return (
    <div className="border rounded-sm overflow-hidden border-amber-500/30 bg-card">
      <div className="px-6 py-5 border-b border-border/50 bg-amber-500/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🏃</span>
          <h3 className="font-display text-2xl font-bold tracking-widest text-amber-400">SOBREVIVENTE</h3>
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary/70 border border-primary/25 bg-primary/10 rounded-sm px-1.5 py-0.5">
            SUPL
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-mono">Sobrevivendo ao Horror</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Estágios */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Progressão por estágios</p>
          <div className="rounded-sm border border-border/40 overflow-hidden">
            <div className="grid grid-cols-[3rem_8rem_1fr] text-[10px] font-display uppercase tracking-widest bg-secondary/40 border-b border-border/40">
              <div className="px-3 py-2 text-muted-foreground">#</div>
              <div className="px-3 py-2 text-muted-foreground">Estágio</div>
              <div className="px-3 py-2 text-muted-foreground">Efeito</div>
            </div>
            <div className="divide-y divide-border/20">
              {SOBREVIVENTE_ESTAGIOS.map((e) => (
                <div key={e.nivel} className="grid grid-cols-[3rem_8rem_1fr] text-xs">
                  <div className="px-3 py-2 font-display font-bold text-amber-400">{e.nivel}</div>
                  <div className="px-3 py-2 font-display text-foreground/90">{e.nome}</div>
                  <div className="px-3 py-2 font-sans text-muted-foreground leading-relaxed">{e.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trilhas */}
        <div>
          <p className="text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-3">Trilhas disponíveis</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SOBREVIVENTE_TRILHAS.map((t) => (
              <TrilhaCard
                key={t.nome}
                trilha={t}
                cor="text-amber-400"
                corBg="bg-amber-500/10"
                corBorder="border-amber-500/30"
                fonte="supl"
              />
            ))}
          </div>
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

  const ordered = ["Combatente", "Especialista", "Ocultista"];
  const sorted = [...(classes as Classe[])].sort(
    (a, b) => ordered.indexOf(a.nome) - ordered.indexOf(b.nome)
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {sorted.map((c) => <ClasseCard key={c.id} classe={c} />)}
      <SobreviventeCard />
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
