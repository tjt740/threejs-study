import React, { useEffect, useRef, useState } from 'react';
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
// 引入gsap补间动画操作组件库
import gsap from 'gsap';
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
// import * as dat from 'dat.gui';
// const gui = new dat.GUI();

const gui = new GUI();

export default function ThreeComponent() {
    const container = useRef(null);

    // 实际three.js渲染区域
    const WIDTH =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        ) || window.innerWidth;
    const HEIGHT =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        ) || window.innerHeight;

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0xd2d0d0);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            75, // 90
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 1.5, 12);
        // camera.position.set(0, 0, 0);

        // 摄像机添加到场景中
        scene.add(camera);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        renderer.outputColorSpace = 'srgb-linear';
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.2;
        // 改变渲染器尺寸
        renderer.setSize(WIDTH, HEIGHT);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);

        /*
         * ------------ start ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // 加载.glb文件
        const gltfLoader = new GLTFLoader();
        // 加载被压缩的.glb文件会报错，需要draco解码器
        const dracoLoader = new DRACOLoader();
        // 设置dracoLoader路径
        // dracoLoader.setDecoderPath('../../static/draco/');
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        // 使用js方式解压
        dracoLoader.setDecoderConfig({ type: 'js' });
        // 初始化_initDecoder 解码器
        dracoLoader.preload();

        // 设置gltf加载器draco解码器
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader
            .loadAsync(require('./models/exhibition-min1.glb'))
            .then((gltf) => {
                scene.add(gltf.scene);
                console.log(gltf.scene);
                gltf.scene.traverse((child) => {
                    //     if (child.isLight) {
                    //         // console.log(child);
                    //         child.intensity = 1;
                    //         // child.position.y = 1;
                    //     }

                    if (
                        child.isMesh &&
                        child.material.name.indexOf('Glass') !== -1
                    ) {
                        console.log(child);
                        child.geometry.computeVertexNormals();
                        const cubeMaterial3 = new THREE.MeshPhongMaterial({
                            color: 0xffffff,
                            // envMap: ,
                            refractionRatio: 0.98,
                            reflectivity: 0.98,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.6,
                        });
                        child.material = cubeMaterial3;

                        new THREE.TextureLoader().load(
                            require('./textures/bl.jpg'),
                            (texture) => {
                                scene.environment = texture;
                                // cubeMaterial3.envMap = texture;
                            }
                        );
                        const geometry = new THREE.TorusKnotGeometry(
                            0.5,
                            0.15,
                            50,
                            8
                        );
                        const material = new THREE.MeshBasicMaterial({
                            color: 0xffff00,
                        });
                        const torusKnot = new THREE.Mesh(geometry, material);
                        torusKnot.position.set(0, 4, 0);
                        torusKnot.scale.set(1, 3, 1);
                        child.add(torusKnot);
                    }

                    if (
                        child.isMesh &&
                        child.material.name.indexOf('Floor') !== -1
                    ) {
                        child.material = new THREE.MeshBasicMaterial({
                            map: child.material.map,
                        });
                    }
                });
            });

        controlsCamera();
        function controlsCamera() {
            // 添加鼠标点击拖拽事件
            let isMouseDown = false;
            // 监听鼠标按下事件
            container.current.addEventListener(
                'mousedown',
                () => {
                    isMouseDown = true;
                },
                false
            );
            container.current.addEventListener(
                'mouseup',
                () => {
                    isMouseDown = false;
                },
                false
            );
            container.current.addEventListener(
                'mouseout',
                () => {
                    isMouseDown = false;
                },
                false
            );
            // 是否按下鼠标,移动鼠标
            container.current.addEventListener(
                'mousemove',
                (event) => {
                    if (isMouseDown) {
                        camera.rotation.y += event.movementX * 0.002;
                        camera.rotation.x += event.movementY * 0.002;
                        // /📌 设置相机旋转时的顺序，以Y轴为主
                        camera.rotation.order = 'YXZ';
                        // xyz
                    }
                },
                false
            );
        }

        // 移动位置(创建精灵文案)
        class SpriteText {
            constructor(text, canvasPosition) {
                this.callbacks = [];
                // 创建canvas文案
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 200px Arial';
                ctx.fillStyle = 'red'; //  设置文本字体和大小
                ctx.fillText(text, 512, 512); // 绘制文本，参数分别是文本内容，x 坐标和 y 坐标

                // 绘制一个填充矩形
                ctx.fillStyle = 'rgba(100, 100, 100, 0.2)'; // 设置填充颜色
                ctx.fillRect(0, 256, 1024, 512); // 参数分别是 x 坐标，y 坐标，宽度和高度

                // 绘制一个描边矩形
                ctx.strokeStyle = 'red'; // 设置描边颜色
                ctx.lineWidth = 5; // 设置描边线宽度
                ctx.strokeRect(0, 0, 1024, 1024); // 参数分别是 x 坐标，y 坐标，宽度和高度 1024,1024 全部宽度

                // 创建canvasTexture纹理
                const canvasTexture = new THREE.CanvasTexture(canvas);

                // 创建精灵文案 （精灵文案始终朝向自己）
                this.textSprite = new THREE.Sprite(
                    new THREE.SpriteMaterial({
                        map: canvasTexture,
                        depthTest: false, // 不进行深度检测
                    })
                );
                // 设置精灵文案位置
                this.textSprite.position.copy(canvasPosition);
                scene.add(this.textSprite);

                // 进行射线检测
                //1️⃣ 创建射线
                const raycaster = new THREE.Raycaster();
                //2️⃣ 创建鼠标点
                const mouse = new THREE.Vector2();
                //3️⃣ 鼠标点击事件
                const onClick = (e) => {
                    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 —— 1)
                    // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                    // ❤️‍🔥4️⃣ 修复点击事件精度
                    mouse.x =
                        ((e.clientX - renderer.domElement.offsetLeft) /
                            renderer.domElement.clientWidth) *
                            2 -
                        1;
                    mouse.y =
                        -(
                            (e.clientY - renderer.domElement.offsetTop) /
                            renderer.domElement.clientHeight
                        ) *
                            2 +
                        1;
                    //5️⃣ 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
                    raycaster.setFromCamera(mouse, camera);

                    // 检测照射结果
                    const intersect = raycaster.intersectObject(
                        this.textSprite
                    );
                    if (intersect.length) {
                        this.callbacks.forEach((item) => {
                            // tjt: 异步同步执行。
                            item();
                        });
                    }
                };

                // 全局添加点击事件
                renderer.domElement.addEventListener('click', onClick);
            }

            onClick = (callback) => {
                this.callbacks.push(callback);
            };
        }

        const text1 = new SpriteText('展品1', new THREE.Vector3(5, 0, -5));
        text1.onClick(() => {
            setTimeout(() => {
                console.log(1);
            }, 1000);
            setTimeout(() => {
                console.log(0);
            }, 1000);
            setTimeout(() => {
                console.log(3);
            }, 1000);
        });

        /*
         * ------------end ----------
         */

        // 渲染函数
        function render(t) {
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
            const WIDTH =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .width.split('px')[0]
                ) || window.innerWidth;
            const HEIGHT =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .height.split('px')[0]
                ) || window.innerHeight;
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
