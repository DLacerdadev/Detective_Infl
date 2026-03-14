--
-- PostgreSQL database dump
--

\restrict bScHI51ivpSHzKza4YSVYfjhSf4gjjncIxqBlfTWGHL3OQZp2an2Gh3VSflJGvB

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campanha_membros; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campanha_membros (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    campanha_id character varying NOT NULL,
    user_id character varying NOT NULL,
    papel character varying(20) DEFAULT 'jogador'::character varying NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: campanha_personagens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campanha_personagens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    campanha_id character varying NOT NULL,
    personagem_id character varying NOT NULL,
    user_id character varying NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL,
    preparacao jsonb DEFAULT '{"itens": [], "pronto": false, "rituais": []}'::jsonb
);


--
-- Name: campanha_rolagens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campanha_rolagens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    campanha_id character varying NOT NULL,
    user_id character varying NOT NULL,
    rolando_como text,
    label text,
    tipo character varying(20) DEFAULT 'pericia'::character varying NOT NULL,
    atributo character varying(10),
    qtd_dados_base integer DEFAULT 1 NOT NULL,
    bonus_pericia integer DEFAULT 0 NOT NULL,
    modificadores_o integer DEFAULT 0 NOT NULL,
    expressao_dano text,
    dados_rolados jsonb DEFAULT '[]'::jsonb NOT NULL,
    resultado_base integer NOT NULL,
    resultado_final integer NOT NULL,
    sucesso_automatico boolean DEFAULT false NOT NULL,
    modo_penalidade boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: campanhas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campanhas (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    codigo_convite character varying(12),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.classes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    pv_inicial integer DEFAULT 8 NOT NULL,
    pv_por_nivel integer DEFAULT 4 NOT NULL,
    pe_inicial integer DEFAULT 4 NOT NULL,
    pe_por_nivel integer DEFAULT 2 NOT NULL,
    san_inicial integer DEFAULT 12 NOT NULL,
    san_por_nivel integer DEFAULT 4 NOT NULL,
    pericias_treindas_base integer DEFAULT 3 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    habilidades_base jsonb DEFAULT '[]'::jsonb
);


--
-- Name: habilidades; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habilidades (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    categoria text NOT NULL,
    classe text DEFAULT 'GERAL'::text NOT NULL,
    descricao text,
    fonte text DEFAULT 'LIVRO_BASE'::text NOT NULL,
    alterada boolean DEFAULT false NOT NULL,
    nex integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: itens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.itens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    tipo text DEFAULT 'GERAL'::text NOT NULL,
    descricao text,
    espacos real DEFAULT 1,
    categoria text,
    peso real,
    preco integer DEFAULT 0,
    requisitos jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    subtipo text,
    proficiencia text,
    dano text,
    critico text,
    alcance text,
    tipo_ataque text,
    defesa integer,
    propriedades jsonb DEFAULT '[]'::jsonb,
    fonte text DEFAULT 'LIVRO_BASE'::text NOT NULL
);


--
-- Name: origens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.origens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    pericias_concedidas jsonb DEFAULT '[]'::jsonb,
    poder_concedido text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    poder_descricao text,
    fonte text,
    criador text
);


