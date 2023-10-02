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

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 2);
        scene.add(directionalLight);

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(10, 20, 7);
        scene.add(ambientLight);

        // 创建一个立方体
        const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        const boxMaterial = new THREE.MeshBasicMaterial({});
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(boxMesh);
        // const animationObjectGroup = new THREE.AnimationObjectGroup();
        // animationObjectGroup.add(boxMesh);

        // 给mesh创建name
        boxMesh.name = 'box';
        // 创建 <位置> 动画轨道1
        const positionKT = new THREE.KeyframeTrack(
            'box.position',
            [0, 3, 6, 9],
            [0, 0, 0, 3, 0, 0, 3, 3, 0, 0, 3, 0],
            THREE.InterpolateSmooth
        );
        // 创建 <尺寸> 动画轨道2
        const scaleKT = new THREE.KeyframeTrack(
            'box.scale',
            [0, 3, 6, 9],
            [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2]
        );
        // 创建 <颜色> 动画轨道3
        const colorKT = new THREE.KeyframeTrack(
            'box.material.color',
            [0, 3, 6, 9],
            [1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0]
        );
        // 创建 <旋转> 动画轨道4
        const rotationY_KT = new THREE.KeyframeTrack(
            'box.rotation[y]',
            [0, 3, 6, 9],
            [0, Math.PI / 2, Math.PI, 0],
            THREE.InterpolateSmooth
        );

        // 创建关键动画帧animationClip  (test: 动画名称，9:动画持续时间，[positionKT,scaleKT,colorKT,rotationY_KT]动画轨道数组)
        const animationClips = new THREE.AnimationClip('test', 9, [
            positionKT,
            scaleKT,
            colorKT,
            rotationY_KT,
        ]);

        // 创建为boxMesh创建动画播放器
        const boxMixter = new THREE.AnimationMixer(boxMesh);

        // 通过动画播放器的.clipAction(animationClips)方法，创建动画行动，用来控制动画的播放、结束、暂停等效果。
        const boxAction = boxMixter.clipAction(animationClips);

        // // 动画停止在3秒的状态
        // boxAction.paused = true;
        // boxAction.time = 3;

        // // 动画停止在6秒状态
        // boxAction.time = 6;

        boxAction.paused = true;
        gui.add(boxAction, 'time', 0, 9).step(1);
        // 播放动画
        boxAction.play();
        // 需要配合动画requestAnimationFrame来实现动画运动

        // 渲染函数
        const clock = new THREE.Clock();
        function animation(t) {
            // 获得animation()两次执行时间间隔
            const time = clock.getDelta();
            // console.log(time);
            /*
                0.008799999997019768
                0.008600000001490115
                0.008699999995529652
                0.006800000004470348
                0.008799999997019768
                0.009800000004470349
            */
            // 更新播放器相关的时间
            boxMixter.update(time);

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
