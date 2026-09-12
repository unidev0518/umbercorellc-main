# Run from repo root: .\scripts\push-to-github.ps1
# Requires: GitHub PAT with "repo" scope in GITHUB_TOKEN env, or paste when prompted.

$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

Set-Location (Split-Path $PSScriptRoot -Parent)

$tokenFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".github-token"
if (-not $env:GITHUB_TOKEN -and (Test-Path $tokenFile)) {
  $env:GITHUB_TOKEN = (Get-Content $tokenFile -Raw).Trim()
}

if (-not $env:GITHUB_TOKEN) {
  $secure = Read-Host "GitHub personal access token" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try {
    $env:GITHUB_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

$token = $env:GITHUB_TOKEN.Trim()
if (-not $token) { throw "GITHUB_TOKEN is empty" }

$headers = @{
  Authorization = "Bearer $token"
  "User-Agent"  = "umbercore-push"
}

$user = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
$repo = if ($args[0]) { $args[0] } else { "Business" }

Write-Host "GitHub user: $($user.login) | Repo: $repo"

try {
  $body = @{ name = $repo; private = $true; description = "UmberCore marketing web app (monorepo)" } | ConvertTo-Json
  Invoke-RestMethod -Method POST -Uri "https://api.github.com/user/repos" -Headers $headers -ContentType "application/json" -Body $body | Out-Null
  Write-Host "Created repository: $($user.login)/$repo"
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 422) {
    Write-Host "Repository already exists - pushing to it."
  } else {
    throw
  }
}

if (-not (Test-Path .git)) { git init }
$status = git status --porcelain
if ($status) {
  git add .
  git -c "user.name=$($user.login)" -c "user.email=$($user.id)+$($user.login)@users.noreply.github.com" commit -m "Update: UmberCore marketing web app"
}

git branch -M main 2>$null
git remote remove origin 2>&1 | Out-Null
if ($LASTEXITCODE -gt 1) { $global:LASTEXITCODE = 0 }
$originUrl = "https://x-access-token:${token}@github.com/$($user.login)/$repo.git"
if (git remote get-url origin 2>$null) {
  git remote set-url origin $originUrl
} else {
  git remote add origin $originUrl
}
git push -u origin main

Write-Host ""
Write-Host "Done: https://github.com/$($user.login)/$repo"
Remove-Item Env:GITHUB_TOKEN -ErrorAction SilentlyContinue
