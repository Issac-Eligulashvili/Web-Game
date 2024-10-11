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

//gravity
function fall(object, floor) {

     const obj = document.querySelector(`#${object}`);
     console.log(obj);
     const collidables = document.querySelectorAll(`.${floor}`);
     const referenceOffset = $('#container').offset();




     const loop = () => {
          const objRight = $(`#${object}`).find('.leftDetector').offset().left;
          const objLeft = $(`#${object}`).find('.rightDetector').offset().left;

          if (!isGrounded) {
               objProperties.velocity.y += gravity;
          }
          objProperties.position.y += objProperties.velocity.y;

          obj.style.top = `${objProperties.position.y}px`;
          const bottom = $(`#${object}`).find('.bottomDetector').offset();
          let bottomCoords = Math.ceil(bottom.top - referenceOffset.top);

          collidables.forEach((collidable) => {
               //defining variables for the boudns/colissions
               let collidableTop, collidableBottom, collidableLeft, collidableRight;

               //check to see if it is an svg or actual dom element
               if (collidable instanceof SVGElement) {
                    //use getBoundingClientRect for svg elements
                    const bounds = collidable.getBoundingClientRect();
                    collidableTop = Math.ceil(bounds.top + window.scrollY - referenceOffset.top);
                    collidableBottom = collidableTop + bounds.height;
                    collidableLeft = Math.ceil(bounds.left + window.scrollX - referenceOffset.left);
                    collidableRight = collidableLeft + bounds.width;
               } else {
                    //Use normal offset for normal dom elements
                    const collidableOffset = $(collidable).offset();

                    collidableTop = Math.ceil(collidableOffset.top - referenceOffset.top);
                    collidableBottom = collidableTop + collidable.offsetHeight;
                    collidableLeft = Math.ceil(collidableOffset.left - referenceOffset.left);
                    collidableRight = collidableLeft + collidable.offsetWidth;
               }



               //check for collisions 
               if (
                    bottomCoords >= collidableTop && // Check within vertical range
                    objLeft > collidableLeft &&
                    objRight < collidableRight &&
                    // bottomCoords <= collidableTop + obj.offsetHeight / 2 &&
                    objProperties.velocity.y >= 0
               ) {
                    objProperties.position.y = collidableTop - obj.offsetHeight;
                    objProperties.velocity.y = 0;
                    groundedThisFrame = true;
                    objProperties.jumping = false;
               } else if (isGrounded && (objRight < collidableRight || objLeft > collidableLeft)) {
                    groundedThisFrame = false;
                    objProperties.jumping = true;
               }
          })
          isGrounded = groundedThisFrame

          requestAnimationFrame(loop);
     }

     loop();

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

function isColliding($div1, $div2) {
     let d2Offset = $div2.offset();

     let d1Height = $div1.outerHeight(true);
     let d1Width = $div1.outerWidth(true);
     let d2Height = $div2.outerHeight(true);
     let d2Width = $div2.outerWidth(true);

     let d1Top = d1Offset.top;
     let d1Bottom = d1Top + d1Height;
     let d1Left = d1Offset.left;
     let d1Right = d1Offset.left + d1Width;

     let d2Top = d2Offset.top;
     let d2Bottom = d2Offset.top + d2Height;
     let d2Left = d2Offset.left;
     let d2Right = d2Offset.left + d2Width;

     return !(d1Bottom < d2Top || d1Top > d2Bottom || d1Right < d2Left || d1Left > d2Right);
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

function jump(object) {
     const obj = $(`#${object}`)
     if (isGrounded) {
          isGrounded = false;
          objProperties.jumping = true;
          objProperties.velocity.y += jumpForce;
     }
}


function move(object, direction) {
     const obj = document.querySelector(`#${object}`);
     const $obj = $(`#${object}`);

     const loop = () => {
          let collisionDetectedX = false;
          if (isMovingRight || isMovingLeft) { //Check if is moving is true
               $('.wall').each(function () {
                    // element == this
                    if (isColliding($obj, $(this))) {
                         collisionDetectedX = true;
                         const collidedWith = this;
                         //getting the X data of the object collided with 
                         const collidedWithOffset = collidedWith.getBoundingClientRect(); //getting all of its location data
                         const collidedWithWidth = collidedWithOffset.width; //getting the width of the object
                         const collidedWithLeft = collidedWithOffset.left - 2; //getting the left bound of the object
                         const collidedWithRight = collidedWithLeft + collidedWithWidth; //getting the right bound of the object

                         if (direction === 'right' && $obj.find('.rightDetector').offset().left - 2 >= collidedWithLeft) {
                              objProperties.position.x = collidedWithLeft - $obj.outerWidth() - 1;
                              obj.style.left = `${objProperties.position.y}px`;
                              collidedX = true;

                         } else if (direction === 'left' && $obj.find('.leftDetector').offset().left - 2 <= collidedWithRight) {
                              objProperties.position.x = collidedWithRight + 1;
                              obj.style.left = `${objProperties.position.y}px`;
                              collidedX = true;
                         }
                    }
               });

               if (!collidedX) {
                    //change positionX variable based on user input.
                    if (direction === 'left' && !collidedX) {
                         objProperties.position.x -= objProperties.velocity.x;
                    } else if (direction === 'right' && !collidedX) {
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

