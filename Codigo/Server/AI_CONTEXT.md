# AI Context - Server Workspace

## Scope

This file is a quick context for AI assistants and new contributors working in `Codigo/Server`.

## Project Layout

- `microsservico`: service A (port 8080)
- `microsservico-b`: service B (port 8081)
- `docker-compose.yml` (in `Codigo/Server`): global orchestration for both services
- `scripts/dev.ps1` and `scripts/dev.cmd`: global automation entrypoint
- `env-pattern`: examples/templates for env organization across services

## Run Flow (single source of truth)

Run from `Codigo/Server`:

```powershell
.\scripts\dev.cmd up
.\scripts\dev.cmd check
.\scripts\dev.cmd logs
.\scripts\dev.cmd down
```

Local service scripts in each microservice folder just forward to the global script.

## Environment

Expected files:

- `microsservico/.env`
- `microsservico-b/.env`

Both services currently read:

- `DB_URL`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_GENERATOR_SIGNATURE_SECRET`

## Public Endpoints (for smoke test)

- `http://localhost:8080/`
- `http://localhost:8080/ping`
- `http://localhost:8081/`
- `http://localhost:8081/ping`

`/ping` should return HTTP 200 on both services.

## Package Structure Convention

Both services already contain the package directories below (empty by design initially):

- `controller`
- `facade`
- `service`
- `repository`
- `model`
- `config`
- `enums`
- `exception`

## Known IDE Notes

- If Java files appear as `non-project file`, Maven project import in VS Code is usually stale.
- Recommended workspace setting: auto update build configuration.
- Source-control red folders generally indicate Git changes (not compile errors).

## Team Guidance

- Keep Docker orchestration at `Codigo/Server` level.
- Avoid adding per-service compose files unless absolutely required.
- Keep service READMEs short and point to global README.
