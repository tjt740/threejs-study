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

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(
            require('./textures/particles/10.png')
        );
        const texture1 = textureLoader.load(
            require('./textures/particles/9.png')
        );
        const texture2 = textureLoader.load(
            require('./textures/particles/11.png')
        );

        let geometry = null;
        let points = null;

        // 设置星系的参数
        const params = {
            count: 1000,
            size: 0.1,
            radius: 5,
            branches: 4,
            spin: 0.5,
            color: '#ff6030',
            outColor: '#1b3984',
        };
        let galaxyColor = new THREE.Color(params.color);
        let outGalaxyColor = new THREE.Color(params.outColor);
        let material;

        const generateGalaxy = () => {
            // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
            if (points !== null) {
                geometry.dispose();
                material.dispose();
                scene.remove(points);
            }
            // 生成顶点几何
            geometry = new THREE.BufferGeometry();
            //   随机生成位置
            const positions = new Float32Array(params.count * 3);
            const colors = new Float32Array(params.count * 3);

            const scales = new Float32Array(params.count);

            //图案属性
            const imgIndex = new Float32Array(params.count);

            //   循环生成点
            for (let i = 0; i < params.count; i++) {
                const current = i * 3;

                // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
                const branchAngel =
                    (i % params.branches) * ((2 * Math.PI) / params.branches);

                const radius = Math.random() * params.radius;
                // 距离圆心越远，旋转的度数就越大
                // const spinAngle = radius * params.spin;

                // 随机设置x/y/z偏移值
                const randomX =
                    Math.pow(Math.random() * 2 - 1, 3) *
                    0.5 *
                    (params.radius - radius) *
                    0.3;
                const randomY =
                    Math.pow(Math.random() * 2 - 1, 3) *
                    0.5 *
                    (params.radius - radius) *
                    0.3;
                const randomZ =
                    Math.pow(Math.random() * 2 - 1, 3) *
                    0.5 *
                    (params.radius - radius) *
                    0.3;

                // 设置当前点x值坐标
                positions[current] = Math.cos(branchAngel) * radius + randomX;
                // 设置当前点y值坐标
                positions[current + 1] = randomY;
                // 设置当前点z值坐标
                positions[current + 2] =
                    Math.sin(branchAngel) * radius + randomZ;

                const mixColor = galaxyColor.clone();
                mixColor.lerp(outGalaxyColor, radius / params.radius);

                //   设置颜色
                colors[current] = mixColor.r;
                colors[current + 1] = mixColor.g;
                colors[current + 2] = mixColor.b;

                // 顶点的大小
                scales[current] = Math.random();

                // 根据索引值设置不同的图案；
                imgIndex[current] = i % 3;
            }
            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
            geometry.setAttribute(
                'color',
                new THREE.BufferAttribute(colors, 3)
            );
            geometry.setAttribute(
                'aScale',
                new THREE.BufferAttribute(scales, 1)
            );
            geometry.setAttribute(
                'imgIndex',
                new THREE.BufferAttribute(imgIndex, 1)
            );

            //   设置点的着色器材质
            material = new THREE.ShaderMaterial({
                vertexShader: /*glsl*/ `
      
varying vec2 vUv;

attribute float imgIndex;
attribute float aScale;
varying float vImgIndex;

uniform float uTime;

varying vec3 vColor;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    

    // 获取定点的角度
    float angle = atan(modelPosition.x,modelPosition.z);
    // 获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 根据顶点到中心的距离，设置旋转偏移度数
    float angleOffset = 1.0/distanceToCenter*uTime;
    // 目前旋转的度数
    angle+=angleOffset;

    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.z = sin(angle)*distanceToCenter;

    vec4 viewPosition = viewMatrix*modelPosition;
    gl_Position =  projectionMatrix * viewPosition;

    // 设置点的大小
    // gl_PointSize = 100.0;
    // 根据viewPosition的z坐标决定是否原理摄像机
    gl_PointSize =200.0/-viewPosition.z*aScale;
    vUv = uv;
    vImgIndex=imgIndex;
    vColor = color;
}
      `,
                fragmentShader: /*glsl*/ `
      

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
varying float vImgIndex;
varying vec3 vColor;
void main(){
    
    // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

    // 设置渐变圆
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // strength*=2.0;
    // strength = 1.0-strength;
    // gl_FragColor = vec4(strength);

    // 圆形点
    // float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength);

    // 根据纹理设置图案
    // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
    // gl_FragColor = vec4(textureColor.rgb,textureColor.r) ;
    vec4 textureColor;
    if(vImgIndex==0.0){
       textureColor = texture2D(uTexture,gl_PointCoord);
    }else if(vImgIndex==1.0){
       textureColor = texture2D(uTexture1,gl_PointCoord);
    }else{
       textureColor = texture2D(uTexture2,gl_PointCoord);
    }
    

    gl_FragColor = vec4(vColor,textureColor.r) ;
    

}
      `,

                transparent: true,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                uniforms: {
                    uTime: {
                        value: 0,
                    },
                    uTexture: {
                        value: texture,
                    },
                    uTexture1: {
                        value: texture1,
                    },
                    uTexture2: {
                        value: texture2,
                    },
                    uTime: {
                        value: 0,
                    },
                    uColor: {
                        value: galaxyColor,
                    },
                },
            });

            //   生成点
            points = new THREE.Points(geometry, material);
            scene.add(points);
            console.log(points);
            //   console.log(123);
        };
        generateGalaxy();

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
