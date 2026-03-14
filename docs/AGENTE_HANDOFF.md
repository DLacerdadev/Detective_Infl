# Ordo Realitas — Documentacao de Handoff para Agente IA

## 1. Visao Geral do Produto

**Ordo Realitas** e uma aplicacao web full-stack para gerenciar personagens e campanhas do RPG de mesa **Ordem Paranormal** (criado por Cellbit). O app permite criar fichas de personagem completas, gerenciar campanhas com sistemas de rolagem de dados em tempo real, preparacao de missao, e um compendio publico de regras. O admin (dlacerda.dev@gmail.com) gerencia todos os dados estaticos do jogo.

**Estetica visual**: sala de investigacao noir anos 1980 — tons escuros de marrom/madeira, acentos vermelho-sangue, fontes estilo maquina de escrever, cards estilo polaroid, metaforas visuais de dossie/pasta de arquivo.

---

## 2. Stack Tecnica

| Camada | Tecnologia |
|--------|-----------|
| Monorepo | pnpm workspaces |
| Node.js | v24 |
| TypeScript | v5.9 |
| Frontend | React 19 + Vite 7 |
| API | Express 5 |
| Banco de Dados | PostgreSQL 16 + Drizzle ORM |
| Autenticacao | Email/senha (bcrypt 12 rounds) + Google Sign-In (`google-auth-library`) |
| Sessoes | Cookie-based via `express-session` + `connect-pg-simple` (armazenadas no PostgreSQL) |
| Validacao | Zod v4 + `drizzle-zod` |
| UI | Tailwind CSS + Radix UI + shadcn/ui components |
| Animacoes | Framer Motion |
| API Client | React Query (`@tanstack/react-query`) — hooks manuais em `lib/api-client-react/src/` |
| Build (prod) | esbuild (CJS bundle para API) + Vite (frontend) |
| Deploy | Docker Compose (postgres + api + nginx) em VM self-hosted |

---

## 3. Estrutura do Monorepo

```
artifacts-monorepo/
├── artifacts/
│   ├── api-server/              # Servidor Express (porta 8080)
│   │   └── src/
│   │       ├── index.ts         # Entry point (Express app setup, session, CORS)
│   │       └── routes/
│   │           ├── index.ts     # Router aggregator
│   │           ├── auth.ts      # Autenticacao (register, login, google, logout)
│   │           ├── characters.ts # CRUD de personagens
│   │           ├── game.ts      # CRUD de dados estaticos (classes, origens, pericias, trilhas, rituais, itens, habilidades, admin/users)
│   │           ├── campaigns.ts # Campanhas, membros, rolagens, personagens de campanha, preparacao
│   │           └── health.ts    # Healthcheck
│   └── ordo-realitas/           # Frontend React (porta definida por $PORT)
│       └── src/
│           ├── App.tsx          # Router principal (wouter)
│           ├── main.tsx         # Entry point (QueryClientProvider, Toaster)
│           ├── pages/           # Paginas (ver secao 7)
│           ├── components/      # Componentes de feature + shadcn/ui
│           ├── hooks/           # useAuth, useApiMutations, useToast
│           └── lib/utils.ts     # cn() helper para classnames
├── lib/
│   ├── db/                      # Drizzle ORM
│   │   ├── src/schema/          # Definicoes de tabelas (auth.ts, game.ts, campaign.ts, relations.ts, index.ts)
│   │   ├── src/seed.ts          # Seed de dados iniciais
│   │   ├── src/data/            # rituais.json, classes com habilidades
│   │   └── src/seed-equipamentos.sql  # SQL de seed de itens/equipamentos
│   ├── api-client-react/        # Hooks React Query para consumir a API
│   │   └── src/
│   │       ├── campaigns.ts     # Hooks de campanhas (useListCampanhas, useCreateCampanha, etc.)
│   │       ├── game.ts          # Hooks de dados estaticos
│   │       ├── index.ts         # Re-exports
│   │       └── generated/       # Codigo gerado por Orval (parcialmente usado)
│   ├── api-spec/                # OpenAPI spec + config Orval
│   └── api-zod/                 # Schemas Zod gerados
├── docker/
│   ├── nginx.conf               # Proxy reverso nginx (frontend → API)
│   └── entrypoint.sh            # Startup do container API (push schema + seed + run)
├── Dockerfile.api               # Build multi-stage da API
├── Dockerfile.frontend          # Build multi-stage do frontend
├── docker-compose.yml           # Orquestracao (postgres + api + frontend)
└── docker-compose.example.env   # Template de variaveis de ambiente
```

