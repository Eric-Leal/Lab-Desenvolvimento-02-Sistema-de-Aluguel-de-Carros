<#
Global dispatcher: detect current microservice and run its local runner.

Usage:
  From a microservice folder (recommended):
    cd Codigo/Server/microsservico
    ..\scripts\run-local.ps1

  Or from repo root, pass service name:
    cd Codigo/Server
    .\scripts\run-local.ps1 microsservico-b

Behavior:
  - If run from inside a microservice folder and that folder contains `run-local.ps1`, it will be executed.
  - If run from the repo root with a service name, it will look for that service folder.
  - If no `run-local.ps1` is present but `mvnw.bat` exists, the script will load the service `.env` and run `mvnw.bat mn:run`.
#>

param(
    [string]$Service
)

$cwd = (Get-Location).Path
$leaf = Split-Path -Leaf $cwd

if (-not $Service) {
    # Infer service from current folder name
    $Service = $leaf
}

if (-not $Service) {
    Write-Error "Service not specified and could not infer from current folder. Provide a service name."
    exit 1
}

$servicePath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) "..\$Service"
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

# Fallback: load .env and run mvnw.bat
$envFile = Join-Path $servicePath '.env'
if (-not (Test-Path $envFile)) {
    Write-Error "No .env and no run-local.ps1 found in $servicePath"
    exit 1
}

Get-Content $envFile | ForEach-Object {
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

Push-Location $servicePath
try {
    & .\mvnw.bat mn:run
} finally {
    Pop-Location
}
