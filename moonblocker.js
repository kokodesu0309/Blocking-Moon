let earthRadius = 50;
let moonRadius = 20;
let earthX, earthY;
let moonDistance = 135;
let moonAngle = 0;
let moonX, moonY;
let score = 0;
let comboCount = 0;
let comboTimer = 0;
let comboThreshold = 3;
let powerUps = [];
let gameOverPromptVisible = false;

let balls = [];
let stars = [];


let ballsHit = 0;
let totalPoints = 0;
let gameStarted = false;
let gameEnded = false;



function setup() {
  createCanvas(windowWidth, windowHeight);
  createStars();
  earthX = width / 2;
  earthY = height / 2;
}

function draw() {
  background(0);
  drawStars();
  
  if (comboCount >= comboThreshold) {
    activatePowerUp();
  }
  
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    powerUp.update();
    powerUp.display();

    // Check if the Moon collects the power-up
    if (dist(moonX, moonY, powerUp.x, powerUp.y) < moonRadius + powerUp.size / 2) {
      powerUps.splice(i, 1);
      applyPowerUpEffect(powerUp.type);
    }
  }
  
  moonX = earthX + cos(moonAngle) * moonDistance;
  moonY = earthY + sin(moonAngle) * moonDistance;

  drawEarth();
  drawMoon();

 fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  if (gameStarted && !gameEnded) {
    if (balls.length > 0) {
      for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        ball.update();
        ball.display();

        if (ball.hits(earthX, earthY, earthRadius)) {
          gameOver();
        }

        if (ball.hits(moonX, moonY, moonRadius)) {
          balls.splice(i, 1);
          ballsHit++;
          totalPoints++;
		  score++;
        }
      }
    }

    if (random(1) < 0.05 && balls.length < 6) {
  balls.push(new Ball());
}
  }

  if (gameEnded) {
    background(255, 0, 0);
    textSize(30);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Game Over!", width / 2, height / 2);
    textSize(20);
    text("Total Score: " + totalPoints, width / 2, height / 2 + 40);
if (!gameOverPromptVisible) {
      // Show restart and main page options
      textSize(15);
      text("Click anywhere to restart", width / 2, height / 2 + 80);
      gameOverPromptVisible = true;
    
	} else {
    // Hide the prompt if the game is not over
    gameOverPromptVisible = false;
  }
  }

  fill(255);
  textAlign(CENTER, CENTER);
  if (!gameStarted) {
    textSize(20);
    text("Click anywhere to start", width / 2, height - 40);
  } else if (gameStarted && !gameEnded) {
    textSize(15);
    text("Move the mouse to control the Moon and block the balls", width / 2, height - 30);
  }
}

function createStars() {
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    stars.push({ x, y });
  }
}

function keyPressed() {
  if (gameEnded && key === 'm' || key === 'M') {
    goToMainPage();
  }
}

function mousePressed() {
  if (gameEnded) {
    restartGame();
  }
}

function drawStars() {
  fill(255);
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let { x, y } = stars[i];
    ellipse(x, y, 2, 2);
  }
}

function mouseMoved() {
  let dx = mouseX - earthX;
  let dy = mouseY - earthY;
  moonAngle = atan2(dy, dx);
}

function mouseClicked() {
  if (!gameStarted || gameEnded) {
    restartGame();
  }
}

function restartGame() {
  ballsHit = 0;
  totalPoints = 0;
  score = 0;
  balls = [];
  gameStarted = true;
  gameEnded = false;
  loop();
}

function gameOver() {
  gameEnded = true;
  noLoop();
}

// Create Audio object for the collision sound effect
const collisionSound = new Audio('collision_sound.mp3');

// Function to play the collision sound effect
function playCollisionSound() {
  collisionSound.currentTime = 0; // Reset the sound to the beginning
  collisionSound.play();
}

// Example collision detection and handling logic
function handleCollision(moon, ball) {
  // Perform collision detection and logic
  if (isColliding(moon, ball)) {
    // Handle collision between the Moon and a ball

    // Play the collision sound effect
    playCollisionSound();
  }
}

// Create Audio object for the power-up sound effect
const powerUpSound = new Audio('powerup_sound.mp3');

// Function to play the power-up sound effect
function playPowerUpSound() {
  powerUpSound.currentTime = 0; // Reset the sound to the beginning
  powerUpSound.play();
}

// Example power-up collection event handler
function handlePowerUpCollection() {
  // Perform power-up collection logic

  // Play the power-up sound effect when the Moon collects a power-up
  playPowerUpSound();

  // Perform other actions related to the power-up collection
  // ...
}

