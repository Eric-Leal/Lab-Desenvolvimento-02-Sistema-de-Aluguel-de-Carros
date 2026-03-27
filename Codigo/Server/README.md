# Server - Execucao dos dois microservicos

Use sempre esta pasta (`Codigo/Server`) como ponto central para subir tudo.

## Pre-requisitos

- Java 21
- Docker Desktop em execucao
- Credenciais preenchidas em:
	- `Codigo/Server/microsservico/.env`
	- `Codigo/Server/microsservico-b/.env`

- **Nota:** Os arquivos ` .env` e ` .env.local` devem existir no diretório do serviço correspondente para que o modo escolhido funcione corretamente (os scripts e o dispatcher carregam variáveis destes arquivos). Garanta que ambos estejam presentes e preenchidos antes de rodar no modo local ou em container.

## Comandos

```powershell
.\scripts\dev.cmd up
```

Acoes disponiveis:

- `up`: builda os dois microservicos e sobe os dois containers.
- `check`: valida `http://localhost:8080/ping` e `http://localhost:8081/ping` com status 200.
- `logs`: acompanha logs dos dois servicos.
- `rebuild`: derruba, recompila os dois e sobe novamente.
- `down`: derruba os containers e remove orfaos.

## Posso rodar da pasta A ou B?

Sim. Os scripts locais de `microsservico` e `microsservico-b` redirecionam para o script global em `Codigo/Server/scripts/dev.ps1`.

Entao estes comandos funcionam de qualquer uma das tres pastas:

- `Codigo/Server`
- `Codigo/Server/microsservico`
- `Codigo/Server/microsservico-b`

Em qualquer caso, a acao sempre sobe os dois servicos juntos.


## Run-local (desenvolvimento individual)

> **Importante:** O script `..\scripts\run-local.ps1` já inicia o banco Postgres necessário para execução local, portanto NÃO é necessário executar `docker-compose up -d postgres` manualmente — basta executar o script do serviço. Se preferir controlar o banco separadamente, o `docker-compose` continua disponível.

**Passos para rodar local:**
1. Rode o microserviço localmente (na pasta do serviço):
	```
	cd Codigo/Server/microsservico
	..\scripts\run-local.ps1
	```
- **Observação:** Para executar um microserviço localmente, ambos os microserviços NÃO podem estar rodando em container (por exemplo, iniciados por `..\scripts\dev.cmd up`). Se você tiver subido os serviços via Docker, pare-os primeiro com:
	```
	..\scripts\dev.cmd down
	```

Se quiser rodar tudo em container, use `dev.cmd up` normalmente.

Para executar um microserviço localmente (IDE/terminal) sem dependências adicionais, existe um dispatcher global que carrega o arquivo `.env` do serviço e inicia o `mvnw` no diretório do serviço.

- Rodar a partir da pasta do serviço:

```powershell
cd Codigo/Server/microsservico
..\scripts\run-local.ps1

# Em outro terminal para o outro serviço (se desejar rodar localmente também)
cd Codigo/Server/microsservico-b
..\scripts\run-local.ps1
```

- Observação: o dispatcher infere o nome do serviço a partir da pasta atual, então não é necessário passar parâmetros.


## Docker vs Local — importante

**Resumo prático:**

- Rodar tudo via Docker (`dev.cmd up` ou `docker-compose up -d --build`) é ideal para testar a integração dos microserviços juntos, principalmente após finalizar o desenvolvimento de cada um. Assim, você garante que tudo funciona em conjunto, simulando o ambiente de produção.
- O modo `run-local` é recomendado para o desenvolvimento do dia a dia, pois permite rodar e debugar cada microserviço individualmente, com recarga rápida e sem precisar rebuildar containers a cada alteração.

**Dica:** Use Docker para testes integrados e validação final. Use `run-local` para desenvolvimento rápido e iterativo.

