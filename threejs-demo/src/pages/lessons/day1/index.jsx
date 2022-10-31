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

        /* Step2 创建透视相机 (
            视野角度,
            宽高比 宽/高:,
            近截面: 距离小于多少不渲染,
            远截面: 距离远于多少不渲染, 
            )
        */
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Step3 设置相机位置
        camera.position.set(0, 0, 10);

        // Step4 场景中添加相机
        scene.add(camera);

        // Step5 创建几何体  http://localhost:8080/docs/index.html#api/zh/geometries/BoxGeometry
        const geometry = new THREE.BoxGeometry(2, 3, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffe5cd61 });
        // Step6 根据几何体和材质创建物体
        const cube = new THREE.Mesh(geometry, material);
        // Step7 场景添加 物体
        scene.add(cube);

        // Step8 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer();

        // Step9 设置渲染器大小
        renderer.setSize(window.innerWidth, window.innerHeight);
        // console.log(renderer);

        // Step10 渲染器渲染
        renderer.render(scene, camera);

        // Step11 将WebGL 渲染的内容添加到dom上

        // console.log(container);
        // @ts-ignore
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <h1> Three.js 组件 </h1>
            <div id="container" ref={container}></div>
        </>
    );
}
