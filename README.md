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
- 📍 [Diagrama de Caso de Uso (PNG)](docs/diagramas/Diagrama%20de%20Caso%20de%20Uso.png)
- 🧩 [Diagrama de Classe (PNG)](docs/diagramas/Diagrama%20de%20classe.png)
- 📦 [Diagrama de Pacotes (PNG)](docs/diagramas/Diagrama%20de%20Pacotes.png)

---

## 🏗️ Arquitetura de Microserviços

O sistema foge do padrão monolítico tradicional e adota um padrão de mercado:

1. **Front-end (Next.js)**: Uma SPA isolada que não conhece as portas do servidor, comunicando-se unicamente com a porta 8000.
2. **API Gateway (Porta 8000)**: Construído em Micronaut. Sua função é receber todo o tráfego do React, tratar as políticas do navegador (CORS), remover prefixos (Strip Prefix) e fazer o balanceamento inteligente enviando a requisição para o microserviço correspondente.
3. **Microserviços (Netty)**: Diversos módulos back-end construídos em Java rodando em portas seladas através do Docker (ex: Serviço A, Serviço B).  
4. **PostgreSQL**: Banco de dados relacional isolado também containerizado.

---

## 📁 Estrutura do Projeto

O repositório está organizado de forma totalmente modular (Monorepo). Abaixo está o detalhamento completo de cada diretório e arquivo essencial do ecossistema:

### 1. 📂 Documentação e Diagramas (`/docs`)
Central de artefatos de engenharia de software e modelos:
```text
docs/
├── diagramas/               # 📍 Protótipos Astor (.asta), exportações PNG e diagramas de classe/pacotes
├── historias-de-usuarios/   # 📖 PDF detalhado das Histórias de Usuário (Requisitos)
└── READMEexemplo.md         # 📘 Modelo de referência para a formatação do portfólio
```

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

### 3. ⚙️ Infraestrutura Back-end (`/Codigo/server`)
O núcleo que rege a orquestração de containers e ferramentas de auxílio ao Dev:
```text
Codigo/server/
├── scripts/                # 📜 Scripts de automação (dev.cmd, dev.ps1, run-local.ps1)
├── env-pattern/            # 📝 Catálogo de modelos .ENV para clonagem inicial
├── docker-compose.yml      # 🐳 O maestro que sobe os JARs, o Postgres e a rede interna
├── README.md               # 📘 Guia rápido operacional do servidor
├── AI_CONTEXT.md           # 🧠 Contexto de arquitetura para assistentes generativos (IA)
└── MICROSERVICE_TEMPLATE.md# 📘 Checklist de criação para novos serviços Netty
```

### 4. 🚪 API Gateway (`/Codigo/server/gateway`)
Ponto de entrada único via porta 8000, responsável pelo roteamento reativo e CORS:
```text
Codigo/server/gateway/
├── .mvn/                   # 📦 Wrapper do Maven para consistência de versão
├── pom.xml                 # 📄 Configurações do projeto e dependências do Micronaut HTTP Client
├── mvnw / mvnw.bat         # 🚀 Executáveis do Maven Local
├── README.md               # 📖 Documentação técnica interna do roteamento do gateway
└── src/
    ├── main/resources/     # ⚙️ application.yml (Mapeamento de portas e targets Docker)
    └── main/java/gateway/
        ├── controller/     # 🎛️ Roteadores modulares (AController, BController, etc.)
        ├── service/        # 🛠️ ProxyFacadeService (Manipulador de CORS e URI)
        └── Application.java# 🚀 Classe Main (Bootstrapping da porta 8000)
```

### 5. 📦 Padrão Microsserviço (`/Codigo/server/[nome-do-serviço]`)
Arquitetura robusta de camadas que todos os domínios (A, B, C...) executam:
```text
Codigo/server/[serviço]/
├── .mvn/                   # 📦 Maven Wrapper local do serviço
├── pom.xml                 # 📄 Gestão de dependências (Flyway, JPA, Postgres Driver)
├── mvnw / mvnw.bat         # 🚀 Executáveis Maven específicos do domínio
├── README.md               # 📖 Regras de negócio internas documentadas
├── .env / .env.local       # 🔐 Injeção de senhas, usuário DB e porta secreta
└── src/main/
    ├── resources/          # ⚙️ application.properties (Configuração Hikari e Flyway)
    └── java/com/example/
        ├── config/         # ⚙️ Beans de configuração e segurança
        ├── controller/     # 🎯 Endpoints HTTP (Trabalham a partir da raíz /)
        ├── service/        # 🧠 Lógica rica e processamento de regras
        ├── repository/     # 🗄️ Camada de persistência JDBC/JPA
        ├── model/          # 💾 Entidades que mapeiam as tabelas SQL
        ├── dto/            # 📦 Requests e Responses (Isolamento de dados)
        ├── enums/          # 📋 Enumeradores globais do domínio
        ├── exception/      # ⚠️ Exception Handlers e retornos de erro
        ├── facade/         # 🎭 Orquestrador de processos entre serviços
        └── Application.java# 🚀 Ponto de ignição do Microserviço
```

---

## 🛠️ Tecnologias Utilizadas

### Back-end & Infraestrutura
- **Java 21**: Linguagem principal.
- **Micronaut 4**: Framework ultrarrápido ideal para microserviços.
- **Netty**: Servidor reativo assíncrono.
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
1.  **Visualizar Tabelas**: Na barra lateral esquerda, você encontrará tabelas como `agent`, `client`, `address`, `emprego`, etc.
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
1. Acesse os diretórios dos microserviços (`Codigo/server/microsservico` e `Codigo/server/microsservico-b`).
2. Crie os arquivos `.env` copiando o padrão fornecido (para incluir as senhas e URLs locais).
3. Abra o terminal na pasta `Codigo/server` e suba a orquestra inteira de uma vez via nosso script:
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
