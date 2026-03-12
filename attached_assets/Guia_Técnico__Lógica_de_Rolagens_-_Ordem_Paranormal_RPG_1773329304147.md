# Guia Técnico: Lógica de Rolagens - Ordem Paranormal RPG

Este documento descreve a lógica matemática e as regras de jogo para implementação das rolagens de dados no sistema de **Ordem Paranormal RPG**, integrando o **Livro Base (v1.3)** e o suplemento **Sobrevivendo ao Horror (v1.2)**.

---

## 1. A Mecânica Base: Testes de Atributo e Perícia

Diferente de sistemas como D&D, Ordem Paranormal usa uma reserva de dados baseada em **Atributos**.

### 1.1. Fórmula de Rolagem
Para realizar um teste, o jogador rola uma quantidade de dados de vinte faces (d20) igual ao valor do **Atributo** correspondente à perícia ou ação. O resultado do teste é o **maior valor obtido** entre todos os dados rolados. A este valor, soma-se o **bônus fixo da perícia** (se houver).

- **Atributo 0:** Se o atributo for 0, o jogador rola **2d20** e escolhe o **menor** resultado. Esta é uma penalidade severa que representa a inaptidão do personagem na área.

**Cálculo:** `Resultado do Teste = Maior(Xd20) + Bônus de Perícia` (onde X é o valor do Atributo)

> **Exemplo:** Um personagem com **Agilidade 3** e **Pontaria +5** rola 3d20. Se os resultados forem [4, 12, 18], o maior valor é 18. O resultado final do teste é **18 + 5 = 23**.

### 1.2. Bônus de Perícia
O bônus de perícia é fixo e depende do nível de treinamento do personagem na perícia:
- **Não Treinado:** +0
- **Treinado:** +5
- **Veterano:** +10
- **Expert:** +15

### 1.3. Sucessos Automáticos e Críticos
- **20 Natural:** Se qualquer um dos dados rolados for um **20**, o teste é um **Sucesso Automático**, independentemente da Dificuldade do Teste (DT). Isso significa que a ação é bem-sucedida sem a necessidade de comparar com a DT.
- **Margem de Ameaça:** No combate, algumas armas possuem uma "Margem de Ameaça" (ex: 19/x2). Se qualquer dado rolado for igual ou maior que esse valor, e o ataque acertar a Defesa do alvo, o ataque é um **Acerto Crítico**.

---

## 2. Modificadores de Dados (+O e -O)

O sistema de Ordem Paranormal utiliza um sistema de bônus e penalidades que afetam a **quantidade de dados rolados**, em vez de modificar diretamente o resultado numérico.

| Modificador | Efeito no Sistema |
| :--- | :--- |
| **Bônus (+O)** | Adiciona +1d20 à rolagem. (Ex: Atributo 2 + 1O = rola 3d20, pega o maior). |
| **Penalidade (-O)** | Remove -1d20 da rolagem. (Ex: Atributo 3 - 1O = rola 2d20, pega o maior). |

**Regra de Atributo Negativo/Zero:** Se as penalidades reduzirem a quantidade de dados para menos de 1 (ou seja, 0 ou menos), aplica-se a lógica de **Atributo 0**: rolam-se **2d20** e escolhe-se o **menor** resultado. Cada penalidade adicional após a primeira que levaria a menos de 1 dado, adiciona mais um d20 a ser rolado, mas o resultado final continua sendo o **menor** entre todos os dados. Por exemplo, se o personagem tem Atributo 0 e sofre -1O, ele rola 3d20 e pega o menor.

---

## 3. Combate e Dano

### 3.1. Teste de Ataque
O teste de ataque determina se um golpe atinge o alvo. É um teste de perícia contra a Defesa do alvo.
- **DT (Dificuldade do Teste):** É a **Defesa** do alvo.
- **Cálculo:** `Resultado do Teste = Maior(Xd20) + Bônus de Perícia (Luta para corpo a corpo, Pontaria para à distância) + Modificadores`.
- Se o `Resultado do Teste` for igual ou maior que a `Defesa` do alvo, o ataque acerta e causa dano.

