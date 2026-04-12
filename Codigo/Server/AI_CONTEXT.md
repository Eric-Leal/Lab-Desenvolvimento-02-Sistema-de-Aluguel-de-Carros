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


### Histórias de usuário:

1.  Cadastro de Cliente: Como cliente, quero me cadastrar informando RG, CPF, 
Nome, Endereço, profissão e minhas entidades empregadoras com seus 
respectivos rendimentos (máximo 3), para que eu possa utilizar o sistema. 
2.  Gestão de Agentes: Como empresa, banco ou locador autônomo, quero me 
cadastrar como agente no sistema, para que eu possa atuar na avaliação de 
pedidos de locação de automóveis. 
3.  Cadastro de Automóveis: Como agente locador, quero cadastrar novos veículos 
informando matrícula, ano, marca, modelo e placa, para que eles fiquem 
disponíveis para consulta e aluguel no sistema. 
4.  Autenticação: Como usuário cadastrado, quero realizar login no sistema através 
da internet, para acessar as funcionalidades de gestão de aluguel. 
5.  Consulta de automóveis disponíveis: Como cliente, quero consultar os 
automóveis disponíveis para locação, para escolher o veículo que desejo solicitar. 
6.  Solicitação de Aluguel: Como cliente, quero criar um pedido de aluguel 
selecionando um automóvel (matrícula, ano, marca, modelo e placa) , para iniciar o 
processo de locação. 
7.  Análise e Parecer de pedido: Como agente, quero analisar os pedidos de locação 
introduzidos e emitir um parecer, para que pedidos com parecer positivo avancem 
para a execução do contrato. 
8.  Manutenção de Pedidos: Como cliente, quero ter a liberdade de modificar, 
consultar ou cancelar os pedidos de aluguel ainda em rascunho diretamente pela 
interface. 
9.  Enviar pedido de locação: Como cliente, quero enviar um pedido de aluguel de 
um automóvel desejado, para que seja analisado e criado o contrato de aluguel. 
10. Gestão de Contratos de Crédito: Como banco agente, quero associar um 
contrato de crédito a um aluguel específico, para formalizar o financiamento da 
locação. 
11. Visualização de pedidos disponíveis para financiamento: Como banco agente, 
quero visualizar todos os pedidos aprovados por locadores que ainda aguardam 
análise de financiamento, para escolher quais analisar. 
12. Registro de Propriedade: Como agente, quero registrar a propriedade do 
automóvel alugado em meu nome, dependendo das cláusulas do contrato, para 
manter a conformidade legal do ativo. 
13. Notificação de Aprovação de pedido: Como cliente, quero receber uma 
notificação via e-mail assim que um agente aprovar meu pedido, para saber se 
minha solicitação foi aprovada ou negada. 
14. Notificação de contrato disponível para assinatura: Como cliente, quero 
receber uma notificação via e-mail assim que o processo de análise de locação for 
finalizado, para que eu possa assinar os contratos. 
15. Inclusão de financiamento de locação: Como cliente, quero que o sistema valide 
automaticamente se o valor do aluguel é compatível com os meus rendimentos 
cadastrados antes de enviar o pedido, para que eu possa saber se será necessário 
financiamento do banco. 
16. Visualização de pedidos pendentes: Como agente locador, quero visualizar 
todos os pedidos de locação pendentes referentes aos meus automóveis, para 
decidir quais aprovar ou reprovar. 
17. Histórico de pedidos analisados: Como agente, quero um dashboard que mostre 
o histórico de pedidos analisados, para otimizar a gestão das avaliações dos 
pedidos. 
18. Cancelamento de pedido: Como cliente, quero cancelar meus pedidos em 
análise, para que eu possa desistir da locação do automóvel. 
19. Histórico de locações: Como cliente, quero visualizar o histórico de contratos de 
locações já realizados por mim, para auditoria das minhas atividades.


*Para guias práticos focados em desenvolvedores humanos, consulte o [README.md](./README.md) e [MICROSERVICE_TEMPLATE.md](./MICROSERVICE_TEMPLATE.md).*
