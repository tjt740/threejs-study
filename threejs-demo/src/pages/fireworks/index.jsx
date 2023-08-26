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

// 使用 官方 ‘水’模型
import { Water } from 'three/examples/jsm/objects/Water2';

import gsap from 'gsap';
// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';

// 导入自定义类函数
import FireWork from './func/fireworks';

const gui = new GUI();

export default function ThreeComponent() {
    const container = useRef(null);
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0xd2d0d0);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            45, // 90
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = window.innerWidth / window.innerHeight;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(-10, 30, 50);
        // 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // ); 使用
        camera.lookAt(scene.position);

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
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        // renderer.physicallyCorrectLights = true;
        // renderer.useLegacyLightsback = true;
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

        // 加载.hdr纹理图片
        const createHDR = () => {
            const rgbeLoader = new RGBELoader();
            rgbeLoader.load(require('./texture/2k.hdr'), (texture) => {
                texture.mapping = THREE.EquirectangularRefractionMapping;
                scene.environment = texture;
                scene.background = texture;
            });
        };
        createHDR();

        // 加载.glb模型
        const createModel = async () => {
            const gltfLoader = new GLTFLoader();
            await gltfLoader
                .loadAsync(require('./model/newyears_min.glb'))
                .then((glb) => {
                    scene.add(glb.scene);

                    createWater();
                    createFlylight();
                });
        };
        createModel();

        // 加载水模型
        const createWater = () => {
            // 给池塘增加水波
            const waterTextureLoader = new THREE.TextureLoader();
            // 水 options 参数
            const options = {
                color: '#ffffff', // 水面颜色
                scale: 3, // 水尺寸(影响水流速度)
                flowX: 1, // 水流方向z
                flowY: 1, // 水流方向y
                textureWidth: 1024, // 水体清晰度 W
                textureHeight: 1024, // 水体清晰度 H
                reflectivity: 0.66, // 水面反射率(越大越黑)
                normalMap0: waterTextureLoader.load(
                    require('./texture/water/Water_1_M_Normal.jpg')
                ), // 水材质0 ⭐️ 非常重要 官方文档自带
                normalMap1: waterTextureLoader.load(
                    require('./texture/water/Water_2_M_Normal.jpg')
                ), // 水材质1 ⭐️ 非常重要 官方文档自带
            };
            const waterGeometry = new THREE.PlaneGeometry(100, 100);
            const water = new Water(waterGeometry, {
                color: options.color,
                scale: options.scale,
                // 水流方向 new THREE.Vector2(x,y);
                flowDirection: new THREE.Vector2(options.flowX, options.flowY),
                side: THREE.DoubleSide,
                textureWidth: options.textureWidth,
                textureHeight: options.textureHeight,
                normalMap0: options.normalMap0,
                normalMap1: options.normalMap1,
                reflectivity: options.reflectivity,
                refractionRatio: options.refractionRatio,
            });
            water.rotation.x = -Math.PI / 2;
            water.position.y = 0.2;
            scene.add(water);
            // 水面颜色更改
            gui.addColor(options, 'color')
                .onFinishChange((value) => {
                    water.material.uniforms.color.value = new THREE.Color(
                        value
                    );
                })
                .name('水面颜色更改');

            // 水流方向更改
            gui.add(options, 'flowX', -1, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['flowDirection'].value.x = value;
                    water.material.uniforms['flowDirection'].value.normalize();
                });
            gui.add(options, 'flowY', -1, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['flowDirection'].value.y = value;
                    water.material.uniforms['flowDirection'].value.normalize();
                });

            // 水流尺寸修改(影响水流速度)
            gui.add(options, 'scale', 1, 10)
                .step(1)
                .onChange(function (value) {
                    water.material.uniforms['config'].value.w = value;
                })
                .name('水流尺寸修改(影响水流速度)');

            // 水面反射率(越大越黑)
            gui.add(options, 'reflectivity', 0, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['reflectivity'].value = value;
                })
                .name('水面反射率');
        };

        // 载入孔明灯，并设置动画
        const createFlylight = () => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load(require('./model/flyLight.glb'), (gltf) => {
                const glbScene = gltf.scene;
                const glpGroup = new THREE.Group();

                for (let i = 0; i < 10; i++) {
                    const cloneGlbScene = glbScene.clone(true);
                    const x = (Math.random() - 0.5) * 70;
                    const y = Math.random() * 50 + 5;
                    const z = (Math.random() - 0.5) * 50;
                    cloneGlbScene.position.set(x, y, z);
                    cloneGlbScene.position.set(x, y, z);
                    gsap.to(cloneGlbScene.rotation, {
                        y: 2 * Math.PI,
                        duration: 10 + Math.random() * 30,
                        repeat: -1,
                    });
                    gsap.to(cloneGlbScene.position, {
                        x: '+=' + Math.random() * 5,
                        y: '+=' + Math.random() * 20,
                        yoyo: true,
                        duration: 5 + Math.random() * 10,
                        repeat: -1,
                    });
                    glpGroup.add(cloneGlbScene);
                }
                glpGroup.add(glbScene);
                scene.add(glpGroup);
            });
        };

        // 创建烟花
        // 每次调用类函数，往fireworkListManage里推入数据，进行后期管理
        const fireworkListManage = [];
        const createFirework = () => {
            // 随机颜色
            const color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
            // 随机位置
            const position = {
                x: (Math.random() - 0.5) * 40,
                z: -(Math.random() - 0.5) * 40,
                y: 3 + Math.random() * 15,
            };

            // 将随机创建烟花颜色+烟花终点位置，放入类组件中
            const fireWork = new FireWork({ color, position, scene, camera });

            // 烟花创建成功后添加到场景中
            fireWork.addScene(scene, camera);
            // 把每次创建的烟花放到数组里进行管理
            fireworkListManage.push(fireWork);
        };

        window.addEventListener('click', createFirework);

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();

            let elapsedTime = clock.getElapsedTime();

            // 调用类中的updateTime
            fireworkListManage.forEach((item) => item.updateTime());
            if (elapsedTime >= 5) {
                fireworkListManage.forEach((item, i) => {
                    const type = item.updateTime();
                    if (type === 'remove') {
                        fireworkListManage.splice(i, 1);
                    }
                });
                // console.log(fireworkListManage);
                // elapsedTime = 0;
            }

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }
        // 渲染
        render();

        /*
         * ------------end ----------
         */

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

        // 更具页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 更新camera 宽高比;
            camera.aspect = window.innerWidth / window.innerHeight;
            /* 
                更新camera 投影矩阵
                .updateProjectionMatrix () : undefined
                更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
                */
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight);
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
