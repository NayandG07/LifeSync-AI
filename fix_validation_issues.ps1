# Fix validation issues in multiple files
Write-Host "Fixing validation issues in the codebase..."

# 1. Update profile_setup_screen.dart
(Get-Content -Path "lib/screens/auth/profile_setup_screen.dart") -replace "min: 50,", "fieldName: 'Height'," | Set-Content -Path "lib/screens/auth/profile_setup_screen.dart"
(Get-Content -Path "lib/screens/auth/profile_setup_screen.dart") -replace "max: 250,", "" | Set-Content -Path "lib/screens/auth/profile_setup_screen.dart"
(Get-Content -Path "lib/screens/auth/profile_setup_screen.dart") -replace "min: 20,", "fieldName: 'Weight'," | Set-Content -Path "lib/screens/auth/profile_setup_screen.dart"
(Get-Content -Path "lib/screens/auth/profile_setup_screen.dart") -replace "max: 300,", "" | Set-Content -Path "lib/screens/auth/profile_setup_screen.dart"

# 2. Update account_settings_screen.dart
(Get-Content -Path "lib/screens/settings/account_settings_screen.dart") -replace "min: 50,", "fieldName: 'Height'," | Set-Content -Path "lib/screens/settings/account_settings_screen.dart"
(Get-Content -Path "lib/screens/settings/account_settings_screen.dart") -replace "max: 250,", "" | Set-Content -Path "lib/screens/settings/account_settings_screen.dart"
(Get-Content -Path "lib/screens/settings/account_settings_screen.dart") -replace "min: 20,", "fieldName: 'Weight'," | Set-Content -Path "lib/screens/settings/account_settings_screen.dart"
(Get-Content -Path "lib/screens/settings/account_settings_screen.dart") -replace "max: 300,", "" | Set-Content -Path "lib/screens/settings/account_settings_screen.dart"

# Clean Flutter build
Write-Host "Cleaning Flutter build..."
flutter clean

# Get dependencies
Write-Host "Getting dependencies..."
flutter pub get

# Run build_runner to regenerate code
Write-Host "Running build_runner..."
flutter pub run build_runner build --delete-conflicting-outputs

Write-Host "Done! Now try running the app with 'flutter run -d chrome'" 