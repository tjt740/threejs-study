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
        // scene.background = new THREE.Color(0x000000);
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

        // 生成球状几何体
        const sphereGeometry = new THREE.SphereGeometry(16, 32, 16);
        // 使用<点>材质
        const pointsMaterial = new THREE.PointsMaterial();
        // 设置<点>材质尺寸，默认1.0
        pointsMaterial.size = 1.0;
        // 材质大小随相机深度（远近而衰减），默认为true
        pointsMaterial.sizeAttenuation = true;
        // 设置<点>材质颜色
        pointsMaterial.color.set(0xfff000);
        // 设置<点>材质纹理
        const pointTextureLoader = new THREE.TextureLoader();
        const pointTexture = pointTextureLoader.load(
            require('./textures/particles/1.png')
        );
        pointTexture.magFilter = THREE.NearestFilter;
        pointTexture.minFilter = THREE.NearestFilter;
        pointsMaterial.map = pointTexture;
        // 设置alpha贴图（黑色透明，白色完全不透明）
        pointsMaterial.alphaMap = pointTexture;
        pointsMaterial.transparent = true;

        // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
        pointsMaterial.depthWrite = false;
        //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
        pointsMaterial.blending =
            
        // THREE.NoBlending // 无混合模式，默认深色变白，亮色不变
// THREE.NormalBlending // 默认，根据材质设置保持一致
THREE.AdditiveBlending; 
// THREE.SubtractiveBlending
// THREE.MultiplyBlending
// THREE.CustomBlending // 黑色透明，亮色变白

        // 生成<点>物体
        const sphere = new THREE.Points(sphereGeometry, pointsMaterial);
        scene.add(sphere);

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
            粒子/点 特效
            <div id="container" ref={container}></div>
        </>
    );
}
