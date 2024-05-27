import FlyingObject from "./FlyingObject.js";

export default class BirdController {
  BIRD_INTERVAL_MIN = 1000;
  BIRD_INTERVAL_MAX = 3000;

  nextBirdInterval = null;
  birds = [];

  constructor(ctx, birdImage, scaleRatio, speed, flapFrames,cactiController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.birdImage = birdImage; // Assuming birdImage is an HTMLImageElement
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.flapFrames = flapFrames;
    this.cactiController = cactiController; 


    this.setNextBirdTime();
  }

  setNextBirdTime() {
    const num = this.getRandomNumber(this.BIRD_INTERVAL_MIN, this.BIRD_INTERVAL_MAX);
    this.nextBirdInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createBird() {
    if (this.cactiController.cacti.length === 0) {
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(this.canvas.height * 0.1, this.canvas.height * 0.5); // Place bird in the air
        const bird = new FlyingObject(this.ctx, x, y, 34 * this.scaleRatio, 24 * this.scaleRatio, this.birdImage, this.flapFrames);
    
        this.birds.push(bird);
      }
      return
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(this.canvas.height * 0.1, this.canvas.height * 0.5); // Place bird in the air
    const bird = new FlyingObject(this.ctx, x, y, 34 * this.scaleRatio, 24 * this.scaleRatio, this.birdImage, this.flapFrames);

    this.birds.push(bird);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextBirdInterval <= 0) {
      this.createBird();
      this.setNextBirdTime();
    }
    this.nextBirdInterval -= frameTimeDelta;

    this.birds.forEach((bird) => {
      bird.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.birds = this.birds.filter((bird) => bird.x > -bird.width);
  }

  draw() {
    this.birds.forEach((bird) => bird.draw());
  }

  collideWith(sprite) {
    return this.birds.some((bird) => bird.collideWith(sprite));
  }

  reset() {
    this.birds = [];
  }
}
