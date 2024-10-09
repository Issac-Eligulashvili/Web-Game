let tileSize = 32;
mapWidth = 24;
mapHeight = 24;
let currnetAnimation = null;

let layers;


let svg = document.getElementById('tileMap');
let $svg = $('#tileMap');


$('#object').css({
     'left': (svg.getAttribute('width') / 2) - $('#object').outerWidth() / 4,
})

svg.setAttribute('height', (svg.getAttribute('width') / 2) + tileSize / 2)

objProperties.position.x = parseInt($('#object').css('left'));
objProperties.position.y = parseInt($('#object').css('top'));





objProperties.velocity = {
     x: 6,
     y: 3,
}

const animationFrames = {
     up: ['/img/character/character_0000_up_1.png', '/img/character/character_0001_up_2.png', '/img/character/character_0002_up_3.png'],
     right: ['/img/character/character_0003_right_1.png', '/img/character/character_0004_right_2.png', '/img/character/character_0005_right_3.png'],
     down: ['/img/character/character_0006_down_1.png', '/img/character/character_0007_down_2.png', '/img/character/character_0008_down_3.png'],
     left: ['/img/character/character_0009_left_1.png', '/img/character/character_0010_left_2.png', '/img/character/character_0011_left_3.png']
}
let animationFrame = 0;


const player = $("#object");

function moveIso(object, direction) {

     const obj = document.getElementById(`${object}`);

     let velX = objProperties.velocity.x;
     let velY = objProperties.velocity.y;

     // Store new position
     let newX = objProperties.position.x;
     let newY = objProperties.position.y;

     if (direction === 'left') {
          newX -= velX;
          newY -= velY;
          currnetAnimation = 'left';
     } else if (direction === 'right') {
          newX += velX;
          newY += velY;
          currnetAnimation = 'right';
     } else if (direction === 'up') {
          newX += velX;
          newY -= velY;
          currnetAnimation = 'up';
     } else if (direction === 'down') {
          newX -= velX;
          newY += velY;
          currnetAnimation = 'down';
     }

     // Convert new screen position back to isometric grid
     const isoCoords = screenToIso(newX, newY, tileSize);
     let { x, y } = isoCoords;


     if (!isoCollisions(isoCoords.isoX, isoCoords.isoY)) {
          objProperties.position.x = newX;
          objProperties.position.y = newY;

          $(`#${object}`).css({
               left: `${newX}px`,
               top: `${newY}px`,
          });

          if (currnetAnimation) {
               const frame = animationFrames[currnetAnimation][animationFrame % animationFrames[currnetAnimation].length];
               obj.style.backgroundImage = `url(${frame})`;

               // Cycle through animation frames
               animationFrame++;
          }
     }
}

// Collision detection based on the isometric grid
function isoCollisions(isoX, isoY) {
     // Assuming your SVG tiles have IDs or classes you can query
     const tile = document.querySelector(`#layer_2 #tile_${isoX}_${isoY}`);

     if (tile === null) {
          // No tile at this position
          return true;
     }
     // You can also check if the tile is "solid" or "non-walkable" based on additional attributes or data
     return false
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

//setting initial position of the arrow
function moveArrow() {
     const arrow = document.querySelector('#arrow');

     layers = 3
     let fromFrame = { screenX, screenY };
     let toFrame = { screenX, screenY };
     fromFrame = isoToScreen(mapWidth / 2 - layers, mapHeight + 3);
     toFrame = isoToScreen(mapWidth / 2 - layers, mapHeight + 1);

     arrow.style.setProperty('--from-top', `${fromFrame.screenY}px`);
     arrow.style.setProperty('--from-left', `${fromFrame.screenX}px`);
     arrow.style.setProperty('--to-top', `${toFrame.screenY}px`);
     arrow.style.setProperty('--to-left', `${toFrame.screenX}px`);

}

moveArrow();