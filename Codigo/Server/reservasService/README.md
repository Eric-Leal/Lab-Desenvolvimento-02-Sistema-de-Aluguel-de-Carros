# MS-E - Reservas Service

Microserviço responsável pela gestão de agenda e disponibilidade de veículos.

## Funcionalidades

- Verificação de disponibilidade de veículos
- Bloqueio de períodos (integração com MS-D)
- Visualização de agenda completa
- Validação de sobreposição com query de overlap

## Desenvolvimento Local

```bash
# .env deve estar configurado em reservasService/
# Depois:
..\scripts\run-local.ps1
```

## Docker

Atualizar `/docker-compose.yml` para incluir este serviço.
