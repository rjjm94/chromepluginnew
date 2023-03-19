let recognitionActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleRecognition") {
        recognitionActive = !recognitionActive;

        if (recognitionActive) {
            console.log("Recognition activated.");
            const chessBoardImage = getChessBoardImage();
            Tesseract.recognize(chessBoardImage)
                .then((result) => {
                    console.log("OCR success:", result);
                    const fen = convertToChessFEN(result.data);
                    sendDataToPythonScript(fen);
                })
                .catch((error) => {
                    console.error("OCR error:", error);
                });
        } else {
            console.log("Recognition deactivated.");
        }
    }
});

function getChessBoardImage() {
    console.log("Finding chess board image...");
    const chessBoardElement = document.querySelector(".chess-board-selector");
    const canvas = document.createElement("canvas");
    canvas.width = chessBoardElement.clientWidth;
    canvas.height = chessBoardElement.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(chessBoardElement, 0, 0);
    console.log("Chess board image found.");
    return canvas.toDataURL();
}

function convertToChessFEN(data) {
    console.log("Converting OCR output to chess FEN...");
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
    console.log("Displaying suggestions:", suggestions);
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
