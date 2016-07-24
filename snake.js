// * lesson 2
//var snake = [{ top: 0, left: 2}];
//var drawableSnake = {color: "green", pixels: snake };
//var drawableObjects = [drawableSnake];
// * increase length of snake
// var snake2 = [{ top: 0, left: 3}];
// var drawableSnake2 = {color: "green", pixels: snake2 };
//drawableObjects.push(drawableSnake2);
// * insert an apple
// var apple = [{ top: 3, left: 5}];
// var drawableApple = { color: "red", pixels: apple };
// drawableObjects.push(drawableApple);
// * add drawableApple to drawableObjects array
// CHUNK.draw(drawableObjects);

var draw = function(snakeToDraw, apple) {
  var drawableSnake = { color: "green", pixels: snakeToDraw };
  // * insert [] around apple because apple is not an array
  var drawableApple = { color: "red", pixels: [apple] };
  var drawableObjects = [drawableSnake, drawableApple];
  CHUNK.draw(drawableObjects);
}

var moveSegment = function(segment) {
  // if (segment.direction === "down") {
  //   return { top: segment.top + 1, left: segment.left }
  // } else if (segment.direction === "up") {
  //   return { top: segment.top - 1, left: segment.left }
  // } else if (segment.direction === "right") {
  //   return { top: segment.top, left: segment.left + 1 }
  // } else if (segment.direction === "left") {
  //   return { top: segment.top, left: segment.left - 1 }
  // }
  switch (segment.direction) {
    //only use "break" if not using "return"
    case "down":
      return { top: segment.top + 1, left: segment.left };
    case "up":
      return { top: segment.top - 1, left: segment.left };
    case "right":
      return { top: segment.top, left: segment.left + 1 };
    case "left":
      return { top: segment.top, left: segment.left - 1 };
    default:
    return segment;
  }
}

var segmentFurtherForwardThan = function(index, snake) {
  // * alternative code using "if else"
  // if (snake[index - 1] === undefined) {
  //   return snake[index];
  // } else {
  //   return snake[index - 1];
  // }
  // * || means OR
  return snake[index - 1] || snake[index];
}

// * assume snake only 1 segment long and always move down
var moveSnake = function(snake) {
  // * use foreach function
  // var newSnake = [];
  // snake.forEach(function(oldSegment) {
  //   var newSegment = moveSegment(oldSegment);
  //   newSegment.direction = oldSegment.direction;
  //   newSnake.push(newSegment);
  // });
  // return newSnake;
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });
}

var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}

var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

var advanceGame = function() {
  var newSnake = moveSnake(snake);

  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!");
  }

  snake = newSnake;
  draw(snake, apple);
}

var changeDirection = function(direction) {
  snake[0].direction = direction;
}

var apple = CHUNK.randomLocation();

// * change "down" to "right", "up" etc
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
// * increase 1 to 2, 3 etc to move snake faster
CHUNK.executeNTimesPerSecond(advanceGame, 1);
CHUNK.onArrowKey(changeDirection);