### 3.2. Rolagem de Dano
Quando um ataque acerta, rolam-se os dados de dano da arma ou habilidade.
- O dano **não** utiliza a regra de "pegar o maior". Somam-se **todos os resultados** dos dados indicados pela arma/ritual.
- **Força no Dano:** Para ataques corpo a corpo ou com armas de arremesso, o valor do atributo **Força** do atacante é somado ao dano total.
- **Tipos de Dano:** O sistema possui diversos tipos de dano (Balístico, Corte, Impacto, Perfuração, Fogo, Frio, Eletricidade, Mental, Paranormal - Sangue, Morte, Conhecimento, Energia). Criaturas e personagens podem ter resistências ou vulnerabilidades a tipos específicos de dano.

### 3.3. Acertos Críticos em Combate
Um acerto crítico ocorre quando o resultado de um dos d20s no teste de ataque é igual ou maior que a **Margem de Ameaça** da arma, e o ataque acerta a Defesa do alvo.
- **Multiplicador de Crítico:** Em caso de crítico, os **dados base** de dano da arma são multiplicados pelo valor do multiplicador (ex: x2, x3, x4). Bônus numéricos fixos e dados extras de dano (como os de habilidades como *Ataque Furtivo* ou rituais) **não** são multiplicados, a menos que a habilidade ou ritual especifique o contrário (ex: *Lancinante*).

> **Exemplo:** Uma arma com dano 1d8+3 e crítico x2. Em um acerto crítico, o dano se torna (1d8 * 2) + 3 = 2d8+3.

---

## 4. Testes de Resistência

Testes de resistência são feitos para resistir a efeitos de rituais, habilidades ou condições.
- **DT de Habilidades/Rituais:** A Dificuldade do Teste para resistir a uma habilidade ou ritual é calculada pela fórmula: `10 + Limite de PE do conjurador + Atributo Chave`.
    - O `Atributo Chave` é especificado na descrição da habilidade ou ritual (geralmente Vigor, Vontade ou Reflexos).
    - O `Limite de PE` é o valor máximo de Pontos de Esforço do personagem, que aumenta com o NEX.
- O sistema deve recalcular essa DT sempre que o personagem conjurador subir de **NEX** (que aumenta o limite de PE) ou tiver seu atributo chave alterado.

---

## 5. Novas Mecânicas do Suplemento Sobrevivendo ao Horror

O suplemento introduz mecânicas que afetam a forma como os testes são realizados e interpretados.

### 5.1. Cenas de Furtividade e Visibilidade
- **Grau de Visibilidade:** Introduz um conceito de 0 a 5, onde 0 é invisível e 5 é totalmente visível. O sistema deve rastrear este valor para cada personagem em cenas de furtividade.
- **Testes de Furtividade:** O sucesso ou falha em testes de Furtividade pode aumentar ou diminuir o Grau de Visibilidade. Ações chamativas (correr, atacar) aumentam a visibilidade automaticamente.
- **Lógica de Sistema:** O sistema deve considerar o Grau de Visibilidade dos agentes e a Percepção dos inimigos para determinar se um personagem é detectado.

### 5.2. Medo em Jogo (Substituindo Insanidade)
Esta regra opcional substitui as regras de Sanidade e Insanidade do livro base, focando em efeitos imediatos do medo.
- **Efeitos de Medo:** Quando a Sanidade de um personagem é reduzida a 0 por dano mental, ou quando ele sofre dano mental já estando com 0 de Sanidade, ele sofre um Efeito de Medo.
- **Rolagem:** O efeito é determinado rolando **2d10** em uma tabela específica (Tabela 2.2: Efeitos de Medo, p. 88 do suplemento).
- **Acúmulo:** Para cada vez adicional que o personagem sofre um Efeito de Medo na mesma cena, adiciona-se +1 à rolagem de 2d10 (ex: 2d10+1, 2d10+2), aumentando a chance de efeitos mais severos (como *Paralisia*, *Histeria* ou *Morte*).
- **Se Entregar para o Medo:** Uma vez por sessão, um personagem com 0 SAN pode escolher se entregar ao medo, rolando um segundo efeito de medo com +5 na rolagem, mas recuperando 1d4 SAN por nível na rodada seguinte e removendo condições de paralisia/inconsciência.

