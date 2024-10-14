//

//vertical movement variables
let gravity = 0.5;
let positionY = 0;
let isGrounded = false;
let jumpForce = -15;
let groundedThisFrame = false;
let isMovingUp = false;
let isMovingDown = false;
let d1Offset;
let collidedY = false;
//horizontal movement varaibles
let positionX = 0;
let isMovingRight = false;
let isMovingLeft = false;
let collidedX = false;

//storing object data
let objProperties = {
     velocity: {
          x: 3,
          y: 2,
     },
     position: {
          x: 0,
          y: 0,
     },
     jumping: false,
}



//collision data 
let inBounds = true;

//creating the hitboxes for objects 

function createHitboxes(object) {
     const obj = document.querySelector(`#${object}`);
     const detectorsContainer = $('<div></div>');
     detectorsContainer.addClass('position-relative w-100 h-100');
     console.log(mode);
     if (mode === 'topDown' || 'platformer') {
          objProperties.position.x = parseInt($(`#${object}`).css('left'));
          objProperties.position.y = parseInt($(`#${object}`).css('top'));
     }



     $(`#${object}`).append(detectorsContainer);
     // creating bottom + top hitbox
     const yDetection = $('<div></div> <div></div>').addClass('yDetection');
     detectorsContainer.append(yDetection);
     $('.yDetection').css({
          'width': '100%',
          'height': '1px',
          'position': 'absolute',
     })
     const yDetectors = detectorsContainer.children('.yDetection');
     $(yDetectors[1]).css({
          'bottom': '0'
     });
     $(yDetectors[0]).addClass('topDetector');
     $(yDetectors[1]).addClass('bottomDetector');

     //creating left + right hitboxes

     const xDetection = $('<div></div> <div></div>').addClass('xDetection');
     detectorsContainer.append(xDetection);
     $('.xDetection').css({
          'width': '1px',
          'height': '100%',
          'position': 'absolute',
     })
     const xDetectors = detectorsContainer.children('.xDetection');
     $(xDetectors[1]).css({
          'right': '0'
     });
     $(xDetectors[0]).addClass('leftDetector');
     $(xDetectors[1]).addClass('rightDetector');

     //getting player offset constantly


     const loop = () => {
          d1Offset = $(`#${object}`).offset();
          requestAnimationFrame(loop)
     }

     loop();
}

function isCollidingY($div1, $div2) {
     let d2Offset = $div2.offset();
     let d2Height, d2Top, d2Bottom, d2Left, d2Right, d2Width;

     let d1Height = $div1.outerHeight(true);
     let d1Width = $div1.outerWidth(true);
     let d1Top = $div1.offset().top;
     let d1Bottom = $div1.find('.bottomDetector').offset().top + 1;
     let d1Left = $div1.offset().left;
     let d1Right = d1Left + d1Width;

     let futureBottom = d1Bottom + objProperties.velocity.y;

     if ($div2[0] instanceof SVGElement) {
          // Use getBBox for SVG elements to get dimensions
          const bbox = $div2[0].getBoundingClientRect();

          d2Height = bbox.height;
          d2Width = bbox.width;
          d2Top = bbox.top;
          d2Bottom = d2Top + d2Height;
          d2Left = bbox.left;
          d2Right = d2Left + d2Width;
     } else {
          d2Height = $div2.outerHeight(true);
          d2Width = $div2.outerWidth(true);
          d2Top = d2Offset.top;
          d2Bottom = d2Top + d2Height;
          d2Left = d2Offset.left;
          d2Right = d2Left + d2Width;
     }

     // Only check vertical collision if within horizontal bounds (X-axis)
     const isWithinHorizontalBounds = !(d1Right < d2Left || d1Left > d2Right);

     // Only return true for vertical collisions if within horizontal bounds
     if (isWithinHorizontalBounds) {
          return futureBottom > d2Top && d1Top < d2Bottom; // Vertical collision check
     }

     return false; // No vertical collision if not in horizontal bounds
}



function isCollidingX($div1, $div2) {
     let d2Offset = $div2.offset();
     let d2Width, d2Left, d2Right, d2Top, d2Bottom;

     let d1Height = $div1.outerHeight(true);
     let d1Width = $div1.outerWidth(true);
     let d1Left = $div1.offset().left;
     let d1Right = d1Left + d1Width;
     let d1Top = d1Offset.top;
     let d1Bottom = d1Top + d1Height;

     let futureRight = d1Right + objProperties.velocity.x;
     let futureLeft = d1Left - objProperties.velocity.x;

     if ($div2[0] instanceof SVGElement) {
          // Use getBoundingClientRect for SVG elements
          const bbox = $div2[0].getBoundingClientRect();

          d2Width = bbox.width;
          d2Height = bbox.height;
          d2Left = bbox.left;
          d2Right = d2Left + d2Width;
          d2Top = bbox.top;
          d2Bottom = d2Top + d2Height;
     } else {
          d2Width = $div2.outerWidth(true);
          d2Height = $div2.outerHeight(true);
          d2Left = d2Offset.left;
          d2Right = d2Left + d2Width;
          d2Top = d2Offset.top;
          d2Bottom = d2Top + d2Height;
     }

     const isWithinVeritcalBounds = (d1Bottom > d2Top + 2);
     const isBelow = d1Top > d2Bottom;

     if (isWithinVeritcalBounds && !isBelow) {
          return !(futureRight < d2Left || futureLeft > d2Right)
     }

     // Check if the horizontal bounds of the objects overlap
     return false;
}

function topDownMovement(object) {
     const obj = $(`#${object}`);

     const loop = () => {
          // Update Y position and check for collisions
          obj.css({ top: objProperties.position.y + 'px' });

          requestAnimationFrame(loop);
     }

     loop();
}

