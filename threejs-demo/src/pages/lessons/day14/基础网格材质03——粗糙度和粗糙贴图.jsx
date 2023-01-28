import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeComponent() {
    const container = useRef(null);

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

        // 导入纹理
        const textureLoader = new THREE.TextureLoader();
        const doorTexture = textureLoader.load(require('./texture/door.jpg'));
        doorTexture.magFilter = THREE.NearestFilter;
        doorTexture.minFilter = THREE.NearestFilter;
        const alphaTexture = textureLoader.load(require('./texture/alpha.jpg'));
        const aoMapTexture = textureLoader.load(
            require('./texture/ambientOcclusion.jpg')
        );

        // 导入置换贴图（白色越高，黑色越低，形成山地形状的贴图）
        const doorHeightTexture = textureLoader.load(
            require('./texture/height.jpg')
        );

        // 环境光
        const light = new THREE.AmbientLight({
            color: 0xffffff,
            intensity: 0.5,
        });
        scene.add(light);

        // 创建平面
        const planGeometry = new THREE.PlaneGeometry(30, 30, 400, 400); //1️⃣ 400： 数值越大GPU运算量越大

        // 创建标准网格材质 🌟 必须要有灯光！
        const material = new THREE.MeshStandardMaterial({
            
            // 纹理图片
            map: doorTexture,
            // alpha 滤镜纹理   (需要配合transparent:true)
            alphaMap: alphaTexture,
            transparent: true,
            // aoMap 遮挡贴图纹理 (需要设置第二组uv)
            aoMap: aoMapTexture,
            // 设置aoMap 纹理遮挡效果透明度
            aoMapIntensity: 1,
            // 纹理图片双面显示
            side: THREE.DoubleSide,

            // 位移（置换）贴图会影响网格顶点的位置。换句话说就是它可以移动顶点来创建浮雕。（白色越高，黑色越低，形成山地形状的贴图）
            displacementMap: doorHeightTexture,
            // 位移（置换）贴图对网格的影响程度（黑色是无位移，白色是最大位移）。如果没有设置位移贴图，则不会应用此值。默认值为1——xxx。
            displacementScale: 1,
            // 相当于 XYZ 位移。 没有位移（置换）贴图时，默认为0
            displacementBias:3
        });

        // 💡设置第二组uv,固定写法. 2:(x,y)两个点.
        planGeometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(planGeometry.attributes.uv.array, 2)
        );

        const cube = new THREE.Mesh(planGeometry, material);
        scene.add(cube);

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
            标准网格材质
            <div id="container" ref={container}></div>
        </>
    );
}
