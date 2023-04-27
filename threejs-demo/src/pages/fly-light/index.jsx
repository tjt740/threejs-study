import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

//1️⃣ 导入rgbe/hdr二进制格式文件加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default function ThreeComponent() {
    const container = useRef(null);
    const gui = new dat.GUI();
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0x444444);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 30);
        // camera.lookAt(scene.position);
        scene.add(camera);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer();

        const params = {
            exposure:2.0
        }
       
        gui.add( params, 'exposure', 0, 4, 0.01 ).onChange( render );
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

        /*
         * ------------ start ----------
         */

        const loadManager = new THREE.LoadingManager(
            // onLoad
            () => {
                console.log('纹理加载结束！');
            },
            // onProgress
            (url, progress, total) => {
                console.log('纹理url:', url);
            },
            // onError
            () => {
                console.log('纹理加载失败');
            }
        );

        //2️⃣ 导入hdr图像加载器
        const rgbeLoader = new RGBELoader(loadManager);
        //3️⃣ 资源较大，使用异步加载 <异步加载?
        rgbeLoader
            .loadAsync(require('./assets/texture/moonless_golf_4k.hdr'))
            .then((texture) => {
                console.log('加载hdr图片成功');
                // 纹理贴图映射模式 <https://threejs.org/docs/index.html#api/zh/constants/Textures>
                texture.mapping = THREE.EquirectangularReflectionMapping;
                //将加载的材质texture设置给背景和环境
                scene.background = texture;
                scene.environment = texture;
            });

        /*
         * ------------end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;
        //  更新camera 投影矩阵
        camera.updateProjectionMatrix();

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            // BUG: 高亮问题 https://threejs.org/examples/webgl_loader_texture_hdr.html
            renderer.toneMappingExposure = 4.0;
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

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
            孔明灯-原始着色器
            <div id="container" ref={container}></div>
        </>
    );
}
