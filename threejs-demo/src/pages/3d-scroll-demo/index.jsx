import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import './index.css';
export default function ThreeComponent() {
    const container = useRef(null);
    const gui = new dat.GUI();
    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0x444444);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 30);
        scene.add(camera);

        gui.add(camera.position, 'z').min(-500).max(500).step(1);
        gui.add(camera.position, 'y').min(-500).max(500).step(1);
        gui.add(camera.position, 'x').min(-500).max(500).step(1);
        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({ alpha: true });

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

        function createRaycasterDemo() {
            const group = new THREE.Group();
            // 创建 n 个矩形
            const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
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
                        boxCube.position.set(i * 2 + 1, j * 2, k * 2); // 2: 矩形宽度
                        group.add(boxCube);
                        dataArr.push(boxCube);
                    }
                }
            }
            // 将创建的 boxCube 合组放到group中，最后由scene.add(group)来添加到场景中
            scene.add(group);

            // 创建射线
            const raycaster = new THREE.Raycaster();
            // 射线捕捉的最远距离,超过该距离后就不会捕捉对应的物体,默认Infinity(无穷远)
            // raycaster.far = 10;
            // 射线捕捉的最近距离,小于该距离就无法捕捉对应的物体. 不能为空,要不far小
            // raycaster.near = 3;
            // 创建鼠标点
            const mouse = new THREE.Vector2();
            // 监听鼠标位置
            function onClick(e) {
                // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 —— 1)
                // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                // 修复点击事件精度

                mouse.x =
                    ((e.clientX - (renderer.domElement.offsetLeft || 256)) /
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
                    const findItem = dataArr.find(
                        (v) => v.uuid === intersected.uuid
                    );
                    console.log(findItem);
                    findItem.material = selectMaterial;

                    // 全部选中
                    intersects.forEach(
                        (i) => (i.object.material = selectMaterial)
                    );
                }
            }

            // 全局添加点击事件
            renderer.domElement.addEventListener('click', onClick);
            group.position.z = 5;
            return group;
        }

        function createPointLightDemo() {
            // 创建环境光 + 强度
            const group = new THREE.Group();
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            group.add(ambientLight);

            // 创建<点光源> （类似灯泡）
            const pointLight = new THREE.PointLight(0xff0000, 1);
            // 设置<点光源>照射范围距离，值越大，照射范围越远。默认值为100。
            pointLight.distance = 100;
            // 设置<点光源>动态阴影（真实阴影）
            pointLight.castShadow = true;
            // 设置<点光源>光线衰退量，越大灯光越弱，默认值为2
            pointLight.decay = 2;
            // 设置<点光源>光照强度，默认为1
            pointLight.intensity = 3;
            // 设置<点光源>光照功率，默认为 4。 pointLight.intensity * 4 * Math.PI;
            pointLight.power = pointLight.intensity * 300 * Math.PI;
            // <点光源>位置设置

            // 模拟灯光位置
            const mockSphereGeometry = new THREE.SphereGeometry(1, 32, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00,
            });
            const mockSphere = new THREE.Mesh(
                mockSphereGeometry,
                sphereMaterial
            );
            // 小球位置设置
            mockSphere.position.set(10, 15, 15);
            // 小球上添加点光源
            mockSphere.add(pointLight);
            group.add(mockSphere);

            // 设置阴影分辨率,值越大分辨率越高,默认 512*512
            pointLight.shadow.mapSize.set(3072, 3072);
            // 设置阴影的边缘模糊度
            pointLight.shadow.radius = 50;
            // 设置<点光源>投射相机的属性
            // 设置<点光源>相机投射阴影时，距离近点（<点光源>位置）的距离
            pointLight.shadow.camera.near = 0.5;
            // 设置<点光源>相机投射阴影时，距离远点（<点光源>位置）的距离
            pointLight.shadow.camera.far = 500;
            // 设置<点光源>相机投射阴影的位置（暂时没发现有啥用）
            pointLight.shadow.camera.top = 5;
            pointLight.shadow.camera.bottom = -5;
            pointLight.shadow.camera.left = -5;
            pointLight.shadow.camera.right = 5;
            // scene.add(pointLight);

            // 创建球形几何体
            // Ps: 这个5 改成10 阴影就成 方形了 ？
            const sphereGeometry = new THREE.SphereGeometry(5, 64, 16);
            // 使用标准网格材质渲染 环境贴图
            const material = new THREE.MeshStandardMaterial();
            // 生成圆形几何体
            const sphere = new THREE.Mesh(sphereGeometry, material);

            // 设置物体投射阴影
            sphere.castShadow = true;

            group.add(sphere);

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
            group.add(plan);

            // group.position.y = -Number(
            //     window
            //         .getComputedStyle(
            //             document.getElementsByClassName('page')[0]
            //         )
            //         .height.split('px')[0]
            // );

            scene.add(group);
            return group;
        }

        function createBufferGeometry() {
            const group = new THREE.Group();
            // 创建多个三角形
            for (let i = 0; i <= 20; i++) {
                // 创建几何体
                const geometry = new THREE.BufferGeometry();
                // 创建多少个点，三个点为一组三角形
                const count = 9;

                const vertexPosition = new Float32Array(count);
                //     const vertexPosition =new  Float32Array([
                //         1.0, 1.0, 0,  // 顶点1,XYZ坐标
                //         1.0, 5.0, 0,  // 顶点2,XYZ坐标
                //         5.0, 5.0, 0,  // 顶点3,XYZ坐标
                //         5.0, 5.0, 0,
                //         5.0, 1.0, 0, // 顶点4,XYZ坐标
                //         1.0, 1.0, 0,
                //    ]);
                // 设置每个物体里的顶点坐标
                for (let j = 0; j < count; j++) {
                    vertexPosition[j] = Math.random() * 10 - 5;
                }
                // console.log(vertexPosition);
                // console.log('geometry:', geometry);
                geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(vertexPosition, 3)
                );
                // 设置随机颜色
                const color = new THREE.Color(
                    Math.random(),
                    Math.random(),
                    Math.random()
                );
                // 设置材质
                const material = new THREE.MeshBasicMaterial({
                    color,
                    opacity: 0.3,
                    transparent: true,
                });

                // 网格+材质=物体
                const cube = new THREE.Mesh(geometry, material);
                group.add(cube);
            }

            const geometry = new THREE.BoxGeometry(10, 10, 10);
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({ color: 0xffffff })
            );
            group.add(line);
            scene.add(group);
            group.position.z = 10;
            return group;
        }

        const demo1 = createRaycasterDemo();
        const demo2 = createPointLightDemo();
        const demo3 = createBufferGeometry();

        let scrollY = 0;
        // 获取一页的高度
        let pageHeight = Number(
            window
                .getComputedStyle(document.getElementsByClassName('page')[0])
                .height.split('px')[0]
        );
        let pageCurrent = 0;

        // 设置 小球demo 在下一页高度
        demo2.position.y = -pageHeight;
        demo3.position.y = -pageHeight * 2;

        // 配合 gsap 动画效果
        let arrGroup = [demo1, demo2, demo3]; // [group,group,group];

        // 3️⃣ 添加滚动事件
        window.addEventListener(
            'scroll',
            () => {
                // 获取滚动距离
                scrollY =
                    document
                        ?.getElementsByClassName('page')[0]
                        ?.getBoundingClientRect()?.y - 16;
                // console.log('滚动高度:', Math.abs(scrollY)); // Math.abs() 绝对值

                // 获取当前的滚动在第几页 0 1 2
                pageCurrent = Math.abs(Math.round(scrollY / pageHeight));
                console.log(`第${pageCurrent}页`);
                demo1.position.y = Math.abs(scrollY);
                demo2.position.y = -(pageHeight - Math.abs(scrollY));
                demo3.position.y = -(pageHeight * 2 - Math.abs(scrollY));

                // gsap 的api tween和timeline 里的config都是通用的
                gsap.to(arrGroup[pageCurrent].rotation, {
                    y: '+=' + Math.PI * 2,
                    duration: 3,
                    ease: 'power2.inOut',
                    repeat: -1,
                });
            },
            true
        );

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

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;

        // 渲染函数
        const clock = new THREE.Clock();

        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);
            // 3d射线demo
            // demo1.rotation.y = time * 0.3;
            // 小球灯光demo
            // demo2.rotation.y = time * 0.4;
            demo2.children[1].position.x = Math.sin(time) * 10;
            demo2.children[1].position.z = Math.cos(time) * 10;
            // 多个三角形demo
            // demo3.rotation.y = time * 0.5;

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        /*
         * ------------end ----------
         */
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
            <div className="container">
                <div className="page page1">
                    <h1>THREE.Raycaster 投射光线</h1>
                    <h2>实现3D交互</h2>
                </div>
                <div className="page page2">
                    <h1>THREE.SpotLight 聚光灯</h1>
                    <h2>实现光影投射小球阴影</h2>
                </div>
                <div className="page page3">
                    <h1>THREE.BufferGeometry 自定义几何体</h1>
                    <h2>生成无序颜色三角形</h2>
                </div>
                <div id="container" ref={container}></div>
            </div>
        </>
    );
}
