# Sistema de Aluguel de Carros - LAB02

> **Disciplina:** Laboratório de Desenvolvimento de Software  
> **Curso:** Engenharia de Software  
> **Professor:** João Paulo Carneiro Aramuni

---

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Micronaut](https://img.shields.io/badge/Micronaut-4.10.10-000000?style=for-the-badge&logo=micronaut&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Documentação e Diagramas](#-documentação-e-diagramas)
- [Arquitetura de Microserviços](#%EF%B8%8F-arquitetura-de-microserviços)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#%EF%B8%8F-tecnologias-utilizadas)
- [Instalação e Execução](#-instalação-e-execução)
- [Equipe](#-equipe)
- [Licença e Agradecimentos](#-licença-e-agradecimentos)

---

## 📋 Sobre o Projeto

Este projeto consiste num **Sistema de Aluguel de Carros**, desenvolvido como requisito avaliativo (Laboratório 02) da disciplina de Desenvolvimento de Software. O projeto foi desenhado sob uma arquitetura profissional de **Microserviços**, garantindo alta escalabilidade, isolamento de domínios e um Front-end totalmente reativo desacoplado do Back-end.

---

## 📄 Documentação e Diagramas

Abaixo estão os artefatos de engenharia de software utilizados no desenho da aplicação:

### Histórias de Usuário
- 📖 [PDF - Histórias de Usuário](docs/historias-de-usuarios/Historias%20de%20Usuario%20-%20Sistema%20de%20aluguel%20de%20carros%20-%20LAB2.pdf)

### Projetos Arquiteturais
- 📍 [Diagrama de Caso de Uso (PNG)](docs/diagramas/Diagrama-caso-uso-lab2.png)
- 🧩 [Diagrama de Classe (PNG)](docs/diagramas/diagrama-de-classe.png)
- 📦 [Diagrama de Pacotes (PNG)](docs/diagramas/diagrama-de-pacotes.png)
- 🔌 [Diagrama de Componentes (PNG)](docs/diagramas/diagrama-de-componentes.png)

---

## 🏗️ Arquitetura de Microserviços

O sistema foge do padrão monolítico tradicional e adota um padrão de mercado:

1. **Front-end (Next.js)**: Uma SPA isolada que não conhece as portas do servidor, comunicando-se unicamente com a porta 8000.
2. **API Gateway (Porta 8000)**: Construído em Micronaut. Sua função é receber todo o tráfego do React, tratar as políticas do navegador (CORS), remover prefixos (Strip Prefix) e fazer o balanceamento inteligente enviando a requisição para o microserviço correspondente.
3. **Microserviços (Netty)**: Cinco módulos back-end construídos em Java, cada um com domínio isolado, rodando em portas seladas através do Docker: `usersService`, `vehiclesService`, `rentalsService`, `reservasService` e `contratoService`.
4. **PostgreSQL**: Banco de dados relacional isolado também containerizado.

---

## 📁 Estrutura do Projeto

O repositório está organizado de forma totalmente modular (Monorepo). Abaixo está o detalhamento completo de cada diretório e arquivo essencial do ecossistema:

### 1. 📂 Documentação e Diagramas (`/docs`)
Central de artefatos de engenharia de software e modelos:
```text
docs/
├── diagramas/               # 📍 Protótipos Astah (.asta), exportações PNG e diagramas
│   ├── Diagrama-caso-uso-lab2.png       # Diagrama de Caso de Uso
│   ├── diagrama-de-classe.png           # Diagrama de Classe
│   ├── diagrama-de-pacotes.png          # Diagrama de Pacotes
│   └── diagrama-de-componentes.png      # Diagrama de Componentes
└── historias-de-usuarios/   # 📖 PDF detalhado das Histórias de Usuário (Requisitos)
```

---

### 2. 🎨 Client - Front-end (`/Codigo/client`)
Aplicação reativa Next.js responsável pela interface do usuário:
```text
Codigo/client/
├── public/                 # 📂 Assets estáticos (SVGs, favicon, ícones)
├── src/                    # 📂 Núcleo de desenvolvimento React
│   ├── app/                # 🗺️ Roteamento dinâmico (page.tsx, layout.tsx, estilos globais)
│   ├── components/         # 🧩 Componentes modulares reutilizáveis
│   ├── config/             # ⚙️ Configuração de constantes e endereços de API
│   ├── hooks/              # 🎣 Hooks customizados para gestão de lifecycle
│   ├── services/           # 📡 Camada de comunicação HTTP disparando pedidos ao Gateway
│   ├── types/              # 📋 Interfaces e tipos TypeScript globais
│   └── utils/              # 🛠️ Funções de formatação e lógica comum
├── .env                    # 🔐 Variável de ambiente crucial (API_URL=http://localhost:8000)
├── next.config.ts          # ⚙️ Regras de compilação do framework Next.js
├── tailwind.config.ts      # 🖌️ Design System (Cores, fontes e breakpoints)
├── package.json            # 📦 Manifesto de dependências do Node.js
└── tsconfig.json           # 🔷 Configuração estrita do compilador TypeScript
```

---

### 3. ⚙️ Infraestrutura (`/Codigo/server`)
O núcleo que rege a orquestração de containers e ferramentas de auxílio ao Dev:
```text
Codigo/server/
├── scripts/                # 📜 Scripts de automação (dev.cmd, dev.ps1, run-local.ps1)
├── env-pattern/            # 📝 Catálogo de modelos .ENV para clonagem inicial
├── docker-compose.yml      # 🐳 O maestro que sobe os JARs, o Postgres e a rede interna
├── AI_CONTEXT.md           # 🧠 Contexto de arquitetura para assistentes generativos (IA)
├── MICROSERVICE_TEMPLATE.md# 📘 Checklist de criação para novos serviços Netty
├── README.md               # 📘 Guia rápido operacional do servidor
├── gateway/                # 🚪 API Gateway (Porta 8000)
├── usersService/           # 👤 Serviço de Usuários, Agentes e Autenticação
├── vehiclesService/        # 🚗 Serviço de Gestão de Automóveis
├── rentalsService/         # 📋 Serviço de Pedidos de Aluguel
├── reservasService/        # 📅 Serviço de Reservas e Disponibilidade
└── contratoService/        # 📝 Serviço de Contratos
```

---

### 4. 🚪 API Gateway (`/Codigo/server/gateway`)
Ponto de entrada único via porta 8000, responsável pelo roteamento reativo e CORS:
```text
Codigo/server/gateway/
├── .mvn/                       # 📦 Wrapper do Maven para consistência de versão
├── Dockerfile                  # 🐳 Imagem Docker do Gateway
├── pom.xml                     # 📄 Dependências do Micronaut HTTP Client
├── mvnw / mvnw.bat             # 🚀 Executáveis do Maven Local
├── README.md                   # 📖 Documentação técnica interna do roteamento
└── src/
    ├── main/resources/
    │   └── application.yml     # ⚙️ Mapeamento de rotas e targets Docker de cada serviço
    └── main/java/gateway/
        ├── controller/
        │   ├── UsersServiceController.java    # 🎛️ Proxy para /users/** → usersService
        │   ├── VehiclesServiceController.java # 🎛️ Proxy para /vehicles/** → vehiclesService
        │   ├── RentalsServiceController.java  # 🎛️ Proxy para /rentals/** → rentalsService
        │   ├── ReservasServiceController.java # 🎛️ Proxy para /reservas/** → reservasService
        │   ├── ContratoServiceController.java # 🎛️ Proxy para /contratos/** → contratoService
        │   └── GatewayConfigController.java   # 🎛️ Endpoint de config/health do gateway
        ├── service/
        │   └── ProxyFacadeService.java        # 🛠️ Manipulador central de CORS e URI
        └── Application.java                   # 🚀 Bootstrapping da porta 8000
```

---

### 5. 👤 Users Service (`/Codigo/server/usersService`)
Domínio de usuários, agentes e autenticação JWT. Opera na **porta 8081**.
```text
Codigo/server/usersService/
├── .mvn/                       # 📦 Maven Wrapper
├── Dockerfile                  # 🐳 Imagem Docker do serviço
├── pom.xml                     # 📄 Dependências (JPA, Flyway, JWT, MapStruct)
├── mvnw / mvnw.bat             # 🚀 Executáveis Maven
├── .env / .env.example         # 🔐 Variáveis de ambiente do banco e JWT
└── src/main/
    ├── resources/
    │   ├── application.properties  # ⚙️ Config Hikari, Flyway e porta
    │   └── db/migration/           # 🗄️ Scripts SQL do Flyway (V1__, V2__...)
    └── java/com/example/
        ├── controller/
        │   ├── agent/
        │   │   └── AgentController.java          # 🎯 CRUD de Agentes (/agents/**)
        │   ├── auth/
        │   │   └── AuthController.java           # 🎯 Login e autenticação (/auth/**)
        │   ├── client/
        │   │   └── ClientController.java         # 🎯 CRUD de Clientes (/clients/**)
        │   └── HealthController.java             # 🎯 Health check (/health)
        ├── service/
        │   ├── agent/
        │   │   └── AgentService.java             # 🧠 Lógica de negócio dos Agentes
        │   ├── auth/
        │   │   └── AuthService.java              # 🧠 Geração e validação de JWT
        │   └── client/
        │       └── ClientService.java            # 🧠 Lógica de negócio dos Clientes
        ├── repository/
        │   ├── agent/
        │   │   └── AgentRepository.java          # 🗄️ Persistência de Agente (JPA)
        │   └── client/
        │       ├── ClientRepository.java         # 🗄️ Persistência de Cliente (JPA)
        │       └── EmpregoRepository.java        # 🗄️ Persistência de Emprego (JPA)
        ├── model/
        │   ├── User.java                         # 💾 Entidade base de usuário
        │   ├── Address.java                      # 💾 Entidade de endereço
        │   ├── agent/
        │   │   └── Agent.java                    # 💾 Entidade Agente
        │   └── client/
        │       ├── Client.java                   # 💾 Entidade Cliente
        │       ├── Emprego.java                  # 💾 Entidade Emprego
        │       └── EntidadeEmpregadora.java      # 💾 Entidade Empregadora (embutida)
        ├── dto/
        │   ├── agent/
        │   │   ├── AgentResponse.java            # 📦 Response DTO do Agente
        │   │   ├── CreateAgentRequest.java       # 📦 Request DTO de criação
        │   │   └── UpdateAgentRequest.java       # 📦 Request DTO de atualização
        │   ├── auth/
        │   │   ├── LoginRequest.java             # 📦 Credenciais de login
        │   │   └── LoginResponse.java            # 📦 Token JWT de resposta
        │   ├── client/
        │   │   ├── ClientResponse.java           # 📦 Response DTO do Cliente
        │   │   ├── CreateClientRequest.java      # 📦 Request DTO de criação
        │   │   └── UpdateClientRequest.java      # 📦 Request DTO de atualização
        │   └── common/
        │       ├── AddressDTO.java               # 📦 DTO de endereço (leitura)
        │       ├── CreateAddressDTO.java         # 📦 DTO de endereço (criação)
        │       ├── UpdateAddressDTO.java         # 📦 DTO de endereço (atualização)
        │       └── EmpregoDTO.java               # 📦 DTO de vínculo empregatício
        ├── mapper/
        │   ├── agent/
        │   │   └── AgentMapper.java              # 🔄 MapStruct: Agent ↔ DTO
        │   └── client/
        │       └── ClientMapper.java             # 🔄 MapStruct: Client ↔ DTO
        ├── enums/
        │   ├── TipoAgente.java                   # 📋 Enum de tipo de agente
        │   └── PlaceholderEnum.java              # 📋 Enum de placeholder genérico
        ├── exception/
        │   ├── BusinessException.java            # ⚠️ Exceção de regra de negócio
        │   ├── DocumentAlreadyInUseException.java# ⚠️ CPF/documento duplicado
        │   ├── EmailAlreadyInUseException.java   # ⚠️ E-mail duplicado
        │   ├── InvalidCredentialsException.java  # ⚠️ Credenciais inválidas
        │   ├── ResourceNotFoundException.java    # ⚠️ Recurso não encontrado
        │   ├── WeakPasswordException.java        # ⚠️ Senha fraca
        │   └── ValidationExceptionHandler.java   # ⚠️ Handler global de erros
        ├── util/
        │   └── PasswordValidator.java            # 🛠️ Validação de força de senha
        └── Application.java                      # 🚀 Ponto de ignição do serviço
```

---

### 6. 🚗 Vehicles Service (`/Codigo/server/vehiclesService`)
Domínio de automóveis disponíveis para aluguel. Opera na **porta 8082**.
```text
Codigo/server/vehiclesService/
├── .mvn/                       # 📦 Maven Wrapper
├── Dockerfile                  # 🐳 Imagem Docker do serviço
├── pom.xml                     # 📄 Dependências (JPA, Flyway, MapStruct)
├── mvnw / mvnw.bat             # 🚀 Executáveis Maven
├── .env / .env.example         # 🔐 Variáveis de ambiente do banco e porta
└── src/main/
    ├── resources/
    │   ├── application.properties  # ⚙️ Config Hikari, Flyway e porta
    │   └── db/migration/           # 🗄️ Scripts SQL do Flyway (V1__, V2__...)
    └── java/com/example/
        ├── controller/
        │   ├── AutomovelController.java      # 🎯 CRUD de automóveis (/automoveis/**)
        │   └── HealthController.java         # 🎯 Health check (/health)
        ├── service/
        │   └── AutomovelService.java         # 🧠 Lógica de negócio dos automóveis
        ├── repository/
        │   └── AutomovelRepository.java      # 🗄️ Persistência de Automovel (JPA)
        ├── model/
        │   └── Automovel.java                # 💾 Entidade Automovel (placa, modelo, ano...)
        ├── dto/
        │   └── automovel/
        │       ├── AutomovelResponse.java        # 📦 Response DTO do Automóvel
        │       ├── CreateAutomovelRequest.java   # 📦 Request DTO de criação
        │       ├── UpdateAutomovelRequest.java   # 📦 Request DTO de atualização
        │       └── UpdateProprietarioRequest.java# 📦 Request DTO de mudança de proprietário
        ├── mapper/
        │   └── AutomovelMapper.java          # 🔄 MapStruct: Automovel ↔ DTO
        ├── exception/
        │   ├── AutomovelNotFoundException.java   # ⚠️ Automóvel não encontrado
        │   ├── PlacaAlreadyInUseException.java   # ⚠️ Placa duplicada
        │   └── ValidationExceptionHandler.java  # ⚠️ Handler global de erros
        └── Application.java                  # 🚀 Ponto de ignição do serviço
```

---

### 7. 📋 Rentals Service (`/Codigo/server/rentalsService`)
Domínio de pedidos de aluguel, integrando dados de usuários e veículos. Opera na **porta 8083**.
```text
Codigo/server/rentalsService/
├── .mvn/                       # 📦 Maven Wrapper
├── Dockerfile                  # 🐳 Imagem Docker do serviço
├── pom.xml                     # 📄 Dependências (JPA, Flyway, Micronaut HTTP Client)
├── mvnw / mvnw.bat             # 🚀 Executáveis Maven
├── .env / .env.example         # 🔐 Variáveis de ambiente do banco e porta
└── src/main/
    ├── resources/
    │   ├── application.properties  # ⚙️ Config Hikari, Flyway e porta
    │   └── db/migration/           # 🗄️ Scripts SQL do Flyway (V1__, V2__...)
    └── java/com/example/
        ├── controller/
        │   ├── PedidoController.java         # 🎯 CRUD de pedidos de aluguel (/pedidos/**)
        │   └── HealthController.java         # 🎯 Health check (/health)
        ├── service/
        │   └── PedidoService.java            # 🧠 Lógica de pedido (validação, status)
        ├── repository/
        │   └── PedidoRepository.java         # 🗄️ Persistência de Pedido (JPA)
        ├── model/
        │   └── Pedido.java                   # 💾 Entidade Pedido (FK cliente, FK veículo)
        ├── dto/
        │   ├── pedido/
        │   │   ├── PedidoResponse.java           # 📦 Response DTO do Pedido
        │   │   ├── CreatePedidoRequest.java      # 📦 Request DTO de criação
        │   │   └── UpdatePedidoRequest.java      # 📦 Request DTO de atualização
        │   ├── client/
        │   │   └── ClientInfo.java               # 📦 DTO de dados do cliente (consumido)
        │   └── automovel/
        │       └── AutomovelInfo.java            # 📦 DTO de dados do automóvel (consumido)
        ├── mapper/
        │   └── PedidoMapper.java             # 🔄 MapStruct: Pedido ↔ DTO
        ├── client/
        │   ├── UsersServiceClient.java       # 📡 HTTP Client → usersService (validar cliente)
        │   └── VehiclesServiceClient.java    # 📡 HTTP Client → vehiclesService (validar veículo)
        ├── enums/
        │   ├── StatusGeral.java              # 📋 Enum de status geral do pedido
        │   └── StatusLocador.java            # 📋 Enum de status pelo lado do locador
        ├── exception/
        │   ├── PedidoNotFoundException.java          # ⚠️ Pedido não encontrado
        │   ├── InvalidStatusTransitionException.java # ⚠️ Transição de status inválida
        │   └── ValidationExceptionHandler.java      # ⚠️ Handler global de erros
        └── Application.java                  # 🚀 Ponto de ignição do serviço
```

---

### 8. 📅 Reservas Service (`/Codigo/server/reservasService`)
Domínio de reservas e verificação de disponibilidade de veículos. Opera na **porta 8084**.
```text
Codigo/server/reservasService/
├── .mvn/                       # 📦 Maven Wrapper
├── Dockerfile                  # 🐳 Imagem Docker do serviço
├── pom.xml                     # 📄 Dependências (JPA, Flyway, MapStruct)
├── mvnw / mvnw.bat             # 🚀 Executáveis Maven
├── .env / .env.example         # 🔐 Variáveis de ambiente do banco e porta
└── src/main/
    ├── resources/
    │   ├── application.properties  # ⚙️ Config Hikari, Flyway e porta
    │   └── db/migration/           # 🗄️ Scripts SQL do Flyway (V1__, V2__...)
    └── java/com/example/
        ├── controller/
        │   └── ReservaController.java        # 🎯 Endpoints de reserva e disponibilidade (/reservas/**)
        ├── service/
        │   └── ReservaService.java           # 🧠 Lógica de bloqueio e verificação de período
        ├── repository/
        │   └── ReservaRepository.java        # 🗄️ Persistência de Reserva (JPA)
        ├── model/
        │   └── Reserva.java                  # 💾 Entidade Reserva (FK veículo, período)
        ├── dto/
        │   ├── ReservaResponse.java              # 📦 Response DTO da Reserva
        │   ├── BloquearReservaRequest.java       # 📦 Request DTO para bloquear período
        │   ├── VerificacaoDisponibilidadeRequest.java # 📦 Request DTO para checar disponibilidade
        │   └── DisponibilidadeResponse.java      # 📦 Response DTO de disponibilidade
        ├── mapper/
        │   └── ReservaMapper.java            # 🔄 MapStruct: Reserva ↔ DTO
        ├── enums/
        │   └── StatusReserva.java            # 📋 Enum de status da reserva
        ├── exception/
        │   ├── BusinessException.java        # ⚠️ Exceção de regra de negócio
        │   └── ResourceNotFoundException.java# ⚠️ Recurso não encontrado
        └── Application.java                  # 🚀 Ponto de ignição do serviço
```

---

### 9. 📝 Contrato Service (`/Codigo/server/contratoService`)
Domínio de contratos gerados ao confirmar um aluguel. Opera na **porta 8085**.
```text
Codigo/server/contratoService/
├── .mvn/                       # 📦 Maven Wrapper
├── Dockerfile                  # 🐳 Imagem Docker do serviço
├── pom.xml                     # 📄 Dependências (JPA, Flyway, MapStruct)
├── mvnw / mvnw.bat             # 🚀 Executáveis Maven
├── .env / .env.example         # 🔐 Variáveis de ambiente do banco e porta
└── src/main/
    ├── resources/
    │   ├── application.properties  # ⚙️ Config Hikari, Flyway e porta
    │   └── db/migration/           # 🗄️ Scripts SQL do Flyway (V1__, V2__...)
    └── java/com/example/
        ├── controller/
        │   └── ContratoController.java       # 🎯 Endpoints de contrato (/contratos/**)
        ├── service/
        │   └── ContratoService.java          # 🧠 Lógica de geração e encerramento de contratos
        ├── repository/
        │   └── ContratoRepository.java       # 🗄️ Persistência de Contrato (JPA)
        ├── model/
        │   └── Contrato.java                 # 💾 Entidade Contrato (FK pedido, datas, valor)
        ├── dto/
        │   ├── ContratoResponse.java         # 📦 Response DTO do Contrato
        │   └── CriarContratoRequest.java     # 📦 Request DTO de criação
        ├── mapper/
        │   └── ContratoMapper.java           # 🔄 MapStruct: Contrato ↔ DTO
        ├── enums/
        │   └── StatusContrato.java           # 📋 Enum de status do contrato
        ├── exception/
        │   ├── BusinessException.java        # ⚠️ Exceção de regra de negócio
        │   └── ResourceNotFoundException.java# ⚠️ Recurso não encontrado
        └── Application.java                  # 🚀 Ponto de ignição do serviço
```

---

## 🛠️ Tecnologias Utilizadas

### Back-end & Infraestrutura
- **Java 21**: Linguagem principal.
- **Micronaut 4**: Framework ultrarrápido ideal para microserviços.
- **Netty**: Servidor reativo assíncrono.
- **MapStruct**: Mapeamento automático entre entidades e DTOs.
- **Flyway**: Migrations versionadas do banco de dados.
- **PostgreSQL**: Persistência de dados (Porta Host `5433` / Docker `5432`).
- **PGWeb (Database Studio)**: Interface visual para o banco de dados (Porta `8090`).
- **Docker & Docker Compose**: Orquestração de todo o ecossistema.

### Front-end
- **Next.js & React**: Construção das telas.
- **TypeScript**: Tipagem forte.
- **TailwindCSS**: Estilização Utility-First.

---

## 🗄️ Database Studio (PGWeb)

O projeto inclui o **PGWeb**, uma ferramenta visual leve que permite gerenciar e visualizar seu banco de dados PostgreSQL diretamente no navegador, sem precisar instalar softwares como DBeaver ou pgAdmin.

### Como Acessar
Sempre que os containers estiverem rodando (via `scripts/run-local.ps1` ou `docker-compose up`), você pode acessar:
- **URL**: [http://localhost:8090](http://localhost:8090)
- **Conexão**: A conexão é feita **automaticamente** pelo container (utilizando a `DATABASE_URL` interna).

### Funcionalidades principais:
1.  **Visualizar Tabelas**: Na barra lateral esquerda, você encontrará as tabelas de cada microserviço (`agent`, `client`, `automovel`, `pedido`, `reserva`, `contrato`, etc.).
2.  **Explorar Dados**: Clique em uma tabela para ver todos os registros inseridos.
3.  **Executar SQL**: Use a aba **"Query"** para rodar comandos SQL manualmente.
4.  **Exportação**: Você pode exportar tabelas inteiras para formatos como CSV ou JSON.

---

## 🚀 Instalação e Execução

Para rodar todo o sistema de uma vez na sua máquina, é muito simples.

### Pré-requisitos
- **Java 21** instalado localmente (`JAVA_HOME` configurado).
- **Docker Desktop** rodando.
- Node.js instalado.

### Configurando o Back-end
1. Acesse os diretórios de cada microserviço e crie os arquivos `.env` copiando os padrões `.env.example` fornecidos (para incluir as senhas e URLs locais).
2. Abra o terminal na pasta `Codigo/server` e suba a orquestra inteira de uma vez via nosso script:
   ```bash
   .\scripts\dev.cmd rebuild
   ```
   > Esse comando compila todo o código Java, destrói versões velhas, constrói os Containers e abre a porta 8000.

### Configurando o Front-end
1. Em outro terminal, vá para a pasta `Codigo/client` e instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor Next.js:
   ```bash
   npm run dev
   ```
3. O sistema estará acessível em `http://localhost:3000`.

---

## 👥 Equipe

| 👤 Nome             | 🖼️ Foto                                                                                                                         | :octocat: GitHub                                                                                                                                                   | 💼 LinkedIn                                                                                                                                                                                  |
| ---------           | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eric Leal           | <div align="center"><img src="https://github.com/Eric-Leal.png" width="70px" height="70px" style="object-fit: cover;"></div>    | <div align="center"><a href="https://github.com/Eric-Leal"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div>    | <div align="center"><a href="https://linkedin.com/in/ericgleal"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div>                      |
| Laura Pontara       | <div align="center"><img src="https://github.com/LauraPontara.png" width="70px" height="70px" style="object-fit: cover;"></div> | <div align="center"><a href="https://github.com/LauraPontara"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://linkedin.com/in/laura-pontara"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div>                  |
| Giuliano Percope    | <div align="center"><img src="https://github.com/GiulianoLBP.png" width="70px" height="70px" style="object-fit: cover;"></div>  | <div align="center"><a href="https://github.com/GiulianoLBP"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div>  | <div align="center"><a href="https://www.linkedin.com/in/giuliano-lb-percope/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div>       |
---

## 📝 Licença e Agradecimentos

Este projeto foi desenvolvido para fins acadêmicos como parte do Laboratório de Desenvolvimento de Software da PUC Minas.  
Agradecimentos especiais ao professor **João Paulo Carneiro Aramuni** pela orientação, suporte e ensinamentos valiosos no decorrer da disciplina.
