# PRD — FlowQuote: Construtor Visual de Orçamentos com IA

> **Versão:** 1.0
> **Data:** 2026-03-10
> **Autor:** IT Valley
> **Status:** Draft

---

## 1. Visão do Produto

**FlowQuote** é uma plataforma SaaS que permite a qualquer empresa criar formulários inteligentes de orçamento de forma visual, usando arrastar e soltar, com bifurcações condicionais e geração automática de orçamentos por IA.

**Em uma frase:** *O admin desenha o fluxo, o cliente responde, a IA gera o orçamento.*

---

## 2. Problema

Empresas de serviço (eletricistas, encanadores, construtoras, instaladores) precisam de orçamentos rápidos e padronizados. Hoje elas:

- Fazem orçamentos manualmente por telefone ou WhatsApp
- Perdem leads por demora na resposta
- Não conseguem escalar o atendimento
- Cada orçamento exige conhecimento técnico do atendente

**FlowQuote resolve** colocando o cliente para responder um questionário visual e deixando a IA fazer o trabalho técnico.

---

## 3. Público-Alvo

### 3.1 Admin (Dono do negócio)
- Cria e edita o fluxo de perguntas visualmente
- Define bifurcações: "se resposta X, vá para pergunta Y"
- Configura o contexto de negócio para a IA
- Gerencia orçamentos gerados e leads de suporte
- Atualiza preços e regras sem mexer em código

### 3.2 Cliente Final (Consumidor)
- Acessa um link público
- Responde o questionário passo a passo
- Recebe o orçamento em segundos
- Faz download do orçamento em PDF/TXT

---

## 4. Funcionalidades

### 4.1 Builder Visual (Admin) — SvelteFlow

O coração do sistema. O admin constrói o fluxo de perguntas arrastando nós em um canvas visual.

#### Tipos de Nó

| Nó | Cor | Função |
|----|-----|--------|
| **Início** | Verde | Ponto de entrada do fluxo. Único por fluxo. |
| **Pergunta** | Azul | Uma pergunta ao cliente. Tipos: escolha única, sim/não, número, texto livre, múltipla escolha. |
| **Condição** | Amarelo | Bifurcação automática. Liga-se às arestas de saída conforme a resposta do nó anterior. |
| **Especialista** | Vermelho | Caminho de desvio. Exibe mensagem e salva o lead para contato humano. |
| **Orçamento (Fim)** | Roxo | Nó terminal. Dispara a IA para gerar o orçamento com base em todas as respostas coletadas. |
| **Mensagem** | Cinza | Exibe um texto informativo ao cliente sem esperar resposta. |

#### Arestas (Conexões)

- Cada aresta liga um nó ao próximo
- Arestas de saída de **Pergunta** ou **Condição** têm um **rótulo** que indica qual resposta leva àquele caminho
- Exemplo: nó "Região" tem 3 arestas de saída: "Laval" → próxima pergunta, "Montréal" → próxima pergunta, "Autre" → nó Especialista

#### Configuração de cada Nó Pergunta

```
Título:        "Qual a amperagem do seu painel?"
Tipo:          Escolha única
Opções:        [60A, 100A, 150A, 200A, 320A, 400A]
Obrigatória:   Sim
Dica (tooltip): "Verifique na tampa do seu painel elétrico"
Imagem (opcional): upload de imagem ilustrativa
```

#### Configuração do Nó Orçamento

```
Contexto do negócio:
  "Somos a Total Électrique, empresa de instalação de bornes
   de carregamento elétrico no Quebec. Nossos preços base são:
   - Borne 16A: $499
   - Borne 32A: $699
   - Instalação parede: $490
   - Cabo: $9/pé
   ..."

Instrução para IA:
  "Gere um orçamento profissional em francês, detalhando cada
   item, com subtotais e total final. Inclua recomendações
   técnicas baseadas nas respostas."

Formato de saída:
  PDF | TXT | Ambos
```

#### Ações no Builder

- **Arrastar** nó do painel lateral para o canvas
- **Conectar** nós clicando e arrastando entre portas
- **Clicar** em um nó para editar suas propriedades no painel lateral
- **Deletar** nó ou aresta com tecla Delete ou botão
- **Zoom** e **pan** no canvas
- **Minimap** no canto para visão geral
- **Salvar** grava o fluxo como JSON no banco
- **Publicar** torna o fluxo acessível ao cliente final
- **Preview** permite testar o fluxo como se fosse o cliente
- **Duplicar** fluxo para criar variações
- **Histórico** de versões do fluxo

