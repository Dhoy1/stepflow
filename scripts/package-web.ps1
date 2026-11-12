$src = "c:\laragon\www\Record\web"
$dest = "c:\laragon\www\Record\web-deploy.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }

$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "web_deploy_" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

$items = Get-ChildItem -Path $src -Force | Where-Object { 
    $_.Name -notin @('node_modules', '.env.local', '.git') 
}

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempDir -Recurse -Force
}

# Remove .next/cache (compiler build cache with Windows binaries and dev webpack packs, not needed for production)
$cachePath = Join-Path $tempDir ".next\cache"
if (Test-Path $cachePath) {
    Remove-Item -Path $cachePath -Recurse -Force
}

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $dest -Force
Remove-Item -Path $tempDir -Recurse -Force

Get-Item $dest | Select-Object Name, Length, LastWriteTime
