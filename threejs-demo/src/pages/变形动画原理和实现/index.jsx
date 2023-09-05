import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';

import gsap from 'gsap';

// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
const gui = new GUI();

export default function ThreeComponent() {
    const container = useRef(null);

    // 实际three.js渲染区域
    const WIDTH = Number(
        window
            .getComputedStyle(
                document.getElementsByClassName('ant-layout-content')[0]
            )
            .width.split('px')[0]
    );
    const HEIGHT = Number(
        window
            .getComputedStyle(
                document.getElementsByClassName('ant-layout-content')[0]
            )
            .height.split('px')[0]
    );

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0xd2d0d0);
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            45, // 90
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 50);
        // 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // ); 使用
        // camera.lookAt(scene.position);

        // 摄像机添加到场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        renderer.outputColorSpace = 'srgb';
        // 色调映射 THREE.NoToneMapping || THREE.LinearToneMapping || THREE.ReinhardToneMapping || THREE.CineonToneMapping || THREE.ACESFilmicToneMapping
        renderer.toneMapping = THREE.NoToneMapping;
        // 色调映射的曝光级别。默认是1，屏幕是2.2，越低越暗
        renderer.toneMappingExposure = 2.2;

        // 改变渲染器尺寸
        renderer.setSize(WIDTH, HEIGHT);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        // renderer.physicallyCorrectLights = true;

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
        controls.dampingFactor = 0.05;
        // 自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        controls.target = new THREE.Vector3(
            scene.position.x,
            scene.position.y,
            scene.position.z
        );

        /*
         * ------------ start ----------
         */

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2.4, 5.3, 2);
        scene.add(directionalLight);

        const directionalLightHelper = new THREE.DirectionalLightHelper(
            directionalLight,
            10
        );
        scene.add(directionalLightHelper);

        // 加载.hdr 文件
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(require('./textures/038.hdr'), (texture) => {
            texture.mapping = THREE.EquirectangularRefractionMapping;
            scene.background = texture;
            scene.environment = texture;
        });

        // 加载.glb文件
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
        // 设置gltf加载器dracoLoader解码器
        gltfLoader.setDRACOLoader(dracoLoader);

        // 加载 <模型0>
        gltfLoader.loadAsync(require('./model/sphere0.glb')).then((glb0) => {
            // 场景添加 <模型0>
            glb0.scene.position.set(-10, 0, 0);
            scene.add(glb0.scene);

            // 获取 <模型0>模型
            const glb0Mesh = glb0.scene.children[0];

            gltfLoader
                .loadAsync(require('./model/sphere1.glb'))
                .then((glb1) => {
                    // 给设置变形属性里增加 position 属性。并设置为[];
                    glb0Mesh.geometry.morphAttributes.position = [];

                    // 将<模型1>中的模型32位顶点位置属性 塞入 <模型0>的变形属性的position属性中
                    glb0Mesh.geometry.morphAttributes.position.push(
                        glb1.scene.children[0].geometry.attributes.position
                    );

                    // 更新morphTargets，但会对 .morphTargetInfluences 产生影响，重置为一个空数组。
                    glb0Mesh.updateMorphTargets();

                    // 指定模型形变多少 0~1。 0:不形变，1:形变。
                    glb0Mesh.morphTargetInfluences[0] = 1;

                    // 配合GSAP实现动画过渡效果
                    const params = {
                        value: 0,
                    };
                    gsap.to(params, {
                        value: 1, // 终点值
                        duration: 1,
                        repeat: -1,
                        yoyo: true,
                        onUpdate: () => {
                            // console.log(params.value);
                            glb0Mesh.morphTargetInfluences[0] = params.value;
                        },
                    });
                });
        });

        // 加载花glb文件
        gltfLoader.loadAsync(require('./model/f4.glb')).then((flower0) => {
            scene.add(flower0.scene);
            flower0.scene.rotation.x = Math.PI;

            // 花茎
            let stem;
            // 花瓣
            let petal;

            // 修复水展示 bug
            flower0.scene.traverse((item) => {
                if (item.type === 'Mesh' && item.material.name === 'Water') {
                    item.material = new THREE.MeshStandardMaterial({
                        color: 'skyblue',
                        depthWrite: false,
                        transparent: true,
                        depthTest: false,
                        opacity: 0.5,
                    });
                }
            });

            // 获取花茎
            flower0.scene.children[0].traverse((item) => {
                if (item.material && item.material.name === 'Stem') {
                    stem = item;
                }
            });

            // 获取花瓣
            flower0.scene.children[0].traverse((item) => {
                if (item.material && item.material.name === 'Petal') {
                    petal = item;
                }
            });

            // 加载花2
            gltfLoader.loadAsync(require('./model/f2.glb')).then((flower1) => {
                flower1.scene.children[0].traverse((item2) => {
                    if (item2.material && item2.material.name === 'Stem') {
                        stem.geometry.morphAttributes.position = [
                            item2.geometry.attributes.position,
                        ];
                        stem.updateMorphTargets();
                    }

                    // 花瓣
                    if (item2.material && item2.material.name === 'Petal') {
                        petal.geometry.morphAttributes.position = [
                            item2.geometry.attributes.position,
                        ];
                        petal.updateMorphTargets();
                    }

                    // 加载花3
                    gltfLoader
                        .loadAsync(require('./model/f1.glb'))
                        .then((flower2) => {
                            flower2.scene.children[0].traverse((item3) => {
                                // 找到花茎
                                if (
                                    item3.material &&
                                    item3.material.name === 'Stem'
                                ) {
                                    stem.geometry.morphAttributes.position.push(
                                        item3.geometry.attributes.position
                                    );
                                    stem.updateMorphTargets();
                                }

                                // 找到花瓣
                                if (
                                    item3.material &&
                                    item3.material.name === 'Petal'
                                ) {
                                    petal.geometry.morphAttributes.position.push(
                                        item3.geometry.attributes.position
                                    );
                                    petal.updateMorphTargets();
                                }

                                // 加入花茎变形动画
                                const params = {
                                    value: 0, // 花茎
                                    value1: 0, // 花根
                                };

                                gsap.to(params, {
                                    value: 1,
                                    duration: 1.5,
                                    onUpdate: () => {
                                        // 花茎变化
                                        stem.morphTargetInfluences[0] =
                                            params.value;

                                        // 花瓣变化
                                        petal.morphTargetInfluences[0] =
                                            params.value;
                                    },
                                    // 完成时触发其他
                                    onComplete: () => {
                                        gsap.to(params, {
                                            value1: 1,
                                            duration: 1,
                                            onUpdate: () => {
                                                // 花茎变化
                                                stem.morphTargetInfluences[1] =
                                                    params.value1;

                                                // 花瓣变化
                                                petal.morphTargetInfluences[1] =
                                                    params.value;
                                            },
                                        });
                                    },
                                });
                            });
                        });
                });
            });
        });
        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

            // 最后，想要成功的完成这种效果，你需要在主函数中调用 TWEEN.update()
            // TWEEN.update();

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }
        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

        // 控制是否全屏
        const eventObj = {
            Fullscreen: function () {
                // 全屏
                document.body.requestFullscreen();
                console.log('全屏');
            },
            ExitFullscreen: function () {
                document.exitFullscreen();
                console.log('退出全屏');
            },
        };

        gui.add(eventObj, 'Fullscreen').name('全屏');
        gui.add(eventObj, 'ExitFullscreen').name('退出全屏');

        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 实际three.js渲染区域
            const WIDTH = Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName('ant-layout-content')[0]
                    )
                    .width.split('px')[0]
            );
            const HEIGHT = Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName('ant-layout-content')[0]
                    )
                    .height.split('px')[0]
            );

            // 更新camera 宽高比;
            camera.aspect = WIDTH / HEIGHT;
            /* 
                更新camera 投影矩阵
                .updateProjectionMatrix () : undefined
                更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
                */
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(WIDTH, HEIGHT);
            // 设置渲染器像素比:
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <div id="container" ref={container}></div>
        </>
    );
}
