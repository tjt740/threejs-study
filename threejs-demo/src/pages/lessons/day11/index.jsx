import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
            //     const vertexPosition =new  Float32Array([
            //         1.0, 1.0, 0,  // 顶点1,XYZ坐标
            //         1.0, 5.0, 0,  // 顶点2,XYZ坐标
            //         5.0, 5.0, 0,  // 顶点3,XYZ坐标
            //         5.0, 5.0, 0,
            //         5.0, 1.0, 0, // 顶点4,XYZ坐标
            //         1.0, 1.0, 0,
            //    ]);
            // 设置每个物体里的顶点坐标
            for (let j = 0; j < 9; j++) {
                vertexPosition[j] = Math.random() * 10 - 5;
            }
            console.log('geometry:', geometry);
            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(vertexPosition, 3)
            );
            // 设置随机颜色
            const color = new THREE.Color(
                Math.random(),
                Math.random(),
                Math.random()
            );
            // 设置材质
            const material = new THREE.MeshBasicMaterial({
                color,
                opacity: 0.3,
                transparent: true,
            });

            // 网格+材质=物体
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
        }

        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        scene.add(line);
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
        renderer.setSize(WIDTH, HEIGHT);

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
        init();
    }, []);

    return (
        <>
            创建酷炫三角形
            <div id="container" ref={container}></div>
        </>
    );
}