---

## 4. Convencoes Criticas de Codigo

**IMPORTANTE — leia antes de modificar qualquer coisa:**

1. **NAO rodar `tsc --build` no api-client-react.** Os hooks em `lib/api-client-react/src/` sao importados diretamente pelo frontend via alias do Vite. Edite os arquivos `.ts` fonte diretamente.

2. **NAO usar interpolacao dinamica de classes Tailwind.** Tailwind faz purge estatico. Use classes completas pre-definidas.

   ```tsx
   // ERRADO:
   className={`bg-${color}-500`}
   
   // CERTO:
   const colorMap = { red: "bg-red-500", blue: "bg-blue-500" };
   className={colorMap[color]}
   ```

3. **Cores de elementos de ritual** sao fixas e devem ser consistentes em TODOS os componentes que as usam:
   - Sangue = red
   - Morte = stone/dark
   - Conhecimento = yellow
   - Energia = purple
   - Medo = slate
   - Variavel = violet

   Arquivos que usam essas cores: `CreateCharacter.tsx`, `RituaisTab.tsx`, `RituaisAdminTab.tsx`, `CharacterRituaisTab.tsx`, `PreparacaoTab.tsx`.

4. **`atributoBase` e armazenado em portugues completo** (ex: "Agilidade", "Intelecto"). Use `toAttrCode()` para converter para codigo curto (FOR, AGI, INT, VIG, PRE).

5. **Motor de rolagem**: Xd20 take highest (padrao OP). Implementado server-side em `campaigns.ts`.

6. **NEX inicial**: Classes Combatente, Especialista e Ocultista iniciam com NEX 5% (sao agentes da Ordem). Sobrevivente inicia com NEX 0%.

7. **Preparacao de campanha**: Quando um personagem e adicionado a uma campanha, seus rituais conhecidos sao pre-selecionados na preparacao (`preparacao.rituais` seeded com `personagem.rituals`). Frontend tem fallback para entradas legadas sem rituais pre-preenchidos.

8. **Visibilidade na aba Preparacao**: Jogadores nao-GM veem apenas seus proprios agentes. O Mestre ve todos os agentes.

9. **DB push** (aplicar schema): `pnpm --filter @workspace/db push`
   **DB seed** (popular dados): `pnpm --filter @workspace/db seed`

10. **Admin**: Email do admin e `dlacerda.dev@gmail.com`. API roda na porta 8080, frontend na porta definida por `$PORT`.

---

## 5. Schema do Banco de Dados (14 tabelas)

### 5.1. Autenticacao

**`users`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | ID do usuario |
| email | varchar UNIQUE | Email (login) |
| first_name | varchar | Nome |
| last_name | varchar | Sobrenome |
| password_hash | varchar | Hash bcrypt (nullable se Google-only) |
| role | varchar | "user" ou "admin" |
| created_at | timestamptz | Data de criacao |
| updated_at | timestamptz | Ultima atualizacao |

**`sessions`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| sid | varchar PK | Session ID |
| sess | jsonb | Dados da sessao |
| expire | timestamp | Expiracao |

### 5.2. Dados Estaticos do Jogo

**`classes`** (4 registros: Combatente, Especialista, Ocultista, Sobrevivente)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome da classe |
| descricao | text | Descricao |
| pv_inicial | int | PV inicial da classe |
| pv_por_nivel | int | PV ganho por nivel |
| pe_inicial | int | PE inicial |
| pe_por_nivel | int | PE por nivel |
| san_inicial | int | Sanidade inicial |
| san_por_nivel | int | Sanidade por nivel |
| pericias_treindas_base | int | Qtd de pericias treinadas base |
| habilidades_base | jsonb | Array de `{ nex, nome, descricao }` — progressao de habilidades por NEX |
| created_at | timestamptz | |

