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

// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
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
        camera.position.set(0, 0, 50);
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
        renderer.physicallyCorrectLights = true;

        // // 启用裁剪，只有在所定义的裁剪区域内的像素才会受之后的渲染器影响
        // renderer.setScissorTest(true);
        // // 设置裁剪区域 (x,y, x + window.innerWidth / 2, y+ window.innerHeight)
        // renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);

        // // 给新场景裁剪一块区域
        // renderer.setScissorTest(true);
        // renderer.setScissor(
        //     window.innerWidth / 2,
        //     0,
        //     window.innerWidth / 2,
        //     window.innerHeight
        // );
        // renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);

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

        // // 添加环境纹理映射
        // const hdrLoader = new RGBELoader();
        // hdrLoader
        //     .loadAsync(
        //         require('../MeshPhysicalMaterial/texture/environment.hdr')
        //     )
        //     .then((envmap) => {
        //         envmap.mapping = THREE.EquirectangularReflectionMapping;
        //         scene.background = envmap;
        //         scene.environment = envmap;
        //     });

        // 创建扭结
        const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 1.5, 100, 16);
        const torusKnotMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
        });
        const torusKnotMesh = new THREE.Mesh(
            torusKnotGeometry,
            torusKnotMaterial
        );
        scene.add(torusKnotMesh);

        const newScene = new THREE.Scene();
        newScene.background = new THREE.Color(0x000000);

        // 创建gui调试裁剪场景区域
        const params = {
            scissorWidth: window.innerWidth / 2,
        };

        gui.add(params, 'scissorWidth', 0, window.innerWidth);
        //             .onChange(
        //     (value) => {
        //         renderer.setScissor(value, 0, value, window.innerHeight);
        //     }
        // );

        const torusKnotGeometry1 = new THREE.TorusKnotGeometry(
            10,
            1.5,
            100,
            16
        );
        const torusKnotMaterial1 = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
        });
        const torusKnotMesh1 = new THREE.Mesh(
            torusKnotGeometry1,
            torusKnotMaterial1
        );
        newScene.add(torusKnotMesh1);

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

            // 启用裁剪，只有在所定义的裁剪区域内的像素才会受之后的渲染器影响
            renderer.setScissorTest(true);
            // 设置裁剪区域 (x,y, x + window.innerWidth / 2, y+ window.innerHeight)
            renderer.setScissor(0, 0, params.scissorWidth, window.innerHeight);
            renderer.render(scene, camera);

            // 给新场景裁剪一块区域
            renderer.setScissorTest(true);
            renderer.setScissor(
                params.scissorWidth,
                0,
                window.innerWidth - params.scissorWidth,
                window.innerHeight
            );

            // 新场景
            renderer.render(newScene, camera);

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
