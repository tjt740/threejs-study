import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap';
/*
 *  gsap 设置动画效果  动画框架 npm i gsap
 *  随页面尺寸变化而变化渲染分辨率
 */

export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        scene.add(camera);

        const geometry = new THREE.BoxGeometry(2, 3, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffe5cd61 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(renderer);

        // 获取Clock 跟踪时间，解决 Date now() 不准的问题；
        const clock = new THREE.Clock(); // 获取关于时钟的信息： <autoStart> <elapsedTime> <oldTime> <running> <startTime>

        // 利用gsap移动物体， x: 方向距离，duration:秒数 , repeat:重复 , delay: 延迟时间 ease: 速度, yoyo: 来回移动
        const animation1 = gsap.to(cube.position, {
            x: 5,
            duration: 4,
            repeat: true,
            yoyo: true,
            delay: 1,
            ease: 'none',
        });
        // 利用gsap旋转物体， x: 方向，duration: 秒数， onComplete: 动画完成回调 ，onStart: 动画开始回调
        gsap.to(cube.rotation, {
            z: Math.PI * 3,
            duration: 5,
            onComplete: () => {
                console.log('动画完成');
            },
            onStart: () => {
                console.log('旋转开始');
            },
        });
        // 双击暂停
        window.addEventListener('click', () => {
            console.log('gsap x:', animation1);
            window.animation1 = animation1;
            if (animation1.isActive()) {
                // 动画暂停
                animation1.pause();
                return;
            }
            // 动画恢复
            animation1.resume();
        });


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
        })

        // 渲染函数
        function render(t) {

            controls.update();
            
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        const axesHelper = new THREE.AxesHelper(7);
        scene.add(axesHelper);

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        /* 
            设置控制阻尼，让控制器效果更佳
            .enableDamping : Boolean
            将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
            请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        */
        controls.enableDamping = true;
  
        cube.position.set(2, 2, 1);
        cube.rotation.set(Math.PI / 4, 0, 0, 'XYZ'); // Math.PI = 180° , 'XYZ'、'YZX'、'ZXY' 都可以，但必须大写
        cube.scale.set(0.5, 0.7, 0.5); // XYZ 轴缩放尺寸

        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <h1> Three.js 组件 </h1>

            <div id="container" ref={container}>
                
            </div>
        </>
    );
}
