-- ============================================================
-- SEED: Equipamentos — Ordem Paranormal RPG
-- Fontes: Livro Base (LIVRO_BASE) + Sobrevivendo ao Horror (SOBREVIVENDO_AO_HORROR)
-- Exclusão prévia de placeholders e recarga completa
-- ============================================================

DELETE FROM itens;

-- ============================================================
-- MUNIÇÕES
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Balas Curtas',    'MUNICAO', NULL, '0', 1, 'Munição para pistolas, revólveres e submetralhadoras. Um pacote dura duas cenas.', 'LIVRO_BASE'),
('Balas Longas',    'MUNICAO', NULL, 'I', 1, 'Munição para fuzis e metralhadoras. Um pacote dura uma cena.', 'LIVRO_BASE'),
('Cartuchos',       'MUNICAO', NULL, 'I', 1, 'Munição para espingardas, carregada com esferas de chumbo. Um pacote dura uma cena.', 'LIVRO_BASE'),
('Combustível',     'MUNICAO', NULL, 'I', 1, 'Tanque de combustível para lança-chamas. Dura uma cena.', 'LIVRO_BASE'),
('Flechas',         'MUNICAO', NULL, '0', 1, 'Flechas para arcos e bestas. Podem ser reaproveitadas; um pacote dura uma missão inteira.', 'LIVRO_BASE'),
('Foguete',         'MUNICAO', NULL, 'I', 1, 'Disparado por bazucas. Ao contrário de outras munições, cada foguete dura um único disparo.', 'LIVRO_BASE');

-- ============================================================
-- PROTEÇÕES
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, defesa, descricao, fonte) VALUES
('Proteção Leve',  'PROTECAO', NULL, 'I',  2, 5,  'Jaqueta de couro pesada ou colete de kevlar. Tipicamente usada por seguranças e policiais.', 'LIVRO_BASE'),
('Proteção Pesada','PROTECAO', NULL, 'II', 5, 10, 'Equipamento de forças especiais: capacete, ombreiras, joelheiras, caneleiras e colete multicamadas de kevlar. Fornece resistência a balístico, corte, impacto e perfuração 2. Impõe –5 em testes de perícia afetados por carga.', 'LIVRO_BASE'),
('Escudo',         'PROTECAO', NULL, 'I',  2, 2,  'Escudo medieval ou moderno, como os usados por tropas de choque. Deve ser empunhado em uma mão. Bônus de Defesa acumula com proteções.', 'LIVRO_BASE');

-- ============================================================
-- ARMAS SIMPLES — Corpo a Corpo Leve (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Faca',    'ARMA','CORPO_LEVE','SIMPLES','0',1,'1d4','19','Curto','C','["agil","arremesso"]',
 'Uma lâmina afiada — navalha, faca de churrasco ou militar. É uma arma ágil e pode ser arremessada.','LIVRO_BASE'),
('Martelo', 'ARMA','CORPO_LEVE','SIMPLES','0',1,'1d6','x2',NULL,'I','[]',
 'Ferramenta comum usada como arma na falta de opções melhores.','LIVRO_BASE'),
('Punhal',  'ARMA','CORPO_LEVE','SIMPLES','0',1,'1d4','x3',NULL,'P','["agil"]',
 'Faca de lâmina longa e pontiaguda, usada por cultistas em rituais. É uma arma ágil.','LIVRO_BASE');

-- ============================================================
-- ARMAS SIMPLES — Corpo a Corpo Uma Mão (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Bastão',  'ARMA','CORPO_UMA_MAO','SIMPLES','0',1,'1d6/1d8','x2',NULL,'I','["versatil"]',
 'Cilindro de madeira maciça — taco de beisebol, cassetete, tonfa ou clava. Pode ser empunhado com uma mão (1d6) ou com as duas (1d8).','LIVRO_BASE'),
('Machete', 'ARMA','CORPO_UMA_MAO','SIMPLES','0',1,'1d6','19',NULL,'C','["agil"]',
 'Lâmina longa e larga, muito usada como ferramenta para abrir trilhas.','LIVRO_BASE'),
('Lança',   'ARMA','CORPO_UMA_MAO','SIMPLES','0',1,'1d6','x2','Curto','P','["arremesso"]',
 'Haste de madeira com ponta metálica afiada. Pode ser arremessada.','LIVRO_BASE');