### 5.3. Perseguições
Perseguições são resolvidas como **Testes Estendidos**, onde o sucesso depende de acumular um certo número de sucessos antes de um número limite de falhas.
- **Lógica de Sistema:** O sistema deve contabilizar os sucessos e falhas dos testes de perícia (Atletismo, Acrobacia, Pilotagem, etc.) realizados pelos personagens durante a perseguição.
- **Condição de Sucesso/Falha:** Geralmente, requer **5 sucessos** antes de **3 falhas** para escapar ou alcançar o alvo. O mestre pode ajustar esses números para perseguições mais curtas ou longas.

---

## 6. Pseudocódigo para Implementação da Rolagem Base

```python
import random

def rolar_d20_ordem_paranormal(atributo_valor, bonus_pericia, modificadores_dados_o=0):
    """
    Simula a rolagem de dados no sistema Ordem Paranormal RPG.

    :param atributo_valor: Valor do atributo do personagem (e.g., 0, 1, 2, 3, 4, 5).
    :param bonus_pericia: Bônus fixo da perícia (e.g., 0, 5, 10, 15).
    :param modificadores_dados_o: Modificadores +O ou -O (e.g., 1 para +1O, -1 para -1O).
    :return: Um dicionário com o resultado final do teste, dados rolados e se houve sucesso automático.
    """
    
    qtd_dados_base = atributo_valor
    qtd_dados_total = qtd_dados_base + modificadores_dados_o

    resultados_d20 = []
    sucesso_automatico = False
    
    if qtd_dados_total > 0:
        # Rola a quantidade de dados e pega o maior
        for _ in range(qtd_dados_total):
            dado = random.randint(1, 20)
            resultados_d20.append(dado)
            if dado == 20: # Verifica sucesso automático
                sucesso_automatico = True
        
        resultado_base = max(resultados_d20)
    else:
        # Atributo 0 ou negativo: rola 2d20 + |modificadores_dados_o| e pega o menor
        # Cada -O adicional aumenta o número de dados a serem rolados, mas ainda pega o menor
        qtd_dados_penalidade = 2 + abs(qtd_dados_total) # Mínimo de 2 dados
        for _ in range(qtd_dados_penalidade):
            dado = random.randint(1, 20)
            resultados_d20.append(dado)
        
        resultado_base = min(resultados_d20)
        # Sucesso automático não se aplica a rolagens de menor resultado
        sucesso_automatico = False 

    resultado_final = resultado_base + bonus_pericia

    return {
        "resultado_final": resultado_final,
        "resultado_base_d20": resultado_base,
        "dados_rolados": resultados_d20,
        "sucesso_automatico": sucesso_automatico
    }

# Exemplo de uso:
# print(rolar_d20_ordem_paranormal(atributo_valor=3, bonus_pericia=5, modificadores_dados_o=0))
# print(rolar_d20_ordem_paranormal(atributo_valor=0, bonus_pericia=0, modificadores_dados_o=0))
# print(rolar_d20_ordem_paranormal(atributo_valor=2, bonus_pericia=10, modificadores_dados_o=1)) # +1O
# print(rolar_d20_ordem_paranormal(atributo_valor=1, bonus_pericia=5, modificadores_dados_o=-1)) # -1O
```

---

## 7. Tabelas de Referência para o DB

### Tabela de Dificuldade (DT) Padrão
| Dificuldade | DT Base |
| :--- | :--- |
| Fácil | 10 |
| Média | 15 |
| Difícil | 20 |
| Desafiadora | 25 |
| Impossível | 30 |

### Cálculo de DT para Habilidades e Rituais
- **DT:** `10 + Limite de PE do Conjurador + Atributo Chave`.
- **Nota:** O `Limite de PE` é determinado pelo NEX do personagem. O sistema deve ter uma tabela ou função para mapear NEX para Limite de PE.

