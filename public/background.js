chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
  
// Update side panel
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateAnnotations") {
        chrome.runtime.sendMessage({ action: 'annotationsUpdated' });
    }
});