**`origens`** (46 registros: 26 Livro Base + 20 Sobrevivendo ao Horror)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome da origem |
| descricao | text | Descricao |
| pericias_concedidas | jsonb (string[]) | Lista de nomes de pericias concedidas |
| poder_concedido | text | Nome do poder |
| poder_descricao | text | Descricao do poder |
| fonte | text | Livro de origem |
| criador | text | Quem criou (se homebrew) |
| created_at | timestamptz | |

**`pericias`** (28 registros)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome (ex: "Atletismo", "Ocultismo") |
| atributo_base | text | Atributo em portugues (ex: "Forca", "Intelecto") |
| somente_trainada | boolean | Se so pode ser usada se treinada |
| created_at | timestamptz | |

**`trilhas`** (27 registros: 8 Combatente + 8 Especialista + 8 Ocultista + 3 Sobrevivente)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| classe_id | varchar FK → classes | Classe a que pertence |
| nome | text | Nome da trilha |
| fonte | text | Livro fonte |
| habilidades | jsonb | Array de `{ nex, nome, descricao }` — habilidades desbloqueadas por NEX |
| created_at | timestamptz | |

**`rituais`** (160 registros: Sangue:38, Morte:37, Conhecimento:34, Energia:36, Medo:14, Variavel:1)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome do ritual |
| elemento | text | Sangue/Morte/Conhecimento/Energia/Medo/Variavel |
| circulo | int | 1-4 (circulo do ritual) |
| execucao | text | Tempo de execucao |
| alcance | text | Alcance |
| alvo | text | Alvo |
| duracao | text | Duracao |
| resistencia | text | Teste de resistencia |
| custo_pe | int | Custo em PE |
| descricao | text | Efeito base |
| discente | text | Efeito discente (melhoria) |
| verdadeiro | text | Efeito verdadeiro (melhoria final) |
| dados | text | Formula de dano base |
| dados_discente | text | Formula de dano discente |
| dados_verdadeiro | text | Formula de dano verdadeiro |
| fonte | text | Livro fonte |
| created_at | timestamptz | |

**`itens`** (117 registros: 45 armas + 3 protecoes + 6 municoes + 63 gerais)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome do item |
| tipo | text | ARMA / PROTECAO / MUNICAO / GERAL |
| subtipo | text | Sub-classificacao (CORPO_LEVE, FOGO_UMA_MAO, OPERACIONAL, etc.) |
| proficiencia | text | SIMPLES / TATICA / PESADA (so armas) |
| descricao | text | Descricao |
| espacos | real | Espacos de inventario que ocupa |
| categoria | text | 0, I, II, III, IV |
| dano | text | Formula de dano (armas) |
| critico | text | Margem de critico |
| alcance | text | Alcance (armas) |
| tipo_ataque | text | Tipo de ataque |
| defesa | int | Bonus de defesa (protecoes) |
| propriedades | jsonb (string[]) | Propriedades especiais (agil, automatica, area, etc.) |
| fonte | text | LIVRO_BASE / SOBREVIVENDO_AO_HORROR |
| peso | real | Peso |
| preco | int | Preco em TP |
| requisitos | jsonb | Requisitos para usar |
| created_at | timestamptz | |

**`habilidades`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome da habilidade |
| categoria | text | Categoria (ex: COMBATE, APOIO, etc.) |
| classe | text | Classe associada (ou "GERAL") |
| descricao | text | Descricao |
| fonte | text | LIVRO_BASE / SOBREVIVENDO_AO_HORROR |
| alterada | boolean | Se foi alterada do original |
| nex | int | NEX minimo para desbloquear (nullable) |
| created_at | timestamptz | |

### 5.3. Personagens