- Não execute a mesma aplicação duas vezes (container + processo local). Isso causa conflito de porta (Address already in use) e comportamento inesperado.
- Recomendações:
	- Recomendações:
		- Modo Docker-only: use `..\scripts\dev.cmd up` (ou `docker-compose up -d --build`) e abra os endpoints em `http://localhost:8080` e `http://localhost:8081`.
		- Modo Local-only: o script `..\scripts\run-local.ps1` já inicia o Postgres necessário, portanto basta rodar os microserviços localmente com `..\scripts\run-local.ps1` dentro de cada pasta. Se preferir controlar o banco separadamente, inicie o Postgres com `docker-compose up -d postgres`.
		- Mixed mode: possível, mas ajuste os `DB_URL` conforme explicado nos exemplos (`postgres:5432` para containers, `localhost:5433` para processos locais conectando ao Postgres em container).
		- Se tiver serviços rodando em container (ex: iniciados por `..\scripts\dev.cmd up`), pare-os antes de rodar localmente com:
			```
			..\scripts\dev.cmd down
			```

Usar o modo local é útil para debugar e testar mudanças de código rapidamente sem rebuildar containers.

### Subir um único serviço com Docker

- Você pode subir apenas um serviço do compose em vez de todos. Exemplo (na pasta `Codigo/Server`):

```powershell
docker-compose up -d microsservico
docker-compose up -d microsservico-b
```

- O `docker-compose` também iniciará automaticamente serviços dos quais ele dependa (definidos em `depends_on`).
- Se quiser usar o compose antigo (que inclui Postgres local), especifique o arquivo:

```powershell
docker-compose -f docker-compose-antigo.yml up -d postgres
docker-compose -f docker-compose-antigo.yml up -d microsservico
```

### Run-local vs Docker (resumo prático)

- `run-local` não inicia containers: ele apenas carrega o `.env` do serviço e executa `mvnw` localmente.
- Se o seu serviço precisa de Postgres e você não tem um banco remoto (Supabase), suba apenas o Postgres em container e rode o serviço localmente:

```powershell
docker-compose -f docker-compose-antigo.yml up -d postgres
cd Codigo/Server/microsservico
..\scripts\run-local.ps1
```

- Evite rodar o mesmo serviço no container e local ao mesmo tempo — causa conflito de porta. Use `docker-compose ps` e `docker ps` para inspecionar.

## Ver logs no Docker

Se estiver usando Docker, os logs dos serviços podem ser acompanhados com:

```powershell
cd Codigo/Server
docker-compose logs -f microsservico
docker-compose logs -f microsservico-b
```

Ou para ver todos os serviços:

```powershell
docker-compose logs -f
```

## Validacao rapida

```powershell
.\scripts\dev.cmd check
```

Endpoints publicos esperados:

- `http://localhost:8080/`
- `http://localhost:8080/ping`
- `http://localhost:8081/`
- `http://localhost:8081/ping`


## Requisitos de Ambiente e Variáveis

- É obrigatório ter o Java 21 instalado. O projeto foi configurado e testado apenas com Java 21. Outras versões (ex: Java 25) podem não funcionar devido à configuração do Maven e dependências do Micronaut. Recomenda-se fortemente usar exatamente o Java 21.
- A variável de ambiente `JAVA_HOME` deve estar definida e apontando para o diretório de instalação do Java 21.
	- No Windows: Exemplo de valor: `C:\Program Files\Java\jdk-21`
	- No Linux/macOS: Exemplo de valor: `/usr/lib/jvm/java-21-openjdk`
- O comando `java` deve estar disponível no PATH e corresponder ao Java 21.
- Docker Desktop deve estar rodando.
- As credenciais `.env` devem estar preenchidas conforme instruções acima.

### Como verificar o Java

Abra um terminal e execute:

```powershell
java -version
```
O resultado deve indicar Java 21. Se aparecer outra versão, ajuste o JAVA_HOME e o PATH.

Se você tiver apenas o Java 25 instalado, o projeto provavelmente não irá compilar ou rodar corretamente. Instale o Java 21 e configure como padrão.

---
## Troubleshooting

- `401 Unauthorized` na raiz:
	- Rode `rebuild` para garantir que os endpoints publicos mais novos foram publicados.
	- Verifique `http://localhost:8080/ping` e `http://localhost:8081/ping`.
- Pasta vermelha no Explorer do VS Code:
	- Normalmente e decoracao de Source Control (arquivo modificado/novo/deletado), nao erro de compilacao.
	- Confira com `git status --short` na raiz do repositorio.
