# AI Context - Server Workspace Architecture (Gateway & Netty)

## 🎯 Objetivo
Este arquivo serve como **ponto de verdade único** para assistentes de IA (como o Gemini ou ChatGPT) entenderem a arquitetura atualizada de microserviços e o fluxo de execução do monorepo.

---

## 🏗️ Estrutura do Projeto
- **`gateway` (Porta 8000)**: API Gateway baseado em Micronaut 4 e **Netty**. É o único ponto de entrada para o Frontend.
- **`usersService` (Porta 8080)**: Serviço de Usuários. Rota via Gateway: `/usersService/**`.
- **`microsservico-b` (Porta 8081)**: Serviço B. Rota via Gateway: `/microsservico-b/**`.
- **`docker-compose.yml`**: Orquestrador global. Utiliza injeção de variáveis de ambiente no Gateway para roteamento estático.

---

## ⚙️ Configurações Críticas (Ambientação)

### 1. Injeção de Roteamento no Gateway
O Gateway (**GatewayController**) não utiliza Service Discovery (Consul/Eureka). Ele usa URLs estáticas injetadas via **ambiente** no Docker Compose:
- `PROXY_TARGETS_USERSSERVICE=http://usersService:8080`
- `PROXY_TARGETS_MICROSSERVICO_B=http://microsservico-b:8081`

Placeholder no Java: `@Client("${proxy.targets.usersService}")`.

### 2. Banco de Dados (Postgres)
- **Porta Host (Sua Máquina)**: **5433** (Evite usar 5432 para não conflitar com outros bancos instalados).
- **Porta Interna (Docker)**: **5423** (Padrão).

### 3. Java Runtime
- **Obrigatório**: Java 21 (Netty otimizado).
- **Maven**: Use sempre o `./mvnw` local para garantir consistência.

---

## 🚀 Fluxo de Execução (Single Source of Truth)

Sempre execute os comandos a partir da raiz `Codigo/Server`:

```powershell
.\scripts\dev.cmd up       # Sobe tudo (Gateway + Microserviços + Postgres)
.\scripts\dev.cmd check    # Valida se os serviços e rotas do Gateway estão UP
.\scripts\dev.cmd rebuild  # Recompila Maven e recria containers
.\scripts\dev.cmd down     # Para e remove os containers
```

---

## 🔍 Endpoints de Diagnóstico
- **Check-up Geral**: `http://localhost:8000/gateway/config` (Retorna quais URLs o Gateway está tentando rotear).
- **Microserviço A**: `http://localhost:8000/usersService/ping`
- **Microserviço B**: `http://localhost:8000/microsservico-b/ping`

---

## 🛠️ Convenções para IAs (Regras Rígidas)
1. **Roteamento e Prefixos (Strip Prefix)**:
   - O Gateway captura rotas como `@Get("/usersService{path:.*}")`.
   - Ele **remove o prefixo** e envia a requisição forçando uma nova URI (`java.net.URI.create(path)`).
   - Portanto, os Controllers nos microserviços nativos **não devem** incluir o nome do serviço na rota (ex: use `@Get("/ping")` e não `@Get("/microsservico/ping")`).
2. **Nomenclatura de Proxy (Environment Mapping)**: 
   - Ao injetar URLs no Gateway via Docker, o Micronaut mapeia `PROXY_TARGETS_X` para `proxy.targets.x`.
   - **Evite CamelCase ou hífens** nas chaves de ambiente se o Micronaut falhar ao injetar (ex: prefira `usersservice` em vez de `users-service` ou `usersService`).
3. **Novos Serviços**: Devem ser registrados manualmente no `docker-compose.yml` e no `GatewayController.java` (seguindo a Regra #1).
4. **Fluxos de Trabalho**:
   - **Se o usuário estiver mexendo no Frontend (Next.js)**: Instrua-o a rodar o backend inteiro via Docker (`dev.cmd up`). O Gateway na porta 8000 resolve o CORS e os paths.
   - **Se o usuário estiver focado no código de um Microserviço (Java)**: Instrua-o a rodar o serviço individualmente usando `run-local.ps1`. Neste modo, o serviço atende na própria porta (ex: 8080) e o Frontend apresentará erros se não for reconfigurado.
*Para guias práticos focados em desenvolvedores humanos, consulte o [README.md](./README.md) e [MICROSERVICE_TEMPLATE.md](./MICROSERVICE_TEMPLATE.md).*
