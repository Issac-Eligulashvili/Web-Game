const tileCanvas = document.getElementById('tileCanvas');
const ctx = tileCanvas.getContext('2d');


tileCanvas.width = tileSize * mapWidth;
tileCanvas.height = (tileSize * mapWidth + tileSize) / 2;

// Layers array, each layer contains its own tilemap
const layers = [
     Array.from({ length: mapHeight }, () => Array(mapWidth).fill(0)), // Layer 1
     Array.from({ length: mapHeight }, () => Array(mapWidth).fill(0)), // Layer 2
     Array.from({ length: mapHeight }, () => Array(mapWidth).fill(0)), // Layer 3
];
let currentLayer = 0; // The currently active layer

const tileImages = {
     1: new Image(),
     2: new Image(),
     3: new Image(),
     4: new Image(),
};

tileImages[1].src = 'grass.png';
tileImages[2].src = 'water.png';
tileImages[3].src = 'path.png';

let selectedTile = 1; // Default selected tile
let isDragging = false; // Track if the mouse is dragging

// Add click event listeners to tile palette
document.querySelectorAll('.tile').forEach(tile => {
     tile.addEventListener('click', function () {
          document.querySelector('.selected')?.classList.remove('selected');
          this.classList.add('selected');
          selectedTile = parseInt(this.dataset.tile);
     });
});

// Add click event listeners to switch between layers
document.querySelectorAll('.layer-btn').forEach((button, index) => {
     button.addEventListener('click', function () {
          currentLayer = index; // Switch to selected layer
          renderTilemap(); // Re-render the map
     });
});

// Function to place tiles on the map
function placeTileAtMouse(event) {
     const { offsetX, offsetY } = event;
     const { x, y } = screenToIso(offsetX, offsetY);
     if (x < mapWidth && y < mapHeight) {
          layers[currentLayer][y][x] = selectedTile; // Place tile on current layer
          renderTilemap();
     }
}

// Canvas mouse events for placing tiles with drag
tileCanvas.addEventListener('mousedown', function (event) {
     isDragging = true;
     placeTileAtMouse(event); // Place the tile when the mouse is first clicked
});

tileCanvas.addEventListener('mousemove', function (event) {
     if (isDragging) {
          placeTileAtMouse(event); // Continuously place tiles as the mouse moves
     }

     const { x, y } = screenToIso(event.offsetX, event.offsetY);

     // Optionally, you can visually indicate the hovered tile
     highlightTile(x, y);
});

tileCanvas.addEventListener('mouseup', function () {
     isDragging = false; // Stop dragging when the mouse button is released
});

tileCanvas.addEventListener('mouseleave', function () {
     isDragging = false; // Stop dragging when the mouse leaves the canvas
});
// Converts screen coordinates to isometric coordinates
function screenToIso(screenX, screenY) {
     const isoX = Math.floor((screenX - (tileCanvas.width / 2)) / (tileSize / 2) + screenY / (tileSize / 4) / 2);
     const isoY = Math.floor((screenY / (tileSize / 4)) / 2 - (screenX - (tileCanvas.width / 2)) / (tileSize / 2) / 2);
     return { x: isoX, y: isoY };
}

function highlightTile(isoX, isoY) {
     ctx.clearRect(0, 0, tileCanvas.width, tileCanvas.height); // Clear canvas to redraw the grid
     renderTilemap(); // Re-render all layers
     if (isoX >= 0 && isoY >= 0 && isoX < mapWidth && isoY < mapHeight) {
          const { screenX, screenY } = isoToScreen(isoX, isoY);
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Color for highlighting
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX - tileSize / 2, screenY - tileSize / 4, tileSize, tileSize); // Adjust for isometric position
     }
}



// Converts isometric coordinates to screen coordinates
function isoToScreen(isoX, isoY) {
     const screenX = (isoX - isoY) * (tileSize / 2) + (tileCanvas.width / 2); // Center X-axis
     const screenY = (isoX + isoY) * (tileSize / 4) + (tileSize / 4); // Y remains the same
     return { screenX, screenY };
}

function getCenterOffset() {
     const mapPixelWidth = (mapWidth + mapHeight) * (tileSize / 2);
     const mapPixelHeight = (mapWidth + mapHeight) * (tileSize / 4);
     const offsetX = (tileCanvas.width - mapPixelWidth) / 2;
     const offsetY = (tileCanvas.height - mapPixelHeight) / 2;
     return { offsetX, offsetY };
}

