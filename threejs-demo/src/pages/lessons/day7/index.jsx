import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap';
/*
 *  gsap 设置动画效果  动画框架 npm i gsap
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
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 获取Clock 跟踪时间，解决 Date now() 不准的问题；
        const clock = new THREE.Clock(); // 获取关于时钟的信息： <autoStart> <elapsedTime> <oldTime> <running> <startTime>

        // gsap.to(DOMElement,options)
        const tween1 = gsap.to(cube.position, {
            id: 'tjt740', // 运动动画id，可以通过 gsap.getById() 获得
            y: 7, // 运动长度
            delay: 1, // 运动在延迟多少秒后开始
            duration: 3, // 运动方向
            repeat: -1, // 是否重复  +number：重复次数  -1：无限重复  0：默认不重复
            repeatDelay: 0.5,// 重复时间延迟多少秒后开始，默认0
            yoyo:true, // 类似来回播放动画 悠悠球动作
            ease: 'none', // 运动速度 https://greensock.com/docs/v3/Eases
            paused: false, // 是否初始暂停
            onComplete: () => {
                console.log('动画完成时触发');
            },
            onStart: () => {
              
                console.log('动画开始时触发');
            },
            onUpdate: () => {
                console.log(
                    '每次动画更新时触发（在动画处于活动状态时每帧触发）'
                );
            },
            onRepeat: () => {
                console.log('每次动画重复时触发一次。');
            },
            onReverseComplete: () => {
                console.log('动画反转后再次到达其起点时触发。一般是gsap.reverse()'); 
            }, 
        });
        renderer.domElement.addEventListener('click', () => {
            if (!tween1.isActive()) {
                console.log(gsap.getById('tjt740')); // tween1 的参数
                // 如果gsap动画暂停就恢复;
                tween1.resume();
                return;
            }
            tween1.pause(); // 暂停gsap动画
        });

        //Step1 利用gsap移动物体， x: 方向距离，duration:秒数 , repeat:重复 , delay: 延迟时间 ease: 速度, yoyo: 来回移动
        // const animation1 = gsap.to(cube.position, {
        //     x: 5,
        //     duration: 4,
        //     repeat: true,
        //     yoyo: true,
        //     delay: 1,
        //     ease: 'none',
        // });
        // //Step2 利用gsap旋转物体， x: 方向，duration: 秒数， onComplete: 动画完成回调 ，onStart: 动画开始回调
        // gsap.to(cube.rotation, {
        //     z: Math.PI * 3,
        //     duration: 5,
        //     onComplete: () => {
        //         console.log('动画完成');
        //     },
        //     onStart: () => {
        //         console.log('旋转开始');
        //     },
        // });
        // // 双击暂停
        // window.addEventListener('click', () => {
        //     console.log('gsap x:', animation1);
        //     window.animation1 = animation1;
        //     if (animation1.isActive()) {
        //         // 动画暂停
        //         animation1.pause();
        //         return;
        //     }
        //     // 动画恢复
        //     animation1.resume();
        // });

        // 渲染函数
        function render(t) {
            /*
                // 利用默认形参 t 来精确每一次时间变化后
                // cube 每次加0.01,超出复位
                cube.position.x = ((t / 1000) * 1) % 5;
                if (cube.position.x >= 5) {
                    cube.position.x = 1;
                }
                // cube 一直旋转
                cube.rotation.z = (t / 100) * 1;
            */
            // cube.position.y = clock.getElapsedTime() % 7

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
            gsap 设置动画效果 动画框架 npm i gsap
            <div id="container" ref={container}></div>
        </>
    );
}
