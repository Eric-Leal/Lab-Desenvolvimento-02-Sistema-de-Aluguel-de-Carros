param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("up", "down", "logs", "check", "rebuild")]
    [string]$Action = "up"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

# Auto-detectar JAVA_HOME se nao estiver definido
if (-not $env:JAVA_HOME) {
    $javaInstallations = Get-ChildItem "C:\Program Files\Java" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending
    if ($javaInstallations) {
        $env:JAVA_HOME = $javaInstallations[0].FullName
        Write-Host "JAVA_HOME auto-detectado: $($env:JAVA_HOME)" -ForegroundColor Green
    }
    else {
        throw "JAVA_HOME nao encontrado. Instale Java 21 em C:\Program Files\Java\ ou defina a variavel manualmente."
    }
}

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [scriptblock]$Command
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Comando falhou com codigo $LASTEXITCODE"
    }
}

function Assert-Http200 {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
        if ($response.StatusCode -ne 200) {
            throw "Status inesperado: $($response.StatusCode)"
        }
    }
    catch {
        throw "Falha no endpoint $Url. Detalhe: $($_.Exception.Message)"
    }
}

function Wait-Http200 {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,
        [int]$Attempts = 10,
        [int]$DelaySeconds = 2
    )

    for ($i = 1; $i -le $Attempts; $i++) {
        try {
            Assert-Http200 -Url $Url
            return
        }
        catch {
            if ($i -eq $Attempts) {
                throw
            }
            Start-Sleep -Seconds $DelaySeconds
        }
    }
}

try {
    switch ($Action) {
        "up" {
            Invoke-Step { Push-Location .\gateway; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { Push-Location .\usersService; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { Push-Location .\vehiclesService; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { Push-Location .\rentalsService; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { Push-Location .\reservasService; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { docker compose up -d }
            Write-Host "Servicos iniciados. Gateway em http://localhost:8000"
        }
        "down" {
            Invoke-Step { docker compose down --remove-orphans }
        }
        "logs" {
            docker compose logs -f --tail=200
        }
        "check" {
            Wait-Http200 -Url "http://localhost:8000/usersService/ping"
            Write-Host "✓ usersService OK (8080)"
            Wait-Http200 -Url "http://localhost:8000/vehiclesService/ping"
            Write-Host "✓ vehiclesService OK (8081)"
            Wait-Http200 -Url "http://localhost:8000/rentalsService/ping"
            Write-Host "✓ rentalsService OK (8082)"
            Wait-Http200 -Url "http://localhost:8000/contratoService/ping"
            Write-Host "✓ contratoService OK (8083)"
            Wait-Http200 -Url "http://localhost:8000/reservasService/ping"
            Write-Host "✓ reservasService OK (8084)"
            Write-Host "Health check OK via Gateway (Porta 8000)"
        }
        "rebuild" {
            Invoke-Step { docker compose down --remove-orphans }
            Invoke-Step { Push-Location .\gateway; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\usersService; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\vehiclesService; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\rentalsService; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\contratoService; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\reservasService; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { docker compose up -d }
            Write-Host "Rebuild concluido para todos os servicos"
        }
    }
}
finally {
    Pop-Location
}
