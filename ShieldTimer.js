export default class ShieldTimer {
    constructor(ctx, scaleRatio,player) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.player = player
        this.reset(); // Initialize score in the constructor
    }

    update(frameTimeDelta) {
        // Decrease the score over time
        this.score -= frameTimeDelta / 1000; // Assuming frameTimeDelta is in milliseconds
        if (this.score < 0) {
            this.player.deactivateShield();
            this.score = 0; // Ensure the score doesn't go below 0
            this.reset();
        }
    }

    reset() {
        this.score = 5; // Reset the score to 5
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    draw(x, y) {
        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = "#525250";
        this.ctx.fillText(`Shield Timer: ${Math.ceil(this.score)}`, x, y);
    }
}
