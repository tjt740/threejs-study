import * as THREE from 'three';
import scene from '../../scene';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 加载城市
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

gltfLoader.load(require('./model/city4.glb'), (gltf) => {
    scene.add(gltf.scene);
});
