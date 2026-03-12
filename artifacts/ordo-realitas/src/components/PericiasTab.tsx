import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Pericia = {
  id: string;
  nome: string;
  atributo_base: "FOR" | "AGI" | "INT" | "PRE" | "VIG";
  somente_treinada: boolean;
  carga: boolean;
  kit: boolean;
  descricao: string;
  exemplos_uso: string;
};

const PERICIAS: Pericia[] = [
  { id: "per-001", nome: "Acrobacia",   atributo_base: "AGI", somente_treinada: false, carga: true,  kit: false, descricao: "Usada para proezas acrobáticas, equilíbrio, escapar de amarras, amortecer quedas e levantar-se rapidamente.", exemplos_uso: "Atravessar uma corda bamba, amortecer uma queda de um prédio, escapar de algemas ou se espremer por espaços apertados." },
  { id: "per-002", nome: "Adestramento",atributo_base: "PRE", somente_treinada: true,  carga: false, kit: false, descricao: "Capacidade de lidar com animais, acalmando-os, manejando-os ou treinando-os para tarefas específicas.", exemplos_uso: "Acalmar um cão de guarda raivoso, cavalgar em terreno difícil ou comandar um animal treinado para atacar." },
  { id: "per-003", nome: "Artes",       atributo_base: "PRE", somente_treinada: true,  carga: false, kit: false, descricao: "Habilidade em criar expressões artísticas, reconhecer obras de valor e realizar performances.", exemplos_uso: "Pintar um quadro, tocar um instrumento para impressionar alguém ou identificar a autenticidade de uma obra de arte." },
  { id: "per-004", nome: "Atletismo",   atributo_base: "FOR", somente_treinada: false, carga: false, kit: false, descricao: "Mede a potência física do personagem para atividades como correr, saltar, escalar e nadar.", exemplos_uso: "Escalar um muro alto, nadar contra uma correnteza forte ou saltar sobre um buraco largo." },
  { id: "per-005", nome: "Atualidades", atributo_base: "INT", somente_treinada: false, carga: false, kit: false, descricao: "Conhecimento sobre o mundo contemporâneo, incluindo política, geografia, cultura pop e notícias recentes.", exemplos_uso: "Saber quem é uma figura pública importante, conhecer a geografia de uma cidade ou entender uma referência cultural." },
  { id: "per-006", nome: "Ciências",    atributo_base: "INT", somente_treinada: true,  carga: false, kit: false, descricao: "Conhecimento acadêmico em áreas como física, química, biologia, matemática e astronomia.", exemplos_uso: "Identificar uma substância química, calcular a trajetória de um objeto ou entender um fenômeno biológico complexo." },
  { id: "per-007", nome: "Crime",       atributo_base: "AGI", somente_treinada: true,  carga: true,  kit: true,  descricao: "Habilidades ilícitas como arrombamento, prestidigitação, sabotagem e desativação de dispositivos.", exemplos_uso: "Abrir uma fechadura sem chave, furtar uma carteira sem ser notado ou sabotar os freios de um carro." },
  { id: "per-008", nome: "Diplomacia",  atributo_base: "PRE", somente_treinada: false, carga: false, kit: false, descricao: "Habilidade de persuasão, negociação e etiqueta social para convencer outros através da fala mansa.", exemplos_uso: "Convencer um guarda a deixar você passar, negociar um preço melhor ou acalmar uma multidão enfurecida." },
  { id: "per-009", nome: "Enganação",   atributo_base: "PRE", somente_treinada: false, carga: false, kit: false, descricao: "Capacidade de mentir, omitir, disfarçar-se e ludibriar outros personagens.", exemplos_uso: "Contar uma mentira convincente, usar um disfarce para entrar em um local restrito ou fingir uma emoção." },
  { id: "per-010", nome: "Fortitude",   atributo_base: "VIG", somente_treinada: false, carga: false, kit: false, descricao: "Resistência física contra venenos, doenças, cansaço extremo e impactos massivos.", exemplos_uso: "Resistir ao efeito de um gás tóxico, aguentar horas de caminhada sem parar ou sobreviver a um impacto brutal." },
  { id: "per-011", nome: "Furtividade", atributo_base: "AGI", somente_treinada: false, carga: true,  kit: false, descricao: "Capacidade de mover-se sem fazer barulho e esconder-se da visão alheia.", exemplos_uso: "Atravessar um corredor vigiado sem ser visto ou seguir alguém nas sombras sem ser notado." },
  { id: "per-012", nome: "Iniciativa",  atributo_base: "AGI", somente_treinada: false, carga: false, kit: false, descricao: "Rapidez de reação para agir primeiro em situações de perigo iminente ou combate.", exemplos_uso: "Sacar a arma antes do inimigo ou reagir rapidamente a uma emboscada." },
  { id: "per-013", nome: "Intimidação", atributo_base: "PRE", somente_treinada: false, carga: false, kit: false, descricao: "Uso da força, ameaças ou presença imponente para coagir alguém a fazer o que você quer.", exemplos_uso: "Ameaçar um informante para obter dados ou usar sua estatura física para afastar um agressor." },
  { id: "per-014", nome: "Intuição",    atributo_base: "INT", somente_treinada: false, carga: false, kit: false, descricao: "Capacidade de perceber o que não foi dito, ler linguagem corporal e sentir segundas intenções.", exemplos_uso: "Perceber que alguém está mentindo, sentir que algo está errado em um ambiente ou ler o estado emocional de uma pessoa." },
  { id: "per-015", nome: "Investigação",atributo_base: "INT", somente_treinada: false, carga: false, kit: false, descricao: "Habilidade de procurar pistas, analisar evidências e conectar fatos para resolver mistérios.", exemplos_uso: "Encontrar uma impressão digital oculta, analisar documentos em busca de inconsistências ou vasculhar uma sala por compartimentos secretos." },
  { id: "per-016", nome: "Luta",        atributo_base: "FOR", somente_treinada: false, carga: false, kit: false, descricao: "Competência em combate corpo-a-corpo, seja com armas brancas ou desarmado.", exemplos_uso: "Acertar um golpe de faca, desferir um soco potente ou realizar uma manobra de agarrar." },
  { id: "per-017", nome: "Medicina",    atributo_base: "INT", somente_treinada: false, carga: false, kit: true,  descricao: "Conhecimento técnico para tratar ferimentos, doenças e estabilizar personagens à beira da morte.", exemplos_uso: "Fazer um curativo de emergência, realizar uma cirurgia simples ou identificar os sintomas de uma doença." },
  { id: "per-018", nome: "Ocultismo",   atributo_base: "INT", somente_treinada: true,  carga: false, kit: false, descricao: "Conhecimento sobre rituais, o Outro Lado, entidades paranormais e o funcionamento do medo.", exemplos_uso: "Identificar um símbolo paranormal, entender o efeito de um ritual ou saber a fraqueza de uma criatura do Outro Lado." },
  { id: "per-019", nome: "Percepção",   atributo_base: "PRE", somente_treinada: false, carga: false, kit: false, descricao: "Agudeza dos sentidos para notar detalhes visuais, auditivos ou olfativos no ambiente.", exemplos_uso: "Ouvir passos atrás de uma porta, notar um fio de armadilha no chão ou sentir o cheiro de algo queimando." },
  { id: "per-020", nome: "Pilotagem",   atributo_base: "AGI", somente_treinada: true,  carga: false, kit: false, descricao: "Habilidade em conduzir veículos motorizados, desde carros e motos até barcos e helicópteros.", exemplos_uso: "Realizar uma manobra evasiva durante uma perseguição ou pousar um helicóptero em condições adversas." },
  { id: "per-021", nome: "Pontaria",    atributo_base: "AGI", somente_treinada: false, carga: false, kit: false, descricao: "Precisão com armas à distância, como armas de fogo, arcos, bestas e objetos de arremesso.", exemplos_uso: "Acertar um tiro em um alvo distante ou arremessar uma granada no local exato." },
  { id: "per-022", nome: "Profissão",   atributo_base: "INT", somente_treinada: true,  carga: false, kit: false, descricao: "Conhecimento prático e técnico de um ofício específico escolhido pelo jogador.", exemplos_uso: "Um advogado pesquisando leis, um cozinheiro preparando uma refeição ou um mecânico consertando um motor." },
  { id: "per-023", nome: "Reflexos",    atributo_base: "AGI", somente_treinada: false, carga: false, kit: false, descricao: "Capacidade de esquivar-se de perigos rápidos, como explosões, armadilhas e ataques de área.", exemplos_uso: "Pular para longe de uma explosão ou desviar de um desabamento repentino." },
  { id: "per-024", nome: "Religião",    atributo_base: "PRE", somente_treinada: true,  carga: false, kit: false, descricao: "Conhecimento sobre teologia, história das religiões, ritos sagrados e mitologia.", exemplos_uso: "Identificar um símbolo religioso antigo, entender o significado de um ritual sagrado ou conhecer a história de um santo." },
  { id: "per-025", nome: "Sobrevivência",atributo_base: "INT", somente_treinada: false, carga: false, kit: false, descricao: "Habilidade de viver em ambientes selvagens, rastrear criaturas e encontrar recursos básicos.", exemplos_uso: "Rastrear uma pessoa na floresta, encontrar água potável em um deserto ou orientar-se pelas estrelas." },
  { id: "per-026", nome: "Tática",      atributo_base: "INT", somente_treinada: true,  carga: false, kit: false, descricao: "Conhecimento de estratégia militar, posicionamento de combate e análise de terreno.", exemplos_uso: "Identificar a melhor posição para uma emboscada ou analisar as defesas de um local fortificado." },
  { id: "per-027", nome: "Tecnologia",  atributo_base: "INT", somente_treinada: true,  carga: true,  kit: true,  descricao: "Capacidade de operar, hackear e consertar dispositivos eletrônicos e sistemas de computador.", exemplos_uso: "Invadir um servidor protegido, recuperar dados de um HD danificado ou desativar uma câmera de segurança remotamente." },
  { id: "per-028", nome: "Vontade",     atributo_base: "PRE", somente_treinada: false, carga: false, kit: false, descricao: "Resiliência mental e força de espírito para resistir a medo, rituais de controle e estresse emocional.", exemplos_uso: "Manter a calma diante de uma criatura aterrorizante ou resistir a um comando mental sobrenatural." },
];

