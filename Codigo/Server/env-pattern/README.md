# Padrao de env para microservicos

Este diretorio define um padrao simples para compartilhar configuracoes entre servicos.

## Arquivos

- `.env.shared.example`: variaveis comuns de infraestrutura.
- `.env.servico-a.example`: variaveis proprias do servico A.
- `.env.servico-b.example`: variaveis proprias do servico B.

## Como usar

1. Copie os exemplos para arquivos reais (`.env.shared`, `.env.servico-a`, `.env.servico-b`).
2. Ajuste credenciais e portas.
3. Em cada servico, carregue seu arquivo proprio e os valores compartilhados.

## Regra pratica

- Mesmo banco fisico: permitido.
- Mesmo usuario para todos os servicos: evitar.
- Ideal: schema e role por servico.
