import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap';

// 导入gui
// import * as dat from 'dat.gui';
/*
 * 创建酷炫三角形 20个
 */

// const gui = new dat.GUI();

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

        // 创建多个三角形
        for (let i = 0; i <= 20; i++) { 
            // 创建几何体
            const geometry = new THREE.BufferGeometry();
            const vertexPosition = new Float32Array(9);
            // 设置每个物体里的顶点坐标
            for (let j = 0; j <9; j++) { 
                vertexPosition[j] = Math.random() * 10 - 5;
            }
            console.log('geometry:', geometry);
            geometry.setAttribute('position', new THREE.BufferAttribute(vertexPosition, 3));
            // 设置颜色
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            // 设置材质
            const material = new THREE.MeshBasicMaterial({ color })
            // 网格+材质=物体
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
        }



        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 渲染函数
        function render(t) {
            controls.update();
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

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        gsap.to('h1', {
            rotation: 360,
            duration: 5,
            repeat: true,
            ease: 'none',
        });

        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <h1 style={{ width: '200px' }}> Three.js 组件 </h1>

            <div id="container" ref={container}></div>
        </>
    );
}