---

### 4.2 Executor de Fluxo (Cliente Final)

O cliente acessa a URL pública e o sistema renderiza o fluxo pergunta por pergunta.

#### Tela Inicial
```
┌─────────────────────────────────────────┐
│  [Logo da empresa]                      │
│                                         │
│  Obtenez votre devis en 2 minutes!     │
│                                         │
│  Nom:      [________________]          │
│  E-mail:   [________________]          │
│  Téléphone:[________________]          │
│  Adresse:  [________________]          │
│                                         │
│  [▶ Commencer]                          │
└─────────────────────────────────────────┘
```

#### Tela de Pergunta
```
┌─────────────────────────────────────────┐
│  Question 3 sur 8    [████████░░] 38%   │
│                                         │
│  Quelle est la puissance de votre       │
│  panneau électrique?                    │
│                                         │
│  ┌─────────┐  ┌─────────┐             │
│  │   60A   │  │  100A   │             │
│  └─────────┘  └─────────┘             │
│  ┌─────────┐  ┌─────────┐             │
│  │  150A   │  │  200A   │             │
│  └─────────┘  └─────────┘             │
│                                         │
│  [← Retour]                            │
└─────────────────────────────────────────┘
```

#### Tela Especialista (Desvio)
```
┌─────────────────────────────────────────┐
│  📞 Un spécialiste vous contactera     │
│                                         │
│  [Mensagem configurada pelo admin]     │
│                                         │
│  Vos données ont été enregistrées.     │
│  Nous vous contacterons sous 24h.      │
└─────────────────────────────────────────┘
```

#### Tela Orçamento Gerado
```
┌─────────────────────────────────────────┐
│  ✅ Votre devis est prêt!              │
│                                         │
│  ╔═══════════════════════════════════╗  │
│  ║  DEVIS D'INSTALLATION             ║  │
│  ║  Total Électrique                  ║  │
│  ║                                    ║  │
│  ║  Borne 32A .............. $699    ║  │
│  ║  Installation ........... $490    ║  │
│  ║  Câblage (25 pi) ........ $225    ║  │
│  ║  Déplacement ............ $69     ║  │
│  ║  ─────────────────────────────    ║  │
│  ║  TOTAL ESTIMÉ          $1,483     ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
│  [📥 Télécharger PDF]                  │
└─────────────────────────────────────────┘
```

#### Lógica de Execução

```
1. Motor lê o JSON do fluxo salvo no banco
2. Começa pelo nó "Início"
3. Para cada nó:
   a. Se PERGUNTA → renderiza e espera resposta
   b. Se CONDIÇÃO → avalia resposta anterior e segue a aresta correta
   c. Se MENSAGEM → exibe e avança automaticamente
   d. Se ESPECIALISTA → exibe mensagem + salva lead + para
   e. Se ORÇAMENTO → coleta todas as respostas, envia para IA, exibe resultado
4. Barra de progresso baseada na posição no caminho mais longo do grafo
```

---

### 4.3 Painel Admin (Gestão)

Após o builder, o admin gerencia tudo que o sistema gera.

#### Dashboard Principal

| Seção | O que mostra |
|-------|-------------|
| **Resumo** | Total de orçamentos hoje/semana/mês, taxa de conclusão, leads pendentes |
| **Orçamentos** | Lista de todos os orçamentos com status: pendente, atendido, aprovado, rejeitado |
| **Leads** | Contatos que caíram no caminho "Especialista" — aguardando ligação |
| **Fluxos** | Lista de fluxos criados com status: rascunho, publicado, arquivado |
| **Configurações** | Dados da empresa, logo, cores, emails de notificação, chaves de API |

#### Status de Orçamento

```
Pendente → Atendido → Aprovado
                   └→ Rejeitado
```

#### Notificações

- Email ao admin quando novo orçamento é gerado
- Email ao admin quando novo lead de especialista é criado
- Email ao cliente com cópia do orçamento (opcional, configurável)

---

### 4.4 Geração de Orçamento com IA

#### Fluxo da IA

```
Respostas do cliente (JSON)
         +
Contexto do negócio (texto do admin)
         +
Instrução de formatação (texto do admin)
         ↓
    Prompt montado dinamicamente
         ↓
    LLM (OpenAI / Anthropic)
         ↓
    Orçamento formatado
         ↓
    Salvo no MongoDB + exibido ao cliente
```

#### Exemplo de Prompt Gerado