function applyPowerUpEffect(type) {
  // Apply different effects based on the power-up type
  if (type === "speed") {
    // Increase the speed of the Moon temporarily
    moonSpeed += 2; // Increase the Moon's speed by 2 (adjust the value as needed)
    setTimeout(resetMoonSpeed, 5000); // Reset the Moon's speed after 5 seconds (adjust the time as needed)
  } else if (type === "size") {
    // Increase the size of the Moon temporarily
    moonRadius *= 2; // Increase the Moon's size by 1.5 times (adjust the value as needed)
    setTimeout(resetMoonSize, 5000); // Reset the Moon's size after 5 seconds (adjust the time as needed)
  }
}

function resetMoonSpeed() {
  // Reset the Moon's speed to the default value
  moonSpeed = 3; // Adjust the default speed value based on your game
}

function resetMoonSize() {
  // Reset the Moon's size to the default value
  moonRadius = 30; // Adjust the default radius value based on your game
}

function activatePowerUp() {
  // Randomly generate a power-up
  let powerUpType = random(["speed", "size"]);

  // Randomly position the power-up near the Earth
  let powerUpX = random(earthX - earthRadius, earthX + earthRadius);
  let powerUpY = random(earthY - earthRadius, earthY + earthRadius);

  // Create a new power-up object
  let powerUp = new PowerUp(powerUpX, powerUpY, powerUpType);
  powerUps.push(powerUp);

  // Reset combo count and timer
  comboCount = 0;
  comboTimer = 0;
}

function increaseCombo() {
  comboCount++;

  // Reset combo timer
  comboTimer = 0;
}

function updateComboTimer() {
  comboTimer++;

  // Reset combo count if the timer exceeds a certain value
  if (comboTimer >= 60) {
    comboCount = 0;
  }
}

function drawEarth() {
  // Blue gradient for atmosphere
  noStroke();
  fill(0, 0, 255, 100);
  ellipse(earthX, earthY, earthRadius * 2.2, earthRadius * 2.2);

  // Earth body (main landmass)
  fill(0, 0, 255);
  ellipse(earthX, earthY, earthRadius * 2, earthRadius * 2);

  // Earth shadow
  fill(0, 50);
  ellipse(earthX + 5, earthY + 5, earthRadius * 2, earthRadius * 2);

  // Add continents (more detailed landmasses)
  fill(50, 200, 50); // Green color for land
  drawContinent(earthX - 25, earthY - 5, earthRadius * 1.2); // Continent 1


  // Unique landmass at the bottom
  fill(50, 200, 50); // Orange color for the new land
  drawContinent(earthX, earthY + 35, earthRadius * 0.8); // Bottom landmass
}

function drawContinent(x, y, size) {
  // Customize your continent shape here
  beginShape();
  vertex(x, y - size * 0.5);
  bezierVertex(x + size * 0.3, y - size * 0.8, x + size * 0.7, y - size * 0.8, x + size, y - size * 0.5);
  bezierVertex(x + size, y + size * 0.2, x, y + size * 0.5, x, y);
  endShape(CLOSE);
}

function drawContinent(x, y, size) {
  // Customize your continent shape here
  beginShape();
  vertex(x, y - size * 0.5);
  bezierVertex(x + size * 0.3, y - size * 0.8, x + size * 0.7, y - size * 0.8, x + size, y - size * 0.5);
  bezierVertex(x + size, y + size * 0.2, x, y + size * 0.5, x, y);
  endShape(CLOSE);
}

function drawMoon() {
  // Moon body (gray color)
  fill(150);
  ellipse(moonX, moonY, moonRadius * 2, moonRadius * 2);
 

}

class Ball {
  constructor() {
    if (random(1) < 0.5) {
      this.x = random(width);
      this.y = random(2) < 0.5 ? 0 : height;
    } else {
      this.x = random(2) < 0.5 ? 0 : width;
      this.y = random(height);
    }

    this.size = random(10, 30);
    this.speedX = 0;
    this.speedY = 0;
    this.targetX = width / 2;
    this.targetY = height / 2;
    this.maxSpeed = random(1, 5);
    this.angle = atan2(this.targetY - this.y, this.targetX - this.x);
    this.speedX = cos(this.angle) * this.maxSpeed;
    this.speedY = sin(this.angle) * this.maxSpeed;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      balls.splice(balls.indexOf(this), 1);
    }
  }

  display() {
    // Add visual details to the meteorite
    noStroke();
    fill(255, 0, 0); // Set fill color to red
    ellipse(this.x, this.y, this.size, this.size);

    // Add a smaller inner circle for texture
    fill(200, 0, 0); // Slightly darker red
    ellipse(this.x, this.y, this.size * 0.8, this.size * 0.8);
  }

  hits(x, y, radius) {
    let d = dist(this.x, this.y, x, y);
    return d < this.size / 2 + radius;
	if (d < this.size / 2 + radius) {
      increaseCombo();
      return true;
    }

    return false;
  }
}
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 20;
  }

  update() {
    // Update power-up properties if needed
  }

  display() {
    // Display power-up on the screen
  }
}