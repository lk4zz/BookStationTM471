param(
    [string]$userId = "1"
)

Write-Host "----- STEP 1: Exporting taste map JSON -----"

cd ../../

node scripts/exportTasteMapJson.js --out=taste_map_export.json --userId=$userId

if ($LASTEXITCODE -ne 0) {
    Write-Host "Export failed. Fix your backend before pretending this works."
    exit
}

Write-Host "----- STEP 2: Generating visualization -----"

cd tools/taste_map

python plot_taste_map.py --json ../../taste_map_export.json --out taste_map.html --color-by cluster

if ($LASTEXITCODE -ne 0) {
    Write-Host "Python failed. Your environment is probably cursed."
    exit
}

Write-Host "----- STEP 3: Opening map -----"

start taste_map.html

Write-Host "Done. Go stare at your data like it owes you money."