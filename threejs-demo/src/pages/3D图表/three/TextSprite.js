import * as THREE from 'three';
import CanvasTexture from './CanvasTexture';

export default class TextSprite {
    constructor(label, value, type, index, size) {
        this.label = label;
        this.value = value;
        this.type = type;
        this.size = size;
        // 下标
        this.index = index;
        this.textSpriteGroup = new THREE.Group();
        this.createTextSprite();
    }

    createTextSprite() {
        // 创建cavans构造函数
        const canvasTexture = new CanvasTexture(this.label, this.value);
        // 创建精灵文案 （精灵文案始终朝向自己）
        this.textSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: canvasTexture.canvasTexture,
                depthTest: false, // 不进行深度检测
            })
        );
        // 设置精灵文案位置
        this.textSprite.position.x = -this.index * 2;
        this.textSprite.position.y = this.value - this.size / 2 + 1;
        this.textSpriteGroup.add(this.textSprite);
    }
}
