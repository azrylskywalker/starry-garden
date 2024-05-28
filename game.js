import SplashScene from './splashScene.js'
import MenuScene from './menuScene.js'
import GameScene from './gameScene.js'


//game scene
const splashScene = new SplashScene()
const menuScene = new MenuScene()
const gameScene = new GameScene()

const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

const game = new Phaser.Game(config)

game.scene.add('splashScene', splashScene)
game.scene.add('menuScene', menuScene)
game.scene.add('gameScene', gameScene)

game.scene.start('splashScene')