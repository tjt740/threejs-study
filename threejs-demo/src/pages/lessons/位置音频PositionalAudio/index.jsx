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
// CSM 阴影
import { CSM } from 'three/addons/csm/CSM.js';
// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
// 引入gsap补间动画操作组件库
import gsap from 'gsap';
// 使用 lil-gui 调试 three.js 图形
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import GUI from 'lil-gui';
const gui = new GUI({
    // 设置gui title
    title: 'gui控制器(点击展开)',
    // 收起分区，默认false
    closeFolders: true,
    // 自动生成在页面右上角，默认为true
    autoPlace: true,
});

// import * as dat from 'dat.gui';
//

export default function ThreeComponent() {
    const containerRef = useRef(null);

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
        scene.background = new THREE.Color(0xd2d0d0);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            45, // 90
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 20);
        // 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // );
        // 摄像机看向方向（可以是场景中某个物体）
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
            // 设置对数深度缓冲区，优化深度冲突问题，当两个面间隙过小，或者重合，你设置webgl渲染器对数深度缓冲区也是无效的。
            logarithmicDepthBuffer: true,
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
        // 设置软阴影（不再是像素阴影）
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能（已被移除）.
        // renderer.physicallyCorrectLights = true;

        // 轨道控制器
        const controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 10;
        controls.rollSpeed = Math.PI / 60;

        // // 控制器阻尼
        // controls.enableDamping = true;
        // // 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
        // controls.dampingFactor = 0.05;
        // // 自动旋转
        // controls.autoRotate = false;
        // controls.autoRotateSpeed = 2.0;
        // // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        // controls.maxPolarAngle = Math.PI;
        // // 控制器最小俯视角
        // controls.minPolarAngle = 0;
        // // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        // controls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // );

        /*
         * ------------ start ----------
         */

        // 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // 基于灯光方向设置
        directionalLight.position.set(5, 7, 7);
        scene.add(directionalLight);

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
        gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

        // 创建圆球模型
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMeterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#ffaa33'),
            roughness: 0.2,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMeterial);
        sphereMesh.position.set(-15, 0, -15);
        scene.add(sphereMesh);

        // 创建圆球模型
        const sphereGeometry2 = new THREE.SphereGeometry(1.4, 32, 32);
        const sphereMeterial2 = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#aacc33'),
            roughness: 0.2,
        });
        const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMeterial2);
        sphereMesh2.position.set(25, 0, -15);
        scene.add(sphereMesh2);

        // 创建一个平面
        const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -2;
        scene.add(plane);

        //1️⃣ 音乐加载器
        const audioLoader = new THREE.AudioLoader();
        //2️⃣ 创建音频，使用three.js
        const listener1 = new THREE.AudioListener();
        //2️⃣.5️⃣ 摄像机添加音频1
        camera.add(listener1);
        //4️⃣ 创建一个带有位置信息的音频
        const sound1 = new THREE.PositionalAudio(listener1);
        audioLoader.load(require(`./audio/gnzw.mp3`), function (buffer) {
            //5️⃣ 载入buffer
            sound1.setBuffer(buffer);
            //6️⃣ 设置循环
            sound1.setLoop(false);
            //7️⃣ 音频位置
            sound1.setRefDistance(1);
        });
        //9️⃣ 将音乐添加到小球1中
        sphereMesh.add(sound1);

        // click event
        containerRef.current.addEventListener('click', function (e) {
            //8️⃣ 音乐启动
            sound1.play();
        });

        // 创建烟花爆炸声，使用three.js
        const listener2 = new THREE.AudioListener();
        // 摄像机添加音频2
        camera.add(listener2);
        // 创建一个带有位置信息的音频
        const sound2 = new THREE.PositionalAudio(listener2);
        audioLoader.load(require(`./audio/gyz.mp3`), function (buffer) {
            // 载入buffer
            sound2.setBuffer(buffer);
            // 设置循环
            sound2.setLoop(false);
            // 音频位置
            sound2.setRefDistance(1);
            setTimeout(() => {
                // 音乐启动
                sound2.play();
            }, 1000);
        });
        // 将音乐添加到小球2中
        sphereMesh2.add(sound2);

        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function animation(t) {
            // 获取秒数
            const deltaTime = clock.getDelta();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

            // 最后，想要成功的完成这种效果，你需要在主函数中调用 TWEEN.update()
            // TWEEN.update();
            // 控制器更新
            controls.update(deltaTime);
            // 控制器更新
            // controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(animation);
        }
        // 渲染动画帧
        animation();

        // DOM承载渲染器
        containerRef.current.appendChild(renderer.domElement);

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
            <div id="container" ref={containerRef}></div>
        </>
    );
}
