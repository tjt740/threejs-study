import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
const gui = new dat.GUI();
export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x999999);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        scene.add(camera);

        // 1️⃣ 创建空心长方体
        // const cuboid = new THREE.BoxGeometry(3, 2, 1);
        // const cuboidMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cuboidCube = new THREE.Mesh(cuboid, cuboidMaterial);
        // cuboidCube.position.set(2, 2, 2);
        // const cube = new THREE.BoxHelper(cuboidCube);
        // scene.add(cube);


        // 1️⃣ 创建空心长方体
        const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const edges =new THREE.EdgesGeometry( boxGeometry );
        const line1 =new THREE.LineSegments( edges,new THREE.LineBasicMaterial({ color:0xffffff})); 
        scene.add(line1);
    
        // 2️⃣ 创建空心二十面缓冲几何体
        const icosahedronGeometry = new THREE.IcosahedronGeometry(5, 1);
        console.log(icosahedronGeometry)
        const icosahedronGEdges = new THREE.EdgesGeometry(icosahedronGeometry);
        console.log(icosahedronGEdges);
        const line2 = new THREE.LineSegments(icosahedronGEdges, new THREE.LineBasicMaterial({ color: 0x000000 })); 

        scene.add(line2);
        const gui2 = gui.addFolder('空心二十面缓冲几何体配置')
        const options = {
            radius:1,
            detail:1,   
        }
        gui2.add(icosahedronGeometry.parameters, 'detail').max(5).min(1).step(1).onChange((v) => { 
            console.log(v)
            icosahedronGeometry.parameters.detail = v;
        })

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

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
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            创建空心长方体
            <div id="container" ref={container}></div>
        </>
    );
}
