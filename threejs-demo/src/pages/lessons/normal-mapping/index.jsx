import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';

// 导入顶点法向量辅助器
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';

// import * as dat from 'dat.gui';
// const gui = new dat.GUI();
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
const gui = new GUI();

export default function NormalMappingComponent() {
    const container = useRef(null);
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x999999);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            50, // 90
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = window.innerWidth / window.innerHeight;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 20);
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

        // 创建平面几何
        const planeGeometry = new THREE.PlaneGeometry(10, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(require('./texture/uv.jpg')),
            side: THREE.DoubleSide,
        });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.position.x = -6;
        console.log(planeGeometry); // attributes.normal 有法向量
        scene.add(planeMesh);

        // 创建自定义几何平面
        const bufferGeometry = new THREE.BufferGeometry();
        console.log(bufferGeometry); // attributes?.normal = undefined 没有法向量
        const vertices = new Float32Array([
            0, 0, 0, 0, 10, 0, 10, 10, 0, 10, 0, 0,
        ]);
        // 根据一维坐标系，设置各点的位置 ,  itemSize = 3 因为每个顶点都是一个三元组。
        bufferGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        );

        const uvs = new Float32Array([
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            0, // 正面
        ]);
        // 根据一维坐标系，设置各点的位置 , itemSize = 2 因为每个顶点都是一个2元组。
        bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        // 创建索引
        const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
        // 创建索引属性
        bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // 计算出自定义几何体的顶点法向量
        // bufferGeometry.computeVertexNormals();
        const normals = new Float32Array([
            // 为什么是4个0,0,1， 因为平面的4个顶点，0,0 为x,y轴位置， 1 z轴朝向我们自己。
            0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        ]);
        // 设置normal属性，给bufferGemotry的 attributes属性
        bufferGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(normals, 3)
        );

        const bufferMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(require('./texture/uv.jpg')),
            side: THREE.DoubleSide,
        });

        const bufferMesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
        bufferMesh.position.y = -5;
        scene.add(bufferMesh);

        // 加载.hdr文件
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(require('./texture/bg.hdr'), (envMap) => {
            console.log(envMap);
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = envMap;
            // 该纹理贴图将会被设为场景中所有物理材质的环境贴图。
            scene.environment = envMap;
            // 设置plane的环境贴图
            planeMaterial.envMap = envMap;
            // 设置plane的环境贴图
            bufferMaterial.envMap = envMap;
        });

        // 创建法向量辅助器
        const helper = new VertexNormalsHelper(planeMesh, 4, 0xff0000);
        scene.add(helper);
        const helper2 = new VertexNormalsHelper(bufferMesh, 3, 0xfff000);
        scene.add(helper2);

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
            },
            ExitFullscreen: function () {
                // 退出全屏
                document.exitFullscreen();
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
