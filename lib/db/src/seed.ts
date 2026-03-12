import { db } from "./index";
import { classesTable, origensTable, periciasTable, trilhasTable } from "./schema/game";
import { count, eq } from "drizzle-orm";

async function seed() {
  const [{ value: classCount }] = await db.select({ value: count() }).from(classesTable);
  if (Number(classCount) > 0) {
    console.log("==> Database already seeded, skipping.");
    process.exit(0);
  }

  console.log("==> Seeding database...");

  // ── Classes ──────────────────────────────────────────────────────────────
  const [combatente] = await db.insert(classesTable).values({
    nome: "Combatente",
    descricao: "Agente de combate da Ordem Paranormal. Especializado em confrontos diretos com entidades e ameaças paranormais.",
    pvInicial: 20, pvPorNivel: 4, peInicial: 2, pePorNivel: 2, sanInicial: 12, sanPorNivel: 3, periciasTreindasBase: 1,
    habilidadesBase: [
      { nex: "5%",  nome: "Ataque Especial (2 PE, +5)",         descricao: "Você pode gastar 2 PE para receber +5 em testes de ataque ou rolagens de dano com um ataque." },
      { nex: "10%", nome: "Habilidade de Trilha",               descricao: "Você recebe a primeira habilidade da trilha escolhida." },
      { nex: "15%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "20%", nome: "Aumento de Atributo",                descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "25%", nome: "Ataque Especial (3 PE, +10)",        descricao: "O bônus do seu Ataque Especial aumenta para +10 e o custo para 3 PE." },
      { nex: "30%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "35%", nome: "Grau de Treinamento",                descricao: "Escolha um número de perícias treinadas igual a 2 + Int. Seu grau de treinamento nessas perícias aumenta para veterano." },
      { nex: "40%", nome: "Habilidade de Trilha",               descricao: "Você recebe a segunda habilidade da trilha escolhida." },
      { nex: "45%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "50%", nome: "Aumento de Atributo, Versatilidade", descricao: "Aumente um atributo em +1. Escolha entre um poder de combatente ou o primeiro poder de uma trilha que não a sua." },
      { nex: "55%", nome: "Ataque Especial (4 PE, +15)",        descricao: "O bônus do seu Ataque Especial aumenta para +15 e o custo para 4 PE." },
      { nex: "60%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "65%", nome: "Habilidade de Trilha",               descricao: "Você recebe a terceira habilidade da trilha escolhida." },
      { nex: "70%", nome: "Grau de Treinamento",                descricao: "Escolha um número de perícias treinadas igual a 2 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)." },
      { nex: "75%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "80%", nome: "Aumento de Atributo",                descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "85%", nome: "Ataque Especial (5 PE, +20)",        descricao: "O bônus do seu Ataque Especial aumenta para +20 e o custo para 5 PE." },
      { nex: "90%", nome: "Poder de Combatente",                descricao: "Você recebe um poder de combatente à sua escolha." },
      { nex: "95%", nome: "Aumento de Atributo",                descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "99%", nome: "Habilidade de Trilha",               descricao: "Você recebe a quarta habilidade da trilha escolhida." },
    ],
  }).returning();

  const [especialista] = await db.insert(classesTable).values({
    nome: "Especialista",
    descricao: "Agente versátil da Ordem Paranormal. Adaptável a qualquer situação graças a seu extenso treinamento em perícias.",
    pvInicial: 16, pvPorNivel: 3, peInicial: 3, pePorNivel: 3, sanInicial: 16, sanPorNivel: 4, periciasTreindasBase: 7,
    habilidadesBase: [
      { nex: "5%",  nome: "Eclético, Perito (2 PE, +1d6)",                 descricao: "Gaste 2 PE para ser treinado em perícia. Escolha 2 perícias para somar +1d6 por 2 PE." },
      { nex: "10%", nome: "Habilidade de Trilha",                          descricao: "Você recebe a primeira habilidade da trilha escolhida." },
      { nex: "15%", nome: "Poder de Especialista",                         descricao: "Você recebe um poder de especialista à sua escolha." },
      { nex: "20%", nome: "Aumento de Atributo",                           descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "25%", nome: "Perito (3 PE, +1d8)",                           descricao: "O bônus do seu Perito aumenta para +1d8 e o custo para 3 PE." },
      { nex: "30%", nome: "Poder de Especialista",                         descricao: "Você recebe um poder de especialista à sua escolha." },
      { nex: "35%", nome: "Grau de Treinamento",                           descricao: "Escolha um número de perícias treinadas igual a 5 + Int. Seu grau de treinamento nessas perícias aumenta para veterano." },
      { nex: "40%", nome: "Engenhosidade (Veterano), Habilidade de Trilha",descricao: "Eclético pode dar bônus de veterano por +2 PE. Recebe a segunda habilidade da trilha." },
      { nex: "45%", nome: "Poder de Especialista",                         descricao: "Você recebe um poder de especialista à sua escolha." },
      { nex: "50%", nome: "Aumento de Atributo, Versatilidade",            descricao: "Aumente um atributo em +1. Escolha entre um poder de especialista ou o primeiro poder de uma trilha que não a sua." },
      { nex: "55%", nome: "Perito (4 PE, +1d10)",                          descricao: "O bônus do seu Perito aumenta para +1d10 e o custo para 4 PE." },
      { nex: "60%", nome: "Poder de Especialista",                         descricao: "Você recebe um poder de especialista à sua escolha." },
      { nex: "65%", nome: "Habilidade de Trilha",                          descricao: "Você recebe a terceira habilidade da trilha escolhida." },
      { nex: "70%", nome: "Grau de Treinamento",                           descricao: "Escolha um número de perícias treinadas igual a 5 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)." },
      { nex: "75%", nome: "Engenhosidade (Expert), Poder de Especialista", descricao: "Eclético pode dar bônus de expert por +4 PE. Recebe um poder de especialista." },
      { nex: "80%", nome: "Aumento de Atributo",                           descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "85%", nome: "Perito (5 PE, +1d12)",                          descricao: "O bônus do seu Perito aumenta para +1d12 e o custo para 5 PE." },
      { nex: "90%", nome: "Poder de Especialista",                         descricao: "Você recebe um poder de especialista à sua escolha." },
      { nex: "95%", nome: "Aumento de Atributo",                           descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "99%", nome: "Habilidade de Trilha",                          descricao: "Você recebe a quarta habilidade da trilha escolhida." },
    ],
  }).returning();

  const [ocultista] = await db.insert(classesTable).values({
    nome: "Ocultista",
    descricao: "Agente especializado no Outro Lado. Domina rituais e conhecimentos proibidos para combater o paranormal com suas próprias armas.",
    pvInicial: 12, pvPorNivel: 2, peInicial: 4, pePorNivel: 4, sanInicial: 20, sanPorNivel: 5, periciasTreindasBase: 3,
    habilidadesBase: [
      { nex: "5%",  nome: "Escolhido pelo Outro Lado (1º círculo)", descricao: "Pode lançar rituais de 1º círculo. Começa com 3 rituais." },
      { nex: "10%", nome: "Habilidade de Trilha",                   descricao: "Você recebe a primeira habilidade da trilha escolhida." },
      { nex: "15%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "20%", nome: "Aumento de Atributo",                    descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "25%", nome: "Escolhido pelo Outro Lado (2º círculo)", descricao: "Pode lançar rituais de 2º círculo." },
      { nex: "30%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "35%", nome: "Grau de Treinamento",                    descricao: "Escolha um número de perícias treinadas igual a 3 + Int. Seu grau de treinamento nessas perícias aumenta para veterano." },
      { nex: "40%", nome: "Habilidade de Trilha",                   descricao: "Você recebe a segunda habilidade da trilha escolhida." },
      { nex: "45%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "50%", nome: "Aumento de Atributo, Versatilidade",     descricao: "Aumente um atributo em +1. Escolha entre um poder de ocultista ou o primeiro poder de uma trilha que não a sua." },
      { nex: "55%", nome: "Escolhido pelo Outro Lado (3º círculo)", descricao: "Pode lançar rituais de 3º círculo." },
      { nex: "60%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "65%", nome: "Habilidade de Trilha",                   descricao: "Você recebe a terceira habilidade da trilha escolhida." },
      { nex: "70%", nome: "Grau de Treinamento",                    descricao: "Escolha um número de perícias treinadas igual a 3 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)." },
      { nex: "75%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "80%", nome: "Aumento de Atributo",                    descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "85%", nome: "Escolhido pelo Outro Lado (4º círculo)", descricao: "Pode lançar rituais de 4º círculo." },
      { nex: "90%", nome: "Poder de Ocultista",                     descricao: "Você recebe um poder de ocultista à sua escolha." },
      { nex: "95%", nome: "Aumento de Atributo",                    descricao: "Aumente um atributo a sua escolha em +1 (máximo 5)." },
      { nex: "99%", nome: "Habilidade de Trilha",                   descricao: "Você recebe a quarta habilidade da trilha escolhida." },
    ],
  }).returning();

  const [sobrevivente] = await db.insert(classesTable).values({
    nome: "Sobrevivente",
    descricao: "Um civil comum que foi jogado de frente para o paranormal. Sem treinamento formal, sobrevive graças à teimosia, sorte e instinto.",
    pvInicial: 8, pvPorNivel: 2, peInicial: 2, pePorNivel: 1, sanInicial: 8, sanPorNivel: 2, periciasTreindasBase: 3,
    habilidadesBase: [
      { nex: "Estágio 1", nome: "Empenho",          descricao: "Gaste 1 PE para receber +2 em um teste de perícia." },
      { nex: "Estágio 2", nome: "Habilidade de Trilha", descricao: "Recebe a primeira habilidade da trilha de sobrevivente." },
      { nex: "Estágio 3", nome: "Aumento de Atributo", descricao: "Aumenta um atributo em +1 (máximo 3)." },
      { nex: "Estágio 4", nome: "Habilidade de Trilha", descricao: "Recebe a segunda habilidade da trilha de sobrevivente." },
      { nex: "Estágio 5", nome: "Cicatrizado",       descricao: "Sacrifique 1 PV ou PE permanentemente para ignorar dano mental ou reduzir dano físico à metade." },
    ],
  }).returning();

  // ── Trilhas do Combatente ────────────────────────────────────────────────
  await db.insert(trilhasTable).values([
    {
      classeId: combatente.id,
      nome: "Aniquilador",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "A Favorita",      descricao: "Escolha uma arma favorita; sua categoria é reduzida em I." },
        { nex: "40%", nome: "Técnica Secreta", descricao: "Categoria da arma favorita reduzida em II. Gaste 2 PE para efeitos Amplo ou Destruidor." },
        { nex: "65%", nome: "Técnica Sublime", descricao: "Adiciona efeitos Letal (+2 margem ameaça) e Perfurante (ignora 5 RD) à Técnica Secreta." },
        { nex: "99%", nome: "Máquina de Matar",descricao: "Categoria reduzida em III, +2 na margem de ameaça e +1 dado de dano." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Comandante de Campo",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Inspirar Confiança", descricao: "Gaste reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste." },
        { nex: "40%", nome: "Estrategista",       descricao: "Gaste ação padrão e 1 PE por aliado para dar uma ação de movimento adicional no próximo turno deles." },
        { nex: "65%", nome: "Brecha na Guarda",   descricao: "Gaste reação e 2 PE para permitir ataque adicional contra inimigo que sofreu dano de aliado. Alcance de habilidades aumenta para Médio." },
        { nex: "99%", nome: "Oficial Comandante", descricao: "Gaste ação padrão e 5 PE para dar ação padrão adicional a todos os aliados em alcance médio." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Guerreiro",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Técnica Letal",   descricao: "Recebe +2 na margem de ameaça com todos os ataques corpo a corpo." },
        { nex: "40%", nome: "Revidar",         descricao: "Sempre que bloquear, gaste reação e 2 PE para fazer um ataque corpo a corpo no agressor." },
        { nex: "65%", nome: "Força Opressora", descricao: "Gaste 1 PE para realizar manobra derrubar ou empurrar como ação livre após acerto corpo a corpo." },
        { nex: "99%", nome: "Potência Máxima", descricao: "Bônus numéricos do Ataque Especial são dobrados para armas corpo a corpo." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Operações Especiais",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Iniciativa Aprimorada", descricao: "+5 em Iniciativa e ação de movimento adicional na primeira rodada." },
        { nex: "40%", nome: "Ataque Extra",           descricao: "Uma vez por rodada, gaste 2 PE para fazer um ataque adicional." },
        { nex: "65%", nome: "Surto de Adrenalina",    descricao: "Uma vez por rodada, gaste 5 PE para realizar ação padrão ou de movimento adicional." },
        { nex: "99%", nome: "Sempre Alerta",          descricao: "Recebe uma ação padrão adicional no início de cada cena de combate." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Tropa de Choque",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Casca Grossa", descricao: "+1 PV para cada 5% de NEX e soma Vigor na RD de bloqueio." },
        { nex: "40%", nome: "Cai Dentro",   descricao: "Gaste reação e 1 PE para forçar inimigo a atacar você em vez de aliado (Vontade DT Vigor evita)." },
        { nex: "65%", nome: "Duro de Matar",descricao: "Gaste reação e 2 PE para reduzir dano não paranormal à metade. NEX 85%+ afeta dano paranormal." },
        { nex: "99%", nome: "Inquebrável",  descricao: "Machucado: +5 Defesa e RD 5. Morrendo: não fica indefeso e pode agir." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Agente Secreto",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Carteirada",          descricao: "Treinado em Diplomacia ou Enganação. Recebe documentos com privilégios jurídicos especiais." },
        { nex: "40%", nome: "O Sorriso",           descricao: "+2 em Diplomacia e Enganação. Gaste 2 PE para repetir teste de uma dessas perícias." },
        { nex: "65%", nome: "Método Investigativo",descricao: "Urgência de investigação aumenta em 1 rodada. Gaste 2 PE para anular evento de investigação." },
        { nex: "99%", nome: "Multifacetado",       descricao: "Gaste 5 Sanidade para receber habilidades de até NEX 65% de outra trilha de combatente ou especialista até o fim da cena." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Caçador",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Rastrear o Paranormal",descricao: "Treinado em Sobrevivência. Usa Sobrevivência no lugar de Ocultismo para identificar criaturas e Investigação/Percepção para rastros paranormais." },
        { nex: "40%", nome: "Estudar Fraquezas",    descricao: "Gaste ação de interlúdio estudando pista de um ser para receber informação útil e +1 em testes contra ele." },
        { nex: "65%", nome: "Atacar das Sombras",   descricao: "Pode se mover em deslocamento normal em Furtividade. Penalidade por atacar com arma silenciosa reduzida para -0." },
        { nex: "99%", nome: "Estudar a Presa",      descricao: "Pode transformar um ser em sua 'presa'. Recebe +5 em testes, +1 na margem/crítico e RD 5 contra ele." },
      ],
    },
    {
      classeId: combatente.id,
      nome: "Monstruoso",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Ser Amaldiçoado",  descricao: "Treinado em Ocultismo. Escolha um elemento para etapa ritualística diária para receber resistências e bônus específicos." },
        { nex: "40%", nome: "Ser Macabro",       descricao: "RD do elemento aumenta para 10. Recebe habilidades adicionais (ex: recuperar PV com Força ou usar Int como atributo de esforço)." },
        { nex: "65%", nome: "Ser Assustador",    descricao: "RD aumenta para 15. Presença reduz em 1. Recebe arma natural de mordida ou bônus massivos em testes." },
        { nex: "99%", nome: "Ser Aterrorizante", descricao: "RD aumenta para 20. Torna-se criatura paranormal. Efeitos da etapa ritualística tornam-se permanentes. Aprende rituais poderosos." },
      ],
    },
  ]);

  // ── Trilhas do Especialista ──────────────────────────────────────────────
  await db.insert(trilhasTable).values([
    {
      classeId: especialista.id,
      nome: "Atirador de Elite",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Mira de Elite",       descricao: "Proficiência com armas de fogo de balas longas e soma Intelecto no dano." },
        { nex: "40%", nome: "Disparo Letal",        descricao: "Ao Mirar, gaste 1 PE para +2 na margem de ameaça até o fim do próximo turno." },
        { nex: "65%", nome: "Disparo Impactante",   descricao: "Gaste 2 PE para realizar manobra (derrubar, desarmar, empurrar, quebrar) em vez de dano." },
        { nex: "99%", nome: "Atirar para Matar",    descricao: "Acerto crítico com arma de fogo causa dano máximo." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Infiltrador",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Ataque Furtivo (+1d6)",              descricao: "Gaste 1 PE para +1d6 de dano contra alvos desprevenidos ou flanqueados." },
        { nex: "40%", nome: "Gatuno, Ataque Furtivo (+2d6)",      descricao: "+5 em Atletismo e Crime. Ataque Furtivo aumenta para +2d6." },
        { nex: "65%", nome: "Assassinar, Ataque Furtivo (+3d6)",  descricao: "Gaste ação de movimento e 3 PE para analisar alvo; dobra dados de Ataque Furtivo. Aumenta para +3d6." },
        { nex: "99%", nome: "Sombra Fugaz, Ataque Furtivo (+4d6)",descricao: "Gaste 3 PE para ignorar penalidade de Furtividade após atacar. Aumenta para +4d6." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Médico de Campo",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Paramédico",   descricao: "Gaste ação padrão e 2 PE para curar 2d10 PV." },
        { nex: "40%", nome: "Equipe de Trauma", descricao: "Gaste ação padrão e 2 PE para remover condição negativa de aliado adjacente." },
        { nex: "65%", nome: "Resgate",      descricao: "Aproxima-se de aliado machucado como ação livre; concede +5 na Defesa ao curar." },
        { nex: "99%", nome: "Reanimação",   descricao: "Uma vez por cena, gaste ação completa e 10 PE para ressuscitar aliado morto na mesma cena." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Negociador",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Eloquência",          descricao: "Gaste ação completa e 1 PE/alvo para fascinar alvos." },
        { nex: "40%", nome: "Discurso Motivador",  descricao: "Gaste ação padrão e 4 PE para dar +5 em testes de perícia a aliados em alcance curto." },
        { nex: "65%", nome: "Eu Conheço um Cara",  descricao: "Uma vez por missão, aciona rede de contatos para obter informação ou item de categoria até III." },
        { nex: "99%", nome: "Truque de Mestre",    descricao: "Gaste 5 PE para simular efeito de qualquer habilidade de aliado vista na cena." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Técnico",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Inventário Otimizado", descricao: "Soma Intelecto à Força para capacidade de carga." },
        { nex: "40%", nome: "Remendão",             descricao: "Gaste ação completa e 1 PE para remover condição quebrado. Itens gerais têm categoria reduzida em I." },
        { nex: "65%", nome: "Improvisar",           descricao: "Gaste ação completa e 2 PE (+2/categoria) para criar versão funcional de item geral." },
        { nex: "99%", nome: "Preparado para Tudo",  descricao: "Gaste ação de movimento e 3 PE/categoria para 'encontrar' qualquer item na bolsa." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Bibliotecário",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Conhecimento Prático",    descricao: "Gaste 2 PE para mudar o atributo-base de uma perícia para Intelecto." },
        { nex: "40%", nome: "Leitor Contumaz",         descricao: "Bônus de ler aumenta para 1d8. Pode gastar 2 PE para aumentar para 2d8." },
        { nex: "65%", nome: "Rato de Biblioteca",      descricao: "Em local com livros, gaste rodada e 2 PE para benefícios de ler ou revisar caso." },
        { nex: "99%", nome: "A Força do Saber",        descricao: "Intelecto aumenta em +1 e soma no total de PE. Muda atributo de uma perícia para Int permanentemente." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Perseverante",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Soluções Improvisadas",      descricao: "Gaste 2 PE para rolar novamente 1 dado de um teste recém-realizado." },
        { nex: "40%", nome: "Fuga Obstinada",             descricao: "+5 em testes para fugir. Em perseguição como presa, pode acumular até 4 falhas." },
        { nex: "65%", nome: "Determinação Inquestionável",descricao: "Uma vez por cena, gaste 5 PE e ação padrão para remover condição de medo, mental ou paralisia." },
        { nex: "99%", nome: "Só Mais um Passo...",        descricao: "Uma vez por rodada, se cair a 0 PV, gaste 5 PE para ficar com 1 PV (exceto dano massivo)." },
      ],
    },
    {
      classeId: especialista.id,
      nome: "Muambeiro",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Mascate",             descricao: "Treinado em Profissão (armeiro, engenheiro ou químico) e +5 na capacidade de carga." },
        { nex: "40%", nome: "Fabricação Própria",  descricao: "Leva metade do tempo para fabricar itens mundanos. Fabrica dois consumíveis por ação." },
        { nex: "65%", nome: "Laboratório de Campo",descricao: "+5 em Profissão escolhida. Pode fabricar e consertar itens paranormais em campo." },
        { nex: "99%", nome: "Achado Conveniente",  descricao: "Gaste ação completa e 5 PE para 'produzir' item de categoria até III até o fim da cena." },
      ],
    },
  ]);

  // ── Trilhas do Ocultista ─────────────────────────────────────────────────
  await db.insert(trilhasTable).values([
    {
      classeId: ocultista.id,
      nome: "Conduíte",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Ampliar Ritual",      descricao: "Gaste +2 PE para aumentar alcance em um passo ou dobrar área de efeito." },
        { nex: "40%", nome: "Acelerar Ritual",     descricao: "Uma vez por rodada, gaste +4 PE para conjurar ritual como ação livre." },
        { nex: "65%", nome: "Anular Ritual",       descricao: "Gaste PE igual ao custo do ritual alvo e vença teste oposto de Ocultismo para anulá-lo." },
        { nex: "99%", nome: "Canalizar o Medo",    descricao: "Aprende o ritual Canalizar o Medo." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Flagelador",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Poder do Flagelo", descricao: "Pode pagar custo de PE com PV (2 PV por 1 PE)." },
        { nex: "40%", nome: "Abraçar a Dor",    descricao: "Sempre que sofrer dano não paranormal, gaste reação e 2 PE para reduzir à metade." },
        { nex: "65%", nome: "Absorver Agonia",  descricao: "Sempre que reduz inimigo a 0 PV com ritual, recupera PE igual ao círculo do ritual." },
        { nex: "99%", nome: "Medo Tangível",    descricao: "Aprende o ritual Medo Tangível." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Graduado",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Saber Ampliado",       descricao: "Aprende um ritual adicional por círculo. Não conta no limite de rituais." },
        { nex: "40%", nome: "Grimório Ritualístico",descricao: "Aprende rituais extras (igual Int). Precisa folhear grimório para conjurá-los." },
        { nex: "65%", nome: "Rituais Eficientes",   descricao: "A DT para resistir aos seus rituais aumenta em +5." },
        { nex: "99%", nome: "Conhecendo o Medo",    descricao: "Aprende o ritual Conhecendo o Medo." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Intuitivo",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Mente Sã",           descricao: "Recebe +5 em testes de resistência contra efeitos paranormais." },
        { nex: "40%", nome: "Presença Poderosa",  descricao: "Adiciona Presença ao limite de PE por turno apenas para conjurar rituais." },
        { nex: "65%", nome: "Inabalável",         descricao: "RD mental e paranormal 10. Se passar em teste de Vontade, não sofre dano." },
        { nex: "99%", nome: "Presença do Medo",   descricao: "Aprende o ritual Presença do Medo." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Lâmina Paranormal",
      fonte: "Livro Base",
      habilidades: [
        { nex: "10%", nome: "Lâmina Maldita",       descricao: "Aprende Amaldiçoar Arma. Pode usar Ocultismo para ataques com a arma amaldiçoada." },
        { nex: "40%", nome: "Gladiador Paranormal",  descricao: "Acerto corpo a corpo concede 2 PE temporários." },
        { nex: "65%", nome: "Conjuração Marcial",    descricao: "Ao lançar ritual, gaste 2 PE para fazer um ataque corpo a corpo como ação livre." },
        { nex: "99%", nome: "Lâmina do Medo",        descricao: "Aprende o ritual Lâmina do Medo." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Exorcista",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Revelação do Mal",       descricao: "Treinado em Religião. Pode usar Religião no lugar de Investigação e Percepção para traços paranormais." },
        { nex: "40%", nome: "Poder da Fé",            descricao: "Veterano em Religião. Gaste 2 PE para repetir teste de resistência usando Religião." },
        { nex: "65%", nome: "Parareligiosidade",      descricao: "Gaste +2 PE no ritual para adicionar efeito de um catalisador ritualístico à escolha." },
        { nex: "99%", nome: "Chagas da Resistência",  descricao: "Se Sanidade cair a 0, gaste 10 PV para ficar com 1 SAN." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Possuído",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Poder Não Desejado",    descricao: "Recebe Transcender em vez de poder de classe. Ganha Pontos de Possessão (PP) para curar PV ou PE." },
        { nex: "40%", nome: "As Sombras Dentro de Mim", descricao: "Recuperação de PP aumenta. Gaste 2 PE para +5 em Acrobacia, Atletismo e Furtividade." },
        { nex: "65%", nome: "Ele Me Ensina",         descricao: "Escolha entre Transcender ou o primeiro poder de uma trilha de ocultista que não a sua." },
        { nex: "99%", nome: "Tornamo-nos Um",        descricao: "Recebe um 'Presente' poderoso baseado no elemento de afinidade (Sangue, Morte, Conhecimento ou Energia)." },
      ],
    },
    {
      classeId: ocultista.id,
      nome: "Parapsicólogo",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "10%", nome: "Terapia",               descricao: "Usa Profissão (psicólogo) como Diplomacia. Gaste 2 PE para usar Profissão no lugar de teste de resistência mental falho." },
        { nex: "40%", nome: "Palavras-chave",         descricao: "Ao acalmar, gaste PE para recuperar Sanidade do alvo (1 por 1)." },
        { nex: "65%", nome: "Reprogramação Mental",   descricao: "Gaste 5 PE e ação de interlúdio para dar um poder temporário a um aliado voluntário." },
        { nex: "99%", nome: "A Sanidade Está Lá Fora",descricao: "Gaste ação de movimento e 5 PE para remover todas as condições de medo ou mentais de alvo adjacente." },
      ],
    },
  ]);

  // ── Trilhas do Sobrevivente ──────────────────────────────────────────────
  await db.insert(trilhasTable).values([
    {
      classeId: sobrevivente.id,
      nome: "Durão",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "Estágio 2", nome: "Durão",         descricao: "Recebe +4 PV imediatos e +2 PV no próximo estágio." },
        { nex: "Estágio 4", nome: "Pancada Forte", descricao: "Gaste 1 PE para receber +5 no teste de ataque." },
      ],
    },
    {
      classeId: sobrevivente.id,
      nome: "Esperto",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "Estágio 2", nome: "Esperto",    descricao: "Torna-se treinado em uma perícia adicional." },
        { nex: "Estágio 4", nome: "Entendido",  descricao: "Escolha 2 perícias; gaste 1 PE para somar +1d4 no teste." },
      ],
    },
    {
      classeId: sobrevivente.id,
      nome: "Esotérico",
      fonte: "Sobrevivendo ao Horror",
      habilidades: [
        { nex: "Estágio 2", nome: "Esotérico", descricao: "Gaste ação padrão e 1 PE para sentir energias paranormais em alcance curto." },
        { nex: "Estágio 4", nome: "Iniciado",  descricao: "Aprende e pode conjurar um ritual de 1º círculo." },
      ],
    },
  ]);

  // ── Origens ──────────────────────────────────────────────────────────────
  await db.insert(origensTable).values([
    // ── Livro Base (26 origens) ──────────────────────────────────────────
    {
      nome: "Acadêmico", fonte: "Livro Base",
      descricao: "Você trabalhou em uma universidade, instituto de pesquisa ou museu. Seu trabalho envolvia pesquisa, ensino ou curadoria de conhecimento. Em algum momento, suas pesquisas esbarraram no paranormal.",
      periciasConcedidas: ["Ciências", "Investigação"],
      poderConcedido: "Saber é Poder",
      poderDescricao: "Você recebe +2 em testes de Ciências e Investigação. Além disso, quando faz um teste de Ciências ou Investigação, pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Agente de Saúde", fonte: "Livro Base",
      descricao: "Você trabalhou na área da saúde, seja como médico, enfermeiro, paramédico ou técnico. Seu contato com o sofrimento humano e, eventualmente, com casos inexplicáveis, o levou à Ordem.",
      periciasConcedidas: ["Intuição", "Medicina"],
      poderConcedido: "Técnica Medicinal",
      poderDescricao: "Você pode usar Medicina para estabilizar personagens sem um kit médico, com DT 15. Além disso, quando usa um kit médico, você pode gastar 2 PE para curar 1d6+INT PV adicionais.",
    },
    {
      nome: "Amnésico", fonte: "Livro Base",
      descricao: "Você não se lembra de quem era antes. Talvez tenha sido um experimento, uma vítima de ritual ou simplesmente alguém que viu algo que não deveria. Sua vida começa agora, na Ordem.",
      periciasConcedidas: [],
      poderConcedido: "Vislumbres do Passado",
      poderDescricao: "Escolha duas perícias quaisquer (a critério do mestre). Você é treinado nelas — fragmentos de sua vida anterior. Além disso, uma vez por missão, pode 'lembrar' de algo relevante para a cena atual.",
    },
    {
      nome: "Artista", fonte: "Livro Base",
      descricao: "Você era um ator, músico, escritor, pintor ou qualquer outro tipo de artista. Sua sensibilidade e criatividade o tornaram mais perceptivo ao paranormal.",
      periciasConcedidas: ["Artes", "Enganação"],
      poderConcedido: "Magnum Opus",
      poderDescricao: "Uma vez por cena, você pode gastar 2 PE para conceder +2 em um teste de perícia a um aliado em alcance médio. Além disso, recebe +2 em testes de Artes.",
    },
    {
      nome: "Atleta", fonte: "Livro Base",
      descricao: "Você foi um atleta profissional ou amador de alto nível. Seu corpo treinado e sua mentalidade competitiva o tornaram um agente eficaz.",
      periciasConcedidas: ["Acrobacia", "Atletismo"],
      poderConcedido: "110%",
      poderDescricao: "Você recebe +2 em testes de Acrobacia e Atletismo. Além disso, seu deslocamento aumenta em 3 metros.",
    },
    {
      nome: "Chef", fonte: "Livro Base",
      descricao: "Você era um cozinheiro profissional, seja em um restaurante sofisticado ou em uma barraca de rua. Sua habilidade com ingredientes e sua criatividade na cozinha o tornaram um membro valioso da Ordem.",
      periciasConcedidas: ["Fortitude", "Profissão (cozinheiro)"],
      poderConcedido: "Ingrediente Secreto",
      poderDescricao: "Durante um interlúdio, você pode preparar uma refeição especial. Todos que a consumirem recuperam 1d6+PRE PV adicionais durante o descanso.",
    },
    {
      nome: "Criminoso", fonte: "Livro Base",
      descricao: "Você viveu à margem da lei, seja como ladrão, hacker, traficante ou outro tipo de criminoso. Suas habilidades ilícitas provaram ser surpreendentemente úteis na Ordem.",
      periciasConcedidas: ["Crime", "Furtividade"],
      poderConcedido: "O Crime Compensa",
      poderDescricao: "Você recebe +2 em testes de Crime e Furtividade. Além disso, uma vez por cena, pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Crime.",
    },
    {
      nome: "Cultista Arrependido", fonte: "Livro Base",
      descricao: "Você fez parte de um culto que adorava entidades do Outro Lado. Após ver os horrores que seu grupo causava, decidiu abandoná-lo e usar seu conhecimento para combater o paranormal de dentro.",
      periciasConcedidas: ["Ocultismo", "Religião"],
      poderConcedido: "Traços do Outro Lado",
      poderDescricao: "Você recebe +2 em testes de Ocultismo. Além disso, uma vez por cena, pode gastar 2 PE para identificar automaticamente uma entidade ou ritual do Outro Lado que já tenha encontrado antes.",
    },
    {
      nome: "Desgarrado", fonte: "Livro Base",
      descricao: "Você cresceu sem estrutura familiar, sobrevivendo nas ruas ou em ambientes hostis. Essa vida dura forjou um corpo e uma mente capazes de aguentar o que a maioria não suporta.",
      periciasConcedidas: ["Fortitude", "Sobrevivência"],
      poderConcedido: "Calejado",
      poderDescricao: "Você recebe redução de dano 2 contra dano físico. Além disso, quando é reduzido a 0 PV, pode gastar 2 PE para ficar com 1 PV em vez de cair inconsciente.",
    },
    {
      nome: "Engenheiro", fonte: "Livro Base",
      descricao: "Você trabalhou projetando, construindo ou consertando estruturas, máquinas ou sistemas. Sua mente analítica e suas mãos habilidosas abriram portas inesperadas para o paranormal.",
      periciasConcedidas: ["Profissão (engenheiro)", "Tecnologia"],
      poderConcedido: "Ferramenta Favorita",
      poderDescricao: "Escolha uma ferramenta ou objeto simples. Quando usa essa ferramenta ou um objeto similar para resolver um problema, recebe +2 no teste. Além disso, você pode improvisar uma arma ou ferramenta com materiais disponíveis gastando 2 PE.",
    },
    {
      nome: "Executivo", fonte: "Livro Base",
      descricao: "Você ocupava um cargo de liderança em uma empresa ou organização. Sua habilidade de tomar decisões sob pressão e gerenciar pessoas chamou a atenção da Ordem.",
      periciasConcedidas: ["Diplomacia", "Profissão (executivo)"],
      poderConcedido: "Processo Otimizado",
      poderDescricao: "Você recebe +2 em Diplomacia. Além disso, quando usa a ação ajudar, o bônus concedido aumenta para +5.",
    },
    {
      nome: "Investigador", fonte: "Livro Base",
      descricao: "Você trabalhou como detetive particular, investigador ou analista. Sua habilidade em encontrar pistas e interrogar suspeitos o tornou um ativo valioso para a Ordem.",
      periciasConcedidas: ["Investigação", "Percepção"],
      poderConcedido: "Faro para Pistas",
      poderDescricao: "Você recebe +2 em testes de Investigação e Percepção. Além disso, quando examina uma cena ou local suspeito, pode gastar 2 PE para fazer um teste de Investigação e descobrir uma pista adicional que outros passariam despercebida.",
    },
    {
      nome: "Lutador", fonte: "Livro Base",
      descricao: "Você tem experiência em combate corpo a corpo, seja como lutador de artes marciais, praticante de esportes de contato ou simplesmente alguém que cresceu em um ambiente violento.",
      periciasConcedidas: ["Luta", "Reflexos"],
      poderConcedido: "Mão Pesada",
      poderDescricao: "Você recebe +2 em rolagens de dano com ataques corpo a corpo desarmados ou com armas leves. Além disso, quando realiza um ataque corpo a corpo, pode gastar 2 PE para impor uma condição de sua escolha ao alvo até o início do seu próximo turno.",
    },
    {
      nome: "Magnata", fonte: "Livro Base",
      descricao: "Você possui muito dinheiro ou patrimônio. Pode ser o herdeiro de uma família antiga ligada ao oculto, ter criado e vendido uma empresa e decidido usar sua riqueza para uma causa maior, ou ter ganho uma loteria após inadvertidamente escolher números amaldiçoados que formavam um ritual.",
      periciasConcedidas: ["Diplomacia", "Pilotagem"],
      poderConcedido: "Patrocinador da Ordem",
      poderDescricao: "Seu limite de crédito é sempre considerado um acima do atual.",
    },
    {
      nome: "Mercenário", fonte: "Livro Base",
      descricao: "Você é um soldado de aluguel, que trabalha sozinho ou como parte de alguma organização que vende serviços militares. Escoltas e assassinatos fizeram parte de sua rotina por tempo o suficiente para você se envolver em alguma situação com o paranormal.",
      periciasConcedidas: ["Iniciativa", "Intimidação"],
      poderConcedido: "Posição de Combate",
      poderDescricao: "No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.",
    },
    {
      nome: "Militar", fonte: "Livro Base",
      descricao: "Você serviu em uma força militar, como o exército ou a marinha. Passou muito tempo treinando com armas de fogo, até se tornar um perito no uso delas. Acostumado a obedecer ordens e partir em missões, está em casa na Ordo Realitas.",
      periciasConcedidas: ["Pontaria", "Tática"],
      poderConcedido: "Para Bellum",
      poderDescricao: "Você recebe +2 em rolagens de dano com armas de fogo.",
    },
    {
      nome: "Operário", fonte: "Livro Base",
      descricao: "Pedreiro, industriário, operador de máquinas em uma fábrica… Você passou uma parte de sua vida em um emprego braçal, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo.",
      periciasConcedidas: ["Fortitude", "Profissão (operário)"],
      poderConcedido: "Ferramenta de Trabalho",
      poderDescricao: "Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão. Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.",
    },
    {
      nome: "Policial", fonte: "Livro Base",
      descricao: "Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.",
      periciasConcedidas: ["Percepção", "Pontaria"],
      poderConcedido: "Patrulha",
      poderDescricao: "Você recebe +2 em Defesa.",
    },
    {
      nome: "Religioso", fonte: "Livro Base",
      descricao: "Você é devoto ou sacerdote de uma fé. Independentemente da religião que pratica, se dedica a auxiliar as pessoas com problemas espirituais. A partir disso, teve contato com o paranormal.",
      periciasConcedidas: ["Religião", "Vontade"],
      poderConcedido: "Acalentar",
      poderDescricao: "Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença.",
    },
    {
      nome: "Servidor Público", fonte: "Livro Base",
      descricao: "Você possuía carreira em um órgão do governo, lidando com burocracia e atendendo pessoas. Sua rotina foi quebrada quando você viu que o prefeito era um cultista ou que a câmara de vereadores se reunia à noite para realizar rituais.",
      periciasConcedidas: ["Intuição", "Vontade"],
      poderConcedido: "Espírito Cívico",
      poderDescricao: "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.",
    },
    {
      nome: "Teórico da Conspiração", fonte: "Livro Base",
      descricao: "A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana... E secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo esses importantes assuntos.",
      periciasConcedidas: ["Investigação", "Ocultismo"],
      poderConcedido: "Eu Já Sabia",
      poderDescricao: "Você não se abala com entidades ou anomalias. Afinal, sempre soube que isso tudo existia. Você recebe resistência a dano mental igual ao seu Intelecto.",
    },
    {
      nome: "T.I.", fonte: "Livro Base",
      descricao: "Programador, engenheiro de software ou simplesmente 'o cara da T.I.', você tem treinamento e experiência para lidar com sistemas informatizados. Seu talento (ou curiosidade exagerada) chamou a atenção da Ordem.",
      periciasConcedidas: ["Investigação", "Tecnologia"],
      poderConcedido: "Motor de Busca",
      poderDescricao: "A critério do Mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.",
    },
    {
      nome: "Trabalhador Rural", fonte: "Livro Base",
      descricao: "Você trabalhava no campo ou em áreas isoladas, como fazendeiro, pescador, biólogo, veterinário... Você se acostumou com o convívio com a natureza e os animais e talvez tenha ouvido uma ou outra história de fantasmas ao redor da fogueira.",
      periciasConcedidas: ["Adestramento", "Sobrevivência"],
      poderConcedido: "Desbravador",
      poderDescricao: "Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.",
    },
    {
      nome: "Trambiqueiro", fonte: "Livro Base",
      descricao: "Uma vida digna exige muito trabalho, então é melhor nem tentar. Você vivia de pequenos golpes, jogatina ilegal e falcatruas. Certo dia, enganou a pessoa errada; no dia seguinte, se viu servindo à Ordem.",
      periciasConcedidas: ["Crime", "Enganação"],
      poderConcedido: "Impostor",
      poderDescricao: "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.",
    },
    {
      nome: "Universitário", fonte: "Livro Base",
      descricao: "Você era aluno de uma faculdade. Em sua rotina de estudos, provas e festas, acabou descobrindo algo — talvez um livro amaldiçoado na antiga biblioteca do campus? Por seu achado, foi convocado pela Ordem.",
      periciasConcedidas: ["Atualidades", "Investigação"],
      poderConcedido: "Dedicação",
      poderDescricao: "Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1.",
    },
    {
      nome: "Vítima", fonte: "Livro Base",
      descricao: "Em algum momento de sua vida — infância, juventude ou início da vida adulta — você encontrou o paranormal... E a experiência não foi nada boa. Você viu os espíritos dos mortos, foi atacado por uma entidade ou mesmo foi sequestrado para ser sacrificado em um ritual.",
      periciasConcedidas: ["Reflexos", "Vontade"],
      poderConcedido: "Cicatrizes Psicológicas",
      poderDescricao: "Você recebe +1 de Sanidade para cada 5% de NEX.",
    },

    // ── Sobrevivendo ao Horror (20 origens) ─────────────────────────────
    {
      nome: "Amigo dos Animais", fonte: "Sobrevivendo ao Horror", criador: "Gabriela 'Louie' | Arsenal Paranormal",
      descricao: "Você desenvolveu uma conexão muito forte com outros seres: os animais. Seja por nunca ter se dado muito bem com humanos ou por preferir a companhia de um melhor amigo de quatro patas, você leva sua vida ao lado de um bichano e até mesmo aprende com a natureza perceptiva deles.",
      periciasConcedidas: ["Adestramento", "Percepção"],
      poderConcedido: "Companheiro Animal",
      poderDescricao: "Você consegue entender as intenções e sentimentos de animais, e pode usar Adestramento para mudar a atitude deles. Além disso, você possui um melhor amigo, um animal que cresceu com você. Ele conta como um aliado que fornece +2 em uma perícia a sua escolha.",
    },
    {
      nome: "Astronauta", fonte: "Sobrevivendo ao Horror",
      descricao: "Outrora limitada a membros de algumas agências espaciais estatais, a profissão de explorador espacial se tornou mais acessível. Como um astronauta, você se acostumou à pressão de ser responsável pela vida de seus colegas e por experimentos de milhões de reais. E foi na escuridão do espaço que você descobriu que não estamos sozinhos.",
      periciasConcedidas: ["Ciências", "Fortitude"],
      poderConcedido: "Acostumado ao Extremo",
      poderDescricao: "Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE.",
    },
    {
      nome: "Chef do Outro Lado", fonte: "Sobrevivendo ao Horror", criador: "Julie Sathler | Ateliê Secreto",
      descricao: "Você nunca foi muito bom na culinária convencional. Depois de sobreviver ao paranormal, entretanto, descobriu um talento que é considerado um grande tabu até mesmo pelos ocultistas mais experientes: cozinhar e ingerir entidades do Outro Lado.",
      periciasConcedidas: ["Ocultismo", "Profissão (cozinheiro)"],
      poderConcedido: "Fome do Outro Lado",
      poderDescricao: "Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. Pode preparar um prato especial durante um interlúdio; se passar no teste de Profissão (cozinheiro) DT 15+O, o prato fornece RD 10 contra o tipo de dano do elemento da criatura.",
    },
    {
      nome: "Colegial", fonte: "Sobrevivendo ao Horror",
      descricao: "Você era um aluno do colegial e tinha uma rotina baseada nos estudos, nas amizades e nos dramas típicos de alguém da sua idade, até que um encontro com o paranormal mudou sua vida.",
      periciasConcedidas: ["Atualidades", "Tecnologia"],
      poderConcedido: "Poder da Amizade",
      poderDescricao: "Escolha um personagem para ser seu melhor amigo. Se estiver em alcance médio dele e puderem trocar olhares, você recebe +2 em todos os testes de perícia.",
    },
    {
      nome: "Cosplayer", fonte: "Sobrevivendo ao Horror", criador: "Rafael 'Damnu' e Victor Moda | Toca dos Monstros",
      descricao: "Você é apaixonado pela arte do cosplay e dedicou sua vida a criar a melhor fantasia possível. Confrontado com o paranormal, você colocou sua arte, e sua resiliência, a serviço da Ordem.",
      periciasConcedidas: ["Artes", "Vontade"],
      poderConcedido: "Não É Fantasia, É Cosplay!",
      poderDescricao: "Você pode fazer testes de disfarce usando Artes em vez de Enganação. Além disso, ao fazer um teste de perícia, se estiver usando um cosplay que tem relação com ele, você recebe +2.",
    },
    {
      nome: "Diplomata", fonte: "Sobrevivendo ao Horror",
      descricao: "Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis. Talvez fosse representante comercial de uma empresa, membro de um partido político ou embaixador do governo.",
      periciasConcedidas: ["Atualidades", "Diplomacia"],
      poderConcedido: "Conexões",
      poderDescricao: "Você recebe +2 em Diplomacia. Além disso, se puder contatar um NPC capaz de lhe auxiliar, você pode gastar 10 minutos e 2 PE para substituir um teste de uma perícia relacionada ao conhecimento desse NPC por um teste de Diplomacia.",
    },
    {
      nome: "Explorador", fonte: "Sobrevivendo ao Horror", criador: "Guilherme 'Guirassol' e João Vitor 'Vapor' | Arquivo do Medo",
      descricao: "Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas.",
      periciasConcedidas: ["Fortitude", "Sobrevivência"],
      poderConcedido: "Manual do Sobrevivente",
      poderDescricao: "Ao fazer um teste para resistir a armadilhas, clima, doenças, fome, sede, fumaça, sono, sufocamento ou veneno, incluindo de fontes paranormais, você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Experimento", fonte: "Sobrevivendo ao Horror",
      descricao: "Você foi uma cobaia em um experimento físico. Pode ter sido um voluntário em um procedimento experimental legítimo, ou submetido a experimentos científicos ou paranormais contra sua vontade.",
      periciasConcedidas: ["Atletismo", "Fortitude"],
      poderConcedido: "Mutação",
      poderDescricao: "Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre penalidade em Diplomacia.",
    },
    {
      nome: "Fanático por Criaturas", fonte: "Sobrevivendo ao Horror", criador: "Everson 'Akkiel' e Yasmim Furtado | Grimório Paranormal",
      descricao: "Você sempre foi obcecado pelo sobrenatural. Desde que pode se lembrar, a ideia de encontrar uma criatura o fascina tanto quanto o assusta. Essa faísca fez você se tornar um 'caçador de monstros'.",
      periciasConcedidas: ["Investigação", "Ocultismo"],
      poderConcedido: "Conhecimento Oculto",
      poderDescricao: "Você pode fazer testes de Ocultismo para identificar criatura a partir de informações como uma imagem, rastros, indícios de sua presença ou outras pistas. Se passar, você descobre as características da criatura.",
    },
    {
      nome: "Fotógrafo", fonte: "Sobrevivendo ao Horror",
      descricao: "Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor.",
      periciasConcedidas: ["Artes", "Percepção"],
      poderConcedido: "Através da Lente",
      poderDescricao: "Quando faz um teste de Investigação ou de Percepção para adquirir pistas olhando através de uma câmera ou analisando fotos, você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Inventor Paranormal", fonte: "Sobrevivendo ao Horror", criador: "Bruno Sargi | C.R.I.S.",
      descricao: "A curiosidade e a criatividade fizeram de você uma pessoa que busca constantemente desafiar limites e criar soluções inovadoras, sendo mais de uma vez intitulado como um 'cientista louco'.",
      periciasConcedidas: ["Profissão (engenheiro)", "Vontade"],
      poderConcedido: "Invenção Paranormal",
      poderDescricao: "Escolha um ritual de 1º círculo. Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite executar o efeito do ritual escolhido. Para ativar o invento, gasta uma ação padrão e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão.",
    },
    {
      nome: "Jovem Místico", fonte: "Sobrevivendo ao Horror", criador: "Ramon 'PlayRay' e João 'Portill' | A Passagem",
      descricao: "Você possui uma profunda conexão com sua espiritualidade, suas crenças ou o próprio universo. Essa conexão faz com que você veja o mundo e viva sua vida de forma diferente e peculiar.",
      periciasConcedidas: ["Ocultismo", "Religião"],
      poderConcedido: "A Culpa é das Estrelas",
      poderDescricao: "Escolha um número da sorte entre 1 e 6. No início de cada cena, você pode gastar 1 PE e rolar 1d6. Se o resultado for seu número da sorte, você recebe +2 em testes de perícia até o fim da cena.",
    },
    {
      nome: "Legista do Turno da Noite", fonte: "Sobrevivendo ao Horror", criador: "Ivo 'Eddu' e Ana Beatriz 'Bix' | Arquivos Confidenciais",
      descricao: "Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria.",
      periciasConcedidas: ["Ciências", "Medicina"],
      poderConcedido: "Luto Habitual",
      poderDescricao: "Você sofre apenas a metade do dano mental por presenciar uma cena relacionada à rotina de um legista. Além disso, quando faz um teste de Medicina para primeiros socorros ou necropsia, você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Mateiro", fonte: "Sobrevivendo ao Horror",
      descricao: "Você conhece áreas rurais e selvagens. Você pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.",
      periciasConcedidas: ["Percepção", "Sobrevivência"],
      poderConcedido: "Mapa Celeste",
      poderDescricao: "Desde que possa ver o céu, você sempre sabe as direções dos pontos cardeais e consegue chegar sem se perder em qualquer lugar que já tenha visitado ao menos uma vez. Quando faz um teste de Sobrevivência, você pode gastar 2 PE para rolar o teste novamente e escolher o melhor entre os dois resultados.",
    },
    {
      nome: "Mergulhador", fonte: "Sobrevivendo ao Horror",
      descricao: "Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. Trajando seu equipamento de mergulho, você consegue se aventurar a grandes profundidades.",
      periciasConcedidas: ["Atletismo", "Fortitude"],
      poderConcedido: "Fôlego de Nadador",
      poderDescricao: "Você recebe +5 PV e pode prender a respiração por um número de rodadas igual ao dobro do seu Vigor. Além disso, quando passa em um teste de Atletismo para natação, você avança seu deslocamento normal.",
    },
    {
      nome: "Motorista", fonte: "Sobrevivendo ao Horror",
      descricao: "Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros.",
      periciasConcedidas: ["Pilotagem", "Reflexos"],
      poderConcedido: "Mãos no Volante",
      poderDescricao: "Você não sofre penalidades em testes de ataque por estar em um veículo em movimento e, sempre que estiver pilotando e tiver que fazer um teste de Pilotagem ou resistência, pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Nerd Entusiasta", fonte: "Sobrevivendo ao Horror", criador: "Daniel Dill e Lukas Castanho | Remate Paranormal",
      descricao: "Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado 'nerd'. Sua obsessão em pesquisar fundo seus assuntos de interesse chamou a atenção de organizações paranormais.",
      periciasConcedidas: ["Ciências", "Tecnologia"],
      poderConcedido: "O Inteligentão",
      poderDescricao: "O bônus que você recebe ao utilizar a ação de interlúdio ler aumenta em +1 dado (de +1d6 para +2d6).",
    },
    {
      nome: "Profetizado", fonte: "Sobrevivendo ao Horror",
      descricao: "Como qualquer pessoa, você vai morrer. Entretanto, diferente delas, você sabe como isso vai acontecer. De algum jeito, seja por pesadelos, pensamentos intrusivos ou até visões inesperadas, você tem uma premonição clara de como serão seus últimos momentos de vida.",
      periciasConcedidas: ["Vontade"],
      poderConcedido: "Luta ou Fuga",
      poderDescricao: "Conhecer os sinais de sua morte o deixa mais confiante, principalmente quando eles não estão presentes. Você recebe +2 em Vontade. Quando surge uma referência a sua premonição, você recebe +2 PE temporários que duram até o fim da cena.",
    },
    {
      nome: "Psicólogo", fonte: "Sobrevivendo ao Horror", criador: "Luiz Giovane e Matheus Santana | Missões Ordem",
      descricao: "Você se especializou no estudo e tratamento das questões mentais do ser humano. Em sua prática profissional, você teve contato com o paranormal e descobriu que algumas aflições mentais possuem origens sombrias e perigosas.",
      periciasConcedidas: ["Intuição", "Profissão (psicólogo)"],
      poderConcedido: "Terapia",
      poderDescricao: "Você pode usar Profissão (psicólogo) como Diplomacia. Além disso, uma vez por rodada, quando você ou um aliado em alcance curto falha em um teste de resistência contra um efeito que causa dano mental, você pode gastar 2 PE para fazer um teste de Profissão (psicólogo) e usar o resultado no lugar.",
    },
    {
      nome: "Repórter Investigativo", fonte: "Sobrevivendo ao Horror",
      descricao: "Você está sempre em busca de histórias significativas, investigando eventos, entrevistando fontes e analisando dados para descobrir a verdade por trás dos acontecimentos.",
      periciasConcedidas: ["Atualidades", "Investigação"],
      poderConcedido: "Encontrar a Verdade",
      poderDescricao: "Você pode usar Investigação no lugar de Diplomacia ao fazer testes para persuadir e mudar atitude e, quando faz um teste de Investigação, pode gastar 2 PE para receber +5 nesse teste.",
    },
  ]);

  // ── Perícias ─────────────────────────────────────────────────────────────
  await db.insert(periciasTable).values([
    { nome: "Acrobacia",     atributoBase: "Agilidade",  somenteTrainada: false },
    { nome: "Adestramento",  atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Artes",         atributoBase: "Presença",   somenteTrainada: true  },
    { nome: "Atletismo",     atributoBase: "Força",      somenteTrainada: false },
    { nome: "Atualidades",   atributoBase: "Intelecto",  somenteTrainada: false },
    { nome: "Ciências",      atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Crime",         atributoBase: "Agilidade",  somenteTrainada: true  },
    { nome: "Diplomacia",    atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Enganação",     atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Fortitude",     atributoBase: "Vigor",      somenteTrainada: false },
    { nome: "Furtividade",   atributoBase: "Agilidade",  somenteTrainada: false },
    { nome: "Iniciativa",    atributoBase: "Agilidade",  somenteTrainada: false },
    { nome: "Intimidação",   atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Intuição",      atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Investigação",  atributoBase: "Intelecto",  somenteTrainada: false },
    { nome: "Luta",          atributoBase: "Força",      somenteTrainada: false },
    { nome: "Medicina",      atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Ocultismo",     atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Percepção",     atributoBase: "Presença",   somenteTrainada: false },
    { nome: "Pilotagem",     atributoBase: "Agilidade",  somenteTrainada: true  },
    { nome: "Pontaria",      atributoBase: "Agilidade",  somenteTrainada: false },
    { nome: "Profissão",     atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Reflexos",      atributoBase: "Agilidade",  somenteTrainada: false },
    { nome: "Religião",      atributoBase: "Presença",   somenteTrainada: true  },
    { nome: "Sobrevivência", atributoBase: "Intelecto",  somenteTrainada: false },
    { nome: "Tática",        atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Tecnologia",    atributoBase: "Intelecto",  somenteTrainada: true  },
    { nome: "Vontade",       atributoBase: "Presença",   somenteTrainada: false },
  ]);

  console.log("==> Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
