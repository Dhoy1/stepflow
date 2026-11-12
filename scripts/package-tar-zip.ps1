$dest = "c:\laragon\www\Record\web.zip"
if (Test-Path $dest) { Remove-Item $dest -Force }

Set-Location "c:\laragon\www\Record\web"
tar -a -cf $dest --exclude="node_modules" --exclude=".env.local" --exclude=".git" .next data scripts src supabase .env.example next-env.d.ts next.config.mjs package-lock.json package.json postcss.config.js tailwind.config.ts tsconfig.json tsconfig.tsbuildinfo
Set-Location "c:\laragon\www\Record"

Get-Item $dest | Select-Object Name, Length, LastWriteTime

