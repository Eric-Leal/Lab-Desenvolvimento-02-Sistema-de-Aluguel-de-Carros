# Server - Execução Geatway e Microserviços

Use sempre esta pasta (`Codigo/Server`) como ponto central para subir tudo.

## Pré-requisitos

- Java 21
- Docker Desktop em execução
- Credenciais preenchidas em:
	- `Codigo/Server/microsservico/.env`
	- `Codigo/Server/microsservico-b/.env`

- **Nota:** Os arquivos `.env` e `.env.local` devem existir no diretório do serviço correspondente para que o modo escolhido funcione corretamente.

## Comandos Principais

```powershell
.\scripts\dev.cmd up
```

Ações disponíveis via `.\scripts\dev.cmd`:

- `up`: Sobe os containers do Gateway e Microserviços (usa as versões mais recentes dos JARs).
- `check`: Valida as rotas do Gateway via `http://localhost:8000` e o status do banco.
- `logs`: Acompanha os logs em tempo real.
- `rebuild`: Para, recompila tudo (Maven package) e reinicia os containers.
- `down`: Para e remove os containers.

> [!IMPORTANT]
> **Fluxo de Desenvolvimento para Docker:**
> Sempre que você **alterar** o código Java do Gateway ou dos Microserviços, é necessário gerar o novo pacote (JAR) para que o Docker veja a mudança. O comando `rebuild` já faz isso automaticamente para todos.

---

## API Gateway (Ponto de Entrada Único)

A partir de agora, o **Gateway centraliza todos os Microserviços na porta 8000**. O Frontend (Next.js) deve apontar apenas para esta porta.

- **Porta Principal**: `http://localhost:8000`
- **Diagnóstico**: `http://localhost:8000/gateway/config` (Verifica se o Gateway mapeou as rotas corretamente para o ambiente Docker).

### Endpoints (Via Gateway):
- `http://localhost:8000/microsservico/ping`
- `http://localhost:8000/microsservico-b/ping`

## Banco de Dados (Postgres)

Para evitar conflitos com outros projetos locais, a porta do Postgres no **Host (sua máquina)** foi mapeada para **5433**.
- **URL Externa (Host)**: `localhost:5433`
- **URL Interna (Docker)**: `postgres:5432`

---

## AI Context & Helpers (Para Desenvolvedores e IAs)

Este repositório possui arquivos especiais para ajudar Assistentes de IA (como o Cursor, Gemini ou ChatGPT) a entenderem o projeto rapidamente:

- **[AI_CONTEXT.md](./AI_CONTEXT.md)**: Visão geral da arquitetura, portas, fluxo de execução e convenções de pastas. **Leia este arquivo primeiro**.
- **[MICROSERVICE_TEMPLATE.md](./MICROSERVICE_TEMPLATE.md)**: Guia passo-a-passo para criar ou renomear serviços mantendo o padrão do Gateway e Netty.

---

## 🛠 Novas Instalações (Acabou de clonar o repositório?)

Se esta for a sua primeira execução:
1. Instale o **Java 21**. Verifique com `java -version`.
2. Garanta que o Docker Desktop está aberto e rodando.
3. Crie os arquivos `.env` dentro de `microsservico` e `microsservico-b` copiando o modelo de `env-pattern`.
4. Abra um terminal na pasta onde este README está e rode:
   ```powershell
   .\scripts\dev.cmd rebuild
   ```
5. Pronto! O banco, o gateway e os microserviços devem subir sem erros.

---

## 🧭 O API Gateway (Aprofundado para Desenvolvedores)

O **Gateway** (rodando na porta 8000) é a única interface que o mundo externo (incluindo o Frontend) conhece. 

### Como funciona o Roteamento (Strip Prefix)?
O Gateway pega o início do caminho da URL para saber para quem direcionar a requisição e **remove esse prefixo** antes de encaminhar.
- O Frontend pede: `http://localhost:8000/microsservico/ping`
- O Gateway **corta** o `/microsservico` da frente.
- O Gateway manda para o Microserviço A: `http://microsservico:8080/ping`

Isso significa que dentro de cada um dos seus microserviços, as rotas começam da **raiz (`/`)**. Você não precisa declarar os nomes dos microserviços nas anotações de rota do backend (ex: no Controller do Java, a rota é só `@Get("/ping")`).

**Como criar novos Microserviços e adicioná-los aqui?**
Siga exatamente a receita de bolo descrita no arquivo **[MICROSERVICE_TEMPLATE.md](./MICROSERVICE_TEMPLATE.md)** para registrar seu novo serviço no Docker Compose e adicioná-lo ao `GatewayController.java`.

---

## ⚖️ Fluxos de Trabalho (A Regra de Ouro)

O projeto usa abordagens diferentes dependendo do seu foco no dia para evitar conflitos de portas:

### A) Desenvolvendo para o Front-end (Next.js)
1. **Back-end Inteiro Pelo Docker**: Rode `.\scripts\dev.cmd up` nesta pasta. A orquestra inteira sobe e fica silenciosa rodando no fundo. O Gateway assume a porta **8000** sem problemas de CORS.
2. **Front-end**: Vá no seu cliente Next.js e rode `npm run dev`. O Frontend já está configurado via `.env` para apontar só para `http://localhost:8000`.

### B) Desenvolvendo/Codando no Back-end (Java/Micronaut)
Nestas horas, subir a cada mudança no Docker atrapalha:
1. **Derrube o Docker**: Rode `.\scripts\dev.cmd down`.
2. **Suba Pelo Script Local**: Vá pelo terminal na pasta exata do microserviço que você quer trabalhar (ex: `cd microsservico`) e rode `..\scripts\run-local.ps1`.
3. **Por que isso é bom?** O programa roda na porta `8080` de forma nativa. O próprio script local enxerga que o Docker está derrubado e **sobe o Banco de Dados (Postgres)** automaticamente, mapeando a porta na `5433`. Você testa as rotas no seu navegador como `http://localhost:8080/sua-rota` e altera o Java bem mais rápido.
*(Atenção: Enquanto estiver neste modo, o Gateway não estará de pé, portanto o teste via Front-end (Porta 3000) vai gerar erro de "conexão recusada" - isso é esperado!)*

---

## 🐞 Troubleshooting

- **500 Internal Server Error: No available services**:
	- O Gateway falhou em resolver o DNS do container. Verifique se os containers `microsservico` e `microsservico-b` estão UP via `docker ps`.
- **404 Not Found** na raiz (8000/): 
    - Comportamento esperado. O Gateway não possui página inicial, apenas rotas para os microserviços.
- **Conflito de porta (`Address already in use`)**:
	- Garanta que você deu `.\scripts\dev.cmd down` antes de tentar rodar no modo `run-local`.
