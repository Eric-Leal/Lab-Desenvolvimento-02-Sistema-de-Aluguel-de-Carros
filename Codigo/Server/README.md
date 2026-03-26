# Server - Execucao dos dois microservicos

Use sempre esta pasta (`Codigo/Server`) como ponto central para subir tudo.

## Pre-requisitos

- Java 21
- Docker Desktop em execucao
- Credenciais preenchidas em:
	- `Codigo/Server/microsservico/.env`
	- `Codigo/Server/microsservico-b/.env`

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

- Não execute a mesma aplicação duas vezes (container + processo local). Isso causa conflito de porta (Address already in use) e comportamento inesperado.
- Recomendações:
	- Modo Docker-only: use `.	ools\dev.cmd up` (ou `docker-compose up -d --build`) e abra os endpoints em `http://localhost:8080` e `http://localhost:8081`.
	- Modo Local-only: execute apenas o Postgres via Docker (`docker-compose up -d postgres`) e rode os microserviços localmente com `..\scripts\run-local.ps1` dentro de cada pasta.
	- Mixed mode: possível, mas ajuste os `DB_URL` conforme explicado nos exemplos (`postgres:5432` para containers, `localhost:5433` para processos locais conectando ao Postgres em container).

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
