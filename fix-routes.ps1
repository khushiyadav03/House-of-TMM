#!/usr/bin/env pwsh

Write-Host "=== TMM India Route Conflict Cleanup ===" -ForegroundColor Cyan

# Stop Next.js dev server
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force

# Clear caches
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# List of ALL conflicting directories that need to be removed
$conflictingDirs = @(
    "app\api\articles\[id]",
    "app\articles\[articleId]",
    "app\magazine\[id]", 
    "app\magazine\view\[magazineId]"
)

Write-Host "`nRemoving conflicting dynamic routes..." -ForegroundColor Yellow

foreach ($dir in $conflictingDirs) {
    if (Test-Path $dir) {
        Write-Host "Removing: $dir" -ForegroundColor Red
        try {
            # Try PowerShell first
            Remove-Item $dir -Recurse -Force -ErrorAction Stop
        } catch {
            # Fallback to CMD
            cmd /c "rmdir `"$dir`" /s /q 2>nul"
        }
        
        # Verify removal
        if (Test-Path $dir) {
            Write-Host "Failed to remove: $dir" -ForegroundColor Red
        } else {
            Write-Host "Successfully removed: $dir" -ForegroundColor Green
        }
    }
}

Write-Host "`nFinal verification of remaining dynamic routes:" -ForegroundColor Cyan
$remainingRoutes = Get-ChildItem -Path "app" -Recurse -Directory | Where-Object {$_.Name -match '\[.*\]'} | ForEach-Object {
    $_.FullName.Replace((Get-Location).Path + '\', '').Replace('\', '/')
}

if ($remainingRoutes) {
    $remainingRoutes | Sort-Object | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
    
    # Check for conflicts
    $articleRoutes = $remainingRoutes | Where-Object { $_ -like "app/api/articles/*" -or $_ -like "app/articles/*" }
    $magazineRoutes = $remainingRoutes | Where-Object { $_ -like "app/magazine/*" }
    
    $hasConflicts = $false
    
    if ($articleRoutes -contains "app/api/articles/[id]" -and $articleRoutes -contains "app/api/articles/[slug]") {
        Write-Host "`n⚠️  CONFLICT: app/api/articles has both [id] and [slug]" -ForegroundColor Red
        $hasConflicts = $true
    }
    
    if ($articleRoutes -contains "app/articles/[articleId]" -and $articleRoutes -contains "app/articles/[slug]") {
        Write-Host "⚠️  CONFLICT: app/articles has both [articleId] and [slug]" -ForegroundColor Red
        $hasConflicts = $true
    }
    
    $magazineIdRoutes = $magazineRoutes | Where-Object { $_ -like "*[id]*" }
    if ($magazineIdRoutes.Count -gt 1) {
        Write-Host "⚠️  CONFLICT: Multiple magazine [id] routes detected" -ForegroundColor Red
        $hasConflicts = $true
    }
    
    if (!$hasConflicts) {
        Write-Host "`n✅ No route conflicts detected!" -ForegroundColor Green
        Write-Host "You can now run: npm run dev" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Route conflicts still exist. Manual intervention required." -ForegroundColor Red
    }
} else {
    Write-Host "  No dynamic routes found!" -ForegroundColor Yellow
}
