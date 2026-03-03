#!/bin/bash

# 构建 Chrome 和 Firefox 版本的脚本

echo "🚀 开始构建插件..."

# 创建构建目录
mkdir -p build

# 1. 构建 Chrome 版本
echo "📦 构建 Chrome 版本..."
cp manifest.json build/manifest-backup.json
zip -r build/translation-and-summary-chrome.zip . \
  -x "*.git*" \
  -x "requirement" \
  -x "temp-clean" \
  -x "temp-clean/*" \
  -x "插件UI示意圖" \
  -x "*.zip" \
  -x "build/*" \
  -x "manifest-firefox.json" \
  -x "popup.html" \
  -x "popup.js" \
  -x "FIREFOX_DEPLOY.md" \
  -x "build.sh"

echo "✅ Chrome 版本已生成: build/translation-and-summary-chrome.zip"

# 2. 构建 Firefox 版本
echo "📦 构建 Firefox 版本..."

# 临时替换 manifest.json
cp manifest.json build/manifest-chrome-temp.json
cp manifest-firefox.json manifest.json

zip -r build/translation-and-summary-firefox.zip . \
  -x "*.git*" \
  -x "requirement" \
  -x "temp-clean" \
  -x "temp-clean/*" \
  -x "插件UI示意圖" \
  -x "*.zip" \
  -x "build/*" \
  -x "manifest-chrome.json" \
  -x "manifest-firefox.json" \
  -x "sidepanel.html" \
  -x "sidepanel.js" \
  -x "sidepanel.css" \
  -x "build.sh"

# 恢复 manifest.json
cp build/manifest-chrome-temp.json manifest.json
rm build/manifest-chrome-temp.json

echo "✅ Firefox 版本已生成: build/translation-and-summary-firefox.zip"

echo ""
echo "🎉 构建完成！"
echo "Chrome 版本: build/translation-and-summary-chrome.zip"
echo "Firefox 版本: build/translation-and-summary-firefox.zip"
