import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
/*
 *  创建一个对象 （场景+相机+对象） ==> 渲染器渲染
 */
export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.set(5, 0, 10);
        scene.add(camera);
        const coneGeometry = new THREE.ConeGeometry(5, 10, 3);
        const material = new THREE.MeshBasicMaterial({ color: 0x784883 });
        const cone = new THREE.Mesh(coneGeometry, material);
        scene.add(cone);
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
        renderer.render(scene, camera);

        const controls = new OrbitControls(camera, renderer.domElement);
        // 轨道控制器是否自动围绕目标旋转。请注意，如果它被启用，你必须在你的动画循环里调用.update()。
        controls.autoRotate = true;
        // 轨道控制器旋转速度。默认2.0，相当于在60fps时每旋转一周需要30秒。请注意，如果.autoRotate被启用，你必须在你的动画循环里调用.update()。
        controls.autoRotateSpeed = 3.0;
        // 旋转速度
        controls.rotateSpeed = 2;
        // 轨道控制器阻尼。默认false，将给控制器带来重量感。请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        controls.enableDamping = true;
        // 轨道控制器阻尼系数大小。 默认0.05
        controls.dampingFactor = 0.1;
        // 轨道控制器旋转中心点/焦点
        controls.target.set(0, 0, 0);
        // 是否允许控制，默认true
        controls.enabled = true;
        // 启用或禁用摄像机平移，默认为true。
        controls.enablePan = true;
        // 启用或禁用摄像机水平或垂直旋转。默认值为true。
        controls.enableRotate = true;
        //  启用或禁用摄像机的缩放。
        controls.enableZoom = true;
       
        // 动画帧
        function animate(t) {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            轨道控制器控制器 OrbitControls 使物体可以旋转
            <div id="container" ref={container}></div>
        </>
    );
}
