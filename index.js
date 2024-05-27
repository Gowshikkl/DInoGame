  import Player from "./Player.js";
  import Ground from "./Ground.js";
  import CactiController from "./CactiController.js";
  import BirdController from "./FlyingObjectController.js";
  import Score from "./Score.js";
  import Shieldtimer from "./ShieldTimer.js";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const GAME_SPEED_START = 0.8; // 1.0
  const GAME_SPEED_INCREMENT = 0.00001;

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 200;
  const PLAYER_WIDTH = 88 / 1.5; //58
  const PLAYER_HEIGHT = 94 / 1.5; //62
  const MAX_JUMP_HEIGHT = GAME_HEIGHT;
  const MIN_JUMP_HEIGHT = 200;
  const GROUND_WIDTH = 2400;
  const GROUND_HEIGHT = 24;
  const GROUND_AND_CACTUS_SPEED = 0.5;
  const CACTI_CONFIG = [
    { width: 48 / 1.5, height: 100 / 1.5, image: "images/fastfood.png" , name : "fastfood" },
    { width: 98 / 1.5, height: 100 / 1.5, image: "images/bakery.jpg",name : 'bakery', },
    { width: 100 / 1.5, height: 100 / 1.5, image: "images/sweetsShop.jpg" , name : "sweetsShop"},
    { width: 68 / 1.5, height: 70 / 1.5, image: "images/Burger.png" ,name : ""},
    { width: 68 / 1.5, height: 70 / 1.5, image: "images/apple.jpg",name : "apple" },
  ];

  //Game Objects
  let player = null;
  let ground = null;
  let cactiController = null;
  let birdController = null;
  let score = null;
  let shield = null;

  let scaleRatio = null;
  let previousTime = null;
  let gameSpeed = GAME_SPEED_START;
  let gameOver = false;
  let hasAddedEventListenersForRestart = false;
  let waitingToStart = true;

  const birdSpriteSheet = new Image();
  birdSpriteSheet.src = 'images/fastfood.png'; // Update with your bird sprite sheet path
  const modal = document.getElementById("myModal");
  const tryAgainBtn = document.getElementById("TryAgainBtn");

  function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(
      ctx,
      playerWidthInGame,
      playerHeightInGame,
      minJumpHeightInGame,
      maxJumpHeightInGame,
      scaleRatio,

    );

    ground = new Ground(
      ctx,
      groundWidthInGame,
      groundHeightInGame,
      GROUND_AND_CACTUS_SPEED,
      scaleRatio
    );

    const cactiImages = CACTI_CONFIG.map((cactus) => {
      const image = new Image();
      image.src = cactus.image;
      return {
        image: image,
        width: cactus.width * scaleRatio,
        height: cactus.height * scaleRatio,
        name : cactus?.name
      };
    });

    cactiController = new CactiController(
      ctx,
      cactiImages,
      scaleRatio,
      GROUND_AND_CACTUS_SPEED,
      player
    );


    birdController = new BirdController(
      ctx,
      "images/fastfood.png",
      scaleRatio,
      GROUND_AND_CACTUS_SPEED,
      4, // Assuming 4 frames for bird flapping,
      cactiController
    );

    score = new Score(ctx, scaleRatio);
    shield = new Shieldtimer(ctx,scaleRatio,player)
  }

  function setScreen() {
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
  }

  setScreen();
  //Use setTimeout on Safari mobile rotation otherwise works fine on desktop
  window.addEventListener("resize", () => setTimeout(setScreen, 500));

  if (screen.orientation) {
    screen.orientation.addEventListener("change", setScreen);
  }

  function getScaleRatio() {
    const screenHeight = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
      window.innerWidth,
      document.documentElement.clientWidth
    );

    //window is wider than the game width
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
      return screenWidth / GAME_WIDTH;
    } else {
      return screenHeight / GAME_HEIGHT;
    }
  }

  function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER", x, y);
  }

  function setupGameReset() {
    if (!hasAddedEventListenersForRestart) {
      hasAddedEventListenersForRestart = true;

      setTimeout(() => {
        window.addEventListener("keyup", reset, { once: true });
        window.addEventListener("touchstart", reset, { once: true });
      }, 1000);
    }
  }

  function reset() {
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    ground.reset();
    cactiController.reset();
    birdController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
  }

  function showStartGameText() {
    const fontSize = 20 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4;
    const y = canvas.height / 2;
    ctx.fillText("Tap Screen or Press Space To Start", x, y);
  }

  function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
  }

  function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function gameLoop(currentTime) {
    if (previousTime === null) {
      previousTime = currentTime;
      requestAnimationFrame(gameLoop);
      return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;

    clearScreen();

    if (!gameOver && !waitingToStart) {
      //Update game objects
      ground.update(gameSpeed, frameTimeDelta);
      cactiController.update(gameSpeed, frameTimeDelta);
      birdController.update(gameSpeed, frameTimeDelta);
      player.update(gameSpeed, frameTimeDelta);
      score.update(frameTimeDelta);
      updateGameSpeed(frameTimeDelta);
    }

    if (!gameOver && (cactiController.collideWith(player) || birdController.collideWith(player))) {
      gameOver = true;
      setupGameReset();
      score.setHighScore();
      openModal()
    }

    //Draw game objects
    ground.draw();
    cactiController.draw();
    birdController.draw();
    player.draw();
    score.draw();
    if(player?.shield){
      shield.draw(30,30);
      shield.update(20)
    }

    if (gameOver) {
      showGameOver();
    }

    if (waitingToStart) {
      showStartGameText();
    }

    requestAnimationFrame(gameLoop);
  }

  tryAgainBtn.onclick = function() {
  closeModal();
    reset();
  }

  function closeModal() {
    modal.style.display = "none";
    document.removeEventListener("keydown", blockKeyboardEvents, true);
    document.removeEventListener("keypress", blockKeyboardEvents, true);
    document.removeEventListener("keyup", blockKeyboardEvents, true);
    window.addEventListener("keyup", reset, { once: true });
    window.addEventListener("touchstart", reset, { once: true });

    document.removeEventListener("touchstart", blockTouchEvents, true);
    document.removeEventListener("touchmove", blockTouchEvents, true);
    document.removeEventListener("touchend", blockTouchEvents, true);
  }

  function openModal() {
    modal.style.display = "block";
    document.addEventListener("keydown", blockKeyboardEvents, true);
    document.addEventListener("keypress", blockKeyboardEvents, true);
    document.addEventListener("keyup", blockKeyboardEvents, true);
    window.removeEventListener("keyup", reset, { once: true });
    window.removeEventListener("touchstart", reset, { once: true });

    document.addEventListener("touchstart", blockTouchEvents, true);
    document.addEventListener("touchmove", blockTouchEvents, true);
    document.addEventListener("touchend", blockTouchEvents, true);

  }

  function blockKeyboardEvents(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  function blockTouchEvents(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  requestAnimationFrame(gameLoop);

  window.addEventListener("keyup", reset, { once: true });
  window.addEventListener("touchstart", reset, { once: true });
