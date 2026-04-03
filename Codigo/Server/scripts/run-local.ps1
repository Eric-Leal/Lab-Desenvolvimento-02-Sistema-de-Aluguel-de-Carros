<#
Global dispatcher: detect current microservice and run its local runner.

Usage:
  From a microservice folder (recommended):
    cd Codigo/Server/usersService
    ..\scripts\run-local.ps1

  Or from repo root, pass service name:
    cd Codigo/Server
    .\scripts\run-local.ps1 microsservico-b

Behavior:
  - If run from inside a microservice folder and that folder contains `run-local.ps1`, it will be executed.
  - If run from the repo root with a service name, it will look for that service folder.
  - If no `run-local.ps1` is present but `mvnw.bat` exists, the script will load the service `.env` and run `mvnw.bat mn:run`.
  - Loads .env first, then .env.local overrides (if exists).
  - Ensures postgres is running via docker compose before starting the service.
#>

param(
    [string]$Service
)

$cwd = (Get-Location).Path
$leaf = Split-Path -Leaf $cwd

if (-not $Service) {
    $Service = $leaf
}

if (-not $Service) {
    Write-Error "Service not specified and could not infer from current folder. Provide a service name."
    exit 1
}

$scriptsDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$serverRoot = (Resolve-Path (Join-Path $scriptsDir "..")).Path

$servicePath = Join-Path $serverRoot $Service
$servicePath = (Resolve-Path $servicePath).Path

if (-not (Test-Path $servicePath)) {
    Write-Error "Service path not found: $servicePath"
    exit 1
}

$runner = Join-Path $servicePath 'run-local.ps1'
if (Test-Path $runner) {
    Write-Host "Dispatching to $runner"
    & $runner
    exit $LASTEXITCODE
}

# Garante que o postgres está rodando
Write-Host "Garantindo que o postgres esta rodando..."
Push-Location $serverRoot
try {
    docker compose up -d postgres
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha ao subir o postgres."
        exit 1
    }
} finally {
    Pop-Location
}

# Função para carregar um arquivo .env
function Load-EnvFile {
    param([string]$Path)

    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq '' -or $line.StartsWith('#')) { return }
        $parts = $line -split '=', 2
        if ($parts.Count -ne 2) { return }
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Trim('"') }
        if ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Trim("'") }
        Set-Item -Path "Env:$key" -Value $value
    }
}

# Carrega .env base
$envFile = Join-Path $servicePath '.env'
if (-not (Test-Path $envFile)) {
    Write-Error "No .env and no run-local.ps1 found in $servicePath"
    exit 1
}
Write-Host "Carregando $envFile..."
Load-EnvFile -Path $envFile

# Sobrescreve com .env.local se existir
$envLocalFile = Join-Path $servicePath '.env.local'
if (Test-Path $envLocalFile) {
    Write-Host "Carregando $envLocalFile (override)..."
    Load-EnvFile -Path $envLocalFile
}

Push-Location $servicePath
try {
    & .\mvnw.bat mn:run
} finally {
    Pop-Location
}
