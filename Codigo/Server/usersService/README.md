# Microsservico

Este servico usa orquestracao Docker global na pasta `Codigo/Server`.

Use o guia principal em `Codigo/Server/README.md`.

Comando rapido:

```powershell
.\scripts\dev.cmd up
```

Esse comando local redireciona para o script global e sobe os dois microservicos juntos.

## Executar localmente apenas este serviço

Para rodar só este microsserviço localmente (com as variáveis do `.env` carregadas):

```powershell
..\scripts\run-local.ps1
```

O script detecta automaticamente o serviço pela pasta atual. Certifique-se de que o Postgres esteja rodando (pode ser via Docker Compose).


