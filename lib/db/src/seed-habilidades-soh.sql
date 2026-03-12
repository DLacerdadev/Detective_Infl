-- =============================================================
-- SEED: Novos Poderes e Trilhas (Sobrevivendo ao Horror)
-- =============================================================

-- ---------------------------------------------------------------
-- ATUALIZAR DESCRIÇÕES DOS PODERES DE COMBATENTE (SoH) JÁ EXISTENTES
-- ---------------------------------------------------------------

UPDATE habilidades SET descricao = 'Não importa o quão profundos sejam seus ferimentos, você escolhe a agonia enlouquecedora da dor a perder a consciência diante da própria morte. Você não fica inconsciente por estar morrendo, mas sempre que terminar uma rodada nesta condição e consciente, perde 2 pontos de Sanidade.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Apego Angustiado' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Se for para alguém do seu grupo ser pego, que seja você. Quando usa a ação sacrifício em uma cena de perseguição, você pode gastar 1 PE para fornecer +5 extra (total de +10) nos testes dos outros personagens. Quando usa a ação chamar atenção em uma cena de furtividade, pode gastar 1 PE para diminuir a visibilidade de todos os seus aliados próximos em –2 (em vez de –1).', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Caminho para Forca' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Acostumado a manusear armas, você aprendeu também a identificar as marcas que elas deixam. Quando faz um teste para encontrar uma pista relacionada a armas ou ferimentos (como um teste para necropsia ou para identificar uma arma amaldiçoada), você pode usar Luta ou Pontaria no lugar da perícia original. Pré-requisito: treinado em Luta ou Pontaria.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Ciente das Cicatrizes' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Você já esteve diante de coisas que não podem ser derrotadas e aprendeu da forma mais trágica que às vezes fugir é a única chance de vitória. Você recebe +3m em seu deslocamento e +5 em testes de perícia para fugir em uma perseguição.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Correria Desesperada' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Mesmo ferido, você não vai emitir um pio até que a ameaça se afaste. Você não sofre penalidades por condições em testes de perícia para fugir e em testes de Furtividade.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Engolir o Choro' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Sabendo que nem toda batalha pode ser vencida, você desenvolveu um sexto sentido para prever quando é hora de fugir. Quando uma cena de perseguição (ou semelhante) tem início, você recebe +2 em todos os testes de perícia que fizer durante a cena. Pré-requisito: treinado em Intuição.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Instinto de Fuga' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Você já precisou pegar a estrada para escapar de perseguidores o suficiente para saber como carregar tudo que precisa. Seu limite de carga aumenta em 5 espaços e você pode se beneficiar de uma vestimenta adicional. Pré-requisito: Vig 2.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Mochileiro' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Você sabe que eles estão lá fora e fará tudo ao seu alcance para mantê-los assim. Uma vez por cena, você pode gastar uma rodada e 3 PE. Se fizer isso, você e cada aliado presente escolhe entre receber +5 na Defesa contra o próximo ataque que sofrer na cena ou receber um bônus de +5 em um único teste de perícia feito até o fim da cena.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Paranoia Defensiva' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Diante de algo que não pode ser vencido, você abre mão da autopreservação para superar seus limites de fuga. Uma vez por cena de perseguição, quando faz a ação esforço extra, você pode gastar 2 PE para passar automaticamente no teste de perícia. Pré-requisito: treinado em Atletismo.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Sacrificar os Joelhos' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Você sabe que pistas são importantes, mas com o paranormal podendo surgir a qualquer momento, cada segundo conta. Uma vez por cena de investigação, quando usa a ação facilitar investigação, você pode prestar ajuda de forma apressada e descuidada. Você passa automaticamente no teste para auxiliar seus aliados, mas faz uma rolagem adicional na tabela de eventos de investigação.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Sem Tempo, Irmão' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

UPDATE habilidades SET descricao = 'Em algum momento, a vida lhe ensinou que a brutalidade pode ser amedrontadora, e agora esse é seu principal idioma. Você pode usar Força no lugar de Presença para Intimidação. Além disso, uma vez por cena, pode gastar 1 PE para fazer um teste de Intimidação para assustar como uma ação livre.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Valentão' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE';

