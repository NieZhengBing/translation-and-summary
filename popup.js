// Firefox 兼容的 popup 脚本
// 复用 sidepanel.js 的逻辑，但适配 popup 环境

import { getConfig, LANGUAGES } from './config.js';

const translateBtn = document.getElementById('translateBtn');
const summaryBtn = document.getElementById('summaryBtn');
const resultDiv = document.getElementById('result');
const targetLangSelect = document.getElementById('targetLang');
const settingsLink = document.getElementById('settingsLink');

// 语言代码映射
const LANG_CODE_MAP = {
  'zh-CN': ['zh-cn', 'zh-hans', 'zh', 'cmn-hans'],
  'zh-TW': ['zh-tw', 'zh-hant', 'cmn-hant'],
  'en': ['en', 'en-us', 'en-gb'],
  'ja': ['ja', 'jp'],
  'ko': ['ko', 'kr'],
  'fr': ['fr', 'fr-fr'],
  'de': ['de', 'de-de'],
  'es': ['es', 'es-es'],
  'ru': ['ru', 'ru-ru'],
  'ar': ['ar', 'ar-sa']
};

// 打开设置页面
settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  // Firefox 和 Chrome 兼容
  if (typeof browser !== 'undefined') {
    browser.runtime.openOptionsPage();
  } else {
    chrome.runtime.openOptionsPage();
  }
});

// 获取浏览器 API（兼容 Firefox 和 Chrome）
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// 初始化语言选择器
async function initLanguageSelector() {
  const config = await getConfig();
  targetLangSelect.value = config.targetLanguage || 'zh-CN';
  
  targetLangSelect.addEventListener('change', async () => {
    await browserAPI.storage.sync.set({ targetLanguage: targetLangSelect.value });
  });
}

// 检查语言是否匹配
function isSameLanguage(pageLang, targetLang) {
  const normalizedPageLang = pageLang.toLowerCase().split('-')[0];
  const normalizedTargetLang = targetLang.toLowerCase().split('-')[0];
  
  if (normalizedPageLang === normalizedTargetLang) {
    return true;
  }
  
  for (const [key, variants] of Object.entries(LANG_CODE_MAP)) {
    if (key === targetLang || key.startsWith(targetLang)) {
      return variants.some(v => pageLang.toLowerCase().includes(v));
    }
  }
  
  return false;
}

// 显示结果
function showResult(text, isError = false) {
  resultDiv.className = 'result-box' + (isError ? ' error' : '');
  resultDiv.textContent = text;
}

// 显示加载状态
function showLoading(message = '處理中...') {
  resultDiv.className = 'result-box loading';
  resultDiv.textContent = message;
}

// 确保 content script 已注入
async function ensureContentScript(tabId, tabUrl) {
  try {
    await browserAPI.tabs.sendMessage(tabId, { type: 'PING' });
    return { success: true };
  } catch {
    try {
      await browserAPI.scripting.executeScript({
        target: { tabId },
        files: ['contentScript.js']
      });
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    } catch (error) {
      console.error('Failed to inject content script:', error);
      
      const errorMsg = error.message || '';
      if (errorMsg.includes('Cannot access') || errorMsg.includes('manifest')) {
        return { 
          success: false, 
          reason: 'permission',
          message: '此網站有安全限制，插件無法訪問'
        };
      } else if (tabUrl?.startsWith('about:') || tabUrl?.startsWith('moz-extension://')) {
        return { 
          success: false, 
          reason: 'restricted',
          message: '瀏覽器內部頁面不支持插件功能'
        };
      } else {
        return { 
          success: false, 
          reason: 'unknown',
          message: '無法注入腳本，請刷新頁面後重試'
        };
      }
    }
  }
}

// 调用 AI API
async function callAI(prompt, config) {
  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 請求失敗 (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 翻译选中文本
translateBtn.addEventListener('click', async () => {
  try {
    showLoading('🔍 獲取文本...');
    
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showResult('❌ 無法獲取當前標籤頁', true);
      return;
    }

    if (tab.url?.startsWith('about:') || tab.url?.startsWith('moz-extension://')) {
      showResult('⚠️ 此頁面不支持插件功能', true);
      return;
    }

    const injected = await ensureContentScript(tab.id, tab.url);
    if (!injected.success) {
      showResult(`⚠️ ${injected.message}`, true);
      return;
    }

    const langResponse = await browserAPI.tabs.sendMessage(tab.id, { type: 'GET_PAGE_LANGUAGE' });
    const pageLang = langResponse?.language || 'unknown';
    
    const targetLang = targetLangSelect.value;
    
    if (pageLang !== 'unknown' && isSameLanguage(pageLang, targetLang)) {
      showResult(`⚠️ 頁面語言與目標語言相同（${LANGUAGES[targetLang]}），無需翻譯`, true);
      return;
    }

    const selectionResponse = await browserAPI.tabs.sendMessage(tab.id, { type: 'GET_SELECTION_TEXT' });
    let textToTranslate = selectionResponse?.text?.trim();

    if (!textToTranslate) {
      showLoading('📄 未選中文本，正在獲取整篇內容...');
      const pageResponse = await browserAPI.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' });
      textToTranslate = pageResponse?.text?.trim();
      
      if (!textToTranslate) {
        showResult('⚠️ 無法獲取頁面內容', true);
        return;
      }
    }

    showLoading('🤖 AI 翻譯中...');
    
    const config = await getConfig();
    if (!config.apiKey) {
      showResult('❌ 請先在設置頁面配置 API Key', true);
      return;
    }

    const langName = LANGUAGES[targetLang] || targetLang;
    const prompt = config.translationPrompt.replace('{language}', langName) + textToTranslate;
    const result = await callAI(prompt, config);
    
    showResult(result);
  } catch (error) {
    showResult(`❌ 翻譯失敗：${error.message}`, true);
  }
});

// 总结页面内容
summaryBtn.addEventListener('click', async () => {
  try {
    showLoading('📄 獲取頁面內容...');
    
    const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showResult('❌ 無法獲取當前標籤頁', true);
      return;
    }

    if (tab.url?.startsWith('about:') || tab.url?.startsWith('moz-extension://')) {
      showResult('⚠️ 此頁面不支持插件功能', true);
      return;
    }

    const injected = await ensureContentScript(tab.id, tab.url);
    if (!injected.success) {
      showResult(`⚠️ ${injected.message}`, true);
      return;
    }

    const response = await browserAPI.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' });
    const pageContent = response?.text?.trim();

    if (!pageContent) {
      showResult('⚠️ 無法獲取頁面內容', true);
      return;
    }

    showLoading('🤖 AI 總結中...');
    
    const config = await getConfig();
    if (!config.apiKey) {
      showResult('❌ 請先在設置頁面配置 API Key', true);
      return;
    }

    const prompt = config.summaryPrompt + pageContent;
    const result = await callAI(prompt, config);
    
    showResult(result);
  } catch (error) {
    showResult(`❌ 總結失敗：${error.message}`, true);
  }
});

// 初始化
initLanguageSelector();
