-- =============================================================
-- SEED COMPLETO: Habilidades do Livro Base + Sobrevivendo ao Horror
-- =============================================================

-- ---------------------------------------------------------------
-- ATUALIZAR DESCRIÇÕES DAS HABILIDADES DE CLASSE EXISTENTES
-- ---------------------------------------------------------------

UPDATE habilidades SET
  descricao = 'Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5. Em NEX 25% custa 3 PE (+10), NEX 55% custa 4 PE (+15) e NEX 85% custa 5 PE (+20). Você pode aplicar cada bônus de +5 em ataque ou dano.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Ataque Especial' AND classe = 'COMBATENTE' AND categoria = 'HABILIDADE_CLASSE';

UPDATE habilidades SET
  descricao = 'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Eclético' AND classe = 'ESPECIALISTA' AND categoria = 'HABILIDADE_CLASSE';

UPDATE habilidades SET
  descricao = 'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. Em NEX 25% custa 3 PE (+1d8), NEX 55% custa 4 PE (+1d10) e NEX 85% custa 5 PE (+1d12).',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Perito' AND classe = 'ESPECIALISTA' AND categoria = 'HABILIDADE_CLASSE';

UPDATE habilidades SET
  descricao = 'Você teve uma experiência paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necessários para realizar rituais. Você pode lançar rituais de 1º círculo (2º em NEX 25%, 3º em NEX 55%, 4º em NEX 85%). Você começa com três rituais de 1º círculo e aprende um ritual adicional sempre que avança de NEX.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Escolhido pelo Outro Lado' AND classe = 'OCULTISTA' AND categoria = 'HABILIDADE_CLASSE';

-- Atualizar trilhas existentes
UPDATE habilidades SET
  descricao = 'Você treinou sua musculatura e movimentos a ponto de transformar seu corpo em uma verdadeira arma. NEX 10% - Técnica Letal: +2 na margem de ameaça com todos os ataques corpo a corpo. NEX 40% - Revidar: sempre que bloquear um ataque, gaste reação e 2 PE para fazer um ataque corpo a corpo no inimigo. NEX 65% - Força Opressora: ao acertar ataque corpo a corpo, gaste 1 PE para realizar manobra derrubar ou empurrar como ação livre (+5 por 10 de dano para empurrar). NEX 99% - Potência Máxima: ao usar Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Guerreiro' AND classe = 'COMBATENTE' AND categoria = 'TRILHA';

UPDATE habilidades SET
  descricao = 'Um tiro, uma morte. Você é perito em neutralizar ameaças de longe, terminando uma briga antes mesmo que ela comece. NEX 10% - Mira de Elite: proficiência com armas de fogo de balas longas; soma Intelecto em rolagens de dano com essas armas. NEX 40% - Disparo Letal: ao mirar, gaste 1 PE para +2 na margem de ameaça do próximo ataque. NEX 65% - Disparo Impactante: ao atacar com arma de fogo, gaste 2 PE para fazer manobra derrubar, desarmar, empurrar ou quebrar em vez de dano. NEX 99% - Atirar para Matar: em acerto crítico com arma de fogo, causa dano máximo sem rolar dados.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Atirador de Elite' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA';

UPDATE habilidades SET
  descricao = 'Você é perito em infiltração e sabe neutralizar alvos desprevenidos sem causar alarde. NEX 10% - Ataque Furtivo: uma vez por rodada, ao atingir alvo desprevenido ou flanqueado em corpo a corpo ou alcance curto, gaste 1 PE para +1d6 de dano (+2d6 em NEX 40%, +3d6 em NEX 65%, +4d6 em NEX 99%). NEX 40% - Gatuno: +5 em Atletismo e Crime; percorra deslocamento normal ao se esconder sem penalidade. NEX 65% - Assassinar: gaste ação de movimento e 3 PE para analisar alvo; primeiro Ataque Furtivo dobra dados extras; alvo fica inconsciente ou morrendo (Fortitude DT Agi evita). NEX 99% - Sombra Fugaz: ao atacar e tentar se esconder, gaste 3 PE para não sofrer penalidade de –15 no teste de Furtividade.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Infiltrador' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA';

UPDATE habilidades SET
  descricao = 'Dor é um poderoso catalisador paranormal e você aprendeu a transformá-la em poder para seus rituais. NEX 10% - Poder do Flagelo: ao conjurar ritual, gaste PV em vez de PE (2 PV por PE); PV gastos só se recuperam com descanso. NEX 40% - Abraçar a Dor: ao sofrer dano não paranormal, gaste reação e 2 PE para reduzir à metade. NEX 65% - Absorver Agonia: sempre que reduz inimigos a 0 PV com ritual, recebe PE temporários iguais ao círculo do ritual. NEX 99% - Medo Tangível: você aprende o ritual Medo Tangível.',
  fonte = 'LIVRO_BASE'
