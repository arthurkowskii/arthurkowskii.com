# Full deploy.ps1
$SourceRepo = "C:\Users\arthu\Documents\GIT\Atom_Portfolio"
$DistRepo   = "C:\Users\arthu\Documents\GIT\Atom_Portfolio_Dist_Build"

# Step 1: Build
Write-Output "--- Building project ---"
Set-Location $SourceRepo
npm run build

# Step 2: Copy built files
Write-Output "--- Cleaning dist repo ---"
Remove-Item -Recurse -Force "$DistRepo\*" -ErrorAction Stop

Write-Output "--- Copying files to dist repo ---"
Copy-Item "$SourceRepo\dist\*" "$DistRepo" -Recurse -Force -ErrorAction Stop

# Step 3: Git commit + push
Set-Location $DistRepo
if (Test-Path "$DistRepo\.git") {
    git add .
    try {
        git commit -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    } catch {
        Write-Output "Nothing to commit."
    }
    git push
} else {
    Write-Output "❌ Error: '$DistRepo' is not a Git repository."
}
