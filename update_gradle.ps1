$content = Get-Content 'android/app/build.gradle.kts' -Raw
$newContent = $content -replace 'ndkVersion = null', ''
Set-Content 'android/app/build.gradle.kts' $newContent 