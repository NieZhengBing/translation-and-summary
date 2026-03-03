# Firefox 部署指南

## 准备 Firefox 版本

### 1. 替换 manifest.json

```bash
# 备份 Chrome 版本
cp manifest.json manifest-chrome.json

# 使用 Firefox 版本
cp manifest-firefox.json manifest.json
```

### 2. 修改图标

Firefox 不支持 SVG 图标，需要使用 PNG：

在 `manifest-firefox.json` 中已经配置为使用 PNG 图标。

### 3. 打包 Firefox 版本

```bash
# 创建 Firefox 专用包
zip -r translation-and-summary-firefox.zip . -x "*.git*" "requirement" "插件UI示意圖" "*.zip" "manifest-chrome.json" "sidepanel.*"
```

## Firefox 发布流程

### 1. 注册开发者账号

访问：https://addons.mozilla.org/developers/

- 使用 Firefox 账号登录
- 完全免费，无需支付费用

### 2. 提交插件

1. 访问：https://addons.mozilla.org/developers/addon/submit/distribution
2. 选择「On this site」（在 AMO 上发布）
3. 上传 ZIP 文件
4. 填写插件信息

### 3. 填写信息

**基本信息：**
- 名称：Translation & Summary
- 摘要：AI-powered translation and page summarization tool
- 描述：复制 STORE_LISTING.md 中的内容
- 类别：Productivity
- 许可证：MIT License

**版本信息：**
- 版本号：1.0.2
- 发布说明：Initial release

**隐私政策：**
- 提供 PRIVACY.md 的 URL

### 4. 审核

- Firefox 审核通常需要 1-5 个工作日
- 审核比 Chrome 更严格
- 可能需要提供源代码说明

## 主要差异

### Chrome 版本
- 使用 Side Panel API
- Manifest V3 完整支持
- Service Worker 后台脚本

### Firefox 版本
- 使用 Popup（弹出窗口）
- 兼容 Manifest V3
- 传统后台脚本
- 添加 `browser_specific_settings`

## 测试

### 在 Firefox 中测试

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击「临时载入附加组件」
3. 选择 `manifest.json` 文件
4. 测试所有功能

## 注意事项

1. **API 兼容性**：使用 `typeof browser !== 'undefined' ? browser : chrome` 检测
2. **图标格式**：Firefox 推荐使用 PNG 而非 SVG
3. **权限说明**：Firefox 要求详细解释每个权限的用途
4. **审核时间**：比 Chrome 更长，需要耐心等待

## 同时维护两个版本

建议使用构建脚本自动切换：

```bash
# 构建 Chrome 版本
npm run build:chrome

# 构建 Firefox 版本
npm run build:firefox
```
