# take-notes-back

API backend do sistema **Take Note** — uma ferramenta para organizar anotações de estudo em livros e capítulos, com geração automática de documentos estruturados via IA, otimizados para ingestão em pipelines RAG (Retrieval-Augmented Generation).

---

## Para que serve

O usuário organiza seu material de estudo em **livros**, divide cada livro em **capítulos** e escreve **notas brutas** por capítulo. A partir dessas notas, a API aciona um modelo de IA para gerar um **documento estruturado em Markdown** com frontmatter, hierarquia de headings, diagramas Mermaid e tags — pronto para ser indexado em um sistema de busca semântica ou RAG.

Fluxo principal:

```
Livro → Capítulo → Nota bruta → [IA] → Documento estruturado (Markdown + frontmatter)
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | NestJS 11 (Node.js + TypeScript) |
| ORM | Prisma 6 |
| Banco de dados | PostgreSQL |
| IA (padrão) | Google Gemini 2.0 Flash (`@google/genai`) |
| IA (alternativa) | OpenAI GPT-4o Mini (`openai`) |
| Validação | `class-validator` + `class-transformer` |
| Testes | Jest + Supertest |
| Linter/Formatter | ESLint + Prettier |

---

## Arquitetura

O projeto segue **Clean Architecture** com separação por bounded context. Cada módulo em `src/modules/[domínio]/` é dividido em quatro camadas:

```
src/modules/[domínio]/
├── domain/           ← entidades, interfaces de repositório, tokens
├── application/
│   └── use-cases/   ← orquestração e regras de negócio
├── infra/
│   └── persistence/ ← implementações concretas (Prisma)
└── interface/
    ├── dto/         ← DTOs de entrada (class-validator) e resposta (Interface-First)
    └── [domínio].controller.ts
```

Princípios aplicados:
- Controllers são delegadores puros — não fazem mapeamento, apenas chamam o use case
- Mapeamento entidade → DTO acontece nos use cases via `fromEntity` estático
- Repositórios são injetados via token (`BOOK_REPOSITORY_TOKEN`, etc.), nunca pela classe concreta
- A camada `domain/` não importa nada de framework ou infraestrutura

---

## Módulos

### `book`
CRUD de livros. Cada livro tem título e autor.

### `chapter`
CRUD de capítulos vinculados a um livro. Cada capítulo tem número, título, tags e status (`DRAFT` | `STRUCTURED`). O status muda para `STRUCTURED` após a geração do documento via IA.

### `note`
Upsert de nota bruta por capítulo (1 nota por capítulo). Armazena o conteúdo em texto livre.

### `structured`
Geração e leitura do documento estruturado. O use case `GenerateStructuredDocumentUseCase` busca a nota e o capítulo, aciona o provider de IA, persiste o resultado e atualiza as tags e status do capítulo.

### `ai`
Abstração do provider de IA via interface `AiProvider`. A factory (`ai.factory.ts`) decide qual provider instanciar com base na variável de ambiente `AI_PROVIDER`.

---

## Banco de dados

Modelos Prisma (PostgreSQL):

- `books` — id (UUID), title, author, createdAt, updatedAt
- `chapters` — id, bookId (FK), number, title, tags (array), status, createdAt, updatedAt
- `raw_notes` — id, chapterId (FK único), content (text), updatedAt
- `structured_documents` — id, chapterId (FK único), markdownContent (text), frontmatter (JSONB), generatedAt

Todas as FKs têm `onDelete: Cascade`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
# Banco de dados
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Provider de IA: "gemini" (padrão) ou "openai"
AI_PROVIDER=gemini

# Chave da API do Gemini (se AI_PROVIDER=gemini)
GEMINI_API_KEY=<sua-chave>

# Chave da API da OpenAI (se AI_PROVIDER=openai)
OPENAI_API_KEY=<sua-chave>

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

> Nunca commite o `.env` com valores reais.

---

## Como rodar

```bash
# Instalar dependências
yarn install

# Rodar migrations
npx prisma migrate dev

# Desenvolvimento (watch mode)
yarn start:dev

# Produção
yarn start:prod
```

---

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| POST | `/books` | Criar livro |
| GET | `/books` | Listar livros |
| GET | `/books/:id` | Buscar livro |
| PATCH | `/books/:id` | Atualizar livro |
| DELETE | `/books/:id` | Deletar livro |
| POST | `/books/:bookId/chapters` | Criar capítulo |
| GET | `/books/:bookId/chapters` | Listar capítulos |
| GET | `/books/:bookId/chapters/:id` | Buscar capítulo |
| PATCH | `/books/:bookId/chapters/:id` | Atualizar capítulo |
| DELETE | `/books/:bookId/chapters/:id` | Deletar capítulo |
| GET | `/chapters/:chapterId/note` | Buscar nota |
| PUT | `/chapters/:chapterId/note` | Criar/atualizar nota |
| POST | `/chapters/:chapterId/generate` | Gerar documento estruturado via IA |
| GET | `/chapters/:chapterId/structured` | Buscar documento estruturado |

---

## Testes

```bash
# Unitários
yarn test

# Cobertura
yarn test:cov

# E2E
yarn test:e2e
```
