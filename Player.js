export default class Player {
  WALK_ANIMATION_TIMER = 150;
  walkAnimationTimer = this.WALK_ANIMATION_TIMER;
  dinoRunImages = [];
  shieldedDinoRunImages = [];

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;
    this.shield = false;
    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/run2.png";
    this.image = this.standingStillImage;

    const dinoRunImage1 = new Image();
    dinoRunImage1.src = "images/run1.png";

    const dinoRunImage2 = new Image();
    dinoRunImage2.src = "images/run3.png";

    const dinoRunImage3 = new Image();
    dinoRunImage3.src = "images/run2.png";

  

    const shieldDinoRunImage1 = new Image();
    shieldDinoRunImage1.src = "images/shield_run_1.png";

    const shieldDinoRunImage2 = new Image();
    shieldDinoRunImage2.src = "images/shield_run_2.png";

    
    const shieldDinoRunImage3 = new Image();
    shieldDinoRunImage3.src = "images/shield_run_3.png";

    this.dinoRunImages.push(dinoRunImage1);
    this.dinoRunImages.push(dinoRunImage2);
    this.dinoRunImages.push(dinoRunImage3);
    // this.dinoRunImages.push(dinoRunImage4);


    this.shieldedDinoRunImages.push(shieldDinoRunImage1);
    this.shieldedDinoRunImages.push(shieldDinoRunImage2);
    this.shieldedDinoRunImages.push(shieldDinoRunImage3);

    //keyboard
    window.removeEventListener("keydown", this.keydown);
    window.removeEventListener("keyup", this.keyup);

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);

    //touch
    window.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("touchend", this.touchend);

    window.addEventListener("touchstart", this.touchstart);
    window.addEventListener("touchend", this.touchend);
  }

  touchstart = () => {
    this.jumpPressed = true;
  };

  touchend = () => {
    this.jumpPressed = false;
  };

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      if(!this.shield){
        this.image = this.standingStillImage;
      }else{
        this.image = this.shieldedDinoRunImages[0];
      }
    }
 


    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    if (this.walkAnimationTimer <= 0) {
      if (!this.shield) {
        // Use regular dino run images
        if (this.image === this.dinoRunImages[0]) {
          this.image = this.dinoRunImages[1];
        } else {
          this.image = this.dinoRunImages[0];
        }
      } else {
        // Use shielded dino run images
        if (this.image === this.shieldedDinoRunImages[0]) {
          this.image = this.shieldedDinoRunImages[1];
        } else {
          this.image = this.shieldedDinoRunImages[0];
        }
      }
      this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    }
    this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  draw() {
    if (this.shield) {
      console.log("shieyeldd")
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  activateShield() {
    console.log('shield activated')
    this.shield = true;
  }
  deactivateShield() {
    this.shield = false;
  }
}
