import { Dust, Fire, Splash } from "./particles.js";

const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ATTACK: 4,
    DIVING: 5,
    HIT: 6
}

class State {
    constructor(state,game){
        this.state = state;
        this.game = game;
    }
}

export class Idle extends State {
    constructor(game) {
        super("IDLE", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 3;
    }
    handleInput(input) {
        if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes(" ")) {
            this.game.player.setState(states.ATTACK, 0);
        } else if (input.includes("ArrowUp")){
            this.game.player.setState(states.JUMPING,0);
            this.game.player.setState(states.IDLE,0);
        }
    }
} 

export class Running extends State {
    constructor(game) {
        super("RUNNING", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 7;
        this.game.player.frameY = 4;
        if(!this.game.gameOver) this.game.player.sound_run.play();
    }
    handleInput(input) {
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.6, this.game.player.y + this.game.player.height));

        if (input.includes("ArrowDown")) {
            this.game.player.setState(states.IDLE, 0);
            this.game.player.sound_run.pause();
        } else if (input.includes("ArrowUp")) {
            this.game.player.setState(states.JUMPING, 1);
            this.game.player.sound_run.pause();
        } else if (input.includes(" ")) {
            this.game.player.setState(states.ATTACK, 1);
        }
    }
}

export class Jumping extends State {
    constructor(game) {
        super("JUMPING", game);
    }
    enter() {
        if (this.game.player.onGround()) {
            this.game.player.vy -= 27;
        }
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 3;
        this.game.player.frameY = 2;
        this.game.player.sound_jump.play();
    }
    handleInput(input) {
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes(" ")) {
            this.game.player.setState(states.ATTACK, 1);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super("FALLING", game);
    }
    enter() {
        this.game.player.frameX = 3;
        this.game.player.maxFrame = 5;
        this.game.player.frameY = 2;
    }
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.sound_landing.play();
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes("ArrowDown")) {
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Attack extends State {
    constructor(game) {
        super("ATTACK", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 2;
        this.game.player.frameY = 5;
        this.game.player.sword_length += 100;
        if(!this.game.enemies.markedForDeletion) this.game.player.sound_swipe.play();
    }
    handleInput(input, deltaTime) {
        if (!input.includes(" ") && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
            this.game.player.sword_length = 0;
        } else if (!input.includes(" ") && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
            this.game.player.sword_length = 0;
        } else if (input.includes(" ") && input.includes("ArrowUp") && this.game.player.onGround()) {
            this.game.player.vy -= 27;
            this.game.player.sword_length = 0;
        } else if (input.includes("ArrowDown") && !this.game.player.onGround()) {
            this.game.player.setState(states.DIVING, 0);
            this.game.player.sword_length = 0;
        }
    }
}

export class Diving extends State {
    constructor(game) {
        super("DIVING", game);
    }
    enter() {
        this.game.player.frameX = 4;
        this.game.player.maxFrame = 3;
        this.game.player.frameY = 2;
        this.game.player.vy = 15;
        this.game.player.splash_x = 150;
    }
    handleInput(input) {
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        this.game.player.setState(states.DIVING,3);

        if (this.game.player.onGround()) {
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height));
            }
            this.game.player.sound_explosion.play();
            this.game.player.splash_x = 0;
            this.game.player.setState(states.IDLE,0);
        } 
    }
}

export class Hit extends State {
    constructor(game) {
        super("HIT", game);
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
        this.game.player.sound_run.pause();
        this.game.player.sound_hit.play();
    }
    handleInput(input) {
        if (this.game.player.frameX >= 6 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1);
        } else if (this.game.player.frameX >= 6 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}