type AtribFilter = "all" | "FOR" | "AGI" | "INT" | "PRE" | "VIG";

const ATRIB_LABELS: Record<string, string> = {
  FOR: "Força",
  AGI: "Agilidade",
  INT: "Intelecto",
  PRE: "Presença",
  VIG: "Vigor",
};

const ATRIB_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  FOR: { bg: "bg-red-500",    text: "text-white", border: "border-red-500" },
  AGI: { bg: "bg-blue-500",   text: "text-white", border: "border-blue-500" },
  INT: { bg: "bg-amber-500",  text: "text-background", border: "border-amber-500" },
  PRE: { bg: "bg-purple-500", text: "text-white", border: "border-purple-500" },
  VIG: { bg: "bg-green-600",  text: "text-white", border: "border-green-600" },
};

function PericiaCard({ p }: { p: Pericia }) {
  const col = ATRIB_COLORS[p.atributo_base];

  return (
    <div className="bg-card border border-border/60 rounded-sm p-5 flex flex-col gap-3 cursor-default transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_8px_16px_rgba(212,175,55,0.2)]">
      {/* header: nome + atributo */}
      <div className="flex items-start justify-between gap-3">
        <div className="font-display text-lg font-bold text-amber-400 leading-tight">{p.nome}</div>
        <div className={`shrink-0 ${col.bg} ${col.text} rounded-sm px-2.5 py-1 text-xs font-bold font-display`}>
          {p.atributo_base}
        </div>
      </div>

      {/* tags */}
      <div className="flex gap-1.5 flex-wrap">
        {p.somente_treinada && (
          <span className="bg-red-500/15 border border-red-500/40 text-red-400 rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide">
            Somente Treinada
          </span>
        )}
        {p.carga && (
          <span className="bg-blue-500/15 border border-blue-500/40 text-blue-400 rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide">
            Penalidade de Carga
          </span>
        )}
        {p.kit && (
          <span className="bg-green-600/15 border border-green-600/40 text-green-400 rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide">
            Kit Necessário
          </span>
        )}
      </div>

      {/* descrição */}
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.descricao}</p>

      {/* exemplos */}
      <div className="bg-background/30 border-l-[3px] border-amber-500 pl-3 pr-2 py-2.5 rounded-r-sm">
        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Exemplos de uso</div>
        <p className="text-xs text-muted-foreground italic leading-relaxed">{p.exemplos_uso}</p>
      </div>
    </div>
  );
}

