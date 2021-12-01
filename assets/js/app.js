const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');

canvas.width = 600
canvas.height = 500

// CONTANTS
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 40
const PLAYER_POSITION_X = (canvas.width / 2) - (PLAYER_WIDTH / 2)
const PLAYER_POSITION_y = canvas.height - 30 - PLAYER_HEIGHT
const PLAYER_SPEED = 3

const ENEMY_WIDTH = 16
const ENEMY_HEIGHT = 20
const ENEMY_START_X = 127
const ENEMY_START_Y = 140
const ENEMY_GAP_X = 30
const ENEMY_GAP_Y = 30

const EXPLOSION_SPEED = 100

// Game States
const enemies = []
const explosions = []
let greenAnimateState = 0
let explosionState = 0

// Load Sprites
const initialPlayerSprite = document.getElementById('initial-player-spaceship-sprite')
const openFirePlayerSprite = document.getElementById('open-fire-player-spaceship-sprite')
const bulletPlayerSprite = document.getElementById('bullet-player-spaceship-sprite')

const alienGreenSprites = []
const alienPurpleSprites = []
const alienRedSprites = []
const alienYellowSprites = []

for (let i = 0; i < document.getElementsByClassName('alien-green-sprite').length; i++) {
    alienGreenSprites.push(document.getElementsByClassName('alien-green-sprite')[i])
}
for (let i = 0; i < document.getElementsByClassName('alien-purple-sprite').length; i++) {
    alienPurpleSprites.push(document.getElementsByClassName('alien-purple-sprite')[i])
}
for (let i = 0; i < document.getElementsByClassName('alien-red-sprite').length; i++) {
    alienRedSprites.push(document.getElementsByClassName('alien-red-sprite')[i])
}
for (let i = 0; i < document.getElementsByClassName('alien-yellow-sprite').length; i++) {
    alienYellowSprites.push(document.getElementsByClassName('alien-yellow-sprite')[i])
}

const explosionSprites = []

for (let i = 0; i < document.getElementsByClassName('explosion').length; i++) {
    explosionSprites.push(document.getElementsByClassName('explosion')[i])
}
// Player Class 
class Player {
    constructor(name, x, y, width, height, speed) {
        this.name = name
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.dx = 0
        this.dy = 0
        this.speed = speed
        this.isFiring = false
        this.bullets = []
        this.firingSpeed = 0.5
        this.bulletSpeed = 10
    }
    draw() {
        ctx.drawImage(openFirePlayerSprite, this.x, this.y, this.width, this.height);
        if(!this.isFiring) {
            new Bullet(this.x + this.width / 2 - 1.8, this.y - 10, 3, 12, 10).draw()
        }
    }
    update() {
        this.draw()
        if(this.x >= canvas.width - this.width * 2){
            this.x = canvas.width - this.width * 2 
        }
        if(this.x >= this.width) {
            this.x += this.dx
        }else {
            this.x = this.width
        }
        this.bullets.forEach((bullet, i) => {
            if(bullet.y < 0 || bullet.y > canvas.height) {
                this.bullets.splice(i, 1)
            }
            bullet.update()
        })
    }
    moveLeft() {
        this.dx = -this.speed
    }
    moveRight() {
        this.dx = this.speed
    }
    fire() {
        if(this.isFiring) {

        }else {
            this.isFiring = true
            this.bullets.push(new Bullet(this.x + this.width / 2 - 1.8, this.y - 10, 3, 12, this.bulletSpeed))
            setTimeout(() => {
                this.isFiring = false
            }, this.firingSpeed * 1000);
        }
    }
    keyup() {
        this.dx = 0
    }
}
class Bullet {
    constructor(x, y, width, height, speed) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
    }
    draw() {
        ctx.drawImage(bulletPlayerSprite, this.x, this.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.y -= this.speed
    }
}

class Enemy {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
    draw() {
        
        ctx.drawImage(this.image[greenAnimateState], this.x, this.y, this.width, this.height)
    }
    update() {
        this.draw()
    }
}

class Explosion {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
    }
    draw() {
        ctx.drawImage(this.image[explosionState], this.x, this.y, this.width, this.height)
    }
}