**`personagens`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| user_id | varchar FK → users | Dono do personagem |
| nome | text | Nome do personagem |
| classe_id | varchar FK → classes | Classe |
| origem_id | varchar FK → origens | Origem |
| trilha_id | varchar FK → trilhas | Trilha de classe |
| nivel | int | Nivel (1-20) |
| nex | int | NEX (0-99) — Combatente/Especialista/Ocultista iniciam em 5 |
| patente | text | Recruta / Operador / Agente Especial / Agente de Elite |
| pv_atual / pv_maximo | int | Pontos de vida |
| pe_atual / pe_maximo | int | Pontos de esforco |
| san_atual / san_maximo | int | Sanidade |
| forca / agilidade / intelecto / vigor / presenca | int | Atributos (1-5) |
| defesa | int | Defesa = 10 + agilidade |
| historia | text | Background do personagem |
| pericias | jsonb (string[]) | IDs das pericias treinadas |
| rituals | jsonb (string[]) | IDs dos rituais conhecidos |
| inventario | jsonb | Array de itens no inventario |
| created_at / updated_at | timestamptz | |

### 5.4. Campanhas

**`campanhas`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| nome | text | Nome da campanha/operacao |
| descricao | text | Descricao |
| codigo_convite | varchar(12) UNIQUE | Codigo de convite para jogadores entrarem |
| created_at / updated_at | timestamptz | |

**`campanha_membros`**
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| campanha_id | varchar FK → campanhas (CASCADE) | |
| user_id | varchar FK → users (CASCADE) | |
| papel | varchar(20) | "mestre" ou "jogador" |
| joined_at | timestamptz | |
| UNIQUE | (campanha_id, user_id) | |

**`campanha_rolagens`** (historico de rolagens de dados)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| campanha_id | varchar FK → campanhas (CASCADE) | |
| user_id | varchar FK → users (CASCADE) | |
| rolando_como | text | Nome do personagem que esta rolando |
| label | text | Descricao da rolagem (ex: "Atletismo") |
| tipo | varchar(20) | "pericia" / "atributo" / "dano" |
| atributo | varchar(10) | Codigo do atributo (FOR, AGI, etc.) |
| qtd_dados_base | int | Quantidade de d20s |
| bonus_pericia | int | Bonus de pericia treinada |
| modificadores_o | int | Outros modificadores |
| expressao_dano | text | Expressao de dano (ex: "2d6+3") |
| dados_rolados | jsonb (number[]) | Resultados de cada dado |
| resultado_base | int | Maior valor dos dados |
| resultado_final | int | resultado_base + bonus + modificadores |
| sucesso_automatico | boolean | Se tirou 20 natural |
| modo_penalidade | boolean | Se esta em modo penalidade (take lowest) |
| created_at | timestamptz | |

**`campanha_personagens`** (agentes vinculados a campanha)
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | varchar (UUID) PK | |
| campanha_id | varchar FK → campanhas (CASCADE) | |
| personagem_id | varchar FK → personagens (CASCADE) | |
| user_id | varchar FK → users (CASCADE) | |
| added_at | timestamptz | |
| preparacao | jsonb `{ rituais: string[], itens: string[], pronto: boolean }` | Estado de preparacao de missao |
| UNIQUE | (campanha_id, personagem_id) | Um personagem so pode estar em uma campanha por vez |

---

## 6. Rotas da API

Todas as rotas sao montadas sob `/api/`. Ex: `GET /api/classes`.

### 6.0. Healthcheck (`routes/health.ts`)
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/healthz` | Healthcheck (retorna 200 OK) |

### 6.1. Autenticacao (`routes/auth.ts`)
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/auth/user` | Retorna usuario logado (da sessao) |
| POST | `/auth/register` | Registra novo usuario (email + senha) |
| POST | `/auth/login` | Login com email + senha |
| POST | `/auth/google` | Login/registro via Google ID token |
| POST | `/auth/logout` | Destroi sessao |

