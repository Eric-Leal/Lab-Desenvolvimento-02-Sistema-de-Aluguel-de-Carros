param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("up", "down", "logs", "check", "rebuild")]
    [string]$Action = "up"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $projectRoot

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
            Invoke-Step { Push-Location .\microsservico; .\mvnw.bat -q -DskipTests package; Pop-Location }
            Invoke-Step { Push-Location .\microsservico-b; .\mvnw.bat -q -DskipTests package; Pop-Location }
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
            Wait-Http200 -Url "http://localhost:8000/microsservico/ping"
            Wait-Http200 -Url "http://localhost:8000/microsservico-b/ping"
            Write-Host "Health check OK via Gateway (Porta 8000)"
        }
        "rebuild" {
            Invoke-Step { docker compose down --remove-orphans }
            Invoke-Step { Push-Location .\gateway; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\microsservico; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { Push-Location .\microsservico-b; .\mvnw.bat -q -DskipTests clean package; Pop-Location }
            Invoke-Step { docker compose up -d }
            Write-Host "Rebuild concluido para os tres servicos (incluindo Gateway)"
        }
    }
}
finally {
    Pop-Location
}
