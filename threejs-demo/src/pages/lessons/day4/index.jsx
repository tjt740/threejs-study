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

        const geometry = new THREE.BoxGeometry(2, 3, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffe5cd61 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log(renderer);

        // cube.position.set(1, 1, 1); // cube.position.set(x,y,z);
        // cube.position.y = 2;

        // 物体尺寸设置 (x,y,z)
        // cube.scale.set(2, 0.5, 0.5);
        // cube.scale.x = 4;

        // 物体角度/方向设置  属性值：https://threejs.org/docs/index.html?q=ax#api/zh/math/Euler
        // cube.rotation.set(45, 10, 45, 'XYZ');

        // 渲染函数
        function render(t) {
            console.log('每一帧时间:', t);

            controls.update(); // 实现控制器阻尼感
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);

            cube.rotation.z += 0.01;
            if (cube.rotation.z >= 6) {
                cube.rotation.z = 0;
            }
        }

        // Step1 坐标  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
        // Step2 坐标辅助线添加到场景中
        scene.add(axesHelper);

        // Step3 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        /* 
            设置控制阻尼，让控制器效果更佳
            .enableDamping : Boolean
            将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
            请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        */
        controls.enableDamping = true;
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
            物体移动
            <div id="container" ref={container}></div>
        </>
    );
}
