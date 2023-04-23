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
        // scene.background = new THREE.Color(0x444444);
        scene.background = new THREE.Color(0x000000);
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

        // 创建平面几何体
        const planGeometry = new THREE.PlaneGeometry(20, 20, 64, 64);

        //1️⃣ 创建平面材质
        //🌟 改用原始着色器材质 （顶点着色器 + 片元着色器）
        const rawMaterial = new THREE.RawShaderMaterial({
            //2️⃣ 顶点着色器
            vertexShader: `   
                // 设置精度  
                // highp  -2^16 - 2^16
                // mediump -2^10 - 2^10
                // lowp -2^8 - 2^8
                precision highp float;
    
                //3️⃣ 顶点着色器 uv 传给片元着色器 step1（固有属性）
                attribute vec2 uv;
                //4️⃣ 顶点着色器 uv 传给片元着色器 step2
                varying vec2 vUv;

             

                attribute vec3 position;            
    
                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projectionMatrix;

                void main(){     
                    //5️⃣ 顶点着色器 uv 传给片元着色器 step3
                    vUv = uv; 
                    // 声明 <模型矩阵>*<顶点坐标> 位置 (-0.5,0.5)
                    vec4  modelPosition  =  modelMatrix * vec4( position, 1.0 ); 
        
                    gl_Position = projectionMatrix * viewMatrix * modelPosition;
                }    
            `,

            // 片元着色器
            fragmentShader: `
                // 设置精度  
                // highp  -2^16 - 2^16
                // mediump -2^10 - 2^10
                // lowp -2^8 - 2^8
                precision highp float;
      
                //6️⃣ 顶点着色器 uv 传给片元着色器 step4
                varying vec2 vUv;


                // 获取时间
                uniform float uTime; 


                //7️⃣ 旋转函数
                vec2 rotate(vec2 uv, float rotation, vec2 mid)
                {
                    return vec2(
                    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
                    );
                }
                

                void main(){             
                   
                    //8️⃣ 使用旋转函数 旋转星星 / 四角飞镖
                    // 3.1415926：因为没有Π，所以用3.1415926； 0.25：45度
                    // vec2 rotateUv = rotate(vUv,3.1415926*0.25,vec2(0.5));
                    vec2 rotateUv = rotate(vUv,uTime,vec2(0.5));
                    float barX = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y-0.5)*10.0 + 0.5),vec2(0.5,0.5))  ; 
                    float barY = 0.15 / distance(vec2((rotateUv.x-0.5)*10.0+0.5, rotateUv.y),vec2(0.5,0.5))  ; 
                    float strength =  (barX *5.0 )* (barY *5.0);
                    gl_FragColor = vec4(vec3(strength),strength);

                }
            `,
            side: THREE.DoubleSide,
            //🔟 设置材质透明
            transparent: true,
             //1️⃣1️⃣ 材质里设置 uTime ，初始值为 0， 然后在render里设置value的值
             uniforms: {
                //1️⃣2️⃣ 变量
                uTime: {
                    // 【固定】value
                    value:0
                },  
            }
        });

        // 构建平面几何体
        const planeCube = new THREE.Mesh(planGeometry, rawMaterial);
        // 将几何体添加到场景中
        scene.add(planeCube);

        
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
        //1️⃣4️⃣ 使用时钟
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            //1️⃣5️⃣ 获取秒数
            const time = clock.getElapsedTime();

            //1️⃣6️⃣ 改变rawMaterial里的uTime
            rawMaterial.uniforms.uTime.value = time;
        
        /*
         * ------------end ----------
         */

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
           原始着色器材质生成旋转星星
            <div id="container" ref={container}></div>
        </>
    );
}
