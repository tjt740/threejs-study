import * as THREE from 'three';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import scene from '../three/scene';

// 创建gltfloader
const gltfLoader = new GLTFLoader();

// 加载被压缩的.glb文件会报错，需要draco解码器
const dracoLoader = new DRACOLoader();
// 设置dracoLoader路径
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
);
// 使用js方式解压
dracoLoader.setDecoderConfig({ type: 'js' });
// 初始化_initDecoder 解码器
dracoLoader.preload();

// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader);

// 渲染战斗机
gltfLoader.loadAsync(require('../model/Fighter.glb')).then((gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
        console.log(child);
        if (child.isMesh) {
            // 自发光亮度
            // child.material.emissiveIntensity = 3;
        }
    });
});
