import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        // 创建场景
        const scene = new THREE.Scene();
        // 更改场景背景
        scene.background = new THREE.Color('#999999');

        // 创建摄像机
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        // 设置摄像机位置
        camera.position.set(0, 0, 80);
        // 将摄像机添加进场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        //* start

        //1️⃣ 创建环境光 + 强度
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);

        //2️⃣ 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
        // 平行光位置（类似太阳所在位置）
        directionalLight.position.set(20, 20, 20);
        scene.add(directionalLight);

        //3️⃣ 初始化cubeTextureLoader 立方体纹理加载器
        const loader = new THREE.CubeTextureLoader();

        //4️⃣ 加载CubeTexture的一个类。 内部使用ImageLoader来加载文件。
        const envMapTexture = loader.load([
            require('./environmentMaps/0/px.jpg'),
            require('./environmentMaps/0/nx.jpg'),
            require('./environmentMaps/0/py.jpg'),
            require('./environmentMaps/0/ny.jpg'),
            require('./environmentMaps/0/pz.jpg'),
            require('./environmentMaps/0/nz.jpg'),
        ]);

        //5️⃣ 创建球形几何体
        const geometry = new THREE.SphereGeometry(15, 32, 16);

        //6️⃣ 使用标准网格材质渲染 环境贴图
        const material = new THREE.MeshStandardMaterial({
            // 金属度
            metalness: 1,
            // 粗糙度
            roughness: 0.1,
            //7️⃣ 环境纹理贴图
            envMap: envMapTexture,
        });
        //8️⃣ 生成圆形几何体
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // 立方几何体
        const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
        // 材质
        const boxMaterial = new THREE.MeshStandardMaterial({
            // 金属度
            metalness: 1,
            // 粗糙度
            roughness: 0.1,
            // 不设置环境纹理贴图
            // envMap: envMapTexture,
        });
        // 立方体
        const cube = new THREE.Mesh(boxGeometry, boxMaterial);
        cube.position.set(50, 0, 0);
        scene.add(cube);

        //9️⃣ 设置场景背景<背景贴图>
        scene.background = envMapTexture;
        //🔟 给所有的物体添加默认的<环境贴图> 👇
        scene.environment = envMapTexture;

        //* end

        // 模拟平行光（太阳）所在位置
        const sunCube = new THREE.Mesh(
            new THREE.DodecahedronGeometry(1, 5),
            new THREE.MeshBasicMaterial({ color: new THREE.Color('red') })
        );
        sunCube.position.set(20, 20, 20);
        scene.add(sunCube);

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
        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 渲染函数
        function render(t) {
            controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        // 渲染
        render();

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

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            标准网格材质
            <div id="container" ref={container}></div>
        </>
    );
}
