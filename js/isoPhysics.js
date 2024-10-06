let tileSize = 64;
mapWidth = 16;
mapHeight = 16;

let svg = document.getElementById('tileMap');
let $svg = $('#tileMap');
let viewportWidth = 800;
let viewportHeight = 600;

let scaleFactor = Math.floor(svg.getAttribute('width') / viewportWidth);

tileSize = Math.ceil(tileSize * scaleFactor);


$('#object').css({
     'left': (svg.getAttribute('width') / 2),
})

console.log(svg.getAttribute('width') / 2);

objProperties.position.x = parseInt($('#object').css('left'));
objProperties.position.y = parseInt($('#object').css('top'));





objProperties.velocity = {
     x: tileSize / 2,
     y: tileSize / 4,
}

const player = $("#object")

function moveIso(object, direction) {
     let velX = objProperties.velocity.x;
     let velY = objProperties.velocity.y;

     // Store new position
     let newX = objProperties.position.x;
     let newY = objProperties.position.y;

     if (direction === 'left') {
          newX -= velX;
          newY -= velY;
     } else if (direction === 'right') {
          newX += velX;
          newY += velY;
     } else if (direction === 'up') {
          newX += velX;
          newY -= velY;
     } else if (direction === 'down') {
          newX -= velX;
          newY += velY;
     }

     // Convert new screen position back to isometric grid
     console.log(newX, newY);
     const isoCoords = screenToIso(newX, newY, 64);
     console.log(isoCoords);
     let { x, y } = isoCoords;

     console.log(isoCoords.isoX, isoCoords.isoY);

     if (!isoCollisions(isoCoords.isoX, isoCoords.isoY)) {
          console.log('not colliding');
          objProperties.position.x = newX;
          objProperties.position.y = newY;
          console.log(newX);
          console.log(newY);

          $(`#${object}`).css({
               left: `${newX}px`,
               top: `${newY}px`,
          });
     }

}

// Collision detection based on the isometric grid
function isoCollisions(isoX, isoY) {
     console.log(isoX, isoY);
     // Assuming your SVG tiles have IDs or classes you can query
     const tile = document.querySelector(`#tile_${isoX}_${isoY}`);
     console.log(tile);

     if (tile === null) {
          // No tile at this position
          return true;
     }
     // You can also check if the tile is "solid" or "non-walkable" based on additional attributes or data
     return false;
}

// Converts isometric coordinates to screen (pixel) coordinates
function isoToScreen(isoX, isoY) {
     const screenX = (isoX - isoY) * (tileSize / 2) + (svg.getAttribute('width') / 2);
     const screenY = (isoX + isoY) * (tileSize / 4);
     return { screenX, screenY };
}

// Converts screen (pixel) coordinates to isometric coordinates
function screenToIso(screenX, screenY, tileSize) {
     const isoX = (((2 * screenX) + (4 * screenY) - svg.getAttribute('width')) / (2 * tileSize));
     const isoY = ((4 * screenY) / tileSize) - isoX;

     // Return the calculated isometric coordinates
     return { isoX: Math.ceil(isoX), isoY: Math.ceil(isoY) };
}
