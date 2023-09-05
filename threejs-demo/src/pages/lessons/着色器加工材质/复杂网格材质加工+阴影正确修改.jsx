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
        camera.position.set(0, 0, 20);
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

        /*
         * ------------ start ----------
         */
        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.28);
        directionalLight.position.set(0, 0, 4.5);
        scene.add(directionalLight);
        directionalLight.castShadow = true;

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({})
        );
        box.position.copy(directionalLight.position);
        scene.add(box);

        gui.add(directionalLight.position, 'x', 0, 10, 0.1)
            .onChange((v) => (box.position.x = v))
            .name('平行光x位置');
        gui.add(directionalLight.position, 'y', 0, 10, 0.1)
            .onChange((v) => (box.position.y = v))
            .name('平行光y位置');
        gui.add(directionalLight.position, 'z', 0, 10, 0.1)
            .onChange((v) => (box.position.z = v))
            .name('平行光z位置');

        // 创建自然光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        // 加载正cubeTextureLoader
        // 初始化cubeTextureLoader 立方体纹理加载器
        const loader = new THREE.CubeTextureLoader();
        // 加载CubeTexture的一个类。 内部使用ImageLoader来加载文件。
        const cubeTexture = loader.load([
            require('./textures/environmentMaps/2/px.jpg'),
            require('./textures/environmentMaps/2/nx.jpg'),
            require('./textures/environmentMaps/2/py.jpg'),
            require('./textures/environmentMaps/2/ny.jpg'),
            require('./textures/environmentMaps/2/pz.jpg'),
            require('./textures/environmentMaps/2/nx.jpg'),
        ]);
        scene.envmap = cubeTexture;
        scene.background = cubeTexture;

        // 创建uniforms u_time;
        const uniforms = {
            u_time: {
                value: 0,
            },
        };

        // 自定义深度网格材质
        const customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
        });

        customDepthMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.u_time = uniforms.u_time;
            shader.vertexShader = shader.vertexShader.replace(
                `#include <common>`,
                `
                #include <common>
                uniform float u_time;
                mat2 rotate2d(float _angle){
                return mat2(cos(_angle),-sin(_angle),
                            sin(_angle),cos(_angle));
                }

                `
            );

            shader.vertexShader = shader.vertexShader.replace(
                `#include <begin_vertex>`,
                `
                #include <begin_vertex>
                // 绕Y轴旋转角度
                float angle = sin(transformed.y + u_time) * 0.5;
                mat2 rotateMatrix = rotate2d(angle);
                transformed.xz = rotateMatrix * transformed.xz;

                `
            );
        };

        // 加载模型
        const gltfLoader = new GLTFLoader();
        gltfLoader
            .loadAsync(require('./models/LeePerrySmith/LeePerrySmith.glb'))
            .then((gltf) => {
                scene.add(gltf.scene);
                // 修改模型材质
                const mesh = gltf.scene.getObjectByName('LeePerrySmith');
                // 投射阴影
                mesh.castShadow = true;
                const material = mesh.material;

                material.map = new THREE.TextureLoader().load(
                    require('./models/LeePerrySmith/color.jpg')
                );
                material.normalMap = new THREE.TextureLoader().load(
                    require('./models/LeePerrySmith/normal.jpg')
                );

                // 修改标准网格材质的shader
                material.onBeforeCompile = (shader) => {
                    console.log('顶点着色器:', shader.vertexShader);
                    console.log('片元着色器:', shader.fragmentShader);

                    shader.uniforms.u_time = uniforms.u_time;

                    // 修改顶点着色，增加旋转效果 见shader.book
                    shader.vertexShader = shader.vertexShader.replace(
                        `#include <common>`,
                        `
                        #include <common>
                        uniform float u_time;

                        mat2 rotate2d(float _angle){
                        return mat2(cos(_angle),-sin(_angle),
                                    sin(_angle),cos(_angle));
                        }

                        `
                    );

                    shader.vertexShader = shader.vertexShader.replace(
                        `#include <begin_vertex>`,
                        `
                        #include <begin_vertex>
                        // 绕Y轴旋转角度
                        float angle = sin(transformed.y+u_time) * 0.5;
                        mat2 rotateMatrix = rotate2d(angle);
                        transformed.xz = rotateMatrix * transformed.xz;

                        `
                    );

                    // 因为增加了normalMap和阴影，所以需要修改法向顶点位置
                    shader.vertexShader = shader.vertexShader.replace(
                        `
                        #include <beginnormal_vertex>
                    `,
                        `
                        #include <beginnormal_vertex>
                        // 绕Y轴旋转角度
                        float angle = sin(objectNormal.y+u_time) * 0.5;
                        mat2 rotateMatrix = rotate2d(angle);
                        objectNormal.xz = rotateMatrix * objectNormal.xz;
                    `
                    );
                };

                // 设置正确的投影效果
                mesh.customDepthMaterial = customDepthMaterial;
            });

        // 添加背景板
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial()
        );

        plane.position.set(0, 0, -6);
        // 接收阴影映射
        plane.receiveShadow = true;
        scene.add(plane);

        /*
         * ------------end ----------
         */

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

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            uniforms.u_time.value = time;
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
