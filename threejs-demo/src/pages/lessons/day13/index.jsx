import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
// const gui = new dat.GUI();
export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 50);
        scene.add(camera);



        //------------ start ----------
        // 导入纹理
        const textureLoader = new THREE.TextureLoader();
        const doorTexture = textureLoader.load(require('./texture/door.jpg'));
        doorTexture.magFilter = THREE.NearestFilter;
        doorTexture.minFilter = THREE.NearestFilter;
        const alphaTexture = textureLoader.load(require('./texture/alpha.jpg'));
        const aoMapTexture = textureLoader.load(
            require('./texture/ambientOcclusion.jpg')
        );

        // // 添加几何体
        // const boxGeometry = new THREE.BoxGeometry(30, 30, 30);
        // // 添加材质
        // const material = new THREE.MeshBasicMaterial({
        //     map: doorTexture,
        //     alphaMap: alphaTexture,
        //     transparent: true,
        // });
        // // material.side = THREE.FrontSide   // 正面 (默认)
        // material.side = THREE.BackSide; // 背面
        // // material.side = THREE.DoubleSide  // 双面都渲染

        // // 渲染立方体
        // const cube = new THREE.Mesh(boxGeometry, material);
        // // 添加进场景
        // scene.add(cube);

        // 添加平面
        const planeGeometry = new THREE.PlaneGeometry(50, 50);
        const planeMaterial = new THREE.MeshBasicMaterial({
            // 纹理图片
            map: doorTexture,
            // 纹理透明
            alphaMap: alphaTexture,
            transparent: true,
            // 纹理图片双面显示
            side: THREE.DoubleSide, // 双面渲染
            // aoMap 在纹理较深的地方添加贴图
            aoMap: aoMapTexture,
            // 设置aoMap 纹理遮挡效果透明度
            aoMapIntensity: 0.5
        });

        // 💡设置第二组uv,固定写法. 2:(x,y)两个点.
        planeGeometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
        );

        const planeCube = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(planeCube);



        // --------end-------------

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(7);
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
        renderer.setSize(window.innerWidth, window.innerHeight);
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
            基础网格材质+纹理
            <div id="container" ref={container}></div>
        </>
    );
}
