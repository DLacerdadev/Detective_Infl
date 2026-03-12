import { db } from "./index";
import { classesTable, origensTable, periciasTable, trilhasTable, rituaisTable } from "./schema/game";
import { count, eq } from "drizzle-orm";
import { readFileSync } from "fs";
import { join } from "path";

async function seedRituais() {
  console.log("==> Seeding rituais...");
  const jsonPath = join(__dirname, "data", "rituais.json");
  const { rituais } = JSON.parse(readFileSync(jsonPath, "utf8"));
  const rows = rituais.map((r: Record<string, unknown>) => ({
    nome: r.nome as string,
    elemento: r.elemento as string,
    circulo: r.circulo as number,
    execucao: (r.execucao as string) || null,
    alcance: (r.alcance as string) || null,
    alvo: ((r.alvo || r.alvos || r.area) as string) || null,
    duracao: (r.duracao as string) || null,
    resistencia: (r.resistencia as string) || null,
    custoPe: 0,
    descricao: (r.efeito as string) || null,
    discente: (r.discente as string) || null,
    verdadeiro: (r.verdadeiro as string) || null,
    fonte: (r.fonte as string) || "Livro Base",
  }));
  await db.insert(rituaisTable).values(rows);
  console.log(`==> ${rows.length} rituais seeded.`);
}

