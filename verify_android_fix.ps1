Write-Host "Verifying Android build fixes..." -ForegroundColor Green

function Test-Setting {
    param (
        [string]$FilePath,
        [string]$Pattern,
        [string]$SettingName
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "[FAIL] $SettingName - File not found: $FilePath" -ForegroundColor Red
        return $false
    }
    
    $content = Get-Content $FilePath -Raw
    try {
        $result = $content -match $Pattern
        
        if ($result) {
            Write-Host "[PASS] $SettingName" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] $SettingName" -ForegroundColor Red
        }
        
        return $result
    }
    catch {
        Write-Host "[ERROR] Failed to match pattern: $Pattern" -ForegroundColor Red
        Write-Host "         Error message: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check gradle.properties
Write-Host "`nChecking gradle.properties..." -ForegroundColor Yellow
$gradlePropertiesPath = "android/gradle.properties"

# Check for correct memory settings (no longer 12G, should be 6G)
$gradleProperties = Get-Content $gradlePropertiesPath -Raw
if ($gradleProperties -match "org\.gradle\.jvmargs=.*-Xmx6G") {
    Write-Host "[PASS] Memory Settings (6G)" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Memory Settings incorrect" -ForegroundColor Red
    if ($gradleProperties -match "org\.gradle\.jvmargs=.*-Xmx(\d+)G") {
        Write-Host "       Current memory setting: Xmx$($Matches[1])G" -ForegroundColor Yellow
    }
}

Test-Setting -FilePath $gradlePropertiesPath -Pattern "org\.gradle\.parallel=true" -SettingName "Parallel Building"
Test-Setting -FilePath $gradlePropertiesPath -Pattern "org\.gradle\.caching=true" -SettingName "Build Caching"
Test-Setting -FilePath $gradlePropertiesPath -Pattern "org\.gradle\.daemon=true" -SettingName "Gradle Daemon"

# Check build.gradle.kts
Write-Host "`nChecking build.gradle.kts..." -ForegroundColor Yellow
$buildGradlePath = "android/app/build.gradle.kts"

Test-Setting -FilePath $buildGradlePath -Pattern "implementation\([""']androidx\.multidex:multidex" -SettingName "MultiDex Dependency"
Test-Setting -FilePath $buildGradlePath -Pattern "multiDexEnabled\s*=\s*true" -SettingName "MultiDex Enabled"

# Check AndroidManifest.xml
Write-Host "`nChecking AndroidManifest.xml..." -ForegroundColor Yellow
$manifestPath = "android/app/src/main/AndroidManifest.xml"

$manifestContent = Get-Content $manifestPath -Raw
if ($manifestContent -match 'android:name="\.MultiDexApplication"') {
    Write-Host "[PASS] MultiDex Application" -ForegroundColor Green
} else {
    Write-Host "[FAIL] MultiDex Application not properly configured in AndroidManifest.xml" -ForegroundColor Red
    
    if ($manifestContent -match 'android:name="([^"]*)"') {
        Write-Host "       Current application name: $($Matches[1])" -ForegroundColor Yellow
    }
}

# Check that MultiDexApplication.java exists
Write-Host "`nChecking MultiDexApplication.java..." -ForegroundColor Yellow
$multiDexAppPath = "android/app/src/main/java/com/example/lifesyncaiapp/MultiDexApplication.java"

if (Test-Path $multiDexAppPath) {
    Write-Host "[PASS] MultiDexApplication.java exists" -ForegroundColor Green
} else {
    Write-Host "[FAIL] MultiDexApplication.java missing" -ForegroundColor Red
}

# Check for heap dump files
Write-Host "`nChecking for heap dump files..." -ForegroundColor Yellow
$heapDumpFiles = Get-ChildItem -Path "android" -Filter "java_pid*.hprof" -ErrorAction SilentlyContinue
if ($heapDumpFiles) {
    Write-Host "[WARN] Heap dump files still exist: $($heapDumpFiles.Count) files" -ForegroundColor Yellow
    
    # Calculate total size
    $totalSize = 0
    $heapDumpFiles | ForEach-Object { $totalSize += $_.Length }
    $totalSizeMB = $totalSize / 1MB
    
    Write-Host "       Total size: $([math]::Round($totalSizeMB, 2)) MB" -ForegroundColor Yellow
    Write-Host "       Consider removing these files to free up space" -ForegroundColor Yellow
} else {
    Write-Host "[PASS] No heap dump files found" -ForegroundColor Green
}

# Provide next steps
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Try building the app with: flutter run" -ForegroundColor White
Write-Host "2. If issues persist, try: flutter run -v --no-sound-null-safety" -ForegroundColor White
Write-Host "3. For more details, see README_fix_steps.md" -ForegroundColor White 