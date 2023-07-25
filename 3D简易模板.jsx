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
        scene.background = new THREE.Color(0x999999);
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

        // const rgbeLoader = new RGBELoader();
        // rgbeLoader.loadAsync(require('./assets/050.hdr')).then((texture) => {
        //     texture.mapping = THREE.EquirectangularReflectionMapping;
        //     texture.colorSpace = THREE.LinearSRGBColorSpace;
        //     scene.background = texture;
        //     scene.environment = texture;
        // });

        // 设置灯光和阴影
        // 1. 设置自然光、<点光源>、<标准>网格材质（带PBR属性的都可以）  材质要满足能够对光照有反应
        // 2. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true;
        // 3. 设置光照能产生动态阴影  directionalLight.castShadow = true;
        // 4. 设置投射阴影的物体投射阴影 sphereGeometry.castShadow = true;
        // 5. 设置被投射的物体接收阴影  planGeometry.receiveShadow = true;

        // 创建 n 个矩形
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // 基础材质
        const material = new THREE.MeshBasicMaterial({
            wireframe: true,
        });
        // 被选中后的材质
        const selectMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xff0000),
            opacity: 0.1,
        });

        // 存储数据的数据
        const dataArr = [];
        for (let i = -3; i < 3; i++) {
            for (let j = -3; j < 3; j++) {
                for (let k = -3; k < 3; k++) {
                    const boxCube = new THREE.Mesh(boxGeometry, material);
                    boxCube.position.set(i, j, k);
                    scene.add(boxCube);
                    dataArr.push(boxCube);
                }
            }
        }

        // 创建射线
        const raycaster = new THREE.Raycaster();
        // 射线捕捉的最远距离,超过该距离后就不会捕捉对应的物体,默认Infinity(无穷远)
        // raycaster.far = 10;
        // 射线捕捉的最近距离,小于该距离就无法捕捉对应的物体. 不能为空,要不far小
        // raycaster.near = 3;
        // 创建鼠标点
        const mouse = new THREE.Vector2();
        // 监听鼠标位置
        function onClick(e) {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 —— 1)
            // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
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
            const intersects = raycaster.intersectObjects(dataArr);

            // 计算物体和射线的焦点
            if (intersects.length > 1) {
                // 获取第一个选中结果。
                const intersected = intersects[0].object;
                const findItem = dataArr.find(
                    (v) => v.uuid === intersected.uuid
                );
                console.log(findItem);
                findItem.material = selectMaterial;

                // 全部选中
                intersects.forEach((i) => (i.object.material = selectMaterial));
            }
        }

        // 全局添加点击事件
        window.addEventListener('click', onClick);
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