// Render the tilemap for all layers
function renderTilemap() {
     ctx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
     for (let layer = 0; layer < layers.length; layer++) {
          for (let y = 0; y < mapHeight; y++) {
               for (let x = 0; x < mapWidth; x++) {
                    if (layers[layer][y][x] !== 0) {
                         const { screenX, screenY } = isoToScreen(x, y);
                         drawTile(screenX, screenY, layers[layer][y][x]);
                    }
               }
          }
     }
}

// Draw a single tile using an image
function drawTile(x, y, tileId) {
     const tileImage = tileImages[tileId];
     if (tileImage.complete) {
          ctx.drawImage(tileImage, x - tileSize / 2, y - tileSize / 4, tileSize, tileSize);
     } else {
          tileImage.onload = () => {
               ctx.drawImage(tileImage, x - tileSize / 2, y - tileSize / 4, tileSize, tileSize);
          };
     }
}

// Convert all layers to SVG format
function tilemapToSVG() {
     let svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileCanvas.width}" height="${tileCanvas.height}">\n`;
     let svgFooter = '</svg>';
     let svgContent = '';

     for (let layer = 0; layer < layers.length; layer++) {
          svgContent += `<g id="layer_${layer}">\n`; // Group each layer
          for (let y = 0; y < mapHeight; y++) {
               for (let x = 0; x < mapWidth; x++) {
                    const tileId = layers[layer][y][x];
                    if (tileId !== 0) {
                         const { screenX, screenY } = isoToScreen(x, y);
                         const url = new URL(tileImages[tileId].src); // Use the source of the tile image
                         const imageUrl = url.pathname.substring(url.pathname.lastIndexOf('/'));

                         svgContent += `<image x="${screenX - tileSize / 2}" y="${screenY - tileSize / 4}" width="${tileSize}" height="${tileSize}" href="${imageUrl}" id="tile_${x}_${y}"/>\n`;
                    }
               }
          }
          svgContent += '</g>\n';
     }

     return svgHeader + svgContent + svgFooter;
}

// Erase tile at the mouse position
function eraseTileAtMouse(event) {
     const { offsetX, offsetY } = event;
     const { x, y } = screenToIso(offsetX, offsetY);
     if (x < mapWidth && y < mapHeight && x >= 0 && y >= 0) {
          layers[currentLayer][y][x] = 0; // Set tile to 0 (empty)
          renderTilemap();
     }
}

// Detect right-click to erase
tileCanvas.addEventListener('contextmenu', function (event) {
     event.preventDefault(); // Prevent the context menu from showing
     eraseTileAtMouse(event);
});

// Optional: drag to erase
tileCanvas.addEventListener('mousemove', function (event) {
     if (isDragging && event.buttons === 2) { // Check if the right button is pressed
          eraseTileAtMouse(event);
     }
});

// Function to get relative URL
function getRelativeUrl(imageUrl) {
     const url = new URL(imageUrl);
     return url.pathname; // Returns the path without the domain (e.g., /path/to/image.png)
}

// Download SVG
function downloadSVG() {
     const svgData = tilemapToSVG();
     const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'tilemap.svg';
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
}

// Add a button to download the SVG
// const downloadButton = document.createElement('button');
// downloadButton.textContent = 'Download SVG';
// downloadButton.addEventListener('click', downloadSVG);
// document.body.appendChild(downloadButton);

// Initial render
renderTilemap();

// Function to draw grid lines
function drawGrid() {
     ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Light grid color
     ctx.beginPath();

     // Draw vertical lines
     for (let x = -mapWidth; x <= mapWidth; x++) {
          const isoX = (x) * (tileSize / 2);
          const isoY1 = -mapHeight * tileSize / 4; // Start from top of the canvas
          const isoY2 = mapHeight * tileSize / 4; // Extend to bottom
          ctx.moveTo(isoX + (tileCanvas.width / 2), isoY1); // Adjust X to be centered
          ctx.lineTo(isoX + (tileCanvas.width / 2), isoY2); // Adjust X to be centered
     }

     // Draw horizontal lines
     for (let y = 0; y <= mapHeight; y++) {
          const isoY = y * (tileSize / 4);
          const isoX1 = -mapWidth * tileSize / 2 + (tileCanvas.width / 2); // Start from left of the canvas
          const isoX2 = mapWidth * tileSize / 2 + (tileCanvas.width / 2); // Extend to right
          ctx.moveTo(isoX1, isoY);
          ctx.lineTo(isoX2, isoY);
     }

     ctx.stroke();
}

// Call drawGrid to render the grid
drawGrid();
