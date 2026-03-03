// 支持的翻譯語言
export const LANGUAGES = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'fr': 'Français',
  'de': 'Deutsch',
  'es': 'Español',
  'ru': 'Русский',
  'ar': 'العربية'
};

// 默認配置
export const DEFAULT_CONFIG = {
  // OpenAI 兼容 API 配置
  apiEndpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "",
  model: "gpt-4o-mini",
  
  // 翻譯設置
  targetLanguage: "zh-CN",
  translationPrompt: "請將以下文本翻譯成{language}，只返回翻譯結果：\n\n",
  
  // 總結設置
  summaryPrompt: "請用中文總結以下網頁內容的核心要點（3-5條）：\n\n",

  // 請求參數
  temperature: 0.7,
  maxTokens: 2000
};

// 兼容 Firefox 和 Chrome
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// 從 storage 獲取用戶配置，合併默認配置
export async function getConfig() {
  return new Promise((resolve) => {
    browserAPI.storage.sync.get(DEFAULT_CONFIG, (items) => {
      resolve(items);
    });
  });
}

// 保存用戶配置
export async function saveConfig(config) {
  return new Promise((resolve) => {
    browserAPI.storage.sync.set(config, () => {
      resolve();
    });
  });
}
