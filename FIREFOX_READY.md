# Firefox 发布清单

## ✅ 已完成

### 1. 打包文件
- ✅ `build/translation-and-summary-firefox.zip` (60KB)
- ✅ 使用 Popup 界面（Firefox 兼容）
- ✅ 移除了 Chrome 专用的 sidepanel 文件
- ✅ 使用 PNG 图标（Firefox 推荐）
- ✅ 添加 `browser_specific_settings` 配置
- ✅ 兼容 Firefox 109+

### 2. 包含的文件
```
manifest.json (Firefox 版本)
popup.html (弹出窗口界面)
popup.js (Firefox 兼容代码)
background.js (兼容 Firefox)
config.js (兼容 Firefox)
contentScript.js
options.html
options.js
icons/ (PNG 格式)
README.md
PRIVACY.md
STORE_LISTING.md
FIREFOX_DEPLOY.md
```

### 3. 已验证
- ✅ 不包含 sidepanel 文件
- ✅ manifest.json 正确配置
- ✅ 包含 popup.html 和 popup.js
- ✅ 图标使用 PNG 格式
- ✅ 添加了 gecko 配置

## 🚀 发布步骤

### 第一步：注册 Firefox 开发者账号

1. 访问：https://addons.mozilla.org/developers/
2. 使用 Firefox 账号登录（或创建新账号）
3. **完全免费**，无需支付任何费用

### 第二步：提交插件

1. 访问：https://addons.mozilla.org/developers/addon/submit/distribution
2. 选择「On this site」（在 AMO 上发布）
3. 上传 `build/translation-and-summary-firefox.zip`
4. 等待自动验证

### 第三步：填写信息

**基本信息：**
- **名称**：Translation & Summary
- **摘要**（250 字符以内）：
  ```
  AI-powered translation and summarization tool. Translate text into 10+ languages and generate smart page summaries.
  ```
- **描述**：复制 `STORE_LISTING.md` 中的 Detailed Description
- **类别**：Productivity
- **许可证**：MIT License

**版本信息：**
- **版本号**：1.0.2
- **发布说明**：
  ```
  Initial release
  - Multi-language translation (10+ languages)
  - AI-powered page summarization
  - Customizable API endpoint
  - Privacy-focused design
  ```

**隐私政策：**
- URL: `https://github.com/NieZhengBing/translation-and-summary/blob/main/PRIVACY.md`

**支持链接：**
- URL: `https://github.com/NieZhengBing/translation-and-summary`

### 第四步：权限说明

Firefox 会要求解释每个权限的用途：

- **storage**: 保存用户的 API 密钥和配置设置
- **activeTab**: 获取当前页面内容进行翻译和总结
- **scripting**: 注入脚本以获取用户选中的文本
- **host_permissions (api.openai.com, */v1/*)**: 连接到 AI API 服务进行翻译和总结

### 第五步：上传截图

**要求：**
- 至少 1 张，最多 10 张
- 尺寸：1280x800 或 640x400
- 格式：PNG 或 JPEG

**建议截图：**
1. 弹出窗口主界面
2. 翻译功能演示
3. 总结功能演示
4. 设置页面

### 第六步：提交审核

1. 检查所有信息
2. 点击「提交审核」
3. 等待审核（通常 1-5 个工作日）

## 📝 审核注意事项

### Firefox 审核比 Chrome 更严格

1. **代码审查**：可能要求提供源代码说明
2. **权限审查**：需要详细解释每个权限的必要性
3. **隐私审查**：确保隐私政策清晰明确
4. **功能测试**：审核人员会实际测试功能

### 常见审核问题

1. **权限过多**：确保只请求必要的权限
2. **隐私政策不清晰**：详细说明数据处理方式
3. **代码混淆**：Firefox 不允许混淆代码
4. **外部依赖**：说明所有外部 API 调用

## 🧪 本地测试

在提交前，建议在 Firefox 中测试：

1. 打开 Firefox
2. 访问 `about:debugging#/runtime/this-firefox`
3. 点击「临时载入附加组件」
4. 选择 `build/translation-and-summary-firefox.zip`
5. 测试所有功能

## 📊 发布后

### 监控

- 查看下载量和评分
- 回复用户评论
- 处理 bug 报告

### 更新

更新版本时：
1. 修改 `manifest-firefox.json` 中的版本号
2. 重新打包
3. 在 AMO 上传新版本
4. 填写更新说明

## 🎉 完成

Firefox 版本已准备就绪，可以提交到 Firefox Add-ons 平台了！

**文件位置**：`d:\cursor-project\browser-plugin\translation-and-summary\build\translation-and-summary-firefox.zip`
