let mode;
let objectParam;

function changeMode(setMode) {
     mode = setMode;
}

$(document).ready(function () {
     //Detecting Collisions 

     let currentDirection;

     createHitboxes(objectParam);


     console.log(mode);

     if (mode === 'topDown' || mode === 'isometric') {
          currentDirection = null;
     } else {
          currentDirection = 'moving'
     }

     console.log(currentDirection);

     // fall('object', 'floor');
     $(document).keydown(function (e) {
          const player = document.getElementById('#object');
          let playerOffset = $('#object').offset();
          const { playerIsoX, playerIsoY } = screenToIso(playerOffset.left, playerOffset.top, 64, 64);

          // Helper function to move in a direction
          function handleMovement(direction, axis) {
               if (direction === 'right' && !isMovingRight) {
                    isMovingRight = true;
                    move(objectParam, 'right', 'container');
                    currentDirection = 'right';
               } else if (direction === 'left' && !isMovingLeft) {
                    isMovingLeft = true;
                    move(objectParam, 'left', 'container');
                    currentDirection = 'left';
               } else if (axis === 'y') {
                    if (direction === 'up' && !isMovingUp) {
                         isMovingUp = true;
                         moveY(objectParam, 'up');
                         currentDirection = 'up';
                    } else if (direction === 'down' && !isMovingDown) {
                         isMovingDown = true;
                         moveY(objectParam, 'down');
                         currentDirection = 'down';
                    }
               }
          }

          // Main keydown logic
          if (currentDirection === null && mode === 'topDown') {
               if (e.key === 'ArrowRight') {
                    handleMovement('right');
               } else if (e.key === 'ArrowLeft') {
                    handleMovement('left');
               } else if (e.key === 'ArrowUp' && mode === 'platformer') {
                    jump(objectParam);
               } else if (e.key === 'ArrowUp' && mode === 'topDown') {
                    handleMovement('up', 'y');
               } else if (e.key === 'ArrowDown' && mode === 'topDown') {
                    handleMovement('down', 'y');
               } else if (e.key === 'k') {
                    $('.changeContainer').fadeToggle();
               }
          } else if (mode === 'platformer') {
               if (e.key === 'ArrowRight') {
                    handleMovement('right');
               } else if (e.key === 'ArrowLeft') {
                    handleMovement('left');
               } else if (e.key === 'ArrowUp') {
                    jump(objectParam);
               }
          } else if (mode === 'isometric' && currentDirection === null) {
               if (e.key === 'ArrowRight') {
                    moveIso(objectParam, 'right')
               } else if (e.key === 'ArrowLeft') {
                    moveIso(objectParam, 'left')
               } else if (e.key === 'ArrowUp') {
                    moveIso(objectParam, 'up')
               } else if (e.key === 'ArrowDown') {
                    moveIso(objectParam, 'down')
               }
          }
     });

     $(document).keyup(function (e) {
          if (e.key === 'ArrowRight') {
               isMovingRight = false;
               if (mode === 'topDown') {
                    currentDirection = null;
               }
          } else if (e.key === 'ArrowLeft') {
               isMovingLeft = false;
               if (mode === 'topDown') {
                    currentDirection = null;
               }
          } else if (e.key === 'ArrowUp' && mode === 'topDown') {
               isMovingUp = false;
               if (mode === 'topDown') {
                    currentDirection = null;
               }
          } else if (e.key === 'ArrowDown' && mode === 'topDown') {
               isMovingDown = false;
               if (mode === 'topDown') {
                    currentDirection = null;
               }
          }
     });

     $('.timelineBtn').on('click', (e) => {
          const id = e.currentTarget.id;
          e.preventDefault(); // Prevent the default link behavior
          document.body.classList.add('fade-out'); // Add fade-out class
          console.log('pressed');

          setTimeout(() => {
               window.location.href = `${id}.html`; // Navigate after animation
          }, 500); // Match this duration to the CSS transition
     })


});






