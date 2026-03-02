// 處理來自側邊欄的請求，提供選中文本和頁面內容
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // 用於檢測 content script 是否已注入
  if (message && message.type === "PING") {
    sendResponse({ status: "ok" });
    return true;
  }

  if (message && message.type === "GET_SELECTION_TEXT") {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : "";
    sendResponse({ text });
    return true;
  }

  if (message && message.type === "GET_PAGE_CONTENT") {
    let text = document.body ? document.body.innerText || "" : "";
    // 避免超長文本，做一個簡單截斷
    const MAX_LENGTH = 8000;
    if (text.length > MAX_LENGTH) {
      text = text.slice(0, MAX_LENGTH);
    }
    sendResponse({ text });
    return true;
  }

  // 獲取頁面語言
  if (message && message.type === "GET_PAGE_LANGUAGE") {
    const lang = document.documentElement.lang || 
                 document.querySelector('html')?.getAttribute('lang') ||
                 navigator.language || 
                 'unknown';
    sendResponse({ language: lang });
    return true;
  }

  return false;
});
