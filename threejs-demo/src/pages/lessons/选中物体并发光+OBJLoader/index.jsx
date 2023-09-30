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

// 引入加载.obj类型的文件加载器 OBJLoader
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

//1️⃣ 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
//2️⃣ 添加渲染通道
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

//3️⃣ three框架本身自带效果。其他效果路径： /node_modules/three/examples/jsm/postprocessing/xxx.js
// 描边特效
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// 增加光亮特效
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

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
        // scene.background = new THREE.Color(0xd2d0d0);
        scene.background = new THREE.Color(0x000000);
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
        camera.position.set(0, 0, 5);
        // 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // );
        // 摄像机看向方向（可以是场景中某个物体）
        camera.lookAt(scene.position);

        // 摄像机添加到场景中
        scene.add(camera);

        // //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        // const axesHelper = new THREE.AxesHelper(25);
        // //  坐标辅助线添加到场景中
        // scene.add(axesHelper);

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
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

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

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
        gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

        // 创建objLoader
        const objLoader = new OBJLoader();
        objLoader.load(require('./tree.obj'), (object) => {
            console.log(object);
            scene.add(object);
        });

        // 创建多个随机位置大小的球体
        for (let i = 0; i < 8; i++) {
            const sphereGeometry = new THREE.SphereGeometry(
                Math.random() * 0.5,
                32,
                32
            );
            const sphereMeterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(
                    Math.random(),
                    Math.random(),
                    Math.random()
                ),
                roughness: 0.2,
            });
            const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMeterial);
            sphereMesh.position.set(
                Math.random() * 2,
                Math.random() * 2,
                Math.random() * 2
            );
            // mesh.scale.multiplyScalar( Math.random() * 0.3 + 0.1 );
            scene.add(sphereMesh);
        }

        //4️⃣ 合成效果
        const effectComposer = new EffectComposer(renderer);
        effectComposer.setSize(WIDTH, HEIGHT);

        //5️⃣ 添加渲染通道
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);

        //6️⃣ 描边特效
        const outlinePass = new OutlinePass(
            new THREE.Vector2(WIDTH, HEIGHT),
            scene,
            camera
        );
        //6️⃣.5️⃣  合成效果器添加 <描边特效>
        effectComposer.addPass(outlinePass);

        //7️⃣ 高亮特效
        const outputPass = new OutputPass();
        //7️⃣.5️⃣合成效果器添加 <高亮特效>
        effectComposer.addPass(outputPass);

        // 添加射线进行物体检测
        const raycasterDetection = () => {
            const raycaster = new THREE.Raycaster();
            // 创建鼠标点
            const mouse = new THREE.Vector2();
            // 鼠标点击事件
            const onClick = (e) => {
                // ❤️‍🔥 修复点击事件精度
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

                if (intersects.length) {
                    // 选中物体中Mesh
                    const selectedObjects = intersects[0].object;
                    console.log(selectedObjects);
                    // 将选中的Object里的Mesh内容，赋值给<描边特效>
                    outlinePass.selectedObjects = selectedObjects;
                }
            };
            // 全局添加点击事件
            renderer.domElement.addEventListener('click', onClick);
        };
        raycasterDetection();

        function animation(t) {
            // 控制器更新
            controls.update();

            // 合成效果加载
            effectComposer.render();

            // 使用合成效果必须注释  renderer.render(scene, camera);
            // renderer.render(scene, camera);
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
