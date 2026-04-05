param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("up", "down", "logs", "check", "rebuild")]
    [string]$Action = "up"
)

$globalScript = Join-Path $PSScriptRoot "..\..\scripts\dev.ps1"
& $globalScript -Action $Action
exit $LASTEXITCODE
