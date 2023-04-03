console.log("Chess OCR Chrome Extension content script loaded");

let recognitionActive = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleRecognition") {
    recognitionActive = !recognitionActive;

    if (recognitionActive) {
      customLog("log", "Chess board recognition activated");
      getChessBoardImage().then((chessBoardImage) => {
        customLog("debug", "Starting Tesseract OCR recognition");
        Tesseract.recognize(chessBoardImage)
          .then((result) => {
            saveImageToDownloads(chessBoardImage.src);
            const fen = convertToChessFEN(result.data);
            saveFENToDownloads(fen);
            customLog("log", "FEN string extracted:", fen);
            sendDataToPythonScript(fen);
          })
          .catch((error) => {
            customLog("error", "OCR error:", error);
          });
      });
    } else {
      customLog("log", "Chess board recognition deactivated");
    }
  }
});

async function getChessBoardImage() {
  try {
    customLog("debug", "Extracting chess board image");
    const chessBoardElement = document.querySelector("#board-single");
    customLog("log", "Chess board element info:", chessBoardElement);
    customLog("log", "Element type:", chessBoardElement.nodeName.toLowerCase());
    customLog("log", "Element attributes:", chessBoardElement.attributes);
    if (chessBoardElement.nodeName.toLowerCase() === 'svg') {
          const chessBoardImage = svgToImage(chessBoardElement);
          processChessBoardImage(chessBoardImage);
        } else {
          processChessBoardImage(chessBoardElement);
        }
        const canvas = await html2canvas(chessBoardElement);
        const imageData = canvas.toDataURL();
        customLog("log", "Chess board image data extracted:", imageData);
        return imageData;
      } catch (error) {
        customLog("error", "Error getting chess board image:", error);
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
        customLog("error", "Error processing chess board image:", error);
      }
    }

    function convertToChessFEN(data) {
      try {
        customLog("debug", "Converting recognized data to chess FEN");
        const chess = new Chess();
        return chess.fen();
      } catch (error) {
            customLog("error", "Error converting to chess FEN:", error);
          }
        }

        function sendDataToPythonScript(fen) {
          try {
            customLog("log", "Fake-submitting FEN:", fen);
            const suggestions = [
              "Suggestion 1",
              "Suggestion 2",
              "Suggestion 3",
            ];
            displaySuggestions(suggestions);
          } catch (error) {
            customLog("error", "Error sending data to Python script:", error);
          }
        }

        function displaySuggestions(suggestions) {
          try {
            customLog("debug", "Displaying suggestions");
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
            customLog("error", "Error displaying suggestions:", error);
          }
        }

        // Save the image to downloads
        function saveImageToDownloads(imageData) {
          const link = document.createElement('a');
          link.href = imageData;
          link.download = 'chessboard.png';
          document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       }

       // Save FEN to downloads
       function saveFENToDownloads(fen) {
         const blob = new Blob([fen], { type: 'text/plain' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = 'fen.txt';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       }

       // Save logs to downloads
       function saveLogsToDownloads(logStr) {
         const logFileName = 'logs.txt';
         chrome.storage.local.get({ logs: '' }, (result) => {
           const updatedLogs = result.logs + logStr;
           chrome.storage.local.set({ logs: updatedLogs }, () => {
             if (chrome.runtime.lastError) {
               console.error(chrome.runtime.lastError);
             }
           });
         });
       }

       // Custom log function
       function customLog(type, ...messages) {
         console[type](...messages);
         const logStr = `[${type.toUpperCase()}] ${messages.join(' ')}\n`;
         saveLogsToDownloads(logStr);
       }

       // Replace all console.log, console.debug, and console.error with customLog function
       // Example:
       // console.log("Example log message");
       // customLog("log", "Example log message");


