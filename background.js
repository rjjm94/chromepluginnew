console.log("Chess OCR Chrome Extension background script loaded");

chrome.browserAction.onClicked.addListener((tab) => {
  console.log("Toggle recognition clicked");
  chrome.tabs.sendMessage(tab.id, { action: "toggleRecognition" });
});

