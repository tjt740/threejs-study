import * as THREE from 'three';
import gsap from 'gsap';
export class Cloud {
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
            sprite.position.set(randomX, randomY, randomZ);

            this.meshGroup.add(sprite);
        }
        if (autoRotate) {
            this.animation();
        }
    }
    animation() {
        gsap.to(this.meshGroup.rotation, {
            duration: 20,
            repeat: -1,
            y: Math.PI * 2,
        });
    }
}

// 第二种写法
export class CloudsPlus {
    // height设置云朵的高度，num设置云朵的数量
    constructor(
        height = 20,
        num = 100,
        size = 400,
        scale = 100,
        autoRotate = true
    ) {
        this.height = height;
        this.num = num;
        this.size = size;
        this.scale = scale;
        this.autoRotate = autoRotate;
        const textureLoader = new THREE.TextureLoader();
        const map1 = textureLoader.load(
            require('../textures/cloud/cloud1.jfif')
        );
        const map2 = textureLoader.load(
            require('../textures/cloud/cloud2.jfif')
        );
        const map3 = textureLoader.load(
            require('../textures/cloud/cloud3.jpg')
        );

        const materials = [];

        const material1 = new THREE.PointsMaterial({
            map: map1,
            color: 0xffffff,
            alphaMap: map2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            size: 0.2 * size,
        });
        const material2 = new THREE.PointsMaterial({
            map: map2,
            color: 0xffffff,
            alphaMap: map3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            size: 0.5 * size,
        });
        const material3 = new THREE.PointsMaterial({
            map: map3,
            color: 0xffffff,
            alphaMap: map1,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            size: 0.8 * size,
        });
        const material4 = new THREE.PointsMaterial({
            map: map2,
            color: 0xffffff,
            alphaMap: map1,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: false,
            size: 1 * size,
        });
        materials.push(material1, material2, material3, material4);

        this.mesh = new THREE.Group();

        for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            const geometry = this.generateGeometry(this.num);
            const points = new THREE.Points(geometry, material);

            this.mesh.add(points);
        }
        if (autoRotate) {
            this.animate();
        }
    }
    generateGeometry(num = 300) {
        const vertices = [];
        // 创建点位置
        for (let i = 0; i < num; i++) {
            // 随机设置精灵的位置
            const randomX = (Math.random() - 0.5) * 2 * this.scale;
            const randomY = Math.random() * (this.height / 2) + this.height;
            const randomZ = (Math.random() - 0.5) * 2 * this.scale;
            vertices.push(randomX, randomY, randomZ);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3)
        );
        return geometry;
    }
    animate() {
        let i = 1;
        this.mesh.traverse((item) => {
            const speed = 40 * i;
            if (item instanceof THREE.Points) {
                gsap.to(item.rotation, {
                    duration: speed,
                    repeat: -1,
                    y: Math.PI * 2,
                });
            }
            i++;
        });
    }
}