// Initialize Player
const player = new Player('kenneth', PLAYER_POSITION_X, PLAYER_POSITION_y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SPEED)

// Initialize Enemies
// Alien Green
for (let i = 1; i < 31; i++) {
    let x = ENEMY_START_X + (ENEMY_GAP_X * i)
    let y = ENEMY_START_Y
    if (i > 20) {
        x = ENEMY_START_X + (ENEMY_GAP_X * i) - (ENEMY_GAP_X * 10) - (ENEMY_GAP_X * 10)
        y = ENEMY_START_Y + (ENEMY_GAP_Y * 2)
    }else if (i > 10) {
        x = ENEMY_START_X + (ENEMY_GAP_X * i) - (ENEMY_GAP_X * 10)
        y = ENEMY_START_Y + ENEMY_GAP_Y
    }
    enemies.push(new Enemy(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, alienGreenSprites))
}
// Alien Purple
for (let i = 1; i < 9; i++) {
    let x = ENEMY_START_X + 20 + (ENEMY_GAP_X * i)
    let y = ENEMY_START_Y - ENEMY_GAP_Y
    enemies.push(new Enemy(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, alienPurpleSprites))
}
// Alien Red
for (let i = 1; i < 7; i++) {
    let x = ENEMY_START_X + 50 + (ENEMY_GAP_X * i)
    let y = ENEMY_START_Y - (ENEMY_GAP_Y * 2)
    enemies.push(new Enemy(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, alienRedSprites))
}
// Alien Yellow
for (let i = 1; i < 3; i++) {
    let x = ENEMY_START_X + (80  * i) + (ENEMY_GAP_X * i)
    let y = ENEMY_START_Y - (ENEMY_GAP_Y * 3)
    if(i > 1) {
        x = ENEMY_START_X + (70  * i) + (ENEMY_GAP_X * i)
    }
    enemies.push(new Enemy(x, y, ENEMY_WIDTH, ENEMY_HEIGHT, alienYellowSprites))
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update()

    enemies.forEach((enemy, enemy_i) => {
        enemy.update()
        player.bullets.forEach((bullet, bullet_i) => {
            if(bullet.y < enemy.y + enemy.height && bullet.x > enemy.x && bullet.x < enemy.x + enemy.width ) {
                setTimeout(() => {
                    player.bullets.splice(bullet_i, 1)
                    enemies.splice(enemy_i, 1)
                }, 0);

                explosions.push(new Explosion(enemy.x - 5, enemy.y - 5, ENEMY_WIDTH + 10, ENEMY_HEIGHT + 10, explosionSprites))
                
                let iterations = 0;
                let interval = setInterval(foo, EXPLOSION_SPEED);

                function foo() {
                    iterations++;
                    if (iterations >= 5)
                        clearInterval(interval);

                    if(explosionState === 3) {
                        explosionState = 0
                    }else {
                        explosionState += 1
                    }
                }
            }
        })
    })
    explosions.forEach((explosion, explosion_i) => {
        explosion.draw()
        setTimeout(() => {
            explosions.splice(explosion_i, 1)
        }, EXPLOSION_SPEED * explosionSprites.length);
    })
    // drawLineX()
    // drawLineY()
    requestAnimationFrame(animate)
}

// Utility Functions
function drawLineX () {
    ctx.beginPath();
    ctx.strokeStyle = "#FFF";
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}
function drawLineY () {
    ctx.beginPath();
    ctx.strokeStyle = "#FFF";
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

// State Changin Functions
function keydown(e) {
    if(e.code === 'ArrowLeft') {
        player.moveLeft()
    }else if(e.code === 'ArrowRight'){
        player.moveRight()
    }else if(e.code === 'Space') {
        player.fire()
    }
}
function keyup(e) {
    if(e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.keyup()
    }
}

// Event Listeners
window.addEventListener('keydown', keydown)
window.addEventListener('keyup', keyup)

setInterval(() => {
    if(greenAnimateState === 3) {
        greenAnimateState = 0
    }else {
        greenAnimateState += 1
    }
}, 1000);

animate()