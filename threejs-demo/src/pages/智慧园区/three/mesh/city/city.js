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

gltfLoader.load(require('./model/城市.glb'), (gltf) => {
    console.log(gltf);

    scene.add(gltf.scene);

    // 遍历子元素
    gltf.scene.traverse((child) => {
        // 让热气球自己运动
        if (child.name === '热气球1') {
            console.log('热气球1：', child);
            // 创建一个动画播放器mixer,装在mesh。
            const mixer = new THREE.AnimationMixer(child);
            // 获取gltf中 animations中，关于热气球的 AnimationClip
            const ballAnimation = gltf.animations[0];
            // 执行播放器AnimationMixer的.clipAction()方法返回一个AnimationAction对象,AnimationAction对象用来控制如何播放。
            const ballAction = mixer.clipAction(ballAnimation);
            // 启动动画，默认循环播放
            ballAction.play();
            ballAction.clampWhenFinished = true;
            ballAction.loop = THREE.LoopOnce;

            // 如果想播放动画开始变化，需要使用requestAnimationFrame
            const clock = new THREE.Clock();

            function loop() {
                requestAnimationFrame(loop);
                const frameT = clock.getDelta();
                // 更新播放器相关的时间
                mixer.update(frameT);
            }
            loop();
        }

        // 按照blender设计的曲线 渲染动画
        if (child.name === 'NURBS_曲线') {
            console.log('NURBS_曲线：', child);
        }
    });
});
