import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// 引入 ‘水模型’ 插件
import { Water } from 'three/examples/jsm/objects/Water2';

export default function WaterModel() {
    const container = useRef(null);
    const gui = new dat.GUI();

    const init = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        //  更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = window.innerWidth / window.innerHeight;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(3, 5, 7);
        // 摄像机添加到场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
        });
        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        /*
         * ------------ start ----------
         */

        // light

        // const ambientLight = new THREE.AmbientLight(0xe7e7e7, 1.2);
        // scene.add(ambientLight);

        // const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        // directionalLight.position.set(-1, 1, 1);
        // scene.add(directionalLight);

        // // 水
        // // params 参数
        // const params = {
        //     color: '#ffffff', // 水颜色
        //     scale: 4, // 水尺寸
        //     flowX: 1, // 水流方向z
        //     flowY: 1, // 水流方向y
        // };

        // const waterGeometry = new THREE.PlaneGeometry(8, 8);

        // const water = new Water(waterGeometry, {
        //     color: params.color,
        //     scale: params.scale,
        //     flowDirection: new THREE.Vector2(params.flowX, params.flowY),
        //     textureWidth: 1024,
        //     textureHeight: 1024,
        // });

        // water.position.y = 1;
        // water.rotation.x = Math.PI * -0.5;
        // scene.add(water);

        const water = new Water(new THREE.PlaneBufferGeometry(8, 8), {
            color: '#ffffff',
            scale: 1,
            flowDirection: new THREE.Vector2(1, 1),
            textureHeight: 1024,
            textureWidth: 1024,
        });

        water.rotation.x = -Math.PI / 2;
        water.position.y = 1;
        scene.add(water);

        // 地板
        const ground = new THREE.PlaneGeometry(8, 8, 512, 512);
        const groundMesh = new THREE.Mesh(
            ground,
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(
                    require('./textures/hardwood2_diffuse.jpg')
                ),
                side: THREE.DoubleSide,
            })
        );
        groundMesh.rotation.x = Math.PI / 2;
        scene.add(groundMesh);

        /*
         * ------------ end ----------
         */

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
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
        // 自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        controls.target = new THREE.Vector3(0, 0, 0);
        let arr = () => {
            return [];
        };
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
        init();
    }, []);

    return (
        <>
            <div id="container" ref={container}></div>
        </>
    );
}