WHERE nome = 'Flagelador' AND classe = 'OCULTISTA' AND categoria = 'TRILHA';

-- Atualizar poderes gerais existentes com descrições completas
UPDATE habilidades SET
  descricao = 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.'
WHERE nome = 'Artista Marcial' AND classe = 'GERAL' AND categoria = 'PODER_GERAL';

UPDATE habilidades SET
  descricao = 'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –5 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.'
WHERE nome = 'Combater com Duas Armas' AND classe = 'GERAL' AND categoria = 'PODER_GERAL';

UPDATE habilidades SET
  descricao = 'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –5 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.'
WHERE nome = 'Combate Defensivo' AND classe = 'GERAL' AND categoria = 'PODER_GERAL';

UPDATE habilidades SET
  descricao = 'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.'
WHERE nome = 'Saque Rápido' AND classe = 'GERAL' AND categoria = 'PODER_GERAL';

UPDATE habilidades SET
  descricao = 'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. Este é um efeito de medo.'
WHERE nome = 'Tiro de Cobertura' AND classe = 'GERAL' AND categoria = 'PODER_GERAL';

-- ---------------------------------------------------------------
-- NOVOS PODERES DE COMBATENTE (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Armamento Pesado', 'PODER_CLASSE', 'COMBATENTE',
  'Você recebe proficiência com armas pesadas. Pré-requisito: For 2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Armamento Pesado' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Artista Marcial', 'PODER_CLASSE', 'COMBATENTE',
  'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Artista Marcial' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ataque de Oportunidade', 'PODER_CLASSE', 'COMBATENTE',
  'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ataque de Oportunidade' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Combater com Duas Armas', 'PODER_CLASSE', 'COMBATENTE',
  'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –5 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Combater com Duas Armas' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Combate Defensivo', 'PODER_CLASSE', 'COMBATENTE',
  'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –5 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Combate Defensivo' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Golpe Demolidor', 'PODER_CLASSE', 'COMBATENTE',
  'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pré-requisitos: For 2, treinado em Luta.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Golpe Demolidor' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Golpe Pesado', 'PODER_CLASSE', 'COMBATENTE',
  'Enquanto estiver empunhando uma arma corpo a corpo, o dano dela aumenta em mais um dado do mesmo tipo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Golpe Pesado' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Incansável', 'PODER_CLASSE', 'COMBATENTE',
  'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Incansável' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Presteza Atlética', 'PODER_CLASSE', 'COMBATENTE',
  'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +5 no teste.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Presteza Atlética' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Proteção Pesada', 'PODER_CLASSE', 'COMBATENTE',
  'Você recebe proficiência com Proteções Pesadas. Pré-requisito: NEX 30%.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Proteção Pesada' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Reflexos Defensivos', 'PODER_CLASSE', 'COMBATENTE',
  'Você recebe +2 em Defesa e em testes de resistência. Pré-requisito: Agi 2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Reflexos Defensivos' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Saque Rápido', 'PODER_CLASSE', 'COMBATENTE',
  'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Saque Rápido' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Segurar o Gatilho', 'PODER_CLASSE', 'COMBATENTE',
  'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno (2 PE pelo 1º extra, 4 PE pelo 2º extra, etc.). Pré-requisito: NEX 60%.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Segurar o Gatilho' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sentido Tático', 'PODER_CLASSE', 'COMBATENTE',
  'Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena. Pré-requisitos: Int 2, treinado em Percepção e Tática.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sentido Tático' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tanque de Guerra', 'PODER_CLASSE', 'COMBATENTE',
  'Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2. Pré-requisito: Proteção Pesada.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tanque de Guerra' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tiro Certeiro', 'PODER_CLASSE', 'COMBATENTE',
  'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tiro Certeiro' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tiro de Cobertura', 'PODER_CLASSE', 'COMBATENTE',
  'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. Este é um efeito de medo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tiro de Cobertura' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Transcender', 'PODER_CLASSE', 'COMBATENTE',
  'Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Transcender' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Treinamento em Perícia', 'PODER_CLASSE', 'COMBATENTE',
  'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Treinamento em Perícia' AND classe = 'COMBATENTE' AND categoria = 'PODER_CLASSE'
);

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE COMBATENTE (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Aniquilador', 'TRILHA', 'COMBATENTE',
  'Você é treinado para abater alvos com eficiência e velocidade. NEX 10% - A Favorita: escolha uma arma favorita; a categoria da arma é reduzida em I. NEX 40% - Técnica Secreta: categoria reduzida em II; gaste 2 PE ao atacar para efeito Amplo (atinge alvo adicional adjacente com o mesmo teste) ou Destruidor (+1 no multiplicador de crítico); +2 PE por efeito adicional. NEX 65% - Técnica Sublime: adiciona efeito Letal (+2 na margem de ameaça, pode ser escolhido duas vezes para +5 total) e Perfurante (ignora até 5 de resistência a dano do alvo). NEX 99% - Máquina de Matar: categoria reduzida em III, +2 margem de ameaça e dano aumenta em um dado do mesmo tipo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Aniquilador' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Comandante de Campo', 'TRILHA', 'COMBATENTE',
  'Você é treinado para coordenar e auxiliar seus companheiros em combate, tomando decisões rápidas. NEX 10% - Inspirar Confiança: gaste reação e 2 PE para um aliado em alcance curto rolar novamente um teste recém realizado. NEX 40% - Estrategista: gaste ação padrão e 1 PE por aliado (limitado pelo Intelecto) em alcance curto; no próximo turno deles, ganham ação de movimento adicional. NEX 65% - Brecha na Guarda: quando aliado causar dano em inimigo no seu alcance curto, gaste reação e 2 PE para você ou outro aliado fazer ataque adicional; alcance de Inspirar Confiança e Estrategista aumenta para médio. NEX 99% - Oficial Comandante: gaste ação padrão e 5 PE para cada aliado visível em alcance médio receber ação padrão adicional em seu próximo turno.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Comandante de Campo' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Operações Especiais', 'TRILHA', 'COMBATENTE',
  'Você é um combatente eficaz cujas ações são calculadas e otimizadas, sempre antevendo os movimentos inimigos. NEX 10% - Iniciativa Aprimorada: +5 em Iniciativa e ação de movimento adicional na primeira rodada. NEX 40% - Ataque Extra: uma vez por rodada, gaste 2 PE para fazer um ataque adicional. NEX 65% - Surto de Adrenalina: uma vez por rodada, gaste 5 PE para realizar ação padrão ou de movimento adicional. NEX 99% - Sempre Alerta: você recebe uma ação padrão adicional no início de cada cena de combate.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Operações Especiais' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tropa de Choque', 'TRILHA', 'COMBATENTE',
  'Você é duro na queda, com corpo treinado para resistir a traumas físicos e proteger seus aliados. NEX 10% - Casca Grossa: +1 PV para cada 5% de NEX; ao bloquear, soma Vigor na resistência a dano recebida. NEX 40% - Cai Dentro: quando oponente adjacente ataca aliado, gaste reação e 1 PE para forçá-lo a atacar você (Vontade DT Vig evita; imune pelo resto da cena se passar). NEX 65% - Duro de Matar: ao sofrer dano não paranormal, gaste reação e 2 PE para reduzir à metade; em NEX 85%, funciona com dano paranormal. NEX 99% - Inquebrável: enquanto machucado, +5 na Defesa e resistência a dano 5; enquanto morrendo, não fica indefeso e ainda pode realizar ações.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tropa de Choque' AND classe = 'COMBATENTE' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVOS PODERES DE ESPECIALISTA (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Artista Marcial', 'PODER_CLASSE', 'ESPECIALISTA',
  'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Artista Marcial' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Balística Avançada', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Balística Avançada' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Conhecimento Aplicado', 'PODER_CLASSE', 'ESPECIALISTA',
  'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int. Pré-requisito: Int 2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Conhecimento Aplicado' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Hacker', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa. Pré-requisito: treinado em Tecnologia.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Hacker' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Mãos Rápidas', 'PODER_CLASSE', 'ESPECIALISTA',
  'Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre. Pré-requisitos: Agi 3, treinado em Crime.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Mãos Rápidas' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Mochila de Utilidades', 'PODER_CLASSE', 'ESPECIALISTA',
  'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Mochila de Utilidades' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Movimento Tático', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno. Pré-requisito: treinado em Atletismo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Movimento Tático' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Na Trilha Certa', 'PODER_CLASSE', 'ESPECIALISTA',
  'Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +5 no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +10 no próximo teste, e assim por diante).',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Na Trilha Certa' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Nerd', 'PODER_CLASSE', 'ESPECIALISTA',
  'Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (dica para pista em investigação, fraqueza de inimigo em combate, etc.).',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Nerd' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ninja Urbano', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com armas de corpo a corpo e de disparo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ninja Urbano' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Pensamento Ágil', 'PODER_CLASSE', 'ESPECIALISTA',
  'Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Pensamento Ágil' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Perito em Explosivos', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Perito em Explosivos' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Primeira Impressão', 'PODER_CLASSE', 'ESPECIALISTA',
  'Você recebe +5 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Primeira Impressão' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Transcender', 'PODER_CLASSE', 'ESPECIALISTA',
  'Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Transcender' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Treinamento em Perícia', 'PODER_CLASSE', 'ESPECIALISTA',
  'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Treinamento em Perícia' AND classe = 'ESPECIALISTA' AND categoria = 'PODER_CLASSE'
);

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE ESPECIALISTA (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Médico de Campo', 'TRILHA', 'ESPECIALISTA',
  'Você é treinado em técnicas de primeiros socorros e tratamento de emergência. Requer treinamento em Medicina e kit de medicina. NEX 10% - Paramédico: ação padrão e 2 PE para curar 2d10 PV de si ou aliado adjacente (+1d10 por +1 PE em NEX 40%, 65% e 99%). NEX 40% - Equipe de Trauma: ação padrão e 2 PE para remover condição negativa (exceto morrendo) de aliado adjacente. NEX 65% - Resgate: uma vez por rodada, mova-se até aliado machucado com ação livre; ao curar ou remover condição, você e aliado ganham +5 na Defesa até seu próximo turno; espaços para carregar personagem reduzidos à metade. NEX 99% - Reanimação: uma vez por cena, ação completa e 10 PE para trazer de volta personagem morto na mesma cena (exceto por dano massivo).',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Médico de Campo' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Negociador', 'TRILHA', 'ESPECIALISTA',
  'Você é um diplomata habilidoso e consegue influenciar outras pessoas por lábia ou intimidação. NEX 10% - Eloquência: ação completa e 1 PE por alvo em alcance curto; teste de Diplomacia/Enganação/Intimidação contra Vontade; se vencer, alvo fica fascinado enquanto você se concentrar (alvo hostil tem direito a novo teste por rodada). NEX 40% - Discurso Motivador: ação padrão e 4 PE para você e aliados em alcance curto ganharem +5 em perícias até fim da cena (a partir de NEX 65%, pode gastar 8 PE para +10). NEX 65% - Eu Conheço um Cara: uma vez por missão, use rede de contatos para um favor (troca de equipamento, descanso, resgate). NEX 99% - Truque de Mestre: gaste 5 PE para simular efeito de qualquer habilidade vista por aliado na cena; ignora pré-requisitos mas paga todos os custos.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Negociador' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Técnico', 'TRILHA', 'ESPECIALISTA',
  'Sua principal habilidade é a manutenção e reparo do equipamento que seu time carrega em missão. NEX 10% - Inventário Otimizado: soma Intelecto à Força para calcular capacidade de carga. NEX 40% - Remendão: ação completa e 1 PE para remover condição "quebrado" de equipamento adjacente até fim da cena; equipamentos gerais têm categoria reduzida em I para você. NEX 65% - Improvisar: gaste ação completa e 2 PE (mais 2 PE por categoria do item) para criar versão funcional de equipamento geral com materiais ao redor (inútil ao fim da cena). NEX 99% - Preparado para Tudo: gaste ação de movimento e 3 PE por categoria para encontrar qualquer item (exceto armas) que precise em seu inventário.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Técnico' AND classe = 'ESPECIALISTA' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVOS PODERES DE OCULTISTA (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Camuflar Ocultismo', 'PODER_CLASSE', 'OCULTISTA',
  'Você pode gastar uma ação livre para esconder símbolos e sigilos em objetos ou em sua pele, tornando-os invisíveis para outros além de você. Quando lança um ritual, pode gastar +2 PE para lançá-lo sem componentes ritualísticos e sem gesticular (permite conjurar com as mãos presas). Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25).',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Camuflar Ocultismo' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Criar Selo', 'PODER_CLASSE', 'OCULTISTA',
  'Você sabe fabricar selos paranormais de rituais que conheça. Fabricar um selo gasta uma ação de interlúdio e PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Criar Selo' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Envolto em Mistério', 'PODER_CLASSE', 'OCULTISTA',
  'Sua aparência e postura assombrosas permitem manipular e assustar pessoas ignorantes ou supersticiosas. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Envolto em Mistério' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Especialista em Elemento', 'PODER_CLASSE', 'OCULTISTA',
  'Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Especialista em Elemento' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ferramentas Paranormais', 'PODER_CLASSE', 'OCULTISTA',
  'Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ferramentas Paranormais' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Fluxo de Poder', 'PODER_CLASSE', 'OCULTISTA',
  'Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com apenas uma ação livre, pagando o custo de cada efeito separadamente. Pré-requisito: NEX 60%.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Fluxo de Poder' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Guiado pelo Paranormal', 'PODER_CLASSE', 'OCULTISTA',
  'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Guiado pelo Paranormal' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Identificação Paranormal', 'PODER_CLASSE', 'OCULTISTA',
  'Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Identificação Paranormal' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Improvisar Componentes', 'PODER_CLASSE', 'OCULTISTA',
  'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Improvisar Componentes' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Intuição Paranormal', 'PODER_CLASSE', 'OCULTISTA',
  'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Intuição Paranormal' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Mestre em Elemento', 'PODER_CLASSE', 'OCULTISTA',
  'Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. Essa redução se acumula com outras fontes. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Mestre em Elemento' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ritual Potente', 'PODER_CLASSE', 'OCULTISTA',
  'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pré-requisito: Int 2.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ritual Potente' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ritual Predileto', 'PODER_CLASSE', 'OCULTISTA',
  'Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ritual Predileto' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tatuagem Ritualística', 'PODER_CLASSE', 'OCULTISTA',
  'Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tatuagem Ritualística' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Transcender', 'PODER_CLASSE', 'OCULTISTA',
  'Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Transcender' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Treinamento em Perícia', 'PODER_CLASSE', 'OCULTISTA',
  'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Treinamento em Perícia' AND classe = 'OCULTISTA' AND categoria = 'PODER_CLASSE'
);

-- ---------------------------------------------------------------
-- NOVAS TRILHAS DE OCULTISTA (LIVRO BASE)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Conduíte', 'TRILHA', 'OCULTISTA',
  'Você domina os aspectos fundamentais da conjuração de rituais, aumentando alcance e velocidade das conjurações. NEX 10% - Ampliar Ritual: gaste +2 PE para aumentar o alcance em um passo (curto→médio→longo→extremo) ou dobrar a área de efeito. NEX 40% - Acelerar Ritual: uma vez por rodada, aumente o custo de um ritual em 4 PE para conjurá-lo como ação livre. NEX 65% - Anular Ritual: ao ser alvo de ritual, gaste PE iguais ao custo do ritual e faça teste oposto de Ocultismo; se vencer, anula o ritual e cancela todos os seus efeitos. NEX 99% - Canalizar o Medo: você aprende o ritual Canalizar o Medo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Conduíte' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Graduado', 'TRILHA', 'OCULTISTA',
  'Você foca seus estudos em se tornar um conjurador versátil e poderoso. NEX 10% - Saber Ampliado: aprende um ritual de 1º círculo; ao ganhar acesso a novo círculo, aprende um ritual adicional daquele círculo (não conta no limite). NEX 40% - Grimório Ritualístico: cria grimório que armazena rituais (Intelecto em número por círculo); para conjurar ritual do grimório, empunhe-o e gaste ação completa folheando-o. NEX 65% - Rituais Eficientes: a DT para resistir a todos os seus rituais aumenta em +5. NEX 99% - Conhecendo o Medo: você aprende o ritual Conhecendo o Medo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Graduado' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Intuitivo', 'TRILHA', 'OCULTISTA',
  'Você preparou sua mente para resistir aos efeitos do Outro Lado, expandindo os limites de suas capacidades paranormais. NEX 10% - Mente Sã: resistência paranormal +5 (+5 em testes de resistência contra efeitos paranormais). NEX 40% - Presença Poderosa: adiciona Presença ao limite de PE por turno, mas apenas para conjurar rituais. NEX 65% - Inabalável: resistência a dano mental e paranormal 10; ao passar no teste de Vontade contra efeito paranormal que reduz dano à metade, você não sofre dano algum. NEX 99% - Presença do Medo: você aprende o ritual Presença do Medo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Intuitivo' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Lâmina Paranormal', 'TRILHA', 'OCULTISTA',
  'Você aprendeu e dominou técnicas de luta mesclando conjuração com habilidades de combate. NEX 10% - Lâmina Maldita: aprende o ritual Amaldiçoar Arma; gaste +1 PE para reduzir tempo de conjuração para movimento; ao conjurar, pode usar Ocultismo em vez de Luta/Pontaria para ataques com a arma amaldiçoada. NEX 40% - Gladiador Paranormal: ao acertar ataque corpo a corpo, recebe 2 PE temporários (máximo igual ao limite de PE por cena; somem ao fim da cena). NEX 65% - Conjuração Marcial: uma vez por rodada ao lançar ritual como ação padrão, gaste 2 PE para fazer ataque corpo a corpo como ação livre. NEX 99% - Lâmina do Medo: você aprende o ritual Lâmina do Medo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Lâmina Paranormal' AND classe = 'OCULTISTA' AND categoria = 'TRILHA'
);

-- ---------------------------------------------------------------
-- NOVOS PODERES GERAIS (SOBREVIVENDO AO HORROR)
-- ---------------------------------------------------------------

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Acrobático', 'PODER_GERAL', 'GERAL',
  'Você possui um talento natural para piruetas, cambalhotas e outras acrobacias complexas. Você recebe treinamento em Acrobacia ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, terreno difícil não reduz seu deslocamento nem o impede de realizar investidas. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Acrobático' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Ás do Volante', 'PODER_GERAL', 'GERAL',
  'Você é um apaixonado por velocidade e tem a coragem necessária para executar qualquer manobra. Você recebe treinamento em Pilotagem ou, se já for treinado, recebe +2 nela. Além disso, uma vez por rodada, quando um veículo que você está pilotando sofre dano, você pode fazer um teste de Pilotagem (DT igual ao resultado do teste de ataque ou à DT do efeito que causou o dano). Se passar, evita esse dano. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Ás do Volante' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Atlético', 'PODER_GERAL', 'GERAL',
  'Você possui um corpo atlético, resultado de fortuita disposição genética ou árduo treinamento. Você recebe treinamento em Atletismo ou, se já for treinado, recebe +2 nela. Além disso, recebe +3m em seu deslocamento. Pré-requisito: For 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Atlético' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Atraente', 'PODER_GERAL', 'GERAL',
  'Seja por pura beleza física ou por sua postura e atitude, você atrai olhares por onde passa. Você recebe +5 em testes de Artes, Diplomacia, Enganação e Intimidação contra pessoas que possam se sentir fisicamente atraídas por você. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Atraente' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Dedos Ágeis', 'PODER_GERAL', 'GERAL',
  'Você possui uma motricidade fina precisa, particularmente útil para manipular ferramentas delicadas. Você recebe treinamento em Crime ou, se já for treinado, recebe +2 nela. Além disso, pode arrombar com uma ação padrão, furtar com uma ação livre (apenas uma vez por rodada) e sabotar com uma ação completa. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Dedos Ágeis' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Detector de Mentiras', 'PODER_GERAL', 'GERAL',
  'Você possui uma aptidão para perceber os sutis sinais de alguém que está mentindo. Você recebe treinamento em Intuição ou, se já for treinado, recebe +2 nela. Além disso, outros seres sofrem uma penalidade de –10 em testes de Enganação para mentir para você. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Detector de Mentiras' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Especialista em Emergências', 'PODER_GERAL', 'GERAL',
  'Você recebeu treinamento como socorrista de emergência e sabe tratar um paciente em situações de urgência. Você recebe treinamento em Medicina ou, se já for treinado, recebe +2 nela. Além disso, pode aplicar cicatrizantes e medicamentos como uma ação de movimento e, uma vez por rodada, pode sacar um desses itens como uma ação livre. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Especialista em Emergências' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Estigmado', 'PODER_GERAL', 'GERAL',
  'A adrenalina causada pela dor faz você se manter focado no que está acontecendo. Sempre que sofre dano mental de efeitos de medo, você pode converter esse dano em perda de pontos de vida (se sofre 5 pontos de dano mental de medo, pode, em vez disso, perder 5 pontos de vida).',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Estigmado' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Foco em Perícia', 'PODER_GERAL', 'GERAL',
  'Você se dedicou a estudar e treinar os vários pormenores de uma área de conhecimento específica. Escolha uma perícia (exceto Luta e Pontaria). Quando faz um teste dessa perícia, você rola +5. Você pode escolher este poder outras vezes para perícias diferentes. Pré-requisito: treinado na perícia escolhida.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Foco em Perícia' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Informado', 'PODER_GERAL', 'GERAL',
  'Você passa bastante tempo consumindo notícias sobre o mundo ao seu redor. Você recebe treinamento em Atualidades ou, se já for treinado, recebe +2 nela. Além disso, pode usar Atualidades no lugar de qualquer outra perícia para testes envolvendo informações, desde que aprovado pelo mestre. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Informado' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Interrogador', 'PODER_GERAL', 'GERAL',
  'Você sabe como usar o medo para extrair todo tipo de informação das outras pessoas. Você recebe treinamento em Intimidação ou, se já for treinado, recebe +2 nela. Além disso, pode fazer testes de Intimidação para coagir como uma ação padrão, mas apenas uma vez por cena contra a mesma pessoa. Pré-requisito: For 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Interrogador' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Inventário Organizado', 'PODER_GERAL', 'GERAL',
  'Você sabe como organizar sua mochila e equipamento de forma organizada e racional. Você soma seu Intelecto no limite de espaços que pode carregar. Para você, itens muito leves ou pequenos que normalmente ocupam meio espaço (0,5) passam a ocupar 1/4 de espaço (0,25). Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Inventário Organizado' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Mentiroso Nato', 'PODER_GERAL', 'GERAL',
  'Você é um cara de pau, capaz de mentir descaradamente sem que ninguém perceba. Você recebe treinamento em Enganação ou, se já for treinado, recebe +2 nela. Além disso, a penalidade que você sofre por mentiras muito implausíveis diminui para –5. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Mentiroso Nato' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Observador', 'PODER_GERAL', 'GERAL',
  'Você possui uma combinação de sentidos apurados para perceber pistas e intelecto afiado para processá-las. Você recebe treinamento em Investigação ou, se já for treinado, recebe +2 nela. Além disso, soma seu Intelecto em Intuição. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Observador' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Pai de Pet', 'PODER_GERAL', 'GERAL',
  'Você adora animais e cuida de seus pets como se fossem seus filhos. Você recebe treinamento em Adestramento ou, se já for treinado, recebe +2 nela. Além disso, possui um animal de estimação aliado que o auxilia e acompanha em suas aventuras. Em termos de jogo, é um aliado que fornece +2 em duas perícias à sua escolha (exceto Luta ou Pontaria, aprovadas pelo mestre). Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Pai de Pet' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Palavras de Devoção', 'PODER_GERAL', 'GERAL',
  'Você combina uma fé verdadeira com o conhecimento dos ritos e tradições de sua religião. Você recebe treinamento em Religião ou, se já for treinado, recebe +2 nela. Além disso, uma vez por cena, pode gastar 3 PE e uma ação completa para executar uma oração para um número de pessoas até o dobro de sua Presença. Até o fim da cena, todos os participantes recebem resistência a dano mental 5. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Palavras de Devoção' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Parceiro', 'PODER_GERAL', 'GERAL',
  'Em algum momento da sua vida, você conquistou uma amizade fiel e verdadeira. Você possui um parceiro aliado de um tipo à sua escolha que o acompanha e auxilia em suas missões. Ele obedece às suas ordens e se arrisca para ajudá-lo, mas se for maltratado pode parar de segui-lo. Se perder seu aliado, precisa gastar uma folga da Ordem para receber outro. Pré-requisitos: treinado em Diplomacia, NEX 30%.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Parceiro' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Pensamento Tático', 'PODER_GERAL', 'GERAL',
  'Você possui uma mente voltada para análises táticas e pensamento estratégico. Você recebe treinamento em Tática ou, se já for treinado, recebe +2 nela. Além disso, quando você passa em um teste de Tática para analisar terreno, você e seus aliados em alcance médio recebem uma ação de movimento adicional na primeira rodada do próximo combate neste terreno (desde que ocorra até o fim do dia). Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Pensamento Tático' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Personalidade Esotérica', 'PODER_GERAL', 'GERAL',
  'Você sempre teve uma afinidade com assuntos esotéricos. Você recebe +3 PE e recebe treinamento em Ocultismo. Se já for treinado nesta perícia, recebe +2 nela. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Personalidade Esotérica' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Persuasivo', 'PODER_GERAL', 'GERAL',
  'Você possui uma personalidade diplomática e sabe obter o que deseja por meio de argumentação e conversa. Você recebe treinamento em Diplomacia ou, se já for treinado, recebe +2 nela. Além disso, ao fazer um teste para persuasão, a penalidade que você sofre por pedir coisas custosas ou perigosas diminui em –5. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Persuasivo' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Pesquisador Científico', 'PODER_GERAL', 'GERAL',
  'Você possui um profundo respeito pela ciência e acredita que ela é a resposta para muitos de seus questionamentos. Você recebe treinamento em Ciências ou, se já for treinado, recebe +2 nela. Além disso, você pode usar Ciências no lugar de Ocultismo e Sobrevivência para identificar criaturas e animais, respectivamente. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Pesquisador Científico' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Proativo', 'PODER_GERAL', 'GERAL',
  'Seu negócio é fazer as coisas e não deixar para depois. Você recebe treinamento em Iniciativa ou, se já for treinado, recebe +2 nela. Além disso, ao rolar um 19 ou 20 em pelo menos um dos dados de um teste de Iniciativa, você recebe uma ação padrão adicional em seu primeiro turno. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Proativo' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Provisões de Emergência', 'PODER_GERAL', 'GERAL',
  'Você é um sujeito precavido e mantém uma reserva secreta para quando as coisas ficarem ruins. Você possui um esconderijo com equipamentos e suprimentos para uma situação de emergência. Uma vez por missão, pode usar uma ação de interlúdio para recuperar o conteúdo de seu esconderijo. Você recebe novos equipamentos à sua escolha equivalentes à sua patente no início desta missão.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Provisões de Emergência' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Racionalidade Inflexível', 'PODER_GERAL', 'GERAL',
  'Suas convicções e sua visão de mundo são baseadas em argumentos racionais e lógicos. Você pode usar Intelecto no lugar de Presença como atributo-chave de Vontade e para calcular seus pontos de esforço. Pré-requisito: Int 3.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Racionalidade Inflexível' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Rato de Computador', 'PODER_GERAL', 'GERAL',
  'Você adora computadores e outros dispositivos tecnológicos. Você recebe treinamento em Tecnologia ou, se já for treinado, recebe +2 nela. Você pode hackear, localizar arquivo ou operar dispositivo como uma ação completa e, uma vez por cena de investigação, se tiver acesso a um computador, pode fazer um teste de Tecnologia para procurar pistas sem gastar uma rodada de investigação. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Rato de Computador' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Resposta Rápida', 'PODER_GERAL', 'GERAL',
  'Seus reflexos são tão apurados que o permitem agir antes mesmo de você perceber as ameaças de forma consciente. Você recebe treinamento em Reflexos ou, se já for treinado, recebe +2 nela. Além disso, ao falhar em um teste de Percepção para evitar ficar desprevenido, você pode gastar 2 PE para rolar novamente o teste usando Reflexos. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Resposta Rápida' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sentidos Aguçados', 'PODER_GERAL', 'GERAL',
  'Todos os seus sentidos são mais aguçados que o normal. Você recebe treinamento em Percepção ou, se já for treinado nessa perícia, recebe +2 nela. Além disso, não fica desprevenido contra inimigos que não possa ver e, sempre que erra um ataque devido a camuflagem, pode rolar mais uma vez o dado da chance de falha. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sentidos Aguçados' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sobrevivencialista', 'PODER_GERAL', 'GERAL',
  'Você aprecia — ou aprecia enfrentar — a natureza. Você recebe treinamento em Sobrevivência ou, se já for treinado, recebe +2 nela. Além disso, você recebe +2 em testes para resistir a efeitos de clima e terreno difícil natural não reduz seu deslocamento nem impede que você execute investidas. Pré-requisito: Int 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sobrevivencialista' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Sorrateiro', 'PODER_GERAL', 'GERAL',
  'Você sabe ser discreto em qualquer situação. Você recebe treinamento em Furtividade ou, se já for treinado, recebe +2 nela. Além disso, você não sofre penalidades por se mover normalmente enquanto está furtivo, nem por seguir alguém em ambientes sem esconderijos ou sem movimento. Pré-requisito: Agi 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Sorrateiro' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Talentoso', 'PODER_GERAL', 'GERAL',
  'Você possui inclinação para todas as formas de expressão artística. Você recebe treinamento em Artes ou, se já for treinado, recebe +2 nela. Além disso, quando faz um teste de Artes para impressionar, o bônus em perícias que você recebe aumenta em +1 para cada 5 pontos adicionais em que o resultado de seu teste passar a DT. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Talentoso' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Teimosia Obstinada', 'PODER_GERAL', 'GERAL',
  'As pessoas chamam você de teimoso. Você recebe treinamento em Vontade ou, se já for treinado, recebe +2 nela. Além disso, quando faz um teste de Vontade contra um efeito que cause uma condição mental ou tente modificar sua categoria de atitude (como o ritual Enfeitiçar), você pode gastar 2 PE para receber +5 neste teste. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Teimosia Obstinada' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tenacidade', 'PODER_GERAL', 'GERAL',
  'Seu corpo desenvolveu a capacidade de suportar rigores extremos. Você recebe treinamento em Fortitude ou, se já for treinado, recebe +2 nela. Além disso, ao estar morrendo mas consciente (com pelo menos 1 PV), você pode fazer um teste de Fortitude (DT 20 + 10 por teste anterior na mesma cena) como ação livre. Se for bem-sucedido, encerra a condição morrendo. Pré-requisito: Vig 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tenacidade' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Tiro Certeiro', 'PODER_GERAL', 'GERAL',
  'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.',
  'LIVRO_BASE'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Tiro Certeiro' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Vitalidade Reforçada', 'PODER_GERAL', 'GERAL',
  'Você possui uma capacidade superior de suportar ferimentos. Você recebe +1 PV para cada 5% de NEX (ou para cada nível, se estiver usando a regra de nível de experiência) e +2 em Fortitude. Pré-requisito: Vig 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Vitalidade Reforçada' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);

INSERT INTO habilidades (nome, categoria, classe, descricao, fonte)
SELECT 'Vontade Inabalável', 'PODER_GERAL', 'GERAL',
  'Sua mente é preparada para suportar os mais rigorosos traumas. Você recebe +1 PE para cada 10% de NEX (ou para cada 2 níveis, se estiver usando a regra de nível de experiência) e +2 em Vontade. Pré-requisito: Pre 2.',
  'SOBREVIVENDO_AO_HORROR'
WHERE NOT EXISTS (
  SELECT 1 FROM habilidades WHERE nome = 'Vontade Inabalável' AND classe = 'GERAL' AND categoria = 'PODER_GERAL'
);
