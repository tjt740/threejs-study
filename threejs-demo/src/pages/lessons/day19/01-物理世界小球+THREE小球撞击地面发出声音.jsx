import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// 导入cannon引擎
import * as CANNON from 'cannon-es';
console.log(CANNON);

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
        camera.position.set(0, 0, 45);
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

        // 设置灯光和阴影
        // 1. 设置自然光、<点光源>、<标准>网格材质（带PBR属性的都可以）  材质要满足能够对光照有反应
        // 2. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true;
        // 3. 设置光照能产生动态阴影  directionalLight.castShadow = true;
        // 4. 设置投射阴影的物体投射阴影 sphereGeometry.castShadow = true;
        // 5. 设置被投射的物体接收阴影  planGeometry.receiveShadow = true;

        // gui.add(directionalLight.shadow, 'radius')
        //     .min(1)
        //     .max(50)
        //     .step(1)
        //     .name('设置阴影模糊度');

        // gui.add(directionalLight.shadow.camera, 'near')
        //     .min(0.1)
        //     .max(30)
        //     .step(0.1)
        //     .name('设置平行光投射，距离近点的位置')
        //     .onChange(() => {
        //         // 因为平行光是正交相机，所以要重新调用相机的 updateProjectionMatrix() 方法，更新相机矩阵，才能看到效果。
        //         directionalLight.shadow.camera.updateProjectionMatrix();
        //     });

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);
        /*
         * ------------ start ----------
         */
        // 创建环境光 + 强度
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        // 创建平行光 + 强度
        const directionalLight = new THREE.DirectionalLight(
            new THREE.Color('hsl( 0.1, 1, 0.95 )'),
            0.8
        );

        directionalLight.position.set(13, 23, 2);
        // 设置光照能产生动态阴影
        directionalLight.castShadow = true;
        // 设置平行光投射出来的阴影边缘模糊度
        directionalLight.shadow.radius = 30;
        gui.add(directionalLight.position, 'x').min(0).max(50).step(1);
        gui.add(directionalLight.position, 'y').min(0).max(50).step(1);
        gui.add(directionalLight.position, 'z').min(0).max(50).step(1);
        // 设置阴影分辨率
        directionalLight.shadow.mapSize.set(3072, 3072);
        scene.add(directionalLight);

        // 创建球体和地面
        const sphereGeometry = new THREE.SphereGeometry(3, 32, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial();
        const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere1.castShadow = true;
        scene.add(sphere1);

        // 创建地面
        const floorGeometry = new THREE.PlaneGeometry(60, 60);
        const floorMaterial = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -7;
        scene.add(floor);

        // 利用cannon创建物理世界
        // 1.
        // const world = new CANNON.World({
        //     gravity: 9.8, // 重力：9.8牛
        // });
        // 2.
        const world = new CANNON.World();
        world.gravity.set(0, -9.8, 0); // x,y,z 方向力; 各个方向的力

        // Ps: Q1: THREE.js是渲染引擎 ， Cannon-es是物理引擎，怎么将两者结合呢？
        // Tjt: 在物理世界力创造小球

        // 创造物理世界小球
        const cannonSphereGeometry = new CANNON.Sphere(3);
        // 创造物理世界材质
        const cannonSphereMaterial = new CANNON.Material();
        // 创造物理世界的物体
        const cannonSphere = new CANNON.Body({
            // 物体
            shape: cannonSphereGeometry,
            // 物体材质
            material: cannonSphereMaterial,
            // 物体质量
            mass: 1, // 重量
            // 物体位置
            position: new CANNON.Vec3(0, 0, 0), // X,Y,Z位置，同THREE.js中的小球位置一致
        });
        // 将物理世界物体 放入物理世界中
        world.addBody(cannonSphere);

        // 创建物理世界平面
        const cannonPlaneShape = new CANNON.Plane();
        // 创造物理世界平面材质
        const cannonPlaneMaterial = new CANNON.Material();
        // 创造物理世界载体
        const cannonPlaneBody = new CANNON.Body();
        // 添加
        cannonPlaneBody.addShape(cannonPlaneShape);
        // 设置物理世界地面材质
        cannonPlaneBody.material = cannonPlaneMaterial;
        // 物体质量： 0时将不受重力影响；
        cannonPlaneBody.mass = 0;
        // 设置物理世界地面位置
        cannonPlaneBody.position.set(0, -7, 0);
        // 旋转物理世界平面
        cannonPlaneBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // 沿着x轴设置旋转角度 同👇
        // cannonPlaneBody.quaternion.setFromAxisAngle(
        //     new CANNON.Vec3(1, 0, 0),
        //     -Math.PI / 2
        // );
        //  将物理世界物体 放入物理世界中
        world.addBody(cannonPlaneBody);

        // 将小球材质 和 地面材质关联在一起，设置摩擦系数，使之仿真现实。https://pmndrs.github.io/cannon-es/docs/classes/ContactMaterial.html
        const cannonContactMaterial = new CANNON.ContactMaterial(
            cannonSphereMaterial,
            cannonPlaneMaterial,
            {
                friction: 0.3, // 摩擦力
                restitution: 0.8, // 弹力
            }
        );
        // 将连接材质控制器添加到cannon世界里 / 设置世界默认材质
        world.addContactMaterial(cannonContactMaterial);
        world.defaultContactMaterial = cannonContactMaterial;

        // 创建击打声音
        const hitMusic = new Audio(require('./music/metalHit.mp3'));

        function onCollideFn(e) {
            console.log('物体碰撞：', e);
            // 获取物体碰撞强度
            const hitStrength = e.contact.getImpactVelocityAlongNormal();
            console.log('碰撞强度：', hitStrength);

            // 物体撞击发出声音 （原生js写法） 如果碰撞强度>0.5，就会触发声音
            if (hitStrength > 0.5) {
                // 重新从0播放
                hitMusic.currentTime = 0;
                // 播放
                hitMusic.play();
            }
        }

        // 添加监听小球碰撞事件
        cannonSphere.addEventListener('collide', onCollideFn);

        /*
         * ------------ end ----------
         */

        renderer.setSize(WIDTH, HEIGHT);
        camera.updateProjectionMatrix();

        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        // 时间控件
        const clock = new THREE.Clock();
        // 渲染函数
        function render(t) {
            controls.update();
            // 获取秒数
            // const time = clock.getElapsedTime();

            //8️⃣ 获取前一帧到后一帧的时间差
            const deltaTime = clock.getDelta();
            //9️⃣ 监听更新物理引擎里世界的物体
            world.step(1 / 120, deltaTime);
            // 将THREE.js 中的小球与 物理世界中小球相互绑定
            sphere1.position.copy(cannonSphere.position); // === sphere1.position = cannonCube.position;

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
            物理引擎 cannon-es
            <div id="container" ref={container}></div>
        </>
    );
}
