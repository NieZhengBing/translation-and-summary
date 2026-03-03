# 构建 Chrome 和 Firefox 版本的 PowerShell 脚本

Write-Host 'Start building extension...' -ForegroundColor Green

# 创建构建目录
if (!(Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
}

# 1. 构建 Chrome 版本
Write-Host 'Building Chrome package...' -ForegroundColor Cyan

$chromeFiles = Get-ChildItem -Path . -Exclude @(
    '.git*', 'requirement', '*.zip', 'build',
    'temp-clean', 'temp-clean*',
    'manifest-firefox.json', 'popup.html', 'popup.js',
    'FIREFOX_DEPLOY.md', 'build.sh', 'build.ps1'
) -Recurse

Compress-Archive -Path $chromeFiles -DestinationPath "build\translation-and-summary-chrome.zip" -Force

Write-Host 'Chrome package created: build\translation-and-summary-chrome.zip' -ForegroundColor Green

# 2. 构建 Firefox 版本
Write-Host 'Building Firefox package...' -ForegroundColor Cyan

# 备份并替换 manifest.json
Copy-Item "manifest.json" "build\manifest-chrome-temp.json"
Copy-Item "manifest-firefox.json" "manifest.json" -Force

$firefoxFiles = Get-ChildItem -Path . -Exclude @(
    '.git*', 'requirement', '*.zip', 'build',
    'temp-clean', 'temp-clean*',
    'manifest-chrome.json', 'manifest-firefox.json',
    'sidepanel.html', 'sidepanel.js', 'sidepanel.css',
    'build.sh', 'build.ps1'
) -Recurse

Compress-Archive -Path $firefoxFiles -DestinationPath "build\translation-and-summary-firefox.zip" -Force

# 恢复 manifest.json
Copy-Item "build\manifest-chrome-temp.json" "manifest.json" -Force
Remove-Item "build\manifest-chrome-temp.json"

Write-Host 'Firefox package created: build\translation-and-summary-firefox.zip' -ForegroundColor Green

Write-Host ''
Write-Host 'Build completed.' -ForegroundColor Yellow
Write-Host 'Chrome: build\translation-and-summary-chrome.zip'
Write-Host 'Firefox: build\translation-and-summary-firefox.zip'
