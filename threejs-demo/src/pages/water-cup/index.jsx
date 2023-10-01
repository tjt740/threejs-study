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
const gui = new GUI({
    width: '1000px',
});

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
        camera.position.set(0, 0, 15);
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

        /*
         * ------------ start ----------
         */

        // 添加环境纹理映射
        const hdrLoader = new RGBELoader();
        hdrLoader
            .loadAsync(
                require('../lessons/MeshPhysicalMaterial/texture/environment.hdr')
            )
            .then((envmap) => {
                envmap.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = envmap;
                scene.environment = envmap;
            });

        const gltfLoader = new GLTFLoader();
        gltfLoader.loadAsync(require('./model/cup.glb')).then((glb) => {
            scene.add(glb.scene);

            // 冰块
            const ice = glb.scene.getObjectByName('copo_low_04_vidro_0');
            ice.position.z = -4;
            // 冰块渲染顺序
            ice.renderOrder = 1;
            const iceMaterial = ice.material;
            ice.material = new THREE.MeshPhysicalMaterial({
                map: iceMaterial.map,
                normalMap: iceMaterial.normalMap,
                roughnessMap: iceMaterial.roughnessMap,
                metalnessMap: iceMaterial.metalnessMap,
                transparent: true,
                transmission: 0.95,
                roughness: 0,
                ior: 2.0,
                sheen: 0.5,
                thickness: 1,
                opacity: 1, // 影响材质混合的目标因子
            });
            // ice.visible = false;

            // 果汁
            const juice = glb.scene.getObjectByName('copo_low_02_agua_0');
            // 果汁渲染顺序
            juice.renderOrder = 2;
            const juiceMaterial = juice.material;
            juice.material = new THREE.MeshPhysicalMaterial({
                map: juiceMaterial.map,
                normalMap: juiceMaterial.normalMap,
                roughnessMap: juiceMaterial.roughnessMap,
                metalnessMap: juiceMaterial.metalnessMap,
                transparent: true,
                transmission: 0.99,
                roughness: 0,
                reflectivity: 0.6,
                ior: 1.5,
                thickness: 1,
                opacity: 0.6, // 影响材质混合的源因子，📢如果不设置 opacity，则冰块会被挡住，因为🔽材质混合公式里计算的是opacity
            });
            // 果汁混合颜色公式： 源颜色(橙汁颜色) * 源因子(橙汁opacity) + 目标颜色(冰块颜色) * 目标因子(1 - 橙汁设置的opacity:0.6 )
            juice.material.blending = THREE.CustomBlending;
            juice.material.blendSrc = THREE.SrcColorFactor;
            juice.material.blendSrcAlpha = THREE.SrcColorFactor;
            juice.material.blendDst = THREE.SrcColorFactor;
            juice.material.blendDstAlpha = THREE.DstAlphaFactor;
            juice.material.blendEquation = THREE.AddEquation;
            juice.material.blendEquationAlpha = THREE.AddEquation;

            // juice.visible = false;

            // 玻璃水杯
            const glassCup = glb.scene.getObjectByName('copo_low_01_vidro_0');
            // 玻璃水杯渲染顺序
            glassCup.renderOrder = 3;
            const glassCupMaterial = glassCup.material;
            glassCup.material = new THREE.MeshPhysicalMaterial({
                map: glassCupMaterial.map,
                normalMap: glassCupMaterial.normalMap,
                roughnessMap: glassCupMaterial.roughnessMap,
                metalnessMap: glassCupMaterial.metalnessMap,
                transparent: true,
                transmission: 0.95,
                roughness: 0.3,
                thickness: 10,
                ior: 2,
                opacity: 0.6, // 影响材质混合的源因子，📢如果不设置 opacity，则果汁、冰块会被挡住，因为🔽材质混合公式里计算的是opacity
            });
            glassCup.material.blending = THREE.CustomBlending;
            glassCup.material.blendSrc = THREE.SrcColorFactor;
            glassCup.material.blendSrcAlpha = THREE.SrcColorFactor;
            glassCup.material.blendDst = THREE.OneMinusSrcColorFactor;
            glassCup.material.blendDstAlpha = THREE.SrcColorFactor;
            glassCup.material.blendEquation = THREE.AddEquation;
            glassCup.material.blendEquationAlpha = THREE.AddEquation;
            // 玻璃杯混合颜色公式：源颜色(橙汁颜色) * 源因子(橙汁opacity0.6) + 目标颜色(玻璃杯子) * 目标因子 (1 - 源因子 玻璃杯opacity:0.6)
            // glassCup.visible = false;

            const gui1 = gui.addFolder('果汁');
            gui1.add(glassCup.material, 'blending', {
                NoBlending: THREE.NoBlending,
                NormalBlending: THREE.NormalBlending,
                AdditiveBlending: THREE.AdditiveBlending,
                SubtractiveBlending: THREE.SubtractiveBlending,
                MultiplyBlending: THREE.MultiplyBlending,
                CustomBlending: THREE.CustomBlending,
            }).name('.blending材质混合模式');

            gui1.add(glassCup.material, 'blendSrc', {
                ZeroFactor: THREE.ZeroFactor,
                OneFactor: THREE.OneFactor,
                SrcColorFactor: THREE.SrcColorFactor,
                OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
                SrcAlphaFactor: THREE.SrcAlphaFactor,
                OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
                DstAlphaFactor: THREE.DstAlphaFactor,
                OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
                DstColorFactor: THREE.DstColorFactor,
                OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
                SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
            }).name('.blendSrc混合源因子');

            gui1.add(glassCup.material, 'blendSrcAlpha', {
                ZeroFactor: THREE.ZeroFactor,
                OneFactor: THREE.OneFactor,
                SrcColorFactor: THREE.SrcColorFactor,
                OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
                SrcAlphaFactor: THREE.SrcAlphaFactor,
                OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
                DstAlphaFactor: THREE.DstAlphaFactor,
                OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
                DstColorFactor: THREE.DstColorFactor,
                OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
                SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
            }).name('.blendSrcAlpha混合操作透明度');

            gui1.add(glassCup.material, 'blendDst', {
                ZeroFactor: THREE.ZeroFactor,
                OneFactor: THREE.OneFactor,
                SrcColorFactor: THREE.SrcColorFactor,
                OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
                SrcAlphaFactor: THREE.SrcAlphaFactor,
                OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
                DstAlphaFactor: THREE.DstAlphaFactor,
                OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
                DstColorFactor: THREE.DstColorFactor,
                OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
                // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
            }).name('.blendDst混合目标因子');

            gui1.add(glassCup.material, 'blendDstAlpha', {
                ZeroFactor: THREE.ZeroFactor,
                OneFactor: THREE.OneFactor,
                SrcColorFactor: THREE.SrcColorFactor,
                OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
                SrcAlphaFactor: THREE.SrcAlphaFactor,
                OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
                DstAlphaFactor: THREE.DstAlphaFactor,
                OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
                DstColorFactor: THREE.DstColorFactor,
                OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
                // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
            });

            gui1.add(glassCup.material, 'blendEquation', {
                AddEquation: THREE.AddEquation,
                SubtractEquation: THREE.SubtractEquation,
                ReverseSubtractEquation: THREE.ReverseSubtractEquation,
                MinEquation: THREE.MinEquation,
                MaxEquation: THREE.MaxEquation,
            }).name('.blendEquation混合方程式');

            gui1.add(glassCup.material, 'blendEquationAlpha', {
                AddEquation: THREE.AddEquation,
                SubtractEquation: THREE.SubtractEquation,
                ReverseSubtractEquation: THREE.ReverseSubtractEquation,
                MinEquation: THREE.MinEquation,
                MaxEquation: THREE.MaxEquation,
            }).name('.blendEquationAlpha混合方程式透明度');
        });

        /*
         * ------------end ----------
         */

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
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
