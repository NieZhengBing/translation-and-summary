# Translation & Summary

AI-powered Chrome and Firefox extension for translation and page summarization.

## Features

- 🌐 **Multi-language Translation**: Translate selected text or entire pages into 10+ languages
- 📝 **Smart Summarization**: Generate intelligent summaries of web pages
- ⚙️ **Customizable**: Configure your own AI model and API endpoint
- 🎨 **Modern UI**: Beautiful cyberpunk-style interface
- 🔒 **Privacy First**: All data stays local, API key stored securely
- 🦊 **Cross-Browser**: Works on both Chrome and Firefox

## Supported Languages

- 简体中文 (Simplified Chinese)
- 繁體中文 (Traditional Chinese)
- English
- 日本語 (Japanese)
- 한국어 (Korean)
- Français (French)
- Deutsch (German)
- Español (Spanish)
- Русский (Russian)
- العربية (Arabic)

## Installation

### Chrome
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Configure your API key in the settings

### Firefox
1. Download or clone this repository
2. Replace `manifest.json` with `manifest-firefox.json`
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file
6. Configure your API key in the settings

## Build

Use the build script to create distribution packages:

### Windows (PowerShell)
```powershell
.\build.ps1
```

### Linux/Mac
```bash
chmod +x build.sh
./build.sh
```

This will generate:
- `build/translation-and-summary-chrome.zip` - Chrome version
- `build/translation-and-summary-firefox.zip` - Firefox version

## Configuration

1. Click the extension icon
2. Click "⚙️ Open Settings"
3. Enter your OpenAI API key (or compatible API)
4. Customize translation prompts and target language
5. Save settings

## Usage

### Translation
1. Select text on any webpage (or leave unselected to translate entire page)
2. Click the extension icon
3. Choose target language
4. Click "🌐 Translate"

### Summarization
1. Navigate to any webpage
2. Click the extension icon
3. Click "📝 Summarize"
4. Get an AI-generated summary

## API Compatibility

This extension works with:
- OpenAI API (GPT-4, GPT-4o-mini, etc.)
- Azure OpenAI
- Any OpenAI-compatible API endpoint

## Privacy

- Your API key is stored locally using browser's secure storage
- No data is sent to third parties except your configured AI provider
- All processing happens through your own API key

## Requirements

- **Chrome**: Version 116+ (for Side Panel API support)
- **Firefox**: Version 109+
- Valid OpenAI API key or compatible service

## Publishing

### Chrome Web Store
See [Chrome Publishing Guide](https://developer.chrome.com/docs/webstore/publish/)

### Firefox Add-ons
See [FIREFOX_DEPLOY.md](FIREFOX_DEPLOY.md) for detailed instructions

## License

MIT License

## Support

For issues and feature requests, please visit the [GitHub repository](https://github.com/NieZhengBing/translation-and-summary).