-- ============================================================
-- ARMAS SIMPLES — Corpo a Corpo Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Cajado', 'ARMA','CORPO_DUAS_MAOS','SIMPLES','0',2,'1d6/1d6','x2',NULL,'I','["agil"]',
 'Cabo longo de madeira ou barra de ferro. Arma ágil. Pode ser usado com Combater com Duas Armas como se fossem duas armas de uma mão.','LIVRO_BASE');

-- ============================================================
-- ARMAS SIMPLES — Disparo Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Arco',  'ARMA','DISPARO_DUAS_MAOS','SIMPLES','0',2,'1d6','x3','Médio','P','[]',
 'Arco e flecha comum, próprio para tiro ao alvo.','LIVRO_BASE'),
('Besta', 'ARMA','DISPARO_DUAS_MAOS','SIMPLES','0',2,'1d8','19','Médio','P','[]',
 'Arma da antiguidade. Exige uma ação de movimento para ser recarregada a cada disparo.','LIVRO_BASE');

-- ============================================================
-- ARMAS DE FOGO — Leves (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Pistola',   'ARMA','FOGO_LEVE','SIMPLES','I',1,'1d12','18','Curto','B','[]',
 'Arma de mão comum entre policiais e militares, facilmente recarregável.','LIVRO_BASE'),
('Revólver',  'ARMA','FOGO_LEVE','SIMPLES','I',1,'2d6','19/x3','Curto','B','[]',
 'A arma de fogo mais comum e uma das mais confiáveis.','LIVRO_BASE');

-- ============================================================
-- ARMAS DE FOGO — Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Fuzil de Caça', 'ARMA','FOGO_DUAS_MAOS','SIMPLES','I',2,'2d8','19/x3','Médio','B','[]',
 'Arma de fogo popular entre fazendeiros, caçadores e atiradores esportistas.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Corpo a Corpo Leve (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Machadinha', 'ARMA','CORPO_LEVE','TATICA','0',1,'1d6','x3','Curto','C','["arremesso"]',
 'Ferramenta para cortar madeira, comum em fazendas. Pode ser arremessada.','LIVRO_BASE'),
('Nunchaku',   'ARMA','CORPO_LEVE','TATICA','0',1,'1d8','x2',NULL,'I','["agil"]',
 'Dois bastões curtos ligados por uma corrente. Arma ágil.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Corpo a Corpo Uma Mão (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Corrente', 'ARMA','CORPO_UMA_MAO','TATICA','0',1,'1d8','x2',NULL,'I','[]',
 'Pedaço de corrente grossa. Fornece +2 em testes para desarmar e derrubar.','LIVRO_BASE'),
('Espada',   'ARMA','CORPO_UMA_MAO','TATICA','I',1,'1d8/1d10','19',NULL,'C','["versatil"]',
 'Espada longa medieval ou cimitarra. Pode ser empunhada com uma mão (1d8) ou com as duas (1d10).','LIVRO_BASE'),
('Florete',  'ARMA','CORPO_UMA_MAO','TATICA','I',1,'1d6','18',NULL,'C','["agil"]',
 'Espada de lâmina fina usada por esgrimistas. Arma ágil.','LIVRO_BASE'),
('Machado',  'ARMA','CORPO_UMA_MAO','TATICA','I',1,'1d8','x3',NULL,'C','[]',
 'Ferramenta importante para lenhadores e bombeiros, capaz de causar ferimentos terríveis.','LIVRO_BASE'),
('Maça',     'ARMA','CORPO_UMA_MAO','TATICA','I',1,'2d4','x2',NULL,'I','[]',
 'Bastão com cabeça metálica cheia de protuberâncias.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Corpo a Corpo Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Acha',      'ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'1d12','x3',NULL,'C','[]',
 'Machado grande e pesado, usado no corte de árvores largas.','LIVRO_BASE'),
('Gadanho',   'ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'2d4','x4',NULL,'C','[]',
 'Ferramenta agrícola — versão maior da foice. Criada para ceifar cereais, também pode ceifar vidas.','LIVRO_BASE'),
('Katana',    'ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'1d10','19',NULL,'C','["agil"]',
 'Espada longa japonesa levemente curvada. Arma ágil. Se veterano em Luta, pode usá-la com uma mão.','LIVRO_BASE'),
