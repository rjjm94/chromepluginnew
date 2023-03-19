document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startRecognition").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "toggleRecognition" });
        });
    });
});
