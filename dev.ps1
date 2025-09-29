# Kill any existing node processes
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Killed existing Node.js processes"
} else {
    Write-Host "No existing Node.js processes found"
}

# Small delay to ensure ports are freed
Start-Sleep -Seconds 1

# Start the dev server
npm run dev