('Marreta',   'ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'3d4','x2',NULL,'I','[]',
 'Normalmente para demolir paredes; também pode demolir pessoas.','LIVRO_BASE'),
('Montante',  'ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'2d6','19',NULL,'C','[]',
 'Enorme espada de 1,5m de comprimento — uma das armas mais poderosas de seu tempo.','LIVRO_BASE'),
('Motosserra','ARMA','CORPO_DUAS_MAOS','TATICA','I',2,'3d6','x2',NULL,'C','[]',
 'Ferramenta capaz de causar ferimentos profundos. Ao rolar 6 em um dado, role um dado adicional. Impõe –O nos testes. Ligar gasta uma ação de movimento.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Disparo Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Arco Composto','ARMA','DISPARO_DUAS_MAOS','TATICA','I',2,'1d10','x3','Médio','P','["forca_dano"]',
 'Arco moderno com sistema de roldanas. Permite aplicar Força às rolagens de dano.','LIVRO_BASE'),
('Balestra',     'ARMA','DISPARO_DUAS_MAOS','TATICA','I',2,'1d12','19','Médio','P','[]',
 'Besta pesada capaz de disparos poderosos. Exige uma ação de movimento para recarregar a cada disparo.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Fogo Uma Mão (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Submetralhadora','ARMA','FOGO_UMA_MAO','TATICA','I',1,'2d6','19/x3','Curto','B','["automatica"]',
 'Arma de fogo automática compacta que pode ser empunhada com apenas uma mão.','LIVRO_BASE');

-- ============================================================
-- ARMAS TÁTICAS — Fogo Duas Mãos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Espingarda',      'ARMA','FOGO_DUAS_MAOS','TATICA','I',2,'4d6','x3','Curto','B','[]',
 'Arma de fogo longa com cano liso. Causa metade do dano em alcance médio ou maior.','LIVRO_BASE'),
('Fuzil de Assalto','ARMA','FOGO_DUAS_MAOS','TATICA','II',2,'2d10','19/x3','Médio','B','["automatica"]',
 'Arma de fogo padrão da maioria dos exércitos modernos. Arma automática.','LIVRO_BASE'),
('Fuzil de Precisão','ARMA','FOGO_DUAS_MAOS','TATICA','III',2,'2d10','19/x3','Longo','B','[]',
 'Arma de fogo militar para disparos precisos de longa distância. Se veterano em Pontaria e mirar, recebe +5 na margem de ameaça.','LIVRO_BASE');

-- ============================================================
-- ARMAS PESADAS (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Bazuca',       'ARMA','PESADA','PESADA','III',2,'10d8','x2','Médio','I','["area"]',
 'Lança-foguetes anti-tanques. Causa dano no alvo e em todos em raio de 3m (Reflexos DT Agi para metade). Exige ação de movimento para recarregar.','LIVRO_BASE'),
('Lança-chamas', 'ARMA','PESADA','PESADA','III',2,'6d6','x2','Curto','Fogo','["area","linha"]',
 'Esguicha líquido inflamável em linha de 1,5m × alcance curto. Atinge todos na área; seres atingidos ficam em chamas.','LIVRO_BASE'),
('Metralhadora', 'ARMA','PESADA','PESADA','II',2,'2d12','19/x3','Médio','B','["automatica"]',
 'Arma de fogo pesada militar. Exige Força 4 ou apoio em tripé; caso contrário, –5 em ataques. Arma automática.','LIVRO_BASE');

-- ============================================================
-- ARMAS — Sobrevivendo ao Horror
-- ============================================================

-- Simples — Disparo Uma Mão
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Pregador Pneumático','ARMA','FOGO_LEVE','SIMPLES','0',1,'1d4','x4','Curto','P','[]',
 'Aparelho semelhante a uma pistola que dispara pregos sob pressão. Conta como arma de fogo para poderes. Armazena 300 pregos; dura uma missão.','SOBREVIVENDO_AO_HORROR');

-- Simples — Disparo Duas Mãos
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Estilingue','ARMA','DISPARO_DUAS_MAOS','SIMPLES','0',1,'1d4','x2','Curto','I','["forca_dano"]',
 'Permite aplicar Força às rolagens de dano. Dispara bolinhas reutilizáveis (ou pedrinhas); um pacote dura uma missão. Pode arremessar granadas em alcance longo.','SOBREVIVENDO_AO_HORROR');

