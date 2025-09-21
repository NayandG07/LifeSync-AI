# Enable Developer Mode programmatically (requires admin privileges)
Write-Host "Enabling Developer Mode for symlink support..."
New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevMode" -PropertyType DWORD -Value 1 -Force

# Display success message
Write-Host "Developer Mode enabled. Symlinks should now work for Flutter projects."
Write-Host "Now running Flutter..."

# Run Flutter with Chrome as the target device
cd $PSScriptRoot
flutter run -d chrome 