//horizontal hitbox detection

function checkBounds(object, container) {
     const obj = document.querySelector(`#${object}`);
     const cont = $(`#${container}`).offset();
     const objWidth = $(`#${object}`).outerWidth();

     let leftBound = cont.left;
     let rightBound = cont.left + $(`#${container}`).outerWidth();

     const loop = () => {
          if ($(`#${object}`).find('.leftDetector').offset().left <= leftBound) {
               objProperties.position.x = 2;
               inBounds = true;
          } else if ($(`#${object}`).find('.rightDetector').offset().left >= rightBound) {
               objProperties.position.x = $(`#${container}`).outerWidth() - objWidth - 2;
               inBounds = true;
          }


          requestAnimationFrame(loop);
     }
     loop();
}

function jump() {
     if (isGrounded) {
          isGrounded = false;
          groundedThisFrame = false;
          objProperties.jumping = true;
          objProperties.velocity.y += jumpForce;
     }
}


function move(object, direction) {
     const obj = document.querySelector(`#${object}`);
     const $obj = $(`#${object}`);

     const loop = () => {
          if (isMovingRight || isMovingLeft) { //Check if is moving is true
               $('.floor').each(function () {
                    // element == this
                    if (isCollidingX($obj, $(this))) {
                         collisionDetectedX = true;
                         const collidedWith = this;
                         console.log(collidedWith);
                         let collidedWithOffset, collidedWithWidth, collidedWithLeft, collidedWithRight;
                         //getting the X data of the object collided with 
                         if (collidedWith instanceof SVGElement) {

                              collidedWithOffset = collidedWith.getBoundingClientRect(); //getting all of its location data
                              collidedWithWidth = collidedWithOffset.width; //getting the width of the object
                              collidedWithLeft = collidedWithOffset.left - 2; //getting the left bound of the object
                              collidedWithRight = collidedWithLeft + collidedWithWidth; //getting the right bound of the object
                         } else {
                              collidedWithOffset = collidedWith.getBoundingClientRect(); //getting all of its location data
                              collidedWithWidth = collidedWithOffset.width; //getting the width of the object
                              collidedWithLeft = collidedWithOffset.left - 2; //getting the left bound of the object
                              collidedWithRight = collidedWithLeft + collidedWithWidth; //getting the right bound of the object
                         }


                         if (direction === 'right') {
                              objProperties.position.x = collidedWithLeft - $obj.outerWidth();
                              obj.style.left = `${objProperties.position.x}px`;
                              collidedX = true;
                              objProperties.velocity.x = 0;

                         } else if (direction === 'left') {
                              objProperties.position.x = collidedWithRight + 3;
                              obj.style.left = `${objProperties.position.x}px`;
                              objProperties.velocity.x = 0;
                              collidedX = true;
                         }
                    }
               });

               if (!collidedX) {
                    //change positionX variable based on user input.
                    if (direction === 'left' && !collidedX) {
                         console.log('collidedX');
                         objProperties.velocity.x = 3;
                         objProperties.position.x -= objProperties.velocity.x;
                    } else if (direction === 'right' && !collidedX) {
                         console.log('collidedX');
                         objProperties.velocity.x = 3;
                         objProperties.position.x += objProperties.velocity.x; // Use constant speed
                    }
               }

               //change the position of the object
               obj.style.left = `${objProperties.position.x}px`

               if (isMovingRight || isMovingLeft) {
                    requestAnimationFrame(loop); // Continue the loop only if still moving
               } else {
                    collidedX = false;
               }
          } else {
               collidedX = false;
          }

     }

     loop();

}

function moveY(object, direction) {
     const obj = document.querySelector(`#${object}`);
     const $obj = $(`#${object}`);


     const loop = () => {
          let collisionDetectedY = false;

          if (isMovingUp || isMovingDown) {
               $('.wall').each(function () {
                    if (isColliding($obj, $(this))) {
                         resetY(this);
                    }
               });

               if (!collisionDetectedY) {
                    if (direction === 'up' && !collidedY) {
                         objProperties.position.y -= objProperties.velocity.y;
                    } else if (direction === 'down' && !collidedY) {
                         objProperties.position.y += objProperties.velocity.y; // Use constant speed
                    }
                    obj.style.top = `${objProperties.position.y}px`;
               }

               if (isMovingUp || isMovingDown) {
                    requestAnimationFrame(loop); // Continue the loop only if still moving
               } else {
                    collidedY = false;
               }
          } else {
               collidedY = false;
          }
     }
     loop();
}

function resetY(collided) {
     collisionDetectedY = true;
     const collidedWith = collided;
     const collidedWithOffset = collidedWith.getBoundingClientRect();
     const collidedWithHeight = collidedWithOffset.height;
     const collidedWithTop = collidedWithOffset.top - 2;
     const collidedWithBottom = collidedWithTop + collidedWithHeight;


     if (direction === 'up' && $obj.find('.topDetector').offset().top - 2 <= collidedWithBottom) {
          objProperties.position.y = collidedWithBottom + 1;
          obj.style.top = `${objProperties.position.y}px`;
          collidedY = true;
     } else if (direction === 'down' && $obj.find('.bottomDetector').offset().top - 1 >= collidedWithTop) {
          objProperties.position.y = collidedWithTop - 2 - $obj.outerHeight();
          obj.style.top = `${objProperties.position.y}px`;
          collidedY = true;
     }
}

//gravity
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
                              if (objProperties.velocity.x != 0) {
                                   console.log(objProperties.velocity.x);
                                   objProperties.position.y = floorTop - $obj.outerHeight() + 1;
                              }
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