-- Táticas — Corpo a Corpo Leve
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Baioneta',    'ARMA','CORPO_LEVE','TATICA','0',1,'1d4','19',NULL,'P','[]',
 'Lâmina fixada em fuzil. Gastar ação de movimento para fixar; torna a arma ágil e aumenta dano para 1d6. Ainda pode atirar com –O em ataques à distância.','SOBREVIVENDO_AO_HORROR'),
('Faca Tática', 'ARMA','CORPO_LEVE','TATICA','I',1,'1d6','19','Curto','C','["agil"]',
 'Faca balanceada para contra-ataques e bloqueios. +2 no ataque no contra-ataque. No bloqueio, pode gastar 2 PE e sacrificar a faca para +20 RD. Arma ágil e pode ser arremessada.','SOBREVIVENDO_AO_HORROR'),
('Gancho de Carne','ARMA','CORPO_LEVE','TATICA','0',1,'1d4','x4',NULL,'P','[]',
 'Gancho metálico de frigorífico. Se amarrado a corda/corrente, alcance aumenta para 4,5m e passa a ocupar 2 espaços.','SOBREVIVENDO_AO_HORROR');

-- Táticas — Corpo a Corpo Uma Mão
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Bastão Policial','ARMA','CORPO_UMA_MAO','TATICA','I',1,'1d6','x2','Curto','I','["agil"]',
 'Bastão com guarda lateral. +1 na Defesa ao usar esquiva com ele. Arma ágil.','SOBREVIVENDO_AO_HORROR'),
('Picareta',       'ARMA','CORPO_UMA_MAO','TATICA','0',1,'1d6','x4',NULL,'P','[]',
 'Ferramenta de mineração e demolição, empregada em combate na falta de armas adequadas.','SOBREVIVENDO_AO_HORROR');

-- Arremesso
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Shuriken','ARMA','ARREMESSO','TATICA','I',0.5,'1d4','x2','Curto','P','[]',
 'Projéteis metálicos em forma de estrela. Se veterano em Pontaria, uma vez por rodada gaste 1 PE para ataque adicional. Um "pacote" = 2 cenas (ou 10 shurikens com contagem de munição).','SOBREVIVENDO_AO_HORROR');

-- Fogo Uma Mão
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Pistola Pesada','ARMA','FOGO_UMA_MAO','SIMPLES','I',1,'2d8','18','Curto','B','[]',
 'Pistola de calibre superior. Impõe –O nos testes de ataque; empunhar com as duas mãos anula essa penalidade.','SOBREVIVENDO_AO_HORROR'),
('Revólver Compacto','ARMA','FOGO_LEVE','SIMPLES','I',1,'2d4','19/x3','Curto','P','["discreta"]',
 'Arma de baixo calibre projetada para ser escondida. Se treinado em Crime, não ocupa espaço.','SOBREVIVENDO_AO_HORROR');

-- Fogo Duas Mãos
INSERT INTO itens (nome, tipo, subtipo, proficiencia, categoria, espacos, dano, critico, alcance, "tipo_ataque", propriedades, descricao, fonte) VALUES
('Espingarda de Cano Duplo','ARMA','FOGO_DUAS_MAOS','TATICA','II',2,'4d6','x3','Curto','B','[]',
 'Dois canos paralelos, cada um com um gatilho. Requer ação de movimento para recarregar após os 2 cartuchos. Pode disparar os dois canos no mesmo alvo: –O no ataque, dano aumenta para 6d6.','SOBREVIVENDO_AO_HORROR');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Acessórios (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Kit de Perícia', 'GERAL','ACESSORIO','0',1,
 'Conjunto de ferramentas necessárias para algumas perícias. Sem o kit, sofre –5 no teste. Existe um kit para cada perícia que o exige.','LIVRO_BASE'),
('Utensílio', 'GERAL','ACESSORIO','I',1,
 'Item com utilidade específica (canivete, lupa, smartphone). Fornece +2 em uma perícia (exceto Luta e Pontaria). Deve ser empunhado para aplicar o bônus.','LIVRO_BASE'),
