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
        camera.position.set(0, 0, 30);
        scene.add(camera);

        /*
         * ------------ start ----------
         */
        // 设置灯光和阴影

        // 1. 设置自然光、<点光源>、<标准>网格材质（带PBR属性的都可以）  材质要满足能够对光照有反应
        // 2. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true; https://threejs.org/docs/index.html?q=render#api/zh/renderers/WebGLRenderer
        // 3. 设置光照能产生动态阴影  directionalLight.castShadow = true; https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight
        // 4. 设置投射阴影的物体投射阴影 sphere.castShadow = true; https://threejs.org/docs/index.html?q=objec#api/zh/core/Object3D
        // 5. 设置被投射的物体接收阴影  planGeometry.receiveShadow = true; https://threejs.org/docs/index.html?q=objec#api/zh/core/Object3D

        // 创建环境光 + 强度
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);


        // 创建聚光灯
        const spotLight = new THREE.SpotLight();
        // <聚光灯> 灯光颜色
        spotLight.color = new THREE.Color(0xffffff);
        // <聚光灯> 光照强度,默认值为1
        spotLight.intensity = 2;
        // <聚光的> 灯光光照功率,默认为 4。 pointLight.intensity * 4 * Math.PI;
        spotLight.power = spotLight.intensity * 200 * Math.PI;
        // <聚光灯> 发出光源的距离，其强度根据光源的距离线性衰减。 值越大,照的越远
        spotLight.distance = 100;
        // <聚光灯> 光线散射角度，最大为Math.PI/2。 默认值为 Math.PI/3。
        spotLight.angle = Math.PI / 3;
        // <聚光灯> 沿着光照距离的衰减量。 值越大,灯光效果越弱,默认为2,现实光默认为2.🌟renderer必须加 
        spotLight.decay = 2;
        // <聚光灯> 聚光锥的半影衰减百分比(光圈边缘模糊度)。在0和1之间的值。 默认值为 0.0。
        spotLight.penumbra = 0.3;
        // <聚光灯> 动态阴影,默认是false
        spotLight.castShadow = true;


        // <聚光灯> 阴影分辨率
        spotLight.shadow.mapSize.set(3072, 3072);
        // <聚光灯> 阴影边缘模糊度
        spotLight.shadow.radius = 50;
        // 设置<聚光灯>投射相机的属性
        // 设置<聚光灯>相机投射阴影时，距离近点（<聚光灯>位置）的距离
        spotLight.shadow.camera.near = 0.5;
        // 设置<聚光灯>相机投射阴影时，距离远点（<聚光灯>位置）的距离
        spotLight.shadow.camera.far = 100;
        // 设置<聚光灯>相机投射阴影的位置（暂时没发现有啥用）
        spotLight.shadow.camera.top = 5;
        spotLight.shadow.camera.bottom = -5;
        spotLight.shadow.camera.left = -5;
        spotLight.shadow.camera.right = 5;

   
        // <聚光灯> 位置设置
        spotLight.position.set(10, 10, 0);
        scene.add(spotLight);


        gui.width = 300;
        gui.add(spotLight.position, 'z').min(0).max(10).step(1).name('光线位置');
        gui.add(spotLight, 'intensity').min(0.5).max(5).step(1).name('光照强度');
        gui.add(spotLight, 'power').min(spotLight.intensity * 1 * Math.PI).max(spotLight.intensity * 200 * Math.PI).step(1).name('聚光灯的灯光功率');
        gui.add(spotLight, 'distance').min(50).max(500).step(1).name('发出光源的距离');
        gui.add(spotLight, 'angle').min(Math.PI/10).max(Math.PI/2).step(Math.PI/10).name('光线散射角度');
        gui.add(spotLight, 'decay').min(1).max(10).step(1).name('光照衰减量');
        gui.add(spotLight, 'penumbra').min(0.1).max(1).step(0.1).name('光圈边缘模糊度');
        gui.add(spotLight, 'castShadow', { '开': true, '关': false }).name('是否开启动态阴影').onChange((v) => { 
            console.log(v);
            spotLight.castShadow = Boolean(v);  
        })






        // 模拟灯光位置
        const mockSphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const mockSphere = new THREE.Mesh(mockSphereGeometry, sphereMaterial);
        mockSphere.position.set(10, 10, 0);
        scene.add(mockSphere);

       
   
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
        camera.updateProjectionMatrix();

        
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
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
            聚光灯和阴影
            <div id="container" ref={container}></div>
        </>
    );
}
