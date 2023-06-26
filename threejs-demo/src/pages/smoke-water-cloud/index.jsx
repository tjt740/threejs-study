import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

export default function SmokeWaterCloud() {
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
        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        /*
         * ------------ start ----------
         */

        // 着色器材质
        // 顶点着色器
        const vertexShader = /* glsl */ `
            precision highp float;

            // 获取uniform 中的变量
            uniform float uWaresFrequency;
            uniform float uScale;

            // 声明生成顶点着色器“高度”，越近越亮。
            varying float vElevation;

            // 获取时间
            uniform float uTime;
            // 获取噪声频率
            uniform float uNoiseFrequency;
            // 获取噪声速度
            uniform float uNoiseSpeed;



            // 随机数
            float random (vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            // 噪声
            float noise (in vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
            
                // Four corners in 2D of a tile
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
            
                // Smooth Interpolation
            
                // Cubic Hermine Curve.  Same as SmoothStep()
                vec2 u = f*f*(3.0-2.0*f);
                // u = smoothstep(0.,1.,f);
            
                // Mix 4 coorners percentages
                return mix(a, b, u.x) +
                        (c - a)* u.y * (1.0 - u.x) +
                        (d - b) * u.x * u.y;
            }
                

 
            void main(){
                vec4  modelPosition  =  modelMatrix * vec4( position, 1.0 );
                
                // 设置波纹,uWaresFrequency、uScale 来自【uniforms】,改变波浪方向+大小;
                // float elevation = sin(modelPosition.x * 3.0);
                float elevation = sin(modelPosition.x * uWaresFrequency) * sin(modelPosition.z * uWaresFrequency) * uScale;
                
                // 配个noise实现水平杂乱波动
                // elevation += noise(vec2(modelPosition.x, modelPosition.z )) ;

                // 配合<绝对值>函数+时间+速度 实现 水波纹动态效果
                elevation += -abs(noise(vec2(modelPosition.x + uTime * uNoiseFrequency* uNoiseSpeed , modelPosition.z + uTime * uNoiseFrequency * uNoiseSpeed)));

                // 高低起伏
                modelPosition.y += elevation;

                vElevation = elevation;

                gl_Position = projectionMatrix * viewMatrix *  modelPosition;
            }    
        `;
        // 片元着色器
        const fragmentShader = /* glsl */ `
            precision highp float;
            
            // 片元着色器 声明 vElevation,使用 “顶点着色器”声明的 vElevation;
            varying float vElevation;
            
            uniform vec3 uHighColor;
            uniform vec3 uLowColor;

            void main(){
                
                float a = (vElevation + 1.0) / 2.0;

                // gl_FragColor = vec4(0.0 * a , 1.0 , 1.0 , a); // rgba 红黄蓝,需要设置transparent:true;

                gl_FragColor = vec4(mix(uLowColor, uHighColor, a), 1.0); // rgba 红黄蓝,需要设置transparent:true;
            }
        `;

        // params 参数
        const params = {
            uWaresFrequency: 4, // 波浪数
            uScale: 0.3, // 波浪高度
            uNoiseFrequency: 0.5, // 噪声频率
            uTime: 1.0, // 时间
            uNoiseSpeed: 1.0, // 噪声速度
            uLowColor: '#2f88db',
            uHighColor: '#ffffff',
        };

        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,

            // 通过uniforms添加参数,在顶点着色器中获取
            uniforms: {
                // 时间
                uTime: {
                    value: params.uTime,
                },
                // 噪音频率
                uNoiseFrequency: {
                    value: params.uNoiseFrequency,
                },
                // 噪声速度
                uNoiseSpeed: {
                    value: params.uNoiseSpeed,
                },
                // 高位颜色
                uLowColor: {
                    value: new THREE.Color(params.uLowColor),
                },
                uHighColor: {
                    value: new THREE.Color(params.uHighColor),
                },
                // 低位颜色

                uWaresFrequency: {
                    value: params.uWaresFrequency,
                },
                uScale: {
                    value: params.uScale,
                },
            },

            // 允许透明
            transparent: true,
        });

        gui.addColor(params, 'uLowColor')
            .onFinishChange((value) => {
                shaderMaterial.uniforms.uLowColor.value = new THREE.Color(
                    value
                );
            })
            .name('改变云层颜色uLowColor');

        gui.addColor(params, 'uHighColor')
            .onFinishChange((value) => {
                shaderMaterial.uniforms.uHighColor.value = new THREE.Color(
                    value
                );
            })
            .name('改变云层颜色uHighColor');

        // 增加调试uWaresFrequency、uScale功能
        gui.add(params, 'uWaresFrequency')
            .min(1)
            .max(10)
            .step(1)
            .onChange((value) => {
                shaderMaterial.uniforms.uWaresFrequency.value = value;
            })
            .name('改变波浪条数');

        gui.add(params, 'uScale')
            .min(0.1)
            .max(1)
            .step(0.1)
            .onChange((value) => {
                shaderMaterial.uniforms.uScale.value = value;
            })
            .name('改变波浪大小');

        gui.add(params, 'uNoiseFrequency')
            .min(0.1)
            .max(5)
            .step(0.1)
            .onChange((value) => {
                shaderMaterial.uniforms.uNoiseFrequency.value = value;
            })
            .name('改变噪音频率');

        gui.add(params, 'uNoiseSpeed')
            .min(1)
            .max(10)
            .step(0.5)
            .onChange((value) => {
                shaderMaterial.uniforms.uNoiseSpeed.value = value;
            })
            .name('改变噪音速度');

        // 生成平面
        const planeGeo = new THREE.PlaneGeometry(5, 5, 512, 512);

        const planeMesh = new THREE.Mesh(planeGeo, shaderMaterial);
        planeMesh.rotation.x = -Math.PI / 2;
        scene.add(planeMesh);

        /*
         * ------------ end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            // 设置时间变量，uTime随时间变化
            shaderMaterial.uniforms.uTime.value = time;

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