('Vestimenta', 'GERAL','ACESSORIO','I',1,
 'Peça de vestuário que fornece +2 em uma perícia (exceto Luta ou Pontaria). Ex: botas militares (+2 Atletismo), terno (+2 Diplomacia). Máximo dois bônus simultâneos.','LIVRO_BASE');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Acessórios (SoH)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Amuleto Sagrado', 'GERAL','ACESSORIO','0',1,
 'Shimenawa, rosário, fio de contas ou objeto de fé. Fornece +2 em Religião e Vontade.','SOBREVIVENDO_AO_HORROR'),
('Celular', 'GERAL','ACESSORIO','0',1,
 'Fotos, áudios, vídeos, internet e ligações. Com acesso à internet, +2 em testes de perícia para adquirir informações. Possui lanterna fraca com cone de 4,5m.','SOBREVIVENDO_AO_HORROR'),
('Chave de Fenda Universal', 'GERAL','ACESSORIO','0',1,
 'Ferramenta multiuso. +2 em testes para criar ou reparar objetos (panelas a motores de avião). Também aplica bônus como item de apoio em situações específicas.','SOBREVIVENDO_AO_HORROR'),
('Chaves', 'GERAL','ACESSORIO','0',1,
 'Molho de chaves (casa, veículo, cadeados). Usar o barulho das chaves para distrair alguém fornece +2 em Furtividade nessa rodada.','SOBREVIVENDO_AO_HORROR'),
('Documentos Falsos', 'GERAL','ACESSORIO','I',1,
 'Conjunto de documentos em nome de uma identidade falsa. +2 em Diplomacia, Enganação e Intimidação para se passar pela pessoa representada.','SOBREVIVENDO_AO_HORROR'),
('Manual Operacional', 'GERAL','ACESSORIO','I',1,
 'Livro com lições práticas sobre uma perícia. Gastar ação de interlúdio lendo permite usar aquela perícia como se fosse treinado até o próximo interlúdio.','SOBREVIVENDO_AO_HORROR'),
('Notebook', 'GERAL','ACESSORIO','0',2,
 'Com internet, +2 em perícias para adquirir informações. Ao relaxar em interlúdio, recupera 1 ponto adicional de Sanidade. Ilumina em cone de 4,5m. Inclui tablets.','SOBREVIVENDO_AO_HORROR');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Explosivos (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Granada de Atordoamento', 'GERAL','EXPLOSIVO','0',1,
 'Flash-bang. Raio 6m; seres ficam atordoados por 1 rodada (Fortitude DT Agi reduz para ofuscado e surdo por 1 rodada).','LIVRO_BASE'),
('Granada de Fragmentação', 'GERAL','EXPLOSIVO','I',1,
 'Espalha fragmentos. Raio 6m; 8d6 dano de perfuração (Reflexos DT Agi reduz à metade).','LIVRO_BASE'),
('Granada de Fumaça', 'GERAL','EXPLOSIVO','0',1,
 'Produz fumaça espessa. Raio 6m; seres ficam cegos e sob camuflagem total. Dura 2 rodadas.','LIVRO_BASE'),
('Granada Incendiária', 'GERAL','EXPLOSIVO','I',1,
 'Espalha labaredas. Raio 6m; 6d6 dano de fogo + condição em chamas (Reflexos DT Agi reduz dano à metade e evita condição).','LIVRO_BASE'),
('Mina Antipessoal', 'GERAL','EXPLOSIVO','I',1,
 'Ativada por controle remoto (até alcance longo). Dispara bolas de aço em cone de 6m; 12d6 dano de perfuração (Reflexos DT Int reduz à metade). Instalação: ação completa + teste Tática DT 15.','LIVRO_BASE');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Explosivos (SoH)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Dinamite', 'GERAL','EXPLOSIVO','I',1,
 'Bastão de 20cm com pavio. Ação padrão: acender e arremessar em alcance médio. Raio 6m; 4d6 impacto + 4d6 fogo + condição em chamas (Reflexos DT Agi reduz à metade).','SOBREVIVENDO_AO_HORROR'),
('Explosivo Plástico', 'GERAL','EXPLOSIVO','I',1,
 'Massa adesiva com pino de ignição e detonador remoto. 2 rodadas para preparar. 16d6 impacto em raio 3m (Reflexos DT Int reduz à metade). Especialistas causam dobro em objetos e ignoram RD.','SOBREVIVENDO_AO_HORROR'),
