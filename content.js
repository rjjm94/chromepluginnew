console.log("Chess OCR Chrome Extension content script loaded");

let recognitionActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleRecognition") {
    recognitionActive = !recognitionActive;

    if (recognitionActive) {
      console.log("Chess board recognition activated");
      const chessBoardImage = getChessBoardImage();
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
    } else {
      console.log("Chess board recognition deactivated");
    }
  }
});

function convertToChessFEN(recognizedData) {
  console.debug("Converting recognized data to FEN");
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  let fen = "";

  for (const rank of ranks) {
    let emptySquares = 0;
    for (const file of files) {
      const position = `${file}${rank}`;
      const piece = recognizedData[position];

      if (piece) {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        fen += piece;
      } else {
        emptySquares++;
      }
    }
    if (emptySquares > 0) {
      fen += emptySquares;
    }
    if (rank > 1) {
      fen += '/';
    }
  }
  fen += ' w KQkq - 0 1'; // Add default castling, en passant, halfmove, and fullmove info
  console.debug("FEN conversion completed");
  return fen;
}


function getChessBoardImage() {
  try {
    console.debug("Extracting chess board image");
    const chessBoardElement = document.querySelector("#board-vs-personalities");
    const canvas = document.createElement("canvas");
    canvas.width = chessBoardElement.clientWidth;
    canvas.height = chessBoardElement.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(chessBoardElement, 0, 0);
    const imageData = canvas.toDataURL();
    console.log("Chess board image data extracted:", imageData);
    return imageData;
  } catch (error) {
    console.error("Error getting chess board image:", error);
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
