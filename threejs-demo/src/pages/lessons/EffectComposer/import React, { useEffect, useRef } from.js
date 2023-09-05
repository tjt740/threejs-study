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

// 导入后期效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// 导入渲染通道，用来进行后期特效加载排序
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// three框架本身自带效果。其他效果路径： /node_modules/three/examples/jsm/postprocessing/xxx.js
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

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

        // 创建平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2.4, 5.3, 2);
        scene.add(directionalLight);

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({})
        );
        box.position.copy(directionalLight.position);
        scene.add(box);
        // 加载cubeTextureLoader
        const loader = new THREE.CubeTextureLoader();
        const cubeTexture = loader.load([
            require('./textures/environmentMaps/3/px.jpg'),
            require('./textures/environmentMaps/3/nx.jpg'),
            require('./textures/environmentMaps/3/py.jpg'),
            require('./textures/environmentMaps/3/ny.jpg'),
            require('./textures/environmentMaps/3/pz.jpg'),
            require('./textures/environmentMaps/3/nx.jpg'),
        ]);
        scene.environment = cubeTexture;
        scene.background = cubeTexture;

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
            });

        // 合成效果
        const effectComposer = new EffectComposer(renderer);
        effectComposer.setSize(window.innerWidth, window.innerHeight);

        // 添加渲染通道
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);

        // // 自定义渲染管道1
        // const customPass = new ShaderPass({
        //     // 顶点着色器
        //     vertexShader: /*glsl*/ `
        //         void main(){
        //             gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        //         }
        //     `,
        //     // 片元着色器
        //     fragmentShader: /*glsl*/ `
        //         void main(){
        //             gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        //         }
        //     `,
        // });
        // effectComposer.addPass(customPass);

        // 自定义渲染管道2

        // const customPass = new ShaderPass({
        //     // 顶点着色器
        //     vertexShader: /*glsl*/ `
        //     varying vec2 vUv;
        //         void main(){
        //         vUv = uv;
        //             gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        //         }
        //     `,
        //             // 片元着色器
        //             fragmentShader: /*glsl*/ `
        //     varying vec2 vUv;
        //         void main(){
        //             gl_FragColor = vec4(vUv,0.0,1.0);
        //         }
        //     `,
        // });
        // effectComposer.addPass(customPass);

        // const colorParams = {
        //     r: 0,
        //     g: 0,
        //     b: 0,
        // };

        // // 着色器写渲染通道
        // const customPass = new ShaderPass({
        //     uniforms: {
        //         tDiffuse: {
        //             value: null,
        //         },
        //         uColor: {
        //             value: new THREE.Color(
        //                 colorParams.r,
        //                 colorParams.g,
        //                 colorParams.b
        //             ),
        //         },
        //     },
        //     vertexShader: `
        //         varying vec2 vUv;
        //         void main(){
        //           vUv = uv;
        //           gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        //         }
        //       `,
        //     fragmentShader: `
        //         varying vec2 vUv;
        //         uniform sampler2D tDiffuse;
        //         uniform vec3 uColor;
        //         void main(){
        //           vec4 color = texture2D(tDiffuse,vUv);
        //           color.xyz+=uColor;
        //           gl_FragColor = color;
        //         }
        //       `,
        // });
        // effectComposer.addPass(customPass);

        // gui.add(colorParams, 'r')
        //     .min(-1)
        //     .max(1)
        //     .step(0.01)
        //     .onChange((value) => {
        //         customPass.uniforms.uColor.value.r = value;
        //     });
        // gui.add(colorParams, 'g')
        //     .min(-1)
        //     .max(1)
        //     .step(0.01)
        //     .onChange((value) => {
        //         customPass.uniforms.uColor.value.g = value;
        //     });
        // gui.add(colorParams, 'b')
        //     .min(-1)
        //     .max(1)
        //     .step(0.01)
        //     .onChange((value) => {
        //         customPass.uniforms.uColor.value.b = value;
        //     });

        const customPass = new ShaderPass({
            // 定义uniforms
            uniforms: {
                tDiffuse: {
                    value: null,
                },
                u_normalMap: {
                    value: null,
                },
                u_time: {
                    value: 0,
                },
            },
            vertexShader: `
                varying vec2 vUv;
                void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
                }
              `,
            fragmentShader: /*glsl*/ `
                  varying vec2 vUv;
                  uniform sampler2D tDiffuse;
                  // 获取定义的uniforms u_normalMap
                  uniform sampler2D u_normalMap;
                  uniform float u_time;

                  void main(){
                    vec2 newUv = vUv;
                    newUv += sin(newUv.x*10.0+u_time*0.5)*0.03;
                    vec4 color = texture2D(tDiffuse,newUv);
                      // 定义法向颜色
                      vec4 normalColor = texture2D(u_normalMap,vUv);

                      // 设置光线角度 (x,y,z)
                      vec3 lightDirection = normalize(vec3(-5,5,-2));
                      // 设置光线亮度
                      float lightness = clamp(dot(normalColor.xyz,lightDirection),0.0,1.0);
                      color.xyz+=lightness;
                      gl_FragColor = color;
                  }
              `,
        });
        // 设置uniforms中的u_normalMap的值为纹理材质
        customPass.material.uniforms.u_normalMap.value =
            new THREE.TextureLoader().load(
                require('./textures/interfaceNormalMap.png')
            );

        // 添加自定义渲染管道
        effectComposer.addPass(customPass);

        /*
         * ------------end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            customPass.material.uniforms.u_time.value = time;
            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

            // 最后，想要成功的完成这种效果，你需要在主函数中调用 TWEEN.update()
            // TWEEN.update();
            effectComposer.render();
            // renderer.render(scene, camera);
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