export function PericiasTab() {
  const [search,  setSearch]  = useState("");
  const [atrib,   setAtrib]   = useState<AtribFilter>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PERICIAS.filter((p) => {
      const matchQ =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        ATRIB_LABELS[p.atributo_base].toLowerCase().includes(q);
      const matchA = atrib === "all" || p.atributo_base === atrib;
      return matchQ && matchA;
    });
  }, [search, atrib]);

  const total   = PERICIAS.length;
  const trein   = PERICIAS.filter((p) => p.somente_treinada).length;
  const comCarga= PERICIAS.filter((p) => p.carga).length;
  const comKit  = PERICIAS.filter((p) => p.kit).length;

  return (
    <div className="space-y-5">
      {/* stat boxes */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-sm px-5 py-3 text-center min-w-32">
          <div className="text-2xl font-bold font-display text-amber-400 mb-0.5">{total}</div>
          <div className="text-xs text-muted-foreground">Perícias Totais</div>
        </div>
        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-sm px-5 py-3 text-center min-w-32">
          <div className="text-2xl font-bold font-display text-red-400 mb-0.5">{trein}</div>
          <div className="text-xs text-muted-foreground">Somente Treinadas</div>
        </div>
        <div className="bg-blue-500/10 border-2 border-blue-500/40 rounded-sm px-5 py-3 text-center min-w-32">
          <div className="text-2xl font-bold font-display text-blue-400 mb-0.5">{comCarga}</div>
          <div className="text-xs text-muted-foreground">Penalidade de Carga</div>
        </div>
        <div className="bg-green-600/10 border-2 border-green-600/40 rounded-sm px-5 py-3 text-center min-w-32">
          <div className="text-2xl font-bold font-display text-green-400 mb-0.5">{comKit}</div>
          <div className="text-xs text-muted-foreground">Requerem Kit</div>
        </div>
      </div>

      {/* controls */}
      <div className="flex gap-3 flex-wrap items-center bg-card border border-border/60 rounded-sm p-3">
        {/* search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome, atributo ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/60 rounded-sm py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-amber-500/60 transition-colors font-mono"
          />
        </div>

        {/* atributo filter */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "FOR", "AGI", "INT", "PRE", "VIG"] as const).map((a) => {
            const isActive = atrib === a;
            const col = a !== "all" ? ATRIB_COLORS[a] : null;
            return (
              <button
                key={a}
                onClick={() => setAtrib(a)}
                className={`rounded-sm px-3 py-1.5 text-xs font-display uppercase tracking-widest border transition-colors whitespace-nowrap ${
                  isActive
                    ? col
                      ? `${col.bg} ${col.text} border-transparent`
                      : "bg-amber-500/20 border-amber-500/60 text-amber-400"
                    : "bg-background border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {a === "all" ? "Todas" : `${a} — ${ATRIB_LABELS[a]}`}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-muted-foreground font-mono ml-auto">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-mono text-sm">
          <div className="text-4xl mb-4">🔎</div>
          Nenhuma perícia encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => <PericiaCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
