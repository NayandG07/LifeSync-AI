#!/usr/bin/env pwsh

Write-Host "Starting migration process..." -ForegroundColor Green

# Define paths
$oldProjectPath = "D:\AndroidStudioProjects\lifesyncaiapp"
$newProjectPath = "D:\AndroidStudioProjects\temp_flutter_project\lifesyncaiapp"
$backupPath = "D:\AndroidStudioProjects\lifesyncaiapp_backup_$(Get-Date -Format "yyyyMMdd_HHmmss")"

# Step 1: Create a backup of the old project
Write-Host "Step 1: Creating a backup of the old project at $backupPath..." -ForegroundColor Cyan
Copy-Item -Path $oldProjectPath -Destination $backupPath -Recurse -Force
Write-Host "Backup created successfully." -ForegroundColor Green

# Step 2: Clean up the old project directory
Write-Host "Step 2: Cleaning up the old project directory..." -ForegroundColor Cyan
Get-ChildItem -Path $oldProjectPath -Force | Where-Object { $_.Name -ne "migrate_project.ps1" } | Remove-Item -Recurse -Force
Write-Host "Old project directory cleaned." -ForegroundColor Green

# Step 3: Copy the new project to the old project directory
Write-Host "Step 3: Copying the new project to the original location..." -ForegroundColor Cyan
Copy-Item -Path "$newProjectPath\*" -Destination $oldProjectPath -Recurse -Force
Write-Host "New project copied successfully." -ForegroundColor Green

# Step 4: Clean and get dependencies in the migrated project
Write-Host "Step 4: Setting up the migrated project..." -ForegroundColor Cyan
Set-Location -Path $oldProjectPath
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
Write-Host "Migrated project setup completed." -ForegroundColor Green

Write-Host "Migration completed successfully!" -ForegroundColor Green
Write-Host "Your project has been migrated to use the correct Flutter project structure." -ForegroundColor Green
Write-Host "A backup of your old project is available at: $backupPath" -ForegroundColor Yellow
Write-Host "You can now run your project with: flutter run" -ForegroundColor Cyan

# Ask user if they want to run the app
$runApp = Read-Host "Do you want to run the app now? (y/n)"
if ($runApp -eq "y" -or $runApp -eq "Y") {
    flutter run
} 