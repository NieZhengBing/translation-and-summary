import { getConfig, LANGUAGES } from './config.js';

const translateBtn = document.getElementById('translateBtn');
const summaryBtn = document.getElementById('summaryBtn');
const resultDiv = document.getElementById('result');
const targetLangSelect = document.getElementById('targetLang');

// 語言代碼映射（用於比較）
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

// 初始化語言選擇器
async function initLanguageSelector() {
  const config = await getConfig();
  targetLangSelect.value = config.targetLanguage || 'zh-CN';
  
  // 保存語言選擇
  targetLangSelect.addEventListener('change', async () => {
    const currentConfig = await getConfig();
    currentConfig.targetLanguage = targetLangSelect.value;
    await chrome.storage.sync.set({ targetLanguage: targetLangSelect.value });
  });
}

// 檢查語言是否匹配
function isSameLanguage(pageLang, targetLang) {
  const normalizedPageLang = pageLang.toLowerCase().split('-')[0];
  const normalizedTargetLang = targetLang.toLowerCase().split('-')[0];
  
  // 直接比較主語言代碼
  if (normalizedPageLang === normalizedTargetLang) {
    return true;
  }
  
  // 使用映射表比較
  for (const [key, variants] of Object.entries(LANG_CODE_MAP)) {
    if (key === targetLang || key.startsWith(targetLang)) {
      return variants.some(v => pageLang.toLowerCase().includes(v));
    }
  }
  
  return false;
}

// 顯示結果
function showResult(text, isError = false) {
  resultDiv.className = 'result-box' + (isError ? ' error' : '');
  resultDiv.textContent = text;
}

// 顯示加載狀態
function showLoading(message = '處理中...') {
  resultDiv.className = 'result-box loading';
  resultDiv.textContent = message;
}

// 顯示刷新按鈕
function showResultWithRefresh(tabId) {
  resultDiv.className = 'result-box error';
  resultDiv.innerHTML = '';
  
  const message = document.createElement('div');
  message.textContent = '❌ 無法注入腳本';
  message.style.marginBottom = '12px';
  
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = '🔄 刷新頁面';
  refreshBtn.style.cssText = `
    padding: 8px 16px;
    background: #ff6b9d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    font-weight: bold;
  `;
  refreshBtn.onclick = async () => {
    await chrome.tabs.reload(tabId);
    showResult('✅ 頁面已刷新，請重新操作');
  };
  
  resultDiv.appendChild(message);
  resultDiv.appendChild(refreshBtn);
}

// 確保 content script 已注入
async function ensureContentScript(tabId, tabUrl) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    return { success: true };
  } catch {
    // 嘗試手動注入
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['contentScript.js']
      });
      // 等待一下確保腳本加載完成
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    } catch (error) {
      console.error('Failed to inject content script:', error);
      
      // 判斷錯誤類型
      const errorMsg = error.message || '';
      if (errorMsg.includes('Cannot access') || errorMsg.includes('manifest')) {
        return { 
          success: false, 
          reason: 'permission',
          message: '此網站有安全限制，插件無法訪問'
        };
      } else if (tabUrl?.startsWith('chrome://') || tabUrl?.startsWith('chrome-extension://')) {
        return { 
          success: false, 
          reason: 'restricted',
          message: 'Chrome 內部頁面不支持插件功能'
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

// 調用 AI API
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

// 翻譯選中文本
translateBtn.addEventListener('click', async () => {
  try {
    showLoading('🔍 獲取文本...');
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showResult('❌ 無法獲取當前標籤頁', true);
      return;
    }

    // 檢查是否為受限頁面
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
      showResult('⚠️ 此頁面不支持插件功能（Chrome 內部頁面）', true);
      return;
    }

    // 確保 content script 已注入
    const injected = await ensureContentScript(tab.id, tab.url);
    if (!injected.success) {
      if (injected.reason === 'permission') {
        showResult(`⚠️ ${injected.message}\n\n某些網站（如 Chrome 網上應用店、Google 等）有安全限制。\n建議：在普通網頁上使用此功能。`, true);
      } else if (injected.reason === 'unknown') {
        showResultWithRefresh(tab.id);
      } else {
        showResult(`⚠️ ${injected.message}`, true);
      }
      return;
    }

    // 獲取頁面語言
    const langResponse = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_LANGUAGE' });
    const pageLang = langResponse?.language || 'unknown';
    
    // 獲取目標語言
    const targetLang = targetLangSelect.value;
    
    // 檢查語言是否相同
    if (pageLang !== 'unknown' && isSameLanguage(pageLang, targetLang)) {
      showResult(`⚠️ 頁面語言與目標語言相同（${LANGUAGES[targetLang]}），無需翻譯`, true);
      return;
    }

    // 獲取選中文本
    const selectionResponse = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION_TEXT' });
    let textToTranslate = selectionResponse?.text?.trim();

    // 如果沒有選中文本，翻譯整篇文章
    if (!textToTranslate) {
      showLoading('📄 未選中文本，正在獲取整篇內容...');
      const pageResponse = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' });
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
    
    // 替換提示詞中的語言占位符
    const prompt = config.translationPrompt.replace('{language}', langName) + textToTranslate;
    const result = await callAI(prompt, config);
    
    showResult(result);
  } catch (error) {
    showResult(`❌ 翻譯失敗：${error.message}`, true);
  }
});

// 總結頁面內容
summaryBtn.addEventListener('click', async () => {
  try {
    showLoading('📄 獲取頁面內容...');
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      showResult('❌ 無法獲取當前標籤頁', true);
      return;
    }

    // 檢查是否為受限頁面
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
      showResult('⚠️ 此頁面不支持插件功能（Chrome 內部頁面）', true);
      return;
    }

    // 確保 content script 已注入
    const injected = await ensureContentScript(tab.id, tab.url);
    if (!injected.success) {
      if (injected.reason === 'permission') {
        showResult(`⚠️ ${injected.message}\n\n某些網站（如 Chrome 網上應用店、Google 等）有安全限制。\n建議：在普通網頁上使用此功能。`, true);
      } else if (injected.reason === 'unknown') {
        showResultWithRefresh(tab.id);
      } else {
        showResult(`⚠️ ${injected.message}`, true);
      }
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' });
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
