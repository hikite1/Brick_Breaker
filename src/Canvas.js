import React, { useEffect } from "react"; //import React library and useEffect hook
//{ useEffect } is destructuring importing hook performing side effects(data fetching, subscriptions, change DOM)

const Canvas = () => {
  //declares functional component(building blocks of UI, type of component defined as a function)
  /* global $ */ //indicates code relies on global variables from external libraries

  const getRandomColor = () => {
    //arrow function expression
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`; //placeholders for template literal variables
  };

  // GLOBAL VARIABLES
  let x = 200;
  let y = 150;
  let dx = 1;
  let dy = -3;
  let ctx, width, height, paddlex, bricks, brickWidth;
  let paddleh = 15;
  let paddlew = 75;
  let canvasMinX = 0;
  let canvasMaxX = 0;
  let intervalId = 0;
  let nrows = 6;
  let ncols = 6;
  let brickHeight = 20;
  let padding = 1;
  let ballRadius = 10;
  let brick_colors = ["purple", "lime", "gold", "black", "white"];
  let paddlecolor = getRandomColor();
  let ballcolor = getRandomColor();
  let backcolor = "grey";
  let score = 0;
  let paused = false;
  let gameRunning = false;
  let initialDx = 1;
  let initialDy = -3;
  let ballImage = new Image(); //creates new instance of Image object in JS representing HTML image
  ballImage.src =
    "https://www.freeiconspng.com/uploads/hd-fireball-png-transparent-background-20.png";
  let explodingImage = new Image();
  explodingImage.src = //set source property to a URL
    "https://icon-library.com/images/explosion-icon-png/explosion-icon-png-11.jpg";
  let explosionTimer = 0;
  let explosionDuration = 1000;

  //initialize game
  function init() {
    //get a reference to the id canvas
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d"); //draws on canvas, obtain 2D rendering
    width = canvas.width;
    height = canvas.height;
    canvasMinX = canvas.offsetLeft;
    canvasMaxX = canvasMinX + width;
    //run draw function every 10 milliseconds to give
    //the illusion of movement
    init_bricks();
    start_animation();
  }

  const rect = (x, y, w, h) => {
    //arrow function used for drawing a filled rectangle on HTML canvas
    ctx.strokeStyle = "black"; //affects the outline color of rectangle
    ctx.lineWidth = 4; //sets width of stroke outline in pixels
    ctx.strokeRect(x, y, w, h); //draws the outline of rectangle using current color, width, and paramaters
    ctx.beginPath(); //begins new path in context of canvas API
    ctx.rect(x, y, w, h); //sets up path for a filled rectangle
    ctx.closePath(); //closes path to complete the path before filling it
    ctx.fill(); //fills current path with current color
  };

  const clear = () => {
    ctx.clearRect(0, 0, width, height); //clears a rectangle portion of the canvas, starts at top left corner
    rect(0, 0, width, height);
  };

  const onMouseMove = (event) => {
    //arrow function taking an event paramater (event handler)
    if (event.pageX > canvasMinX && event.pageX < canvasMaxX) {
      //checks if mouse x coordinate is in horizontal canvas boundaries
      paddlex = Math.max(event.pageX - canvasMinX - paddlew / 2, 0); //ensures paddle does not go beyond canvas left boundary
      paddlex = Math.min(width - paddlew, paddlex); //prevents paddle from going beyond right boundary of canvas
    }
  };

  const onKeyPress = (event) => {
    event.preventDefault(); //ensures that default action of a key press is not executed
  };

  const spaceBarListener = (event) => {
    if (event.key === " ") {
      //checks if key pressed is equal to the space character
      pause();
    }
  };

  const pause = () => {
    if (paused) {
      //checks if variable paused is truthy
      if (!gameRunning) {
        //checks if variable gameRunning is falsy
        start_animation();
      }
    } else {
      //if paused is falsy
      stop_animation();
    }
    paused = !paused; //toggles value of paused variable state
  };

  const init_bricks = () => {
    bricks = new Array(nrows); //creates an array specified by nrows variable. Each element is initialized to undefined
    for (let i = 0; i < nrows; i++) {
      //iterates over bricks array starting at 0 and goes until nrows is -1
      bricks[i] = new Array(ncols); //each row is a new array, length specified by ncols, represents a row of bricks
      for (let j = 0; j < ncols; j++) {
        //iterates over columns of current row, variable starts at 0 and increments until ncols is -1
        bricks[i][j] = true; //sets value of current brick to true
      }
    }
  };

  const draw_bricks = () => {
    for (let i = 0; i < nrows; i++) {
      for (let j = 0; j < ncols; j++) {
        if (bricks[i][j]) {
          //checks current brick position in array to see if it is truthy(present)
          if (
            //checks if x + y ball position is within boundaries of current brick
            x > j * (brickWidth + padding) &&
            x < (j + 1) * (brickWidth + padding) &&
            y > i * (brickHeight + padding) &&
            y < (i + 1) * (brickHeight + padding)
          ) {
            if (explosionTimer <= explosionDuration) {
              //checks if explosion is still in progress based on timer
              const explosionSize =
                1 + (explosionTimer / explosionDuration) * 2; //size of explosion based on timer
              ctx.drawImage(
                //draws exploding image at position of current brick
                explodingImage,
                j * (brickWidth + padding) - (explosionSize * brickWidth) / 2,
                i * (brickHeight + padding) - (explosionSize * brickHeight) / 2,
                explosionSize * brickWidth,
                explosionSize * brickHeight
              );
              explosionTimer += 10; //timer to control progression of explosion animation
            }
          } else {
            //ball is not within boundaries of current brick
            ctx.fillStyle = brick_colors[(i + j) % brick_colors.length]; //fill block color based on index and chosen brick_colors
            rect(
              //called function to draw current brick on canvas
              j * (brickWidth + padding),
              i * (brickHeight + padding),
              brickWidth,
              brickHeight
            );
          }
        }
      }
    }
  };

  const draw = () => {
    ctx.fillStyle = backcolor; //sets background color of canvas
    clear();
    ctx.fillStyle = ballcolor; //sets color of the ball
    ctx.drawImage(
      //draws ball image on canvas(position and size)
      ballImage,
      x - 3 * ballRadius,
      y - 3 * ballRadius,
      6 * ballRadius,
      6 * ballRadius
    );
    ctx.fillStyle = paddlecolor; //sets paddle color
    rect(paddlex, height - paddleh, paddlew, paddleh);
    draw_bricks(); //calls draw_bricks function

    const rowheight = brickHeight + padding; //calculates row of the ball in the brick grid
    const colwidth = brickWidth + padding; //calculates the column of the ball in the brick grid
    const row = Math.floor(y / rowheight);
    const col = Math.floor(x / colwidth);

    //checks if ball is within vertical boundary of brick grid and if it is intersecting with an active block
    //if true calls functions appropriately and updates variables
    if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
      dy = -dy;
      bricks[row][col] = false;
      paddlecolor = getRandomColor();
      ballcolor = getRandomColor();
      score++;
      update_score_text();
    }

    //checks if ball is hitting horizontal boundaries of the canvas
    //if true it reverses the direction of the ball
    if (x + dx > width || x + dx < 0) dx = -dx;

    //checks if ball is hitting top or bottom of canvas
    //if true it reverses the vertical direction
    if (y + dy < 0) {
      dy = -dy;
      //if ball hits bottom and is over the paddle
      //if true it reverses the vertical direction
    } else if (y + dy > height - paddleh) {
      if (x > paddlex && x < paddlex + paddlew) {
        dy = -dy;
      }
    }
    //checks if ball has moved beyond the bottom of canvas
    if (y + dy > height) {
      stop_animation();
    }
    //updates postion of ball based on direction and moves to next fram of animation
    x += dx;
    y += dy;
  };

  const update_score_text = () => {
    //locates HTML element id, sets innerText of element to score string
    document.getElementById("score").innerText = "Score: " + score;
  };

  const start_animation = () => {
    intervalId = setInterval(draw, 10); //repeatedly executes draw function every 10 milliseconds
  };

  const stop_animation = () => {
    clearInterval(intervalId); //identifies position of ball and stops the next interval from executing
  };

  const reload = () => {
    stop_animation();
    //removes event listeners to prevent attached functions from being triggered
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("keypress", onKeyPress);
    document.removeEventListener("keydown", spaceBarListener);

    //remove the existing canvas if it exists
    const existingCanvas = document.getElementById("canvas");
    if (existingCanvas) {
      //sets width and height to 0 clearing content
      existingCanvas.width = 0;
      existingCanvas.height = 0;
      //removes canvas element from parent node deleting it
      existingCanvas.parentNode.removeChild(existingCanvas);
    }

    //reset variables and recreate the canvas
    x = 200;
    y = 150;
    dx = 1;
    dy = -3;
    paddlex = width;
    bricks = [];
    score = 0;
    paused = false;
    gameRunning = false;
    paddlecolor = getRandomColor();
    ballcolor = getRandomColor();
    backcolor = "grey";

    const canvasContainer = document.createElement("div"); //creates new div element
    canvasContainer.innerHTML = //sets HTML content of div(new canvas and attributes)
      '<canvas id="canvas" width="1100" height="400" style="margin: 0 auto; display: block;"></canvas>';
    document.body.prepend(canvasContainer); //inserts div at beginning of body element

    //reinitialize event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keypress", onKeyPress);
    document.addEventListener("keydown", spaceBarListener);

    init();

    //event listener for load event. Once fully loaded it calls arrow function
    document.getElementById("canvas").addEventListener("load", () => {
      start_animation();
    });
  };

  useEffect(() => { //React hook, uses following side effects in functional components. Runs after every render
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    paddlex = width / 2;
    brickWidth = width / ncols - 1;
    canvasMinX = canvas.offsetLeft;
    canvasMaxX = canvasMinX + width;
    init_bricks();

    return () => { //clean up function for hook when component is unmounted
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keypress", onKeyPress);
      document.removeEventListener("keydown", spaceBarListener);
      stop_animation();
    };
  }, []); //araay signifying this effect will only run once after initial render

  return ( //HTML code
    <div style={{ textAlign: "center" }}>
      <canvas
        id="canvas"
        width="1100"
        height="400"
        style={{ margin: "0 auto", display: "block" }}
      ></canvas>
      <button onClick={reload}>Play</button>
      <p>Mouse moves platform &bull; Press spacebar to pause</p>
      <div id="score">Score: 0</div>
    </div>
  );
};

export default Canvas; //exports component as default export of the module
