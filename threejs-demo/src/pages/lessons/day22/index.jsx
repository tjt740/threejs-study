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

        // 创建平面几何体
        const planGeometry = new THREE.PlaneGeometry(20, 20, 64, 64);

        // 创建平面材质
        //🌟 改用原始着色器材质 （顶点着色器 + 片元着色器）
        const rawMaterial = new THREE.RawShaderMaterial({
            // 顶点着色器
            vertexShader: `   
                // 设置精度  
                // highp  -2^16 - 2^16
                // mediump -2^10 - 2^10
                // lowp -2^8 - 2^8
                precision highp float;
    
                // 顶点着色器 uv 传给片元着色器 step1（固有属性）
                attribute vec2 uv;
                // 顶点着色器 uv 传给片元着色器 step2
                varying vec2 vUv;

                attribute vec3 position;            
    
                uniform mat4 modelMatrix;
                uniform mat4 viewMatrix;
                uniform mat4 projectionMatrix;

                void main(){     
                    // 顶点着色器 uv 传给片元着色器 step3
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
      
                // 顶点着色器 uv 传给片元着色器 step4
                varying vec2 vUv;

                void main(){             
                    // 顶点着色器 uv 传给片元着色器 step5 
                    gl_FragColor =  vec4(vUv, 1.0, 1.0);
                    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
                    // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // 绿色
                    // gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // 黄色
                    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // 白色
                    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // 黑色

                    // 利用vUv实现x轴渐变 (从左向右)
                    gl_FragColor = vec4(vUv.x,vUv.x,vUv.x,1.0);

                    // 利用vUv实现x轴渐变 (从右向左)
                    gl_FragColor = vec4(1.0-vUv.x, 1.0-vUv.x, 1.0-vUv.x, 1.0);

                    // 利用vUv实现y轴渐变 (从下到上)
                    gl_FragColor = vec4(vUv.y,vUv.y,vUv.y,1.0);

                    // 利用vUv实现y轴渐变 (从上到下)
                    gl_FragColor = vec4(1.0-vUv.y*0.2, 1.0-vUv.y*0.5, vUv.y*0.74, 1.0);

                    // 利用GLSL内置函数
                    // 模等于
                    /* step1 声明变量 ， 
                        模等于 mod(x, y)， x:变量，y: 模等于参数，  
                        1.0 - vUv.y * 10.0：从上向下 
                        10.0 ：10条变化。
                    */
                    // float strength = mod( 1.0 - vUv.y * 10.0 , 1.0);
                    // step2 使用变量
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // step(edge, x) 判断，如果x < edge，返回0.0，否则返回1.0；
                    // 如果 mod( 1.0 - vUv.y * 10.0 , 1.0) < 0.5 就等于0.0 黑色，否则就是白色。 1.0 - vUv.y * 10.0： 从上到下， 10.0：10条
                    // float strength = step( 0.5 , mod( 1.0 - vUv.y * 10.0 , 1.0)); 
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 条纹相加
                    // float strength = step( 0.8 , mod( 1.0 - vUv.y * 10.0 , 1.0)); // 黑色从上到下
                    // strength +=  step( 0.8 , mod( vUv.x * 10.0 , 1.0));  // 黑色从左到右
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 条纹相减
                    // float strength = step( 0.8 , mod( 1.0 - vUv.y * 10.0 , 1.0)); // 黑色从上到下
                    // strength -=  step( 0.8 , mod( vUv.x * 10.0 , 1.0));  // 黑色从左到右
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 条纹相乘 
                    // float strength = step( 0.8 , mod( 1.0 - vUv.y * 10.0 , 1.0)); // 黑色从上到下
                    // strength *=  step( 0.8 , mod( vUv.x * 10.0 , 1.0));  // 黑色从左到右
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 
                    float barX = step(0.4,mod( vUv.x * 10.0 , 1.0)) * step( 0.8, mod(vUv.y * 10.0 ,1.0));
                    float barY = step(0.4,mod( vUv.y * 10.0 , 1.0)) * step( 0.8, mod(vUv.x * 10.0 ,1.0));
                    float strength  = barX + barY;
                    // gl_FragColor = vec4(strength,strength,strength, 1.0);
                    gl_FragColor = vec4(vUv,1.0,strength);

                }
            `,
            side: THREE.DoubleSide,
            transparent: true,
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
            使用内置glsl函数
            <div id="container" ref={container}></div>
        </>
    );
}