-- Atualizar trilha Monstruoso (já existe no DB)
UPDATE habilidades SET descricao = 'Você propositalmente desfigura e altera seu corpo para que as Entidades o invadam com maior intensidade. NEX 10% - Ser Amaldiçoado: treinamento em Ocultismo; escolha um elemento (Sangue/Morte/Conhecimento/Energia); execute etapa ritualística diária para receber benefícios do elemento (Sangue: RD Sangue/balístico 5 e faro; Morte: RD Morte/perfuração 5 e imunidade a fadiga; Conhecimento: RD Conhecimento/balístico 5 e visão no escuro; Energia: RD corte/eletricidade/fogo/Energia 5). NEX 40% - Ser Macabro: RD aumenta para 10; penalidades em perícias aumentam para –10; efeitos adicionais por elemento (ex: Sangue: veste pouca roupa, pode usar Força para PE; Morte: trajes anacrônicos, usa Vigor para PE). NEX 65% - Ser Assustador: RD aumenta para 15; Presença reduzida em –1 permanentemente; mais efeitos por elemento (ex: Sangue: 50% chance de ignorar dano de crítico/ataque furtivo, arma mordida 1d8). NEX 99% - Ser Aterrorizante: efeitos da etapa ritualística se tornam permanentes; você passa a ser criatura paranormal; RD aumenta para 20; transformações finais por elemento.', fonte = 'SOBREVIVENDO_AO_HORROR'
WHERE nome = 'Monstruoso' AND classe = 'COMBATENTE' AND categoria = 'TRILHA';

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE COMBATENTE (SoH)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Agente Secreto', 'TRILHA', 'COMBATENTE',
  'Às vezes, um governo precisa lidar com um problema de forma discreta. Você se tornou um agente secreto escolhido para trabalhar com a Ordo Realitas. NEX 10% - Carteirada: treinamento em Diplomacia ou Enganação; no início de cada missão recebe documentos com privilégios jurídicos especiais (acesso a locais restritos, porte de armas, autoridade em investigações) que não ocupam espaço. NEX 40% - O Sorriso: +2 em Diplomacia e Enganação; ao falhar num teste dessas perícias, gaste 2 PE para repetir (uma vez por teste); uma vez por cena, pode fazer teste de Diplomacia para acalmar a si mesmo. NEX 65% - Método Investigativo: urgência de cenas de investigação em que esteja aumenta em 1 rodada; pode gastar 2 PE para transformar resultado de evento de investigação em "sem evento" (custo acumula em +2 PE por uso adicional). NEX 99% - Multifacetado: uma vez por cena, gaste 5 pontos de Sanidade para receber todas as habilidades de até NEX 65% de uma trilha de combatente ou especialista à sua escolha (com pré-requisitos); habilidades duram até fim da cena; mesma trilha só pode ser escolhida uma vez por missão.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Agente Secreto' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Caçador', 'TRILHA', 'COMBATENTE',
  'Valendo-se de relatos de segunda mão, notícias e relatórios, você reúne informações sobre como caçar as coisas que espreitam na escuridão. NEX 10% - Rastrear o Paranormal: treinamento em Sobrevivência ou +2 nela; pode usar essa perícia no lugar de Ocultismo para identificar criaturas e no lugar de Investigação e Percepção para perceber rastros, pistas e criaturas com traços paranormais. NEX 40% - Estudar Fraquezas: gaste uma ação de interlúdio e uma pista ligada a um ser específico para estudar suas fraquezas; recebe uma informação útil sobre o ser e +1 em testes de perícia contra a criatura por pista até o fim da missão. NEX 65% - Atacar das Sombras: não sofre penalidade de –5 em Furtividade ao se mover; ao usar arma silenciosa, penalidade por atacar na mesma rodada reduzida para –5; visibilidade inicial em cenas de furtividade é sempre 1 ponto abaixo do normal. NEX 99% - Estudar a Presa: ao usar Estudar Fraquezas contra criatura paranormal ou cultista, transforma o tipo desse ser em sua "presa"; contra a presa: +5 em testes de perícia, +1 na margem de ameaça e multiplicador de crítico, e resistência a dano 5 (apenas uma presa ativa por vez).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Caçador' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVOS PODERES DE ESPECIALISTA (SoH)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Acolher o Terror', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você já sofreu tanto medo que às vezes aceitar o terror é como voltar para casa. Você pode se entregar para o medo uma vez por sessão de jogo adicional.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Acolher o Terror' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Contatos Oportunos', 'PODER_CLASSE', 'ESPECIALISTA',
  'Ao longo de sua vida, você fez amizades úteis com pessoas de vários tipos em muitos lugares. Você pode usar uma ação de interlúdio para acionar seus contatos locais. Você recebe um aliado de um tipo à sua escolha que lhe acompanha até o fim da missão ou até ser dispensado. Você só pode ter um desses aliados por vez, e o mestre tem a palavra final sobre a disponibilidade. Pré-requisito: treinado em Crime.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Contatos Oportunos' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Disfarce Sutil', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você sabe como se disfarçar rapidamente, usando pequenos detalhes para alterar sua aparência. Quando faz um disfarce em si mesmo usando Enganação, você pode gastar 1 PE para se disfarçar como uma ação completa e sem necessidade de um kit de disfarces (se usar um kit, recebe +5 no teste). Pré-requisitos: Pre 2, treinado em Enganação.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Disfarce Sutil' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Esconderijo Desesperado', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você aprendeu da forma mais trágica que às vezes se esconder é a única chance de vitória. Você não sofre –5 em testes de Furtividade por se mover ao seu deslocamento normal. Além disso, em cenas de furtividade, sempre que passa em um teste para esconder-se, sua visibilidade diminui em –2 (em vez de apenas –1).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Esconderijo Desesperado' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Especialista Diletante', 'PODER_CLASSE', 'ESPECIALISTA',
  'A vida lhe ensinou que todo tipo de conhecimento pode ser útil. Você aprende um poder que não pertença à sua classe (exceto poderes de trilha ou paranormais), à sua escolha, cujos pré-requisitos possa cumprir. Pré-requisito: NEX 30%.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Especialista Diletante' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Flashback', 'PODER_CLASSE', 'ESPECIALISTA',
  'Um novo trauma recente desbloqueia um conhecimento adormecido. Talvez fosse uma memória enterrada fundo em sua mente, ou uma habilidade desenvolvida por seu cérebro como um mecanismo de defesa. Escolha uma origem que não seja a sua. Você recebe o poder dessa origem.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Flashback' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Leitura Fria', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você estudou técnicas de "leitura fria", a capacidade de analisar e compreender uma pessoa através de suas mais sutis reações. Uma vez em cada interlúdio, se passar alguns minutos interagindo com uma pessoa, você pode fazer três perguntas pessoais sobre ela. O mestre pode responder com a verdade ou se negar a responder, mas para cada pergunta não respondida, você recebe 2 PE temporários que duram até o fim da missão. Este poder só pode ser usado uma vez em cada pessoa e apenas em NPCs. Pré-requisito: treinado em Intuição.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Leitura Fria' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Mãos Firmes', 'PODER_CLASSE', 'ESPECIALISTA',
  'Quando há um caçador à espreita, derrubar sequer uma agulha pode ser o suficiente para revelar sua localização. Quando faz um teste de Furtividade para esconder-se ou para executar uma ação discreta que envolva manipular um objeto (como em uma cena de furtividade), você pode gastar 2 PE para receber +5 nesse teste. Pré-requisito: treinado em Furtividade.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Mãos Firmes' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Plano de Fuga', 'PODER_CLASSE', 'ESPECIALISTA',
  'A todo momento você está criando cenários imaginários e possibilidades na sua mente, pensando em estratégias que usaria para escapar de perseguidores. Você pode usar Intelecto no lugar de Força para a ação criar obstáculos em uma perseguição. Além disso, uma vez por cena, pode gastar 2 PE para dispensar o teste e ser bem-sucedido nesta ação.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Plano de Fuga' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Remoer Memórias', 'PODER_CLASSE', 'ESPECIALISTA',
  'Sua mente está constantemente revivendo memórias do passado, sejam elas boas ou ruins. Uma vez por cena, quando faz um teste de perícia baseada em Intelecto ou Presença, você pode gastar 2 PE para substituir esse teste por um teste de Intelecto com DT 15. Pré-requisito: Int 1.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Remoer Memórias' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Resistir à Pressão', 'PODER_CLASSE', 'ESPECIALISTA',
  'A ansiedade de correr contra o relógio o deixa mais eficiente. Uma vez por cena de investigação, você pode gastar 5 PE para coordenar os esforços de seus companheiros. A urgência da investigação aumenta em 1 rodada, e durante esta rodada adicional todos os personagens (incluindo você) recebem +2 em testes de perícia. Pré-requisito: treinado em Investigação.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Resistir à Pressão' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE ESPECIALISTA (SoH)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Bibliotecário', 'TRILHA', 'ESPECIALISTA',
  'Seu vasto conhecimento acumulado através de leituras é muitas vezes a única solução para situações desesperadoras. NEX 10% - Conhecimento Prático: quando faz um teste de perícia (exceto Luta e Pontaria), pode gastar 2 PE para mudar o atributo-base para Int (se tiver Conhecimento Aplicado, custo reduzido em –1 PE). NEX 40% - Leitor Contumaz: cada dado de bônus da ação de interlúdio ler aumenta para 1d8 e pode ser aplicado em testes de qualquer perícia; ao usar esse bônus, pode gastar 2 PE para adicionar +1 dado (de 1d8 para 2d8). NEX 65% - Rato de Biblioteca: em ambiente com muitos livros, gaste alguns minutos (ou uma rodada em investigação) para receber benefícios de ação de interlúdio ler ou revisar caso (apenas uma vez por cena). NEX 99% - A Força do Saber: Intelecto aumenta em +1; soma o valor desse atributo em seu total de PE; escolha uma perícia e troque seu atributo-base para Intelecto.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Bibliotecário' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Perseverante', 'TRILHA', 'ESPECIALISTA',
  'Seja por experiência ou instinto, você tem certeza que seria o último sobrevivente a sair vivo no final. NEX 10% - Soluções Improvisadas: gaste 2 PE para rolar novamente 1 dos dados de um teste recém-realizado (apenas uma vez por teste) e ficar com o melhor resultado. NEX 40% - Fuga Obstinada: +5 em testes de perícia para fugir de um inimigo; em cenas de perseguição como presa, pode acumular até 4 falhas antes de ser pego. NEX 65% - Determinação Inquestionável: uma vez por cena, gaste 5 PE e uma ação padrão para remover uma condição de medo, mental ou de paralisia que esteja afligindo você. NEX 99% - Só Mais um Passo...: uma vez por rodada, quando sofre dano que reduziria seus PV a 0, gaste 5 PE para ficar com 1 PV (não funciona contra dano massivo).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Perseverante' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Muambeiro', 'TRILHA', 'ESPECIALISTA',
  'Você sempre foi bom em lidar com equipamentos e aprendeu como produzir ou encontrar os itens certos em qualquer ocasião. NEX 10% - Mascate: treinamento em Profissão (armeiro, engenheiro ou químico); +5 na capacidade de carga; ao fabricar item improvisado, a DT é reduzida em –10 (em vez de –5). NEX 40% - Fabricação Própria: leva apenas metade do tempo para fabricar itens mundanos (uma ação de manutenção para duas munições/explosivos; uma ação de manutenção para armas/proteções). NEX 65% - Laboratório de Campo: treinamento em outra Profissão (armeiro, engenheiro ou químico) ou +5 nela; pode usar fabricação em campo para fabricar e consertar itens paranormais (3 ações de interlúdio não consecutivas). NEX 99% - Achado Conveniente: gaste ação completa e 5 PE para "produzir" um item de até categoria III (exceto itens paranormais); o item funciona até o fim da cena, quando então deixa de funcionar permanentemente.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Muambeiro' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVOS PODERES DE OCULTISTA (SoH)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Deixe os Sussurros Guiarem', 'PODER_CLASSE', 'OCULTISTA',
  'Você sabe abrir sua mente para os sussurros do Paranormal, vozes que lhe guiam às custas de sua Sanidade. Uma vez por cena, você pode gastar 2 PE e uma rodada para receber +2 em testes de perícia para investigação até o fim da cena. Entretanto, enquanto este poder estiver ativo, sempre que falha em um teste de perícia, você perde 1 ponto de Sanidade.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Deixe os Sussurros Guiarem' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Domínio Esotérico', 'PODER_CLASSE', 'OCULTISTA',
  'Você estudou a fundo a complexidade de catalisadores esotéricos e aprendeu a combinar suas propriedades paranormais. Ao lançar um ritual, você pode combinar os efeitos de até dois catalisadores ritualísticos diferentes ao mesmo tempo. Pré-requisito: Int 3.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Domínio Esotérico' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Estalos Macabros', 'PODER_CLASSE', 'OCULTISTA',
  'Você sabe colidir pequenos objetos amaldiçoados para gerar distrações fortuitas em momentos de necessidade. Quando faz uma ação para atrapalhar a atenção de outro ser (como distrair em cena de furtividade ou fintar em combate), você pode gastar 1 PE para usar Ocultismo em vez da perícia original. Se o alvo for uma pessoa ou animal, você recebe +5 no teste.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Estalos Macabros' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Minha Dor me Impulsiona', 'PODER_CLASSE', 'OCULTISTA',
  'Você está acostumado com sacrifícios dolorosos e aprendeu a transformar sua dor em impulso físico. Quando faz um teste de Acrobacia, Atletismo ou Furtividade, você pode gastar 1 PE para receber +1d6 no teste. Você só pode usar este poder se estiver com pelo menos 5 pontos de dano em seus PV. Pré-requisito: Vig 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Minha Dor me Impulsiona' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Nos Olhos do Monstro', 'PODER_CLASSE', 'OCULTISTA',
  'Por mais assustador que seja encarar o paranormal, fazer isso pode fornecer a chave para escapar dele com vida. Se estiver em uma cena envolvendo uma criatura paranormal, você pode gastar uma rodada e 3 PE para encarar essa criatura (você precisa ver os olhos ou o "rosto" da criatura). Se fizer isso, você recebe +5 em testes contra a criatura (exceto testes de ataque) até o fim da cena.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Nos Olhos do Monstro' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Olhar Sinistro', 'PODER_CLASSE', 'OCULTISTA',
  'Aquilo que para outros é quase uma ciência, para você é a imposição da própria vontade. Você pode usar Presença no lugar de Intelecto para Ocultismo e pode usar esta perícia para coagir (como Intimidação). Pré-requisito: Pre 1.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Olhar Sinistro' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sentido Premonitório', 'PODER_CLASSE', 'OCULTISTA',
  'Sua exposição paranormal dá outros significados para arrepios e calafrios. Você pode gastar 3 PE para ativar um sentido premonitório. Enquanto ativo, você tem um déjà vu do futuro próximo (equivalente a uma rodada): sabe quando a urgência de uma investigação vai acabar, se irá ocorrer um evento e qual será ele, e quais ações seus inimigos irão tomar em cenas de furtividade e perseguição. Para manter o sentido ativo, gaste 1 PE no início de cada rodada. Não tem efeito em combate.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sentido Premonitório' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sincronia Paranormal', 'PODER_CLASSE', 'OCULTISTA',
  'Sua exposição paranormal compartilhada criou uma conexão invisível de Medo entre você e seus aliados. Você pode gastar uma ação padrão e 2 PE para estabelecer uma sincronia mental com qualquer número de personagens em alcance médio com quem já sobreviveu a pelo menos um encontro paranormal. No início de cada rodada, você pode distribuir um número de d6 de bônus igual à sua Presença entre os participantes; esses dados podem ser usados em testes de perícias baseadas em Intelecto ou Presença e desaparecem no final de cada rodada. Manter a sincronia custa 1 PE no início de cada rodada. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sincronia Paranormal' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Traçado Conjuratório', 'PODER_CLASSE', 'OCULTISTA',
  'Você conhece versões de proteção e fortalecimento de vários símbolos paranormais, e pode usá-los para reforçar seus rituais. Você pode gastar 1 PE e uma ação completa traçando um símbolo paranormal no chão que ocupa um quadrado de 1,5m. Enquanto estiver dentro desse símbolo, você recebe +2 em testes de Ocultismo e de resistência e a DT para resistir aos seus rituais aumenta em +2. O símbolo dura até o fim da cena.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Traçado Conjuratório' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE OCULTISTA (SoH)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Exorcista', 'TRILHA', 'OCULTISTA',
  'Com sua fé como escudo e suas palavras como espada, você mergulha na escuridão onde a Realidade e o Outro Lado travam uma batalha pelo medo humano. NEX 10% - Revelação do Mal: treinamento em Religião ou +2 nela; pode usar Religião no lugar de Investigação e Percepção para notar seres e pistas paranormais e no lugar de Ocultismo. NEX 40% - Poder da Fé: torna-se veterano em Religião (ou +5 se já veterano); ao falhar em teste de resistência, gaste 2 PE para repetir usando Religião (deve aceitar novo resultado). NEX 65% - Parareligiosidade: ao conjurar ritual, gaste +2 PE para adicionar efeito equivalente a um catalisador ritualístico à sua escolha. NEX 99% - Chagas da Resistência: quando sua Sanidade é reduzida a 0, você pode gastar 10 PV para, em vez disso, ficar com SAN 1.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Exorcista' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Possuído', 'TRILHA', 'OCULTISTA',
  'Você nunca quis contato com o Outro Lado, mas ele parece ter especialmente escolhido você para perseguir. NEX 10% - Poder Não Desejado: sempre que recebe um novo poder de ocultista, recebe Transcender em vez disso; possui reserva de pontos de possessão (PP = 3 + 2 por Transcender); limite de PP por turno = Presença; por PP gasto, recupera 10 PV ou 2 PE; recupera 1 PP por ação de interlúdio dormir. NEX 40% - As Sombras Dentro de Mim: recuperação de PP aumenta para 2 por ação dormir; pode gastar 2 PE para deixar a Entidade controlar seus músculos por uma rodada (+5 em Acrobacia, Atletismo e Furtividade; visibilidade em cenas de furtividade aumenta –1 a menos). NEX 65% - Ele Me Ensina: escolha entre receber Transcender ou o primeiro poder de uma trilha de ocultista que não a sua (com pré-requisitos). NEX 99% - Tornamo-nos Um: conforme elemento com afinidade, recebe um presente paranormal (Sangue: 6 PE para recuperar 50 PV; Morte: 6 PE para turno adicional; Conhecimento: 6 PE para receber qualquer poder até fim da cena; Energia: 6 PE para se teletransportar até alcance médio).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Possuído' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Parapsicólogo', 'TRILHA', 'OCULTISTA',
  'Desprezado pela academia por falar sobre o paranormal, você decidiu perseguir a verdade sozinho. Requer treinamento em Profissão (psicólogo). NEX 10% - Terapia: pode usar Profissão (psicólogo) como Diplomacia; uma vez por rodada, quando você ou aliado em alcance curto falha em teste de resistência contra efeito que causa dano mental, gaste 2 PE para fazer teste de Profissão (psicólogo) e usar seu resultado no lugar. NEX 40% - Palavras-chave: ao passar em teste para acalmar, gaste PE (até seu limite); para cada 1 PE gasto, o alvo recupera 1 ponto de Sanidade (ou 1 PD). NEX 65% - Reprogramação Mental: gaste 5 PE e ação de interlúdio para manipular o cérebro de outra pessoa voluntária em alcance curto; até o próximo interlúdio, ela recebe um poder geral, da própria classe ou primeiro poder de trilha que não a dela (com pré-requisitos). NEX 99% - A Sanidade Está Lá Fora: gaste ação de movimento e 5 PE para remover todas as condições de medo ou mentais de uma pessoa adjacente (incluindo você mesmo).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Parapsicólogo' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVA CLASSE: SOBREVIVENTE — Habilidades de Classe
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte, nex)
SELECT 'Empenho', 'HABILIDADE_CLASSE', 'SOBREVIVENTE',
  'Você pode não ter treinamento especial, mas compensa com dedicação e esforço. Quando faz um teste de perícia, você pode gastar 1 PE para receber +2 nesse teste.',
  'SOBREVIVENDO_AO_HORROR', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Empenho' AND classe = 'SOBREVIVENTE' AND categoria = 'HABILIDADE_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte, nex)
