#!/usr/bin/env pwsh

# Clean up Next.js dynamic route conflicts
Write-Host "Cleaning up dynamic route conflicts..." -ForegroundColor Green

# Stop any running Next.js processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove .next cache
$nextDir = "./.next"
if (Test-Path $nextDir) {
    Write-Host "Removing Next.js cache..." -ForegroundColor Yellow
    Remove-Item $nextDir -Recurse -Force
}

# Remove node_modules/.cache
$cacheDir = "./node_modules/.cache"
if (Test-Path $cacheDir) {
    Write-Host "Removing Node cache..." -ForegroundColor Yellow
    Remove-Item $cacheDir -Recurse -Force
}

# Define conflicting routes to remove
$routesToRemove = @(
    "./app/api/articles/`[id`]",
    "./app/articles/`[articleId`]",
    "./app/magazine/`[id`]",
    "./app/magazine/view/`[magazineId`]"
)

foreach ($route in $routesToRemove) {
    if (Test-Path $route) {
        Write-Host "Removing conflicting route: $route" -ForegroundColor Red
        Remove-Item $route -Recurse -Force
    }
}

Write-Host "Route cleanup completed!" -ForegroundColor Green
Write-Host "Remaining dynamic routes:" -ForegroundColor Cyan

# Show remaining dynamic routes
Get-ChildItem -Path "./app" -Recurse -Directory | Where-Object {$_.Name -match '\[.*\]'} | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").Replace("\", "/")
    Write-Host "  $relativePath" -ForegroundColor White
}

Write-Host "`nYou can now run 'npm run dev' to start the server." -ForegroundColor Green