('Galão Vermelho', 'GERAL','EXPLOSIVO','0',2,
 'Galão com substância inflamável. Ao sofrer dano de fogo ou balístico, explode em esfera de 6m; 12d6 dano de fogo (Reflexos DT 25 reduz). A área pega fogo (1d6/rodada) até ser apagada.','SOBREVIVENDO_AO_HORROR'),
('Granada de Gás Sonífero', 'GERAL','EXPLOSIVO','I',1,
 'Libera fumaça branca em raio 6m. Seres ficam inconscientes ou exaustos por 1 rodada depois fatigados (Fortitude DT Agi reduz para fatigado por 1d4 rodadas). Gás permanece 2 rodadas.','SOBREVIVENDO_AO_HORROR'),
('Granada de PEM', 'GERAL','EXPLOSIVO','I',1,
 'Pulso eletromagnético que desativa eletrônicos em raio 18m até fim da cena. Criaturas de Energia: 6d6 impacto e paralisadas 1 rodada (Fortitude DT Agi reduz à metade, apenas 1x/cena).','SOBREVIVENDO_AO_HORROR');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Itens Operacionais (LB)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Algemas', 'GERAL','OPERACIONAL','0',1,
 'Par de algemas de aço. Prender alguém não indefeso: empunhar + agarrar + novo teste de agarrar. Prender os dois pulsos (–5 em testes com mãos) ou um pulso em objeto. Escapar: Acrobacia DT 30.','LIVRO_BASE'),
('Arpéu', 'GERAL','OPERACIONAL','0',1,
 'Gancho de aço para amarrar em corda. Prender exige Pontaria DT 15. +5 em Atletismo para subir muro com corda.','LIVRO_BASE'),
('Bandoleira', 'GERAL','OPERACIONAL','I',1,
 'Cinto com bolsos e alças. Uma vez por rodada, pode sacar ou guardar um item como ação livre.','LIVRO_BASE'),
('Binóculos', 'GERAL','OPERACIONAL','0',1,
 'Binóculos militares. +5 em Percepção para observar coisas distantes.','LIVRO_BASE'),
('Bloqueador de Sinal', 'GERAL','OPERACIONAL','I',1,
 'Emite ondas que "poluem" frequência de rádio. Impede celulares em alcance médio de se conectar.','LIVRO_BASE'),
('Cicatrizante', 'GERAL','OPERACIONAL','I',1,
 'Spray com potente efeito cicatrizante. Ação padrão para usar; cura 2d8+2 PV em você ou ser adjacente.','LIVRO_BASE'),
('Corda', 'GERAL','OPERACIONAL','0',1,
 'Rolo com 10m de corda resistente. +5 em Atletismo para descer buracos ou prédios. Serve para amarrar pessoas inconscientes etc.','LIVRO_BASE'),
('Equipamento de Sobrevivência', 'GERAL','OPERACIONAL','0',2,
 'Mochila com saco de dormir, panelas, GPS e itens de campo. +5 em Sobrevivência para acampar e orientar-se; permite esses testes sem treinamento.','LIVRO_BASE'),
('Lanterna Tática', 'GERAL','OPERACIONAL','I',1,
 'Ilumina cone de 9m. Ação de movimento para mirar nos olhos de ser em alcance curto; ele fica ofuscado por 1 rodada (imune pelo resto da cena).','LIVRO_BASE'),
('Máscara de Gás', 'GERAL','OPERACIONAL','0',1,
 'Máscara com filtro que cobre o rosto inteiro. +10 em Fortitude contra efeitos que dependam de respiração.','LIVRO_BASE'),
('Mochila Militar', 'GERAL','OPERACIONAL','I',0,
 'Mochila leve de alta qualidade. Não ocupa espaço e aumenta capacidade de carga em 2 espaços.','LIVRO_BASE'),
('Óculos de Visão Térmica', 'GERAL','OPERACIONAL','I',1,
 'Eliminam a penalidade em testes por camuflagem.','LIVRO_BASE'),
('Pé de Cabra', 'GERAL','OPERACIONAL','0',1,
 'Barra de ferro. +5 em Força para arrombar portas. Pode ser usado em combate como bastão.','LIVRO_BASE'),
('Pistola de Dardos', 'GERAL','OPERACIONAL','I',1,
 'Dispara dardos soníferos em alcance curto. Acerto: alvo fica inconsciente até fim da cena (Fortitude DT Agi reduz para desprevenido e lento). Vem com 2 dardos.','LIVRO_BASE'),
