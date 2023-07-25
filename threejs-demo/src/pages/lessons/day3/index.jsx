import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/*
 *  XYZ 3维坐标 new THREE.AxesHelper(7); 7:XYZ长度
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
        // scene.add(cube);

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
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(renderer);

        // 渲染函数
        function render(t) {
            controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        // Step1 坐标  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
        axesHelper.position.set(-2, -2, -4);
        // Step2 坐标辅助线添加到场景中
        scene.add(axesHelper);

        // - 箭头的原点.
        const origin = new THREE.Vector3(0, 0, 0);
        // - 箭头的长度. 默认为 1
        const length = 3;
        //  - 箭头头部(锥体)的长度. 默认为箭头长度的0.2倍(0.2 * length).
        const headLength = 0.2;
        // - 箭头头部(锥体)的宽度. 默认为箭头头部(锥体)的长度的0.2倍(0.2 * headLength).
        const headWidth = 0.2;

        // X
        const dirX = new THREE.Vector3(10, 0, 0);
        dirX.normalize();

        const arrowHelperX = new THREE.ArrowHelper(
            dirX,
            origin,
            length,
            0xff0000,
            headLength,
            headWidth
        );
        scene.add(arrowHelperX);

        // Y
        const dirY = new THREE.Vector3(0, 10, 0);
        dirY.normalize();
        const arrowHelperY = new THREE.ArrowHelper(
            dirY,
            origin,
            length,
            0x00ff00,
            headLength,
            headWidth
        );
        scene.add(arrowHelperY);

        // Z
        const dirZ = new THREE.Vector3(0, 0, 10);
        dirZ.normalize();
        const arrowHelperZ = new THREE.ArrowHelper(
            dirZ,
            origin,
            length,
            0x0000ff,
            headLength,
            headWidth
        );
        scene.add(arrowHelperZ);

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
            XYZ 3维坐标 new THREE.AxesHelper(7); 7:XYZ长度 (红色代表 X 轴.
            绿色代表 Y 轴. 蓝色代表 Z 轴.)
            <div id="container" ref={container}></div>
        </>
    );
}
