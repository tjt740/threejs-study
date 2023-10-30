import * as THREE from 'three';
//juejin.cn/post/7220696133730975800
https: export default class Cloud {
    /*
        height: 云所在的高度
        num: 云朵数量
        size: 云朵大小
        scale: 云朵尺寸
    */
    constructor(
        height = 10,
        num = 30,
        size = 15,
        scale = 10,
        autoRotate = true
    ) {
        this.textureLoader = new THREE.TextureLoader();
        this.map1 = this.textureLoader.load(
            require('../textures/cloud/cloud1.jfif')
        );
        this.map2 = this.textureLoader.load(
            require('../textures/cloud/cloud2.jfif')
        );
        this.map3 = this.textureLoader.load(
            require('../textures/cloud/cloud3.jpg')
        );

        this.material1 = new THREE.SpriteMaterial({
            map: this.map2,
            color: 0xffffff,
            alphaMap: this.map1,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        this.material2 = new THREE.SpriteMaterial({
            map: this.map3,
            color: 0xffffff,
            alphaMap: this.map2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });
        this.material3 = new THREE.SpriteMaterial({
            map: this.map1,
            color: 0xffffff,
            alphaMap: this.map3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
        });

        this.materialsList = [this.material1, this.material2, this.material3];

        this.meshGroup = new THREE.Group();
        for (let i = 0; i < num; i++) {
            const index = Math.floor(Math.random() * 3);
            const material = this.materialsList[index];
            const sprite = new THREE.Sprite(material);
            // 随机设置精灵的大小
            const randomSize = Math.random() * size;
            sprite.scale.set(randomSize, randomSize, randomSize);
            // 随机设置精灵的位置
            const randomX = (Math.random() - 0.5) * 2 * scale;
            const randomY = Math.random() * (height / 2) + height;
            const randomZ = (Math.random() - 0.5) * 2 * scale;
            // sprite.position.set(randomX, randomY, randomZ);
            sprite.position.set(0, 0, 0);
            this.meshGroup.add(sprite);
        }
    }
}
