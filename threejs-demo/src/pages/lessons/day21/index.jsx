import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';



export default function ThreeComponent() {
    const container = useRef(null);
    const gui = new dat.GUI();
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x444444);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 30);
        // camera.lookAt(scene.position);
        scene.add(camera);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer();

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

        // 创建纹理
        const textureLoader = new THREE.TextureLoader();
        const mapTexture = textureLoader.load(require('./texture/ca.jpeg'));

        // 创建平面几何体
        const planGeometry = new THREE.PlaneGeometry(20, 20, 64 ,64 );
       

        // 创建平面材质
        //🌟 改用原始着色器材质 （顶点着色器 + 片元着色器）
        const rawMaterial = new THREE.RawShaderMaterial({
            // 顶点着色器
            /*
            shader中有三种类型的变量: uniforms, attributes, 和 varyings
                ● Uniforms是所有顶点都具有相同的值的变量。 比如     <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标> 灯光，雾，和阴影贴图就是被储存在uniforms中的数据。 uniforms可以通过顶点着色器和片元着色器来访问。
                ● Attributes 与每个顶点关联的变量。例如，顶点位置，法线和顶点颜色都是存储在attributes中的数据。attributes 只 可以在顶点着色器中访问。
                ● Varyings 是从顶点着色器传递到片元着色器的变量。对于每一个片元，每一个varying的值将是相邻顶点值的平滑插值。
                注意：在shader 内部，uniforms和attributes就像常量；你只能使用JavaScript代码通过缓冲区来修改它们的值。
            
            */
            vertexShader: `   
                precision highp float;
                attribute vec3 position;
                // 顶点着色器 uv 传给片元着色器 step1
                attribute vec2 uv;

                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projectionMatrix;

                // 顶点着色器 uv 传给片元着色器 step2
                varying vec2 vUv;
                // highp  -2^16 - 2^16
                // mediump -2^10 - 2^10
                // lowp -2^8 - 2^8
                

                // 声明生成顶点着色器“高度” ，越近越亮
                varying float vElevation;

                // 获取时间
                uniform float uTime;
                
                void main(){
                    // 顶点着色器 uv 传给片元着色器 step3
                    vUv = uv; 

                  
                    // 声明 <模型矩阵>*<顶点坐标> 位置 (-0.5,0.5)
                    vec4  modelPosition  =  modelMatrix * vec4( position, 1.0 ); 
                    // 材质向x轴移动位置
                    // modelPosition.x += 1.0;
                    // 材质向z轴移动位置
                    // modelPosition.z += 1.0;

                    // 材质整体变宽
                    // modelPosition.x +=  modelPosition.x;
                    // 设置着色器变成波浪折角（电暖器形状） 取决于 PlaneGeometry 顶点数
                    modelPosition.z = sin((modelPosition.x + uTime) * 1.0)* 0.5;
                    modelPosition.z += sin((modelPosition.y + uTime) * 1.0)* 0.5;
                

                    // 变量 vElevation = modelPosition.z;
                    vElevation = modelPosition.z;

                  	// 使用 声明的 modelPosition   <模型矩阵>*<顶点坐标> 位置 (-0.5,0.5)
                    gl_Position = projectionMatrix * viewMatrix * modelPosition;
                }    
            `,
            
            // 片元着色器
            fragmentShader: `
                precision highp float;
                // 顶点着色器 uv 传给片元着色器 step4
                varying vec2 vUv;

                // 片元着色器 声明 vElevation，使用 顶点着色器声明的 vElevation；
                varying float vElevation;
                
                // 声明材质 uTexture
                uniform sampler2D uTexture;

                void main(){
                    // 顶点着色器 uv 传给片元着色器 step5
                    // gl_FragColor = vec4(vUv, 0.0, 1.0);

                    // 声明 “高度” 给颜色使用。因为事浮点数 所以用 float 。 基础数据类型：int、float、double、uint和bool。
                    // float vertexHeight =  vElevation * 0.1 * 10.0;
                    
                    // 使用顶点着色器改变片元着色器渲染
                    // gl_FragColor = vec4(vUv*vertexHeight , 0.0 , 1.0);

                    // 根据UV,取出对应的颜色
                    // float vertexHeight = vElevation + 0.05 * 20.0;
                    vec4 textureColor = texture2D(uTexture,vUv);
                    // textureColor.rgb*=vertexHeight;
                    gl_FragColor = textureColor;
                   
                }
            `,
            side: THREE.DoubleSide,
            // 材质里设置 uTime ，初始值为 0， 然后在render里设置value的值
            uniforms: {
                // 变量
                uTime: {
                    // 【固定】value
                    value:0
                },
                uTexture: {
                    value:mapTexture
                }
            }
        });

        // 构建平面几何体
        const planeCube = new THREE.Mesh(planGeometry, rawMaterial);
        // 将几何体添加到场景中
        scene.add(planeCube);

        /*
         * ------------end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;
        //  更新camera 投影矩阵
        camera.updateProjectionMatrix();

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            //2️⃣ 改变rawMaterial里的uTime
            rawMaterial.uniforms.uTime.value = time;

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
           原始着色器RawshaderMaterial纹理贴图Texture
            <div id="container" ref={container}></div>
        </>
    );
}
