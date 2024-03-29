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

// CSM 阴影
import { CSM } from 'three/addons/csm/CSM.js';

// 引入gsap补间动画操作组件库
import gsap from 'gsap';
// 使用 lil-gui 调试 three.js 图形
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
// const gui = new dat.GUI();

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
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // 变量
        const params = {
            orthographic: false,
            fade: false,
            far: 1999,
            mode: 'practical', // [ 'uniform', 'logarithmic', 'practical' ]
            lightX: -1,
            lightY: -1,
            lightZ: -1,
            margin: 100,
            lightFar: 5000,
            lightNear: 1,
            autoUpdateHelper: true,
        };
        const csm = new CSM({
            // 是否是正交相机
            orthographic: false,
            // 级联阴影最远距离(超过就不展示阴影)
            maxFar: 1000,
            // 级联分段数，默认4层
            cascades: 4,
            // 灯光模式，默认practical
            mode: 'practical', // [ 'uniform', 'logarithmic', 'practical' ]
            // 作用父级场景:scene
            parent: scene,
            // 阴影像素尺寸，越大越精细
            shadowMapSize: 2048,
            // 阴影是否在结尾处淡出
            fade: true,
            // 灯光方向
            lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
            // 相机
            camera: camera,
        });
        csm.fade = true;
        // 更新csm
        csm.updateFrustums();
        // 使用gui设置csm
        const gui = new GUI();
        gui.add(csm, 'fade')
            .onChange(function (value) {
                csm.fade = value;
                csm.updateFrustums();
            })
            .name('阴影是否在结尾处淡出');

        // 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // 基于灯光方向设置
        directionalLight.position
            .set(-1, -1, -1)
            .normalize()
            .multiplyScalar(-100);
        scene.add(directionalLight);
        // 灯光辅助线
        const directionalLightHelper = new THREE.DirectionalLightHelper(
            directionalLight,
            50
        );
        scene.add(directionalLightHelper);

        // 创建圆球模型
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMeterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#ffaa33'),
            roughness: 0.2,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMeterial);
        sphereMesh.castShadow = true;
        scene.add(sphereMesh);
        // 所有需要阴影的材质都需要设置csm
        csm.setupMaterial(sphereMeterial);

        // 创建圆柱缓冲几何体
        const cylinderGeometry = new THREE.CylinderGeometry(2, 2, 1, 32);
        const cylinderMaterial = new THREE.MeshStandardMaterial({
            color: '#f212ed',
        });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.castShadow = true;
        cylinderMesh.position.x = 7;
        cylinderMesh.rotation.x = -Math.PI / 2;
        scene.add(cylinderMesh);
        // 所有需要阴影的材质都需要设置csm
        csm.setupMaterial(cylinderMaterial);

        // 创建胶囊模型
        const capsuleGeometry = new THREE.CapsuleGeometry(2, 2, 4, 32);
        const capsuleMaterial = new THREE.MeshStandardMaterial({
            color: '#21df42',
        });
        const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
        capsuleMesh.position.x = -7;
        capsuleMesh.castShadow = true;
        scene.add(capsuleMesh);
        // 所有需要阴影的材质都需要设置csm
        csm.setupMaterial(capsuleMaterial);

        // 创建地板
        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: '#fff',
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.position.y = -3;
        planeMesh.receiveShadow = true;
        scene.add(planeMesh);
        // 所有需要阴影的材质都需要设置csm
        csm.setupMaterial(planeMaterial);

        // 渲染函数
        function animation() {
            camera.updateMatrixWorld();
            csm.update();

            // 控制器更新
            controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(animation);
        }
        // 渲染动画帧
        animation();
        /*
         * ------------end ----------
         */

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