---

## Referências

[1] Cellbit, Ramos, D., Della Corte, F., Dei Svaldi, G., Coimbra, P., Sala, S., & Dei Svaldi, R. (2024). *Ordem Paranormal RPG: Livro de Regras (v1.3)*. Jambô Editora.
[2] Lange, R., & Dei Svaldi, G. (2024). *Sobrevivendo ao Horror (v1.2)*. Jambô Editora.

## 8. Regras de Combate e Resistências

### 8.1. Defesa
A Defesa representa a dificuldade de acertar um personagem em combate. É calculada como `10 + Agilidade + Bônus de Proteção + Bônus de Escudo + Outros Modificadores` [1].
- Um ataque acerta se o resultado do teste de ataque for igual ou superior à Defesa do alvo.

### 8.2. Tipos de Dano e Resistências
O sistema possui diversos tipos de dano, e criaturas/personagens podem ter características específicas em relação a eles [1].

| Tipo de Dano | Descrição | Exemplos |
| :--- | :--- |
| **Balístico** | Projéteis arremessados ou disparados. | Balas, flechas. |
| **Corte** | Armas afiadas ou garras. | Espadas, facas, garras de monstros. |
| **Impacto** | Pancadas, quedas, esmagamento. | Socos, martelos, quedas. |
| **Perfuração** | Armas pontiagudas. | Lanças, flechas, ferrões. |
| **Fogo** | Chamas, calor intenso. | Incêndios, rituais de fogo. |
| **Frio** | Gelo, baixas temperaturas. | Rituais de frio, ambientes congelantes. |
| **Eletricidade** | Descargas elétricas. | Raios, choques. |
| **Mental** | Ataques psíquicos, estresse. | Habilidades de criaturas, rituais de Conhecimento. |
| **Paranormal** | Dano de origem paranormal, ligado aos elementos. | Rituais, ataques de Entidades (Sangue, Morte, Conhecimento, Energia). |

**Resistência a Dano (RD):** Ignora uma parte do dano sofrido. Se um personagem tem RD 5 contra corte e sofre 10 pontos de dano de corte, ele perde apenas 5 PV [1].
**Vulnerabilidade:** Sofre o dobro de dano de um tipo específico [1].
**Imunidade:** Não sofre dano de um tipo específico ou é imune a certas condições [1].

### 8.3. Ações de Combate
Durante uma rodada de combate, os personagens podem realizar diversas ações [1]:
- **Ação Padrão:** Permite um ataque, conjurar um ritual, usar uma habilidade, etc.
- **Ação de Movimento:** Permite se mover até o limite de deslocamento.
- **Ação Livre:** Ações rápidas que não consomem tempo significativo.
- **Reações:** Respostas a eventos específicos, como Bloqueio, Esquiva e Contra-ataque. Só é possível usar uma reação por rodada [1].

### 8.4. Dano Massivo
Se um personagem sofrer uma quantidade de dano igual ou maior que seu limite de PV em um único ataque, ele deve fazer um teste de Fortitude (DT 15 +2 para cada 10 pontos de dano sofridos). Se falhar, morre instantaneamente [1].

### 8.5. Condições
Condições afetam o desempenho do personagem em combate e outras situações. Exemplos incluem:
- **Abalado:** Penalidade em testes de Vontade [1].
- **Desprevenido:** Sofre -5 na Defesa e -5 em Reflexos [1].
- **Fraco:** Penalidade em testes de Força e Vigor [1].
- **Sangrando:** Sofre dano no início de cada turno [1].
- **Enjoado:** Penalidade em testes de Força, Agilidade e Vigor [1].

---

## Referências

[1] Cellbit, Ramos, D., Della Corte, F., Dei Svaldi, G., Coimbra, P., Sala, S., & Dei Svaldi, R. (2024). *Ordem Paranormal RPG: Livro de Regras (v1.3)*. Jambô Editora.
[2] Lange, R., & Dei Svaldi, G. (2024). *Sobrevivendo ao Horror (v1.2)*. Jambô Editora.
