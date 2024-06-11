import Player from "./Player.js";
import Ground from "./Ground.js";
import CactiController from "./CactiController.js";
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
  { width: 48 / 1.5, height: 72 / 1.5, image: "images/single_sugar_cube.png", name: "single_sugar_cube" },
  { width: 48 / 1.5, height: 63 / 1.5, image: "images/pills_bottle.png", name: 'pills_bottle', },
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/injection.png", name: "injection" },
  { width: 95 / 1.5, height: 99 / 1.5, image: "images/injection_and_pills_bottle.png", name: "injection_and_pills_bottle" },
  { width: 98 / 1.5, height: 74 / 1.5, image: "images/double_sugar_cube.png", name: "double_sugar_cube" },
  { width: 64 / 1.5, height: 98 / 1.5, image: "images/double_sugar_cube_stack.png", name: "double_sugar_cube_stack" },
  { width: 48 / 1.5, height: 47 / 1.5, image: "images/apple.png", name: "apple" },
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
let email =  "";

email = localStorage.getItem("email")

birdSpriteSheet.src = 'images/fastfood.png'; // Update with your bird sprite sheet path
const modal = document.getElementById("myModal");
const tryAgainBtn = document.getElementById("TryAgainBtn");
const emailInput = document.getElementById("mobileOrEmailInput");
const emailTxt = document.getElementById("emailTxt");


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
      name: cactus?.name
    };
  });

  cactiController = new CactiController(
    ctx,
    cactiImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED,
    player
  );


  score = new Score(ctx, scaleRatio);
  shield = new Shieldtimer(ctx, scaleRatio, player)
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

    // setTimeout(() => {
    //   window.addEventListener("keyup", reset, { once: true });
    //   window.addEventListener("touchstart", reset, { once: true });
    // }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactiController.reset();
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
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && (cactiController.collideWith(player))) {

    gameOver = true;
    setupGameReset();
    score.setHighScore();
    openModal()
  }

  //Draw game objects
  ground.draw();
  cactiController.draw();
  player.draw();
  score.draw();
  if (player?.shield) {
    shield.draw(30, 30);
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


// console.log("encc",$API_BASE_URL)


tryAgainBtn.onclick = function () {
  console.log("score", Math.round( score.score))

  if(email == null){
    if (validateEmail(emailInput.value)) {
      addUserServices()
    }else{
      alert("Please enter a valid email")
    }
  }else{
    updateScoreServices();
  }

}

function addUserServices (){
  axios.post("https://api.type1and2.com/" + "api/user", {
    "email": emailInput?.value,
    "highScore": Math.round(score?.score)
  }).then((response) => {
    if(response?.data?.status == 200){
      console.log("ress",response?.data)
      localStorage.setItem("email",emailInput?.value);
      closeModal();
      reset();
    }else{
      console.log('errr',response?.data)
      closeModal();
      reset();
    }
  }).catch((error)=>{
    console.log("error",error);
    closeModal();
    reset();
  })

}

function updateScoreServices  () {
  axios.post("https://api.type1and2.com/" + "api/user/score", {
    "email": email,
    "highScore": Math.round(score?.score)
  }).then((response) => {
    if(response?.data?.status == 200){
      console.log("ress",response?.data)
      closeModal();
      reset();
    }else{
      console.log('errr',response?.data)
      closeModal();
      reset();
    }
  }).catch((error)=>{
    console.log("error",error);
    closeModal();
    reset();
  })

}

function closeModal() {
  modal.style.display = "none";

}

function openModal() {
  email = localStorage.getItem("email")
  if(email != null){
    emailTxt.style.display = 'none'
    emailInput.style.display ='none';
  }
  modal.style.display = "block";
  

}


function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
