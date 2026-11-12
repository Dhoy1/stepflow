$src = "c:\laragon\www\Record\web"
$dest = "c:\laragon\www\Record\web.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }

$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "hostinger_root_" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$items = Get-ChildItem -Path $src -Force | Where-Object { 
    $_.Name -notin @('node_modules', '.env.local', '.git') 
}

foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempDir -Recurse -Force
}

Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $dest -Force
Remove-Item -Path $tempDir -Recurse -Force

Get-Item $dest | Select-Object Name, Length, LastWriteTime