```
Você é o assistente de orçamentos da Total Électrique.

CONTEXTO DO NEGÓCIO:
{contexto configurado pelo admin}

RESPOSTAS DO CLIENTE:
- Região: Laval
- Painel: 200A
- Espaços livres: Sim
- Spa: Não
- Tem borne: Não
- Local: Parede exterior
- Distância: 25 pés

INSTRUÇÃO:
{instrução configurada pelo admin}

Gere o orçamento completo.
```

#### Fallback

Se a IA falhar (timeout, erro de API), o sistema gera um orçamento simplificado localmente com base em uma tabela de preços configurada pelo admin, sem detalhes em linguagem natural.

---

## 5. Arquitetura Técnica

### 5.1 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend Builder | SvelteKit + Svelte 5 + SvelteFlow |
| Frontend Cliente | SvelteKit + Svelte 5 (SSR) |
| Backend API | Python + FastAPI |
| Banco de Dados | MongoDB (fluxos, respostas, orçamentos, users) |
| IA | OpenAI GPT-4o / Anthropic Claude (configurável) |
| Autenticação | JWT (admin) |
| Deploy | Azure / Vercel |

### 5.2 Estrutura de Dados

#### Fluxo (Flow)

```json
{
  "_id": "ObjectId",
  "tenant_id": "string",
  "name": "Devis Installation Borne",
  "status": "published",
  "version": 3,
  "nodes": [
    {
      "id": "node_1",
      "type": "start",
      "position": { "x": 100, "y": 50 },
      "data": {
        "title": "Início",
        "collectFields": ["name", "email", "phone", "address"]
      }
    },
    {
      "id": "node_2",
      "type": "question",
      "position": { "x": 100, "y": 200 },
      "data": {
        "title": "Quelle est votre région?",
        "questionType": "single_choice",
        "options": [
          { "id": "opt_1", "label": "Lanaudière", "value": "lanaudiere" },
          { "id": "opt_2", "label": "Est de Montréal", "value": "est_montreal" },
          { "id": "opt_3", "label": "Laval", "value": "laval" },
          { "id": "opt_4", "label": "Autre", "value": "other" }
        ],
        "required": true,
        "tooltip": "Sélectionnez la région de votre résidence"
      }
    },
    {
      "id": "node_5",
      "type": "specialist",
      "position": { "x": 500, "y": 200 },
      "data": {
        "title": "Région non desservie",
        "message": "Malheureusement, nous ne desservons pas votre région pour le moment."
      }
    },
    {
      "id": "node_final",
      "type": "quote",
      "position": { "x": 100, "y": 800 },
      "data": {
        "businessContext": "Somos a Total Électrique...",
        "aiInstruction": "Gere um orçamento profissional em francês...",
        "outputFormat": "pdf"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2"
    },
    {
      "id": "edge_2",
      "source": "node_2",
      "target": "node_3",
      "sourceHandle": "opt_1",
      "label": "Lanaudière"
    },
    {
      "id": "edge_3",
      "source": "node_2",
      "target": "node_3",
      "sourceHandle": "opt_2",
      "label": "Est Montréal"
    },
    {
      "id": "edge_4",
      "source": "node_2",
      "target": "node_3",
      "sourceHandle": "opt_3",
      "label": "Laval"
    },
    {
      "id": "edge_5",
      "source": "node_2",
      "target": "node_5",
      "sourceHandle": "opt_4",
      "label": "Autre → Spécialiste"
    }
  ],
  "created_at": "2026-03-10T10:00:00Z",
  "updated_at": "2026-03-10T14:30:00Z"
}
```

#### Resposta de Questionário (QuoteSession)

```json
{
  "_id": "ObjectId",
  "tenant_id": "string",
  "flow_id": "ObjectId",
  "flow_version": 3,
  "client": {
    "name": "Jean Dupont",
    "email": "jean@email.com",
    "phone": "+1 450-555-1234",
    "address": "123 Rue Principale, Laval"
  },
  "answers": [
    { "node_id": "node_2", "question": "Région?", "value": "laval" },
    { "node_id": "node_3", "question": "Ampérage?", "value": "200" },
    { "node_id": "node_4", "question": "Spa?", "value": false }
  ],
  "result_type": "quote",
  "quote_text": "DEVIS D'INSTALLATION...",
  "status": "pending",
  "created_at": "2026-03-10T15:00:00Z"
}
```

#### Lead de Suporte (SupportLead)