### 6.2. Personagens (`routes/characters.ts`)
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/characters` | Lista personagens do usuario logado |
| POST | `/characters` | Cria personagem (calcula PV/PE/SAN, NEX 5% para classes Ordem) |
| GET | `/characters/:id` | Detalhes do personagem (com classe e origem populados) |
| PUT | `/characters/:id` | Atualiza personagem (dono ou admin) |
| DELETE | `/characters/:id` | Exclui personagem (dono ou admin) |
| GET | `/characters/:id/campanhas` | Lista campanhas do personagem |

### 6.3. Dados Estaticos (`routes/game.ts`)
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET/POST/PUT/DELETE | `/classes`, `/classes/:id` | CRUD de classes |
| GET/POST/PUT/DELETE | `/origins`, `/origins/:id` | CRUD de origens |
| GET/POST/PUT/DELETE | `/pericias`, `/pericias/:id` | CRUD de pericias |
| GET/POST/PUT/DELETE | `/trilhas`, `/trilhas/:id` | CRUD de trilhas (GET retorna com nome da classe) |
| GET/POST/PUT/DELETE | `/rituals`, `/rituals/:id` | CRUD de rituais |
| GET/POST/PUT/DELETE | `/items`, `/items/:id` | CRUD de itens (GET suporta `?tipo=` filter) |
| GET/POST/PUT/DELETE | `/habilidades`, `/habilidades/:id` | CRUD de habilidades |
| GET | `/admin/users` | Lista usuarios (admin only) |
| PUT | `/admin/users/:id/role` | Altera role do usuario (admin only) |

### 6.4. Campanhas (`routes/campaigns.ts`)
| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/campanhas` | Lista campanhas do usuario (como membro) |
| POST | `/campanhas` | Cria campanha (criador vira mestre) |
| GET | `/campanhas/:id` | Detalhes da campanha (com membros) |
| PUT | `/campanhas/:id` | Atualiza campanha (mestre only) |
| DELETE | `/campanhas/:id` | Exclui campanha (mestre only) |
| POST | `/campanhas/entrar` | Entra na campanha via codigo de convite |
| PUT | `/campanhas/:id/membros/:userId/papel` | Altera papel (mestre ↔ jogador) |
| DELETE | `/campanhas/:id/membros/:userId` | Remove membro |
| POST | `/campanhas/:id/rolagens` | Rola dados (server-side, Xd20 take highest) |
| GET | `/campanhas/:id/rolagens` | Historico de rolagens (paginado, `?limit=&offset=`) |
| GET | `/campanhas/:id/personagens` | Lista personagens da campanha (com stats completos) |
| POST | `/campanhas/:id/personagens` | Adiciona personagem a campanha (pre-popula rituais na preparacao) |
| DELETE | `/campanhas/:id/personagens/:personagemId` | Remove personagem da campanha |
| PUT | `/campanhas/:id/personagens/:personagemId/preparacao` | Atualiza preparacao de missao (rituais, itens, pronto) |

---

## 7. Paginas do Frontend

| Rota | Pagina/Arquivo | Descricao |
|------|----------------|-----------|
| `/` | `Home.tsx` | Landing page com estetica noir (publica) |
| `/login` | `Login.tsx` | Login email/senha + Google Sign-In |
| `/characters` | `Characters.tsx` | Lista de personagens do usuario |
| `/characters/new` | `CreateCharacter.tsx` | Wizard multi-step (6 steps para Ocultista, 5 para outros) |
| `/characters/:id` | `CharacterSheet.tsx` | Ficha completa com tabs |
| `/compendio` | `Compendio.tsx` | Compendio de regras do jogo — protegido por login (classes, origens, pericias, rituais, itens, habilidades, trilhas) |
| `/admin` | `Admin.tsx` | Painel admin (CRUD de dados do jogo) |
| `/campanhas` | `Campanhas.tsx` | Lista de campanhas, criar, entrar via codigo |
| `/campanhas/:id` | `CampanhaDetail.tsx` | Detalhe da campanha com tabs: Rolagens, Agentes, Membros, Preparacao, Em Cena |

### Componentes de Feature

| Componente | Descricao |
|------------|-----------|
| `PreparacaoTab.tsx` | Aba de preparacao de missao — cards por agente com atributos/vitais, seletor de rituais/itens, toggle de prontidao |
| `RolagensTab.tsx` | Aba de rolagens de dados da campanha |
| `PersonagensTab.tsx` | Aba de agentes vinculados a campanha |
| `CharacterRituaisTab.tsx` | Rituais na ficha de personagem |
| `CharacterPericiasTab.tsx` | Pericias na ficha |
| `CharacterHabilidadesTab.tsx` | Habilidades na ficha |
| `EquipamentosTab.tsx` | Inventario na ficha |
| `RituaisTab.tsx` / `RituaisAdminTab.tsx` | Rituais no compendio / admin |
| `TrilhasTab.tsx` / `TrilhasAdminTab.tsx` | Trilhas no compendio / admin |
| `OrigensTab.tsx` | Origens no compendio |
| `PericiasTab.tsx` | Pericias no compendio |
| `HabilidadesCompendioTab.tsx` / `HabilidadesAdminTab.tsx` | Habilidades no compendio / admin |

