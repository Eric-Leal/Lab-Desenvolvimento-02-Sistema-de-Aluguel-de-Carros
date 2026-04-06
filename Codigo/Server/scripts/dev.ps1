param(
    [Parameter(Mandatory = $false)]
    [ValidateSet('up', 'down', 'logs', 'check', 'rebuild')]
    [string]$Action = 'up'
)

# Limita o uso de memoria do Java durante o build (evita erro 1455)
$env:MAVEN_OPTS = '-Xmx256m'
$env:JAVA_TOOL_OPTIONS = '-Xmx256m'

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

if ($Action -eq 'up') {
    Write-Host 'Iniciando operacao UP com limite de memoria de 256MB...'
    Invoke-Expression 'Push-Location .\usersService; .\mvnw.bat -q -DskipTests package; Pop-Location'
    Invoke-Expression 'Push-Location .\vehiclesService; .\mvnw.bat -q -DskipTests package; Pop-Location'
    Invoke-Expression 'Push-Location .\rentalsService; .\mvnw.bat -q -DskipTests package; Pop-Location'
    Invoke-Expression 'Push-Location .\contratoService; .\mvnw.bat -q -DskipTests package; Pop-Location'
    Invoke-Expression 'Push-Location .\reservasService; .\mvnw.bat -q -DskipTests package; Pop-Location'
    Invoke-Expression 'Push-Location .\gateway; .\mvnw.bat -q -DskipTests package; Pop-Location'
    docker compose up -d
    Write-Host 'Servicos iniciados com sucesso.'
}
elseif ($Action -eq 'down') {
    docker compose down --remove-orphans
}
elseif ($Action -eq 'rebuild') {
    Write-Host 'Iniciando REBUILD com limite de memoria de 256MB...'
    docker compose down --remove-orphans
    Invoke-Expression 'Push-Location .\usersService; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    Invoke-Expression 'Push-Location .\vehiclesService; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    Invoke-Expression 'Push-Location .\rentalsService; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    Invoke-Expression 'Push-Location .\contratoService; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    Invoke-Expression 'Push-Location .\reservasService; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    Invoke-Expression 'Push-Location .\gateway; .\mvnw.bat -q -DskipTests clean package; Pop-Location'
    docker compose up -d
    Write-Host 'Rebuild finalizado.'
}

Pop-Location
