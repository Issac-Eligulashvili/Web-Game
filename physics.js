function fall(object, floor) {
     const obj = document.querySelector(`#${object}`);
     const $obj = $(`#${object}`);
     const referenceOffset = $('#container').offset();

     let terminalVelocity = 10;
     const loop = () => {
          groundedThisFrame = false;

          // Predict the future Y position
          const futureY = objProperties.position.y + objProperties.velocity.y + $obj.outerHeight();

          $('.floor').each(function () {
               if (isCollidingY($obj, $(this))) {
                    if (objProperties.velocity.y >= 0) {
                         // Get the top of the floor element
                         const floorTop = Math.round($(this).offset().top - referenceOffset.top);

                         // Check if the future position would collide with the floor
                         if (futureY > floorTop) {
                              // Snap the player to the floor before collision happens
                              objProperties.position.y = floorTop - $obj.outerHeight();
                              objProperties.velocity.y = 0;
                              groundedThisFrame = true;
                              objProperties.jumping = false;
                         }

                         return false;
                    }
               }
          });

          isGrounded = groundedThisFrame;

          // If not grounded, continue applying gravity
          if (!isGrounded) {
               objProperties.velocity.y += gravity;
               if (objProperties.velocity.y > terminalVelocity) {
                    objProperties.velocity.y = terminalVelocity;
               }
          }

          // Update the player's position only if there's no collision
          if (!groundedThisFrame) {
               objProperties.position.y += objProperties.velocity.y;
          }
          obj.style.top = `${Math.round(objProperties.position.y)}px`;

          // Request the next frame
          requestAnimationFrame(loop);
     };

     loop();
}
