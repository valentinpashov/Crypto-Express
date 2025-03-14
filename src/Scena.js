import { Sprite, Assets, Container } from 'pixi.js';

export class Scena {
    constructor(app) {
        this.app = app;
        this.speed = 6;

        this.DESIGN_WIDTH = 7616;
        this.DESIGN_HEIGHT = 1920;

        this.layers = [];
    }

    async init() {
        const backgroundTexture = await Assets.load('/Background.png');
        const midgroundTexture = await Assets.load('/Midground.png');
        const foregroundTexture = await Assets.load('/Foreground.png');

        this.layers.push(this.createEndlessLayer(backgroundTexture));
        this.layers.push(this.createEndlessLayer(midgroundTexture));
        this.layers.push(this.createEndlessLayer(foregroundTexture));

        this.layers.forEach(layer => this.app.stage.addChild(layer.container));

        this.app.ticker.add((time) => this.update(time));

        this.updateSize();
    }

    createEndlessLayer(texture) {
        const container = new Container();
        const sprite1 = new Sprite(texture);
        const sprite2 = new Sprite(texture);

        container.addChild(sprite1, sprite2);
        return { container, sprite1, sprite2 };
    }

    update(time) {
        const deltaX = time.deltaTime * this.speed;

        this.layers.forEach(layer => {
            layer.sprite1.x -= deltaX;
            layer.sprite2.x -= deltaX;

            if (layer.sprite1.x <= -layer.sprite1.width) {
                layer.sprite1.x = layer.sprite2.x + layer.sprite2.width;
            }
            if (layer.sprite2.x <= -layer.sprite2.width) {
                layer.sprite2.x = layer.sprite1.x + layer.sprite1.width;
            }
        });
    }

    updateSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.app.renderer.resize(width, height);

        const scaleFactor = width / this.DESIGN_WIDTH;

        this.layers.forEach(layer => {
            layer.sprite1.scale.set(scaleFactor);
            layer.sprite2.scale.set(scaleFactor);

            layer.sprite1.x = 0;
            layer.sprite2.x = layer.sprite1.width;
        });
    }
}
