import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// 引入 ‘水模型’ 插件
import { Water } from 'three/examples/jsm/objects/Water2';

// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function WaterModel() {
    const container = useRef(null);
    const gui = new dat.GUI();

    const init = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        //  更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = window.innerWidth / window.innerHeight;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(3, 5, 7);
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
        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        gui.add(renderer, 'toneMappingExposure', 1, 5)
            .step(0.1)
            .onChange((e) => {
                renderer.toneMappingExposure = e;
            });

        /*
         * ------------ start ----------
         */

        // 光线
        const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
        scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        scene.add(directionalLight);

        // 加载场景背景
        const rgbeLoader = new RGBELoader();
        rgbeLoader.loadAsync(require('./assets/050.hdr')).then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.colorSpace = THREE.LinearSRGBColorSpace;
            scene.background = texture;
            scene.environment = texture;
        });

        // 水
        // 创建水面textureLoader
        const waterTextureLoader = new THREE.TextureLoader();
        // 水 options 参数
        const options = {
            color: '#ffffff', // 水面颜色
            scale: 1, // 水尺寸(影响水流速度)
            flowX: 1, // 水流方向z
            flowY: 1, // 水流方向y
            textureWidth: 1024, // 水体清晰度 W
            textureHeight: 1024, // 水体清晰度 H
            reflectivity: 0.01, // 水面反射率(越大越黑)
            normalMap0: waterTextureLoader.load(
                require('./textures/water/Water_1_M_Normal.jpg')
            ), // 水材质0 ⭐️ 非常重要 官方文档自带
            normalMap1: waterTextureLoader.load(
                require('./textures/water/Water_2_M_Normal.jpg')
            ), // 水材质1 ⭐️ 非常重要 官方文档自带
        };

        const gltfLoader = new GLTFLoader();
        gltfLoader.load(require('./assets/model/yugang.glb'), (gltf) => {
            console.log(gltf);
            // 池墙
            const pond = gltf.scene.children[0];
            // 双面展示
            pond.material.side = THREE.DoubleSide;
            pond.position.y = 0.5;

            // 创建水体平面
            const waterGeometry = gltf.scene.children[1].geometry;
            // 水构造器加载 <平面+设置>
            const water = new Water(waterGeometry, {
                color: options.color,
                scale: options.scale,
                // 水流方向 new THREE.Vector2(x,y);
                flowDirection: new THREE.Vector2(options.flowX, options.flowY),
                textureWidth: options.textureWidth,
                textureHeight: options.textureHeight,
                normalMap0: options.normalMap0,
                normalMap1: options.normalMap1,
            });

            water.position.y = 0.6;
            // water.rotation.x = -Math.PI / 2;

            scene.add(pond);
            scene.add(water);

            gui.width = 450;
            // 水面颜色更改
            gui.addColor(options, 'color')
                .onFinishChange((value) => {
                    water.material.uniforms.color.value = new THREE.Color(
                        value
                    );
                })
                .name('水面颜色更改');

            // 水流方向更改
            gui.add(options, 'flowX', -1, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['flowDirection'].value.x = value;
                    water.material.uniforms['flowDirection'].value.normalize();
                });
            gui.add(options, 'flowY', -1, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['flowDirection'].value.y = value;
                    water.material.uniforms['flowDirection'].value.normalize();
                });

            // 水流尺寸修改(影响水流速度)
            gui.add(options, 'scale', 1, 10)
                .step(1)
                .onChange(function (value) {
                    water.material.uniforms['config'].value.w = value;
                })
                .name('水流尺寸修改(影响水流速度)');

            // 水面反射率(越大越黑)
            gui.add(options, 'reflectivity', 0, 1)
                .step(0.01)
                .onChange(function (value) {
                    water.material.uniforms['reflectivity'].value = value;
                })
                .name('水面反射率');

            // 地板
            const ground = new THREE.PlaneGeometry(8, 8, 512, 512);
            const groundMesh = new THREE.Mesh(
                ground,
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(
                        require('./textures/ground.jpg')
                    ),
                    side: THREE.DoubleSide,
                })
            );
            groundMesh.rotation.x = Math.PI / 2;
            // scene.add(groundMesh);
        });

        /*
         * ------------ end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        controls.target = new THREE.Vector3(0, 0, 0);

        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

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
        init();
    }, []);

    return (
        <>
            <div id="container" ref={container}></div>
        </>
    );
}
