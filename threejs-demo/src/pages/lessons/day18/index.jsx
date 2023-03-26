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
        // scene.background = new THREE.Color(0x444444);
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        scene.add(camera);

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

        /*
         * ------------ start ----------
         */

        // 创建 n 个矩形
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        // 基础材质
        const material = new THREE.MeshBasicMaterial({
            wireframe: true,
        });
        // 被选中后的材质
        const selectMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xff0000),
            opacity: 0.1,
        });

        // 存储数据的数据
        const dataArr = [];
        for (let i = -3; i < 3; i++) {
            for (let j = -3; j < 3; j++) {
                for (let k = -3; k < 3; k++) {
                    const boxCube = new THREE.Mesh(boxGeometry, material);
                    boxCube.position.set(i, j, k);
                    scene.add(boxCube);
                    dataArr.push(boxCube);
                }
            }
        }

        // 创建射线
        const raycaster = new THREE.Raycaster();
        // 射线捕捉的最远距离,超过该距离后就不会捕捉对应的物体,默认Infinity(无穷远)
        raycaster.far = 10;
        // 射线捕捉的最近距离,小于该距离就无法捕捉对应的物体. 不能为空,要不far小
        raycaster.near = 3;
        // 创建鼠标点
        const mouse = new THREE.Vector2();
        // 监听鼠标位置
        function onClick(e) {
            // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 —— 1)
            // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            // 修复点击事件精度
            mouse.x =
                ((e.clientX - renderer.domElement.offsetLeft) /
                    renderer.domElement.clientWidth) *
                    2 -
                1;

            mouse.y =
                -(
                    (e.clientY - renderer.domElement.offsetTop) /
                    renderer.domElement.clientHeight
                ) *
                    2 +
                1;
            // 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
            raycaster.setFromCamera(mouse, camera);
            // 检测照射结果
            const intersects = raycaster.intersectObjects(dataArr);

            // 计算物体和射线的焦点
            if (intersects.length > 1) {
                // 获取第一个选中结果。
                const intersected = intersects[0].object;
                const findItem =  dataArr.find(v => v.uuid === intersected.uuid);
                console.log(findItem);
                findItem.material = selectMaterial;

                // 全部选中 
                intersects.forEach(i => i.object.material = selectMaterial)
            }
        }

        // 全局添加点击事件
        window.addEventListener('click', onClick);
        /*
         * ------------end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();

        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

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