---

## 8. Regras do Jogo Implementadas

### Atributos e Recursos
- 5 atributos: Forca (FOR), Agilidade (AGI), Intelecto (INT), Vigor (VIG), Presenca (PRE) — valores 1 a 5
- PV = `pvInicial_classe + (pvPorNivel * (nivel-1)) + vigor`
- PE = `peInicial_classe + (pePorNivel * (nivel-1)) + presenca`
- SAN = `sanInicial_classe + (sanPorNivel * (nivel-1)) + presenca`
- Defesa = 10 + agilidade

### Classes e NEX
- **Combatente**: PV alto (20+5/nivel), PE medio, foco em combate
- **Especialista**: PV medio, PE medio, foco em pericias (mais pericias treinadas)
- **Ocultista**: PV baixo, PE alto, acesso a rituais (escolhe 3 rituais de 1o circulo na criacao)
- **Sobrevivente**: Classe para personagens sem contato previo com o paranormal
- NEX (0-99%): Exposicao ao paranormal. Combatente/Especialista/Ocultista iniciam em 5%
- Patentes: Recruta (NEX 5%), Operador, Agente Especial, Agente de Elite

### Pericias
- 28 pericias, cada uma ligada a um atributo base (portugues completo)
- Pericias treinadas dao bonus na rolagem
- Algumas sao "somente treinada" (nao podem ser usadas sem treino)
- Classe define pericias fixas + grupos de escolha (ex: Combatente escolhe entre Luta/Pontaria)
- Origem concede pericias adicionais
- Total de pericias treinadas = `periciasTreindasBase_classe + intelecto`

### Rituais (Ocultista)
- 160 rituais catalogados, organizados por elemento e circulo
- Elementos: Sangue, Morte, Conhecimento, Energia, Medo, Variavel
- Circulos: 1o a 4o (maior circulo = mais poderoso)
- Cada ritual tem custo PE, alcance, duracao, descricao + versoes discente/verdadeiro

### Rolagem de Dados
- Sistema Xd20 take highest (modo normal) ou take lowest (modo penalidade)
- resultado_final = max(dados) + bonus_pericia + modificadores
- Sucesso automatico em d20 natural = 20

### Campanhas
- Mestre cria campanha → recebe codigo de convite
- Jogadores entram com codigo
- Mestre pode gerenciar membros (promover/remover)
- Personagens sao vinculados (max 1 campanha por personagem)
- Fase de Preparacao: selecionar rituais/itens, marcar "pronto"
- Aba "Em Cena" e placeholder para futuras features de sessao em tempo real

---

## 9. API Client (React Query Hooks)

Os hooks ficam em `lib/api-client-react/src/`. **NAO rodar build** — sao importados diretamente.

Arquivo principal: `campaigns.ts` — contem:
- `useListCampanhas()`, `useCreateCampanha()`, `useGetCampanha(id)`
- `useUpdateCampanha()`, `useDeleteCampanha()`
- `useEntrarCampanha()`, `useUpdatePapel()`
- `useRemoveMembro()`, `useRolarDados(campanhaId)`
- `useGetRolagens(campanhaId, limit, offset)`
- `useCampanhaPersonagens(campanhaId)`, `useAddPersonagem()`, `useRemovePersonagem()`
- `useUpdatePreparacao()`

Arquivo `game.ts` — contem hooks para classes, origens, pericias, rituais, trilhas, itens, habilidades, users admin.

Base URL configura via `VITE_API_URL` ou fallback para mesma origem.

---

## 10. Comandos de Desenvolvimento

