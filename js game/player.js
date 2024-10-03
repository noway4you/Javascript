import { Idle ,Running, Jumping, Falling, Attack, Diving, Hit } from "./player_state.js";
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessage.js';

export class Player {
    constructor(game){
        this.game = game;
        this.combo = 0;
        this.width = 128;
        this.height = 128;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.sword_length = 0;
        this.splash_x = 0;
        this.vy = 0;
        this.weight = 1.5;
        this.image = document.getElementById("player");
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 10;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3;
        this.states = [new Idle(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Attack(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        this.sound_slash = document.getElementById("slash");
        this.sound_slash.volume = 0.2;
        this.sound_swipe = document.getElementById("swipe");
        this.sound_swipe.volume = 0.2;
        this.sound_run = document.getElementById("run");
        this.sound_run.volume = 0.1;
        this.sound_jump = document.getElementById("jump");
        this.sound_landing = document.getElementById("landing");
        this.sound_explosion = document.getElementById("explosion");
        this.sound_explosion.volume = 0.5;
        this.sound_hit = document.getElementById("hit");
        this.sound_hit.volume = 0.3;
    }
    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        // 水平移動
        this.x += this.speed;
        if (input.includes("ArrowRight") && this.currentState != this.states[6]) {
            this.speed = this.maxSpeed;
        } else if (input.includes("ArrowLeft") && this.currentState != this.states[6]) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }
        // 水平方向邊界
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > this.game.width/2 - this.width) {
            this.x = this.game.width/2 - this.width;
        }
        // 垂直移動
        this.y += this.vy;

        if (!this.onGround()) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }
        // 垂直方向邊界
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }
        // 動畫
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }
    }
    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x +40, this.y +60, this.width -80, this.height -60);
        }
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width - 80 + this.sword_length + this.splash_x&&
                enemy.x + enemy.width > this.x + 40 - this.splash_x&&
                enemy.y < this.y + this.height - 60 &&
                enemy.y + enemy.height > this.y + 60
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    if(this.currentState === this.states[4]) this.sound_slash.play();
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 140, 45));
                    this.combo++;
                    if(this.combo == 10){
                        if(this.game.lives < 5){
                            this.game.lives++;
                        }
                        this.combo = 0;
                        this.game.time += 5000;
                        this.game.floatingMessages.push(new FloatingMessage("+5s", 150, 82, 150, 82));
                    }
                } else {
                    this.setState(6, 0);
                    if(this.game.score < 5){
                        this.game.score = 0;
                    }else{
                        this.game.score -= 5;
                    }
                    this.game.lives--;
                    if (this.game.lives <= 0) {
                        this.game.gameOver = true;
                    }
                    this.combo = 0;
                }
            }
        })
    }
}