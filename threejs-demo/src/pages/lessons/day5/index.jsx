import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/*
 *  XYZ 3维坐标 new THREE.AxesHelper(7); 7:XYZ长度
 *  轨道控制器控制器 OrbitControls
 *  物体位置 + 缩放 + 角度
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

        // 渲染函数
        function render(t) {
            // 利用默认形参 t 来精确每一次时间变化后
            // cube 每次加0.01,超出复位
            cube.position.x = ((t / 1000) * 1) % 5;
            if (cube.position.x >= 5) {
                cube.position.x = 1;
            }
            // cube 一直旋转
            cube.rotation.z = (t / 100) * 1;

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        // Step1 坐标  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
        // Step2 坐标辅助线添加到场景中
        scene.add(axesHelper);

        // Step3 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);

        // Step4 物体位置设置
        cube.position.set(2, 2, 1);

        // Step5 物体角度设置
        cube.rotation.set(Math.PI / 4, 0, 0, 'XYZ'); // Math.PI = 180° , 'XYZ'、'YZX'、'ZXY' 都可以，但必须大写

        // Step6 物体缩放设置
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
            

            <div id="container" ref={container}>
                
            </div>
        </>
    );
}