async function _noop() {
  void db; // placeholder — rituais seeded via JSON in seedRituais()
  await db.insert(rituaisTable).values([
    { nome: "---_REMOVED_---", elemento: "Sangue", circulo: 1, custoPe: 0 },
    { nome: "Arma Atroz", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Toque", alvo: "1 arma corpo a corpo", duracao: "Sustentada", resistencia: "Nenhuma", custoPe: 0, descricao: "A arma fornece +2 em testes de ataque e +1 na margem de ameaça.", discente: "+2 PE: Bônus de ataque aumenta para +5. Requer 2º círculo.", verdadeiro: "+5 PE: Bônus de ataque +5, +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Armadura de Sangue", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Fornece +5 na Defesa. Cumulativo com outros rituais, mas não com equipamentos.", discente: "+5 PE: Bônus +10 na Defesa e RD 5 contra balístico, corte, impacto e perfuração. Requer 3º círculo.", verdadeiro: "+9 PE: Bônus +15 na Defesa e RD 10 contra os mesmos danos. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Corpo Adaptado", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Toque", alvo: "1 pessoa ou animal", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo fica imune a calor/frio extremos, pode respirar na água/fumaça densa.", discente: "+2 PE: Duração aumenta para 1 dia.", verdadeiro: "+5 PE: Alcance curto, alvos escolhidos.", fonte: "Livro Base" },
    { nome: "Distorcer Aparência", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Vontade desacredita", custoPe: 0, descricao: "Modifica aparência (+10 em Enganação para disfarce). Não altera estatísticas.", discente: "+2 PE: Alcance curto, alvo 1 ser. Involuntário tem teste de Vontade.", verdadeiro: "+5 PE: Alvos escolhidos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Esfolar", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Causa 3d4+3 de dano de corte e sangramento. Sucesso reduz dano à metade e evita sangramento.", discente: "+2 PE: Alcance médio, dano 5d4+5, alvo explosão 6m. Requer 2º círculo.", verdadeiro: "+5 PE: Alcance longo, dano 10d4+10, alvo explosão 6m. Resistência não evita sangramento. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Fortalecimento Sensorial", elemento: "Sangue", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Recebe +O em Investigação, Luta, Percepção e Pontaria.", discente: "+2 PE: Inimigos sofrem -O em ataques contra você. Requer 2º círculo.", verdadeiro: "+5 PE: Imune a surpreendido/desprevenido, +10 Defesa/Reflexos. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Cicatrização", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo recupera 3d8+3 PV, mas envelhece 1 ano.", discente: "+2 PE: Recupera 5d8+5 PV. Requer 2º círculo.", verdadeiro: "+9 PE: Alcance curto, alvos escolhidos, recupera 7d8+7 PV. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Consumir Manancial", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Recebe 2d6+2 PV temporários.", discente: "+2 PE: Recebe 4d6+4 PV temporários. Requer 2º círculo.", verdadeiro: "+5 PE: Alvos escolhidos em alcance curto recebem 4d6+4 PV temporários. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Decadência", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Instantânea", resistencia: "Fortitude reduz à metade", custoPe: 0, descricao: "Causa 2d8+2 de dano de Morte.", discente: "+2 PE: Resistência nenhuma, dano 3d8+3. Executa ataque corpo a corpo somando dano da arma.", verdadeiro: "+5 PE: Alcance pessoal, explosão 6m, dano 8d8+8. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Definhar", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Alvo fica fatigado. Sucesso deixa-o vulnerável.", discente: "+2 PE: Alvo fica exausto (ou fatigado se passar). Requer 2º círculo.", verdadeiro: "+5 PE: Até 5 seres. Requer 3º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Espirais da Perdição", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Alvo sofre -O em testes de ataque. Sucesso anula.", discente: "+2 PE: Penalidade -OO. Requer 2º círculo.", verdadeiro: "+8 PE: Penalidade -OO, alvos escolhidos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Apagar as Luzes", elemento: "Morte", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Apaga luzes em alcance curto e concede visão no escuro até o fim da cena.", discente: "+2 PE: Alcance longo. Requer 2º círculo.", verdadeiro: "+5 PE: Até 5 aliados também recebem visão no escuro. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Compreensão Paranormal", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Toque", alvo: "1 ser ou objeto", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Entende idiomas humanos escritos ou falados, ou sentimentos básicos de animais.", discente: "+2 PE: Alcance curto, alvos escolhidos. Requer 2º círculo.", verdadeiro: "+5 PE: Alcance pessoal, alvo você. Pode falar/escrever qualquer idioma humano. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Enfeitiçar", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 pessoa", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Alvo fica prestativo (+10 em Diplomacia). Hostilidade anula efeito.", discente: "+2 PE: Sugere uma ação aceitável que o alvo obedece. Requer 2º círculo.", verdadeiro: "+5 PE: Afeta todos os alvos no alcance. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Ouvir os Sussurros", elemento: "Conhecimento", circulo: 1, execucao: "Completa", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Pergunta Sim/Não sobre evento na mesma cena (chance de falha 1 em 1d6).", discente: "+2 PE: Execução 1 min. Pergunta sobre evento até 1 dia no futuro. Requer 2º círculo.", verdadeiro: "+5 PE: Execução 10 min, duração 5 rodadas. 1 pergunta/rodada (Sim/Não/Ninguém sabe). Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Perturbação", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 pessoa", duracao: "1 rodada", resistencia: "Vontade anula", custoPe: 0, descricao: "Dá ordem (Fuja, Largue, Pare, Sente-se, Venha) que o alvo obedece.", discente: "+2 PE: Alvo 1 ser. Adiciona comando 'Sofra' (3d8 dano Conhecimento + abalado).", verdadeiro: "+5 PE: Até 5 seres OU comando 'Ataque'. Requer 3º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Terceiro Olho", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Enxerga auras paranormais em alcance longo (elemento e poder aproximado).", discente: "+2 PE: Duração 1 dia.", verdadeiro: "+5 PE: Enxerga objetos/seres invisíveis. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Desfazer Sinapses", elemento: "Conhecimento", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Instantânea", resistencia: "Vontade parcial", custoPe: 0, descricao: "Causa 2d6+2 de dano de Conhecimento e frustração. Sucesso reduz dano e evita condição.", discente: "+2 PE: Alcance médio, dano 3d6+3, até 5 seres. Requer 2º círculo.", verdadeiro: "+5 PE: Dano 6d6+6, até 10 seres, condição esmorecido. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Coincidência Forçada", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo recebe +2 em testes de perícias.", discente: "+2 PE: Aliados escolhidos. Requer 2º círculo.", verdadeiro: "+5 PE: Aliados escolhidos, bônus +5. Requer 3º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Eletrocussão", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser ou objeto", duracao: "Instantânea", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Causa 3d6 de dano de eletricidade e vulnerabilidade. Dobro de dano em eletrônicos.", discente: "+2 PE: Área linha 30m, dano 6d6. Requer 2º círculo.", verdadeiro: "+5 PE: Alvos escolhidos, dispara relâmpagos (8d6 cada). Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Embaralhar", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria 3 cópias ilusórias (+6 Defesa). Cada erro destrói uma cópia (-2 Defesa).", discente: "+2 PE: 5 cópias (+10 Defesa). Requer 2º círculo.", verdadeiro: "+5 PE: 8 cópias (+16 Defesa). Cópia destruída emite clarão (ofuscado). Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Polarização Caótica", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "Você", duracao: "Sustentada", resistencia: "Vontade anula", custoPe: 0, descricao: "Atrair (puxar objeto metal espaço 2) ou Repelir (RD 5 contra projéteis/arremesso).", discente: "+2 PE: Duração instantânea. Arremessa até 10 objetos (dano impacto/espaço).", verdadeiro: "+5 PE: Alcance médio, duração instantânea. Move ser/objeto espaço 10 por 9m.", fonte: "Livro Base" },
    { nome: "Overclock", elemento: "Energia", circulo: 1, execucao: "Reação", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Reação quando surpreendido ou sofrer ataque furtivo: age normalmente nessa rodada.", discente: "+3 PE: Adiciona +5 na Defesa até o início do próximo turno. Requer 2º círculo.", verdadeiro: "+5 PE: Alcance curto, alvos escolhidos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Pulsar", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você (área)", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Explosão 3m de raio centrada em você, causa 2d6 de dano de energia. Inclui aliados.", discente: "+3 PE: Raio aumenta para 6m, dano 4d6. Requer 2º círculo.", verdadeiro: "+5 PE: Raio 9m, dano 8d6, não afeta aliados. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Voltaica", elemento: "Energia", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Sustentada", resistencia: "Nenhuma", custoPe: 0, descricao: "Vincula você ao alvo. Dano que você sofreria é dividido entre você e o alvo (50/50).", discente: "+2 PE: Alvo não tem direito a resistência. Requer 2º círculo.", verdadeiro: "+5 PE: Até 3 alvos vinculados. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Cinerária", elemento: "Medo", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "Nuvem 6m raio", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Rituais na área têm DT +5.", discente: "+3 PE: DT +10. Requer 2º círculo.", verdadeiro: "+5 PE: DT +10 e custo em PE dobra. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Mau-Olhado", elemento: "Medo", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Alvo fica amedrontado (ou abalado se passar na resistência).", discente: "+2 PE: Alvo fica apavorado. Requer 2º círculo.", verdadeiro: "+5 PE: Até 5 seres, apavorado. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Presságio", elemento: "Medo", circulo: 1, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Alvo fica abalado e com -2 em testes de ataque e perícias.", discente: "+2 PE: Penalidade -5. Requer 2º círculo.", verdadeiro: "+5 PE: Até 5 seres, penalidade -5. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Sombra Protetora", elemento: "Medo", circulo: 1, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Você e aliados adjacentes ficam amedrontados pelos inimigos a sua escolha (eles sofrem penalidade -2 em ataques contra você e aliados).", discente: "+2 PE: Alcance curto, aliados escolhidos. Requer 2º círculo.", verdadeiro: "+5 PE: Inimigos ficam apavorados. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Agonia", elemento: "Sangue", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Alvo fica em agonia (ação padrão = move, move = padrão; -2 em testes). Sucesso deixa fatigado.", discente: "+2 PE: Também fica abalado.", verdadeiro: "+5 PE: Até 5 seres, agonia e abalado. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Carne Nova", elemento: "Sangue", circulo: 2, execucao: "1 min", alcance: "Toque", alvo: "1 ser", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Regenera tecido perdido (dedos, mão). Não regenera órgãos vitais.", discente: "+5 PE: Regenera membro (braço, perna). Requer 3º círculo.", verdadeiro: "+15 PE: Regenera órgão vital. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Contaminação", elemento: "Sangue", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Permanente (cura)", resistencia: "Fortitude anula", custoPe: 0, descricao: "Transmite uma doença ao alvo (mesmo que você tenha).", discente: "+2 PE: Cria doença fictícia com efeitos à sua escolha.", verdadeiro: "+5 PE: Alcance curto, alvos escolhidos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Membros Elásticos", elemento: "Sangue", circulo: 2, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alcance de ataques aumenta em 3m. Pode se espremer por espaços estreitos.", discente: "+2 PE: Alcance +6m, garras causam 2d6+mod dano.", verdadeiro: "+5 PE: Alcance +9m, garras 4d6+mod. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Movimento Paranormal", elemento: "Sangue", circulo: 2, execucao: "Movimento", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Teleporta até 9m para espaço que possa ver.", discente: "+2 PE: Até 18m.", verdadeiro: "+5 PE: Alcance curto, alvos escolhidos também teleportam. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Personalidade Falsa", elemento: "Sangue", circulo: 2, execucao: "1 hora", alcance: "Toque", alvo: "1 ser", duracao: "Permanente (tratamento)", resistencia: "Vontade anula", custoPe: 0, descricao: "Implanta personalidade temporária no alvo que vai emergindo ao longo de dias.", discente: "+5 PE: Personalidade emerge imediatamente. Requer 3º círculo.", verdadeiro: "+10 PE: Personalidade é permanente. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Vampirismo", elemento: "Sangue", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 ser vivo", duracao: "Instantânea", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Drena 3d8+3 PV do alvo e recupera metade para você.", discente: "+3 PE: Drena 6d8+6 PV. Requer 3º círculo.", verdadeiro: "+5 PE: Alcance curto, até 3 alvos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Virar Fera", elemento: "Sangue", circulo: 2, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma em animal (lobo, urso, etc). Atributos físicos mudam, mantém mental. Ganha ataque natural.", discente: "+2 PE: Pode manter forma e usar armas.", verdadeiro: "+5 PE: Transforma aliados. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Banir", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 entidade", duracao: "Instantânea", resistencia: "Vontade anula", custoPe: 0, descricao: "Entidade do Outro Lado é banida de volta. Se falhar, fica abalada.", discente: "+2 PE: DT aumenta +5. Requer 3º círculo.", verdadeiro: "+5 PE: Até 5 entidades. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Controlar Morto-Vivo", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 morto-vivo", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Assume controle de morto-vivo com NEX menor que o seu.", discente: "+3 PE: Alcance médio, até 3 mortos-vivos. Requer 3º círculo.", verdadeiro: "+5 PE: Sem limite de NEX do alvo. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Criar Morto-Vivo", elemento: "Morte", circulo: 2, execucao: "1 hora", alcance: "Toque", alvo: "Cadáver", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Anima cadáver como zumbi ou esqueleto sob seu controle.", discente: "+2 PE: Cria criatura mais poderosa. Requer 3º círculo.", verdadeiro: "+5 PE: Cria até 3 mortos-vivos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Dreno de Vida", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Instantânea", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Causa 4d6+4 dano de Morte e alvo fica fatigado.", discente: "+3 PE: Dano 6d6+6 e exausto. Requer 3º círculo.", verdadeiro: "+5 PE: Alcance médio, dano 10d6+10. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Espírito Guardião", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "Área 9m raio", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Invoca espíritos que atacam seres não-mortos-vivos na área (1d6 por rodada).", discente: "+3 PE: Dano 2d6. Requer 3º círculo.", verdadeiro: "+5 PE: Dano 4d6, seres vivos intrusos ficam abalados. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Invocar Morto-Vivo", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "Área", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Invoca 1d4 zumbis ou esqueletos para lutar ao seu lado.", discente: "+3 PE: Invoca criatura mais poderosa. Requer 3º círculo.", verdadeiro: "+5 PE: Invoca 3d4 mortos-vivos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Membrana Necrótica", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo recebe RD 5 contra todos os tipos de dano físico.", discente: "+3 PE: RD 10. Requer 3º círculo.", verdadeiro: "+5 PE: Alcance curto, alvos escolhidos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Visão do Morto", elemento: "Morte", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "Cadáver", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Vê os últimos momentos vividos pelo morto (DT 15 ou confuso por 1 rodada).", discente: "+3 PE: Faz perguntas ao espírito (3 perguntas Sim/Não). Requer 3º círculo.", verdadeiro: "+5 PE: Conversa plena com espírito. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Necropsia Paranormal", elemento: "Morte", circulo: 2, execucao: "1 min", alcance: "Toque", alvo: "Cadáver", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Determina causa da morte, hora, presença de magia ou veneno. +10 em Medicina.", discente: "+3 PE: Também obtém memórias do morto nas últimas 24h.", verdadeiro: "+5 PE: Memórias do último mês. Requer 3º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Alucinação", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Cria ilusão perfeita apenas para o alvo. Alvo age como se fosse real.", discente: "+3 PE: Até 5 alvos. Requer 3º círculo.", verdadeiro: "+5 PE: Ilusão em área 9m raio afeta todos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Ler Pensamentos", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Ouve pensamentos superficiais do alvo (+10 Intuição contra ele).", discente: "+3 PE: Lê pensamentos profundos (segredos, memórias). Requer 3º círculo.", verdadeiro: "+5 PE: Até 5 alvos, acesso a toda memória acessível. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Manipular Memória", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Apaga ou modifica memória de até 1 hora do alvo.", discente: "+3 PE: Memória de até 1 dia.", verdadeiro: "+5 PE: Memória de até 1 semana ou implanta memória falsa. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Névoa Mental", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "Área cubo 6m", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Seres na área ficam confusos (ou abalados se passarem). Afeta aliados.", discente: "+3 PE: Área cubo 9m. Requer 3º círculo.", verdadeiro: "+5 PE: Área cubo 12m, não afeta aliados. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Projeção Astral", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Projeta consciência em alcance médio. Corpo fica inconsciente. Pode usar perícias.", discente: "+3 PE: Alcance longo.", verdadeiro: "+5 PE: Projeta aliados também. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Sonho Lúcido", elemento: "Conhecimento", circulo: 2, execucao: "8 horas", alcance: "Pessoal", alvo: "Você", duracao: "Especial", resistencia: "Nenhuma", custoPe: 0, descricao: "Entra em sonho de ser próximo (alcance 30m). Pode influenciar sonho.", discente: "+3 PE: Pode extrair informação específica.", verdadeiro: "+5 PE: Dois seres simultaneamente.", fonte: "Livro Base" },
    { nome: "Sugestão", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "1 dia", resistencia: "Vontade anula", custoPe: 0, descricao: "Implanta sugestão razoável que o alvo seguirá na próxima oportunidade.", discente: "+3 PE: Duração 1 semana.", verdadeiro: "+5 PE: Até 5 seres, duração 1 semana. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Transferência de Culpa", elemento: "Conhecimento", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "2 seres", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Troca as memórias recentes de dois alvos (último 1 hora).", discente: "+3 PE: Troca memórias do último dia.", verdadeiro: "+5 PE: Troca de identidades completas por 1 dia. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Âncora Cinética", elemento: "Energia", circulo: 2, execucao: "Reação", alcance: "Curto", alvo: "1 ser ou objeto", duracao: "Instantânea", resistencia: "Fortitude anula", custoPe: 0, descricao: "Reação: alvo perde movimento restante e fica lento até o próximo turno.", discente: "+3 PE: Também fica lento na próxima rodada.", verdadeiro: "+5 PE: Até 3 alvos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Barreira", elemento: "Energia", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "Área parede 6x3m", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria parede de energia (RD 15, PV 40). Bloqueia passagem e visão.", discente: "+3 PE: Parede 9x6m, PV 80.", verdadeiro: "+5 PE: Parede 12x9m, PV 120, RD 20. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Descarga Paranormal", elemento: "Energia", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Dispara raio de energia causando 5d8+5 dano de energia.", discente: "+3 PE: Dano 8d8+8.", verdadeiro: "+5 PE: Dano 12d8+12, área linha 30m. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Escudo Paranormal", elemento: "Energia", circulo: 2, execucao: "Reação", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Reação contra ataque: nega completamente o dano de 1 ataque.", discente: "+3 PE: Nega dano de área também.", verdadeiro: "+5 PE: Redireciona o dano ao atacante. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Hiperaceleração", elemento: "Energia", circulo: 2, execucao: "Movimento", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Velocidade dobra e ganha +5 Reflexos.", discente: "+3 PE: Também ganha ação adicional de movimento.", verdadeiro: "+5 PE: Alcance curto, aliados escolhidos. Requer 3º círculo.", fonte: "Livro Base" },
    { nome: "Levitação", elemento: "Energia", circulo: 2, execucao: "Padrão", alcance: "Curto", alvo: "1 ser ou objeto", duracao: "Cena", resistencia: "Vontade anula (involuntário)", custoPe: 0, descricao: "Alvo pode flutuar (velocidade 6m, vertical/horizontal).", discente: "+3 PE: Até 3 alvos. Requer 3º círculo.", verdadeiro: "+5 PE: Velocidade 12m, altitude ilimitada. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Teletransporte", elemento: "Energia", circulo: 2, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Teleporta para local conhecido a até 1km.", discente: "+5 PE: Alcance ilimitado (desde que conheça o local).", verdadeiro: "+10 PE: Aliados escolhidos teleportam junto. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Chama Negra", elemento: "Medo", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 6m", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Causa 5d6 dano de Medo. Seres afetados ficam abalados.", discente: "+3 PE: Dano 8d6, apavorados.", verdadeiro: "+5 PE: Área 9m, dano 12d6, apavorados. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Figura do Medo", elemento: "Medo", circulo: 2, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Assume forma do maior medo do alvo. Ele fica apavorado.", discente: "+3 PE: Até 3 alvos.", verdadeiro: "+5 PE: Afeta todos em alcance médio. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Pesadelo", elemento: "Medo", circulo: 2, execucao: "8 horas", alcance: "Longo", alvo: "1 ser", duracao: "Especial", resistencia: "Vontade parcial", custoPe: 0, descricao: "Alvo sofre pesadelo (acorda exausto e perde benefícios do descanso). Sucesso fica fatigado.", discente: "+3 PE: Dano psíquico 3d6 ao acordar.", verdadeiro: "+5 PE: Até 5 seres, dano 5d6. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Toque do Pânico", elemento: "Medo", circulo: 2, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Alvo fica apavorado. Sucesso: amedrontado.", discente: "+3 PE: Alcance curto, sem resistência. Requer 3º círculo.", verdadeiro: "+5 PE: Alcance médio, até 5 seres, apavorados. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Carne de Ferro", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "RD 10 contra todos os tipos de dano físico.", discente: "+5 PE: RD 15, incluindo dano energético.", verdadeiro: "+9 PE: RD 20 contra todos os tipos. Requer 4º círculo e afinidade.", fonte: "Livro Base" },
    { nome: "Endurecer Pele", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo recebe +5 na Defesa e RD 5 contra dano físico.", discente: "+3 PE: RD 10.", verdadeiro: "+5 PE: Alcance curto, aliados escolhidos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Espinhos de Sangue", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Espinhos em seu corpo causam 2d8+2 dano a quem o atacar corpo-a-corpo.", discente: "+3 PE: Dano 4d8+4.", verdadeiro: "+5 PE: Espinhos em alcance 3m (explosão dano/rodada). Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Golpe Vital", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Instantânea", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Toque canaliza energia vital: causa 8d6+8 dano de Sangue.", discente: "+3 PE: Dano 12d6+12.", verdadeiro: "+5 PE: Alvos escolhidos em alcance curto. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Metamorfose", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma em qualquer forma humanóide (copia aparência e estatísticas físicas).", discente: "+5 PE: Transforma em qualquer criatura até tamanho Grande.", verdadeiro: "+9 PE: Mantém suas estatísticas, ganha habilidades físicas da forma. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Regeneração", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Toque", alvo: "1 ser", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Alvo regenera 5 PV por rodada e cura condições físicas.", discente: "+3 PE: Regenera 10 PV/rodada.", verdadeiro: "+5 PE: Alcance curto, aliados escolhidos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Sangue Venenoso", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Fortitude anula", custoPe: 0, descricao: "Seu sangue torna-se veneno. Qualquer ataque corpo-a-corpo que você receba aplica veneno ao atacante (Fortitude DT ou fatigado).", discente: "+3 PE: Veneno exaustão.", verdadeiro: "+5 PE: Veneno envenenado (dano repetido). Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Senhor das Bestas", elemento: "Sangue", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "1 animal ou criatura", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Controla animal ou criatura abaixo da sua INT.", discente: "+3 PE: Controla criatura inteligente.", verdadeiro: "+5 PE: Até 5 criaturas. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Amaldiçoar", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Permanente (remoção)", resistencia: "Vontade parcial", custoPe: 0, descricao: "Aplica maldição personalizada. Sucesso: -2 em todos os testes.", discente: "+3 PE: -5 em todos os testes.", verdadeiro: "+5 PE: Até 5 seres, sem direito a resistência. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Ceifar", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Instantânea", resistencia: "Fortitude reduz à metade", custoPe: 0, descricao: "Causa 10d10+10 dano de Morte.", discente: "+5 PE: Dano 15d10+15.", verdadeiro: "+9 PE: Área explosão 9m, dano 15d10+15. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Desintegração Necrótica", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "1 ser ou objeto", duracao: "Instantânea", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Causa 8d12+8 dano de Morte. Se reduzir a 0 PV, o ser é desintegrado.", discente: "+5 PE: Dano 12d12+12.", verdadeiro: "+9 PE: Área linha 30m. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Dominar Morto-Vivo", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Todos mortos-vivos", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Todos os mortos-vivos na área ficam sob seu controle.", discente: "+3 PE: Mortos-vivos ganham +2 nas rolagens.", verdadeiro: "+5 PE: Mortos-vivos recebem seus poderes. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Fantasma", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Torna-se incorpóreo. Pode atravessar objetos sólidos. Imune a dano físico não-paranormal.", discente: "+3 PE: Aliados próximos também ficam incorpóreos.", verdadeiro: "+5 PE: Ataque seu causa dano a seres vivos mesmo sendo incorpóreo. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Ligar", elemento: "Morte", circulo: 3, execucao: "1 min", alcance: "Toque", alvo: "1 ser ou objeto", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Liga espírito a local ou objeto (criando fantasma ou objeto assombrado).", discente: "+3 PE: Liga espírito a ser vivo.", verdadeiro: "+5 PE: Cria entidade completamente nova e controlável. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Plague", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 9m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Área infestada de energia necrótica. Seres vivos sofrem 3d6/rodada dano Morte (ou 1d6 se passarem).", discente: "+3 PE: Dano 5d6/rodada.", verdadeiro: "+5 PE: Área explosão 15m, dano 8d6/rodada. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Ressuscitar", elemento: "Morte", circulo: 3, execucao: "10 min", alcance: "Toque", alvo: "Ser morto há até 1 dia", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Revive ser morto com 1 PV. Penalidades de morte (Fortitude -1 permanente por uso).", discente: "+5 PE: Requer 4º círculo para reviver morto há 1 semana.", verdadeiro: null, fonte: "Livro Base" },
    { nome: "Voo do Corvo", elemento: "Morte", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma em corvo gigante (velocidade voo 18m). Mantém estatísticas, ganha ataque de bico.", discente: "+3 PE: Pode carregar 1 aliado.", verdadeiro: "+5 PE: Transforma aliados em corvos. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Clarividência", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Longo", alvo: "Local conhecido", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Projeta sentidos a local conhecido (vê e ouve tudo lá).", discente: "+3 PE: Pode agir através da projeção.", verdadeiro: "+5 PE: Alcance ilimitado para locais que visitou. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Dominar", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Curto", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Controla completamente o ser. Ordens complexas são obedecidas.", discente: "+3 PE: Duração 1 dia.", verdadeiro: "+5 PE: Duração permanente (até ser removido). Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Ilusão Perfeita", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Longo", alvo: "Área cubo 9m", duracao: "Cena", resistencia: "Vontade desacredita", custoPe: 0, descricao: "Cria ilusão completa com todos os sentidos (visão, som, cheiro, toque).", discente: "+3 PE: Duração 1 dia.", verdadeiro: "+5 PE: Área cubo 18m, duração permanente. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Premonição", elemento: "Conhecimento", circulo: 3, execucao: "Completa", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Vê possível futuro próximo (até 1 hora). Pode escolher evitar 1 evento.", discente: "+3 PE: Visão até 1 dia no futuro.", verdadeiro: "+5 PE: Visão até 1 semana, pode alterar 3 eventos. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Psicometria", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Toque", alvo: "1 objeto", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Obtém impressões do objeto (dono, último uso, local de origem).", discente: "+3 PE: Visão completa de cenas com o objeto.", verdadeiro: "+5 PE: Conhecimento completo da história do objeto. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Simulacro", elemento: "Conhecimento", circulo: 3, execucao: "1 hora", alcance: "Toque", alvo: "1 ser", duracao: "Permanente (destruição)", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria cópia física perfeita de ser. A cópia tem metade dos PV mas estatísticas iguais.", discente: "+5 PE: Cópia tem PV completo.", verdadeiro: "+9 PE: Cópia possui memórias completas. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Telepatia", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Comunicação mental bidirecional. Pode usar perícias mentais como se estivesse presente.", discente: "+3 PE: Alcance ilimitado (desde que conheça o ser).", verdadeiro: "+5 PE: Até 5 seres simultaneamente. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Tempestade de Neurônios", elemento: "Conhecimento", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 9m", duracao: "Instantânea", resistencia: "Vontade parcial", custoPe: 0, descricao: "Causa 8d8+8 dano de Conhecimento e atordoado. Sucesso: metade dano e confuso.", discente: "+3 PE: Dano 12d8+12.", verdadeiro: "+5 PE: Área explosão 15m, dano 16d8+16. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Buraco Negro", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Longo", alvo: "Área explosão 9m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Cria vórtice que puxa todos em 9m em direção ao centro (6d6 dano/rodada). Sucesso: metade dano.", discente: "+3 PE: Raio 12m, dano 9d6.", verdadeiro: "+5 PE: Raio 15m, dano 12d6, imobiliza. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Colisão Temporal", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área linha 30m ou 1 ser", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Disparo de energia acelera tempo local causando 10d10+10 dano de energia.", discente: "+3 PE: Dano 15d10+15.", verdadeiro: "+5 PE: Área explosão 9m, dano 20d10+20. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Dimensão Pessoal", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Entra em dimensão pessoal. Pode observar plano material sem ser visto.", discente: "+3 PE: Pode levar até 5 aliados.", verdadeiro: "+5 PE: Pode atacar do plano dimensional sem deixar. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Espelho Paranormal", elemento: "Energia", circulo: 3, execucao: "Reação", alcance: "Pessoal", alvo: "Você", duracao: "Instantânea", resistencia: "Nenhuma", custoPe: 0, descricao: "Reação contra ritual: reflete o ritual de volta ao lançador.", discente: "+3 PE: Reflete qualquer efeito paranormal.", verdadeiro: "+5 PE: Pode redirecionar para alvo à escolha. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Nova Paranormal", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 9m", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Explosão de energia pura causando 10d8+10 dano.", discente: "+3 PE: Dano 15d8+15.", verdadeiro: "+5 PE: Área explosão 15m, dano 20d8+20. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Rasgão Dimensional", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área linha 30m", duracao: "Cena", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Abre fenda dimensional causando 6d8+6 dano contínuo. Persiste e causa dano a quem cruzar.", discente: "+3 PE: Dano 10d8+10.", verdadeiro: "+5 PE: Área explosão 9m, dano 15d8+15. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Singularidade", elemento: "Energia", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 6m", duracao: "Cena", resistencia: "Fortitude anula", custoPe: 0, descricao: "Cria singularidade que comprime seres: apanhados são imobilizados e sofrem 4d6/rodada.", discente: "+3 PE: Dano 8d6/rodada.", verdadeiro: "+5 PE: Área explosão 9m, dano 12d6/rodada. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Âncora do Medo", elemento: "Medo", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "Área explosão 9m", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Seres na área ficam paralisados pelo medo (ou amedrontados se passarem).", discente: "+3 PE: Apavorados ao invés de amedrontados.", verdadeiro: "+5 PE: Área explosão 15m, sem resistência para medo. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Encarnar o Medo", elemento: "Medo", circulo: 3, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma em entidade de medo puro (+10 em todos os testes de Intimidação, aura de medo 9m).", discente: "+3 PE: Aura causa apavorado ao invés de amedrontado.", verdadeiro: "+5 PE: Imune a dano não-paranormal. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Morte por Susto", elemento: "Medo", circulo: 3, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Instantânea", resistencia: "Vontade anula", custoPe: 0, descricao: "Se falhar, o ser morre de parada cardíaca. Imunidade a medo anula.", discente: null, verdadeiro: "+9 PE: Até 3 seres. Requer 4º círculo.", fonte: "Livro Base" },
    { nome: "Presença Aterrorizante", elemento: "Medo", circulo: 3, execucao: "Livre", alcance: "Curto", alvo: "Todos seres na área", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Aura ativa: seres na área ficam amedrontados (ou abalados se passarem).", discente: "+3 PE: Apavorados ao invés de amedrontados.", verdadeiro: "+5 PE: Alcance médio, sem penalidade de falha. Requer 4º círculo.", fonte: "Sobrevivendo ao Horror" },
    { nome: "Amplificar", elemento: "Sangue", circulo: 4, execucao: "Livre", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Ao lançar ritual de Sangue, pode aumentar todos os valores numéricos em 50% (dano, bônus, alcance).", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Apocalipse de Carne", elemento: "Sangue", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Transforma todo ser vivo na área (amigo e inimigo). Causa 20d6+20 dano de Sangue.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Artefato de Sangue", elemento: "Sangue", circulo: 4, execucao: "8 horas", alcance: "Toque", alvo: "1 objeto", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria artefato paranormal com efeito equivalente a ritual de 1º-3º círculo.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Desafio de Sangue", elemento: "Sangue", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Cena", resistencia: "Fortitude anula", custoPe: 0, descricao: "Conecta você e o alvo. Todo dano que um sofrer, o outro também sofre.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Exército de Carne", elemento: "Sangue", circulo: 4, execucao: "Completa", alcance: "Médio", alvo: "Até 10 seres mortos", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Anima até 10 cadáveres como mortos-vivos poderosos sob controle absoluto.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Forma Verdadeira", elemento: "Sangue", circulo: 4, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma em criatura horrível de máximo poder. Todas as suas estatísticas físicas triplicam. Ganha ataques naturais devastadores.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Perfeição Paranormal", elemento: "Sangue", circulo: 4, execucao: "Padrão", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Atributos físicos (FOR, AGI, VIG) aumentam para 5. Ganha imunidade a condições negativas físicas.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Sangue Primordial", elemento: "Sangue", circulo: 4, execucao: "Completa", alcance: "Médio", alvo: "Área explosão 15m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Inunda área com sangue primordial. Causa 15d8+15 dano e transforma seres em criaturas primitivas.", discente: null, verdadeiro: null, fonte: "Sobrevivendo ao Horror" },
    { nome: "Apocalipse dos Mortos", elemento: "Morte", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Invoca onda de energia negrótica. Causa 25d6+25 dano de Morte a todos na área.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Artefato Necrótico", elemento: "Morte", circulo: 4, execucao: "8 horas", alcance: "Toque", alvo: "1 objeto", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria artefato necrótico com efeito equivalente a ritual de Morte de 1º-3º círculo.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Ceifador", elemento: "Morte", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Instantânea", resistencia: "Fortitude anula", custoPe: 0, descricao: "Mata imediatamente o alvo (0 PV e efeito de morte garantido). Imunidades à morte anulam.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Criar Lich", elemento: "Morte", circulo: 4, execucao: "1 semana", alcance: "Toque", alvo: "Você", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Transforma a si mesmo em lich (morto-vivo inteligente poderoso). Imortal enquanto phylactéry existir.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Exercito dos Mortos", elemento: "Morte", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Todos mortos na área 30m", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Levanta todos os mortos em alcance longo como legião de mortos-vivos.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Maldição Suprema", elemento: "Morte", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Aplica maldição devastadora: -10 em todos os testes, lento permanente.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Plague Lord", elemento: "Morte", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Libera praga necrótica: 10d6 dano/rodada. Mortos na área se levantam como mortos-vivos.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Roubar Alma", elemento: "Morte", circulo: 4, execucao: "Padrão", alcance: "Médio", alvo: "1 ser", duracao: "Permanente (ritual)", resistencia: "Vontade anula", custoPe: 0, descricao: "Extrai alma do alvo (que morre automaticamente). Alma pode ser aprisionada em objeto.", discente: null, verdadeiro: null, fonte: "Sobrevivendo ao Horror" },
    { nome: "Artefato Mental", elemento: "Conhecimento", circulo: 4, execucao: "8 horas", alcance: "Toque", alvo: "1 objeto", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria artefato mental com efeito equivalente a ritual de Conhecimento de 1º-3º círculo.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Conhecimento Absoluto", elemento: "Conhecimento", circulo: 4, execucao: "Completa", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Acessa conhecimento de qualquer criatura em alcance longo. Sabe tudo que qualquer ser na área sabe.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Controle Mental Supremo", elemento: "Conhecimento", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "Até 10 seres", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Controla permanentemente até 10 seres simultaneamente.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Fusão Mental", elemento: "Conhecimento", circulo: 4, execucao: "Padrão", alcance: "Toque", alvo: "2 seres consentidos", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Dois seres compartilham consciência e habilidades completamente.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Hive Mind", elemento: "Conhecimento", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "Até 20 seres", duracao: "Cena", resistencia: "Vontade anula", custoPe: 0, descricao: "Liga mentes de todos os alvos. Compartilham sentidos, pensamentos e ações.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Memória Universal", elemento: "Conhecimento", circulo: 4, execucao: "Completa", alcance: "Pessoal", alvo: "Você", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Acessa a memória coletiva de todos os seres que já usaram este ritual. Conhecimento total.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Reescrever Realidade", elemento: "Conhecimento", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Permanente", resistencia: "Vontade anula", custoPe: 0, descricao: "Reescreve a realidade para um grupo. Muda memórias, altera eventos recentes (últimas 24h).", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Singularidade Mental", elemento: "Conhecimento", circulo: 4, execucao: "Completa", alcance: "Médio", alvo: "Área explosão 15m", duracao: "Instantânea", resistencia: "Vontade anula", custoPe: 0, descricao: "Colapsa as mentes de todos na área. Morte instantânea (ou 20d10+20 dano mental se passarem).", discente: null, verdadeiro: null, fonte: "Sobrevivendo ao Horror" },
    { nome: "Artefato Cinético", elemento: "Energia", circulo: 4, execucao: "8 horas", alcance: "Toque", alvo: "1 objeto", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria artefato de Energia com efeito equivalente a ritual de 1º-3º círculo.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Colapso de Realidade", elemento: "Energia", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Colapso do espaço-tempo local. Causa 30d6+30 dano de energia. Área se torna zona perigosa por 1 dia.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Cronodisrupção", elemento: "Energia", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Cena", resistencia: "Fortitude anula", custoPe: 0, descricao: "Alvo é deslocado no tempo (desaparece por 1d6 rodadas e reaparece no mesmo local).", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Dominar Energia", elemento: "Energia", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "Fenômeno energético", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Controla qualquer fenômeno energético na área (raio, fogo, eletricidade etc.)", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Paradoxo", elemento: "Energia", circulo: 4, execucao: "Completa", alcance: "Médio", alvo: "1 ser", duracao: "Permanente", resistencia: "Fortitude anula", custoPe: 0, descricao: "Cria paradoxo temporal em volta do ser: ele existirá e não existirá. Efeito permanente até ritual de remoção.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Supernova", elemento: "Energia", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Instantânea", resistencia: "Reflexos parcial", custoPe: 0, descricao: "Liberação total de energia. Causa 25d8+25 dano. Destrói objetos não-paranormais na área.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Tempestade Temporal", elemento: "Energia", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "Área explosão 15m", duracao: "Cena", resistencia: "Fortitude parcial", custoPe: 0, descricao: "Área fica em tempo distorcido. Seres na área sofrem 10d6/rodada e ficam lentos.", discente: null, verdadeiro: null, fonte: "Sobrevivendo ao Horror" },
    { nome: "Apocalipse do Medo", elemento: "Medo", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Onda de terror puro. Todos na área ficam paralisados de medo (ou apavorados se passarem).", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Artefato do Medo", elemento: "Medo", circulo: 4, execucao: "8 horas", alcance: "Toque", alvo: "1 objeto", duracao: "Permanente", resistencia: "Nenhuma", custoPe: 0, descricao: "Cria artefato de Medo com efeito equivalente a ritual de 1º-3º círculo.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Encarnação do Terror", elemento: "Medo", circulo: 4, execucao: "Completa", alcance: "Pessoal", alvo: "Você", duracao: "Cena", resistencia: "Nenhuma", custoPe: 0, descricao: "Torna-se o próprio Terror. Imune a dano não-paranormal. Aura de pavor absoluto 30m.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Fim dos Sonhos", elemento: "Medo", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Permanente (cura)", resistencia: "Vontade anula", custoPe: 0, descricao: "Remove a capacidade de sonhar/esperança de todos na área. -5 em todos os testes permanentemente.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Medo da Morte", elemento: "Medo", circulo: 4, execucao: "Padrão", alcance: "Longo", alvo: "1 ser", duracao: "Permanente (cura)", resistencia: "Vontade anula", custoPe: 0, descricao: "Implanta medo irracional e permanente. Alvo recebe -10 em todos os testes quando em combate.", discente: null, verdadeiro: null, fonte: "Livro Base" },
    { nome: "Reino do Terror", elemento: "Medo", circulo: 4, execucao: "Completa", alcance: "Longo", alvo: "Área explosão 30m", duracao: "Cena", resistencia: "Vontade parcial", custoPe: 0, descricao: "Cria domínio de terror puro. Todos falham automaticamente em testes de resistência a medo.", discente: null, verdadeiro: null, fonte: "Sobrevivendo ao Horror" },
  ]);
  console.log("==> Rituais seeded.");
}

async function seed() {
  const [{ value: classCount }] = await db.select({ value: count() }).from(classesTable);
  const [{ value: rituaisCount }] = await db.select({ value: count() }).from(rituaisTable);

  if (Number(classCount) > 0 && Number(rituaisCount) > 0) {
    console.log("==> Database already seeded, skipping.");
    process.exit(0);
  }

  if (Number(classCount) > 0 && Number(rituaisCount) === 0) {
    await seedRituais();
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
      poderDescricao: "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Agente de Saúde", fonte: "Livro Base",
      descricao: "Você trabalhou na área da saúde, seja como médico, enfermeiro, paramédico ou técnico. Seu contato com o sofrimento humano e, eventualmente, com casos inexplicáveis, o levou à Ordem.",
      periciasConcedidas: ["Intuição", "Medicina"],
      poderConcedido: "Técnica Medicinal",
      poderDescricao: "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.",
    },
    {
      nome: "Amnésico", fonte: "Livro Base",
      descricao: "Você não se lembra de quem era antes. Talvez tenha sido um experimento, uma vítima de ritual ou simplesmente alguém que viu algo que não deveria. Sua vida começa agora, na Ordem.",
      periciasConcedidas: [],
      poderConcedido: "Vislumbres do Passado",
      poderDescricao: "Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares. Se passar, recebe 1d4 PE temporários e uma informação útil.",
    },
    {
      nome: "Artista", fonte: "Livro Base",
      descricao: "Você era um ator, músico, escritor, pintor ou qualquer outro tipo de artista. Sua sensibilidade e criatividade o tornaram mais perceptivo ao paranormal.",
      periciasConcedidas: ["Artes", "Enganação"],
      poderConcedido: "Magnum Opus",
      poderDescricao: "Uma vez por missão, pode determinar que uma pessoa envolvida em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquela pessoa.",
    },
    {
      nome: "Atleta", fonte: "Livro Base",
      descricao: "Você foi um atleta profissional ou amador de alto nível. Seu corpo treinado e sua mentalidade competitiva o tornaram um agente eficaz.",
      periciasConcedidas: ["Acrobacia", "Atletismo"],
      poderConcedido: "110%",
      poderDescricao: "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Chef", fonte: "Livro Base",
      descricao: "Você era um cozinheiro profissional, seja em um restaurante sofisticado ou em uma barraca de rua. Sua habilidade com ingredientes e sua criatividade na cozinha o tornaram um membro valioso da Ordem.",
      periciasConcedidas: ["Fortitude", "Profissão (cozinheiro)"],
      poderConcedido: "Ingrediente Secreto",
      poderDescricao: "Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você e todos que comerem recebem o benefício de dois pratos.",
    },
    {
      nome: "Criminoso", fonte: "Livro Base",
      descricao: "Você viveu à margem da lei, seja como ladrão, hacker, traficante ou outro tipo de criminoso. Suas habilidades ilícitas provaram ser surpreendentemente úteis na Ordem.",
      periciasConcedidas: ["Crime", "Furtividade"],
      poderConcedido: "O Crime Compensa",
      poderDescricao: "No final de uma missão, você pode escolher um item encontrado na missão (exceto itens amaldiçoados). Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.",
    },
    {
      nome: "Cultista Arrependido", fonte: "Livro Base",
      descricao: "Você fez parte de um culto que adorava entidades do Outro Lado. Após ver os horrores que seu grupo causava, decidiu abandoná-lo e usar seu conhecimento para combater o paranormal de dentro.",
      periciasConcedidas: ["Ocultismo", "Religião"],
      poderConcedido: "Traços do Outro Lado",
      poderDescricao: "Você recebe um poder paranormal à sua escolha, mas começa o jogo com metade da Sanidade inicial.",
    },
    {
      nome: "Desgarrado", fonte: "Livro Base",
      descricao: "Você cresceu sem estrutura familiar, sobrevivendo nas ruas ou em ambientes hostis. Essa vida dura forjou um corpo e uma mente capazes de aguentar o que a maioria não suporta.",
      periciasConcedidas: ["Fortitude", "Sobrevivência"],
      poderConcedido: "Calejado",
      poderDescricao: "Você recebe +1 PV para cada 5% de NEX.",
    },
    {
      nome: "Engenheiro", fonte: "Livro Base",
      descricao: "Você trabalhou projetando, construindo ou consertando estruturas, máquinas ou sistemas. Sua mente analítica e suas mãos habilidosas abriram portas inesperadas para o paranormal.",
      periciasConcedidas: ["Profissão (engenheiro)", "Tecnologia"],
      poderConcedido: "Ferramenta Favorita",
      poderDescricao: "Um item a sua escolha (exceto armas) conta como uma categoria abaixo para você.",
    },
    {
      nome: "Executivo", fonte: "Livro Base",
      descricao: "Você ocupava um cargo de liderança em uma empresa ou organização. Sua habilidade de tomar decisões sob pressão e gerenciar pessoas chamou a atenção da Ordem.",
      periciasConcedidas: ["Diplomacia", "Profissão (executivo)"],
      poderConcedido: "Processo Otimizado",
      poderDescricao: "Sempre que faz um teste de perícia durante uma cena de investigação, você pode gastar 2 PE para receber +5 nesse teste.",
    },
    {
      nome: "Investigador", fonte: "Livro Base",
      descricao: "Você trabalhou como detetive particular, investigador ou analista. Sua habilidade em encontrar pistas e interrogar suspeitos o tornou um ativo valioso para a Ordem.",
      periciasConcedidas: ["Investigação", "Percepção"],
      poderConcedido: "Faro para Pistas",
      poderDescricao: "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.",
    },
    {
      nome: "Lutador", fonte: "Livro Base",
      descricao: "Você tem experiência em combate corpo a corpo, seja como lutador de artes marciais, praticante de esportes de contato ou simplesmente alguém que cresceu em um ambiente violento.",
      periciasConcedidas: ["Luta", "Reflexos"],
      poderConcedido: "Mão Pesada",
      poderDescricao: "Você recebe +2 em rolagens de dano com ataques corpo a corpo.",
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
      poderDescricao: "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido de +2 para +5.",
    },
    {
      nome: "Teórico da Conspiração", fonte: "Livro Base",
      descricao: "A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana... E secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo esses importantes assuntos.",
      periciasConcedidas: ["Investigação", "Ocultismo"],
      poderConcedido: "Eu Já Sabia",
      poderDescricao: "Você recebe +2 em Defesa e testes de resistência contra criaturas.",
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
      poderDescricao: "Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. Pode preparar um prato especial durante um interlúdio que fornece RD 10 contra o tipo de dano do elemento da criatura. Cada refeição custa 1 ponto de Sanidade permanente.",
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
      poderDescricao: "Você pode usar Artes no lugar de Diplomacia ou Enganação em testes de interação social. Além disso, recebe +5 em testes de resistência contra efeitos de medo relacionados ao tema do seu cosplay.",
    },
    {
      nome: "Diplomata", fonte: "Sobrevivendo ao Horror",
      descricao: "Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis. Talvez fosse representante comercial de uma empresa, membro de um partido político ou embaixador do governo.",
      periciasConcedidas: ["Atualidades", "Diplomacia"],
      poderConcedido: "Conexões",
      poderDescricao: "Você pode gastar 2 PE para receber +5 em um teste de Diplomacia ou para descobrir uma informação sobre um NPC com quem esteja interagindo.",
    },
    {
      nome: "Explorador", fonte: "Sobrevivendo ao Horror", criador: "Guilherme 'Guirassol' e João Vitor 'Vapor' | Arquivo do Medo",
      descricao: "Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas.",
      periciasConcedidas: ["Fortitude", "Sobrevivência"],
      poderConcedido: "Manual do Sobrevivente",
      poderDescricao: "Você pode gastar uma ação de interlúdio para preparar rações especiais. Todos que as consumirem recuperam +1d6 PV ou Sanidade (à sua escolha) no próximo descanso.",
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
      poderDescricao: "Você recebe +5 em testes de Ocultismo para identificar criaturas do Outro Lado e em testes de Vontade contra enigmas de medo associados a elas.",
    },
    {
      nome: "Fotógrafo", fonte: "Sobrevivendo ao Horror",
      descricao: "Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor.",
      periciasConcedidas: ["Artes", "Percepção"],
      poderConcedido: "Através da Lente",
      poderDescricao: "Você pode gastar 1 PE para receber +5 em um teste de Percepção para observar detalhes ou para registrar uma cena através de lentes.",
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
      poderDescricao: "Uma vez por cena, você pode gastar 2 PE para rolar novamente um teste de perícia baseado em sorte ou intuição (a critério do mestre), usando o melhor resultado.",
    },
    {
      nome: "Legista do Turno da Noite", fonte: "Sobrevivendo ao Horror", criador: "Ivo 'Eddu' e Ana Beatriz 'Bix' | Arquivos Confidenciais",
      descricao: "Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria.",
      periciasConcedidas: ["Ciências", "Medicina"],
      poderConcedido: "Luto Habitual",
      poderDescricao: "Você recebe +5 em testes de Medicina para necropsia e +2 em testes de resistência contra efeitos de medo provenientes de cadáveres ou cenas de morte.",
    },
    {
      nome: "Mateiro", fonte: "Sobrevivendo ao Horror",
      descricao: "Você conhece áreas rurais e selvagens. Você pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.",
      periciasConcedidas: ["Percepção", "Sobrevivência"],
      poderConcedido: "Mapa Celeste",
      poderDescricao: "Desde que possa ver o céu, você nunca se perde e recebe +5 em testes de Sobrevivência para orientação e navegação ao ar livre.",
    },
    {
      nome: "Mergulhador", fonte: "Sobrevivendo ao Horror",
      descricao: "Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. Trajando seu equipamento de mergulho, você consegue se aventurar a grandes profundidades.",
      periciasConcedidas: ["Atletismo", "Fortitude"],
      poderConcedido: "Fôlego de Nadador",
      poderDescricao: "Você pode prender a respiração pelo dobro do tempo normal e recebe +5 em testes de Atletismo para natação.",
    },
    {
      nome: "Motorista", fonte: "Sobrevivendo ao Horror",
      descricao: "Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros.",
      periciasConcedidas: ["Pilotagem", "Reflexos"],
      poderConcedido: "Mãos no Volante",
      poderDescricao: "Você recebe +5 em testes de Pilotagem e pode gastar 1 PE para realizar uma manobra de veículo como uma ação de movimento.",
    },
    {
      nome: "Nerd Entusiasta", fonte: "Sobrevivendo ao Horror", criador: "Daniel Dill e Lukas Castanho | Remate Paranormal",
      descricao: "Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado 'nerd'. Sua obsessão em pesquisar fundo seus assuntos de interesse chamou a atenção de organizações paranormais.",
      periciasConcedidas: ["Ciências", "Tecnologia"],
      poderConcedido: "O Inteligentão",
      poderDescricao: "Você pode gastar 2 PE para receber +5 em um teste de Intelecto ou de uma perícia baseada em Intelecto.",
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

  if (Number(rituaisCount) === 0) {
    await seedRituais();
  }

  console.log("==> Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
