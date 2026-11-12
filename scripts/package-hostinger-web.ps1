$src = "c:\laragon\www\Record\web"
$dest = "c:\laragon\www\Record\web.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }

$tempRoot = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "hostinger_deploy_" + [System.Guid]::NewGuid().ToString())
$tempWebDir = Join-Path $tempRoot "web"
New-Item -ItemType Directory -Path $tempWebDir -Force | Out-Null

$items = Get-ChildItem -Path $src -Force | Where-Object { 
    $_.Name -notin @('node_modules', '.env.local', '.git') 
}

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempWebDir -Recurse -Force
}

# Remove .next/cache (not needed for deployment)
$cachePath = Join-Path $tempWebDir ".next\cache"
if (Test-Path $cachePath) {
    Remove-Item -Path $cachePath -Recurse -Force
}

Compress-Archive -Path $tempWebDir -DestinationPath $dest -Force
Remove-Item -Path $tempRoot -Recurse -Force

Get-Item $dest | Select-Object Name, Length, LastWriteTime

