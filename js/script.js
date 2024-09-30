$(document).ready(function () {
     //Detecting Collisions 
     const objectParam = 'object';
     createHitboxes(objectParam);
     topDownMovement(objectParam);
     let mode;
     mode = 'topDown';
     topDownMovement(objectParam);

     let currentDirection = null;


     // fall(objectParam, 'collidable');


     //moving the ball
     $(document).keydown(function (e) {
          if (currentDirection === null) {
               if (e.key === 'ArrowRight' && !isMovingRight) {
                    isMovingRight = true;
                    move(objectParam, 'right', 'container');
                    currentDirection = 'right';
               } else if (e.key === 'ArrowLeft' && !isMovingLeft) {
                    isMovingLeft = true;
                    move(objectParam, 'left', 'container');
                    currentDirection = 'left';
               } else if (e.key === 'ArrowUp' && mode === 'platformer') {
                    jump(objectParam);
               } else if (e.key === 'ArrowUp' && mode === 'topDown' && !isMovingUp) {
                    isMovingUp = true;
                    moveY(objectParam, 'up');
                    currentDirection = 'up';
               } else if (e.key === 'ArrowDown' && mode === 'topDown' && !isMovingDown) {
                    isMovingDown = true;
                    moveY(objectParam, 'down');
                    currentDirection = 'down';
               } else if (e.key === 'k') {
                    $('.changeContainer').fadeToggle();
               }
          }
     });
     $(document).keyup(function (e) {
          if (e.key === 'ArrowRight') {
               isMovingRight = false;
               currentDirection = null;
          } else if (e.key === 'ArrowLeft') {
               isMovingLeft = false;
               currentDirection = null;
          } else if (e.key === 'ArrowUp' && mode === 'topDown') {
               isMovingUp = false;
               currentDirection = null;
          } else if (e.key === 'ArrowDown' && mode === 'topDown') {
               isMovingDown = false;
               currentDirection = null;
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






