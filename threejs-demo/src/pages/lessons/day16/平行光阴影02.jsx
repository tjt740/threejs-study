import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
export default function ThreeComponent() {
    const container = useRef(null);
    const gui = new dat.GUI();
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
        // 设置灯光和阴影

        // 创建环境光 + 强度
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(
            new THREE.Color('hsl( 0.1, 1, 0.95 )'),
            0.5
        );

        directionalLight.position.set(10, 10, 10);
        // 设置光照能产生动态阴影
        directionalLight.castShadow = true;

        gui.add(directionalLight.shadow, 'radius')
            .min(1)
            .max(50)
            .step(1)
            .name('设置阴影模糊度');
        // 设置平行光投射出来的阴影边缘模糊度
        directionalLight.shadow.radius = 20;
        // 设置阴影分辨率
        directionalLight.shadow.mapSize.set(3072, 3072);
        
        // 设置平行光投射相机的属性
        // 设置平行光相机投射阴影时，距离近点（平行光位置）的距离
        directionalLight.shadow.camera.near = 0.5;
        // 设置平行光相机投射阴影时，距离远点（平行光位置）的距离
        directionalLight.shadow.camera.far = 100;
        // 设置平行光相机投射阴影的位置（暂时没发现有啥用）
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        gui.add(directionalLight.shadow.camera, 'near').min(0.1).max(30).step(0.1).name('设置平行光投射，距离近点的位置').onChange(() => { 
            // 因为平行光是正交相机，所以要重新调用相机的 updateProjectionMatrix() 方法，更新相机矩阵，才能看到效果。
            directionalLight.shadow.camera.updateProjectionMatrix();
        })        



        scene.add(directionalLight);

        // 创建球形几何体
        // Ps: 这个5 改成10 阴影就成 方形了 ？
        const sphereGeometry = new THREE.SphereGeometry(5, 64, 16);
        // 使用标准网格材质渲染 环境贴图
        const material = new THREE.MeshStandardMaterial();
        // 生成圆形几何体
        const sphere = new THREE.Mesh(sphereGeometry, material);

        // 设置物体投射阴影
        sphere.castShadow = true;

        scene.add(sphere);

        // 创建平面
        const planGeometry = new THREE.PlaneGeometry(100, 100);
        const planMaterial = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
        });
        const plan = new THREE.Mesh(planGeometry, planMaterial);
        // 改变位置
        plan.rotation.x = Math.PI / 2;
        plan.position.y = -8;
        // 平面几何接收阴影
        plan.receiveShadow = true;
        scene.add(plan);
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
        //2️⃣ 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 设置渲染器像素比:
        renderer.setPixelRatio(window.devicePixelRatio);
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;
  
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
            灯光和阴影
            <div id="container" ref={container}></div>
        </>
    );
}
