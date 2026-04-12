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

## Cloudinary para imagem de usuario

Defina no `.env` (Docker) e `.env.local` (execucao local):

```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
CLOUDINARY_FOLDER=users-service
```

O campo `imageUrl` agora faz parte das respostas de `Client` e `Agent`.

Nos requests de criacao e atualizacao de `Client` e `Agent`, o campo `imageBase64` (opcional) tambem pode ser enviado junto com os demais dados.
Pode ser no formato Data URI (`data:image/png;base64,...`) ou somente o base64 puro.

Endpoints novos (autenticados):

- `POST /client/{id}/image` (multipart/form-data com campo `file`)
- `DELETE /client/{id}/image`
- `POST /agent/{id}/image` (multipart/form-data com campo `file`)
- `DELETE /agent/{id}/image`


