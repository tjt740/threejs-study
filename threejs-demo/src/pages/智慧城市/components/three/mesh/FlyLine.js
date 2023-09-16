import * as THREE from 'three';
import gsap from 'gsap';
export default class FlyLine {
    constructor() {
        // 创建控制点数组
        this.points = [
            new THREE.Vector3(-10, 0, 10),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
        ];

        // 创建 Catmull-Rom 曲线
        this.curve = new THREE.CatmullRomCurve3(this.points);
        // 创建管道模型
        this.geometry = new THREE.TubeGeometry(this.curve, 64, 0.5, 2, false);
        // 创建图片纹理
        this.texture = new THREE.TextureLoader().load(
            require('../../../textures/z_11.png')
        );
        // 创建曲线的材质，用线段材质。
        this.material = new THREE.LineBasicMaterial({
            // color: 0xff0000,
            map: this.texture,
            transparent: true,
        });

        // 纹理重复水平1次，垂直2次
        this.texture.repeat.set(1, 2);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        // 纹理偏移
        this.texture.offset.x = 1;
        // 创建曲线
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        gsap.to(this.texture.offset, {
            x: 0,
            repeat: -1,
            duration: 1,
            ease: 'none',
        });

        return this.mesh;
    }
}
