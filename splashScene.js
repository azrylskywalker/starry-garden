class SplashScene extends Phaser.Scene{
    constructor(){
        super({key:'splashScene'})
    }

    init(data) {
        this.cameras.main.setBackgroundColor('#ffffff')
    }

    preload(){
        console.log('Splash Scene')
        this.load.image('splashSceneBackground', './assets/splashSceneBackground.png')
    }

    create (data){
        this.splashSceneBackgroundImage = this.add.sprite(0, 0, 'splashSceneBackground').setScale(0.15)
        this.splashSceneBackgroundImage.x = 1920/2
        this.splashSceneBackgroundImage.y = 1080/2
    }

    update(time, delta){
        if(time > 3000){
            this.scene.switch('menuScene')
        }
    }
}

export default SplashScene