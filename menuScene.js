class MenuScene extends Phaser.Scene{
    constructor(){
        super({key:'menuScene'})

        this.menuSceneBackgroundImage = null
        this.menuSceneText = null
        this.menuSceneTextStyle = {
            font: '120px Times', 
            fill: '#fde4b9', 
            align: 'center'
        }
        
        this.startButton = null
    }

    init(data) {
        this.cameras.main.setBackgroundColor('#ffffff')
    }

    preload(){
        console.log('Menu Scene')
        this.load.image('menuSceneBackground', 'assets/titleSceneBackground.png')
        this.load.image('startButton', 'assets/start.png')
    }

    create (data){
        this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'menuSceneBackground')
        this.menuSceneBackgroundImage.x = 1920/2
        this.menuSceneBackgroundImage.y = 1080/2

        this.menuSceneText = this.add.text(1920/3, 1080 / 7, 'Starry Garden', this.menuSceneTextStyle)

        this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 200, 'startButton')
        this.startButton.setInteractive({useHandCursor: true})
        this.startButton.on('pointerdown', () => this.clickButton())

    }

    update(time, delta){    

    }

    clickButton(){
        this.scene.start('gameScene')
    }
}

export default MenuScene