```json
{
  "_id": "ObjectId",
  "tenant_id": "string",
  "flow_id": "ObjectId",
  "client": { "name": "...", "email": "...", "phone": "...", "address": "..." },
  "answers": [],
  "specialist_node_id": "node_5",
  "reason": "Région non desservie",
  "status": "pending",
  "created_at": "2026-03-10T15:05:00Z"
}
```

---

## 6. Telas do Sistema

### 6.1 Área Admin

| # | Tela | Rota | Descrição |
|---|------|------|-----------|
| A1 | Login | `/admin` | Autenticação do admin |
| A2 | Dashboard | `/admin/dashboard` | Resumo geral com métricas |
| A3 | Builder | `/admin/flows/:id/edit` | Canvas SvelteFlow para montar o fluxo |
| A4 | Lista de Fluxos | `/admin/flows` | Cards com todos os fluxos criados |
| A5 | Orçamentos | `/admin/quotes` | Tabela de orçamentos com filtros e status |
| A6 | Leads | `/admin/leads` | Tabela de leads de especialista |
| A7 | Configurações | `/admin/settings` | Dados da empresa, logo, cores, API keys |
| A8 | Preview | `/admin/flows/:id/preview` | Testar o fluxo como cliente |

### 6.2 Área Cliente

| # | Tela | Rota | Descrição |
|---|------|------|-----------|
| C1 | Início | `/q/:slug` | Dados do cliente + início do questionário |
| C2 | Pergunta | `/q/:slug` (dinâmico) | Renderiza a pergunta atual do fluxo |
| C3 | Especialista | `/q/:slug` (desvio) | Mensagem de desvio + confirmação |
| C4 | Orçamento | `/q/:slug` (final) | Resultado do orçamento + download |

---

## 7. Regras de Negócio

1. **Um fluxo, um link.** Cada fluxo publicado gera uma URL única (`/q/total-electrique-borne`).
2. **Versionamento.** Editar um fluxo publicado cria nova versão. Sessões em andamento continuam na versão anterior.
3. **tenant_id obrigatório.** Toda tabela e toda query inclui `tenant_id` — preparado para multi-tenant desde o dia 1.
4. **Fallback local.** Se a IA falhar, o orçamento é gerado com cálculo simplificado sem linguagem natural.
5. **Dados do cliente primeiro.** O fluxo sempre começa coletando nome, email, telefone e endereço.
6. **Respostas imutáveis.** Uma vez submetida, a sessão de respostas não pode ser editada pelo cliente.
7. **Preview obrigatório.** O admin deve testar (preview) o fluxo antes de publicar.
8. **Limite de nós.** Máximo 50 nós por fluxo (para performance e UX).

---

## 8. Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Tempo médio para completar questionário | < 3 minutos |
| Taxa de conclusão (iniciou → orçamento) | > 60% |
| Tempo de geração do orçamento (IA) | < 10 segundos |
| Orçamentos gerados por mês por cliente | > 50 |
| NPS do admin (facilidade do builder) | > 8 |

---

## 9. Fora de Escopo (v1)

- Pagamento online integrado ao orçamento
- Assinatura digital do orçamento
- App mobile nativo
- Integração com CRMs (Salesforce, HubSpot)
- Multi-idioma automático (admin configura no idioma que quiser)
- A/B testing de fluxos
- Webhooks para integração com sistemas externos

---

## 10. Roadmap

### Fase 1 — MVP (6-8 semanas)
- Builder visual com SvelteFlow (nós: início, pergunta, condição, especialista, orçamento)
- Motor de execução do questionário
- Geração de orçamento com IA
- Painel admin básico (orçamentos + leads)
- Deploy em Azure

### Fase 2 — Polimento (4 semanas)
- Dashboard com métricas
- Notificações por email
- Preview do fluxo
- Exportação PDF do orçamento
- Histórico de versões do fluxo

### Fase 3 — Escala (4 semanas)
- Multi-tenant completo (onboarding self-service)
- Personalização visual (logo, cores, domínio customizado)
- Templates de fluxo pré-prontos por indústria
- API pública para integrações

---

## 11. Referência: Sistema Atual (Total Électrique)

Este PRD generaliza o sistema já existente da Total Électrique, que opera com:
- 8 perguntas fixas no código
- 3 bifurcações para especialista (região, espaço no painel, instalação interior)
- Cálculo de preço hardcoded no frontend
- IA enriquece o orçamento mas fallback local funciona

O FlowQuote transforma tudo isso em configurável, vendável como SaaS e escalável para qualquer nicho de serviço.
