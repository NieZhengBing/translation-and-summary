# Firefox 图标问题排查

## 问题：图标不显示

### 可能的原因

1. **Firefox 对 SVG 支持有限**
   - Firefox 可能不完全支持 SVG 作为扩展图标
   - 建议使用 PNG 格式

2. **PNG 文件损坏**
   - 现有的 PNG 文件可能格式不正确
   - 需要重新生成

3. **缓存问题**
   - Firefox 缓存了旧图标
   - 需要清除缓存

## 解决方案

### 方案 1：使用在线工具生成标准 PNG 图标（强烈推荐）

1. 访问：https://realfavicongenerator.net/
2. 上传一张图片或使用文字生成
3. 下载生成的图标包
4. 解压后找到以下文件：
   - favicon-16x16.png → 重命名为 icon16.png
   - favicon-32x32.png → 重命名为 icon32.png
   - android-chrome-48x48.png → 重命名为 icon48.png
   - android-chrome-192x192.png → 调整为 128x128 → icon128.png

### 方案 2：使用 Photoshop/GIMP 手动创建

创建 4 个 PNG 文件：
- 16x16 像素
- 32x32 像素
- 48x48 像素
- 128x128 像素

要求：
- 格式：PNG-24 或 PNG-32（带透明通道）
- 颜色模式：RGB
- 文件大小：每个文件应该在 1-10KB 之间

### 方案 3：使用命令行工具转换 SVG

如果你有 ImageMagick 或其他工具：

```bash
# 使用 ImageMagick
magick convert test-icon.svg -resize 16x16 icon16.png
magick convert test-icon.svg -resize 32x32 icon32.png
magick convert test-icon.svg -resize 48x48 icon48.png
magick convert test-icon.svg -resize 128x128 icon128.png
```

## 当前问题分析

你现有的 PNG 文件大小：
- icon16.png: 755 字节
- icon32.png: 2,498 字节
- icon48.png: 5,517 字节
- icon128.png: 34,826 字节

icon128.png 太大了（34KB），可能有问题。

## 立即可行的方案

我建议你：

1. **访问 https://favicon.io/favicon-generator/**
2. 设置：
   - Text: TS
   - Background: Rounded
   - Font Family: 选择一个你喜欢的
   - Font Size: 80
   - Background Color: #667eea (紫色)
   - Font Color: #ffffff (白色)
3. 点击 Download
4. 解压后会得到标准的图标文件
5. 替换 icons/ 文件夹中的文件
6. 告诉我，我会重新打包

## 临时测试方案

如果你想快速测试，我可以创建一个最简单的 base64 内联图标。
