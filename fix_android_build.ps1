Write-Host "Fixing Android build issues..." -ForegroundColor Green

# Step 1: Clean up heap dump files that are taking space
Write-Host "Removing heap dump files..." -ForegroundColor Yellow
Get-ChildItem -Path "android" -Filter "java_pid*.hprof" | ForEach-Object {
    Write-Host "Removing $($_.Name) - $($_.Length / 1MB) MB" -ForegroundColor Yellow
    Remove-Item $_.FullName -Force
}

# Step 2: Update gradle.properties
Write-Host "Updating Gradle memory settings..." -ForegroundColor Yellow
$gradlePropertiesPath = "android/gradle.properties"
$gradleProperties = Get-Content $gradlePropertiesPath

# Update JVM args for more memory
$jvmArgsLine = $gradleProperties | Where-Object { $_ -match "org.gradle.jvmargs=" }
if ($jvmArgsLine) {
    $gradleProperties = $gradleProperties -replace $jvmArgsLine, "org.gradle.jvmargs=-Xmx6G -XX:MaxMetaspaceSize=2G -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
} else {
    $gradleProperties += "org.gradle.jvmargs=-Xmx6G -XX:MaxMetaspaceSize=2G -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
}

# Make sure we have these performance settings
if (-not ($gradleProperties -match "org.gradle.parallel=true")) {
    $gradleProperties += "`norg.gradle.parallel=true"
}
if (-not ($gradleProperties -match "org.gradle.caching=true")) {
    $gradleProperties += "`norg.gradle.caching=true"
}
if (-not ($gradleProperties -match "org.gradle.daemon=true")) {
    $gradleProperties += "`norg.gradle.daemon=true"
}

Set-Content -Path $gradlePropertiesPath -Value $gradleProperties

# Step 3: Update app/build.gradle.kts to enable multidex
Write-Host "Updating build settings to enable multidex..." -ForegroundColor Yellow
$buildGradlePath = "android/app/build.gradle.kts"
$buildGradle = Get-Content $buildGradlePath -Raw

# Add multidex dependency if not present
if ($buildGradle -notmatch "androidx.multidex:multidex") {
    $buildGradle = $buildGradle -replace "dependencies \{", "dependencies {`n    implementation(`"androidx.multidex:multidex:2.0.1`")"
}

# Add multiDexEnabled if not present
if ($buildGradle -notmatch "multiDexEnabled") {
    $buildGradle = $buildGradle -replace "defaultConfig \{", "defaultConfig {`n        multiDexEnabled = true"
}

Set-Content -Path $buildGradlePath -Value $buildGradle

# Step 4: Clean build files
Write-Host "Cleaning build files..." -ForegroundColor Yellow
Push-Location
Set-Location android
./gradlew clean
Set-Location ..
flutter clean
Pop-Location

# Step 5: Run build with verbose flags
Write-Host "Build is ready. Now run the following command to build with verbose output:" -ForegroundColor Green
Write-Host "flutter run -v" -ForegroundColor Cyan 