import { Player } from "./player.js";
import { Background } from "./background.js";
import { InputHandler } from "./input.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load",e => {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 500;

    class Game {
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 10;
            this.fontColor = "black";
            this.time = 50000;
            this.minTime = 0;
            this.gameOver = false;
            this.lives = 3;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time -= deltaTime;
            if (this.time < this.minTime || this.score >= this.winningScore) {
                this.gameOver = true;
            }
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // 出怪時間
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            // 遊玩過程訊息
            this.floatingMessages.forEach(message => {
                message.update();
            });
            // 粒子效果時間
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width,canvas.height);
    let deltaTime = 15;
    let start = false;
    const background_music = document.getElementById("bgm");
    background_music.volume = 0.1;

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(start) game.update(deltaTime);
        game.draw(ctx);
        if (!game.gameOver && start) {
            requestAnimationFrame(animate);
        }
        if(game.gameOver){
            background_music.pause();
        }
    }
    animate();
    
    // const canvas2 = document.getElementById("canvas2");
    // const ctx2 = canvas2.getContext("2d");
    // canvas2.width = 1000;
    // canvas2.height = 500;
    // let frameX = 0;
    // let frameY = 3;
    // let frameTimer1 = 0;
    // let frameInterval1 = 80;
    // let player = document.getElementById("player");
    // let x1 = 436;
    // let alpha = 0.1;
    // let sum = 0;

    // function begin() {
    //     ctx2.clearRect(0,0,canvas.width,canvas.height);
    //     ctx2.globalAlpha = 1;
    //     ctx2.drawImage(document.getElementById("layer1"),0,0,1667,500);
    //     ctx2.drawImage(document.getElementById("layer2"),0,0,1667,500);
    //     ctx2.drawImage(document.getElementById("layer3"),0,0,1667,500);
    //     ctx2.drawImage(document.getElementById("layer4"),0,0,1667,500);
    //     ctx2.drawImage(document.getElementById("layer5"),0,0,1667,500);
    //     ctx2.globalAlpha = 0.3;
    //     ctx2.fillStyle = "white";
    //     ctx2.fillRect(0,0,canvas.width,canvas.height);
    //     ctx2.globalAlpha = 1;
    //     ctx2.drawImage(player,frameX * 128,frameY *128,128,128,x1,292,128,128);
    //     if(frameTimer1 > frameInterval1){
    //         frameTimer1 = 0;
    //         if(frameX < 4){
    //             frameX++;
    //         }else{
    //             frameX = 0;
    //         }
    //     }else{
    //         frameTimer1+=deltaTime;
    //     }
    //     if(start){
    //         setInterval(function(){
    //             ctx2.fillStyle = "white";
    //             ctx2.fillRect(0,0,1000,500);
    //             ctx2.globalAlpha = 0;
    //             if(ctx2.globalAlpha <= 1){
    //                 sum += alpha;
    //                 ctx2.globalAlpha = sum;
    //                 console.log();
    //             }
    //         },100);
    //     }
    //     requestAnimationFrame(begin);
    // }
    // begin();

    document.addEventListener("keypress",e=>{
        if(e.key==="Enter" && !start){
            start = true;
            animate();
            background_music.play();
        }
    })
    document.addEventListener("keypress" , e => {
        if(e.key === "p"){
            start = false;
            background_music.pause();
        }
    });
    document.addEventListener("keypress",e => {
        if(e.key === "r"){
            window.location.reload();
            background_music.pause();
        }
    })
});

