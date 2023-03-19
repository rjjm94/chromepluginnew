console.log("Chess OCR Chrome Extension content script loaded");

let recognitionActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleRecognition") {
    recognitionActive = !recognitionActive;

    if (recognitionActive) {
      console.log("Chess board recognition activated");
      const chessBoardImage = getChessBoardImage();
      Tesseract.recognize(chessBoardImage)
        .then((result) => {
          const fen = convertToChessFEN(result.data);
          console.log("FEN string extracted:", fen);
          sendDataToPythonScript(fen);
        })
        .catch((error) => {
          console.error("OCR error:", error);
        });
    } else {
      console.log("Chess board recognition deactivated");
    }
  }
});

function getChessBoardImage() {
  const chessBoardElement = document.querySelector("#board-vs-personalities");
  const canvas = document.createElement("canvas");
  canvas.width = chessBoardElement.clientWidth;
  canvas.height = chessBoardElement.clientHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(chessBoardElement, 0, 0);
  const imageData = canvas.toDataURL();
  console.log("Chess board image data extracted:", imageData);
  return imageData;
}

function convertToChessFEN(data) {
  // Custom algorithm to convert recognized text data to a chess board layout
  const chess = new Chess();
  // Update the chess.js object with the converted chess board layout
  return chess.fen();
}

function sendDataToPythonScript(fen) {
  console.log("Fake-submitting FEN:", fen);
  // Simulate fake suggestions received from the server
  const suggestions = [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3",
  ];
  displaySuggestions(suggestions);
}

function displaySuggestions(suggestions) {
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.zIndex = 1000;
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.color = "white";
  overlay.style.padding = "10px";
  overlay.style.borderRadius = "5px";
  overlay.innerHTML = suggestions.join("<br>");
  document.body.appendChild(overlay);
}
