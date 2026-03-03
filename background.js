// 兼容 Firefox 和 Chrome
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// 在安裝或更新時，設定：點擊工具欄圖示自動打開 side panel (僅 Chrome)
browserAPI.runtime.onInstalled.addListener(() => {
  if (browserAPI.sidePanel && browserAPI.sidePanel.setPanelBehavior) {
    browserAPI.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  }
});

// 兼容較舊版本：點擊圖示時手動打開 side panel (僅 Chrome)
if (browserAPI.action && browserAPI.action.onClicked) {
  browserAPI.action.onClicked.addListener(async (tab) => {
    try {
      if (!tab.id) return;

      if (browserAPI.sidePanel && browserAPI.sidePanel.setOptions && browserAPI.sidePanel.open) {
        await browserAPI.sidePanel.setOptions({
          tabId: tab.id,
          path: "sidepanel.html",
          enabled: true
        });
        await browserAPI.sidePanel.open({ tabId: tab.id });
      }
    } catch (e) {
      console.error("Failed to open side panel:", e);
    }
  });
}
