import * as THREE from 'three';
import gsap from 'gsap';
import { Water } from 'three/examples/jsm/objects/Water2';

export default class Ocean {
    constructor() {
        this.oceanGroup = new THREE.Group();
        // 创建水平
        const circleGeometry = new THREE.CircleGeometry(10, 64);
        // 水
        // 创建水面textureLoader
        const waterTextureLoader = new THREE.TextureLoader();
        // 水 options 参数
        const options = {
            color: '#ffffff', // 水面颜色
            scale: 1, // 水尺寸(影响水流速度)
            flowX: 1, // 水流方向z
            flowY: 1, // 水流方向y
            textureWidth: 1024, // 水体清晰度 W
            textureHeight: 1024, // 水体清晰度 H
            reflectivity: 0.01, // 水面反射率(越大越黑)
            flowDirection: new THREE.Vector2(1, 1),
            normalMap0: waterTextureLoader.load(
                require('../textures/water/Water_1_M_Normal.jpg')
            ), // 水材质0 ⭐️ 非常重要 官方文档自带
            normalMap1: waterTextureLoader.load(
                require('../textures/water/Water_2_M_Normal.jpg')
            ), // 水材质1 ⭐️ 非常重要 官方文档自带
        };
        const water = new Water(circleGeometry, {
            color: options.color,
            scale: options.scale,
            // 水流方向 new THREE.Vector2(x,y);
            flowDirection: new THREE.Vector2(options.flowX, options.flowY),
            textureWidth: options.textureWidth,
            textureHeight: options.textureHeight,
            normalMap0: options.normalMap0,
            normalMap1: options.normalMap1,
            reflectivity: options.reflectivity,
        });

        water.material.fragmentShader = water.material.fragmentShader.replace(
            'gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );',
            `
        gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );
        gl_FragColor = mix( gl_FragColor, vec4( 0.05, 0.3, 0.7, 1.0 ), vToEye.z*0.0005+0.5 );
        
        `
        );

        water.position.y = 0.5;
        water.rotation.x = -Math.PI / 2;
        this.oceanGroup.add(water);
    }
}
