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
// 变换控制器
import { TransformControls } from 'three/addons/controls/TransformControls.js';

// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
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

        // 创建网格
        const gridHelper = new THREE.GridHelper(50, 50);
        scene.add(gridHelper);

        // 模型加载数组
        const createModelList = [
            {
                name: '鸭子',
                path: './model/Duck.glb',
            },
            {
                name: '耳钉',
                path: './model/耳钉.glb',
            },

            {
                name: '织物沙发',
                path: './model/织物沙发.glb',
            },
        ];

        // 创建变换控制器
        const transFormControls = new TransformControls(
            camera,
            renderer.domElement
        );
        transFormControls.rotationSnap = 0.1;
        transFormControls.addEventListener('change', animation);
        // 监听拖动事件，当拖动物体时，禁用轨道控制器。
        transFormControls.addEventListener('dragging-changed', (event) => {
            controls.enabled = !event.value;
        });
        scene.add(transFormControls);

        const gltfLoader = new GLTFLoader();
        // 添加gui组
        const guiFolder1 = gui.addFolder('添加物体').open();

        // 循环给每个item上创建addMesh函数
        createModelList.forEach((item, index) => {
            const { name, path } = item;
            item.addMesh = () => {
                //📌 因为react require不知道为什么用变量无法加载，只能暂时用switch判断
                // gltfLoader.loadAsync(require(path)).then((gltf) => {
                //     scene.add(gltf.scene);
                // });

                switch (index) {
                    case 0:
                        gltfLoader
                            .loadAsync(require('./model/Duck.glb'))
                            .then((gltf) => {
                                scene.add(gltf.scene);
                                // 变换控制器设置应当变换的3D对象，并确保控制器UI是可见的。
                                transFormControls.attach(gltf.scene);
                                // setTimeout(() => {
                                // transFormControls.detach(gltf.scene);
                                // transFormControls.dispose();
                                // }, 3000);
                            });
                        break;
                    case 1:
                        gltfLoader
                            .loadAsync(require('./model/耳钉.glb'))
                            .then((gltf) => {
                                scene.add(gltf.scene);
                                // 变换控制器设置应当变换的3D对象，并确保控制器UI是可见的。
                                transFormControls.attach(gltf.scene);
                            });
                        break;
                    case 2:
                        gltfLoader
                            .loadAsync(require('./model/织物沙发.glb'))
                            .then((gltf) => {
                                scene.add(gltf.scene);
                                // 变换控制器设置应当变换的3D对象，并确保控制器UI是可见的。
                                transFormControls.attach(gltf.scene);
                            });
                        break;
                    default:
                        break;
                }
            };
            // gui点击触发 增加网格函数
            guiFolder1.add(item, 'addMesh').name(name);
        });

        // 进行射线判断切换变控制器
        // raycasterClick();
        function raycasterClick() {
            // 创建射线
            const raycaster = new THREE.Raycaster();
            // 创建鼠标点
            const mouse = new THREE.Vector2();
            // 鼠标点击事件
            const onClick = (e) => {
                // 修复点击事件精度
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
                // 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
                raycaster.setFromCamera(mouse, camera);
                // 检测照射结果
                const intersects = raycaster.intersectObjects(
                    scene.children,
                    true
                );
                if (intersects.length >= 1) {
                    window.intersects = intersects;
                    const findItem = intersects?.find(
                        (item) =>
                            item?.object?.isMesh &&
                            item?.object?.type === 'Mesh'
                    );
                    if (findItem) {
                        // 变换控制器选中Mesh
                        transFormControls.attach(findItem.object);
                    }
                }
            };

            // 全局添加点击事件
            window.addEventListener('click', onClick);
        }

        const guiFolder2 = gui
            .addFolder('控制物体旋转、缩放、位置模式切换')
            .open();
        guiFolder2
            .add(transFormControls, 'mode', ['translate', 'rotate', 'scale'])
            .onChange((value) => {
                transFormControls.setMode(value);
            });

        guiFolder2
            .add(transFormControls, 'rotationSnap', 0, 1, 0.01)
            .name('更改变换控制器的旋转步幅');

        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function animation(t) {
            // 获取秒数
            const time = clock.getElapsedTime();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

            // 最后，想要成功的完成这种效果，你需要在主函数中调用 TWEEN.update()
            // TWEEN.update();

            // 控制器更新
            controls.update();
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
