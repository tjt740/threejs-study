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

// 引入CSS2DRenderer、CSS2DObject 控制2D渲染组件包。
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/addons/renderers/CSS2DRenderer.js';

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
        // scene.background = new THREE.Color(0xd2d0d0);
        scene.background = new THREE.Color(0x000000);
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

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        // renderer.physicallyCorrectLights = true;

        /*
         * ------------ start ----------
         */
        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(1, 0, 7);
        scene.add(directionalLight);

        // 创建自然光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
        gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

        // 加载🌏地球
        const sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(
                require('./textures/planets/earth_atmos_4096.jpg')
            ),
            alphaMap: new THREE.TextureLoader().load(
                require('./textures/planets/earth_clouds_2048.png')
            ),
            normalMap: new THREE.TextureLoader().load(
                require('./textures/planets/earth_normal_2048.jpg')
            ),
            normalScale: new THREE.Vector2(0.85, 0.85),
            specularMap: new THREE.TextureLoader().load(
                require('./textures/planets/earth_specular_2048.jpg')
            ),
        });
        const earth = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(earth);

        // 1. 创建DOM标签
        const div = document.createElement('div');
        // 2. 给div增加classname
        div.className = 'earth-wrapper';
        // 3. 给div增加文字
        div.innerHTML = '地球🌏';
        // 4. 创建 CSS2DObject 对象，把div放入其中。
        const earth2D = new CSS2DObject(div);
        // 5. 设置 CSS2DObject 位置 (地球半径)
        earth2D.position.set(0, 15, 0);
        // 6. 将 CSS2DObject 添加到earth模型中
        earth.add(earth2D);

        // 7. 实例化CSS2DRenderer，模仿renderer塞入document.body中
        const css2DRenderer = new CSS2DRenderer();
        css2DRenderer.setSize(window.innerWidth, window.innerHeight);
        // 8. 因为使用了setSize，所以会跟renderer样式冲突，所以需要修改style。（因为设置了fixed，所以控制器没有效果）
        css2DRenderer.domElement.style.position = 'fixed';
        css2DRenderer.domElement.style.top = '0px';
        css2DRenderer.domElement.style.left = '0px';
        css2DRenderer.domElement.style.zIndex = '10';
        css2DRenderer.domElement.style.color = '#fff';
        // 9. 将实例化的CSS2DRenderer对象，塞入document.body中。
        document.body.appendChild(css2DRenderer.domElement);

        // 加载🌙月球
        const moonGeometry = new THREE.SphereGeometry(3, 32, 16);
        const moonMaterial = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(
                require('./textures/planets/moon_1024.jpg')
            ),
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        scene.add(moon);
        moon.position.set(20, 0, 0);

        // 轨道控制器
        const controls = new OrbitControls(camera, css2DRenderer.domElement);
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

            // 设置地球🌏自旋转
            earth.rotation.y = time * 0.1;
            // 设置月球🌙绕地球旋转
            moon.position.set(
                Math.sin(time * 0.5) * 20,
                0,
                Math.cos(time * 0.5) * 20
            );
            // 设置月球🌙自旋转
            moon.rotation.y = time * 1;

            // 8. css2DRenderer 渲染
            css2DRenderer.render(scene, camera);

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
