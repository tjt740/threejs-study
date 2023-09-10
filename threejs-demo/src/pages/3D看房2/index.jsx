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
// import * as dat from 'dat.gui';
// const gui = new dat.GUI();

// 创建地板、天花板
import RoomShapeMesh from './class/room-shape-mesh';
// 创建墙壁
import WallShapeMesh from './class/wall-shape-mesh';

const gui = new GUI();

export default function ThreeComponent() {
    const container = useRef(null);

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
            10000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 10, 20);
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
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
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

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);
        /*
         * ------------ start ----------
         */

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2.4, 5.3, 2);
        scene.add(directionalLight);

        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        ambientLight.position.set(5, 7, 7);
        scene.add(ambientLight);

        gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
        gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

        // 加载全景图
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            require('./textures/HdrSkyCloudy004_JPG_8K.jpg'),
            (texture) => {
                texture.mapping = THREE.EquirectangularRefractionMapping;
                scene.background = texture;
                scene.environment = texture;
            }
        );

        // 请求后端接口拿到渲染数据
        fetch(
            'https://test-1251830808.cos.ap-guangzhou.myqcloud.com/three_course/demo720.json'
        )
            .then((res) => res.json())
            .then((data) => {
                data = require('./data/response_data.json');

                console.log('data:', data);
                /*
                    cameraLocation: 摄像机位置
                    housePic: 房间布局图
                    objData: {
                        roomList: 房间平面图
                        walls: 墙壁
                    }
                    panoramaLocation: 全景坐标
                    segments: 
                    wallRelation: 墙壁关系
                */
                const {
                    cameraLocation,
                    housePic,
                    objData: { roomList, walls },
                    panoramaLocation,
                    segments,
                    wallRelation,
                } = data;

                // 创建平面图
                let _roomId = null;
                roomList.forEach((item, index) => {
                    const { areas, roomName, roomId } = item;
                    // _roomId = roomId;
                    /*
                        areas: 位置信息
                        roomName: 房间名称
                    */
                    // 创建房间平面
                    const roomMesh = new RoomShapeMesh(areas, roomName);
                    // 房间天花板
                    // const roomCeilingMesh = new RoomShapeMesh(areas, roomName);
                    // roomCeilingMesh.position.y = 2.8;
                    // 场景添加地平面+天花板
                    // scene.add(roomMesh, roomCeilingMesh);
                    scene.add(roomMesh);
                    // 根据房间平面id 去找全景坐标里对应的房间id
                    panoramaLocation.forEach((v) => {
                        if (v.roomId === roomId) {
                            const { point } = v;

                            const panoramaUrl = point[0].panoramaUrl;
                            // 因为平面坐标x,y,z 中 y和z是反的。所以 y和z调过来
                            const center = new THREE.Vector3(
                                point[0].x / 100,
                                point[0].z / 100,
                                point[0].y / 100
                            );

                            // 修改roomMesh、roomCeilingMesh 材质
                            // roomMesh.material =
                            // ./assets/f7984b17e4d962a6372bc3e40dbf86972509171113612625690.jpg; || "https://img.alicdn.com/imgextra/i4/O1CN01ILVf7M1z7XRpLAxl7_!!6000000006667-0-tps-7680-3840.jpg"

                            let material = WallShaderMaterial(
                                panoramaUrl,
                                center
                            );
                            roomMesh.material = material;

                            // roomCeilingMesh.material = WallShaderMaterial(
                            //     panoramaUrl,
                            //     center
                            // );

                            // 赋值material
                            v.material = material;
                        }
                    });
                });

                // 创建墙
                wallRelation.forEach((item, index) => {
                    const { faceRelation, wallPoints } = item;

                    // 根据id找到对应的全景贴图
                    const findPanorama = panoramaLocation.find((value) => {
                        return value.roomId === faceRelation[0].roomId;
                    });

                    const wallMesh = new WallShapeMesh(
                        wallPoints,
                        faceRelation,
                        findPanorama
                    );
                    scene.add(wallMesh);
                });
            });

        function WallShaderMaterial(panoramaUrl, center) {
            const panaramaTexture = new THREE.TextureLoader().load(panoramaUrl);
            panaramaTexture.flipY = false;
            panaramaTexture.wrapS = THREE.RepeatWrapping;
            panaramaTexture.wrapT = THREE.RepeatWrapping;
            panaramaTexture.magFilter = THREE.NearestFilter;
            panaramaTexture.minFilter = THREE.NearestFilter;

            return new THREE.ShaderMaterial({
                transparent: true,
                side: THREE.DoubleSide,
                vertexShader: /*glsl*/ `
                    varying vec2 v_uv;

                    // 声明position
                    varying vec3 v_position;
                    void main() {
                        v_uv = uv;
                        vec4 modelpos = modelMatrix * vec4(position, 1.0);
                        v_position = modelpos.xyz;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                    }

                `,
                fragmentShader: /*glsl*/ `
                    varying vec2 v_uv;
                     // 获取uniforms v_center;
                     uniform vec3 v_center;
                    // 获取到uniforms 图片纹理
                    uniform sampler2D v_panoramaSrc;
                    // 获取顶点着色器中v_position
                    varying vec3 v_position;
                    // 声明 π
                    const float PI = 3.14159265359;

                    void main() {

                    vec3 nPos = normalize(v_position - v_center);
                    float theta = acos(nPos.y)/PI;
                    float phi = 0.0;
                    phi = (atan(nPos.z, nPos.x)+PI)/(2.0*PI);
                    // phi += 0.75;
                    vec4 pColor = texture2D(v_panoramaSrc, vec2(phi, theta));

                    gl_FragColor = pColor;
                    if(nPos.z<0.003&&nPos.z>-0.003 && nPos.x<0.0){
                        phi = (atan(0.003, nPos.x)+PI)/(2.0*PI);
                        phi += 0.75;
                        gl_FragColor = texture2D(v_panoramaSrc, vec2(phi, theta));
                    }

                    }
                `,
                uniforms: {
                    v_panoramaSrc: {
                        value: panaramaTexture,
                    },
                    v_center: {
                        value: center,
                    },
                },
            });
        }

        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
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
            <div id="container" ref={container}></div>
        </>
    );
}
