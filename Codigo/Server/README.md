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
