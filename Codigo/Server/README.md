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

## Troubleshooting

- `401 Unauthorized` na raiz:
	- Rode `rebuild` para garantir que os endpoints publicos mais novos foram publicados.
	- Verifique `http://localhost:8080/ping` e `http://localhost:8081/ping`.
- Pasta vermelha no Explorer do VS Code:
	- Normalmente e decoracao de Source Control (arquivo modificado/novo/deletado), nao erro de compilacao.
	- Confira com `git status --short` na raiz do repositorio.
