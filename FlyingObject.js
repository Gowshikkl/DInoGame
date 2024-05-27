export default class FlyingObject {
    constructor(ctx, x, y, width, height, image, flapFrames) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.image = image; // Assuming image is an HTMLImageElement
      this.flapFrames = flapFrames;
      this.currentFrame = 0;
      this.frameCount = 0;
      this.imageLoaded = false; // Initialize as not loaded
  
      // Load image
      this.loadImage(image);
    }
  
    loadImage(imageSrc) {
      this.image = new Image();
      this.image.onload = () => {
        this.imageLoaded = true;
      };
      this.image.onerror = (error) => {
        console.error('Error loading image:', error);
      };
      this.image.src = imageSrc;
    }
  
    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
      this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
  
      // Update the flap animation
      this.frameCount++;
      if (this.frameCount > 5) { // Adjust the number to control flap speed
        this.currentFrame = (this.currentFrame + 1) % this.flapFrames;
        this.frameCount = 0;
      }
    }
  
    draw() {
      if (this.imageLoaded) {
        const frameX = this.currentFrame * this.width;
        this.ctx.drawImage(
          this.image,
          frameX, 0, this.width, this.height, // Source image parameters
          this.x, this.y, this.width, this.height // Canvas parameters
        );
      }
    }
  
    collideWith(sprite) {
      const adjustBy = 1.4;
      if (
        sprite.x < this.x + this.width / adjustBy &&
        sprite.x + sprite.width / adjustBy > this.x &&
        sprite.y < this.y + this.height / adjustBy &&
        sprite.height + sprite.y / adjustBy > this.y
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