--
-- Name: pericias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pericias (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    atributo_base text NOT NULL,
    somente_trainada boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: personagens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personagens (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    nome text NOT NULL,
    classe_id character varying,
    origem_id character varying,
    nivel integer DEFAULT 1 NOT NULL,
    nex integer DEFAULT 0 NOT NULL,
    patente text DEFAULT 'Recruta'::text,
    pv_atual integer DEFAULT 10,
    pv_maximo integer DEFAULT 10,
    pe_atual integer DEFAULT 4,
    pe_maximo integer DEFAULT 4,
    san_atual integer DEFAULT 12,
    san_maximo integer DEFAULT 12,
    forca integer DEFAULT 1 NOT NULL,
    agilidade integer DEFAULT 1 NOT NULL,
    intelecto integer DEFAULT 1 NOT NULL,
    vigor integer DEFAULT 1 NOT NULL,
    presenca integer DEFAULT 1 NOT NULL,
    defesa integer DEFAULT 10 NOT NULL,
    historia text,
    pericias jsonb DEFAULT '[]'::jsonb,
    rituals jsonb DEFAULT '[]'::jsonb,
    inventario jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    trilha_id character varying
);


--
-- Name: rituais; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rituais (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    elemento text NOT NULL,
    circulo integer DEFAULT 1 NOT NULL,
    execucao text,
    alcance text,
    alvo text,
    duracao text,
    resistencia text,
    custo_pe integer DEFAULT 0 NOT NULL,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    discente text,
    verdadeiro text,
    fonte text,
    dados text,
    dados_discente text,
    dados_verdadeiro text
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: trilhas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trilhas (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    classe_id character varying NOT NULL,
    nome text NOT NULL,
    fonte text DEFAULT 'Livro Base'::text NOT NULL,
    habilidades jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    password_hash character varying
);


--
-- Data for Name: campanha_membros; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campanha_membros (id, campanha_id, user_id, papel, joined_at) FROM stdin;
25ba8a97-04aa-444c-8973-dede90859b0d    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    mestre  2026-03-12 15:30:33.36611+00
\.


--
-- Data for Name: campanha_personagens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campanha_personagens (id, campanha_id, personagem_id, user_id, added_at, preparacao) FROM stdin;
ee6f8a25-9351-4d7f-8e9d-8df54f2041e6    c0d03f98-a3e2-4855-ac78-3bc592f563e9    8ba43481-3dbf-41be-92e1-25b9d856d76a    2142da82-5a31-4209-b821-06af2c8a9bb6    2026-03-14 17:51:45.971922+00   {"itens": [], "pronto": false, "rituais": []}
\.


--
-- Data for Name: campanha_rolagens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campanha_rolagens (id, campanha_id, user_id, rolando_como, label, tipo, atributo, qtd_dados_base, bonus_pericia, modificadores_o, expressao_dano, dados_rolados, resultado_base, resultado_final, sucesso_automatico, modo_penalidade, created_at) FROM stdin;
3516f8a5-a494-45dd-ae69-4e806293ba33    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    Daniel  \N      pericia AGI     1       0       0       \N      [2]     2       2       f       f       2026-03-12 15:49:33.330974+00
3acf8d8a-099a-4b62-b839-d7b7ef10e9e5    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Sobrevivência   pericia Intelecto       1       0       0       \N      [14]    14      14      f       f       2026-03-12 16:09:37.920503+00
9527323d-02f6-423f-a0ad-dd11d2f2770a    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    Daniel  Intimidação     pericia PRE     1       0       0       \N      [17]    17      17      f       f       2026-03-12 16:14:38.678615+00
314bef96-600a-4575-8b4e-f7a1c974d54b    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Acrobacia       pericia AGI     1       0       0       \N      [8]     8       8       f       f       2026-03-12 16:38:39.796559+00
af67554f-c93a-4f6d-a6b6-482ca6c701ec    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Adestramento    pericia PRE     3       0       0       \N      [4, 20, 17]     20      20      t       f       2026-03-12 16:38:43.524804+00
14fdf29b-56bf-457d-a19e-ce7505662a74    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Enganação       pericia PRE     3       5       0       \N      [2, 3, 14]      14      19      f       f       2026-03-12 16:38:47.251408+00
aa0fc6ea-472d-4440-afda-6bef172a7d81    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Furtividade     pericia AGI     1       5       0       \N      [19]    19      24      f       f       2026-03-12 16:38:53.041735+00
b17b3a3d-403e-40c8-8163-d288991cac8e    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Acrobacia       pericia AGI     1       0       0       \N      [3]     3       3       f       f       2026-03-12 16:59:39.872218+00
1e83fbdf-5045-4c49-a244-65f79aac17c4    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Adestramento    pericia PRE     3       0       0       \N      [9, 11, 5]      11      11      f       f       2026-03-12 16:59:43.242695+00
52cd8f8a-d9e0-4500-92c1-f6313a22a1a6    c0d03f98-a3e2-4855-ac78-3bc592f563e9    2142da82-5a31-4209-b821-06af2c8a9bb6    002     Adestramento    pericia PRE     3       0       0       \N      [7, 1, 15]      15      15      f       f       2026-03-12 16:59:44.369858+00
\.


--
-- Data for Name: campanhas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campanhas (id, nome, descricao, codigo_convite, created_at, updated_at) FROM stdin;
c0d03f98-a3e2-4855-ac78-3bc592f563e9    Operação        \N      JAIGHI  2026-03-12 15:30:33.204133+00   2026-03-12 15:30:33.204133+00
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.classes (id, nome, descricao, pv_inicial, pv_por_nivel, pe_inicial, pe_por_nivel, san_inicial, san_por_nivel, pericias_treindas_base, created_at, habilidades_base) FROM stdin;
a82dded1-633e-4330-ad2e-669f5e53dde8    Combatente      Agente de combate da Ordem Paranormal. Especializado em confrontos diretos com entidades e ameaças paranormais. 20      4       2       2       12      3       1       2026-03-12 03:58:08.87996+00    [{"nex": "5%", "nome": "Ataque Especial (2 PE, +5)", "descricao": "Você pode gastar 2 PE para receber +5 em testes de ataque ou rolagens de dano com um ataque."}, {"nex": "10%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a primeira habilidade da trilha escolhida."}, {"nex": "15%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "20%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "25%", "nome": "Ataque Especial (3 PE, +10)", "descricao": "O bônus do seu Ataque Especial aumenta para +10 e o custo para 3 PE."}, {"nex": "30%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "35%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 2 + Int. Seu grau de treinamento nessas perícias aumenta para veterano."}, {"nex": "40%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a segunda habilidade da trilha escolhida."}, {"nex": "45%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "50%", "nome": "Aumento de Atributo, Versatilidade", "descricao": "Aumente um atributo em +1. Escolha entre um poder de combatente ou o primeiro poder de uma trilha que não a sua."}, {"nex": "55%", "nome": "Ataque Especial (4 PE, +15)", "descricao": "O bônus do seu Ataque Especial aumenta para +15 e o custo para 4 PE."}, {"nex": "60%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "65%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a terceira habilidade da trilha escolhida."}, {"nex": "70%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 2 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)."}, {"nex": "75%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "80%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "85%", "nome": "Ataque Especial (5 PE, +20)", "descricao": "O bônus do seu Ataque Especial aumenta para +20 e o custo para 5 PE."}, {"nex": "90%", "nome": "Poder de Combatente", "descricao": "Você recebe um poder de combatente à sua escolha."}, {"nex": "95%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "99%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a quarta habilidade da trilha escolhida."}]
cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Especialista    Agente versátil da Ordem Paranormal. Adaptável a qualquer situação graças a seu extenso treinamento em perícias.        16      3       3       3       16      4       7       2026-03-12 03:58:08.884957+00   [{"nex": "5%", "nome": "Eclético, Perito (2 PE, +1d6)", "descricao": "Gaste 2 PE para ser treinado em perícia. Escolha 2 perícias para somar +1d6 por 2 PE."}, {"nex": "10%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a primeira habilidade da trilha escolhida."}, {"nex": "15%", "nome": "Poder de Especialista", "descricao": "Você recebe um poder de especialista à sua escolha."}, {"nex": "20%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "25%", "nome": "Perito (3 PE, +1d8)", "descricao": "O bônus do seu Perito aumenta para +1d8 e o custo para 3 PE."}, {"nex": "30%", "nome": "Poder de Especialista", "descricao": "Você recebe um poder de especialista à sua escolha."}, {"nex": "35%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 5 + Int. Seu grau de treinamento nessas perícias aumenta para veterano."}, {"nex": "40%", "nome": "Engenhosidade (Veterano), Habilidade de Trilha", "descricao": "Eclético pode dar bônus de veterano por +2 PE. Recebe a segunda habilidade da trilha."}, {"nex": "45%", "nome": "Poder de Especialista", "descricao": "Você recebe um poder de especialista à sua escolha."}, {"nex": "50%", "nome": "Aumento de Atributo, Versatilidade", "descricao": "Aumente um atributo em +1. Escolha entre um poder de especialista ou o primeiro poder de uma trilha que não a sua."}, {"nex": "55%", "nome": "Perito (4 PE, +1d10)", "descricao": "O bônus do seu Perito aumenta para +1d10 e o custo para 4 PE."}, {"nex": "60%", "nome": "Poder de Especialista", "descricao": "Você recebe um poder de especialista à sua escolha."}, {"nex": "65%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a terceira habilidade da trilha escolhida."}, {"nex": "70%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 5 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)."}, {"nex": "75%", "nome": "Engenhosidade (Expert), Poder de Especialista", "descricao": "Eclético pode dar bônus de expert por +4 PE. Recebe um poder de especialista."}, {"nex": "80%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "85%", "nome": "Perito (5 PE, +1d12)", "descricao": "O bônus do seu Perito aumenta para +1d12 e o custo para 5 PE."}, {"nex": "90%", "nome": "Poder de Especialista", "descricao": "Você recebe um poder de especialista à sua escolha."}, {"nex": "95%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "99%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a quarta habilidade da trilha escolhida."}]
5882ea7c-0fa6-479d-a327-27423b19772c    Ocultista       Agente especializado no Outro Lado. Domina rituais e conhecimentos proibidos para combater o paranormal com suas próprias armas.        12      2       4       4       20      5       3       2026-03-12 03:58:08.888758+00   [{"nex": "5%", "nome": "Escolhido pelo Outro Lado (1º círculo)", "descricao": "Pode lançar rituais de 1º círculo. Começa com 3 rituais."}, {"nex": "10%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a primeira habilidade da trilha escolhida."}, {"nex": "15%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "20%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "25%", "nome": "Escolhido pelo Outro Lado (2º círculo)", "descricao": "Pode lançar rituais de 2º círculo."}, {"nex": "30%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "35%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 3 + Int. Seu grau de treinamento nessas perícias aumenta para veterano."}, {"nex": "40%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a segunda habilidade da trilha escolhida."}, {"nex": "45%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "50%", "nome": "Aumento de Atributo, Versatilidade", "descricao": "Aumente um atributo em +1. Escolha entre um poder de ocultista ou o primeiro poder de uma trilha que não a sua."}, {"nex": "55%", "nome": "Escolhido pelo Outro Lado (3º círculo)", "descricao": "Pode lançar rituais de 3º círculo."}, {"nex": "60%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "65%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a terceira habilidade da trilha escolhida."}, {"nex": "70%", "nome": "Grau de Treinamento", "descricao": "Escolha um número de perícias treinadas igual a 3 + Int. Seu grau de treinamento nessas perícias aumenta em um nível (até expert)."}, {"nex": "75%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "80%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "85%", "nome": "Escolhido pelo Outro Lado (4º círculo)", "descricao": "Pode lançar rituais de 4º círculo."}, {"nex": "90%", "nome": "Poder de Ocultista", "descricao": "Você recebe um poder de ocultista à sua escolha."}, {"nex": "95%", "nome": "Aumento de Atributo", "descricao": "Aumente um atributo a sua escolha em +1 (máximo 5)."}, {"nex": "99%", "nome": "Habilidade de Trilha", "descricao": "Você recebe a quarta habilidade da trilha escolhida."}]
307d335e-6217-44e2-8e9e-4e70b5048c7b    Sobrevivente    Um civil comum que foi jogado de frente para o paranormal. Sem treinamento formal, sobrevive graças à teimosia, sorte e instinto.       8       2       2       1       8       2       3       2026-03-12 03:58:08.892526+00   [{"nex": "Estágio 1", "nome": "Empenho", "descricao": "Gaste 1 PE para receber +2 em um teste de perícia."}, {"nex": "Estágio 2", "nome": "Habilidade de Trilha", "descricao": "Recebe a primeira habilidade da trilha de sobrevivente."}, {"nex": "Estágio 3", "nome": "Aumento de Atributo", "descricao": "Aumenta um atributo em +1 (máximo 3)."}, {"nex": "Estágio 4", "nome": "Habilidade de Trilha", "descricao": "Recebe a segunda habilidade da trilha de sobrevivente."}, {"nex": "Estágio 5", "nome": "Cicatrizado", "descricao": "Sacrifique 1 PV ou PE permanentemente para ignorar dano mental ou reduzir dano físico à metade."}]
\.


--
-- Data for Name: habilidades; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.habilidades (id, nome, categoria, classe, descricao, fonte, alterada, nex, created_at) FROM stdin;
4a284932-0aac-4d86-8632-df79d5affd17    Escudo Veloz    PODER_GERAL     GERAL   Ao ser atingido por um ataque, como reação, gasta 1 PE para adicionar +5 na sua Defesa contra aquele ataque.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
e2e2ed2d-3cd4-4ea8-8ad1-b88c2db13a42    Mestre em Arma  PODER_GERAL     GERAL   Escolha uma arma. Recebe +2 em testes de ataque e +2 no dano com essa arma. Pode ser escolhido várias vezes, cada vez para uma arma diferente.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
6704692e-bb8e-4597-acec-8acfc04d3109    Amigo dos Animais       ORIGEM  GERAL   Recebe +5 em Adestramento. Animais não agressivos nunca o atacam. Pode tentar treinar qualquer animal, mesmo os selvagens.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
404ba403-8a7f-4431-82b8-369ce130b919    Cientista       ORIGEM  GERAL   Uma vez por cena, ao fazer um teste de Ciências ou Tecnologia, pode optar por não rolar o dado: resultado automático de 10 + bônus total.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
f7846aac-b571-47e7-8458-ee41a886779e    Colegial        ORIGEM  GERAL   Recebe +2 em perícias de conhecimento (Ciências, História, Ocultismo, Religião). Uma vez por cena pode pedir ajuda a um contato escolar para obter uma informação.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
ce96c084-bc0d-46d7-a12a-6fd49a8d565b    Cozinheiro      ORIGEM  GERAL   Uma vez por descanso longo, prepara uma refeição para até 6 personagens. Cada um recupera 1 nível de fadiga e recebe +5 PV temporários até o próximo descanso.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
275114da-13e6-4c62-9082-ae4982c54431    Dublê   ORIGEM  GERAL   Recebe +5 em Acrobacia e Atletismo. Reduz em 1 dado qualquer queda (ex.: 3d6 vira 2d6). Pode usar Atletismo no lugar de Reflexos para esquivar de explosões.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
daeb596b-e4a8-4855-9f67-a6328cb0e80c    Experimento     ORIGEM  GERAL   Escolha: +1 em Vigor; ou RD 2 contra um tipo de dano; ou visão no escuro em alcance curto. Sofre –2 em Presença com pessoas que percebam algo errado em você.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
2969a014-9d54-4326-b6a3-f69e40b2abda    Fazendeiro      ORIGEM  GERAL   Recebe +5 em Sobrevivência e pode usar Sobrevivência para primeiros socorros. Uma vez por cena, ao realizar trabalho físico prolongado, pode ignorar um nível de fadiga.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
0650d8df-0957-428f-afa9-8301f36fdd4a    Herdeiro        ORIGEM  GERAL   Recebe +5 em Diplomacia e Enganação com pessoas de alta sociedade. Uma vez por aventura, pode usar sua influência para obter um favor de um contato de alto status.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
ce2213d5-f4cd-4042-a058-d3604b89d9c0    Mergulhador     ORIGEM  GERAL   Pode prender a respiração por 2 + Vigor minutos. Recebe +5 em Atletismo para nadar e não sofre penalidade de movimento na água. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
4f413691-01ce-4f6d-b10f-b06f3e2dbb07    Político        ORIGEM  GERAL   Recebe +5 em Diplomacia e Enganação. Uma vez por cena, pode usar sua influência para obter informações privilegiadas ou favor de uma figura de autoridade local.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
b540ac7e-4c98-49a5-a375-c0a4b4b64740    Eclético        HABILIDADE_CLASSE       ESPECIALISTA    Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.     LIVRO_BASE      f       5       2026-03-12 20:31:33.479561+00
9a9d1587-8cd0-4a76-aaa9-c65d990a66a6    Escolhido pelo Outro Lado       HABILIDADE_CLASSE       OCULTISTA       Você teve uma experiência paranormal e foi marcado pelo Outro Lado, absorvendo o conhecimento e poder necessários para realizar rituais. Você pode lançar rituais de 1º círculo (2º em NEX 25%, 3º em NEX 55%, 4º em NEX 85%). Você começa com três rituais de 1º círculo e aprende um ritual adicional sempre que avança de NEX.       LIVRO_BASE      f       5       2026-03-12 20:31:33.479561+00
7f249b6e-9168-44c3-90b2-b07e15ae433b    Artista Marcial PODER_GERAL     GERAL   Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
ccbcf35a-2373-4566-aeda-22ff06c1a479    Combate Defensivo       PODER_GERAL     GERAL   Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –5 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
2eae88b0-903e-493c-8e0e-189b2adbd132    Tiro de Cobertura       PODER_GERAL     GERAL   Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. Este é um efeito de medo.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
a5650113-dc33-42cc-8bbd-8d40998c8fcd    Apego Angustiado        PODER_CLASSE    COMBATENTE      Não importa o quão profundos sejam seus ferimentos, você escolhe a agonia enlouquecedora da dor a perder a consciência diante da própria morte. Você não fica inconsciente por estar morrendo, mas sempre que terminar uma rodada nesta condição e consciente, perde 2 pontos de Sanidade.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
50fd0f7b-2b68-43ba-b5c6-72f33ab6e00c    Ciente das Cicatrizes   PODER_CLASSE    COMBATENTE      Acostumado a manusear armas, você aprendeu também a identificar as marcas que elas deixam. Quando faz um teste para encontrar uma pista relacionada a armas ou ferimentos (como um teste para necropsia ou para identificar uma arma amaldiçoada), você pode usar Luta ou Pontaria no lugar da perícia original. Pré-requisito: treinado em Luta ou Pontaria.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
2f2b745e-2e94-4779-baa4-d67e7f9ad894    Correria Desesperada    PODER_CLASSE    COMBATENTE      Você já esteve diante de coisas que não podem ser derrotadas e aprendeu da forma mais trágica que às vezes fugir é a única chance de vitória. Você recebe +3m em seu deslocamento e +5 em testes de perícia para fugir em uma perseguição.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
d9bdfd4d-d4b8-4057-ad42-caf2d27637b5    Engolir o Choro PODER_CLASSE    COMBATENTE      Mesmo ferido, você não vai emitir um pio até que a ameaça se afaste. Você não sofre penalidades por condições em testes de perícia para fugir e em testes de Furtividade.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
3acb2e82-b790-4d6d-9ae7-db5627e97c5e    Mochileiro      PODER_CLASSE    COMBATENTE      Você já precisou pegar a estrada para escapar de perseguidores o suficiente para saber como carregar tudo que precisa. Seu limite de carga aumenta em 5 espaços e você pode se beneficiar de uma vestimenta adicional. Pré-requisito: Vig 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
d9b561ba-a784-4215-804d-ea18ccac8ac7    Ataque Especial HABILIDADE_CLASSE       COMBATENTE      Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5. Em NEX 25% custa 3 PE (+10), NEX 55% custa 4 PE (+15) e NEX 85% custa 5 PE (+20). Você pode aplicar cada bônus de +5 em ataque ou dano.     LIVRO_BASE      f       5       2026-03-12 20:31:33.479561+00
1133aba5-ee96-4563-809c-6a679ff8af85    Tanque de Guerra        PODER_CLASSE    COMBATENTE      Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2. Pré-requisito: Proteção Pesada.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.29681+00
7261d340-167d-4490-97e8-d93e5e893f77    Tiro Certeiro   PODER_CLASSE    COMBATENTE      Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria.       LIVRO_BASE      f       \N      2026-03-12 21:08:12.299035+00
6a26bd77-865d-4f2c-82c6-201c89177848    Sacrificar os Joelhos   PODER_CLASSE    COMBATENTE      Diante de algo que não pode ser vencido, você abre mão da autopreservação para superar seus limites de fuga. Uma vez por cena de perseguição, quando faz a ação esforço extra, você pode gastar 2 PE para passar automaticamente no teste de perícia. Pré-requisito: treinado em Atletismo.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
e2083589-21c2-4097-b57c-64ef74c5b41f    Valentão        PODER_CLASSE    COMBATENTE      Em algum momento, a vida lhe ensinou que a brutalidade pode ser amedrontadora, e agora esse é seu principal idioma. Você pode usar Força no lugar de Presença para Intimidação. Além disso, uma vez por cena, pode gastar 1 PE para fazer um teste de Intimidação para assustar como uma ação livre.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
5a52d3cd-58a4-4652-aaf0-87c9aa1ad00e    Perito  HABILIDADE_CLASSE       ESPECIALISTA    Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. Em NEX 25% custa 3 PE (+1d8), NEX 55% custa 4 PE (+1d10) e NEX 85% custa 5 PE (+1d12).       LIVRO_BASE      f       5       2026-03-12 20:31:33.479561+00
c5372bce-e0b1-491c-af4f-1efe3d570418    Combater com Duas Armas PODER_GERAL     GERAL   Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –5 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
72b4688f-68d7-4e62-887b-7646bc348e54    Saque Rápido    PODER_GERAL     GERAL   Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
0821f138-5179-4712-a529-653902f4037d    Armamento Pesado        PODER_CLASSE    COMBATENTE      Você recebe proficiência com armas pesadas. Pré-requisito: For 2.       LIVRO_BASE      f       \N      2026-03-12 21:08:12.257717+00
bd8b697d-c1ef-4d32-b33f-994212369623    Artista Marcial PODER_CLASSE    COMBATENTE      Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e se tornam ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.     LIVRO_BASE      f       \N      2026-03-12 21:08:12.261085+00
b40054af-5a37-4cf7-be01-c75f1102696a    Ataque de Oportunidade  PODER_CLASSE    COMBATENTE      Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele. LIVRO_BASE      f       \N      2026-03-12 21:08:12.26347+00
37e797ec-a310-48ea-b55e-f02c2f7337b7    Combater com Duas Armas PODER_CLASSE    COMBATENTE      Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –5 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria. LIVRO_BASE      f       \N      2026-03-12 21:08:12.266317+00
4b893f6d-0cf5-4540-87a5-8626795bcd78    Combate Defensivo       PODER_CLASSE    COMBATENTE      Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –5 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2.       LIVRO_BASE      f       \N      2026-03-12 21:08:12.269258+00
923f54aa-0956-4635-8476-247847f3050c    Golpe Demolidor PODER_CLASSE    COMBATENTE      Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pré-requisitos: For 2, treinado em Luta. LIVRO_BASE      f       \N      2026-03-12 21:08:12.27266+00
05f81d75-819b-4ec5-bfc7-37e2e37d54bf    Golpe Pesado    PODER_CLASSE    COMBATENTE      Enquanto estiver empunhando uma arma corpo a corpo, o dano dela aumenta em mais um dado do mesmo tipo.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.275607+00
c9323c05-4327-48d2-986d-ba74fe82e420    Incansável      PODER_CLASSE    COMBATENTE      Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.278026+00
217676d3-5146-4813-b638-2d5aa6aea16c    Presteza Atlética       PODER_CLASSE    COMBATENTE      Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +5 no teste.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.280661+00
cbe89002-7f43-46a1-8058-cee3cb0a5ba2    Proteção Pesada PODER_CLASSE    COMBATENTE      Você recebe proficiência com Proteções Pesadas. Pré-requisito: NEX 30%. LIVRO_BASE      f       \N      2026-03-12 21:08:12.283411+00
1901d9b9-195a-45fc-b321-bf4d7f061002    Reflexos Defensivos     PODER_CLASSE    COMBATENTE      Você recebe +2 em Defesa e em testes de resistência. Pré-requisito: Agi 2.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.285775+00
5e324873-17cf-4849-aa95-6b28fddd6fdf    Saque Rápido    PODER_CLASSE    COMBATENTE      Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.288623+00
d5306cd4-f292-4b41-b211-2386b0c75d92    Segurar o Gatilho       PODER_CLASSE    COMBATENTE      Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno (2 PE pelo 1º extra, 4 PE pelo 2º extra, etc.). Pré-requisito: NEX 60%.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.291359+00
3eb065c0-45fb-4435-94d6-f4ee103595a4    Sentido Tático  PODER_CLASSE    COMBATENTE      Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena. Pré-requisitos: Int 2, treinado em Percepção e Tática.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.294149+00
065e158d-8512-42f0-852b-98e8c0e69559    Tiro de Cobertura       PODER_CLASSE    COMBATENTE      Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um ser no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. Este é um efeito de medo.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.301975+00
81fd2a04-508a-48fd-b8c4-170342338388    Transcender     PODER_CLASSE    COMBATENTE      Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.305187+00
73f7693f-9f60-413e-a652-c9f292ea7d43    Treinamento em Perícia  PODER_CLASSE    COMBATENTE      Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.308264+00
d549502b-0977-440e-a2d2-702f8de5e55f    Artista Marcial PODER_CLASSE    ESPECIALISTA    Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.     LIVRO_BASE      f       \N      2026-03-12 21:08:12.323463+00
01493c08-a8be-44c8-8990-6572e8906acc    Balística Avançada      PODER_CLASSE    ESPECIALISTA    Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.325808+00
4ac324d3-ed15-4aa9-8aa1-820411764f60    Conhecimento Aplicado   PODER_CLASSE    ESPECIALISTA    Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int. Pré-requisito: Int 2.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.328754+00
827892d5-f4bc-47af-b296-9c3d3a523870    Hacker  PODER_CLASSE    ESPECIALISTA    Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa. Pré-requisito: treinado em Tecnologia.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.331761+00
007d5573-a01e-44ee-9c06-1c0179286928    Mãos Rápidas    PODER_CLASSE    ESPECIALISTA    Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre. Pré-requisitos: Agi 3, treinado em Crime.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.333957+00
7abbb094-5894-4c67-b665-7de198147510    Mochila de Utilidades   PODER_CLASSE    ESPECIALISTA    Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.337253+00
02be3479-d1c1-4ab5-81fc-473b24d7d48d    Movimento Tático        PODER_CLASSE    ESPECIALISTA    Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno. Pré-requisito: treinado em Atletismo.   LIVRO_BASE      f       \N      2026-03-12 21:08:12.439405+00
2c82b64a-a339-43f3-960e-4e571175ed0b    Na Trilha Certa PODER_CLASSE    ESPECIALISTA    Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +5 no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +10 no próximo teste, e assim por diante).       LIVRO_BASE      f       \N      2026-03-12 21:08:12.442428+00
84053787-2d24-40de-a601-75b2d5b5fdb7    Nerd    PODER_CLASSE    ESPECIALISTA    Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (dica para pista em investigação, fraqueza de inimigo em combate, etc.).    LIVRO_BASE      f       \N      2026-03-12 21:08:12.445317+00
7b73c860-e99e-45ff-a162-b27e951e308b    Ninja Urbano    PODER_CLASSE    ESPECIALISTA    Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com armas de corpo a corpo e de disparo.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.448673+00
c3d4aca3-fa4e-4b19-9d3c-035bae768eb3    Pensamento Ágil PODER_CLASSE    ESPECIALISTA    Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.   LIVRO_BASE      f       \N      2026-03-12 21:08:12.451704+00
02fbd4b5-a575-42a2-877b-91346a39332d    Perito em Explosivos    PODER_CLASSE    ESPECIALISTA    Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.455252+00
785a5799-74a7-49c1-8c31-bb643f435e2d    Primeira Impressão      PODER_CLASSE    ESPECIALISTA    Você recebe +5 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.       LIVRO_BASE      f       \N      2026-03-12 21:08:12.457886+00
21893455-9f08-4419-9ef7-a12ed62ae76b    Transcender     PODER_CLASSE    ESPECIALISTA    Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.460759+00
45d9892b-ebba-40af-973a-ba8973f9a1ff    Treinamento em Perícia  PODER_CLASSE    ESPECIALISTA    Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.464138+00
7681d629-0b3a-4633-bdb0-dab20a06ee02    Camuflar Ocultismo      PODER_CLASSE    OCULTISTA       Você pode gastar uma ação livre para esconder símbolos e sigilos em objetos ou em sua pele, tornando-os invisíveis para outros além de você. Quando lança um ritual, pode gastar +2 PE para lançá-lo sem componentes ritualísticos e sem gesticular (permite conjurar com as mãos presas). Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25).     LIVRO_BASE      f       \N      2026-03-12 21:08:12.476393+00
00e5808c-e86c-4da0-8db1-74258ce7ed91    Criar Selo      PODER_CLASSE    OCULTISTA       Você sabe fabricar selos paranormais de rituais que conheça. Fabricar um selo gasta uma ação de interlúdio e PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.479358+00
236fa223-98fa-410e-8469-9cff9705707a    Envolto em Mistério     PODER_CLASSE    OCULTISTA       Sua aparência e postura assombrosas permitem manipular e assustar pessoas ignorantes ou supersticiosas. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.481979+00
613fe3bf-622a-4da2-b6c8-2640028cd3c8    Especialista em Elemento        PODER_CLASSE    OCULTISTA       Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.48466+00
7bbfa852-3386-4d69-aa61-dddf65b11168    Ferramentas Paranormais PODER_CLASSE    OCULTISTA       Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.487453+00
ba2c63f6-0616-40ce-b012-9fa69b7cac2d    Fluxo de Poder  PODER_CLASSE    OCULTISTA       Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com apenas uma ação livre, pagando o custo de cada efeito separadamente. Pré-requisito: NEX 60%.     LIVRO_BASE      f       \N      2026-03-12 21:08:12.490483+00
4f57bf02-9ecc-45d5-9c63-6b917ec0eb4a    Guiado pelo Paranormal  PODER_CLASSE    OCULTISTA       Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.493915+00
fcde4351-049a-4faa-ae98-6efdafb64458    Identificação Paranormal        PODER_CLASSE    OCULTISTA       Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.  LIVRO_BASE      f       \N      2026-03-12 21:08:12.496884+00
e0c485f1-e6f4-4367-a5d7-6b3616ba130e    Improvisar Componentes  PODER_CLASSE    OCULTISTA       Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.        LIVRO_BASE      f       \N      2026-03-12 21:08:12.499581+00
327b38e7-2411-45b2-87b2-ec1ced4c3943    Intuição Paranormal     PODER_CLASSE    OCULTISTA       Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).     LIVRO_BASE      f       \N      2026-03-12 21:08:12.501853+00
a9eef6a6-18b0-4fe2-ba3b-60b4ef78f1b8    Mestre em Elemento      PODER_CLASSE    OCULTISTA       Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. Essa redução se acumula com outras fontes. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%.   LIVRO_BASE      f       \N      2026-03-12 21:08:12.504524+00
0b2f8cc6-1bc8-4784-b0ad-fb793227485a    Ritual Potente  PODER_CLASSE    OCULTISTA       Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pré-requisito: Int 2.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.506794+00
7eb57cee-963d-44f8-a739-90a3d10d31e9    Ritual Predileto        PODER_CLASSE    OCULTISTA       Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes.   LIVRO_BASE      f       \N      2026-03-12 21:08:12.509678+00
c9457cae-56a0-40e8-b3ea-642abbdb9680    Tatuagem Ritualística   PODER_CLASSE    OCULTISTA       Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.512429+00
1051a5b2-996c-4fc5-8858-b8b9c1d2568b    Transcender     PODER_CLASSE    OCULTISTA       Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.    LIVRO_BASE      f       \N      2026-03-12 21:08:12.514625+00
8f43914e-f8c7-44f3-8d3d-b98ede4a6622    Treinamento em Perícia  PODER_CLASSE    OCULTISTA       Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.      LIVRO_BASE      f       \N      2026-03-12 21:08:12.517682+00
7d981ffb-b7da-42df-b668-5f9bcef8ac7b    Acrobático      PODER_GERAL     GERAL   Você possui um talento natural para piruetas, cambalhotas e outras acrobacias complexas. Você recebe treinamento em Acrobacia ou, se já for treinado nesta perícia, recebe +2 nela. Além disso, terreno difícil não reduz seu deslocamento nem o impede de realizar investidas. Pré-requisito: Agi 2.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.532699+00
99902300-47f8-4bb8-931b-2a1ab7cc0855    Ás do Volante   PODER_GERAL     GERAL   Você é um apaixonado por velocidade e tem a coragem necessária para executar qualquer manobra. Você recebe treinamento em Pilotagem ou, se já for treinado, recebe +2 nela. Além disso, uma vez por rodada, quando um veículo que você está pilotando sofre dano, você pode fazer um teste de Pilotagem (DT igual ao resultado do teste de ataque ou à DT do efeito que causou o dano). Se passar, evita esse dano. Pré-requisito: Agi 2.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.535109+00
b7c3c571-9f72-4c2a-9940-40b9c50d0895    Atlético        PODER_GERAL     GERAL   Você possui um corpo atlético, resultado de fortuita disposição genética ou árduo treinamento. Você recebe treinamento em Atletismo ou, se já for treinado, recebe +2 nela. Além disso, recebe +3m em seu deslocamento. Pré-requisito: For 2.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.537737+00
2c37b43a-a36c-4819-97f2-754455394d3e    Atraente        PODER_GERAL     GERAL   Seja por pura beleza física ou por sua postura e atitude, você atrai olhares por onde passa. Você recebe +5 em testes de Artes, Diplomacia, Enganação e Intimidação contra pessoas que possam se sentir fisicamente atraídas por você. Pré-requisito: Pre 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.540883+00
03926ffa-308e-4f72-b040-ededb2fe42f7    Dedos Ágeis     PODER_GERAL     GERAL   Você possui uma motricidade fina precisa, particularmente útil para manipular ferramentas delicadas. Você recebe treinamento em Crime ou, se já for treinado, recebe +2 nela. Além disso, pode arrombar com uma ação padrão, furtar com uma ação livre (apenas uma vez por rodada) e sabotar com uma ação completa. Pré-requisito: Agi 2.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.543918+00
601fc638-9d4f-4d30-8db3-a1b195b780f1    Detector de Mentiras    PODER_GERAL     GERAL   Você possui uma aptidão para perceber os sutis sinais de alguém que está mentindo. Você recebe treinamento em Intuição ou, se já for treinado, recebe +2 nela. Além disso, outros seres sofrem uma penalidade de –10 em testes de Enganação para mentir para você. Pré-requisito: Pre 2.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.546756+00
afa950c7-684a-47ea-a9f9-eece461f6f9c    Especialista em Emergências     PODER_GERAL     GERAL   Você recebeu treinamento como socorrista de emergência e sabe tratar um paciente em situações de urgência. Você recebe treinamento em Medicina ou, se já for treinado, recebe +2 nela. Além disso, pode aplicar cicatrizantes e medicamentos como uma ação de movimento e, uma vez por rodada, pode sacar um desses itens como uma ação livre. Pré-requisito: Int 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.54932+00
dd7ae810-74ad-4b87-8ed0-65425b8d0803    Estigmado       PODER_GERAL     GERAL   A adrenalina causada pela dor faz você se manter focado no que está acontecendo. Sempre que sofre dano mental de efeitos de medo, você pode converter esse dano em perda de pontos de vida (se sofre 5 pontos de dano mental de medo, pode, em vez disso, perder 5 pontos de vida).     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.552244+00
b99d84c0-4c85-402d-9a4f-d811f7ac96f2    Foco em Perícia PODER_GERAL     GERAL   Você se dedicou a estudar e treinar os vários pormenores de uma área de conhecimento específica. Escolha uma perícia (exceto Luta e Pontaria). Quando faz um teste dessa perícia, você rola +5. Você pode escolher este poder outras vezes para perícias diferentes. Pré-requisito: treinado na perícia escolhida.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.555274+00
3dc3fc41-63d8-454a-9c97-7cfd3a4da7a5    Informado       PODER_GERAL     GERAL   Você passa bastante tempo consumindo notícias sobre o mundo ao seu redor. Você recebe treinamento em Atualidades ou, se já for treinado, recebe +2 nela. Além disso, pode usar Atualidades no lugar de qualquer outra perícia para testes envolvendo informações, desde que aprovado pelo mestre. Pré-requisito: Int 2. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.558+00
60807aa9-7d61-4ddd-b996-0af0693d4617    Interrogador    PODER_GERAL     GERAL   Você sabe como usar o medo para extrair todo tipo de informação das outras pessoas. Você recebe treinamento em Intimidação ou, se já for treinado, recebe +2 nela. Além disso, pode fazer testes de Intimidação para coagir como uma ação padrão, mas apenas uma vez por cena contra a mesma pessoa. Pré-requisito: For 2.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.560534+00
8637f6d8-ca6b-4b5d-bc16-0bf674f8e14e    Inventário Organizado   PODER_GERAL     GERAL   Você sabe como organizar sua mochila e equipamento de forma organizada e racional. Você soma seu Intelecto no limite de espaços que pode carregar. Para você, itens muito leves ou pequenos que normalmente ocupam meio espaço (0,5) passam a ocupar 1/4 de espaço (0,25). Pré-requisito: Int 2.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.563383+00
96271d59-02f9-409d-853a-aa0810c9a5e4    Mentiroso Nato  PODER_GERAL     GERAL   Você é um cara de pau, capaz de mentir descaradamente sem que ninguém perceba. Você recebe treinamento em Enganação ou, se já for treinado, recebe +2 nela. Além disso, a penalidade que você sofre por mentiras muito implausíveis diminui para –5. Pré-requisito: Pre 2.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.566286+00
31de2726-c144-4f41-921e-b21877caefda    Observador      PODER_GERAL     GERAL   Você possui uma combinação de sentidos apurados para perceber pistas e intelecto afiado para processá-las. Você recebe treinamento em Investigação ou, se já for treinado, recebe +2 nela. Além disso, soma seu Intelecto em Intuição. Pré-requisito: Int 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.568779+00
b0e7139c-647f-4a73-ac93-836093f87245    Pai de Pet      PODER_GERAL     GERAL   Você adora animais e cuida de seus pets como se fossem seus filhos. Você recebe treinamento em Adestramento ou, se já for treinado, recebe +2 nela. Além disso, possui um animal de estimação aliado que o auxilia e acompanha em suas aventuras. Em termos de jogo, é um aliado que fornece +2 em duas perícias à sua escolha (exceto Luta ou Pontaria, aprovadas pelo mestre). Pré-requisito: Pre 2.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.571406+00
b7f457e5-49ab-4eda-bfd6-396d49bc7059    Palavras de Devoção     PODER_GERAL     GERAL   Você combina uma fé verdadeira com o conhecimento dos ritos e tradições de sua religião. Você recebe treinamento em Religião ou, se já for treinado, recebe +2 nela. Além disso, uma vez por cena, pode gastar 3 PE e uma ação completa para executar uma oração para um número de pessoas até o dobro de sua Presença. Até o fim da cena, todos os participantes recebem resistência a dano mental 5. Pré-requisito: Pre 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.574742+00
6bcb5824-f245-4760-b0c7-6f09cea52fe0    Parceiro        PODER_GERAL     GERAL   Em algum momento da sua vida, você conquistou uma amizade fiel e verdadeira. Você possui um parceiro aliado de um tipo à sua escolha que o acompanha e auxilia em suas missões. Ele obedece às suas ordens e se arrisca para ajudá-lo, mas se for maltratado pode parar de segui-lo. Se perder seu aliado, precisa gastar uma folga da Ordem para receber outro. Pré-requisitos: treinado em Diplomacia, NEX 30%.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.577909+00
7ba8d0bd-5994-4977-8aaf-c56625677b7e    Pensamento Tático       PODER_GERAL     GERAL   Você possui uma mente voltada para análises táticas e pensamento estratégico. Você recebe treinamento em Tática ou, se já for treinado, recebe +2 nela. Além disso, quando você passa em um teste de Tática para analisar terreno, você e seus aliados em alcance médio recebem uma ação de movimento adicional na primeira rodada do próximo combate neste terreno (desde que ocorra até o fim do dia). Pré-requisito: Int 2.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.581008+00
41d6621b-ce82-48e4-a31b-0079a472c22c    Personalidade Esotérica PODER_GERAL     GERAL   Você sempre teve uma afinidade com assuntos esotéricos. Você recebe +3 PE e recebe treinamento em Ocultismo. Se já for treinado nesta perícia, recebe +2 nela. Pré-requisito: Int 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.583804+00
aa160d71-53b6-460f-a80b-ac6cba390222    Persuasivo      PODER_GERAL     GERAL   Você possui uma personalidade diplomática e sabe obter o que deseja por meio de argumentação e conversa. Você recebe treinamento em Diplomacia ou, se já for treinado, recebe +2 nela. Além disso, ao fazer um teste para persuasão, a penalidade que você sofre por pedir coisas custosas ou perigosas diminui em –5. Pré-requisito: Pre 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.587173+00
b3e47190-8995-41af-b280-8e1a4397bbe8    Pesquisador Científico  PODER_GERAL     GERAL   Você possui um profundo respeito pela ciência e acredita que ela é a resposta para muitos de seus questionamentos. Você recebe treinamento em Ciências ou, se já for treinado, recebe +2 nela. Além disso, você pode usar Ciências no lugar de Ocultismo e Sobrevivência para identificar criaturas e animais, respectivamente. Pré-requisito: Int 2.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.590843+00
7447b29b-d267-454b-a5c4-9cb57c24c2cd    Proativo        PODER_GERAL     GERAL   Seu negócio é fazer as coisas e não deixar para depois. Você recebe treinamento em Iniciativa ou, se já for treinado, recebe +2 nela. Além disso, ao rolar um 19 ou 20 em pelo menos um dos dados de um teste de Iniciativa, você recebe uma ação padrão adicional em seu primeiro turno. Pré-requisito: Agi 2. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.593562+00
26728b69-8991-4f7d-bfdb-c0ed54d111cf    Provisões de Emergência PODER_GERAL     GERAL   Você é um sujeito precavido e mantém uma reserva secreta para quando as coisas ficarem ruins. Você possui um esconderijo com equipamentos e suprimentos para uma situação de emergência. Uma vez por missão, pode usar uma ação de interlúdio para recuperar o conteúdo de seu esconderijo. Você recebe novos equipamentos à sua escolha equivalentes à sua patente no início desta missão.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.596853+00
8e7f30c8-a79e-450f-b817-33db1aed7bec    Racionalidade Inflexível        PODER_GERAL     GERAL   Suas convicções e sua visão de mundo são baseadas em argumentos racionais e lógicos. Você pode usar Intelecto no lugar de Presença como atributo-chave de Vontade e para calcular seus pontos de esforço. Pré-requisito: Int 3. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.599883+00
f248950b-7973-4fb5-85ae-d7394d70d84a    Rato de Computador      PODER_GERAL     GERAL   Você adora computadores e outros dispositivos tecnológicos. Você recebe treinamento em Tecnologia ou, se já for treinado, recebe +2 nela. Você pode hackear, localizar arquivo ou operar dispositivo como uma ação completa e, uma vez por cena de investigação, se tiver acesso a um computador, pode fazer um teste de Tecnologia para procurar pistas sem gastar uma rodada de investigação. Pré-requisito: Int 2.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.603419+00
e52f9178-bcb7-4054-b450-cd0b5ba5052f    Resposta Rápida PODER_GERAL     GERAL   Seus reflexos são tão apurados que o permitem agir antes mesmo de você perceber as ameaças de forma consciente. Você recebe treinamento em Reflexos ou, se já for treinado, recebe +2 nela. Além disso, ao falhar em um teste de Percepção para evitar ficar desprevenido, você pode gastar 2 PE para rolar novamente o teste usando Reflexos. Pré-requisito: Agi 2.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.606409+00
d5190a31-b2d4-4820-b540-9474bde53605    Sentidos Aguçados       PODER_GERAL     GERAL   Todos os seus sentidos são mais aguçados que o normal. Você recebe treinamento em Percepção ou, se já for treinado nessa perícia, recebe +2 nela. Além disso, não fica desprevenido contra inimigos que não possa ver e, sempre que erra um ataque devido a camuflagem, pode rolar mais uma vez o dado da chance de falha. Pré-requisito: Pre 2.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.608991+00
de9cf629-f909-4b57-bb48-d7a0fa65d293    Sobrevivencialista      PODER_GERAL     GERAL   Você aprecia — ou aprecia enfrentar — a natureza. Você recebe treinamento em Sobrevivência ou, se já for treinado, recebe +2 nela. Além disso, você recebe +2 em testes para resistir a efeitos de clima e terreno difícil natural não reduz seu deslocamento nem impede que você execute investidas. Pré-requisito: Int 2.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.611951+00
7b20a72c-1c5d-42ef-82e8-ce7befd6bce3    Sorrateiro      PODER_GERAL     GERAL   Você sabe ser discreto em qualquer situação. Você recebe treinamento em Furtividade ou, se já for treinado, recebe +2 nela. Além disso, você não sofre penalidades por se mover normalmente enquanto está furtivo, nem por seguir alguém em ambientes sem esconderijos ou sem movimento. Pré-requisito: Agi 2.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.61503+00
f478d00f-2981-4123-8121-9e0e9240f6b8    Talentoso       PODER_GERAL     GERAL   Você possui inclinação para todas as formas de expressão artística. Você recebe treinamento em Artes ou, se já for treinado, recebe +2 nela. Além disso, quando faz um teste de Artes para impressionar, o bônus em perícias que você recebe aumenta em +1 para cada 5 pontos adicionais em que o resultado de seu teste passar a DT. Pré-requisito: Pre 2.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.617474+00
711730ac-0ea0-4854-9d2b-34d97161c39f    Teimosia Obstinada      PODER_GERAL     GERAL   As pessoas chamam você de teimoso. Você recebe treinamento em Vontade ou, se já for treinado, recebe +2 nela. Além disso, quando faz um teste de Vontade contra um efeito que cause uma condição mental ou tente modificar sua categoria de atitude (como o ritual Enfeitiçar), você pode gastar 2 PE para receber +5 neste teste. Pré-requisito: Pre 2.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.622027+00
9582bddf-7861-4efa-8be0-192e4ffd782f    Tenacidade      PODER_GERAL     GERAL   Seu corpo desenvolveu a capacidade de suportar rigores extremos. Você recebe treinamento em Fortitude ou, se já for treinado, recebe +2 nela. Além disso, ao estar morrendo mas consciente (com pelo menos 1 PV), você pode fazer um teste de Fortitude (DT 20 + 10 por teste anterior na mesma cena) como ação livre. Se for bem-sucedido, encerra a condição morrendo. Pré-requisito: Vig 2.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.625467+00
dd5d2bd7-6309-4759-93a8-3fa1d443baa5    Tiro Certeiro   PODER_GERAL     GERAL   Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria. Considerado poder geral: personagens de qualquer classe podem escolhê-lo.     LIVRO_BASE      f       \N      2026-03-12 21:08:12.628923+00
2f1c38d8-b3bc-4288-acef-88bd44b30f5c    Vitalidade Reforçada    PODER_GERAL     GERAL   Você possui uma capacidade superior de suportar ferimentos. Você recebe +1 PV para cada 5% de NEX (ou para cada nível, se estiver usando a regra de nível de experiência) e +2 em Fortitude. Pré-requisito: Vig 2.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.632093+00
798daf12-61b5-481b-b638-1a96564c2da1    Vontade Inabalável      PODER_GERAL     GERAL   Sua mente é preparada para suportar os mais rigorosos traumas. Você recebe +1 PE para cada 10% de NEX (ou para cada 2 níveis, se estiver usando a regra de nível de experiência) e +2 em Vontade. Pré-requisito: Pre 2. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:08:12.635899+00
f77b85fa-a3ae-4af4-8489-f0be4816ad4e    Caminho para Forca      PODER_CLASSE    COMBATENTE      Se for para alguém do seu grupo ser pego, que seja você. Quando usa a ação sacrifício em uma cena de perseguição, você pode gastar 1 PE para fornecer +5 extra (total de +10) nos testes dos outros personagens. Quando usa a ação chamar atenção em uma cena de furtividade, pode gastar 1 PE para diminuir a visibilidade de todos os seus aliados próximos em –2 (em vez de –1).     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
27b2b72f-d612-4ab8-bedd-dbae7c6d59e2    Instinto de Fuga        PODER_CLASSE    COMBATENTE      Sabendo que nem toda batalha pode ser vencida, você desenvolveu um sexto sentido para prever quando é hora de fugir. Quando uma cena de perseguição (ou semelhante) tem início, você recebe +2 em todos os testes de perícia que fizer durante a cena. Pré-requisito: treinado em Intuição.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
24ec1fc3-e809-41b7-a50c-385e09150273    Paranoia Defensiva      PODER_CLASSE    COMBATENTE      Você sabe que eles estão lá fora e fará tudo ao seu alcance para mantê-los assim. Uma vez por cena, você pode gastar uma rodada e 3 PE. Se fizer isso, você e cada aliado presente escolhe entre receber +5 na Defesa contra o próximo ataque que sofrer na cena ou receber um bônus de +5 em um único teste de perícia feito até o fim da cena.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
37413ee1-4646-4282-8e8a-7e3215115dad    Sem Tempo, Irmão        PODER_CLASSE    COMBATENTE      Você sabe que pistas são importantes, mas com o paranormal podendo surgir a qualquer momento, cada segundo conta. Uma vez por cena de investigação, quando usa a ação facilitar investigação, você pode prestar ajuda de forma apressada e descuidada. Você passa automaticamente no teste para auxiliar seus aliados, mas faz uma rolagem adicional na tabela de eventos de investigação.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 20:31:33.479561+00
c49d8bbe-ef0b-47d8-8ffb-f84f787ac88b    Acolher o Terror        PODER_CLASSE    ESPECIALISTA    Você já sofreu tanto medo que às vezes aceitar o terror é como voltar para casa. Você pode se entregar para o medo uma vez por sessão de jogo adicional.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.302813+00
8b0bce73-58bf-4f26-81f5-20d9e5393978    Contatos Oportunos      PODER_CLASSE    ESPECIALISTA    Ao longo de sua vida, você fez amizades úteis com pessoas de vários tipos em muitos lugares. Você pode usar uma ação de interlúdio para acionar seus contatos locais. Você recebe um aliado de um tipo à sua escolha que lhe acompanha até o fim da missão ou até ser dispensado. Você só pode ter um desses aliados por vez, e o mestre tem a palavra final sobre a disponibilidade. Pré-requisito: treinado em Crime. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.305487+00
8b7141d4-f7cd-42e4-9850-dfe83a4ef571    Disfarce Sutil  PODER_CLASSE    ESPECIALISTA    Você sabe como se disfarçar rapidamente, usando pequenos detalhes para alterar sua aparência. Quando faz um disfarce em si mesmo usando Enganação, você pode gastar 1 PE para se disfarçar como uma ação completa e sem necessidade de um kit de disfarces (se usar um kit, recebe +5 no teste). Pré-requisitos: Pre 2, treinado em Enganação.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.308549+00
0eab57d0-9528-47e3-8ff4-6bd2f502fdcc    Esconderijo Desesperado PODER_CLASSE    ESPECIALISTA    Você aprendeu da forma mais trágica que às vezes se esconder é a única chance de vitória. Você não sofre –5 em testes de Furtividade por se mover ao seu deslocamento normal. Além disso, em cenas de furtividade, sempre que passa em um teste para esconder-se, sua visibilidade diminui em –2 (em vez de apenas –1). SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.31114+00
b4a074ca-4eef-4caa-8342-c0900e9b7c81    Especialista Diletante  PODER_CLASSE    ESPECIALISTA    A vida lhe ensinou que todo tipo de conhecimento pode ser útil. Você aprende um poder que não pertença à sua classe (exceto poderes de trilha ou paranormais), à sua escolha, cujos pré-requisitos possa cumprir. Pré-requisito: NEX 30%.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.313824+00
35767e5e-eb5b-46e6-a87c-d0746afe51d8    Flashback       PODER_CLASSE    ESPECIALISTA    Um novo trauma recente desbloqueia um conhecimento adormecido. Talvez fosse uma memória enterrada fundo em sua mente, ou uma habilidade desenvolvida por seu cérebro como um mecanismo de defesa. Escolha uma origem que não seja a sua. Você recebe o poder dessa origem.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.317617+00
6105b186-bdab-489e-a942-77017122159c    Leitura Fria    PODER_CLASSE    ESPECIALISTA    Você estudou técnicas de "leitura fria", a capacidade de analisar e compreender uma pessoa através de suas mais sutis reações. Uma vez em cada interlúdio, se passar alguns minutos interagindo com uma pessoa, você pode fazer três perguntas pessoais sobre ela. O mestre pode responder com a verdade ou se negar a responder, mas para cada pergunta não respondida, você recebe 2 PE temporários que duram até o fim da missão. Este poder só pode ser usado uma vez em cada pessoa e apenas em NPCs. Pré-requisito: treinado em Intuição. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.320142+00
fb19c014-eb80-48fa-b07a-9a1005ae58d1    Mãos Firmes     PODER_CLASSE    ESPECIALISTA    Quando há um caçador à espreita, derrubar sequer uma agulha pode ser o suficiente para revelar sua localização. Quando faz um teste de Furtividade para esconder-se ou para executar uma ação discreta que envolva manipular um objeto (como em uma cena de furtividade), você pode gastar 2 PE para receber +5 nesse teste. Pré-requisito: treinado em Furtividade.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.323314+00
dbeeca9d-5882-4e5a-958e-333b758fb2e0    Plano de Fuga   PODER_CLASSE    ESPECIALISTA    A todo momento você está criando cenários imaginários e possibilidades na sua mente, pensando em estratégias que usaria para escapar de perseguidores. Você pode usar Intelecto no lugar de Força para a ação criar obstáculos em uma perseguição. Além disso, uma vez por cena, pode gastar 2 PE para dispensar o teste e ser bem-sucedido nesta ação. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.326292+00
5cb2523d-496e-4ad9-9b5d-ebad4098769e    Remoer Memórias PODER_CLASSE    ESPECIALISTA    Sua mente está constantemente revivendo memórias do passado, sejam elas boas ou ruins. Uma vez por cena, quando faz um teste de perícia baseada em Intelecto ou Presença, você pode gastar 2 PE para substituir esse teste por um teste de Intelecto com DT 15. Pré-requisito: Int 1.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.330057+00
4938f48b-c30d-424e-ae06-e31fd8872908    Resistir à Pressão      PODER_CLASSE    ESPECIALISTA    A ansiedade de correr contra o relógio o deixa mais eficiente. Uma vez por cena de investigação, você pode gastar 5 PE para coordenar os esforços de seus companheiros. A urgência da investigação aumenta em 1 rodada, e durante esta rodada adicional todos os personagens (incluindo você) recebem +2 em testes de perícia. Pré-requisito: treinado em Investigação. SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.333009+00
07a586cc-c072-46b5-a04a-1c4493b12e02    Deixe os Sussurros Guiarem      PODER_CLASSE    OCULTISTA       Você sabe abrir sua mente para os sussurros do Paranormal, vozes que lhe guiam às custas de sua Sanidade. Uma vez por cena, você pode gastar 2 PE e uma rodada para receber +2 em testes de perícia para investigação até o fim da cena. Entretanto, enquanto este poder estiver ativo, sempre que falha em um teste de perícia, você perde 1 ponto de Sanidade.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.347195+00
0bb85ffa-dac7-4400-9a6f-88cb37945ae0    Domínio Esotérico       PODER_CLASSE    OCULTISTA       Você estudou a fundo a complexidade de catalisadores esotéricos e aprendeu a combinar suas propriedades paranormais. Ao lançar um ritual, você pode combinar os efeitos de até dois catalisadores ritualísticos diferentes ao mesmo tempo. Pré-requisito: Int 3.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.351355+00
5efba54e-a209-4e05-a6f5-2ee4edcb67d4    Estalos Macabros        PODER_CLASSE    OCULTISTA       Você sabe colidir pequenos objetos amaldiçoados para gerar distrações fortuitas em momentos de necessidade. Quando faz uma ação para atrapalhar a atenção de outro ser (como distrair em cena de furtividade ou fintar em combate), você pode gastar 1 PE para usar Ocultismo em vez da perícia original. Se o alvo for uma pessoa ou animal, você recebe +5 no teste.  SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.353991+00
f10adf11-8a8b-4957-87c3-32ae25337c57    Minha Dor me Impulsiona PODER_CLASSE    OCULTISTA       Você está acostumado com sacrifícios dolorosos e aprendeu a transformar sua dor em impulso físico. Quando faz um teste de Acrobacia, Atletismo ou Furtividade, você pode gastar 1 PE para receber +1d6 no teste. Você só pode usar este poder se estiver com pelo menos 5 pontos de dano em seus PV. Pré-requisito: Vig 2.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.357136+00
75362ab0-4d59-4642-9c4f-2d22937c3997    Nos Olhos do Monstro    PODER_CLASSE    OCULTISTA       Por mais assustador que seja encarar o paranormal, fazer isso pode fornecer a chave para escapar dele com vida. Se estiver em uma cena envolvendo uma criatura paranormal, você pode gastar uma rodada e 3 PE para encarar essa criatura (você precisa ver os olhos ou o "rosto" da criatura). Se fizer isso, você recebe +5 em testes contra a criatura (exceto testes de ataque) até o fim da cena.   SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.360261+00
724d20bc-9bba-43ce-a627-fe35b0284391    Olhar Sinistro  PODER_CLASSE    OCULTISTA       Aquilo que para outros é quase uma ciência, para você é a imposição da própria vontade. Você pode usar Presença no lugar de Intelecto para Ocultismo e pode usar esta perícia para coagir (como Intimidação). Pré-requisito: Pre 1.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.363588+00
230c5d69-6c61-4413-ab14-3c35d4706792    Sentido Premonitório    PODER_CLASSE    OCULTISTA       Sua exposição paranormal dá outros significados para arrepios e calafrios. Você pode gastar 3 PE para ativar um sentido premonitório. Enquanto ativo, você tem um déjà vu do futuro próximo (equivalente a uma rodada): sabe quando a urgência de uma investigação vai acabar, se irá ocorrer um evento e qual será ele, e quais ações seus inimigos irão tomar em cenas de furtividade e perseguição. Para manter o sentido ativo, gaste 1 PE no início de cada rodada. Não tem efeito em combate.     SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.366768+00
2a62be92-4218-4f82-a99c-ba457963f574    Sincronia Paranormal    PODER_CLASSE    OCULTISTA       Sua exposição paranormal compartilhada criou uma conexão invisível de Medo entre você e seus aliados. Você pode gastar uma ação padrão e 2 PE para estabelecer uma sincronia mental com qualquer número de personagens em alcance médio com quem já sobreviveu a pelo menos um encontro paranormal. No início de cada rodada, você pode distribuir um número de d6 de bônus igual à sua Presença entre os participantes; esses dados podem ser usados em testes de perícias baseadas em Intelecto ou Presença e desaparecem no final de cada rodada. Manter a sincronia custa 1 PE no início de cada rodada. Pré-requisito: Pre 2.      SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.369479+00
44de440d-8a49-4031-b08c-180260c70530    Traçado Conjuratório    PODER_CLASSE    OCULTISTA       Você conhece versões de proteção e fortalecimento de vários símbolos paranormais, e pode usá-los para reforçar seus rituais. Você pode gastar 1 PE e uma ação completa traçando um símbolo paranormal no chão que ocupa um quadrado de 1,5m. Enquanto estiver dentro desse símbolo, você recebe +2 em testes de Ocultismo e de resistência e a DT para resistir aos seus rituais aumenta em +2. O símbolo dura até o fim da cena.       SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.372701+00
87348451-7021-48c5-a3d7-b942a8ab74e6    Empenho HABILIDADE_CLASSE       SOBREVIVENTE    Você pode não ter treinamento especial, mas compensa com dedicação e esforço. Quando faz um teste de perícia, você pode gastar 1 PE para receber +2 nesse teste.        SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.385995+00
14e162f5-0f49-43bf-adcf-f3f5f972b417    Cicatrizado     HABILIDADE_CLASSE       SOBREVIVENTE    No 5º estágio, você já viu — e sobreviveu — a sua cota de horrores. Isso deixou marcas em seu corpo e sua mente, mas também o deixou mais forte. Escolha um tipo de perigo paranormal de um elemento específico (Sangue, Morte, Conhecimento ou Energia). Você possui algum trauma em relação a esse perigo e sofre –5 em testes de resistência contra ele. Contudo, uma vez por sessão de jogo, você pode sacrificar 1 PV permanentemente para ignorar um dano mental ou gasto de PE, ou pode sacrificar permanentemente 1 PE para reduzir um dano físico à metade.    SOBREVIVENDO_AO_HORROR  f       \N      2026-03-12 21:24:39.388524+00
c3ef9ae4-7520-460b-a74a-0f050c863104    Engenhosidade   HABILIDADE_CLASSE       ESPECIALISTA    Em NEX 40%, quando usa sua habilidade Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia. Em NEX 75%, pode gastar 4 PE adicionais para receber os benefícios de ser expert na perícia.    LIVRO_BASE      f       \N      2026-03-12 22:02:55.766504+00
\.


--
-- Data for Name: itens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.itens (id, nome, tipo, descricao, espacos, categoria, peso, preco, requisitos, created_at, subtipo, proficiencia, dano, critico, alcance, tipo_ataque, defesa, propriedades, fonte) FROM stdin;
efffcf5f-600a-48fd-aee3-5a9ebe5e3a8a    Balas Curtas    MUNICAO Munição para pistolas, revólveres e submetralhadoras. Um pacote dura duas cenas.        1       0       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
f06d3289-6cd4-4995-9ce6-4fa543dafd90    Balas Longas    MUNICAO Munição para fuzis e metralhadoras. Um pacote dura uma cena.    1       I       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
ccd58b08-fa16-4874-bc30-d16aad3c81ad    Cartuchos       MUNICAO Munição para espingardas, carregada com esferas de chumbo. Um pacote dura uma cena.     1       I       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
b55e5235-47b1-4d5b-a7b5-01c2e680bfd1    Combustível     MUNICAO Tanque de combustível para lança-chamas. Dura uma cena. 1       I       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
8f2c7a44-8bde-4d96-9326-b6a86fa539d7    Flechas MUNICAO Flechas para arcos e bestas. Podem ser reaproveitadas; um pacote dura uma missão inteira.       1       0       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
e2dd705d-9908-4003-982c-aa4d4108ade2    Foguete MUNICAO Disparado por bazucas. Ao contrário de outras munições, cada foguete dura um único disparo.     1       I       \N      0       \N      2026-03-12 23:21:02.531013+00   \N      \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
8de2d966-9eb5-4378-8b1f-2fa74cf2dec9    Proteção Leve   PROTECAO        Jaqueta de couro pesada ou colete de kevlar. Tipicamente usada por seguranças e policiais.      2       I       \N      0       \N      2026-03-12 23:21:02.543181+00   \N      \N      \N      \N      \N      \N      5       []      LIVRO_BASE
77c9fd64-0e04-4052-aa53-380f2885dad0    Proteção Pesada PROTECAO        Equipamento de forças especiais: capacete, ombreiras, joelheiras, caneleiras e colete multicamadas de kevlar. Fornece resistência a balístico, corte, impacto e perfuração 2. Impõe –5 em testes de perícia afetados por carga. 5       II      \N      0       \N      2026-03-12 23:21:02.543181+00   \N      \N      \N      \N      \N      \N      10      []      LIVRO_BASE
f3457b6a-a82c-49c6-b721-8ccdc3a46b23    Escudo  PROTECAO        Escudo medieval ou moderno, como os usados por tropas de choque. Deve ser empunhado em uma mão. Bônus de Defesa acumula com proteções.  2       I       \N      0       \N      2026-03-12 23:21:02.543181+00   \N      \N      \N      \N      \N      \N      2       []      LIVRO_BASE
1bf41085-e016-4a9a-9a2d-08e025cf5a9e    Faca    ARMA    Uma lâmina afiada — navalha, faca de churrasco ou militar. É uma arma ágil e pode ser arremessada.      1       0       \N      0       \N      2026-03-12 23:21:02.546367+00   CORPO_LEVE      SIMPLES 1d4     19      Curto   C       \N      ["agil", "arremesso"]   LIVRO_BASE
9b6f7d8c-ee57-4e16-86ec-81eb4b567e67    Martelo ARMA    Ferramenta comum usada como arma na falta de opções melhores.   1       0       \N      0       \N      2026-03-12 23:21:02.546367+00   CORPO_LEVE      SIMPLES 1d6     x2      \N      I       \N      []      LIVRO_BASE
224ae0be-34e3-4fe0-b304-d12da0ac0228    Punhal  ARMA    Faca de lâmina longa e pontiaguda, usada por cultistas em rituais. É uma arma ágil.     1       0       \N      0       \N      2026-03-12 23:21:02.546367+00   CORPO_LEVE      SIMPLES 1d4     x3      \N      P       \N      ["agil"]        LIVRO_BASE
c0629646-ecd5-49c0-82cd-76a2ef3e8723    Bastão  ARMA    Cilindro de madeira maciça — taco de beisebol, cassetete, tonfa ou clava. Pode ser empunhado com uma mão (1d6) ou com as duas (1d8).    1       0       \N      0       \N      2026-03-12 23:21:02.54994+00    CORPO_UMA_MAO   SIMPLES 1d6/1d8 x2      \N      I       \N      ["versatil"]    LIVRO_BASE
dedd86c3-10f3-4a62-84b0-0925630c72dd    Machete ARMA    Lâmina longa e larga, muito usada como ferramenta para abrir trilhas.   1       0       \N      0       \N      2026-03-12 23:21:02.54994+00    CORPO_UMA_MAO   SIMPLES 1d6     19      \N      C       \N      ["agil"]        LIVRO_BASE
b95a2746-7d2e-4028-ab37-25e6b2dff9b9    Lança   ARMA    Haste de madeira com ponta metálica afiada. Pode ser arremessada.       1       0       \N      0       \N      2026-03-12 23:21:02.54994+00    CORPO_UMA_MAO   SIMPLES 1d6     x2      Curto   P       \N      ["arremesso"]   LIVRO_BASE
87f6e5bf-9092-4dd4-98bf-aeb39560b89a    Cajado  ARMA    Cabo longo de madeira ou barra de ferro. Arma ágil. Pode ser usado com Combater com Duas Armas como se fossem duas armas de uma mão.    2       0       \N      0       \N      2026-03-12 23:21:02.553282+00   CORPO_DUAS_MAOS SIMPLES 1d6/1d6 x2      \N      I       \N      ["agil"]        LIVRO_BASE
686b1dce-f890-44ef-811d-bd0edf8eba74    Arco    ARMA    Arco e flecha comum, próprio para tiro ao alvo. 2       0       \N      0       \N      2026-03-12 23:21:02.557045+00   DISPARO_DUAS_MAOS       SIMPLES 1d6     x3      Médio   P       \N      []      LIVRO_BASE
faf22bb2-a17e-4e26-8fd4-a12d75d018b2    Besta   ARMA    Arma da antiguidade. Exige uma ação de movimento para ser recarregada a cada disparo.   2       0       \N      0       \N      2026-03-12 23:21:02.557045+00   DISPARO_DUAS_MAOS       SIMPLES 1d8     19      Médio   P       \N      []      LIVRO_BASE
4303feec-eb44-42cf-a893-95b5046efd40    Pistola ARMA    Arma de mão comum entre policiais e militares, facilmente recarregável. 1       I       \N      0       \N      2026-03-12 23:21:02.560597+00   FOGO_LEVE       SIMPLES 1d12    18      Curto   B       \N      []      LIVRO_BASE
446f3c35-f1d9-4c28-bd98-93affd1dfda5    Revólver        ARMA    A arma de fogo mais comum e uma das mais confiáveis.    1       I       \N      0       \N      2026-03-12 23:21:02.560597+00   FOGO_LEVE       SIMPLES 2d6     19/x3   Curto   B       \N      []      LIVRO_BASE
f98f1879-c5a4-4bb1-bab3-13e1a04b4bcd    Fuzil de Caça   ARMA    Arma de fogo popular entre fazendeiros, caçadores e atiradores esportistas.     2       I       \N      0       \N      2026-03-12 23:21:02.564258+00   FOGO_DUAS_MAOS  SIMPLES 2d8     19/x3   Médio   B       \N      []      LIVRO_BASE
9d502020-feef-4f4b-9cf3-653418f0898d    Machadinha      ARMA    Ferramenta para cortar madeira, comum em fazendas. Pode ser arremessada.        1       0       \N      0       \N      2026-03-12 23:21:02.567277+00   CORPO_LEVE      TATICA  1d6     x3      Curto   C       \N      ["arremesso"]   LIVRO_BASE
286dcbe4-5f53-4e63-a1be-bbd8af3a0492    Nunchaku        ARMA    Dois bastões curtos ligados por uma corrente. Arma ágil.        1       0       \N      0       \N      2026-03-12 23:21:02.567277+00   CORPO_LEVE      TATICA  1d8     x2      \N      I       \N      ["agil"]        LIVRO_BASE
dd64f1e2-3f12-44de-b4d0-752c88ba6bd9    Corrente        ARMA    Pedaço de corrente grossa. Fornece +2 em testes para desarmar e derrubar.       1       0       \N      0       \N      2026-03-12 23:21:02.571635+00   CORPO_UMA_MAO   TATICA  1d8     x2      \N      I       \N      []      LIVRO_BASE
f97ace6a-f128-4c70-bbea-4d7a7319bf7c    Espada  ARMA    Espada longa medieval ou cimitarra. Pode ser empunhada com uma mão (1d8) ou com as duas (1d10). 1       I       \N      0       \N      2026-03-12 23:21:02.571635+00   CORPO_UMA_MAO   TATICA  1d8/1d10        19      \N      C       \N      ["versatil"]    LIVRO_BASE
79b430b7-5065-4c77-b425-3fcf8c77c96e    Florete ARMA    Espada de lâmina fina usada por esgrimistas. Arma ágil. 1       I       \N      0       \N      2026-03-12 23:21:02.571635+00   CORPO_UMA_MAO   TATICA  1d6     18      \N      C       \N      ["agil"]        LIVRO_BASE
309ad47c-440b-4ba4-a62b-04daecd4618f    Machado ARMA    Ferramenta importante para lenhadores e bombeiros, capaz de causar ferimentos terríveis.        1       I       \N      0       \N      2026-03-12 23:21:02.571635+00   CORPO_UMA_MAO   TATICA  1d8     x3      \N      C       \N      []      LIVRO_BASE
b4719a78-c0d5-47b0-9bc1-f5f9f0ab8bc7    Maça    ARMA    Bastão com cabeça metálica cheia de protuberâncias.     1       I       \N      0       \N      2026-03-12 23:21:02.571635+00   CORPO_UMA_MAO   TATICA  2d4     x2      \N      I       \N      []      LIVRO_BASE
f0bdd3af-93ec-4753-9790-c560911f3a13    Acha    ARMA    Machado grande e pesado, usado no corte de árvores largas.      2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  1d12    x3      \N      C       \N      []      LIVRO_BASE
08ff53c1-0bea-486e-8fbb-82e046f691a7    Gadanho ARMA    Ferramenta agrícola — versão maior da foice. Criada para ceifar cereais, também pode ceifar vidas.      2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  2d4     x4      \N      C       \N      []      LIVRO_BASE
4058a699-8bc8-4a45-ab3b-e54e2d4b9a1c    Katana  ARMA    Espada longa japonesa levemente curvada. Arma ágil. Se veterano em Luta, pode usá-la com uma mão.       2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  1d10    19      \N      C       \N      ["agil"]        LIVRO_BASE
92aa2b1d-4db1-4f2f-ad7e-10b7c23df427    Marreta ARMA    Normalmente para demolir paredes; também pode demolir pessoas.  2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  3d4     x2      \N      I       \N      []      LIVRO_BASE
a25f7785-7d99-466d-ae58-0d7362dc8afb    Montante        ARMA    Enorme espada de 1,5m de comprimento — uma das armas mais poderosas de seu tempo.       2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  2d6     19      \N      C       \N      []      LIVRO_BASE
3b86a64e-df32-4040-b34c-724f1be9866d    Motosserra      ARMA    Ferramenta capaz de causar ferimentos profundos. Ao rolar 6 em um dado, role um dado adicional. Impõe –O nos testes. Ligar gasta uma ação de movimento. 2       I       \N      0       \N      2026-03-12 23:21:02.575978+00   CORPO_DUAS_MAOS TATICA  3d6     x2      \N      C       \N      []      LIVRO_BASE
3d430d98-82d9-448e-908a-6318822b0c33    Arco Composto   ARMA    Arco moderno com sistema de roldanas. Permite aplicar Força às rolagens de dano.        2       I       \N      0       \N      2026-03-12 23:21:02.578792+00   DISPARO_DUAS_MAOS       TATICA  1d10    x3      Médio   P       \N      ["forca_dano"]  LIVRO_BASE
8b13ae3b-9d08-4fb8-b6ee-16fbeb1ce491    Balestra        ARMA    Besta pesada capaz de disparos poderosos. Exige uma ação de movimento para recarregar a cada disparo.   2       I       \N      0       \N      2026-03-12 23:21:02.578792+00   DISPARO_DUAS_MAOS       TATICA  1d12    19      Médio   P       \N      []      LIVRO_BASE
93b18f7d-11e1-4caa-8838-4856bc64298d    Submetralhadora ARMA    Arma de fogo automática compacta que pode ser empunhada com apenas uma mão.     1       I       \N      0       \N      2026-03-12 23:21:02.582482+00   FOGO_UMA_MAO    TATICA  2d6     19/x3   Curto   B       \N      ["automatica"]  LIVRO_BASE
884b83de-f149-46c8-b65c-93cfdc55f192    Espingarda      ARMA    Arma de fogo longa com cano liso. Causa metade do dano em alcance médio ou maior.       2       I       \N      0       \N      2026-03-12 23:21:02.585584+00   FOGO_DUAS_MAOS  TATICA  4d6     x3      Curto   B       \N      []      LIVRO_BASE
80118ad9-8c90-4a6e-8ac7-0b5370b4b17d    Fuzil de Assalto        ARMA    Arma de fogo padrão da maioria dos exércitos modernos. Arma automática. 2       II      \N      0       \N      2026-03-12 23:21:02.585584+00   FOGO_DUAS_MAOS  TATICA  2d10    19/x3   Médio   B       \N      ["automatica"]  LIVRO_BASE
b3b35d01-4e05-4f52-b73f-bf97f150da10    Fuzil de Precisão       ARMA    Arma de fogo militar para disparos precisos de longa distância. Se veterano em Pontaria e mirar, recebe +5 na margem de ameaça. 2       III     \N      0       \N      2026-03-12 23:21:02.585584+00   FOGO_DUAS_MAOS  TATICA  2d10    19/x3   Longo   B       \N      []      LIVRO_BASE
3144f3ef-13c4-4a93-8425-ee6bb63db877    Bazuca  ARMA    Lança-foguetes anti-tanques. Causa dano no alvo e em todos em raio de 3m (Reflexos DT Agi para metade). Exige ação de movimento para recarregar.        2       III     \N      0       \N      2026-03-12 23:21:02.588632+00   PESADA  PESADA  10d8    x2      Médio   I       \N      ["area"]        LIVRO_BASE
0e89b4f5-5131-489f-9675-9e1586192b1d    Lança-chamas    ARMA    Esguicha líquido inflamável em linha de 1,5m × alcance curto. Atinge todos na área; seres atingidos ficam em chamas.    2       III     \N      0       \N      2026-03-12 23:21:02.588632+00   PESADA  PESADA  6d6     x2      Curto   Fogo    \N      ["area", "linha"]       LIVRO_BASE
9e70d41c-78a7-423f-a31b-8761da7476d1    Metralhadora    ARMA    Arma de fogo pesada militar. Exige Força 4 ou apoio em tripé; caso contrário, –5 em ataques. Arma automática.   2       II      \N      0       \N      2026-03-12 23:21:02.588632+00   PESADA  PESADA  2d12    19/x3   Médio   B       \N      ["automatica"]  LIVRO_BASE
6945a0bb-d0dd-4a7b-84fc-8d5c1e021da7    Pregador Pneumático     ARMA    Aparelho semelhante a uma pistola que dispara pregos sob pressão. Conta como arma de fogo para poderes. Armazena 300 pregos; dura uma missão.   1       0       \N      0       \N      2026-03-12 23:21:02.591494+00   FOGO_LEVE       SIMPLES 1d4     x4      Curto   P       \N      []      SOBREVIVENDO_AO_HORROR
f0fba9d3-8633-4e02-9cf6-84c6367677e8    Estilingue      ARMA    Permite aplicar Força às rolagens de dano. Dispara bolinhas reutilizáveis (ou pedrinhas); um pacote dura uma missão. Pode arremessar granadas em alcance longo. 1       0       \N      0       \N      2026-03-12 23:21:02.595033+00   DISPARO_DUAS_MAOS       SIMPLES 1d4     x2      Curto   I       \N      ["forca_dano"]  SOBREVIVENDO_AO_HORROR
c3d9fcf9-0398-4dff-95c1-a09466e4f2ec    Baioneta        ARMA    Lâmina fixada em fuzil. Gastar ação de movimento para fixar; torna a arma ágil e aumenta dano para 1d6. Ainda pode atirar com –O em ataques à distância.        1       0       \N      0       \N      2026-03-12 23:21:02.597773+00   CORPO_LEVE      TATICA  1d4     19      \N      P       \N      []      SOBREVIVENDO_AO_HORROR
61f3f6e6-f418-474d-a866-6586efca0d04    Faca Tática     ARMA    Faca balanceada para contra-ataques e bloqueios. +2 no ataque no contra-ataque. No bloqueio, pode gastar 2 PE e sacrificar a faca para +20 RD. Arma ágil e pode ser arremessada.        1       I       \N      0       \N      2026-03-12 23:21:02.597773+00   CORPO_LEVE      TATICA  1d6     19      Curto   C       \N      ["agil"]        SOBREVIVENDO_AO_HORROR
1c051bc2-383d-458b-a305-effb2dc785ca    Gancho de Carne ARMA    Gancho metálico de frigorífico. Se amarrado a corda/corrente, alcance aumenta para 4,5m e passa a ocupar 2 espaços.     1       0       \N      0       \N      2026-03-12 23:21:02.597773+00   CORPO_LEVE      TATICA  1d4     x4      \N      P       \N      []      SOBREVIVENDO_AO_HORROR
7ea9d530-f5c3-413a-b137-6fa4a1d60ea4    Bastão Policial ARMA    Bastão com guarda lateral. +1 na Defesa ao usar esquiva com ele. Arma ágil.     1       I       \N      0       \N      2026-03-12 23:21:02.601083+00   CORPO_UMA_MAO   TATICA  1d6     x2      Curto   I       \N      ["agil"]        SOBREVIVENDO_AO_HORROR
e1e86bf9-398a-436b-a047-1aa11c3feb1f    Picareta        ARMA    Ferramenta de mineração e demolição, empregada em combate na falta de armas adequadas.  1       0       \N      0       \N      2026-03-12 23:21:02.601083+00   CORPO_UMA_MAO   TATICA  1d6     x4      \N      P       \N      []      SOBREVIVENDO_AO_HORROR
546f3060-401e-45a2-9e99-dcb7ba06b5c6    Shuriken        ARMA    Projéteis metálicos em forma de estrela. Se veterano em Pontaria, uma vez por rodada gaste 1 PE para ataque adicional. Um "pacote" = 2 cenas (ou 10 shurikens com contagem de munição). 0.5     I       \N      0       \N      2026-03-12 23:21:02.603653+00   ARREMESSO       TATICA  1d4     x2      Curto   P       \N      []      SOBREVIVENDO_AO_HORROR
ea9d4887-6bc8-4203-bd00-40c659985d30    Pistola Pesada  ARMA    Pistola de calibre superior. Impõe –O nos testes de ataque; empunhar com as duas mãos anula essa penalidade.    1       I       \N      0       \N      2026-03-12 23:21:02.607335+00   FOGO_UMA_MAO    SIMPLES 2d8     18      Curto   B       \N      []      SOBREVIVENDO_AO_HORROR
1b041114-644e-40f5-92e8-3da1a2703145    Revólver Compacto       ARMA    Arma de baixo calibre projetada para ser escondida. Se treinado em Crime, não ocupa espaço.     1       I       \N      0       \N      2026-03-12 23:21:02.607335+00   FOGO_LEVE       SIMPLES 2d4     19/x3   Curto   P       \N      ["discreta"]    SOBREVIVENDO_AO_HORROR
009c6d06-9f79-4419-930a-e99b96013813    Espingarda de Cano Duplo        ARMA    Dois canos paralelos, cada um com um gatilho. Requer ação de movimento para recarregar após os 2 cartuchos. Pode disparar os dois canos no mesmo alvo: –O no ataque, dano aumenta para 6d6.     2       II      \N      0       \N      2026-03-12 23:21:02.610421+00   FOGO_DUAS_MAOS  TATICA  4d6     x3      Curto   B       \N      []      SOBREVIVENDO_AO_HORROR
9f43d315-2619-461f-a134-043c0f6aec03    Kit de Perícia  GERAL   Conjunto de ferramentas necessárias para algumas perícias. Sem o kit, sofre –5 no teste. Existe um kit para cada perícia que o exige.   1       0       \N      0       \N      2026-03-12 23:21:02.613939+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
07f1f929-a3fb-43fa-a77b-679ebc87f836    Utensílio       GERAL   Item com utilidade específica (canivete, lupa, smartphone). Fornece +2 em uma perícia (exceto Luta e Pontaria). Deve ser empunhado para aplicar o bônus.        1       I       \N      0       \N      2026-03-12 23:21:02.613939+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
c5909e9e-e5a1-4b60-8372-474793d5981b    Vestimenta      GERAL   Peça de vestuário que fornece +2 em uma perícia (exceto Luta ou Pontaria). Ex: botas militares (+2 Atletismo), terno (+2 Diplomacia). Máximo dois bônus simultâneos.    1       I       \N      0       \N      2026-03-12 23:21:02.613939+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
0e1cfdd6-fa5c-42b3-ad6b-b830d294d234    Amuleto Sagrado GERAL   Shimenawa, rosário, fio de contas ou objeto de fé. Fornece +2 em Religião e Vontade.    1       0       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
95a33ac6-19cc-482e-8ccf-fcc749cabb23    Celular GERAL   Fotos, áudios, vídeos, internet e ligações. Com acesso à internet, +2 em testes de perícia para adquirir informações. Possui lanterna fraca com cone de 4,5m.   1       0       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
96afa55f-7c24-4dc7-a0c8-05346417f020    Chave de Fenda Universal        GERAL   Ferramenta multiuso. +2 em testes para criar ou reparar objetos (panelas a motores de avião). Também aplica bônus como item de apoio em situações específicas.  1       0       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
d637d44b-1c4c-438e-aba6-8fa86abd2706    Chaves  GERAL   Molho de chaves (casa, veículo, cadeados). Usar o barulho das chaves para distrair alguém fornece +2 em Furtividade nessa rodada.       1       0       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
6b9b5ca4-990d-42ee-b042-e0bbc247e241    Documentos Falsos       GERAL   Conjunto de documentos em nome de uma identidade falsa. +2 em Diplomacia, Enganação e Intimidação para se passar pela pessoa representada.      1       I       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
0aa8ea9a-cdc4-4279-a18e-d2b7d27f5783    Manual Operacional      GERAL   Livro com lições práticas sobre uma perícia. Gastar ação de interlúdio lendo permite usar aquela perícia como se fosse treinado até o próximo interlúdio.       1       I       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
fb9da988-cae0-4856-a606-743bb17d06de    Notebook        GERAL   Com internet, +2 em perícias para adquirir informações. Ao relaxar em interlúdio, recupera 1 ponto adicional de Sanidade. Ilumina em cone de 4,5m. Inclui tablets.      2       0       \N      0       \N      2026-03-12 23:21:02.617723+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
4ba26780-5ce6-4599-96de-1dfa0a8de4e8    Granada de Atordoamento GERAL   Flash-bang. Raio 6m; seres ficam atordoados por 1 rodada (Fortitude DT Agi reduz para ofuscado e surdo por 1 rodada).   1       0       \N      0       \N      2026-03-12 23:21:02.621581+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
af3cb72e-7bd9-4068-9f78-8a6020917ca8    Granada de Fragmentação GERAL   Espalha fragmentos. Raio 6m; 8d6 dano de perfuração (Reflexos DT Agi reduz à metade).   1       I       \N      0       \N      2026-03-12 23:21:02.621581+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
7f78760b-f4f7-4b61-a2b6-7522dcac5ca5    Granada de Fumaça       GERAL   Produz fumaça espessa. Raio 6m; seres ficam cegos e sob camuflagem total. Dura 2 rodadas.       1       0       \N      0       \N      2026-03-12 23:21:02.621581+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
bf9a01f4-cc3e-433d-90a6-46d653f90165    Granada Incendiária     GERAL   Espalha labaredas. Raio 6m; 6d6 dano de fogo + condição em chamas (Reflexos DT Agi reduz dano à metade e evita condição).       1       I       \N      0       \N      2026-03-12 23:21:02.621581+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
a0183a44-33bb-493c-ab26-de804029132d    Mina Antipessoal        GERAL   Ativada por controle remoto (até alcance longo). Dispara bolas de aço em cone de 6m; 12d6 dano de perfuração (Reflexos DT Int reduz à metade). Instalação: ação completa + teste Tática DT 15.  1       I       \N      0       \N      2026-03-12 23:21:02.621581+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
40dd7314-fc6b-4fd4-b7f9-6484bc1e2910    Dinamite        GERAL   Bastão de 20cm com pavio. Ação padrão: acender e arremessar em alcance médio. Raio 6m; 4d6 impacto + 4d6 fogo + condição em chamas (Reflexos DT Agi reduz à metade).    1       I       \N      0       \N      2026-03-12 23:21:02.625359+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
d77311ce-cf34-4bdb-87d9-f971c9675049    Explosivo Plástico      GERAL   Massa adesiva com pino de ignição e detonador remoto. 2 rodadas para preparar. 16d6 impacto em raio 3m (Reflexos DT Int reduz à metade). Especialistas causam dobro em objetos e ignoram RD.    1       I       \N      0       \N      2026-03-12 23:21:02.625359+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
16856cf9-2ff6-4b46-951d-b88943b9f4a8    Galão Vermelho  GERAL   Galão com substância inflamável. Ao sofrer dano de fogo ou balístico, explode em esfera de 6m; 12d6 dano de fogo (Reflexos DT 25 reduz). A área pega fogo (1d6/rodada) até ser apagada. 2       0       \N      0       \N      2026-03-12 23:21:02.625359+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
222652ab-acfc-46e4-ab18-ca02af2def21    Granada de Gás Sonífero GERAL   Libera fumaça branca em raio 6m. Seres ficam inconscientes ou exaustos por 1 rodada depois fatigados (Fortitude DT Agi reduz para fatigado por 1d4 rodadas). Gás permanece 2 rodadas.   1       I       \N      0       \N      2026-03-12 23:21:02.625359+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
9fce615b-7fe4-4c3d-8100-a9c8c791eb01    Granada de PEM  GERAL   Pulso eletromagnético que desativa eletrônicos em raio 18m até fim da cena. Criaturas de Energia: 6d6 impacto e paralisadas 1 rodada (Fortitude DT Agi reduz à metade, apenas 1x/cena). 1       I       \N      0       \N      2026-03-12 23:21:02.625359+00   EXPLOSIVO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
7ab62f18-358e-47bd-a863-e5d58a1672b9    Algemas GERAL   Par de algemas de aço. Prender alguém não indefeso: empunhar + agarrar + novo teste de agarrar. Prender os dois pulsos (–5 em testes com mãos) ou um pulso em objeto. Escapar: Acrobacia DT 30. 1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
b4ef4980-1fb1-4085-8d79-949be174f427    Arpéu   GERAL   Gancho de aço para amarrar em corda. Prender exige Pontaria DT 15. +5 em Atletismo para subir muro com corda.   1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
a1834fb3-43a6-4f40-8245-68231c5d4f8a    Bandoleira      GERAL   Cinto com bolsos e alças. Uma vez por rodada, pode sacar ou guardar um item como ação livre.    1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
41b0a7ec-1a07-4f71-8103-d522d429c2d2    Binóculos       GERAL   Binóculos militares. +5 em Percepção para observar coisas distantes.    1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
7d57e4db-674e-4db7-9a1e-7ed5124e52fc    Bloqueador de Sinal     GERAL   Emite ondas que "poluem" frequência de rádio. Impede celulares em alcance médio de se conectar. 1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
5ff0495c-c2f2-4eee-b1fe-97a55f942794    Cicatrizante    GERAL   Spray com potente efeito cicatrizante. Ação padrão para usar; cura 2d8+2 PV em você ou ser adjacente.   1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
ffb00596-cb91-4cf3-aed0-804cdcb4970b    Corda   GERAL   Rolo com 10m de corda resistente. +5 em Atletismo para descer buracos ou prédios. Serve para amarrar pessoas inconscientes etc. 1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
0095cc23-be89-483f-ab49-d82542fa84c3    Equipamento de Sobrevivência    GERAL   Mochila com saco de dormir, panelas, GPS e itens de campo. +5 em Sobrevivência para acampar e orientar-se; permite esses testes sem treinamento.        2       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
71ffc7bd-2f02-404c-a84c-4358a1c9381f    Lanterna Tática GERAL   Ilumina cone de 9m. Ação de movimento para mirar nos olhos de ser em alcance curto; ele fica ofuscado por 1 rodada (imune pelo resto da cena).  1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
d7e959b6-63dd-4483-b551-57912a8dca12    Máscara de Gás  GERAL   Máscara com filtro que cobre o rosto inteiro. +10 em Fortitude contra efeitos que dependam de respiração.       1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
cd59eef6-82fc-48f2-929f-e7ca59e728ba    Mochila Militar GERAL   Mochila leve de alta qualidade. Não ocupa espaço e aumenta capacidade de carga em 2 espaços.    0       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
5b0383f4-495d-45e0-a2fc-b55f2a23e485    Óculos de Visão Térmica GERAL   Eliminam a penalidade em testes por camuflagem. 1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
58d1e9d9-9970-46af-b065-7e18513642dc    Pé de Cabra     GERAL   Barra de ferro. +5 em Força para arrombar portas. Pode ser usado em combate como bastão.        1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
f498d292-b49c-46a0-a4d4-1950ae3840bd    Pistola de Dardos       GERAL   Dispara dardos soníferos em alcance curto. Acerto: alvo fica inconsciente até fim da cena (Fortitude DT Agi reduz para desprevenido e lento). Vem com 2 dardos. 1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
c9d75a61-46b9-4943-bb7e-f0882a4b2280    Pistola Sinalizadora    GERAL   Dispara sinalizador luminoso. Pode ser usada como arma de disparo leve em alcance curto; 2d6 dano de fogo. Vem com 2 cargas.    1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
f22475ec-9f00-4e68-905c-653c2c3bb7af    Soqueira        GERAL   Peça de metal entre os dedos. +1 em dano desarmado e torna-o letal. Pode receber modificações e maldições de armas corpo a corpo.       1       0       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
825a0ca3-6546-4437-b5d7-291a45d931c5    Spray de Pimenta        GERAL   Ação padrão para atingir ser adjacente. Fica cego por 1d4 rodadas (Fortitude DT Agi evita). Dura dois usos.     1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
e447afc7-b5f0-4011-862d-9571738adada    Taser   GERAL   Dispositivo de eletrochoque. Ação padrão para atingir ser adjacente; 1d6 eletricidade + atordoado por 1 rodada (Fortitude DT Agi evita). Bateria dura dois usos.        1       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
2941dc31-0c1a-4c98-a40c-24218cb8aec7    Traje Hazmat    GERAL   Roupa impermeável que cobre o corpo. +5 em resistência contra efeitos ambientais e resistência a dano químico 10.       2       I       \N      0       \N      2026-03-12 23:21:02.629485+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      LIVRO_BASE
9667ecc4-465d-4906-a1a9-4461432aac45    Alarme de Movimento     GERAL   Ação completa para posicionar. Sinaliza dispositivo de controle quando ser Pequeno ou maior se move em cone de 30m. Sensibilidade ajustável; sinalização discreta ou sonora.    1       0       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
db60be8f-5f7a-465b-b518-45bbfa044346    Alimento Energético     GERAL   Alimentos e suplementos de alta tecnologia. Ação padrão para consumir; recupera 1d4 PE. 1       II      \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
a1af5888-684c-49bf-aa79-ac8a9b7ed8ac    Aplicador de Medicamentos       GERAL   Bomba injetora portátil presa ao braço ou perna. Aplica medicamentos com ação de movimento. Espaço para 3 doses (contabilizadas no espaço do item). Carregar dose: ação padrão. 1       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
2fc786b7-1db0-44ba-b531-24e9a67d3cd9    Braçadeira Reforçada    GERAL   Proteção para braços de artes marciais. Aumenta em +2 a RD recebida ao usar bloqueio.   1       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
224fa755-8a6b-469d-b8c3-9e7dca2da228    Cão Adestrado   GERAL   Cachorro corajoso e treinado (pastor alemão, dobermann etc.). Personagem treinado em Adestramento pode usá-lo como aliado. Bônus: +2 em Investigação e Percepção. Habilidade: gastar 1 PE para postura defensiva, +2 na Defesa por 1 rodada.    0       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
525cd307-28f0-4c8f-9e26-1d87f62a9fdb    Coldre Saque Rápido     GERAL   Coldre para saque mínimo. Uma vez por rodada, pode sacar ou guardar uma arma de fogo leve como ação livre.      1       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
9875a90c-8d26-48e0-9bc7-dfecb7b8ff1d    Equipamento de Escuta   GERAL   Receptor (alcance 90m) + 3 transmissores (raio 9m). Instalar: minutos + Crime DT 20. A DT do teste = DT para encontrar o transmissor. Pode instalar discretamente: ação completa + Furtividade oposto Percepção (DT Crime +5).  1       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
08f3e44a-d9fb-40d7-97e7-c68b8a11c822    Estrepes (saco) GERAL   Peças de metal com quatro pontas — uma sempre voltada para cima. Ação padrão para cobrir 1,5m×1,5m. Pisada: 1d4 perfuração + lento por um dia. Reflexos DT Agi evita. Em perseguição: –O em testes do perseguidor até o fim da cena.    1       0       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
d3249362-a863-4879-84cc-3386e01c5ddd    Faixa de Pregos GERAL   Trilha sanfonada de pregos em linha de 9m. Como estrepes, mas para veículos: pneus de borracha são automaticamente perfurados (deslocamento pela metade).       2       I       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
b6a4862f-8719-4cd6-b1a6-4bfc9ee76c20    Isqueiro        GERAL   Isqueiro descartável ou de metal. Ação de movimento para produzir chama. Incendeia objetos inflamáveis; ilumina raio de 3m.     0.5     0       \N      0       \N      2026-03-12 23:21:02.633653+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
bdfae226-4545-4772-b6a3-90b1aed15b2b    Antibiótico     GERAL   Fortalece imunidade. +5 no próximo teste de Fortitude contra efeitos de uma doença até fim do dia.      0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
efc7c38c-1e6a-4ad8-a0d0-5354368f8b36    Antídoto        GERAL   +5 no próximo teste de Fortitude contra efeitos de veneno até fim do dia. Antídoto específico remove completamente o veneno.    0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
e2b3551a-85bc-4122-a8ff-cdae16d14f05    Antiemético     GERAL   Remove condição enjoado e +5 em testes para evitá-la até fim da cena. Pode funcionar contra outras condições por náuseas.       0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
39abc720-8984-49a7-8ccf-c301f997fedb    Antihistamínico GERAL   +5 no próximo teste contra efeitos de alergia até fim do dia.   0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
bbfbdecb-62ef-4a48-9137-c46344f7b7d0    Anti-inflamatório       GERAL   Reduz dor e inchaço. Fornece 1d8+2 PV temporários.      0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
8a6f72cd-b418-4615-a631-017c78274eed    Antitérmico     GERAL   Reduz febre e alivia dores de cabeça. Permite novo teste contra uma condição mental. Funciona apenas uma vez por cena.  0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
06942b43-0741-4b35-b06d-ea18022c0cb3    Broncodilatador GERAL   Auxilia na respiração. +5 em testes para evitar asfixiado ou fatigado até fim do dia.   0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
5598a9de-a153-49da-9e49-81b844f6d47b    Coagulante      GERAL   +5 em testes para se estabilizar da condição sangrando até fim do dia. Usado com Medicina para remover morrendo, também +5 nesse teste. 0.5     I       \N      0       \N      2026-03-12 23:21:02.637558+00   MEDICAMENTO     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
8d2ec532-9d17-4b51-adda-fbbc709ac102    Óculos de Visão Noturna GERAL   Com bateria, permitem visão no escuro. Entretanto, –O em testes de resistência a condição ofuscado e efeitos de luz.    1       I       \N      0       \N      2026-03-12 23:21:02.641535+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
ff55c292-db62-4934-af83-35b2cfff2b19    Óculos Escuros  GERAL   Usando óculos escuros, o personagem não pode ser ofuscado.      1       0       \N      0       \N      2026-03-12 23:21:02.641535+00   ACESSORIO       \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
7da513f8-6ef3-42b0-a57b-af23ab05d391    Pá      GERAL   +5 em Força para cavar buracos e mover detritos. Pode ser usada em combate como bastão. 2       0       \N      0       \N      2026-03-12 23:21:02.641535+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
b107fabe-be69-499b-8914-60f18d1174ab    Paraquedas      GERAL   Anula dano de queda. Veteranos em Acrobacia, Pilotagem, Reflexos, Tática ou Profissão adequada sabem usar. Caso contrário: Reflexos DT 20; falha reduz dano apenas à metade.    2       I       \N      0       \N      2026-03-12 23:21:02.641535+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
ee49219b-58f3-434a-97cd-a173d57ee7bb    Traje de Mergulho       GERAL   Roupa impermeável com tanque e máscara (1h de oxigênio). +5 em resistência contra efeitos ambientais e resistência a dano químico 5. Vestir/despir: ação completa.      2       I       \N      0       \N      2026-03-12 23:21:02.641535+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
4740b512-85c9-4f2f-a11f-9210a1a97c92    Traje Espacial  GERAL   Proteção total para o vácuo. Suprimento de água e oxigênio por 8 horas. Protege contra raios cósmicos. +10 em resistência contra efeitos ambientais e resistência a dano químico 20. Vestir/despir: 2 rodadas.  5       II      \N      0       \N      2026-03-12 23:21:02.641535+00   OPERACIONAL     \N      \N      \N      \N      \N      \N      []      SOBREVIVENDO_AO_HORROR
\.


--
-- Data for Name: origens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.origens (id, nome, descricao, pericias_concedidas, poder_concedido, created_at, poder_descricao, fonte, criador) FROM stdin;
ea5103d8-c889-4e4e-9ef0-d4b513ebd95f    Cultista Arrependido    Você fez parte de um culto que adorava entidades do Outro Lado. Após ver os horrores que seu grupo causava, decidiu abandoná-lo e usar seu conhecimento para combater o paranormal de dentro.   ["Ocultismo", "Religião"]       Traços do Outro Lado    2026-03-12 03:58:08.920501+00   Você recebe um poder paranormal à sua escolha, mas começa o jogo com metade da Sanidade inicial.        Livro Base      \N
b2c3b2e0-e1b0-4960-8f0f-ce5873ce6fe2    Chef do Outro Lado      Você nunca foi muito bom na culinária convencional. Depois de sobreviver ao paranormal, entretanto, descobriu um talento que é considerado um grande tabu até mesmo pelos ocultistas mais experientes: cozinhar e ingerir entidades do Outro Lado.      ["Ocultismo", "Profissão (cozinheiro)"] Fome do Outro Lado      2026-03-12 03:58:08.920501+00   Você pode usar partes de criaturas do Outro Lado como ingredientes culinários. Pode preparar um prato especial durante um interlúdio que fornece RD 10 contra o tipo de dano do elemento da criatura. Cada refeição custa 1 ponto de Sanidade permanente.       Sobrevivendo ao Horror  Julie Sathler | Ateliê Secreto
69460178-f7e1-4749-a4f4-b15c37f8ae23    Acadêmico       Você trabalhou em uma universidade, instituto de pesquisa ou museu. Seu trabalho envolvia pesquisa, ensino ou curadoria de conhecimento. Em algum momento, suas pesquisas esbarraram no paranormal.     ["Ciências", "Investigação"]    Saber é Poder   2026-03-12 03:58:08.920501+00   Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.        Livro Base      \N
ffd123e1-a594-4b06-b9e1-2ddc409fc453    Agente de Saúde Você trabalhou na área da saúde, seja como médico, enfermeiro, paramédico ou técnico. Seu contato com o sofrimento humano e, eventualmente, com casos inexplicáveis, o levou à Ordem.   ["Intuição", "Medicina"]        Técnica Medicinal       2026-03-12 03:58:08.920501+00   Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.      Livro Base      \N
6b06eefd-c168-446a-a012-c4569b3be20f    Amnésico        Você não se lembra de quem era antes. Talvez tenha sido um experimento, uma vítima de ritual ou simplesmente alguém que viu algo que não deveria. Sua vida começa agora, na Ordem.      []      Vislumbres do Passado   2026-03-12 03:58:08.920501+00   Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares. Se passar, recebe 1d4 PE temporários e uma informação útil.    Livro Base      \N
8968c5c0-b2ed-4928-9885-769ff8412080    Artista Você era um ator, músico, escritor, pintor ou qualquer outro tipo de artista. Sua sensibilidade e criatividade o tornaram mais perceptivo ao paranormal.        ["Artes", "Enganação"]  Magnum Opus     2026-03-12 03:58:08.920501+00   Uma vez por missão, pode determinar que uma pessoa envolvida em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquela pessoa.        Livro Base      \N
e997c2e2-665a-4314-9210-b708586a7704    Atleta  Você foi um atleta profissional ou amador de alto nível. Seu corpo treinado e sua mentalidade competitiva o tornaram um agente eficaz.  ["Acrobacia", "Atletismo"]      110%    2026-03-12 03:58:08.920501+00   Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.    Livro Base      \N
c062207b-69ed-4404-a1d9-5938c3e9c342    Chef    Você era um cozinheiro profissional, seja em um restaurante sofisticado ou em uma barraca de rua. Sua habilidade com ingredientes e sua criatividade na cozinha o tornaram um membro valioso da Ordem.  ["Fortitude", "Profissão (cozinheiro)"] Ingrediente Secreto     2026-03-12 03:58:08.920501+00   Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você e todos que comerem recebem o benefício de dois pratos.       Livro Base      \N
b849b1a0-ac2f-4f63-9c4d-9b859b2eeb59    Criminoso       Você viveu à margem da lei, seja como ladrão, hacker, traficante ou outro tipo de criminoso. Suas habilidades ilícitas provaram ser surpreendentemente úteis na Ordem.  ["Crime", "Furtividade"]        O Crime Compensa        2026-03-12 03:58:08.920501+00   No final de uma missão, você pode escolher um item encontrado na missão (exceto itens amaldiçoados). Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente. Livro Base      \N
d6aa3acf-025e-49bc-8885-20ba8da98382    Magnata Você possui muito dinheiro ou patrimônio. Pode ser o herdeiro de uma família antiga ligada ao oculto, ter criado e vendido uma empresa e decidido usar sua riqueza para uma causa maior, ou ter ganho uma loteria após inadvertidamente escolher números amaldiçoados que formavam um ritual.   ["Diplomacia", "Pilotagem"]     Patrocinador da Ordem   2026-03-12 03:58:08.920501+00   Seu limite de crédito é sempre considerado um acima do atual.   Livro Base      \N
3c694393-ae3d-4bf6-bdba-3fa8d985feb8    Mercenário      Você é um soldado de aluguel, que trabalha sozinho ou como parte de alguma organização que vende serviços militares. Escoltas e assassinatos fizeram parte de sua rotina por tempo o suficiente para você se envolver em alguma situação com o paranormal.      ["Iniciativa", "Intimidação"]   Posição de Combate      2026-03-12 03:58:08.920501+00   No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.     Livro Base      \N
6a49d8ee-cbdc-442b-8544-815330cc5353    Militar Você serviu em uma força militar, como o exército ou a marinha. Passou muito tempo treinando com armas de fogo, até se tornar um perito no uso delas. Acostumado a obedecer ordens e partir em missões, está em casa na Ordo Realitas.  ["Pontaria", "Tática"]  Para Bellum     2026-03-12 03:58:08.920501+00   Você recebe +2 em rolagens de dano com armas de fogo.   Livro Base      \N
087caeea-76fb-4e5e-8183-4bea58dfc942    Operário        Pedreiro, industriário, operador de máquinas em uma fábrica… Você passou uma parte de sua vida em um emprego braçal, desempenhando atividades práticas que lhe deram uma visão pragmática do mundo.     ["Fortitude", "Profissão (operário)"]   Ferramenta de Trabalho  2026-03-12 03:58:08.920501+00   Escolha uma arma simples ou tática que, a critério do mestre, poderia ser usada como ferramenta em sua profissão. Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela. Livro Base      \N
6754ec9f-933a-49fc-8712-784a7c516aa1    Policial        Você fez parte de uma força de segurança pública, civil ou militar. Em alguma patrulha ou chamado se deparou com um caso paranormal e sobreviveu para contar a história.        ["Percepção", "Pontaria"]       Patrulha        2026-03-12 03:58:08.920501+00   Você recebe +2 em Defesa.       Livro Base      \N
b5e966dc-d014-49f5-9e53-b09d00a6aa16    Religioso       Você é devoto ou sacerdote de uma fé. Independentemente da religião que pratica, se dedica a auxiliar as pessoas com problemas espirituais. A partir disso, teve contato com o paranormal.      ["Religião", "Vontade"] Acalentar       2026-03-12 03:58:08.920501+00   Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença.       Livro Base      \N
510d167f-dd9c-4a38-ae7d-7ed2c7f4772a    T.I.    Programador, engenheiro de software ou simplesmente 'o cara da T.I.', você tem treinamento e experiência para lidar com sistemas informatizados. Seu talento (ou curiosidade exagerada) chamou a atenção da Ordem.      ["Investigação", "Tecnologia"]  Motor de Busca  2026-03-12 03:58:08.920501+00   A critério do Mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.        Livro Base      \N
c7e69d04-b528-49a1-88c5-06fde5dedf06    Desgarrado      Você cresceu sem estrutura familiar, sobrevivendo nas ruas ou em ambientes hostis. Essa vida dura forjou um corpo e uma mente capazes de aguentar o que a maioria não suporta.  ["Fortitude", "Sobrevivência"]  Calejado        2026-03-12 03:58:08.920501+00   Você recebe +1 PV para cada 5% de NEX.  Livro Base      \N
b3f096cd-0cff-455f-91dc-326de47abd14    Engenheiro      Você trabalhou projetando, construindo ou consertando estruturas, máquinas ou sistemas. Sua mente analítica e suas mãos habilidosas abriram portas inesperadas para o paranormal.       ["Profissão (engenheiro)", "Tecnologia"]        Ferramenta Favorita     2026-03-12 03:58:08.920501+00   Um item a sua escolha (exceto armas) conta como uma categoria abaixo para você. Livro Base      \N
53d3af7f-2a39-4a9b-901e-3427b243f84e    Executivo       Você ocupava um cargo de liderança em uma empresa ou organização. Sua habilidade de tomar decisões sob pressão e gerenciar pessoas chamou a atenção da Ordem.   ["Diplomacia", "Profissão (executivo)"] Processo Otimizado      2026-03-12 03:58:08.920501+00   Sempre que faz um teste de perícia durante uma cena de investigação, você pode gastar 2 PE para receber +5 nesse teste. Livro Base      \N
4d20b69e-072e-410f-87f0-48558933b90d    Investigador    Você trabalhou como detetive particular, investigador ou analista. Sua habilidade em encontrar pistas e interrogar suspeitos o tornou um ativo valioso para a Ordem.    ["Investigação", "Percepção"]   Faro para Pistas        2026-03-12 03:58:08.920501+00   Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.        Livro Base      \N
2046e181-42fc-4928-95bc-2cd25442c7cd    Lutador Você tem experiência em combate corpo a corpo, seja como lutador de artes marciais, praticante de esportes de contato ou simplesmente alguém que cresceu em um ambiente violento.       ["Luta", "Reflexos"]    Mão Pesada      2026-03-12 03:58:08.920501+00   Você recebe +2 em rolagens de dano com ataques corpo a corpo.   Livro Base      \N
db06123d-af39-43ad-93b8-9b3af9c53eff    Servidor Público        Você possuía carreira em um órgão do governo, lidando com burocracia e atendendo pessoas. Sua rotina foi quebrada quando você viu que o prefeito era um cultista ou que a câmara de vereadores se reunia à noite para realizar rituais. ["Intuição", "Vontade"] Espírito Cívico 2026-03-12 03:58:08.920501+00   Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido de +2 para +5.       Livro Base      \N
be62943e-4d4d-4afa-a31e-9965f42e06ec    Teórico da Conspiração  A humanidade nunca pisou na lua. Reptilianos ocupam importantes cargos públicos. A Terra é plana... E secretamente governada pelos Illuminati. Você sabe isso tudo, pois investigou a fundo esses importantes assuntos. ["Investigação", "Ocultismo"]   Eu Já Sabia     2026-03-12 03:58:08.920501+00   Você recebe +2 em Defesa e testes de resistência contra criaturas.      Livro Base      \N
5b85ef5b-3d09-4657-9862-0c2d48c6d536    Trabalhador Rural       Você trabalhava no campo ou em áreas isoladas, como fazendeiro, pescador, biólogo, veterinário... Você se acostumou com o convívio com a natureza e os animais e talvez tenha ouvido uma ou outra história de fantasmas ao redor da fogueira.   ["Adestramento", "Sobrevivência"]       Desbravador     2026-03-12 03:58:08.920501+00   Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, você não sofre penalidade em deslocamento por terreno difícil.     Livro Base      \N
0f8db64f-73a8-4583-9b14-0af133b97ea7    Trambiqueiro    Uma vida digna exige muito trabalho, então é melhor nem tentar. Você vivia de pequenos golpes, jogatina ilegal e falcatruas. Certo dia, enganou a pessoa errada; no dia seguinte, se viu servindo à Ordem.      ["Crime", "Enganação"]  Impostor        2026-03-12 03:58:08.920501+00   Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação. Livro Base      \N
20ab6213-6b94-4699-b84a-5e422dceafb6    Universitário   Você era aluno de uma faculdade. Em sua rotina de estudos, provas e festas, acabou descobrindo algo — talvez um livro amaldiçoado na antiga biblioteca do campus? Por seu achado, foi convocado pela Ordem.     ["Atualidades", "Investigação"] Dedicação       2026-03-12 03:58:08.920501+00   Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1.   Livro Base      \N
161b9f0c-de61-42d6-9791-12430e4c12b9    Vítima  Em algum momento de sua vida — infância, juventude ou início da vida adulta — você encontrou o paranormal... E a experiência não foi nada boa. Você viu os espíritos dos mortos, foi atacado por uma entidade ou mesmo foi sequestrado para ser sacrificado em um ritual.       ["Reflexos", "Vontade"] Cicatrizes Psicológicas 2026-03-12 03:58:08.920501+00   Você recebe +1 de Sanidade para cada 5% de NEX. Livro Base      \N
81a17118-9ffd-4afa-987b-8d2895d51ccd    Amigo dos Animais       Você desenvolveu uma conexão muito forte com outros seres: os animais. Seja por nunca ter se dado muito bem com humanos ou por preferir a companhia de um melhor amigo de quatro patas, você leva sua vida ao lado de um bichano e até mesmo aprende com a natureza perceptiva deles.   ["Adestramento", "Percepção"]   Companheiro Animal      2026-03-12 03:58:08.920501+00   Você consegue entender as intenções e sentimentos de animais, e pode usar Adestramento para mudar a atitude deles. Além disso, você possui um melhor amigo, um animal que cresceu com você. Ele conta como um aliado que fornece +2 em uma perícia a sua escolha.       Sobrevivendo ao Horror  Gabriela 'Louie' | Arsenal Paranormal
3c535b8b-e782-4c63-9b92-ce093e223d0c    Astronauta      Outrora limitada a membros de algumas agências espaciais estatais, a profissão de explorador espacial se tornou mais acessível. Como um astronauta, você se acostumou à pressão de ser responsável pela vida de seus colegas e por experimentos de milhões de reais. E foi na escuridão do espaço que você descobriu que não estamos sozinhos.  ["Ciências", "Fortitude"]       Acostumado ao Extremo   2026-03-12 03:58:08.920501+00   Quando sofre dano de fogo, de frio ou mental, você pode gastar 1 PE para reduzir esse dano em 5. A cada vez que usa esta habilidade novamente na mesma cena, seu custo aumenta em +1 PE.        Sobrevivendo ao Horror  \N
5f946e7c-a36c-42f4-af8b-f2c9b0e7bfdf    Colegial        Você era um aluno do colegial e tinha uma rotina baseada nos estudos, nas amizades e nos dramas típicos de alguém da sua idade, até que um encontro com o paranormal mudou sua vida.    ["Atualidades", "Tecnologia"]   Poder da Amizade        2026-03-12 03:58:08.920501+00   Escolha um personagem para ser seu melhor amigo. Se estiver em alcance médio dele e puderem trocar olhares, você recebe +2 em todos os testes de perícia.       Sobrevivendo ao Horror  \N
eaf3d805-62fe-4675-a758-73f702968dd9    Experimento     Você foi uma cobaia em um experimento físico. Pode ter sido um voluntário em um procedimento experimental legítimo, ou submetido a experimentos científicos ou paranormais contra sua vontade.  ["Atletismo", "Fortitude"]      Mutação 2026-03-12 03:58:08.920501+00   Você recebe resistência a dano 2 e +2 em uma perícia à sua escolha que seja originalmente baseada em Força, Agilidade ou Vigor. Entretanto, sofre penalidade em Diplomacia.     Sobrevivendo ao Horror  \N
532021e0-15b3-4456-b930-b453e9542981    Cosplayer       Você é apaixonado pela arte do cosplay e dedicou sua vida a criar a melhor fantasia possível. Confrontado com o paranormal, você colocou sua arte, e sua resiliência, a serviço da Ordem.       ["Artes", "Vontade"]    Não É Fantasia, É Cosplay!      2026-03-12 03:58:08.920501+00   Você pode usar Artes no lugar de Diplomacia ou Enganação em testes de interação social. Além disso, recebe +5 em testes de resistência contra efeitos de medo relacionados ao tema do seu cosplay.      Sobrevivendo ao Horror  Rafael 'Damnu' e Victor Moda | Toca dos Monstros
c72259c1-b25b-44a0-be50-578d554afc10    Diplomata       Você atuava em uma área onde as habilidades sociais e políticas eram ferramentas indispensáveis. Talvez fosse representante comercial de uma empresa, membro de um partido político ou embaixador do governo.   ["Atualidades", "Diplomacia"]   Conexões        2026-03-12 03:58:08.920501+00   Você pode gastar 2 PE para receber +5 em um teste de Diplomacia ou para descobrir uma informação sobre um NPC com quem esteja interagindo.      Sobrevivendo ao Horror  \N
22c26fb7-1182-4fe1-b3e6-8d4ceb146c07    Explorador      Você é uma pessoa que se interessa muito por história ou geografia, frequentemente embarcando em trilhas e explorações para enriquecer seus estudos. Suas aventuras tornaram seu corpo mais resistente e capaz de se manter firme mesmo nas situações mais adversas.    ["Fortitude", "Sobrevivência"]  Manual do Sobrevivente  2026-03-12 03:58:08.920501+00   Você pode gastar uma ação de interlúdio para preparar rações especiais. Todos que as consumirem recuperam +1d6 PV ou Sanidade (à sua escolha) no próximo descanso.      Sobrevivendo ao Horror  Guilherme 'Guirassol' e João Vitor 'Vapor' | Arquivo do Medo
63e651ce-86f3-4d44-8a61-2baefb6fb270    Fanático por Criaturas  Você sempre foi obcecado pelo sobrenatural. Desde que pode se lembrar, a ideia de encontrar uma criatura o fascina tanto quanto o assusta. Essa faísca fez você se tornar um 'caçador de monstros'.     ["Investigação", "Ocultismo"]   Conhecimento Oculto     2026-03-12 03:58:08.920501+00   Você recebe +5 em testes de Ocultismo para identificar criaturas do Outro Lado e em testes de Vontade contra enigmas de medo associados a elas. Sobrevivendo ao Horror  Everson 'Akkiel' e Yasmim Furtado | Grimório Paranormal
d448cd3e-e11d-46b2-9481-df15e9af770a    Inventor Paranormal     A curiosidade e a criatividade fizeram de você uma pessoa que busca constantemente desafiar limites e criar soluções inovadoras, sendo mais de uma vez intitulado como um 'cientista louco'.    ["Profissão (engenheiro)", "Vontade"]   Invenção Paranormal     2026-03-12 03:58:08.920501+00   Escolha um ritual de 1º círculo. Você possui um invento paranormal, um item de categoria 0 que ocupa 1 espaço e que permite executar o efeito do ritual escolhido. Para ativar o invento, gasta uma ação padrão e faz um teste de Profissão (engenheiro) com DT 15 +5 para cada ativação na mesma missão.       Sobrevivendo ao Horror  Bruno Sargi | C.R.I.S.
2668ea49-f213-4286-be91-b6c30da40d2f    Profetizado     Como qualquer pessoa, você vai morrer. Entretanto, diferente delas, você sabe como isso vai acontecer. De algum jeito, seja por pesadelos, pensamentos intrusivos ou até visões inesperadas, você tem uma premonição clara de como serão seus últimos momentos de vida. ["Vontade"]     Luta ou Fuga    2026-03-12 03:58:08.920501+00   Conhecer os sinais de sua morte o deixa mais confiante, principalmente quando eles não estão presentes. Você recebe +2 em Vontade. Quando surge uma referência a sua premonição, você recebe +2 PE temporários que duram até o fim da cena.     Sobrevivendo ao Horror  \N
04b4aa40-f154-4533-8b0d-1ee717c5dd5e    Psicólogo       Você se especializou no estudo e tratamento das questões mentais do ser humano. Em sua prática profissional, você teve contato com o paranormal e descobriu que algumas aflições mentais possuem origens sombrias e perigosas.  ["Intuição", "Profissão (psicólogo)"]   Terapia 2026-03-12 03:58:08.920501+00   Você pode usar Profissão (psicólogo) como Diplomacia. Além disso, uma vez por rodada, quando você ou um aliado em alcance curto falha em um teste de resistência contra um efeito que causa dano mental, você pode gastar 2 PE para fazer um teste de Profissão (psicólogo) e usar o resultado no lugar.        Sobrevivendo ao Horror  Luiz Giovane e Matheus Santana | Missões Ordem
7b9ea354-bd3f-4651-a79a-3c402e4a1b6c    Repórter Investigativo  Você está sempre em busca de histórias significativas, investigando eventos, entrevistando fontes e analisando dados para descobrir a verdade por trás dos acontecimentos.      ["Atualidades", "Investigação"] Encontrar a Verdade     2026-03-12 03:58:08.920501+00   Você pode usar Investigação no lugar de Diplomacia ao fazer testes para persuadir e mudar atitude e, quando faz um teste de Investigação, pode gastar 2 PE para receber +5 nesse teste. Sobrevivendo ao Horror  \N
5880537b-88e6-4d07-8311-74c9b9f0f679    Fotógrafo       Você é um artista visual que usa câmeras para capturar momentos e transmitir histórias através de imagens estáticas. Costumeiramente movido pela paixão de observar o mundo ao seu redor.       ["Artes", "Percepção"]  Através da Lente        2026-03-12 03:58:08.920501+00   Você pode gastar 1 PE para receber +5 em um teste de Percepção para observar detalhes ou para registrar uma cena através de lentes.     Sobrevivendo ao Horror  \N
9ffe79af-f917-4f75-9c4c-d84307a406f5    Jovem Místico   Você possui uma profunda conexão com sua espiritualidade, suas crenças ou o próprio universo. Essa conexão faz com que você veja o mundo e viva sua vida de forma diferente e peculiar. ["Ocultismo", "Religião"]       A Culpa é das Estrelas  2026-03-12 03:58:08.920501+00   Uma vez por cena, você pode gastar 2 PE para rolar novamente um teste de perícia baseado em sorte ou intuição (a critério do mestre), usando o melhor resultado.        Sobrevivendo ao Horror  Ramon 'PlayRay' e João 'Portill' | A Passagem
d4cd6cb5-f9e4-4e95-bca5-cc2e0265dc68    Legista do Turno da Noite       Em um trabalho como o seu, é de se esperar que você já tenha visto muita coisa. No entanto, quando o sol se põe, seus colegas vão embora e a luz artificial deixa cantos sombrios do necrotério, talvez você veja mais do que gostaria. ["Ciências", "Medicina"]        Luto Habitual   2026-03-12 03:58:08.920501+00   Você recebe +5 em testes de Medicina para necropsia e +2 em testes de resistência contra efeitos de medo provenientes de cadáveres ou cenas de morte.   Sobrevivendo ao Horror  Ivo 'Eddu' e Ana Beatriz 'Bix' | Arquivos Confidenciais
443d50a7-52ed-4608-a84e-07862c393807    Mateiro Você conhece áreas rurais e selvagens. Você pode ser um guia florestal, um biólogo de campo ou simplesmente um entusiasta da vida selvagem. Qualquer que seja sua relação com a natureza, ela foi sua porta para o contato com o Outro Lado.    ["Percepção", "Sobrevivência"]  Mapa Celeste    2026-03-12 03:58:08.920501+00   Desde que possa ver o céu, você nunca se perde e recebe +5 em testes de Sobrevivência para orientação e navegação ao ar livre.  Sobrevivendo ao Horror  \N
0aff1b15-a943-4af5-a1e9-30bde49ccf55    Mergulhador     Seja por profissão ou por hobby, você é um aventureiro subaquático que explora os mistérios e maravilhas do mundo submerso. Trajando seu equipamento de mergulho, você consegue se aventurar a grandes profundidades.   ["Atletismo", "Fortitude"]      Fôlego de Nadador       2026-03-12 03:58:08.920501+00   Você pode prender a respiração pelo dobro do tempo normal e recebe +5 em testes de Atletismo para natação.      Sobrevivendo ao Horror  \N
6ddaf54c-7e66-4d94-a916-b114aed444ee    Motorista       Você é um caminhoneiro, motorista de aplicativo, motoboy, piloto de corrida, motorista de ambulância ou qualquer outro tipo de condutor profissional. Você levava a vida transportando cargas ou passageiros.   ["Pilotagem", "Reflexos"]       Mãos no Volante 2026-03-12 03:58:08.920501+00   Você recebe +5 em testes de Pilotagem e pode gastar 1 PE para realizar uma manobra de veículo como uma ação de movimento.       Sobrevivendo ao Horror  \N
54848a16-36fb-4fe9-b02e-64070503c25b    Nerd Entusiasta Você dedicou muito do seu tempo aprendendo sobre videogames, RPGs de mesa, ficção científica ou qualquer outro assunto considerado 'nerd'. Sua obsessão em pesquisar fundo seus assuntos de interesse chamou a atenção de organizações paranormais.     ["Ciências", "Tecnologia"]      O Inteligentão  2026-03-12 03:58:08.920501+00   Você pode gastar 2 PE para receber +5 em um teste de Intelecto ou de uma perícia baseada em Intelecto.  Sobrevivendo ao Horror  Daniel Dill e Lukas Castanho | Remate Paranormal
\.


--
-- Data for Name: pericias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pericias (id, nome, atributo_base, somente_trainada, created_at) FROM stdin;
c91d9a92-3fe0-4abc-b187-d6221631da7a    Acrobacia       Agilidade       f       2026-03-12 03:58:08.929502+00
e81a7b96-1c51-4c05-96d4-bf530c48dc3d    Adestramento    Presença        f       2026-03-12 03:58:08.929502+00
fa34380c-f20a-4ca8-9a85-2c80b2af3f97    Artes   Presença        t       2026-03-12 03:58:08.929502+00
6b2c1257-92b8-4d03-ba33-082d4580376a    Atletismo       Força   f       2026-03-12 03:58:08.929502+00
3198ca68-b61d-4973-b63c-1367ffbe11eb    Atualidades     Intelecto       f       2026-03-12 03:58:08.929502+00
40177254-3442-4f18-bfe5-f2a27ec908b4    Ciências        Intelecto       t       2026-03-12 03:58:08.929502+00
b928afc3-40c1-45ce-b506-808f2b1ce625    Crime   Agilidade       t       2026-03-12 03:58:08.929502+00
787c04ee-058d-416f-ae6e-7db9a2378b65    Diplomacia      Presença        f       2026-03-12 03:58:08.929502+00
018d3f28-5ed4-42d9-87dc-9582e76ba284    Enganação       Presença        f       2026-03-12 03:58:08.929502+00
aa1a5675-7806-4fc1-8fa1-d3f3226f0f59    Fortitude       Vigor   f       2026-03-12 03:58:08.929502+00
5206c2d0-b4aa-4bf4-a499-92be1c60e4d0    Furtividade     Agilidade       f       2026-03-12 03:58:08.929502+00
a1eb485d-8b2b-4dfb-8ba7-65d92576fff5    Iniciativa      Agilidade       f       2026-03-12 03:58:08.929502+00
21c74a4d-1857-4632-a1e6-e75c9ddd321f    Intimidação     Presença        f       2026-03-12 03:58:08.929502+00
4d7c3bb1-e77d-4e08-83c9-963767377d14    Intuição        Presença        f       2026-03-12 03:58:08.929502+00
21538e0f-50d6-4919-b6fc-ffa81637b8f5    Investigação    Intelecto       f       2026-03-12 03:58:08.929502+00
7599cbfa-d47b-4c10-9659-6c358297d810    Luta    Força   f       2026-03-12 03:58:08.929502+00
80d0f21b-8690-48a5-87b8-bf570e7e0ff6    Medicina        Intelecto       t       2026-03-12 03:58:08.929502+00
1f11d066-da1d-4f78-ab65-b6319aead6c5    Ocultismo       Intelecto       t       2026-03-12 03:58:08.929502+00
57acdd25-29ab-4dc5-9970-ab8fd266ad48    Percepção       Presença        f       2026-03-12 03:58:08.929502+00
ef706ffc-dc29-4f1d-8d9d-a833685bee83    Pilotagem       Agilidade       t       2026-03-12 03:58:08.929502+00
c872ca8b-3da2-423f-9ec8-a7d369adfc5b    Pontaria        Agilidade       f       2026-03-12 03:58:08.929502+00
a73df98c-7ea9-42f6-88fd-6ad92ef35cd7    Profissão       Intelecto       t       2026-03-12 03:58:08.929502+00
5d57039b-e4a5-47f2-8f11-ea731cce1110    Reflexos        Agilidade       f       2026-03-12 03:58:08.929502+00
44e84e3f-7182-4b04-8005-9b27f79da1e8    Religião        Presença        t       2026-03-12 03:58:08.929502+00
65dd4f77-24f2-467f-9d06-d9f6adc7120a    Sobrevivência   Intelecto       f       2026-03-12 03:58:08.929502+00
5ef5d252-d926-44a5-8aaf-a92f7b0801ef    Tática  Intelecto       t       2026-03-12 03:58:08.929502+00
f5bcba0e-2208-4b1f-9596-8f5fd2c989e5    Tecnologia      Intelecto       t       2026-03-12 03:58:08.929502+00
76f74c69-49dc-40e3-9cd3-5632057506c5    Vontade Presença        f       2026-03-12 03:58:08.929502+00
\.


--
-- Data for Name: personagens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personagens (id, user_id, nome, classe_id, origem_id, nivel, nex, patente, pv_atual, pv_maximo, pe_atual, pe_maximo, san_atual, san_maximo, forca, agilidade, intelecto, vigor, presenca, defesa, historia, pericias, rituals, inventario, created_at, updated_at, trilha_id) FROM stdin;
c73fda7f-d108-4504-ba50-335e250b6364    c7273c5e-8e85-4566-8a95-0bf90fdab8d9    007     5882ea7c-0fa6-479d-a327-27423b19772c    ffd123e1-a594-4b06-b9e1-2ddc409fc453    1       0       Recruta 13      13      7       7       23      23      1       1       3       1       3       11      \N      ["Ocultismo", "Vontade", "Intuição", "Medicina", "Pontaria", "Reflexos", "Percepção", "Furtividade", "Investigação", "Crime"]   []      []      2026-03-14 16:19:50.09834+00    2026-03-14 16:19:50.09834+00    \N
8ba43481-3dbf-41be-92e1-25b9d856d76a    2142da82-5a31-4209-b821-06af2c8a9bb6    004     5882ea7c-0fa6-479d-a327-27423b19772c    ffd123e1-a594-4b06-b9e1-2ddc409fc453    1       0       Recruta 13      13      7       7       23      23      1       1       3       1       3       11      \N      ["Ocultismo", "Vontade", "Intuição", "Medicina", "Diplomacia", "Furtividade", "Iniciativa", "Investigação", "Intimidação", "Pilotagem"] ["be94a549-ad97-4617-8717-e0a1e3a21801", "3b5f0527-43e3-4897-ac75-4718c16d4f98", "feb2825d-d79d-4503-a699-c5031ac875d6"]        []      2026-03-14 17:23:25.581058+00   2026-03-14 17:23:25.581058+00   \N
\.


--
-- Data for Name: rituais; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rituais (id, nome, elemento, circulo, execucao, alcance, alvo, duracao, resistencia, custo_pe, descricao, created_at, discente, verdadeiro, fonte, dados, dados_discente, dados_verdadeiro) FROM stdin;
4c967662-cad8-459c-b283-e248ec463275    Nuvem de Cinzas Morte   1       Padrão  Curto   1 pessoa        Cena    Vontade parcial 0       \N      2026-03-12 14:09:47.885525+00   \N      \N      Livro Base      \N      \N      \N
5f504fab-7014-4b19-b26c-b6583b42c332    Localização     Conhecimento    2       Padrão  Área: círculo com 90m de raio   1 objeto ou pessoa      Cena    Vontade anula (veja texto)      0       Este ritual pode encontrar uma pessoa ou objeto a sua escolha. O ritual indica a direção e distância da pessoa ou objeto mais próximo desse tipo, caso esteja ao alcance. Você pode movimentar-se para continuar procurando. Este ritual pode ser bloqueado por uma fina camada de chumbo.      2026-03-12 14:09:48.147242+00   (+3 PE): muda o alcance para "toque", o alvo para "1 pessoa" e a duração para "1 hora". Em vez do normal, a pessoa tocada descobre o caminho mais direto para entrar ou sair de um lugar.       \N      Livro Base      \N      \N      \N
ee56cc74-44a7-4577-9ce5-86abedfdcb37    Amaldiçoar Tecnologia   Conhecimento    3       Padrão  Toque   1 objeto tecnológico    Permanente      \N      0       \N      2026-03-12 14:09:48.167695+00   \N      \N      Livro Base      \N      \N      \N
16ebe82c-0cf4-44c4-9519-e2d9f0ae5ef8    Lâmina do Medo  Medo    4       Padrão  Toque   1 ser   Instantânea     Fortitude parcial       0       Você manifesta uma lâmina impossível, que pode ser descrita apenas como uma fenda na Realidade, com a qual golpeia um alvo adjacente. Se o alvo falhar no teste de Fortitude, seus PV são reduzidos a 0 e ele fica morrendo; se passar, sofre 10d8 pontos de dano de Medo (ignora todas as resistências) e fica apavorado por uma rodada. Aprender este ritual requer um poder de trilha específico.    2026-03-12 14:09:48.172263+00   \N      \N      Livro Base      \N      \N      \N
acf66490-d6e7-4604-bb28-678fded9c098    Medo Tangível   Medo    4       Padrão  Pessoal Você    Cena    \N      0       O ritual transforma seu corpo em uma manifestação do Medo, tornando-o imune a efeitos mundanos. Você fica imune às condições atordoado, cego, debilitado, enjoado, envenenado, exausto, fatigado, fraco, lento, ofuscado e paralisado, além de doenças e venenos, e não sofre dano adicional por acertos críticos e ataques furtivos. Dano do tipo balístico, corte, impacto ou perfuração não pode reduzir seu total de pontos de vida abaixo de 1.    2026-03-12 14:09:48.176595+00   \N      \N      Livro Base      \N      \N      \N
66e9a151-a8f9-443c-9eed-739e6be6b363    Tela de Ruído   Energia 2       Padrão  Pessoal Você    Cena    \N      0       Este ritual cria uma película de energia que recobre seu corpo e absorve energia cinética. Você recebe 30 PV temporários, mas apenas contra dano balístico, de corte, de impacto ou de perfuração.\n\nAlternativamente, você pode conjurar este ritual como uma reação quando sofrer dano, recebendo resistência 15 apenas contra esse dano.    2026-03-12 14:09:48.152895+00   (+3 PE): aumenta os PV temporário para 60 e a resistência para 30.      (+7 PE): muda o alcance para curto e o alvo para 1 ser ou objeto Enorme ou menor. Em vez do normal, cria uma esfera imóvel e tremeluzente com o tamanho do alvo e centrada nele. Nenhum ser, objeto ou efeito de dano pode passar pela esfera, embora seres possam respirar normalmente dentro dela. O alvo tem direito a um teste de Reflexo para evitar ser aprisionado. Requer 4º círculo.   Livro Base      \N      \N      \N
03d984e0-1ee8-4f9d-85dd-075b084ad820    Tecer Ilusão    Conhecimento    1       Padrão  Médio   \N      Cena    Vontade desacredita     2       Este ritual cria uma ilusão visual (uma pessoa, uma parede...) ou sonora (um grito de socorro, um uivo assustador...). O ritual cria apenas imagens ou sons simples, com volume equivalente à voz de uma pessoa para cada cubo de 1,5m no efeito. Não é possível criar cheiros, texturas ou temperaturas, nem sons complexos, como uma música ou diálogo. Seres e objetos atravessam uma ilusão sem sofrer dano, mas o ritual pode, por exemplo, esconder uma armadilha ou emboscada. A ilusão é dissipada se você sair do alcance.     2026-03-12 14:31:42.831205+00   (+2 PE): muda o efeito para até 8 cubos de 1,5m e a duração para sustentada. Você pode criar ilusões de imagem e sons combinados, e pode criar sons complexos, odores e sensações térmicas. Também pode criar sensações táteis, como texturas; objetos ainda atravessam a ilusão, mas seres não conseguem atravessá-la sem passar em um teste de Vontade. A cada rodada, você pode usar uma ação livre para mover a imagem ou alterar o som, como aumentar o volume ou fazer com que pareça se afastar ou se aproximar, ainda dentro dos limites do efeito. Você pode, por exemplo, criar a ilusão de um fantasma que anda pela sala, controlando seus movimentos. A ilusão ainda é incapaz de causar ou sofrer dano. Quando você para de sustentar o ritual, a imagem ou som persistem por mais uma rodada antes do ritual se dissipar. Requer 2º círculo.     (+ 5 PE): você cria a ilusão de um perigo mortal. Quando o ritual é conjurado, e no início de cada um de seus turnos, um alvo interagindo com a ilusão deve fazer um teste de Vontade; se falhar, acredita que a ilusão é real e sofre 6d6 pontos de dano de Conhecimento. O alvo racionaliza o efeito sempre que falha no teste (por exemplo, acredita que o mesmo teto pode cair sobre ele várias vezes). Se um alvo passar em dois testes de Vontade seguidos, o efeito é anulado para ele. Requer 3º círculo.       Livro Base      \N      \N      \N
c081c386-f162-47a3-83b5-ff5bcfb77333    Luz     Energia 1       Padrão  curto   1 objeto        Cena    Vontade Anula   2       O alvo emite luz de cores alternadas e brilhantes (mas não produz calor) em uma área com 9m de raio. O objeto pode ser guardado (em um bolso, por exemplo) para interromper a luz, que voltará a funcionar caso o objeto seja revelado. Se o alvo for um objeto em posse de uma pessoa involuntária, ela tem direito a um teste de Vontade para anular o efeito.        2026-03-12 14:45:11.933346+00   (+2 PE): muda o alcance para longo e o efeito para 4 esferas brilhantes. Cria esferas flutuantes de pura luz com 10cm de diâmetro, que você pode posicionar onde quiser dentro do alcance. Você pode enviar uma esfera à frente, outra para trás, outra para cima e manter uma perto de você, por exemplo. Uma vez por rodada, você pode mover as esferas com uma ação livre. Cada esfera ilumina uma área de 6m de raio, mas não produz calor. Se uma esfera ocupar o espaço de um ser, ele fica ofuscado e sua silhueta pode ser vista claramente (ela não recebe camuflagem por escuridão ou invisibilidade). Requer 2º círculo.     (+5 PE): a luz é cálida como a do sol. Dentro da área seus aliados recebem +1d20 em testes de Vontade, e seus inimigos ficam ofuscados. Requer 3º círculo.      Livro Base      \N      \N      \N
feb2825d-d79d-4503-a699-c5031ac875d6    Amaldiçoar Tecnologia   Energia 1       Padrão  toque   1 acessório ou arma de fogo     cena    \N      2       Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modificação a sua escolha.        2026-03-12 14:46:18.032634+00   (+2 PE): muda para duas modificações. Requer 2º círculo.        (+5 PE): muda para três modificações. Requer 3º círculo e afinidade.    Livro Base      \N      \N      \N
bd8a4773-492c-42d8-b693-ae189e328c29    Sopro do Caos   Energia 2       Padrão  Médio   Varia   sustentada      Veja texto      0       Você altera os movimentos de massas de ar de forma caótica. Ao conjurar o ritual, escolha um dos efeitos abaixo.\n\nAscender: cria uma corrente de ar ascendente capaz de erguer do chão um ser ou objeto Médio, fazendo o alvo flutuar para cima e para baixo conforme sua vontade. Você pode gastar uma ação de movimento para subir ou descer o alvo até 6m por rodada, até um máximo de 30m de altura. Você não pode mover o alvo horizontalmente — mas o alvo pode, por exemplo, escalar uma colina ou se apoiar no teto para mover-se lateralmente (com metade de seu deslocamento normal). Um ser levitando fica vulnerável. Alvos involuntários têm direito a um teste de Fortitude no início de cada um de seus turnos para encerrar o efeito. Derrubar um alvo flutuando (simplesmente parando a corrente de ar) causa o dano normal de queda, mas um alvo que passe no teste pode “nadar” para o chão contra a corrente. Você pode usar essa opção para fazer uma manobra derrubar contra um alvo voador dentro do alcance, usando Ocultismo em vez de Luta.\n\nSopro: cria uma lufada de vento a partir de suas mãos, que empurra qualquer alvo Médio ou menor, em um cone de 4,5m — faça uma manobra empurrar usando Ocultismo em vez de Luta, usando uma mesma rolagem sua para todos os alvos. A lufada de vento também faz qualquer coisa que um vento forte e súbito faria, como levantar pó, dispersar vapores, apagar chamas, espalhar papéis ou mover uma embarcação. Manter o sopro ativo exige uma ação padrão no seu turno.\n\nVento: cria uma área de vento forte dentro do alcance. Se conjurada numa área que já esteja com algum efeito de vento, aumenta esse efeito em um passo. Manter o vento ativo requer uma ação de movimento. Você também pode usar essa opção para reduzir os efeitos de vento em uma área. 2026-03-12 14:50:26.015625+00    (+3 PE): passa a afetar alvos Grandes. (+9 PE): passa a afetar alvos Enormes.  Livro Base      \N      \N      \N
be94a549-ad97-4617-8717-e0a1e3a21801    Amaldiçoar Arma Variável        1       Padrão  Toque   1 arma corpo a corpo ou pacote de munição       Cena    Nenhuma 0       Imbui a arma com um elemento (Sangue, Morte, Conhecimento ou Energia), causando +1d6 de dano do tipo escolhido. 2026-03-12 04:25:08.727415+00   +2 PE: Dano aumenta para +2d6. Requer 2º círculo.       +5 PE: Dano aumenta para +4d6. Requer 3º círculo e afinidade.   Livro Base      \N      \N      \N
14e64b12-988f-44f4-a867-9fd3736366ae    Arma Atroz      Sangue  1       Padrão  Toque   1 arma corpo a corpo    Sustentada      Nenhuma 0       A arma fornece +2 em testes de ataque e +1 na margem de ameaça. 2026-03-12 04:25:08.727415+00   +2 PE: Bônus de ataque aumenta para +5. Requer 2º círculo.      +5 PE: Bônus de ataque +5, +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade. Livro Base      \N      \N      \N
b1ea7f8a-47a0-48bb-9e73-c68c24d0c1b8    Armadura de Sangue      Sangue  1       Padrão  Pessoal Você    Cena    Nenhuma 0       Fornece +5 na Defesa. Cumulativo com outros rituais, mas não com equipamentos.  2026-03-12 04:25:08.727415+00   +5 PE: Bônus +10 na Defesa e RD 5 contra balístico, corte, impacto e perfuração. Requer 3º círculo.     +9 PE: Bônus +15 na Defesa e RD 10 contra os mesmos danos. Requer 4º círculo e afinidade.       Livro Base      \N      \N      \N
88d616d6-4380-49a5-9c2a-a560d286c4f2    Corpo Adaptado  Sangue  1       Padrão  Toque   1 pessoa ou animal      Cena    Nenhuma 0       Alvo fica imune a calor/frio extremos, pode respirar na água/fumaça densa.      2026-03-12 04:25:08.727415+00   +2 PE: Duração aumenta para 1 dia.      +5 PE: Alcance curto, alvos escolhidos. Livro Base      \N      \N      \N
63c3312c-58ed-41fb-ac25-719506b07ca0    Distorcer Aparência     Sangue  1       Padrão  Pessoal Você    Cena    Vontade desacredita     0       Modifica aparência (+10 em Enganação para disfarce). Não altera estatísticas.   2026-03-12 04:25:08.727415+00   +2 PE: Alcance curto, alvo 1 ser. Involuntário tem teste de Vontade.    +5 PE: Alvos escolhidos. Requer 3º círculo.     Livro Base      \N      \N      \N
1083e4d9-f7e4-44e1-986e-9901ef3cd122    Fortalecimento Sensorial        Sangue  1       Padrão  Pessoal Você    Cena    Nenhuma 0       Recebe +O em Investigação, Luta, Percepção e Pontaria.  2026-03-12 04:25:08.727415+00   +2 PE: Inimigos sofrem -O em ataques contra você. Requer 2º círculo.    +5 PE: Imune a surpreendido/desprevenido, +10 Defesa/Reflexos. Requer 4º círculo e afinidade.   Livro Base      \N      \N      \N
8c62c315-0c77-4adb-92c9-8c4f0c62c6e5    Cicatrização    Morte   1       Padrão  Toque   1 ser   Instantânea     Nenhuma 0       Alvo recupera 3d8+3 PV, mas envelhece 1 ano.    2026-03-12 04:25:08.727415+00   +2 PE: Recupera 5d8+5 PV. Requer 2º círculo.    +9 PE: Alcance curto, alvos escolhidos, recupera 7d8+7 PV. Requer 4º círculo e afinidade.       Livro Base      \N      \N      \N
9f44f863-3359-40af-92bb-aa0dcab3f84c    Consumir Manancial      Morte   1       Padrão  Pessoal Você    Cena    Nenhuma 0       Recebe 2d6+2 PV temporários.    2026-03-12 04:25:08.727415+00   +2 PE: Recebe 4d6+4 PV temporários. Requer 2º círculo.  +5 PE: Alvos escolhidos em alcance curto recebem 4d6+4 PV temporários. Requer 3º círculo.       Livro Base      \N      \N      \N
cec1ef00-5209-4a26-8b9a-44306c6b4e9d    Decadência      Morte   1       Padrão  Toque   1 ser   Instantânea     Fortitude reduz à metade        0       Causa 2d8+2 de dano de Morte.   2026-03-12 04:25:08.727415+00   +2 PE: Resistência nenhuma, dano 3d8+3. Executa ataque corpo a corpo somando dano da arma.      +5 PE: Alcance pessoal, explosão 6m, dano 8d8+8. Requer 3º círculo.     Livro Base      \N      \N      \N
b8ecc7c6-38b5-48f9-9c3d-bf90113fb7e5    Definhar        Morte   1       Padrão  Curto   1 ser   Cena    Fortitude parcial       0       Alvo fica fatigado. Sucesso deixa-o vulnerável. 2026-03-12 04:25:08.727415+00   +2 PE: Alvo fica exausto (ou fatigado se passar). Requer 2º círculo.    +5 PE: Até 5 seres. Requer 3º círculo e afinidade.      Livro Base      \N      \N      \N
e2b226f7-1ffb-4de9-9f7c-ec855d7fdc2b    Espirais da Perdição    Morte   1       Padrão  Curto   1 ser   Cena    Vontade parcial 0       Alvo sofre -O em testes de ataque. Sucesso anula.       2026-03-12 04:25:08.727415+00   +2 PE: Penalidade -OO. Requer 2º círculo.       +8 PE: Penalidade -OO, alvos escolhidos. Requer 3º círculo.     Livro Base      \N      \N      \N
3b5f0527-43e3-4897-ac75-4718c16d4f98    Apagar as Luzes Morte   1       Padrão  Pessoal Você    Instantânea     Nenhuma 0       Apaga luzes em alcance curto e concede visão no escuro até o fim da cena.       2026-03-12 04:25:08.727415+00   +2 PE: Alcance longo. Requer 2º círculo.        +5 PE: Até 5 aliados também recebem visão no escuro. Requer 3º círculo. Sobrevivendo ao Horror  \N      \N      \N
f80a157c-e882-4548-b3e0-a4a6f54ca46d    Compreensão Paranormal  Conhecimento    1       Padrão  Toque   1 ser ou objeto Cena    Vontade anula   0       Entende idiomas humanos escritos ou falados, ou sentimentos básicos de animais. 2026-03-12 04:25:08.727415+00   +2 PE: Alcance curto, alvos escolhidos. Requer 2º círculo.      +5 PE: Alcance pessoal, alvo você. Pode falar/escrever qualquer idioma humano. Requer 3º círculo.       Livro Base      \N      \N      \N
4aa0a7d3-1a34-4609-b5c2-78e3e2306929    Enfeitiçar      Conhecimento    1       Padrão  Curto   1 pessoa        Cena    Vontade anula   0       Alvo fica prestativo (+10 em Diplomacia). Hostilidade anula efeito.     2026-03-12 04:25:08.727415+00   +2 PE: Sugere uma ação aceitável que o alvo obedece. Requer 2º círculo. +5 PE: Afeta todos os alvos no alcance. Requer 3º círculo.      Livro Base      \N      \N      \N
bb466b22-72bd-4df3-bb54-745b166fb064    Ouvir os Sussurros      Conhecimento    1       Completa        Pessoal Você    Instantânea     Nenhuma 0       Pergunta Sim/Não sobre evento na mesma cena (chance de falha 1 em 1d6). 2026-03-12 04:25:08.727415+00   +2 PE: Execução 1 min. Pergunta sobre evento até 1 dia no futuro. Requer 2º círculo.    +5 PE: Execução 10 min, duração 5 rodadas. 1 pergunta/rodada (Sim/Não/Ninguém sabe). Requer 3º círculo. Livro Base      \N      \N      \N
b436f470-2b8c-4613-b635-2d9ab4d95d08    Perturbação     Conhecimento    1       Padrão  Curto   1 pessoa        1 rodada        Vontade anula   0       Dá ordem (Fuja, Largue, Pare, Sente-se, Venha) que o alvo obedece.      2026-03-12 04:25:08.727415+00   +2 PE: Alvo 1 ser. Adiciona comando 'Sofra' (3d8 dano Conhecimento + abalado).  +5 PE: Até 5 seres OU comando 'Ataque'. Requer 3º círculo e afinidade.  Livro Base      \N      \N      \N
f6db77b7-e14b-418c-a68e-971e98f8672d    Terceiro Olho   Conhecimento    1       Padrão  Pessoal Você    Cena    Nenhuma 0       Enxerga auras paranormais em alcance longo (elemento e poder aproximado).       2026-03-12 04:25:08.727415+00   +2 PE: Duração 1 dia.   +5 PE: Enxerga objetos/seres invisíveis. Requer 3º círculo.     Livro Base      \N      \N      \N
c1d9155e-e1b1-40fe-ba3e-a714bd1d6cbb    Desfazer Sinapses       Conhecimento    1       Padrão  Curto   1 ser   Instantânea     Vontade parcial 0       Causa 2d6+2 de dano de Conhecimento e frustração. Sucesso reduz dano e evita condição.  2026-03-12 04:25:08.727415+00   +2 PE: Alcance médio, dano 3d6+3, até 5 seres. Requer 2º círculo.       +5 PE: Dano 6d6+6, até 10 seres, condição esmorecido. Requer 3º círculo.        Sobrevivendo ao Horror  \N      \N      \N
151f492f-9a11-4a0d-9988-63ed2d49befb    Coincidência Forçada    Energia 1       Padrão  Curto   1 ser   Cena    Nenhuma 0       Alvo recebe +2 em testes de perícias.   2026-03-12 04:25:08.727415+00   +2 PE: Aliados escolhidos. Requer 2º círculo.   +5 PE: Aliados escolhidos, bônus +5. Requer 3º círculo e afinidade.     Livro Base      \N      \N      \N
de72fbbd-815a-4576-86c3-4f78dc98c961    Esfolar Sangue  1       Padrão  Curto   1 ser   Instantânea     Reflexos parcial        0       Causa 3d4+3 de dano de corte e sangramento. Sucesso reduz dano à metade e evita sangramento.    2026-03-12 04:25:08.727415+00   +2 PE: Alcance médio, dano 5d4+5, alvo explosão 6m. Requer 2º círculo.  +5 PE: Alcance longo, dano 10d4+10, alvo explosão 6m. Resistência não evita sangramento. Requer 3º círculo.     Sobrevivendo ao Horror  3d4+3   \N      \N
1cc2ec4b-36d0-49e8-a334-b85a15187f6b    Embaralhar      Energia 1       Padrão  Pessoal Você    Cena    Nenhuma 0       Cria 3 cópias ilusórias (+6 Defesa). Cada erro destrói uma cópia (-2 Defesa).   2026-03-12 04:25:08.727415+00   +2 PE: 5 cópias (+10 Defesa). Requer 2º círculo.        +5 PE: 8 cópias (+16 Defesa). Cópia destruída emite clarão (ofuscado). Requer 3º círculo.       Livro Base      \N      \N      \N
1a542518-dd29-4f22-8b08-c53ec0631315    Polarização Caótica     Energia 1       Padrão  Curto   Você    Sustentada      Vontade anula   0       Atrair (puxar objeto metal espaço 2) ou Repelir (RD 5 contra projéteis/arremesso).      2026-03-12 04:25:08.727415+00   +2 PE: Duração instantânea. Arremessa até 10 objetos (dano impacto/espaço).     +5 PE: Alcance médio, duração instantânea. Move ser/objeto espaço 10 por 9m.    Livro Base      \N      \N      \N
b5ab4edd-de36-4942-8631-cc10862661d6    Overclock       Energia 1       Reação  Pessoal Você    Instantânea     Nenhuma 0       Permite desafio analógico para obter info de eletrônico após falha. Objeto quebra após uso.     2026-03-12 04:25:08.727415+00   +2 PE: Permite 2 erros no desafio. Requer 2º círculo.   +5 PE: Permite 3 erros no desafio. Requer 3º círculo.   Sobrevivendo ao Horror  \N      \N      \N
b31a5bb5-2693-4c71-b232-4e9fd03d82d4    Cinerária       Medo    1       Padrão  Curto   Nuvem 6m raio   Cena    Nenhuma 0       Rituais na área têm DT +5.      2026-03-12 04:25:08.727415+00   +2 PE: Rituais na área custam -2 PE.    +5 PE: Rituais na área causam dano maximizado.  Livro Base      \N      \N      \N
49e4c793-54b3-403e-9299-2761bfd18e05    Descarnar       Sangue  2       Padrão  Toque   1 ser   Instantânea     Fortitude parcial       0       Causa 6d8 de dano e hemorragia (2d8/rodada). Sucesso reduz dano e evita hemorragia.     2026-03-12 04:25:08.727415+00   +3 PE: Dano 10d8, hemorragia 4d8. Requer 3º círculo.    +7 PE: Alvo você, duração sustentada. Ataques causam +4d8 e hemorragia auto. Requer 3º círculo e afinidade.     Livro Base      \N      \N      \N
06462a4c-c605-4aea-8ca7-a606f8a0f07b    Hemofagia       Sangue  2       Padrão  Toque   1 ser   Instantânea     Fortitude reduz à metade        0       Causa 6d6 de dano e recupera PV igual a metade do dano. 2026-03-12 04:25:08.727415+00   +3 PE: Resistência nenhuma. Executa ataque corpo a corpo somando dano.  +7 PE: Alvo você, duração cena. 1 toque/rodada causa 4d6 e cura metade. Requer 4º círculo.      Livro Base      \N      \N      \N
4f5b35f6-2984-48ad-b202-2bb4166ed1e5    Desacelerar Impacto     Morte   2       Reação  Curto   1 ser ou objetos (10 espaços)   Até solo ou cena        Nenhuma 0       Queda lenta (18m/rodada). Projéteis causam metade do dano.      2026-03-12 04:25:08.727415+00   \N      +3 PE: Até 100 espaços. Livro Base      \N      \N      \N
ea4d6ed4-75e3-4943-93ed-5650e24e17f4    Eco Espiral     Morte   2       Padrão  Curto   1 ser   2 rodadas       Fortitude reduz à metade        0       Cria cópia de cinzas. Descarrega no 2º turno causando dano igual ao sofrido pelo alvo na rodada anterior.       2026-03-12 04:25:08.727415+00   +3 PE: Até 5 seres.     +7 PE: Duração 3 rodadas. Descarrega na 3ª somando dano de 2 rodadas. Requer 4º círculo e afinidade.    Livro Base      \N      \N      \N
bad17357-c1ec-4fa5-9f23-2e197e2df235    Paradoxo        Morte   2       Padrão  Médio   Esfera 6m raio  Instantânea     Fortitude reduz à metade        0       Causa 6d6 de dano de Morte.     2026-03-12 04:25:08.727415+00   +3 PE: Esfera 1,5m diâmetro, duração cena. Causa 4d6/rodada. Move 9m com ação movimento.        +7 PE: Dano 13d6. Se reduzir a 0 PV, alvo vira cinzas (falha Fortitude). Requer 4º círculo.     Livro Base      \N      \N      \N
419b8470-7be2-4fd3-af20-3b23e049a831    Língua Morta    Morte   2       Padrão  Toque   1 cadáver       Sustentada      Nenhuma 0       Reanima cadáver para 1 pergunta/rodada (máx 3). Vira Esqueleto de Lodo ao fim.  2026-03-12 04:25:08.727415+00   +3 PE: Máx 4 perguntas. Vira Enraizado. +7 PE: Máx 5 perguntas. Vira Marionete. Requer 4º círculo e afinidade.  Sobrevivendo ao Horror  \N      \N      \N
d9a16f96-9c8f-46b8-992f-43d7d1d018b3    Aprimorar Mente Conhecimento    2       Padrão  Toque   1 ser   Cena    Nenhuma 0       Fornece +1 em Intelecto ou Presença.    2026-03-12 04:25:08.727415+00   +3 PE: Bônus +2. Requer 3º círculo.     +7 PE: Bônus +3. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
6930a22f-758a-4165-b004-3434d9a18bde    Detecção de Ameaças     Conhecimento    2       Padrão  Pessoal Esfera 18m raio Cena    Nenhuma 0       Sente perigo. Teste Percepção (DT 20) revela direção/distância. 2026-03-12 04:25:08.727415+00   +3 PE: Não fica desprevenido, +5 resistência contra armadilhas. Requer 3º círculo.      +5 PE: Duração 1 dia. Requer 4º círculo.        Livro Base      \N      \N      \N
22139912-2e5d-45c0-b809-7b54ece86cdc    Invadir Mente   Conhecimento    2       Padrão  Médio/Toque     1 ser / 2 pessoas       Instantânea / 1 dia     Vontade parcial / Nenhuma       0       Rajada Mental (6d6 dano + atordoado) OU Ligação Telepática.     2026-03-12 04:25:08.727415+00   +3 PE: Rajada (10d6). Ligação (vê/ouve pelos sentidos do alvo). Requer 3º círculo.      +7 PE: Rajada (10d6, alvos escolhidos). Ligação (até 5 pessoas). Requer 4º círculo.     Livro Base      \N      \N      \N
be5654b9-f466-4305-ae39-2e904639ad3c    Dissipar Ritual Medo    3       Padrão  Médio   1 ser/objeto ou esfera 3m       Instantânea     Nenhuma 0       Anula rituais ativos (Teste Ocultismo vs DT). Item amaldiçoado vira mundano por 1 dia.  2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
75884586-4602-40f6-9f0b-150be13e0565    Chamas do Caos  Energia 2       Padrão  Curto   Veja texto      Cena    Nenhuma 0       Chamejar (+1d6 fogo arma), Esquentar (1d6 dano objeto), Extinguir (apaga chama), Modelar (move chama).  2026-03-12 04:25:08.727415+00   +3 PE: Sustentada. Labareda (4d6 dano, Reflexos reduz). +7 PE: Como discente, dano 8d6. Requer 3º círculo.      Livro Base      \N      \N      \N
0d4afdf7-a814-4162-ba64-6b6c4cf7e043    Contenção Fantasmagórica        Energia 2       Padrão  Médio   1 ser   Cena    Reflexos anula  0       3 laços prendem alvo (agarrado). Escapar exige Atletismo (DT ritual).   2026-03-12 04:25:08.727415+00   +2 PE: Muda alvo para 'até 3 seres'.    +5 PE: Alvos escolhidos, laços causam 2d6 dano Energia/rodada. Requer 3º círculo.       Livro Base      \N      \N      \N
8b3f21f2-5489-40ca-a690-ba2e05a9a6f6    Dissonância Acústica    Energia 2       Padrão  Médio   Esfera 6m raio  Sustentada      Nenhuma 0       Todos surdos na área. Impede conjurar rituais.  2026-03-12 04:25:08.727415+00   +1 PE: Alvo 1 objeto (emana silêncio 3m).       +3 PE: Duração cena. Som não sai, mas quem está dentro ouve/conjura normal. Requer 3º círculo.  Livro Base      \N      \N      \N
ad0ad866-7768-4e19-a6d7-508d750dc764    Proteção contra Rituais Medo    2       Padrão  Toque   1 ser   Cena    Nenhuma 0       Alvo recebe resistência a dano paranormal 10 e +5 em testes contra rituais.     2026-03-12 04:25:08.727415+00   +3 PE: Resistência 20 e +10 em testes.  +6 PE: Resistência 30 e +15 em testes. Requer afinidade.        Livro Base      \N      \N      \N
c8b87a24-f018-4975-a298-bac64b3c4fa3    Rejeitar Névoa  Medo    2       Padrão  Curto   Nuvem 6m raio   Cena    Nenhuma 0       Rituais na área custam +2 PE/círculo e execução aumenta 1 passo. Anula Cinerária.       2026-03-12 04:25:08.727415+00   +2 PE: DT contra rituais na área diminui -5.    +5 PE: Dano de rituais na área é sempre mínimo. Livro Base      \N      \N      \N
9121408a-392f-4765-96c3-57e9897c30ca    Forma Monstruosa        Sangue  3       Padrão  Pessoal Você    Cena    Nenhuma 0       Vira criatura Grande: +5 ataque/dano corpo a corpo, 30 PV temp. Fúria (ataca mais próximo).     2026-03-12 04:25:08.727415+00   +3 PE: Imune a atordoado, fadiga, sangramento, sono, veneno.    +9 PE: Bônus +10, 50 PV temp. Requer 4º círculo e afinidade.    Livro Base      \N      \N      \N
d300125d-d965-486d-90cd-b1804ea8c423    Miasma Entrópico        Morte   3       Padrão  Médio   Nuvem 6m raio   Sustentada      Fortitude parcial       0       Nuvem tóxica: 4d6 dano Morte e enjoado. Sucesso reduz dano e evita enjoo.       2026-03-12 04:25:08.727415+00   +3 PE: Dano 6d6. Requer 4º círculo.     +7 PE: Dano 10d6. Requer 4º círculo e afinidade.        Livro Base      \N      \N      \N
a1cf6d47-eb63-4832-8e64-cb526b73aeee    Zerar Entropia  Morte   3       Padrão  Curto   1 ser   Cena    Fortitude anula 0       Alvo paralisado. Sucesso deixa lento. Novo teste com ação completa.     2026-03-12 04:25:08.727415+00   +4 PE: Alvo 1 ser (qualquer tipo). Requer 4º círculo.   +11 PE: Alvos escolhidos. Requer 4º círculo e afinidade.        Livro Base      \N      \N      \N
672742ea-efd4-4183-8e1a-d74f82dece6b    Contato Paranormal      Conhecimento    3       Completa        \N      Você    1 dia   Nenhuma 0       Recebe 6d6 para bônus em testes. Rolar 6 no dado tira 2 Sanidade.       2026-03-12 04:25:08.727415+00   +4 PE: Dados d8. Rolar 8 tira 3 Sanidade. Requer 4º círculo.    +9 PE: Dados d12. Rolar 12 tira 5 Sanidade. Requer 4º círculo e afinidade.      Livro Base      \N      \N      \N
3927b443-152e-4b71-b727-8ab78c8e6041    Relembrar Fragmento     Conhecimento    3       Padrão  Toque   1 objeto (texto)        Instantânea     Nenhuma 0       Restaura texto danificado enquanto tocado.      2026-03-12 04:25:08.727415+00   +4 PE: Restaurado até fim da missão.    +9 PE: Altera texto imperceptivelmente. Até fim missão. Requer afinidade.       Sobrevivendo ao Horror  \N      \N      \N
1b86314e-13a6-49d8-ac4a-4c4e9cb470a0    Transfigurar Água       Energia 3       Padrão  Longo   Esfera 30m raio Cena    Veja texto      0       Congelar, Derreter, Enchente (+6m desl), Evaporar (5d8 dano), Partir.   2026-03-12 04:25:08.727415+00   \N      +5 PE: Enchente (+12m), Evaporar (10d8).        Livro Base      \N      \N      \N
f95cb224-4336-4e80-a4b0-ec3b41896be5    Transfigurar Terra      Energia 3       Padrão  Longo   9 cubos 1,5m    Instantânea     Veja texto      0       Amolecer (10d6 dano desabamento), Modelar (cria objeto Enorme), Solidificar (agarra seres).     2026-03-12 04:25:08.727415+00   +3 PE: 15 cubos.        +7 PE: Afeta minerais/metais. Requer 4º círculo.        Livro Base      \N      \N      \N
b5e2f3d7-f6e6-4e0d-bb78-b758fd55fb07    Capturar o Coração      Sangue  4       Padrão  Curto   1 pessoa        Cena    Vontade parcial 0       Paixão doentia: alvo ajuda conjurador se falhar Vontade/turno. 2 sucessos anulam.       2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
58a575e7-b4a6-4a1d-84b1-d3faabc952be    Mutar   Energia 3       Padrão  Pessoal Você    Cena    Nenhuma 0       Isolamento acústico total: +10 Furtividade. Jogador não pode falar.     2026-03-12 04:25:08.727415+00   +4 PE: Alcance toque, alvo 1 ser.       +9 PE: Alcance curto, até 5 seres. Requer afinidade.    Sobrevivendo ao Horror  \N      \N      \N
8d5ca6f6-2506-4e76-9c13-30aa012f94a6    Milagre Ionizante       Energia 3       Ação Completa   Toque   1 ser   Instantânea     Fortitude (DT 30) evita doença  0       Cura condição negativa/doença/veneno. Falha causa Infectcídio.  2026-03-12 04:25:08.727415+00   \N      \N      Sobrevivendo ao Horror  \N      \N      \N
3404a0cb-9535-4572-9b66-23d9d8c93137    Dissipar Ritual Medo    3       Padrão  Médio   1 ser/objeto ou esfera 3m       Instantânea     Nenhuma 0       Anula rituais ativos (Teste Ocultismo vs DT). Item amaldiçoado vira mundano por 1 dia.  2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
7138347f-aa75-4221-ad92-00e6af320c3f    Vínculo de Sangue       Sangue  4       Padrão  Curto   1 pessoa        Cena    Fortitude parcial       0       Alvo sofre metade do dano que você sofrer (falha Fortitude).    2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
6f910a04-9b10-430f-98bc-9efbc02c6830    Martírio de Sangue      Sangue  4       Padrão  Pessoal Você    Cena (Morte permanente) Nenhuma 0       +10 ataque/dano/Defesa, 30 PV temp, cura acelerada 10. Vira criatura ao fim.    2026-03-12 04:25:08.727415+00   +5 PE: Bônus +20, 50 PV temp. Requer afinidade. \N      Sobrevivendo ao Horror  \N      \N      \N
1508153e-3807-4cce-8dbd-286379868f6b    Convocar o Algoz        Morte   4       Padrão  Curto   1 ser   Cena    Vontade/Fortitude       0       Manifesta medo: abalado (Vontade) ou 0 PV / 6d6 dano (Fortitude). Algoz imune a dano.   2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
295a0700-7976-415c-906f-79eb5fac432f    Distorção Temporal      Morte   4       Padrão  Pessoal \N      3 rodadas       Nenhuma 0       Bolsão temporal: age livre, mas não move nem interage. Imune a efeitos externos.        2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
7e57d5d8-d7d9-422b-80d6-332729215f05    Singularidade Temporal  Morte   4       Padrão  Curto   1 objeto Médio  Instantânea     Fortitude (se em uso)   0       Decompõe objeto totalmente.     2026-03-12 04:25:08.727415+00   +5 PE: Objeto Grande.   +10 PE: Objeto Enorme.  Sobrevivendo ao Horror  \N      \N      \N
3fec141e-c451-40f6-b8ff-650450bba29b    Alterar Memória Conhecimento    4       Padrão  Curto   1 pessoa        Permanente      Vontade anula   0       Apaga/modifica memória dos últimos 5 min.       2026-03-12 04:25:08.727415+00   +5 PE: Memória de 1 dia. Requer afinidade.      +10 PE: Memória de qualquer tempo. Requer afinidade.    Livro Base      \N      \N      \N
0a28aad3-fea6-40d4-993b-a483a3d94297    Controle Mental Conhecimento    4       Padrão  Curto   1 pessoa        Cena    Vontade anula   0       Alvo sob controle total. Ordens suicidas permitem novo teste.   2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
88b650c5-f6b9-4f5d-bee1-1c3a9e60ac67    Possessão       Conhecimento    4       Padrão  Longo   1 pessoa        1 dia   Vontade anula   0       Assume corpo do alvo (usa Atrib Físicos dele). Morte de um prende mente no corpo novo.  2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
38913407-144b-42b3-9c3c-496d8ac926d2    Pronunciar Sigilo       Conhecimento    4       Padrão  Curto   1 ser   Variável        Vontade parcial 0       Esquecer (atordoa), Cegar (cegueira) ou Inexistir (some 1d4+1 rodadas). 2026-03-12 04:25:08.727415+00   +5 PE: Alcance extremo. +10 PE: Até 5 seres. Requer afinidade.  Sobrevivendo ao Horror  \N      \N      \N
a0e93d52-f9a7-4b8b-95e7-ff10969287af    Alterar Destino Energia 4       Reação  Pessoal Você    Instantânea     Nenhuma 0       Repete teste próprio ou força inimigo a repetir (escolhe resultado).    2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
a787f91f-fc8a-49d9-9f4e-d9d3734200a5    Teletransporte  Energia 4       Padrão  Toque   Até 5 seres voluntários Instantânea     Nenhuma 0       Teletransporte até 1.000km (Teste Ocultismo conforme conhecimento destino).     2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
495b0a7d-a638-4140-b9a0-9b96ecd4c223    Canalizar o Medo        Medo    4       Padrão  Toque   1 pessoa        Permanente até uso      Nenhuma 0       Transfere ritual conhecido para alvo conjurar 1x sem custo PE. PE máx conjurador diminui.       2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
8c0298e7-2267-4e98-90f3-fcd5324dd53d    Conhecendo o Medo       Medo    4       Padrão  Toque   1 pessoa        Instantânea     Vontade parcial 0       Falha: Sanidade 0 (enlouquece/vira criatura). Sucesso: 10d6 dano mental + apavorado.    2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
a09711e3-a393-4c3b-b9fe-3cc6f2bcc185    Presença do Medo        Medo    4       Padrão  Pessoal Emanação 9m raio        Sustentada      Vontade reduz à metade  0       5d8 dano mental + 5d8 dano Medo. Falha: atordoado 1 rodada.     2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
f7807a46-4931-4bc0-a47d-fbc611c6edff    Eletrocussão    Energia 1       Padrão  Curto   1 ser ou objeto Instantânea     Fortitude parcial       0       Causa 3d6 de dano de eletricidade e vulnerabilidade. Dobro de dano em eletrônicos.      2026-03-12 04:25:08.727415+00   +2 PE: Área linha 30m, dano 6d6. Requer 2º círculo.     +5 PE: Alvos escolhidos, dispara relâmpagos (8d6 cada). Requer 3º círculo.      Livro Base      \N      \N      \N
79ed3667-3d36-4ce6-a3cb-709ecbb262f7    Cinerária       Medo    1       Padrão  Curto   Nuvem 6m raio   Cena    Nenhuma 0       Rituais na área têm DT +5.      2026-03-12 04:25:08.727415+00   +2 PE: Rituais na área custam -2 PE.    +5 PE: Rituais na área causam dano maximizado.  Livro Base      \N      \N      \N
4004120e-76d3-45f6-9825-5e03014ed88d    Aprimorar Físico        Sangue  2       Padrão  Toque   1 ser   Cena    Nenhuma 0       Fornece +1 em Agilidade ou Força.       2026-03-12 04:25:08.727415+00   +3 PE: Bônus +2. Requer 3º círculo.     +7 PE: Bônus +3. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
31b3170e-34c5-45c8-8689-73ca3f67baf4    Flagelo de Sangue       Sangue  2       Padrão  Toque   1 pessoa        Cena    Fortitude parcial       0       Marca causa 10d6 de dano e enjoo se desobedecer ordem. Sucesso reduz dano e evita enjoo.        2026-03-12 04:25:08.727415+00   +3 PE: Alvo 1 ser (exceto Sangue). Requer 3º círculo.   +7 PE: Duração 1 dia. Requer 4º círculo e afinidade.    Livro Base      \N      \N      \N
9cf471b5-edf5-4ee6-afde-fe67feda8104    Transfusão Vital        Sangue  2       Padrão  Toque   1 ser   Instantânea     Nenhuma 0       Transfere até 20 PV do conjurador para o alvo.  2026-03-12 04:25:08.727415+00   +3 PE: Transfere até 50 PV. Requer 3º círculo.  +7 PE: Transfere até 100 PV. Requer 4º círculo. Livro Base      \N      \N      \N
aa5c4e63-cfbe-4f91-9133-906f80add876    Sede de Adrenalina      Sangue  2       Reação  Pessoal Você    Instantânea     Nenhuma 0       Repete Acrobacia/Atletismo com Presença OU reduz dano impacto em 20 (fica atordoado).   2026-03-12 04:25:08.727415+00   +3 PE: Redução dano impacto 40. +7 PE: Redução dano impacto 70. Requer 4º círculo e afinidade.  Sobrevivendo ao Horror  \N      \N      \N
48050bf2-9ff7-4f6e-987b-9eed96f6ef9a    Velocidade Mortal       Morte   2       Padrão  Curto   1 ser   Sustentada      Nenhuma 0       Alvo recebe ação de movimento adicional (não para rituais).     2026-03-12 04:25:08.727415+00   +3 PE: Recebe ação padrão adicional.    +7 PE: Alvos escolhidos. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
8d7f3fed-649f-410b-aa34-05a2843e7d0f    Esconder dos Olhos      Conhecimento    2       Livre   Pessoal Você    1 rodada        Vontade desacredita     0       Invisibilidade (+15 Furtividade). Ataque/ação hostil anula.     2026-03-12 04:25:08.727415+00   +3 PE: Duração sustentada. Esfera 3m (aliados invisíveis). Requer 3º círculo.   +7 PE: Execução padrão, alcance toque, alvo 1 ser, sustentada. Ataque não anula. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
308f09cc-ffdf-42e5-a780-0931d04b4f22    Aurora da Verdade       Conhecimento    2       Padrão  Curto   Esfera 3m raio  Sustentada      Vontade parcial 0       Obriga verdade e revela invisíveis. Sucesso permite mentir (perceptível).       2026-03-12 04:25:08.727415+00   +3 PE: Alcance médio, raio 9m, conjurador imune.        +7 PE: Alcance longo, duração cena, ouve tudo na área. Requer 4º círculo e afinidade.   Sobrevivendo ao Horror  \N      \N      \N
29d4a8a1-060f-4292-bc42-16cfe2ea227e    Invólucro de Carne      Sangue  4       Padrão  Curto   \N      Cena    Nenhuma 0       1 clone seu     2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
c45bc930-3484-48c4-a4d4-93c87873e6fd    Ódio Incontrolável      Sangue  1       Padrão  Toque   1 pessoa        Cena    Nenhuma 1       Alvo recebe +2 ataque/dano corpo a corpo e RD 5 física. Deve atacar e não pode concentrar.      2026-03-12 04:25:08.727415+00   +2 PE: Ataque corpo a corpo adicional na ação agredir.  +5 PE: Bônus +5, sofre apenas metade do dano físico. Requer 3º círculo e afinidade.     Livro Base      \N      \N      \N
e478925a-e2d1-46e3-95d1-a2751b76f8da    Tremeluzir      Energia 2       Padrão  Pessoal Você    Sustentada      Nenhuma 0       Atravessa sólidos (25% falha). Sofre 1d4 dano Energia/rodada.   2026-03-12 04:25:08.727415+00   +3 PE: Alcance toque, alvo 1 ser voluntário.    +7 PE: Alcance curto, até 5 seres voluntários. Requer 4º círculo.       Sobrevivendo ao Horror  \N      \N      \N
28e456cd-71f6-47b3-bd2e-0f7f53baa1ee    Proteção contra Rituais Medo    2       Padrão  Toque   1 ser   Cena    Nenhuma 0       Alvo recebe resistência a dano paranormal 10 e +5 em testes contra rituais.     2026-03-12 04:25:08.727415+00   +3 PE: Resistência 20 e +10 em testes.  +6 PE: Resistência 30 e +15 em testes. Requer afinidade.        Livro Base      \N      \N      \N
0a77dc61-a9e9-419b-bc15-8750f368b684    Rejeitar Névoa  Medo    2       Padrão  Curto   Nuvem 6m raio   Cena    Nenhuma 0       Rituais na área custam +2 PE/círculo e execução aumenta 1 passo. Anula Cinerária.       2026-03-12 04:25:08.727415+00   +2 PE: DT contra rituais na área diminui -5.    +5 PE: Dano de rituais na área é sempre mínimo. Livro Base      \N      \N      \N
865af9bc-affc-4fc1-8166-0658950e280b    Ferver Sangue   Sangue  3       Padrão  Curto   1 ser   Sustentada      Fortitude parcial       0       Sangue ferve: 4d8 dano e fraco. Sucesso reduz dano e evita fraco. 2 sucessos anulam.    2026-03-12 04:25:08.727415+00   \N      +4 PE: Alvos escolhidos. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
5527c101-a7f3-472a-b545-e5e9721dd558    Vomitar Pestes  Sangue  3       Padrão  Médio   \N      Sustentada      Reflexos reduz à metade 0       1 enxame Grande 2026-03-12 04:25:08.727415+00   +2 PE: Falha no Reflexos deixa agarrado.        +5 PE: Enxame Enorme, voo 18m.  Livro Base      \N      \N      \N
9ebfb49a-afbc-480a-a3ba-225e61c9b929    Odor da Caçada  Sangue  3       Padrão  Pessoal Você    Cena    Nenhuma 0       Faro, +5 Atletismo em perseguições, sem perda PV por esforço extra. Fome/sede após cena.        2026-03-12 04:25:08.727415+00   +4 PE: Alcance toque, alvo 1 ser.       +9 PE: Alcance curto, até 5 seres. Requer afinidade.    Sobrevivendo ao Horror  \N      \N      \N
a9d9640b-8cd1-4e38-a283-6412ac45a928    Poeira da Podridão      Morte   3       Padrão  Médio   Nuvem 6m raio   Sustentada      Fortitude reduz à metade        0       Causa 4d8 dano Morte. Falha impede recuperar PV por 1 rodada.   2026-03-12 04:25:08.727415+00   \N      +4 PE: Dano 4d8+16.     Livro Base      \N      \N      \N
0d5620b0-e994-4647-831c-38f03804e5a6    Tentáculos de Lodo      Morte   3       Padrão  Médio   Esfera 6m raio  Sustentada      Nenhuma 0       Teste manobra agarrar (Ocultismo) contra alvos. Sucesso agarra/esmaga (4d6 dano). Terreno difícil.      2026-03-12 04:25:08.727415+00   \N      +5 PE: Raio 9m, dano 6d6.       Livro Base      \N      \N      \N
d1aeee8e-37fd-45c8-9e08-33236e422f06    Fedor Pútrido   Morte   3       Padrão  Pessoal Você    Sustentada      Nenhuma 0       Cheiro de cadáver: +5 Furtividade, +10 Enganação (fingir morto). Sofre 1d4 dano Morte/rodada.   2026-03-12 04:25:08.727415+00   +4 PE: Alcance toque, alvo 1 ser voluntário.    +9 PE: Alcance curto, até 5 seres voluntários. Requer afinidade.        Sobrevivendo ao Horror  \N      \N      \N
abdbedf1-fcf0-4035-a728-0e8474c51ecb    Mergulho Mental Conhecimento    3       Padrão  Toque   1 pessoa        Sustentada      Vontade anula   0       Vasculha pensamentos. 1 pergunta/rodada. Alvo sabe que foi invadido.    2026-03-12 04:25:08.727415+00   +3 PE: Alvo não percebe invasão. Requer 4º círculo.     +7 PE: Pode alterar um pensamento/memória. Requer 4º círculo e afinidade.       Livro Base      \N      \N      \N
de8c79fd-1d47-4193-9490-9374f0144931    Vidência        Conhecimento    3       Completa        Ilimitado       1 ser   Sustentada      Vontade anula   0       Vê/ouve alvo via superfície reflexiva. Bônus/penalidade conforme conhecimento do alvo.  2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
eeb68aa5-13ed-44a8-abe3-38faf827153c    Convocação Instantânea  Energia 3       Padrão  Ilimitado       1 objeto marcado        Instantânea     Nenhuma 0       Teletransporta objeto marcado (espaço 2) para sua mão.  2026-03-12 04:25:08.727415+00   +3 PE: Objeto espaço 5. Requer 4º círculo.      +7 PE: Objeto espaço 10. Requer 4º círculo e afinidade. Livro Base      \N      \N      \N
d08ded69-407c-4fa3-beb9-98cdc713d7ee    Salto Fantasma  Energia 3       Padrão  Médio   Você e até 5 seres      Instantânea     Nenhuma 0       Teletransporta alvos para ponto no alcance.     2026-03-12 04:25:08.727415+00   +4 PE: Alcance longo. Requer 4º círculo.        +9 PE: Alcance ilimitado (conhecer destino). Requer 4º círculo e afinidade.     Livro Base      \N      \N      \N
e5fb25b6-e35a-4b16-af67-18037f3d75ef    Purgatório      Sangue  4       Padrão  Médio   Esfera 9m raio  Cena    Fortitude parcial       0       Área sangue: vulnerável a dano. Sair causa 10d6 dano Sangue (Fortitude reduz).  2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
38e9a5c2-ce9b-4672-9665-738414f34664    Âncora Temporal Morte   4       Padrão  Médio   1 ser   Cena    Vontade anula   0       Impede alvo de se afastar >9m do ponto. Teletransporte exige Vontade.   2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
6aa18a24-929d-476b-8b60-ca2def3da0a9    Fim Inevitável  Morte   4       Completa        Extremo \N      4 rodadas       Fortitude parcial       0       Buraco negro 1,5m       2026-03-12 04:25:08.727415+00   +5 PE: 5 rodadas, conjurador imune. Requer afinidade.   +10 PE: 6 rodadas, alvos escolhidos imunes. Requer afinidade.   Livro Base      \N      \N      \N
f2ec12e2-deef-477c-9910-325438873a53    Inexistir       Conhecimento    4       Padrão  Toque   1 ser   Instantânea     Vontade parcial 0       10d12+10 dano Conhecimento. Se 0 PV, apagado da existência. Sucesso: 2d12 dano + debilitado.    2026-03-12 04:25:08.727415+00   +5 PE: 15d12+15 dano.   +10 PE: 20d12+20 dano. Requer afinidade.        Livro Base      \N      \N      \N
78c9f7da-51d0-44ad-b423-40544643ebfb    Deflagração de Energia  Energia 4       Completa        Pessoal Explosão 15m raio       Instantânea     Fortitude parcial       0       3d10 x 10 dano Energia. Eletrônicos quebram. Sucesso: metade dano e itens voltam 1d4 rodadas.   2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
57d2c9a5-4c4a-4156-9ca2-8db9186cb697    Canalizar o Medo        Medo    4       Padrão  Toque   1 pessoa        Permanente até uso      Nenhuma 0       Transfere ritual conhecido para alvo conjurar 1x sem custo PE. PE máx conjurador diminui.       2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
b5c9e8f3-7cd0-4308-8684-4a9500276d9b    Conhecendo o Medo       Medo    4       Padrão  Toque   1 pessoa        Instantânea     Vontade parcial 0       Falha: Sanidade 0 (enlouquece/vira criatura). Sucesso: 10d6 dano mental + apavorado.    2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
55ef30f3-57d4-47f7-b7db-27ba4aa93fa0    Presença do Medo        Medo    4       Padrão  Pessoal Emanação 9m raio        Sustentada      Vontade reduz à metade  0       5d8 dano mental + 5d8 dano Medo. Falha: atordoado 1 rodada.     2026-03-12 04:25:08.727415+00   \N      \N      Livro Base      \N      \N      \N
33fcf2b2-1c54-495b-9da8-6f7242282e0d    Miasma Entrópico        Morte   2       Padrão  Medio   nuvem com 6m de raio    Instântanea     Fortitude Parcial       0       Cria uma explosão de emanações tóxicas. Seres na área sofrem 4d8 pontos de dano químico e ficam enjoados por 1 rodada. Se passarem na resistência, sofrem metade do dano e não ficam enjoados.  2026-03-12 14:52:41.895303+00   (+3 PE): muda o dano para 6d8 de Morte. (+7 PE): muda a duração para 3 rodadas. Um ser que inicie seu turno dentro da área sofre o dano novamente. Requer 3º círculo.   Livro Base      \N      \N      \N
\.


--
-- Data for Name: trilhas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trilhas (id, classe_id, nome, fonte, habilidades, created_at) FROM stdin;
67914b3c-6ecb-46a8-90cf-5291702dcf5e    a82dded1-633e-4330-ad2e-669f5e53dde8    Aniquilador     Livro Base      [{"nex": "10%", "nome": "A Favorita", "descricao": "Escolha uma arma favorita; sua categoria é reduzida em I."}, {"nex": "40%", "nome": "Técnica Secreta", "descricao": "Categoria da arma favorita reduzida em II. Gaste 2 PE para efeitos Amplo ou Destruidor."}, {"nex": "65%", "nome": "Técnica Sublime", "descricao": "Adiciona efeitos Letal (+2 margem ameaça) e Perfurante (ignora 5 RD) à Técnica Secreta."}, {"nex": "99%", "nome": "Máquina de Matar", "descricao": "Categoria reduzida em III, +2 na margem de ameaça e +1 dado de dano."}] 2026-03-12 03:58:08.897878+00
5bbaeec4-06c8-4cae-8982-0c15d163e415    a82dded1-633e-4330-ad2e-669f5e53dde8    Comandante de Campo     Livro Base      [{"nex": "10%", "nome": "Inspirar Confiança", "descricao": "Gaste reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste."}, {"nex": "40%", "nome": "Estrategista", "descricao": "Gaste ação padrão e 1 PE por aliado para dar uma ação de movimento adicional no próximo turno deles."}, {"nex": "65%", "nome": "Brecha na Guarda", "descricao": "Gaste reação e 2 PE para permitir ataque adicional contra inimigo que sofreu dano de aliado. Alcance de habilidades aumenta para Médio."}, {"nex": "99%", "nome": "Oficial Comandante", "descricao": "Gaste ação padrão e 5 PE para dar ação padrão adicional a todos os aliados em alcance médio."}]  2026-03-12 03:58:08.897878+00
155910ef-19d6-4759-a510-0290c9dcfcdb    a82dded1-633e-4330-ad2e-669f5e53dde8    Guerreiro       Livro Base      [{"nex": "10%", "nome": "Técnica Letal", "descricao": "Recebe +2 na margem de ameaça com todos os ataques corpo a corpo."}, {"nex": "40%", "nome": "Revidar", "descricao": "Sempre que bloquear, gaste reação e 2 PE para fazer um ataque corpo a corpo no agressor."}, {"nex": "65%", "nome": "Força Opressora", "descricao": "Gaste 1 PE para realizar manobra derrubar ou empurrar como ação livre após acerto corpo a corpo."}, {"nex": "99%", "nome": "Potência Máxima", "descricao": "Bônus numéricos do Ataque Especial são dobrados para armas corpo a corpo."}]        2026-03-12 03:58:08.897878+00
d2ab19a6-3416-45f7-a25f-fd3d4bd65323    a82dded1-633e-4330-ad2e-669f5e53dde8    Operações Especiais     Livro Base      [{"nex": "10%", "nome": "Iniciativa Aprimorada", "descricao": "+5 em Iniciativa e ação de movimento adicional na primeira rodada."}, {"nex": "40%", "nome": "Ataque Extra", "descricao": "Uma vez por rodada, gaste 2 PE para fazer um ataque adicional."}, {"nex": "65%", "nome": "Surto de Adrenalina", "descricao": "Uma vez por rodada, gaste 5 PE para realizar ação padrão ou de movimento adicional."}, {"nex": "99%", "nome": "Sempre Alerta", "descricao": "Recebe uma ação padrão adicional no início de cada cena de combate."}]     2026-03-12 03:58:08.897878+00
c262f1cb-8336-45ab-816a-110a6d897ded    a82dded1-633e-4330-ad2e-669f5e53dde8    Tropa de Choque Livro Base      [{"nex": "10%", "nome": "Casca Grossa", "descricao": "+1 PV para cada 5% de NEX e soma Vigor na RD de bloqueio."}, {"nex": "40%", "nome": "Cai Dentro", "descricao": "Gaste reação e 1 PE para forçar inimigo a atacar você em vez de aliado (Vontade DT Vigor evita)."}, {"nex": "65%", "nome": "Duro de Matar", "descricao": "Gaste reação e 2 PE para reduzir dano não paranormal à metade. NEX 85%+ afeta dano paranormal."}, {"nex": "99%", "nome": "Inquebrável", "descricao": "Machucado: +5 Defesa e RD 5. Morrendo: não fica indefeso e pode agir."}]  2026-03-12 03:58:08.897878+00
d4f56e03-67cb-4287-aa0e-cfd599fdadfa    a82dded1-633e-4330-ad2e-669f5e53dde8    Agente Secreto  Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Carteirada", "descricao": "Treinado em Diplomacia ou Enganação. Recebe documentos com privilégios jurídicos especiais."}, {"nex": "40%", "nome": "O Sorriso", "descricao": "+2 em Diplomacia e Enganação. Gaste 2 PE para repetir teste de uma dessas perícias."}, {"nex": "65%", "nome": "Método Investigativo", "descricao": "Urgência de investigação aumenta em 1 rodada. Gaste 2 PE para anular evento de investigação."}, {"nex": "99%", "nome": "Multifacetado", "descricao": "Gaste 5 Sanidade para receber habilidades de até NEX 65% de outra trilha de combatente ou especialista até o fim da cena."}]     2026-03-12 03:58:08.897878+00
e1c4017b-c53f-4a97-a74c-ba8ae0450bb0    a82dded1-633e-4330-ad2e-669f5e53dde8    Caçador Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Rastrear o Paranormal", "descricao": "Treinado em Sobrevivência. Usa Sobrevivência no lugar de Ocultismo para identificar criaturas e Investigação/Percepção para rastros paranormais."}, {"nex": "40%", "nome": "Estudar Fraquezas", "descricao": "Gaste ação de interlúdio estudando pista de um ser para receber informação útil e +1 em testes contra ele."}, {"nex": "65%", "nome": "Atacar das Sombras", "descricao": "Pode se mover em deslocamento normal em Furtividade. Penalidade por atacar com arma silenciosa reduzida para -0."}, {"nex": "99%", "nome": "Estudar a Presa", "descricao": "Pode transformar um ser em sua 'presa'. Recebe +5 em testes, +1 na margem/crítico e RD 5 contra ele."}]       2026-03-12 03:58:08.897878+00
1d961a00-a8f1-4a79-9e81-d2fe86fcf9eb    a82dded1-633e-4330-ad2e-669f5e53dde8    Monstruoso      Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Ser Amaldiçoado", "descricao": "Treinado em Ocultismo. Escolha um elemento para etapa ritualística diária para receber resistências e bônus específicos."}, {"nex": "40%", "nome": "Ser Macabro", "descricao": "RD do elemento aumenta para 10. Recebe habilidades adicionais (ex: recuperar PV com Força ou usar Int como atributo de esforço)."}, {"nex": "65%", "nome": "Ser Assustador", "descricao": "RD aumenta para 15. Presença reduz em 1. Recebe arma natural de mordida ou bônus massivos em testes."}, {"nex": "99%", "nome": "Ser Aterrorizante", "descricao": "RD aumenta para 20. Torna-se criatura paranormal. Efeitos da etapa ritualística tornam-se permanentes. Aprende rituais poderosos."}]      2026-03-12 03:58:08.897878+00
724e12ae-0b16-4a94-8d38-cf14cf66b86a    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Atirador de Elite       Livro Base      [{"nex": "10%", "nome": "Mira de Elite", "descricao": "Proficiência com armas de fogo de balas longas e soma Intelecto no dano."}, {"nex": "40%", "nome": "Disparo Letal", "descricao": "Ao Mirar, gaste 1 PE para +2 na margem de ameaça até o fim do próximo turno."}, {"nex": "65%", "nome": "Disparo Impactante", "descricao": "Gaste 2 PE para realizar manobra (derrubar, desarmar, empurrar, quebrar) em vez de dano."}, {"nex": "99%", "nome": "Atirar para Matar", "descricao": "Acerto crítico com arma de fogo causa dano máximo."}] 2026-03-12 03:58:08.905007+00
002a9a4e-e783-4009-acc9-41ffbfd20f33    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Infiltrador     Livro Base      [{"nex": "10%", "nome": "Ataque Furtivo (+1d6)", "descricao": "Gaste 1 PE para +1d6 de dano contra alvos desprevenidos ou flanqueados."}, {"nex": "40%", "nome": "Gatuno, Ataque Furtivo (+2d6)", "descricao": "+5 em Atletismo e Crime. Ataque Furtivo aumenta para +2d6."}, {"nex": "65%", "nome": "Assassinar, Ataque Furtivo (+3d6)", "descricao": "Gaste ação de movimento e 3 PE para analisar alvo; dobra dados de Ataque Furtivo. Aumenta para +3d6."}, {"nex": "99%", "nome": "Sombra Fugaz, Ataque Furtivo (+4d6)", "descricao": "Gaste 3 PE para ignorar penalidade de Furtividade após atacar. Aumenta para +4d6."}]        2026-03-12 03:58:08.905007+00
7a48cdc1-8447-4cd5-ae67-1aeca1c9a90f    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Médico de Campo Livro Base      [{"nex": "10%", "nome": "Paramédico", "descricao": "Gaste ação padrão e 2 PE para curar 2d10 PV."}, {"nex": "40%", "nome": "Equipe de Trauma", "descricao": "Gaste ação padrão e 2 PE para remover condição negativa de aliado adjacente."}, {"nex": "65%", "nome": "Resgate", "descricao": "Aproxima-se de aliado machucado como ação livre; concede +5 na Defesa ao curar."}, {"nex": "99%", "nome": "Reanimação", "descricao": "Uma vez por cena, gaste ação completa e 10 PE para ressuscitar aliado morto na mesma cena."}]        2026-03-12 03:58:08.905007+00
449602cd-d87f-41d5-a932-b2485dc8c176    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Negociador      Livro Base      [{"nex": "10%", "nome": "Eloquência", "descricao": "Gaste ação completa e 1 PE/alvo para fascinar alvos."}, {"nex": "40%", "nome": "Discurso Motivador", "descricao": "Gaste ação padrão e 4 PE para dar +5 em testes de perícia a aliados em alcance curto."}, {"nex": "65%", "nome": "Eu Conheço um Cara", "descricao": "Uma vez por missão, aciona rede de contatos para obter informação ou item de categoria até III."}, {"nex": "99%", "nome": "Truque de Mestre", "descricao": "Gaste 5 PE para simular efeito de qualquer habilidade de aliado vista na cena."}]        2026-03-12 03:58:08.905007+00
f0e9fef2-31e2-4d08-8d31-a632cb1c6e9b    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Técnico Livro Base      [{"nex": "10%", "nome": "Inventário Otimizado", "descricao": "Soma Intelecto à Força para capacidade de carga."}, {"nex": "40%", "nome": "Remendão", "descricao": "Gaste ação completa e 1 PE para remover condição quebrado. Itens gerais têm categoria reduzida em I."}, {"nex": "65%", "nome": "Improvisar", "descricao": "Gaste ação completa e 2 PE (+2/categoria) para criar versão funcional de item geral."}, {"nex": "99%", "nome": "Preparado para Tudo", "descricao": "Gaste ação de movimento e 3 PE/categoria para 'encontrar' qualquer item na bolsa."}]  2026-03-12 03:58:08.905007+00
94e538d2-f923-4333-bb9a-fb99840e0a49    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Bibliotecário   Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Conhecimento Prático", "descricao": "Gaste 2 PE para mudar o atributo-base de uma perícia para Intelecto."}, {"nex": "40%", "nome": "Leitor Contumaz", "descricao": "Bônus de ler aumenta para 1d8. Pode gastar 2 PE para aumentar para 2d8."}, {"nex": "65%", "nome": "Rato de Biblioteca", "descricao": "Em local com livros, gaste rodada e 2 PE para benefícios de ler ou revisar caso."}, {"nex": "99%", "nome": "A Força do Saber", "descricao": "Intelecto aumenta em +1 e soma no total de PE. Muda atributo de uma perícia para Int permanentemente."}]       2026-03-12 03:58:08.905007+00
9887024a-9f94-4ed8-aea4-f13e448da703    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Perseverante    Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Soluções Improvisadas", "descricao": "Gaste 2 PE para rolar novamente 1 dado de um teste recém-realizado."}, {"nex": "40%", "nome": "Fuga Obstinada", "descricao": "+5 em testes para fugir. Em perseguição como presa, pode acumular até 4 falhas."}, {"nex": "65%", "nome": "Determinação Inquestionável", "descricao": "Uma vez por cena, gaste 5 PE e ação padrão para remover condição de medo, mental ou paralisia."}, {"nex": "99%", "nome": "Só Mais um Passo...", "descricao": "Uma vez por rodada, se cair a 0 PV, gaste 5 PE para ficar com 1 PV (exceto dano massivo)."}]  2026-03-12 03:58:08.905007+00
99e822f9-5851-4459-87de-d445b91feaa8    cdcb2636-9b3f-4eb9-b83c-97c7be49d835    Muambeiro       Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Mascate", "descricao": "Treinado em Profissão (armeiro, engenheiro ou químico) e +5 na capacidade de carga."}, {"nex": "40%", "nome": "Fabricação Própria", "descricao": "Leva metade do tempo para fabricar itens mundanos. Fabrica dois consumíveis por ação."}, {"nex": "65%", "nome": "Laboratório de Campo", "descricao": "+5 em Profissão escolhida. Pode fabricar e consertar itens paranormais em campo."}, {"nex": "99%", "nome": "Achado Conveniente", "descricao": "Gaste ação completa e 5 PE para 'produzir' item de categoria até III até o fim da cena."}]      2026-03-12 03:58:08.905007+00
9f6dc93b-e354-490b-810d-03dc8ad70640    5882ea7c-0fa6-479d-a327-27423b19772c    Conduíte        Livro Base      [{"nex": "10%", "nome": "Ampliar Ritual", "descricao": "Gaste +2 PE para aumentar alcance em um passo ou dobrar área de efeito."}, {"nex": "40%", "nome": "Acelerar Ritual", "descricao": "Uma vez por rodada, gaste +4 PE para conjurar ritual como ação livre."}, {"nex": "65%", "nome": "Anular Ritual", "descricao": "Gaste PE igual ao custo do ritual alvo e vença teste oposto de Ocultismo para anulá-lo."}, {"nex": "99%", "nome": "Canalizar o Medo", "descricao": "Aprende o ritual Canalizar o Medo."}]     2026-03-12 03:58:08.909726+00
6e063e24-2457-498e-aa0f-98481aac6dba    5882ea7c-0fa6-479d-a327-27423b19772c    Flagelador      Livro Base      [{"nex": "10%", "nome": "Poder do Flagelo", "descricao": "Pode pagar custo de PE com PV (2 PV por 1 PE)."}, {"nex": "40%", "nome": "Abraçar a Dor", "descricao": "Sempre que sofrer dano não paranormal, gaste reação e 2 PE para reduzir à metade."}, {"nex": "65%", "nome": "Absorver Agonia", "descricao": "Sempre que reduz inimigo a 0 PV com ritual, recupera PE igual ao círculo do ritual."}, {"nex": "99%", "nome": "Medo Tangível", "descricao": "Aprende o ritual Medo Tangível."}]  2026-03-12 03:58:08.909726+00
33347cbc-6136-4ab1-b667-d73b8f120457    5882ea7c-0fa6-479d-a327-27423b19772c    Graduado        Livro Base      [{"nex": "10%", "nome": "Saber Ampliado", "descricao": "Aprende um ritual adicional por círculo. Não conta no limite de rituais."}, {"nex": "40%", "nome": "Grimório Ritualístico", "descricao": "Aprende rituais extras (igual Int). Precisa folhear grimório para conjurá-los."}, {"nex": "65%", "nome": "Rituais Eficientes", "descricao": "A DT para resistir aos seus rituais aumenta em +5."}, {"nex": "99%", "nome": "Conhecendo o Medo", "descricao": "Aprende o ritual Conhecendo o Medo."}]   2026-03-12 03:58:08.909726+00
13738c46-d395-4479-8894-cb5c539f6320    5882ea7c-0fa6-479d-a327-27423b19772c    Intuitivo       Livro Base      [{"nex": "10%", "nome": "Mente Sã", "descricao": "Recebe +5 em testes de resistência contra efeitos paranormais."}, {"nex": "40%", "nome": "Presença Poderosa", "descricao": "Adiciona Presença ao limite de PE por turno apenas para conjurar rituais."}, {"nex": "65%", "nome": "Inabalável", "descricao": "RD mental e paranormal 10. Se passar em teste de Vontade, não sofre dano."}, {"nex": "99%", "nome": "Presença do Medo", "descricao": "Aprende o ritual Presença do Medo."}]       2026-03-12 03:58:08.909726+00
70bd491c-6ac0-4cc8-ab62-a5ce11fb017f    5882ea7c-0fa6-479d-a327-27423b19772c    Lâmina Paranormal       Livro Base      [{"nex": "10%", "nome": "Lâmina Maldita", "descricao": "Aprende Amaldiçoar Arma. Pode usar Ocultismo para ataques com a arma amaldiçoada."}, {"nex": "40%", "nome": "Gladiador Paranormal", "descricao": "Acerto corpo a corpo concede 2 PE temporários."}, {"nex": "65%", "nome": "Conjuração Marcial", "descricao": "Ao lançar ritual, gaste 2 PE para fazer um ataque corpo a corpo como ação livre."}, {"nex": "99%", "nome": "Lâmina do Medo", "descricao": "Aprende o ritual Lâmina do Medo."}]   2026-03-12 03:58:08.909726+00
b290e0dc-d1d7-4b75-95df-bef2ce5fdc71    5882ea7c-0fa6-479d-a327-27423b19772c    Exorcista       Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Revelação do Mal", "descricao": "Treinado em Religião. Pode usar Religião no lugar de Investigação e Percepção para traços paranormais."}, {"nex": "40%", "nome": "Poder da Fé", "descricao": "Veterano em Religião. Gaste 2 PE para repetir teste de resistência usando Religião."}, {"nex": "65%", "nome": "Parareligiosidade", "descricao": "Gaste +2 PE no ritual para adicionar efeito de um catalisador ritualístico à escolha."}, {"nex": "99%", "nome": "Chagas da Resistência", "descricao": "Se Sanidade cair a 0, gaste 10 PV para ficar com 1 SAN."}]      2026-03-12 03:58:08.909726+00
e7cea3fb-6d55-40ac-87c7-4896b13fea2a    5882ea7c-0fa6-479d-a327-27423b19772c    Possuído        Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Poder Não Desejado", "descricao": "Recebe Transcender em vez de poder de classe. Ganha Pontos de Possessão (PP) para curar PV ou PE."}, {"nex": "40%", "nome": "As Sombras Dentro de Mim", "descricao": "Recuperação de PP aumenta. Gaste 2 PE para +5 em Acrobacia, Atletismo e Furtividade."}, {"nex": "65%", "nome": "Ele Me Ensina", "descricao": "Escolha entre Transcender ou o primeiro poder de uma trilha de ocultista que não a sua."}, {"nex": "99%", "nome": "Tornamo-nos Um", "descricao": "Recebe um 'Presente' poderoso baseado no elemento de afinidade (Sangue, Morte, Conhecimento ou Energia)."}]   2026-03-12 03:58:08.909726+00
97ed50c9-ca0f-427f-941a-010ecf2de1f1    5882ea7c-0fa6-479d-a327-27423b19772c    Parapsicólogo   Sobrevivendo ao Horror  [{"nex": "10%", "nome": "Terapia", "descricao": "Usa Profissão (psicólogo) como Diplomacia. Gaste 2 PE para usar Profissão no lugar de teste de resistência mental falho."}, {"nex": "40%", "nome": "Palavras-chave", "descricao": "Ao acalmar, gaste PE para recuperar Sanidade do alvo (1 por 1)."}, {"nex": "65%", "nome": "Reprogramação Mental", "descricao": "Gaste 5 PE e ação de interlúdio para dar um poder temporário a um aliado voluntário."}, {"nex": "99%", "nome": "A Sanidade Está Lá Fora", "descricao": "Gaste ação de movimento e 5 PE para remover todas as condições de medo ou mentais de alvo adjacente."}]     2026-03-12 03:58:08.909726+00
29c17b4a-2146-406b-bec1-86f13557f342    307d335e-6217-44e2-8e9e-4e70b5048c7b    Durão   Sobrevivendo ao Horror  [{"nex": "Estágio 2", "nome": "Durão", "descricao": "Recebe +4 PV imediatos e +2 PV no próximo estágio."}, {"nex": "Estágio 4", "nome": "Pancada Forte", "descricao": "Gaste 1 PE para receber +5 no teste de ataque."}]        2026-03-12 03:58:08.913352+00
1ad829e2-a860-4a8d-89cf-77fa36b6f921    307d335e-6217-44e2-8e9e-4e70b5048c7b    Esperto Sobrevivendo ao Horror  [{"nex": "Estágio 2", "nome": "Esperto", "descricao": "Torna-se treinado em uma perícia adicional."}, {"nex": "Estágio 4", "nome": "Entendido", "descricao": "Escolha 2 perícias; gaste 1 PE para somar +1d4 no teste."}]       2026-03-12 03:58:08.913352+00
8915c5be-8d28-4180-bd98-46c9ea443ceb    307d335e-6217-44e2-8e9e-4e70b5048c7b    Esotérico       Sobrevivendo ao Horror  [{"nex": "Estágio 2", "nome": "Esotérico", "descricao": "Gaste ação padrão e 1 PE para sentir energias paranormais em alcance curto."}, {"nex": "Estágio 4", "nome": "Iniciado", "descricao": "Aprende e pode conjurar um ritual de 1º círculo."}]      2026-03-12 03:58:08.913352+00
\.


--
-- Name: campanha_membros campanha_membro_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_membros
    ADD CONSTRAINT campanha_membro_uniq UNIQUE (campanha_id, user_id);


--
-- Name: campanha_membros campanha_membros_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_membros
    ADD CONSTRAINT campanha_membros_pkey PRIMARY KEY (id);


--
-- Name: campanha_personagens campanha_personagem_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_personagens
    ADD CONSTRAINT campanha_personagem_uniq UNIQUE (campanha_id, personagem_id);


--
-- Name: campanha_personagens campanha_personagens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_personagens
    ADD CONSTRAINT campanha_personagens_pkey PRIMARY KEY (id);


--
-- Name: campanha_rolagens campanha_rolagens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_rolagens
    ADD CONSTRAINT campanha_rolagens_pkey PRIMARY KEY (id);


--
-- Name: campanhas campanhas_codigo_convite_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanhas
    ADD CONSTRAINT campanhas_codigo_convite_unique UNIQUE (codigo_convite);


--
-- Name: campanhas campanhas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanhas
    ADD CONSTRAINT campanhas_pkey PRIMARY KEY (id);


--
-- Name: classes classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);


