import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
 *  new THREE.Clock() 获取运行时时间信息
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

        // Step1 获取Clock 跟踪时间，解决 Date now() 不准的问题；
        const clock = new THREE.Clock(); // 获取关于时钟的信息： <autoStart> <elapsedTime> <oldTime> <running> <startTime>
        console.log(clock);

        clock.start();
        setTimeout(() => {
            clock.stop();
            console.log(clock.getElapsedTime()); // 3s
        }, 3000);
        setTimeout(() => {
            clock.start();
            console.log(clock.getDelta());
        }, 5000);

        // 渲染函数
        function render(t) {
            // 获取始终运行的总时长
            const time = clock.getElapsedTime(); // 1 2 3 4 5 ....
            cube.position.x = time  % 5;
            // if (cube.position.x >= 5) {
            //     cube.position.x = 1;
            // }
            // console.log(time);
            // 获取当前秒数到上一帧的秒数差
            // const deltaTime = clock.getDelta();
            // console.log(deltaTime);

            controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        const axesHelper = new THREE.AxesHelper(7);
        scene.add(axesHelper);

        const controls = new OrbitControls(camera, renderer.domElement);

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
            new THREE.Clock() 获取运行时时间信息
            <div id="container" ref={container}></div>
        </>
    );
}
