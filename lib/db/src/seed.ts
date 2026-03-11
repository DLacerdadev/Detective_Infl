import { db } from "./index";
import { classesTable, origensTable, periciasTable, rituaisTable, itensTable } from "./schema/game";
import { count } from "drizzle-orm";

async function seed() {
  const [{ value: classCount }] = await db.select({ value: count() }).from(classesTable);
  if (Number(classCount) > 0) {
    console.log("==> Database already seeded, skipping.");
    process.exit(0);
  }

  console.log("==> Seeding database...");

  await db.insert(classesTable).values([
    {
      nome: "Combatente",
      descricao: "Especialista em combate físico e sobrevivência em situações extremas. Treinado para lidar com ameaças paranormais de frente.",
      pvInicial: 20, pvPorNivel: 5, peInicial: 3, pePorNivel: 2, sanInicial: 10, sanPorNivel: 3, periciasTreindasBase: 3,
    },
    {
      nome: "Especialista",
      descricao: "Profissional com habilidades técnicas avançadas. Usa inteligência e perícia para superar os desafios do paranormal.",
      pvInicial: 16, pvPorNivel: 4, peInicial: 4, pePorNivel: 2, sanInicial: 12, sanPorNivel: 4, periciasTreindasBase: 4,
    },
    {
      nome: "Ocultista",
      descricao: "Estudioso do sobrenatural com acesso a rituais e conhecimentos proibidos. Frágil mas poderoso.",
      pvInicial: 12, pvPorNivel: 3, peInicial: 6, pePorNivel: 3, sanInicial: 14, sanPorNivel: 5, periciasTreindasBase: 3,
    },
  ]);

  await db.insert(origensTable).values([
    { nome: "Acadêmico", descricao: "Pesquisador ou professor com conhecimento teórico profundo.", periciasConcedidas: ["Ocultismo", "Ciências"], poderConcedido: "Pesquisa Avançada" },
    { nome: "Agente de Saúde", descricao: "Médico, enfermeiro ou paramédico habituado a lidar com situações críticas.", periciasConcedidas: ["Medicina", "Percepção"], poderConcedido: "Primeiros Socorros" },
    { nome: "Artista", descricao: "Músico, ator, escritor ou artista plástico com visão criativa do mundo.", periciasConcedidas: ["Artes", "Persuasão"], poderConcedido: "Inspiração" },
    { nome: "Atleta", descricao: "Esportista de alto rendimento com corpo treinado e disciplina mental.", periciasConcedidas: ["Atletismo", "Luta"], poderConcedido: "Corpo em Forma" },
    { nome: "Criminoso", descricao: "Alguém do submundo que conhece as sombras da sociedade por dentro.", periciasConcedidas: ["Furtividade", "Enganação"], poderConcedido: "Contatos no Crime" },
    { nome: "Cultista Arrependido", descricao: "Ex-membro de um culto que conhece os segredos do paranormal de forma íntima.", periciasConcedidas: ["Ocultismo", "Enganação"], poderConcedido: "Conhecimento Proibido" },
    { nome: "Investigador", descricao: "Detetive particular, jornalista investigativo ou similar.", periciasConcedidas: ["Investigação", "Percepção"], poderConcedido: "Faro Apurado" },
    { nome: "Militar", descricao: "Soldado, policial ou segurança com treinamento em combate e disciplina.", periciasConcedidas: ["Armas de Fogo", "Tática"], poderConcedido: "Treinamento Militar" },
  ]);

  await db.insert(periciasTable).values([
    { nome: "Acrobacia", atributoBase: "Agilidade", somenteTrainada: false },
    { nome: "Adestramento", atributoBase: "Presença", somenteTrainada: false },
    { nome: "Artes", atributoBase: "Presença", somenteTrainada: true },
    { nome: "Armas de Fogo", atributoBase: "Agilidade", somenteTrainada: true },
    { nome: "Atletismo", atributoBase: "Vigor", somenteTrainada: false },
    { nome: "Ciências", atributoBase: "Intelecto", somenteTrainada: true },
    { nome: "Crime", atributoBase: "Agilidade", somenteTrainada: true },
    { nome: "Diplomacia", atributoBase: "Presença", somenteTrainada: false },
    { nome: "Enganação", atributoBase: "Presença", somenteTrainada: false },
    { nome: "Furtividade", atributoBase: "Agilidade", somenteTrainada: false },
    { nome: "Iniciativa", atributoBase: "Agilidade", somenteTrainada: false },
    { nome: "Intimidação", atributoBase: "Presença", somenteTrainada: false },
    { nome: "Investigação", atributoBase: "Intelecto", somenteTrainada: false },
    { nome: "Luta", atributoBase: "Forca", somenteTrainada: false },
    { nome: "Medicina", atributoBase: "Intelecto", somenteTrainada: true },
    { nome: "Ocultismo", atributoBase: "Intelecto", somenteTrainada: true },
    { nome: "Percepção", atributoBase: "Intelecto", somenteTrainada: false },
    { nome: "Persuasão", atributoBase: "Presença", somenteTrainada: false },
    { nome: "Profissão", atributoBase: "Intelecto", somenteTrainada: true },
    { nome: "Pontaria", atributoBase: "Agilidade", somenteTrainada: false },
    { nome: "Pilotagem", atributoBase: "Agilidade", somenteTrainada: true },
    { nome: "Reflexos", atributoBase: "Agilidade", somenteTrainada: false },
    { nome: "Resiliência", atributoBase: "Vigor", somenteTrainada: false },
    { nome: "Tática", atributoBase: "Intelecto", somenteTrainada: true },
    { nome: "Vontade", atributoBase: "Presença", somenteTrainada: false },
  ]);

  await db.insert(rituaisTable).values([
    { nome: "Chamas de Insulto", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 criatura", duracao: "Instantâneo", custoPe: 2, descricao: "Invoca labaredas que causam dano de fogo." },
    { nome: "Visão do Além", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", custoPe: 2, descricao: "Permite ver entidades e energias sobrenaturais." },
    { nome: "Barreira Psíquica", elemento: "Medo", circulo: 1, execucao: "Reação", alcance: "Pessoal", alvo: "Você", duracao: "Rodada", custoPe: 2, descricao: "Cria uma barreira mental contra ataques psíquicos." },
    { nome: "Toque da Morte", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 criatura", duracao: "Instantâneo", custoPe: 4, descricao: "Canal de energia necrótica que drena a vitalidade." },
    { nome: "Sacrifício de Sangue", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Instantâneo", custoPe: 0, descricao: "Troca PV por PE, recuperando energia às custas de saúde." },
    { nome: "Névoa do Esquecimento", elemento: "Medo", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "Área", duracao: "Cena", custoPe: 3, descricao: "Cria névoa que apaga memórias recentes dos alvos." },
    { nome: "Palavra de Poder", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 criatura", duracao: "Instantâneo", custoPe: 3, descricao: "Pronuncia palavra arcana que perturba a mente." },
    { nome: "Pulso de Energia", elemento: "Energia", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "Área", duracao: "Instantâneo", custoPe: 4, descricao: "Emite pulso de energia que afeta todos na área." },
    { nome: "Invocar Morto", elemento: "Morte", circulo: 3, execucao: "1 hora", alcance: "Toque", alvo: "Cadáver", duracao: "Cena", custoPe: 6, descricao: "Anima um cadáver para servir ao ocultista." },
  ]);

  await db.insert(itensTable).values([
    { nome: "Pistola 9mm", tipo: "Arma", descricao: "Pistola semiautomática padrão.", espacos: 1, categoria: "Arma de Fogo", preco: 1500 },
    { nome: "Colete Balístico", tipo: "Protecao", descricao: "Proteção contra projéteis.", espacos: 2, categoria: "Armadura", preco: 800 },
    { nome: "Kit Médico", tipo: "Utilitario", descricao: "Fornece 1d6+2 PV ao usar. Uso único.", espacos: 1, categoria: "Consumível", preco: 200 },
    { nome: "Lanterna Tática", tipo: "Utilitario", descricao: "Ilumina até 20 metros.", espacos: 1, categoria: "Equipamento", preco: 80 },
    { nome: "Diário Ocultista", tipo: "Utilitario", descricao: "+1 Ocultismo em testes.", espacos: 0.5, categoria: "Livro", preco: 500 },
    { nome: "Faca de Caça", tipo: "Arma", descricao: "Arma branca versátil.", espacos: 0.5, categoria: "Arma Corpo a Corpo", preco: 150 },
    { nome: "Algemas", tipo: "Utilitario", descricao: "Imobiliza alvo até CD 20 de Atletismo.", espacos: 0.5, categoria: "Equipamento", preco: 50 },
    { nome: "Câmera Digital", tipo: "Utilitario", descricao: "Registra evidências paranormais.", espacos: 1, categoria: "Eletrônico", preco: 600 },
    { nome: "Sal Purificado", tipo: "Utilitario", descricao: "Cria barreira contra entidades de 3m.", espacos: 0.5, categoria: "Consumível", preco: 30 },
  ]);

  console.log("==> Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
