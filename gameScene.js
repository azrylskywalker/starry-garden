class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene' });

        this.ship = null;
        this.fireLaser = false;
        this.firstLaser = true;
        this.score = 0;
        this.scoreText = null;
        this.scoreTextStyle = { font: '35px Arial', fill: '#ffffff', align: 'center' };
        this.gameOverText = null;
        this.gameOverTextStyle = { font: '35px Arial', fill: '#ff0000', align: 'center' };
        this.laserSpeed = 1000; // Adjust the laser speed as needed
        this.laserVelocityX
        this.laserVelocityY
    }

    spawnEnemy() {
        const enemyXLocation = Math.floor(Math.random() * 1920) + 1;
        let enemyXVelocity = Math.floor(Math.random() * 50) + 1;
        enemyXVelocity *= Math.round(Math.random()) ? 1 : -1;

        const playerPosition = new Phaser.Math.Vector2(this.ship.x, this.ship.y);
        const enemyPosition = new Phaser.Math.Vector2(enemyXLocation, -100);
        const direction = playerPosition.clone().subtract(enemyPosition).normalize();

        const enemySpeed = 200; // Adjust enemy speed as needed
        const enemyVelocity = direction.scale(enemySpeed);

        const anEnemy = this.physics.add.sprite(enemyXLocation, -100, 'enemy');
        if (anEnemy.body) {
            anEnemy.body.velocity.set(enemyVelocity.x, enemyVelocity.y);
        }
        this.enemyGroup.add(anEnemy);
    }

    init(data) {
        this.cameras.main.setBackgroundColor('#ffffff');
    }

    preload() {
        console.log('Game Scene');
        this.load.image('gameBackground', 'assets/gameBg.png');
        this.load.image('ship', 'assets/redShip.png');
        this.load.image('laser', 'assets/laser01.png');
        this.load.image('enemy', 'assets/ufo.png');
        this.load.audio('laserSound01', 'assets/sfx_laser1.ogg');
        this.load.audio('laserSound02', 'assets/sfx_laser2.ogg');
        this.load.audio('hitSound', 'assets/sfx_zap.ogg');
        this.load.audio('loseAudio', 'assets/sfx_lose.ogg');
    }

    create(data) {
        this.background = this.add.image(0, 0, 'gameBackground').setScale(1).setOrigin(0, 0);
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle);
        this.ship = this.physics.add.sprite(1920 / 2, 1080 / 2, 'ship');
        this.ship.setCollideWorldBounds(true);
        this.ship.velocity = new Phaser.Math.Vector2(0, 0);

        this.laserGroup = this.physics.add.group();
        this.enemyGroup = this.add.group();

        this.spawnEnemy();

        this.physics.add.collider(this.laserGroup, this.enemyGroup, (laserCollide, enemyCollide) => {
            this.sound.play('hitSound');
            enemyCollide.destroy();
            laserCollide.destroy();
            this.score += 1;
            this.scoreText.setText('Score: ' + this.score.toString());
            this.spawnEnemy();
            this.spawnEnemy();
        });

        this.physics.add.collider(this.ship, this.enemyGroup, (shipCollide, enemyCollide) => {
            this.sound.play('loseAudio');
            this.physics.pause();
            enemyCollide.destroy();
            if (this.ship) {
                shipCollide.destroy();
            }
            this.gameOverText = this.add.text(this.ship.x - 80, this.ship.y + 300, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0, 5);
            this.gameOverText.setInteractive();
            this.gameOverText.on('pointerdown', () => {
                this.scene.restart();
                this.score = 0;
                this.scoreText.setText('Score: ' + this.score.toString());
            });
        });
    }

    spawnLaser() {
        const laserSpeed = this.laserSpeed;

        const laserVelocityX = Math.cos(this.ship.rotation - Math.PI / 2) * laserSpeed;
        const laserVelocityY = Math.sin(this.ship.rotation - Math.PI / 2) * laserSpeed;

        const aNewLaser = this.physics.add.sprite(this.ship.x, this.ship.y, 'laser');
        aNewLaser.setRotation(this.ship.rotation);
        aNewLaser.setVelocity(laserVelocityX, laserVelocityY);

        this.laserGroup.add(aNewLaser);
    }

    update(time, delta) {
        const keyForwardObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const keyLeftObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const keyRightObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const keyBackwardObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        const keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        const acceleration = 0.5;
        if (keyForwardObj.isDown) {
            const angle = Phaser.Math.DegToRad(this.ship.angle - 90);
            const accelerationVector = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).scale(acceleration);
            this.ship.velocity.add(accelerationVector);
        }

        const dragFactor = 0.99;
        this.ship.velocity.scale(dragFactor);

        this.ship.x += this.ship.velocity.x;
        this.ship.y += this.ship.velocity.y;

        const maxVelocity = 3;
        this.ship.velocity.x = Phaser.Math.Clamp(this.ship.velocity.x, -maxVelocity, maxVelocity);
        this.ship.velocity.y = Phaser.Math.Clamp(this.ship.velocity.y, -maxVelocity, maxVelocity);

        if (keyLeftObj.isDown) {
            this.ship.angle -= 1;
        }

        if (keyRightObj.isDown) {
            this.ship.angle += 1;
        }

        if (keyBackwardObj.isDown) {
            const deceleration = 0.05;
            const velocityDirection = this.ship.velocity.clone().normalize();
            const decelerationMagnitude = this.ship.velocity.length() * deceleration;
            this.ship.velocity.subtract(velocityDirection.scale(decelerationMagnitude));
        }

        if (keySpaceObj.isDown && !this.fireLaser) {
            this.fireLaser = true;
            this.spawnLaser();

            if (this.firstLaser) {
                this.firstLaser = false;
                this.sound.play('laserSound01');
            } else {
                this.firstLaser = true;
                this.sound.play('laserSound02');
            }
        }

        if (keySpaceObj.isUp) {
            this.fireLaser = false;
        }

        // Check laser movement and destroy if out of bounds
        this.laserGroup.getChildren().forEach(item => {
            item.y -= 10
            if (item.y < 0 || item.y > this.game.config.height || item.x < 0 || item.x > this.game.config.width) {
                item.destroy();
            }
        });

        // Update enemy movement towards the player
        this.enemyGroup.getChildren().forEach(enemy => {
            if (enemy.body && enemy.body.velocity) {
                const playerPosition = new Phaser.Math.Vector2(this.ship.x, this.ship.y);
                const enemyPosition = new Phaser.Math.Vector2(enemy.x, enemy.y);
                const direction = playerPosition.clone().subtract(enemyPosition).normalize();
                const enemySpeed = 200;
                const enemyVelocity = direction.scale(enemySpeed);
                enemy.body.velocity.set(enemyVelocity.x, enemyVelocity.y);
            }
        });
    }
}

export default GameScene;
