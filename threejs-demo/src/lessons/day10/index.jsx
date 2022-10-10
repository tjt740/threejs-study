import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap';

// 导入gui
// import * as dat from 'dat.gui';
/*
 * 通过三角行创建几何体！！！
 * 创建 空心长方体
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

        // Step1 创建自定义几何体 , 首先先用BufferGeometry创建一条无限延长的线段，初始化线段点
        const geometry = new THREE.BufferGeometry();
        // Step2 创建结合体顶点位置集合(32位浮点数) XYZ
        const vertexPosition = new Float32Array([
            1.0, 1.0, 0, // 顶点1,XYZ坐标
            1.0, 5.0, 0, // 顶点2,XYZ坐标
            5.0, 5.0, 0, // 顶点3,XYZ坐标

           
            5.0, 5.0, 0,
            5.0, 1.0, 0, // 顶点4,XYZ坐标
            1.0, 1.0, 0,
        ]);



        // Step3 根据一维坐标系，设置各点的位置 ,  itemSize = 3 因为每个顶点都是一个三元组。
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertexPosition, 3)
        );

        const material = new THREE.MeshBasicMaterial({ color: 0xffe5cd61 });
        // Step4 根据几何体和材质创建物体
        const cube = new THREE.Mesh(geometry, material);
        // 设置为网格
        cube.material.wireframe = true;
        console.log('几何体:', geometry);
         //场景中添加物体
        scene.add(cube);
        
        // 创建空心长方体 
        const cuboid = new THREE.BoxGeometry(3, 2, 1);
        const cuboidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cuboidCube = new THREE.Mesh(cuboid, cuboidMaterial);
        const box = new THREE.BoxHelper(cuboidCube)
        scene.add( box );
       

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
