import { DEFAULT_CONFIG, getConfig, saveConfig } from './config.js';

const form = document.getElementById('configForm');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

// 顯示狀態消息
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.className = `status show ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}

// 加載配置
async function loadConfig() {
  const config = await getConfig();
  document.getElementById('apiEndpoint').value = config.apiEndpoint;
  document.getElementById('apiKey').value = config.apiKey;
  document.getElementById('model').value = config.model;
  document.getElementById('targetLanguage').value = config.targetLanguage;
  document.getElementById('translationPrompt').value = config.translationPrompt;
  document.getElementById('summaryPrompt').value = config.summaryPrompt;
}

// 保存配置
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const config = {
    apiEndpoint: document.getElementById('apiEndpoint').value.trim(),
    apiKey: document.getElementById('apiKey').value.trim(),
    model: document.getElementById('model').value.trim(),
    targetLanguage: document.getElementById('targetLanguage').value,
    translationPrompt: document.getElementById('translationPrompt').value,
    summaryPrompt: document.getElementById('summaryPrompt').value,
    temperature: DEFAULT_CONFIG.temperature,
    maxTokens: DEFAULT_CONFIG.maxTokens
  };
  
  if (!config.apiKey) {
    showStatus('請輸入 API Key', true);
    return;
  }
  
  try {
    await saveConfig(config);
    showStatus('✅ 設置已保存');
  } catch (error) {
    showStatus('❌ 保存失敗：' + error.message, true);
  }
});

// 恢復默認設置
resetBtn.addEventListener('click', async () => {
  if (confirm('確定要恢復默認設置嗎？')) {
    await saveConfig(DEFAULT_CONFIG);
    await loadConfig();
    showStatus('✅ 已恢復默認設置');
  }
});

// 初始化
loadConfig();
