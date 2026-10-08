# Traffix — Start All Services
# Run this from c:\Users\DELL\Desktop\Traffix\
# Usage: .\start.ps1

Write-Host ""
Write-Host "████████╗██████╗  █████╗ ███████╗███████╗██╗██╗  ██╗" -ForegroundColor Cyan
Write-Host "╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝██║╚██╗██╔╝" -ForegroundColor Cyan
Write-Host "   ██║   ██████╔╝███████║█████╗  █████╗  ██║ ╚███╔╝ " -ForegroundColor Cyan
Write-Host "   ██║   ██╔══██╗██╔══██║██╔══╝  ██╔══╝  ██║ ██╔██╗ " -ForegroundColor Cyan
Write-Host "   ██║   ██║  ██║██║  ██║██║     ██║     ██║██╔╝ ██╗" -ForegroundColor Cyan
Write-Host "   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝╚═╝  ╚═╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Coimbatore Metro Smart Mobility Platform" -ForegroundColor White
Write-Host "  Starting Frontend + Backend..." -ForegroundColor Gray
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Backend ──────────────────────────────────────────────────────
Write-Host "[BACKEND]  Starting FastAPI on http://localhost:8000" -ForegroundColor Yellow
$backendDir = Join-Path $root "backend"
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    python -m uvicorn app.main:app --port 8000 --reload
} -ArgumentList $backendDir

# ── Frontend ─────────────────────────────────────────────────────
Write-Host "[FRONTEND] Starting Next.js on http://localhost:3000" -ForegroundColor Cyan
$frontendDir = Join-Path $root "frontend"
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $frontendDir

Write-Host ""
Write-Host "  ✓ Both services launched!" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend  →  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend   →  http://localhost:8000" -ForegroundColor Yellow
Write-Host "  API Docs  →  http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Ctrl+C to stop both services." -ForegroundColor Gray
Write-Host ""

# Stream output from both jobs until Ctrl+C
try {
    while ($true) {
        $backendJob  | Receive-Job  | ForEach-Object { Write-Host "[BACKEND]  $_"  -ForegroundColor Yellow }
        $frontendJob | Receive-Job  | ForEach-Object { Write-Host "[FRONTEND] $_"  -ForegroundColor Cyan   }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`n  Stopping all services..." -ForegroundColor Red
    Stop-Job  $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob -Force
    Write-Host "  Done." -ForegroundColor Gray
}