('Pistola Sinalizadora', 'GERAL','OPERACIONAL','0',1,
 'Dispara sinalizador luminoso. Pode ser usada como arma de disparo leve em alcance curto; 2d6 dano de fogo. Vem com 2 cargas.','LIVRO_BASE'),
('Soqueira', 'GERAL','OPERACIONAL','0',1,
 'Peça de metal entre os dedos. +1 em dano desarmado e torna-o letal. Pode receber modificações e maldições de armas corpo a corpo.','LIVRO_BASE'),
('Spray de Pimenta', 'GERAL','OPERACIONAL','I',1,
 'Ação padrão para atingir ser adjacente. Fica cego por 1d4 rodadas (Fortitude DT Agi evita). Dura dois usos.','LIVRO_BASE'),
('Taser', 'GERAL','OPERACIONAL','I',1,
 'Dispositivo de eletrochoque. Ação padrão para atingir ser adjacente; 1d6 eletricidade + atordoado por 1 rodada (Fortitude DT Agi evita). Bateria dura dois usos.','LIVRO_BASE'),
('Traje Hazmat', 'GERAL','OPERACIONAL','I',2,
 'Roupa impermeável que cobre o corpo. +5 em resistência contra efeitos ambientais e resistência a dano químico 10.','LIVRO_BASE');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Itens Operacionais (SoH)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Alarme de Movimento', 'GERAL','OPERACIONAL','0',1,
 'Ação completa para posicionar. Sinaliza dispositivo de controle quando ser Pequeno ou maior se move em cone de 30m. Sensibilidade ajustável; sinalização discreta ou sonora.','SOBREVIVENDO_AO_HORROR'),
('Alimento Energético', 'GERAL','OPERACIONAL','II',1,
 'Alimentos e suplementos de alta tecnologia. Ação padrão para consumir; recupera 1d4 PE.','SOBREVIVENDO_AO_HORROR'),
('Aplicador de Medicamentos', 'GERAL','OPERACIONAL','I',1,
 'Bomba injetora portátil presa ao braço ou perna. Aplica medicamentos com ação de movimento. Espaço para 3 doses (contabilizadas no espaço do item). Carregar dose: ação padrão.','SOBREVIVENDO_AO_HORROR'),
('Braçadeira Reforçada', 'GERAL','OPERACIONAL','I',1,
 'Proteção para braços de artes marciais. Aumenta em +2 a RD recebida ao usar bloqueio.','SOBREVIVENDO_AO_HORROR'),
('Cão Adestrado', 'GERAL','OPERACIONAL','I',0,
 'Cachorro corajoso e treinado (pastor alemão, dobermann etc.). Personagem treinado em Adestramento pode usá-lo como aliado. Bônus: +2 em Investigação e Percepção. Habilidade: gastar 1 PE para postura defensiva, +2 na Defesa por 1 rodada.','SOBREVIVENDO_AO_HORROR'),
('Coldre Saque Rápido', 'GERAL','OPERACIONAL','I',1,
 'Coldre para saque mínimo. Uma vez por rodada, pode sacar ou guardar uma arma de fogo leve como ação livre.','SOBREVIVENDO_AO_HORROR'),
('Equipamento de Escuta', 'GERAL','OPERACIONAL','I',1,
 'Receptor (alcance 90m) + 3 transmissores (raio 9m). Instalar: minutos + Crime DT 20. A DT do teste = DT para encontrar o transmissor. Pode instalar discretamente: ação completa + Furtividade oposto Percepção (DT Crime +5).','SOBREVIVENDO_AO_HORROR'),
('Estrepes (saco)', 'GERAL','OPERACIONAL','0',1,
 'Peças de metal com quatro pontas — uma sempre voltada para cima. Ação padrão para cobrir 1,5m×1,5m. Pisada: 1d4 perfuração + lento por um dia. Reflexos DT Agi evita. Em perseguição: –O em testes do perseguidor até o fim da cena.','SOBREVIVENDO_AO_HORROR'),
('Faixa de Pregos', 'GERAL','OPERACIONAL','I',2,
 'Trilha sanfonada de pregos em linha de 9m. Como estrepes, mas para veículos: pneus de borracha são automaticamente perfurados (deslocamento pela metade).','SOBREVIVENDO_AO_HORROR'),