```bash
# Iniciar API
pnpm --filter @workspace/api-server run dev

# Iniciar frontend
pnpm --filter @workspace/ordo-realitas run dev

# Aplicar alteracoes no schema do banco
pnpm --filter @workspace/db push

# Popular dados iniciais (classes, origens, pericias, rituais, itens)
pnpm --filter @workspace/db seed

# Regenerar tipos da API (Orval)
pnpm --filter @workspace/api-spec run codegen
```

---

## 11. Deploy com Docker Compose

```bash
# 1. Clonar o repositorio na VM
git clone <repo-url> ordo-realitas && cd ordo-realitas

# 2. Configurar variaveis
cp docker-compose.example.env .env
# Editar: POSTGRES_PASSWORD=<senha_forte>, GOOGLE_CLIENT_ID=<opcional>

# 3. Build e start
docker compose up -d --build

# 4. Ver logs
docker compose logs -f
```

**Servicos Docker:**
| Servico | Papel |
|---------|-------|
| `postgres` (postgres:16-alpine) | Banco de dados |
| `api` (Dockerfile.api) | Express API — entrypoint faz push + seed + start |
| `frontend` (Dockerfile.frontend) | Nginx servindo build React + proxy `/api/` → `api:8080` |

---

## 12. Estado Atual e Proximos Passos

### Pronto
- Autenticacao completa (email/senha + Google)
- CRUD completo de personagens com wizard de criacao multi-step
- Ficha de personagem com tabs (pericias, rituais, habilidades, equipamentos)
- Compendio publico com todos os dados do jogo
- Painel admin para gerenciar dados estaticos
- Sistema de campanhas (criar, entrar, membros)
- Rolagem de dados server-side com historico
- Agentes em campanha (vincular personagens)
- Fase de Preparacao de Missao (rituais, itens, toggle pronto)
- Deploy Docker Compose funcional
- 160 rituais + 117 itens + 46 origens + 28 pericias + 27 trilhas seedados

### Planejado / Em Andamento
- **Em Cena** (aba placeholder): sistema de sessao em tempo real para o mestre conduzir a missao
- Mesas virtuais com comunicacao em tempo real (WebSockets?)
- Gerenciamento de sessoes para GMs
- Possivelmente: sistema de combate, tracker de iniciativa

---

## 13. Dados de Seed

Os dados de seed estao em:
- `lib/db/src/seed.ts` — orquestra todo o seed
- `lib/db/src/data/rituais.json` — 160 rituais
- `lib/db/src/seed-equipamentos.sql` — 117 itens/equipamentos
- Classes, trilhas, origens e pericias sao seedados programaticamente em `seed.ts`

O seed e idempotente: verifica se as tabelas ja tem dados antes de inserir.

---

## 14. Arquivo SQL de Dump

O dump do banco esta dividido em dois arquivos para seguranca (sem dados sensiveis de usuarios/sessoes):

1. **`docs/DUMP_DATABASE.sql`** — Gerado via `pg_dump "$DATABASE_URL" --no-owner --no-acl --exclude-table-data=sessions --exclude-table-data=users`. Contem a estrutura completa de todas as 14 tabelas + dados de jogo (classes, trilhas, origens, pericias, rituais, itens, habilidades, campanhas, personagens, rolagens). Dados de `users` e `sessions` sao omitidos por privacidade.

2. **`docs/SEED_PLACEHOLDER_USERS.sql`** — Insere dois usuarios placeholder com emails ficticios para satisfazer as foreign keys de tabelas que referenciam `users` (personagens, campanha_membros, etc.).

Para restaurar em outro ambiente:

```bash
createdb ordorealitas
psql -U postgres -d ordorealitas < DUMP_DATABASE.sql
psql -U postgres -d ordorealitas < SEED_PLACEHOLDER_USERS.sql
```

Ou via Docker:
```bash
docker exec -i <container_postgres> psql -U postgres -d ordorealitas < DUMP_DATABASE.sql
docker exec -i <container_postgres> psql -U postgres -d ordorealitas < SEED_PLACEHOLDER_USERS.sql
```

Apos restaurar, crie contas reais via o fluxo de registro do app e atualize as referencias de `user_id` se necessario.
