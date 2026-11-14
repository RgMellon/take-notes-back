# ADR-001 — Edição direta do documento estruturado sem IA

## Status

Proposto

## Contexto

Toda chamada a `POST /chapters/:chapterId/generate` aciona o provider de IA (Gemini ou OpenAI), consome tokens e sobrescreve o documento existente. O fluxo atual não distingue entre uma primeira geração e uma regeneração após pequenas alterações na nota bruta.

Cenário problemático: o usuário já tem um documento gerado, adiciona uma linha na nota e quer refletir essa mudança no Markdown — hoje é obrigado a regenerar tudo via IA, gastando tokens desnecessariamente.

## Decisão

Criar um endpoint dedicado para atualização direta do documento estruturado, sem passar pela IA:

```
PUT /chapters/:chapterId/structured
Body: { markdownContent: string, frontmatter?: object }
```

O use case correspondente (`UpdateStructuredDocumentUseCase`) chama diretamente `repo.upsert()`, sem acionar `AiProvider`. O status do capítulo **não** é alterado (já está `STRUCTURED`).

O endpoint `POST /chapters/:chapterId/generate` continua existindo para geração/regeneração completa via IA.

## Consequências

- O front-end pode tornar o `StructuredViewer` editável e salvar via `PUT /structured` sem custo de tokens
- O botão "Gerar" passa a ter semântica clara: primeira geração ou regeneração explícita
- O back-end ganha um use case simples e sem efeitos colaterais no capítulo
- Nenhuma mudança no schema do banco — `repo.upsert()` já suporta os dois casos

## Alternativa descartada

Reutilizar o `POST /generate` com uma flag `force: boolean` no body. Descartado porque mistura responsabilidades no mesmo endpoint e torna o contrato menos explícito.
