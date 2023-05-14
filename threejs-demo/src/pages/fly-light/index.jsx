import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

//1️⃣ 导入rgbe/hdr二进制格式文件加载器
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
//2️⃣ 导入GLTFLoader，用以JSON（.gltf）格式或二进制（.glb）格式的3D文件渲染
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function ThreeComponent() {
    const container = useRef(null);
    const gui = new dat.GUI();
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0x444444);
        // scene.background = new THREE.Color(0x000000);
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
        
        // camera.lookAt(scene.position);

        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 50);
        // 摄像机添加到场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        /*
         * ------------ start ----------
         */
        //7️⃣ 创建原始着色器材质
        const rawMaterial = new THREE.RawShaderMaterial({
            // 顶点着色器
            vertexShader: `
                precision highp float;
                // 顶点着色器 uv 传给片元着色器 step1
                attribute vec2 uv;

                // 顶点着色器 uv 传给片元着色器 step2
                varying vec2 vUv;

                attribute vec3 position;
                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projectionMatrix;

                varying vec4 vPosition;
                varying vec4 gPosition;

                void main(){
                    // 顶点着色器 uv 传给片元着色器 step3
                    vUv = uv;

                    vec4  modelPosition  =  modelMatrix * vec4( position, 1.0 ); 
                    
                    vPosition = modelPosition;
                    gPosition = vec4(position,1.0);


                    gl_Position = projectionMatrix * viewMatrix *  modelPosition;
                }
            `,
            // 片元着色器
            fragmentShader: `
            precision highp float;
            // 顶点着色器 uv 传给片元着色器 step4


            varying vec2 vUv;
            varying float vElevation;

            varying vec4 vPosition;
            varying vec4 gPosition;

            void main(){
                vec4 redColor = vec4(1,0,0,1);
                vec4 yellowColor = vec4(1, 1, 0.5,1);
                vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);

                // ⭐️ 一定要去除 ‘transparent: true,’
                // 外部
                if(gl_FrontFacing){
                    gl_FragColor = vec4(mixColor.xyz,1);
                // 内部
                }else{
                    gl_FragColor = vec4(mixColor.xyz,0.75);
                }

                // // 顶点着色器 uv 传给片元着色器 step5
                // // gl_FragColor = vec4(vUv, 0.0, 1.0);
            }
            `,
            // transparent: true,
            side: THREE.DoubleSide,
        });

        // 创建加载器管理器
        const loadManager = new THREE.LoadingManager(
            // onLoad
            () => {
                console.log('纹理加载结束！');
            },
            // onProgress
            (url, progress, total) => {
                console.log('纹理url:', url);
            },
            // onError
            () => {
                console.log('纹理加载失败');
            }
        );

        //2️⃣ 导入hdr图像加载器
        const rgbeLoader = new RGBELoader(loadManager);
        //3️⃣ 资源较大，使用异步加载 <异步加载>
        rgbeLoader
            .loadAsync(require('./assets/texture/scythian_tombs_2k.hdr'))
            .then((texture) => {
                console.log('加载hdr图片成功');
                texture.mapping = THREE.EquirectangularRefractionMapping;
                // 将加载的材质texture设置给背景和环境
                scene.background = texture;
                scene.environment = texture;
            });

        //4️⃣ 加载.glb文件
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            require('./assets/model/flyLight.glb'),
            // onLoad
            (gltf) => {
                console.log('gltf文件:', gltf);
                console.log('.glb文件加载成功!');

                const glbScene = gltf.scene;
                //5️⃣ 获取灯罩3D模型
                const flyLightBox = glbScene.children[1];
                //6️⃣ 给3D灯罩材质赋值颜色
                // flyLightBox.material = new THREE.MeshBasicMaterial({
                //     color: 0xfff312,
                // });
                flyLightBox.material = rawMaterial;
                //8️⃣ 将.glb blend文件加载进场景中

                scene.add(glbScene);

                const glpGroup = new THREE.Group();
                
                for (let i = 0; i < 10; i++) {
                    // 拷贝glbScene
                    const cloneGlbScene = glbScene.clone(true);
                    // 设置随机的xyz位置
                    const x = (Math.random() - 0.5) * 70;
                    const y = Math.random() * 50 + 5;
                    const z = (Math.random() - 0.5) * 50;
                
                    cloneGlbScene.position.set(x,y,z);
                
                    glpGroup.add(cloneGlbScene);
                }

                glpGroup.add(glbScene);
                
                scene.add(glpGroup);
            },
            // onProgress
            () => {
                console.log('加载中...');
            },
            // onError
            (err) => {
                console.log('加载失败');
            }
        );

        /*
         * ------------end ----------
         */

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer();
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

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

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

        // 渲染
        render();

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

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            {/* 孔明灯-原始着色器 */}
            <div id="container" ref={container}></div>
        </>
    );
}
