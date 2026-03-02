// 在安裝或更新時，設定：點擊工具欄圖示自動打開 side panel
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

// 兼容較舊版本：點擊圖示時手動打開 side panel
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab.id) return;

    if (chrome.sidePanel && chrome.sidePanel.setOptions && chrome.sidePanel.open) {
      await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: "sidepanel.html",
        enabled: true
      });
      await chrome.sidePanel.open({ tabId: tab.id });
    }
  } catch (e) {
    console.error("Failed to open side panel:", e);
  }
});

