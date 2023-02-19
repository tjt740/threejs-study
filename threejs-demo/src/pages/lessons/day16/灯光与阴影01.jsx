import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x444444);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 40);
        scene.add(camera);

        /*
         * ------------ start ----------
         */
        // 创建球体

        /*
         * ------------ end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
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

        function createCanvas() {
            const canvasDOM = document.createElement('canvas');
            canvasDOM.width = 256;
            canvasDOM.height = 256;
            let ctx = canvasDOM.getContext('2d');
            ctx.fillStyle = `rgb(${Math.random() * 255},${
                Math.random() * 255
            },${Math.random() * 255})`;
            ctx.fillRect(0, 0, 256, 256);
            return canvasDOM;
        }

        setInterval(() => {
            const sphereGeometry = new THREE.SphereGeometry(
                15,
                Math.random() * 64,
                Math.random() * 32
            );

            const canvasTexture = new THREE.CanvasTexture(createCanvas());
            const sphereMaterial = new THREE.MeshBasicMaterial({
                // 添加纹理
                map: canvasTexture,
                // color: Math.random() * 0xffffff
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            scene.add(sphere);

            setInterval(() => {
                // 清除几何体
                sphereGeometry.dispose();
                // 清除材质
                sphereMaterial.dispose();
                // 清除纹理
                canvasTexture.dispose();
                // 清除物体
                scene.remove(sphere);
            }, 1500);
        }, 1000);

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
            灯光与阴影
            <div id="container" ref={container}></div>
        </>
    );
}
