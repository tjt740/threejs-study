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

                #define PI 3.1415926535897932384626433832795


                // 获取时间
                uniform float uTime; 

                // 随机数
                uniform vec2 u_resolution;
                float random (vec2 st) {
                    return fract(sin(dot(st.xy,
                                         vec2(12.9898,78.233)))*
                        43758.5453123);
                }

                // 旋转函数
                vec2 rotate(vec2 uv, float rotation, vec2 mid)
                {
                    return vec2(
                    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
                    );
                }
                

                void main(){             
                    // 顶点着色器 uv 传给片元着色器 step5 
                    // abs(x) 绝对值
                    // float strength  =abs(vUv.x - 0.5); // 0.5 0.3 0.2 0.0 0.25 0.5...
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 取两个值中的最小值
                    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 取两个值中的最大值
                    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 配合 step 使用 （外白内黑 相框）
                    // float strength = step(0.4,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // 配合 step 使用  （外黑内白 相框）
                    // float strength = 1.0-step(0.4,max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
                    // gl_FragColor = vec4(strength,strength,strength,1.0);

                    // <向下取整> 形成渐变 （从左往右 黑→白） 偏黑
                    // float strength = floor(vUv.x * 10.0) /10.0;
                    // gl_FragColor = vec4(strength,strength,strength,1.0); 

                    // <向上取整> 形成渐变 （从左往右 黑→白） 偏白
                    // float strength = ceil(vUv.x * 10.0) /10.0;
                    // gl_FragColor = vec4(strength,strength,strength,1.0); 

                    // <向上取整> 上下渐变网格 （从左往右，从上到下 黑→白） 偏白
                    // float x = ceil(vUv.x * 10.0) /10.0;
                    // float y = ceil((1.0 - vUv.y) * 10.0) /10.0;
                    // float strength = x * y ;
                    // gl_FragColor = vec4(strength,strength,strength,1.0); 

                    // 随机数 (1)
                    // float strength = ceil(vUv.x * 10.0)/10.0 * ceil(vUv.y * 10.9)/10.0;
                    // strength = random(vec2(strength,strength));
                    // gl_FragColor = vec4(vec3(strength),1.0);
                    // 随机数 (2)
                    // gl_FragColor = vec4(vec3(random( vUv )),1.0);
                    
                    // 使用length(x), 返回向量x的长度 
                    // float strength = length(vUv);
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // 使用distance(p0,p1), 计算向量p0，p1之间的距离
                    // 左下角距离中心之间的距离
                    // float strength =  distance(vUv,vec2(0.5,0.5)); 
                    // gl_FragColor = vec4(vec3(strength),1.0);
                    // float barX = 0.15 / distance(vec2(vUv.x, (vUv.y-0.5)*5.0 + 0.5),vec2(0.5,0.5))  ; 
                    // float barY = 0.15 / distance(vec2((vUv.x-0.5)*5.0+0.5, vUv.y),vec2(0.5,0.5))  ; 
                    // float strength =  barX * barY;
                    // gl_FragColor = vec4(vec3(strength),strength);
                

                    // 使用旋转函数 旋转星星 / 四角飞镖
                    // 3.1415926：因为没有Π，所以用3.1415926； 0.25：45度
                    // vec2 rotateUv = rotate(vUv,3.1415926*0.25,vec2(0.5));
                    // vec2 rotateUv = rotate(vUv,uTime,vec2(0.5));
                    // float barX = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y-0.5)*10.0 + 0.5),vec2(0.5,0.5))  ; 
                    // float barY = 0.15 / distance(vec2((rotateUv.x-0.5)*10.0+0.5, rotateUv.y),vec2(0.5,0.5))  ; 
                    // float strength =  (barX *5.0 )* (barY *5.0);
                    // gl_FragColor = vec4(vec3(strength),strength);


                    // 日本国旗
                    // float strength = step(0.5, distance(vUv ,vec2(0.5)) +0.25 );
                    // gl_FragColor = vec4(255,strength,strength,1.0);
                   
                    // 日本国旗 (外红内白)
                    // float strength = 1.0 - step(0.5, distance(vUv ,vec2(0.5)) +0.25 );
                    // gl_FragColor = vec4(255,strength,strength,1.0);

                    // 黑点光晕
                    // float strength = abs( distance(vUv ,vec2(0.5)) +0.1);
                    // gl_FragColor = vec4(vec3(strength),1.0);


                    // 波浪环
                    // vec2 waveUv = vec2(
                    //     vUv.x,
                    //     vUv.y+sin(vUv.x*30.0)*0.1
                    // );
                    // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // 油泼画
                    // vec2 waveUv = vec2(
                    //      vUv.x+sin(vUv.y*30.0)*0.1,
                    //      vUv.y+sin(vUv.x*30.0)*0.1
                    // );
                    // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // vec2 waveUv = vec2(
                    //     vUv.x+sin(vUv.y*100.0)*0.1,
                    //     vUv.y+sin(vUv.x*100.0)*0.1
                    // );
                    // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // 👆配合 uTime
                    // vec2 waveUv = vec2(
                    //     vUv.x+sin(vUv.y*uTime)*0.1,
                    //     vUv.y+sin(vUv.x*uTime)*0.1
                    // );
                    // float strength = 1.0 - step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
                    // gl_FragColor = vec4(vec3(strength),1.0);
                    
                
                    // 根据角度 atan(x) 显示视图
                    // float angle = atan(vUv.x,vUv.y);
                    // float strength = angle;
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // 根据角度 atan(x) 实现螺旋渐变
                    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
                    // float strength = (angle+3.14)/6.28;
                    // gl_FragColor = vec4(vec3(strength),1.0);

                    // 实现雷达扫射
                    // float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
                    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
                    // float strength = (angle+3.14)/6.28;
                    // gl_FragColor =vec4(strength,strength,strength,alpha);

                    // 👆 配合uTime使用
                    // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
                    // float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
                    // float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
                    // float strength = (angle+3.14)/6.28;
                    // gl_FragColor =vec4(strength,strength,strength,alpha);
                
                
                    // 44 万花筒
                    // float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
                    // float strength = mod(angle*10.0,1.0);
                    // gl_FragColor = vec4(vec3(strength),1.0);
                    

                    // 光芒四射
                    float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
                    float strength = sin(angle*100.0);
                    gl_FragColor = vec4(vec3(strength),1.0);
                    
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                }
            `,
            side: THREE.DoubleSide,
            transparent: true,
             // 材质里设置 uTime ，初始值为 0， 然后在render里设置value的值
             uniforms: {
                // 变量
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

            // 改变rawMaterial里的uTime
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
            使用内置glsl函数
            <div id="container" ref={container}></div>
        </>
    );
}
