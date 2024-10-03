export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = "Creepster";
        this.livesImage = document.getElementById("lives");
    }
    draw(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "red";
        context.shadowBlur = 0;
        context.font = this.fontSize + "px " + this.fontFamily;
        context.textAlign = "left";
        context.fillStyle = this.game.fontColor;
        // 分數
        context.font = this.fontSize * 1 + "px " + this.fontFamily;
        context.fillText("Score : " + this.game.score, 20, 50);
        // 計時
        context.font = this.fontSize * 1 + "px " + this.fontFamily;
        context.fillText("Time : " + (this.game.time * 0.001).toFixed(1), 20, 80);
        // 生命值
        context.font = this.fontSize * 1 + "px " + this.fontFamily;
        context.fillText("Lives : ", 20, 110);
        for (let i = 0; i < this.game.lives; i++) {
            context.drawImage(this.livesImage, 35 * i + 95, 90, 25, 25);
        }
        // 遊戲結束條件
        if (this.game.gameOver) {
            context.textAlign = "center";
            context.font = this.fontSize * 2 + "px " + this.fontFamily;
            if (this.game.score >= this.game.winningScore) {
                context.fillText("You Win!", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("Good Job!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText("You Lose!", this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
                context.fillText("Better luck next time!", this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
}