--
-- Name: habilidades habilidades_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habilidades
    ADD CONSTRAINT habilidades_pkey PRIMARY KEY (id);


--
-- Name: itens itens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itens
    ADD CONSTRAINT itens_pkey PRIMARY KEY (id);


--
-- Name: origens origens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.origens
    ADD CONSTRAINT origens_pkey PRIMARY KEY (id);


--
-- Name: pericias pericias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pericias
    ADD CONSTRAINT pericias_pkey PRIMARY KEY (id);


--
-- Name: personagens personagens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personagens
    ADD CONSTRAINT personagens_pkey PRIMARY KEY (id);


--
-- Name: rituais rituais_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rituais
    ADD CONSTRAINT rituais_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: trilhas trilhas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trilhas
    ADD CONSTRAINT trilhas_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Sanitized placeholder users for referential integrity.
-- These satisfy FK constraints for personagens, campanha_membros, etc.
-- After restore, create real user accounts and update references as needed.
--
INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
VALUES
  ('2142da82-5a31-4209-b821-06af2c8a9bb6', 'admin@placeholder.local', 'Admin', 'User', 'admin', NOW(), NOW()),
  ('c7273c5e-8e85-4566-8a95-0bf90fdab8d9', 'player@placeholder.local', 'Player', 'User', 'user', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


--
-- Name: campanha_membros campanha_membros_campanha_id_campanhas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_membros
    ADD CONSTRAINT campanha_membros_campanha_id_campanhas_id_fk FOREIGN KEY (campanha_id) REFERENCES public.campanhas(id) ON DELETE CASCADE;


--
-- Name: campanha_membros campanha_membros_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_membros
    ADD CONSTRAINT campanha_membros_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: campanha_personagens campanha_personagens_campanha_id_campanhas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_personagens
    ADD CONSTRAINT campanha_personagens_campanha_id_campanhas_id_fk FOREIGN KEY (campanha_id) REFERENCES public.campanhas(id) ON DELETE CASCADE;


--
-- Name: campanha_personagens campanha_personagens_personagem_id_personagens_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_personagens
    ADD CONSTRAINT campanha_personagens_personagem_id_personagens_id_fk FOREIGN KEY (personagem_id) REFERENCES public.personagens(id) ON DELETE CASCADE;


--
-- Name: campanha_personagens campanha_personagens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_personagens
    ADD CONSTRAINT campanha_personagens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: campanha_rolagens campanha_rolagens_campanha_id_campanhas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_rolagens
    ADD CONSTRAINT campanha_rolagens_campanha_id_campanhas_id_fk FOREIGN KEY (campanha_id) REFERENCES public.campanhas(id) ON DELETE CASCADE;


--
-- Name: campanha_rolagens campanha_rolagens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campanha_rolagens
    ADD CONSTRAINT campanha_rolagens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: personagens personagens_classe_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personagens
    ADD CONSTRAINT personagens_classe_id_classes_id_fk FOREIGN KEY (classe_id) REFERENCES public.classes(id);


--
-- Name: personagens personagens_origem_id_origens_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personagens
    ADD CONSTRAINT personagens_origem_id_origens_id_fk FOREIGN KEY (origem_id) REFERENCES public.origens(id);


--
-- Name: personagens personagens_trilha_id_trilhas_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personagens
    ADD CONSTRAINT personagens_trilha_id_trilhas_id_fk FOREIGN KEY (trilha_id) REFERENCES public.trilhas(id);


--
-- Name: personagens personagens_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personagens
    ADD CONSTRAINT personagens_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: trilhas trilhas_classe_id_classes_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trilhas
    ADD CONSTRAINT trilhas_classe_id_classes_id_fk FOREIGN KEY (classe_id) REFERENCES public.classes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict bScHI51ivpSHzKza4YSVYfjhSf4gjjncIxqBlfTWGHL3OQZp2an2Gh3VSflJGvB


