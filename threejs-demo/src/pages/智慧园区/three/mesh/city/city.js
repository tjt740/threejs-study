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

    // 找到法棍🥖
    const fagun = gltf.scene.getObjectByName('leaven_SFR_Bread_A_Main');

    // 找到西瓜🍉
    const watermelon = gltf.scene.getObjectByName('leaven_SFR_Fruit_H_Main');

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

            const attributesPositionPointsList =
                child.geometry.attributes.position.array;
            // 创建曲线轨道
            const points = [];
            attributesPositionPointsList.forEach((_, index) => {
                // 判断点位置信息在不超过总长度的情况下进行push
                if (index * 3 <= attributesPositionPointsList.length) {
                    let i = index * 3;
                    let xIndex = i;
                    let yIndex = i + 1;
                    let zIndex = i + 2;
                    points.push(
                        new THREE.Vector3(
                            // 修复位移问题
                            attributesPositionPointsList[xIndex] +
                                30.346168518066406,
                            attributesPositionPointsList[yIndex] +
                                0.8938552141189575,
                            attributesPositionPointsList[zIndex] +
                                39.97083282470703
                        )
                    );
                }
            });

            // 创建 Catmull-Rom 曲线
            const curve = new THREE.CatmullRomCurve3(points);
            // 曲线自动闭合
            curve.closed = true;

            // 将曲线转化为几何体并创建线条对象
            const geometry = new THREE.BufferGeometry().setFromPoints(
                // 创建101个点 -'-'-’-
                curve.getPoints(200)
            );

            // 创建曲线的材质，用线段材质。
            const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            // 创建曲线
            const curveLine = new THREE.Line(geometry, material);

            // // 修复位移问题
            // curveLine.position.x = 30.346168518066406;
            // curveLine.position.y = 0.8938552141189575;
            // curveLine.position.z = 39.97083282470703;

            // 将线条对象添加到场景中
            scene.add(curveLine);

            // 让法棍沿着曲线运动
            const clock = new THREE.Clock();
            console.log(curve, fagun);
            function loop() {
                const time = clock.getElapsedTime();
                // 获取每一帧的曲线点位置信息
                const curvePointPosition = curve.getPoint(time * 0.1);
                // 法棍位置设置，因为是new THREE.Vector3(x,y,z)，所以需要用copy方法
                fagun.position.copy(curvePointPosition);

                // 西瓜逆时针位置设置
                const curvePointPosition2 = curve.getPoint(time * -0.1);
                watermelon.position.copy(curvePointPosition2);

                requestAnimationFrame(loop);
            }
            loop();
        }
    });
});
