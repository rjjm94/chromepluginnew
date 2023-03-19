console.log("Chess OCR Chrome Extension content script loaded");

let recognitionActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleRecognition") {
    recognitionActive = !recognitionActive;

    if (recognitionActive) {
      console.log("Chess board recognition activated");
      getChessBoardImage().then((chessBoardImage) => {
        console.debug("Starting Tesseract OCR recognition");
        Tesseract.recognize(chessBoardImage)
          .then((result) => {
            console.debug("Tesseract OCR recognition completed");
            const fen = convertToChessFEN(result.data);
            console.log("FEN string extracted:", fen);
            sendDataToPythonScript(fen);
          })
          .catch((error) => {
            console.error("OCR error:", error);
          });
      });
    } else {
      console.log("Chess board recognition deactivated");
    }
  }
});

async function getChessBoardImage() {
  try {
    console.debug("Extracting chess board image");
    const chessBoardElement = document.querySelector("#board-vs-personalities");
    if (chessBoardElement.nodeName.toLowerCase() === 'svg') {
      const chessBoardImage = svgToImage(chessBoardElement);
      processChessBoardImage(chessBoardImage);
    } else {
      processChessBoardImage(chessBoardElement);
    }
    const canvas = await html2canvas(chessBoardElement);
    const imageData = canvas.toDataURL();
    console.log("Chess board image data extracted:", imageData);
    return imageData;
  } catch (error) {
    console.error("Error getting chess board image:", error);
  }
}

function svgToImage(svgElement) {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  img.src = url;
  return img;
}

function processChessBoardImage(chessBoardImage) {
  try {
    const backgroundUrl = "https://www.chess.com/boards/blue/150.png";
    chessBoardImage.style.backgroundImage = `url(${backgroundUrl})`;
  } catch (error) {
    console.error("Error processing chess board image:", error);
  }
}

function convertToChessFEN(data) {
  try {
    // Custom algorithm to convert recognized text data to a chess board layout
    console.debug("Converting recognized data to chess FEN");
    const chess = new Chess();
    // Update the chess.js object with the converted chess board layout
    return chess.fen();
  } catch (error) {
    console.error("Error converting to chess FEN:", error);
  }
}

function sendDataToPythonScript(fen) {
  try {
    console.log("Fake-submitting FEN:", fen);
    // Simulate fake suggestions received from the server
    const suggestions = [
      "Suggestion 1",
      "Suggestion 2",
      "Suggestion 3",
    ];
    displaySuggestions(suggestions);
  } catch (error) {
    console.error("Error sending data to Python script:", error);
  }
}

function displaySuggestions(suggestions) {
  try {
    console.debug("Displaying suggestions");
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.zIndex = 1000;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.color = "white";
    overlay.style.padding = "10px";
    overlay.style.borderRadius = "5px";
    overlay.innerHTML = suggestions.join("<br>");
    document.body.appendChild(overlay);
  } catch (error) {
    console.error("Error displaying suggestions:", error);
  }
}
