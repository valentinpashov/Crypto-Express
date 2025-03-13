//! First Variant - fixed
/*
import { Application, Sprite, Assets } from 'pixi.js';

const app = new Application();

(async () => {
    await app.init({ background: 'white', resizeTo: window });
    document.body.appendChild(app.canvas);

    const backgroundTexture = await Assets.load('/Background.png');
    const midgroundTexture = await Assets.load('/Midground.png');
    const foregroundTexture = await Assets.load('/Foreground.png');

    const background = new Sprite(backgroundTexture);
    const midground = new Sprite(midgroundTexture);
    const foreground = new Sprite(foregroundTexture);

    app.stage.addChild(background);
    app.stage.addChild(midground);
    app.stage.addChild(foreground);

    window.addEventListener('resize');
})();
*/

//! Second Variant
/*
import { Application, Sprite, Assets, Container } from 'pixi.js';

(async () => {
    const app = new Application();
    await app.init({ background: 'white', resizeTo: window });

    document.body.appendChild(app.canvas);

    const speed = 2;

    const backgroundTextures = await Promise.all([
        Assets.load('/BG-1.png'),
        Assets.load('/BG-2.png'),
        Assets.load('/BG-3.png'),
        Assets.load('/BG-4.png'),
        Assets.load('/BG-5.png'),
        Assets.load('/BG-6.png'),
        Assets.load('/BG-7-rep.png')
    ]);

    const midgroundTextures = await Promise.all([
        Assets.load('/MID-1.png'),
        Assets.load('/MID-2.png'),
        Assets.load('/MID-3.png'),
        Assets.load('/MID-4.png'),
    ]);

    const foregroundTextures = await Promise.all([
        Assets.load('/FOR-1.png'),
        Assets.load('/FOR-2.png'),
        Assets.load('/FOR-3.png'),
        Assets.load('/FOR-4.png'),
    ]);

    const scene = new Container();
    app.stage.addChild(scene);

    function maxWidth(textures) {
        return Math.max(...textures.map(texture => texture.width));
    }

    const maxTextureWidth = Math.max(
        maxWidth(backgroundTextures),
        maxWidth(midgroundTextures),
        maxWidth(foregroundTextures)
    );

    const count = Math.ceil(app.renderer.width / maxTextureWidth) + 1;

    function createEndlessLayer(textures) {
        const sprites = [];
        let totalWidth = 0;

        for (let i = 0; i < count; i++) {
            textures.forEach(texture => {
                const sprite = new Sprite(texture);
                sprite.x = totalWidth;
                sprite.y = 0;
                sprites.push(sprite);
                totalWidth += maxTextureWidth;
            });
        }

        return sprites;
    }

    const backgroundSprites = createEndlessLayer(backgroundTextures);
    const midgroundSprites = createEndlessLayer(midgroundTextures);
    const foregroundSprites = createEndlessLayer(foregroundTextures);

    const backgroundContainer = new Container();
    backgroundSprites.forEach(sprite => backgroundContainer.addChild(sprite));

    const midgroundContainer = new Container();
    midgroundSprites.forEach(sprite => midgroundContainer.addChild(sprite));

    const foregroundContainer = new Container();
    foregroundSprites.forEach(sprite => foregroundContainer.addChild(sprite));

    scene.addChild(backgroundContainer);
    scene.addChild(midgroundContainer);
    scene.addChild(foregroundContainer);

    app.ticker.add((time) => {
        const movementX = time.deltaTime * speed;

        function moveLayer(container) {
            container.children.forEach((sprite) => {
                sprite.x -= movementX;

                if (sprite.x <= -maxTextureWidth) {
                    sprite.x += count * maxTextureWidth;
                }
            });
        }

        moveLayer(backgroundContainer);
        moveLayer(midgroundContainer);
        moveLayer(foregroundContainer);
    });
})();
*/

//! Third Variant

import { Application, Sprite, Assets, Container } from 'pixi.js';

const app = new Application();

(async () => {
    await app.init({ background: 'white', width: 1080, height: 1920 });
    document.body.appendChild(app.canvas);

    const DESIGN_WIDTH = 7616;
    const DESIGN_HEIGHT = 1920;
    const VIEWPORT_WIDTH = 1080;
    const VIEWPORT_HEIGHT = 1920;
    const speed = 6; 

    const backgroundTexture = await Assets.load('/Background.png');
    const midgroundTexture = await Assets.load('/Midground.png');
    const foregroundTexture = await Assets.load('/Foreground.png');

    function createEndlessLayer(texture) {
        const container = new Container();
        const sprite1 = new Sprite(texture);
        const sprite2 = new Sprite(texture);

        const movementX = VIEWPORT_HEIGHT / DESIGN_HEIGHT;
        sprite1.scale.set(movementX);
        sprite2.scale.set(movementX);

        sprite1.x = 0;
        sprite2.x = sprite1.width;

        container.addChild(sprite1, sprite2);
        return { container, sprite1, sprite2 };
    }

    const backgroundLayer = createEndlessLayer(backgroundTexture);
    const midgroundLayer = createEndlessLayer(midgroundTexture);
    const foregroundLayer = createEndlessLayer(foregroundTexture);

    app.stage.addChild(backgroundLayer.container);
    app.stage.addChild(midgroundLayer.container);
    app.stage.addChild(foregroundLayer.container);

    app.ticker.add((time) => {
        const deltaX = time.deltaTime * speed;

        function moveLayer(layer) {
            layer.sprite1.x -= deltaX;
            layer.sprite2.x -= deltaX;

            if (layer.sprite1.x <= -layer.sprite1.width) {
                layer.sprite1.x = layer.sprite2.x + layer.sprite2.width;
            }
            if (layer.sprite2.x <= -layer.sprite2.width) {
                layer.sprite2.x = layer.sprite1.x + layer.sprite1.width;
            }
        }

        moveLayer(backgroundLayer);
        moveLayer(midgroundLayer);
        moveLayer(foregroundLayer);
    });
})();

