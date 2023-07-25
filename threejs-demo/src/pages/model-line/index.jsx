import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 引入补间动画tween.js three.js 自带
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
const gui = new GUI();

export default function ThreeComponent() {
    const container = useRef(null);
    const init = async () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0x999999);
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
        camera.position.set(0, 20, 80);
        // 更新camera 视角方向
        // camera.lookAt(scene.position);

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
        renderer.toneMapping = THREE.ReinhardToneMapping;
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

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 4.6);
        directionalLight.position.set(5, 7, 7);
        scene.add(directionalLight);
        // 创建自然光
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10);
        gui.add(ambientLight, 'intensity', 0, 10);

        // 创建模型加载器
        const gltfLoader = new GLTFLoader();
        // 创建draco加载器
        const dracoLoader = new DRACOLoader();
        // 设置dracoLoader路径
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        // 使用js方式解压
        dracoLoader.setDecoderConfig({ type: 'js' });
        // 初始化_initDecoder 解码器
        dracoLoader.preload();

        // 设置gltf加载器dracoLoader解码器
        gltfLoader.setDRACOLoader(dracoLoader);
        // 加载 房子.glb
        gltfLoader.loadAsync(require('./model/building.glb')).then((gltf) => {
            const buildingMesh = gltf.scene.getObjectByName('Plane045');
            const buildingGeometry = buildingMesh.geometry;
            console.log(buildingMesh);
            // 调整楼房位置、角度
            buildingMesh.position.set(0, 0, 0);
            buildingMesh.rotateY(-Math.PI);
            scene.add(buildingMesh);

            // 创建网格几何体
            const wireframeGeometry = new THREE.WireframeGeometry(
                buildingGeometry
            );
            const line = new THREE.LineSegments(wireframeGeometry);
            line.material.depthTest = false;
            line.material.opacity = 1;
            line.material.color = new THREE.Color(0x000000);
            line.material.transparent = true;
            line.position.set(20, 0, 0);
            line.rotateY(-Math.PI / 2);
            scene.add(line);

            // 创建边缘几何体
            const edgesGeometry = new THREE.EdgesGeometry(buildingGeometry);
            const edgesLine = new THREE.LineSegments(
                edgesGeometry,
                new THREE.LineBasicMaterial({ color: 0xffffff })
            );

            // 更新建筑物世界转换矩阵 （保持跟楼房主体大小，位置，顶点位置一致）
            buildingMesh.updateWorldMatrix(true, true);
            edgesLine.matrix.copy(buildingMesh.matrixWorld);
            edgesLine.matrix.decompose(
                edgesLine.position,
                edgesLine.quaternion,
                edgesLine.scale
            );
            // edgesLine.position.set(-20, 0, 0);
            // edgesLine.rotateY(-Math.PI / 2);
            scene.add(edgesLine);
        });

        // 加载城市
        gltfLoader.loadAsync(require('./model/city.glb')).then((gltf) => {
            console.log(gltf);
            // 使用Object3D中的traverse方法，获取到 gltf.scene 中所有的子级模型
            gltf.scene.traverse((child) => {
                // 是否是模型
                if (child.isMesh) {
                    // 类似for循环中 i ，child等于gltf.scene[i] 的模型Mesh。
                    const childMesh = child;
                    // 获取几何体
                    const childGeometry = childMesh.geometry;

                    // 创建边缘几何体 EdgesGeometry
                    const edgesGeometry = new THREE.EdgesGeometry(
                        childGeometry
                    );
                    // 创建几何体线段 LineSegments
                    const edgesLine = new THREE.LineSegments(
                        edgesGeometry,
                        new THREE.LineBasicMaterial({ color: 0xffffff })
                    );
                    // 更新建筑物世界转换矩阵，（保持跟模型 主体大小，位置，顶点位置一致）
                    childMesh.updateWorldMatrix(true, true);
                    edgesLine.matrix.copy(childMesh.matrixWorld);
                    edgesLine.matrix.decompose(
                        edgesLine.position,
                        edgesLine.quaternion,
                        edgesLine.scale
                    );

                    // 场景中添加边缘几何体
                    scene.add(edgesLine);
                }
            });
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
        controls.target = new THREE.Vector3(0, 0, 0);

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