('Isqueiro', 'GERAL','OPERACIONAL','0',0.5,
 'Isqueiro descartável ou de metal. Ação de movimento para produzir chama. Incendeia objetos inflamáveis; ilumina raio de 3m.','SOBREVIVENDO_AO_HORROR');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Medicamentos (SoH)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Antibiótico', 'GERAL','MEDICAMENTO','I',0.5,
 'Fortalece imunidade. +5 no próximo teste de Fortitude contra efeitos de uma doença até fim do dia.','SOBREVIVENDO_AO_HORROR'),
('Antídoto', 'GERAL','MEDICAMENTO','I',0.5,
 '+5 no próximo teste de Fortitude contra efeitos de veneno até fim do dia. Antídoto específico remove completamente o veneno.','SOBREVIVENDO_AO_HORROR'),
('Antiemético', 'GERAL','MEDICAMENTO','I',0.5,
 'Remove condição enjoado e +5 em testes para evitá-la até fim da cena. Pode funcionar contra outras condições por náuseas.','SOBREVIVENDO_AO_HORROR'),
('Antihistamínico', 'GERAL','MEDICAMENTO','I',0.5,
 '+5 no próximo teste contra efeitos de alergia até fim do dia.','SOBREVIVENDO_AO_HORROR'),
('Anti-inflamatório', 'GERAL','MEDICAMENTO','I',0.5,
 'Reduz dor e inchaço. Fornece 1d8+2 PV temporários.','SOBREVIVENDO_AO_HORROR'),
('Antitérmico', 'GERAL','MEDICAMENTO','I',0.5,
 'Reduz febre e alivia dores de cabeça. Permite novo teste contra uma condição mental. Funciona apenas uma vez por cena.','SOBREVIVENDO_AO_HORROR'),
('Broncodilatador', 'GERAL','MEDICAMENTO','I',0.5,
 'Auxilia na respiração. +5 em testes para evitar asfixiado ou fatigado até fim do dia.','SOBREVIVENDO_AO_HORROR'),
('Coagulante', 'GERAL','MEDICAMENTO','I',0.5,
 '+5 em testes para se estabilizar da condição sangrando até fim do dia. Usado com Medicina para remover morrendo, também +5 nesse teste.','SOBREVIVENDO_AO_HORROR');

-- ============================================================
-- EQUIPAMENTOS GERAIS — Outros (SoH)
-- ============================================================
INSERT INTO itens (nome, tipo, subtipo, categoria, espacos, descricao, fonte) VALUES
('Óculos de Visão Noturna', 'GERAL','OPERACIONAL','I',1,
 'Com bateria, permitem visão no escuro. Entretanto, –O em testes de resistência a condição ofuscado e efeitos de luz.','SOBREVIVENDO_AO_HORROR'),
('Óculos Escuros', 'GERAL','ACESSORIO','0',1,
 'Usando óculos escuros, o personagem não pode ser ofuscado.','SOBREVIVENDO_AO_HORROR'),
('Pá', 'GERAL','OPERACIONAL','0',2,
 '+5 em Força para cavar buracos e mover detritos. Pode ser usada em combate como bastão.','SOBREVIVENDO_AO_HORROR'),
('Paraquedas', 'GERAL','OPERACIONAL','I',2,
 'Anula dano de queda. Veteranos em Acrobacia, Pilotagem, Reflexos, Tática ou Profissão adequada sabem usar. Caso contrário: Reflexos DT 20; falha reduz dano apenas à metade.','SOBREVIVENDO_AO_HORROR'),
('Traje de Mergulho', 'GERAL','OPERACIONAL','I',2,
 'Roupa impermeável com tanque e máscara (1h de oxigênio). +5 em resistência contra efeitos ambientais e resistência a dano químico 5. Vestir/despir: ação completa.','SOBREVIVENDO_AO_HORROR'),
('Traje Espacial', 'GERAL','OPERACIONAL','II',5,
 'Proteção total para o vácuo. Suprimento de água e oxigênio por 8 horas. Protege contra raios cósmicos. +10 em resistência contra efeitos ambientais e resistência a dano químico 20. Vestir/despir: 2 rodadas.','SOBREVIVENDO_AO_HORROR');
