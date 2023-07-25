import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
 *  创建一个对象 （场景+相机+对象） ==> 渲染器渲染
 */
export default function Demo1Component() {
    const container = useRef(null);

    const init = () => {
        // Step1 创建场景
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x999999);
        // Step2 创建 透视摄像机
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        // Step3 设置相机位置
        camera.position.set(0, 0, 100);
        // Step4 将camera 添加到scene
        scene.add(camera);

        // Step5 创建立方体几何体
        const geometry = new THREE.BoxGeometry(30, 30, 30);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        // Step6 场景中添加物体
        scene.add(cube);

        // Step7 创建 渲染器
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

        console.log(cube)
        // Step8 修改渲染器大小
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Step9 渲染器渲染 场景+相机
        renderer.render(scene, camera);
        console.log(container)
        // @ts-ignore
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            创建一个对象 （场景+相机+对象） ==> 渲染器渲染
            <div id="container" ref={container}></div>
        </>
    );
}