SELECT 'Cicatrizado', 'HABILIDADE_CLASSE', 'SOBREVIVENTE',
  'No 5º estágio, você já viu — e sobreviveu — a sua cota de horrores. Isso deixou marcas em seu corpo e sua mente, mas também o deixou mais forte. Escolha um tipo de perigo paranormal de um elemento específico (Sangue, Morte, Conhecimento ou Energia). Você possui algum trauma em relação a esse perigo e sofre –5 em testes de resistência contra ele. Contudo, uma vez por sessão de jogo, você pode sacrificar 1 PV permanentemente para ignorar um dano mental ou gasto de PE, ou pode sacrificar permanentemente 1 PE para reduzir um dano físico à metade.',
  'SOBREVIVENDO_AO_HORROR', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Cicatrizado' AND classe = 'SOBREVIVENTE' AND categoria = 'HABILIDADE_CLASSE'
);

-- ---------------------------------------------------------------
-- TRILHAS DO SOBREVIVENTE
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Durão', 'TRILHA', 'SOBREVIVENTE',
  'Você é um indivíduo resistente, que consegue defender a si mesmo ou aos outros em situações de perigo. Pode ser um atleta, segurança, trabalhador da construção civil etc. Estágio 2 - Durão: você recebe +4 PV; ao subir para o 3º estágio, recebe +2 PV adicionais. Estágio 4 - Pancada Forte: quando faz um ataque, você pode gastar 1 PE para receber +5 no teste de ataque. Se se tornar um combatente, perde esta habilidade mas reduz o custo de ativação de Ataque Especial em –1 PE.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Durão' AND classe = 'SOBREVIVENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Esperto', 'TRILHA', 'SOBREVIVENTE',
  'Você é um estudante, técnico, engenheiro ou outra pessoa equipada com conhecimento, inteligência e persuasão. Estágio 2 - Esperto: você se torna treinado em uma perícia adicional à sua escolha. Estágio 4 - Entendido: escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 1 PE para somar +1d4 no resultado do teste. Se se tornar um especialista, perde esta habilidade mas reduz o custo de ativação de Perito em –1 PE.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Esperto' AND classe = 'SOBREVIVENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Esotérico', 'TRILHA', 'SOBREVIVENTE',
  'Você é uma pessoa ligada a aspectos espirituais do mundo, como religiões, astrologia e cartomancia, ou possui um sexto sentido em relação ao paranormal. Estágio 2 - Esotérico: você pode gastar uma ação padrão e 1 PE para sentir energias paranormais em alcance curto. Isso pode dar alguma pista em uma investigação ou alertá-lo de algum perigo iminente. O mestre dirá quais informações você consegue obter, se houver. Estágio 4 - Iniciado: você aprende e pode conjurar um ritual de 1º círculo à sua escolha. Se se tornar um ocultista, soma este ritual aos três rituais que aprende com Escolhido pelo Outro Lado.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Esotérico' AND classe = 'SOBREVIVENTE' AND categoria = 'TRILHA'
);
