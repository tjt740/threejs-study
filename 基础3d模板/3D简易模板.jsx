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

        // 创建CSM阴影类
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

        // 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // 基于灯光方向设置
        directionalLight.position.set(5, 7, 7);
        // directionalLight.position
        //     .set(-1, -1, -1)
        //     .normalize()
        //     .multiplyScalar(-100);
        scene.add(directionalLight);

        // 平灯光辅助线
        const directionalLightHelper = new THREE.DirectionalLightHelper(
            directionalLight,
            5
        );
        scene.add(directionalLightHelper);

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
        gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

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
            // mouse.x = (e.clientX / WIDTH) * 2 - 1;
            // mouse.y = -(e.clientY / HEIGHT) * 2 + 1;
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
        renderer.domElement.addEventListener('click', onClick);

        // 加载hdr文件
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(
            require('./christmas_photo_studio_04_2k.hdr'),
            (envMap) => {
                // 纹理材质映射方式折射
                envMap.mapping = THREE.EquirectangularRefractionMapping;
                // 设置场景背景
                scene.background = envMap;
                // 设置场景环境映射
                scene.environment = envMap;

                // 加载鸭子
                const gltfLoader = new GLTFLoader();
                gltfLoader
                    .loadAsync(require('./model/Duck.glb'))
                    .then((gltf) => {
                        const duck = gltf.scene;
                        // 获取鸭子模型
                        const duckMesh =
                            gltf.scene.getObjectByName('LOD3spShape');
                        // 获取原先鸭子的材质
                        const preDuckMaterial = duckMesh.material;

                        // 修改鸭子材质
                        duckMesh.material = new THREE.MeshPhongMaterial({
                            map: preDuckMaterial.map,
                            // 折射比率
                            refractionRatio: 0.7,
                            // 反射率
                            reflectivity: 0.99,
                        });
                        // 加载.hdr文件时赋值给duckMaterial中的环境贴图envMap
                        duckMesh.material.envMap = envMap;
                        // 将改过材质的鸭子添加入场景中
                        scene.add(duck);
                    });
            }
        );

        // 创建gltfloader
        const gltfLoader = new GLTFLoader();

        // 正常添加.glb文件
        // gltfLoader加载鸭子.glb模型
        gltfLoader.loadAsync(require('./model/Duck.glb')).then((gltf) => {
            // .glb文件加载完成后放出场景中
            scene.add(gltf.scene);
        });

        // 加载被压缩的.glb文件会报错，需要draco解码器
        const dracoLoader = new DRACOLoader();
        // 设置dracoLoader路径
        dracoLoader.setDecoderPath(
            'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
        );
        // 使用js方式解压
        dracoLoader.setDecoderConfig({ type: 'js' });
        // 初始化_initDecoder 解码器
        dracoLoader.preload();

        // 设置gltf加载器draco解码器
        gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.loadAsync(require('./model/city.glb')).then((gltf) => {
            console.log(gltf);
            scene.add(gltf.scene);
        });

        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function animation(t) {
            // 更新摄像机+CSM阴影方法
            camera.updateMatrixWorld();
            csm.update();

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
