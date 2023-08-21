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
        // scene.background = new THREE.Color(0xcccccc);
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        scene.add(camera);

        /*
         * ------------ start ----------
         */

        // 创建背景
        const createBackground = () => {
            const pointsGeometry = new THREE.BufferGeometry();
            const arr = [];
            for (let i = 0; i < 1000; i++) {
                arr[i] = (Math.random() - 0.5) * 200;
            }
            const pointsArr = new Float32Array(arr);
            pointsGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(pointsArr, 3)
            );
            // 设置<点>材质纹理
            const pointTextureLoader = new THREE.TextureLoader();
            const pointTexture = pointTextureLoader.load(
                require(`./textures/particles/1.png`)
            );

            pointTexture.magFilter = THREE.NearestFilter;
            pointTexture.minFilter = THREE.NearestFilter;
            const pointsMaterial2 = new THREE.PointsMaterial({
                // 设置<点>材质尺寸，默认1.0
                size: 0.5,
                // 材质大小随相机深度（远近而衰减），默认为true
                sizeAttenuation: true,
                // 设置<点>材质颜色
                color: new THREE.Color(0xffffff),
                // 设置纹理材质
                map: pointTexture,
                // 设置alpha贴图（黑色透明，白色完全不透明）
                alphaMap: pointTexture,
                transparent: true,
                //4️⃣ 启用顶点材质，忽略pointMaterial.color.set(xxx);
                // vertexColors: true,
                // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
                depthWrite: false,
                //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
                blending: THREE.AdditiveBlending,
            });
            const points = new THREE.Points(pointsGeometry, pointsMaterial2);
            scene.add(points);
        };

        createBackground();

        const params = {
            branch: 3, // 3条线
            radius: 10, // 直线长度（圆周半径）
            rotate: 0.3, // 线段弯曲程度
            startColor: '#ff6030',
            endColor: '#1b3984',
        };

        const createPoints = (picSize, count) => {
            // 生成自定义几何体
            const particlesGeometry = new THREE.BufferGeometry();
            const verticesArr = [];
            const colorArr = [];
            // 创建混合颜色形成渐变
            // 中心颜色
            const centerColor = new THREE.Color(params.startColor);
            // 末尾颜色
            const endColor = new THREE.Color(params.endColor);
            for (let i = 0; i < count; i++) {
                // 当前的点应该在哪个分支上 0 1 2 * (360/3)
                const branchAngle =
                    (i % params.branch) * ((2 * Math.PI) / params.branch);

                // 随机位置
                const randomPosition = Math.random() * params.radius;

                // 3个下标为一组
                const current = i * 3;

                // 随机xyz值
                const randomX =
                    (Math.pow(Math.random() * 2 - 1, 3) *
                        (params.radius - randomPosition)) /
                    5;
                const randomY =
                    (Math.pow(Math.random() * 2 - 1, 3) *
                        (params.radius - randomPosition)) /
                    5;
                const randomZ =
                    (Math.pow(Math.random() * 2 - 1, 3) *
                        (params.radius - randomPosition)) /
                    3;

                // x 轴位置
                // 根据每个点的位置渲染到对应的角度 Math.cos(A) = b/c 邻边比斜边，已知cos(A) = xxx , 则c = cos(A) * b;
                verticesArr[current] =
                    Math.cos(branchAngle + randomPosition * params.rotate) *
                        randomPosition +
                    randomX;

                // y轴位置
                verticesArr[current + 1] = 0 + randomY;

                // z 轴位置  已知 cos(A)= b/c , c = cos(A)*b;  因为是圆周，所以b=c,则 sin(A)= x/c。 x= sin(A)*c;
                verticesArr[current + 2] =
                    Math.sin(branchAngle + randomPosition * params.rotate) *
                        randomPosition +
                    randomZ;

                // 创建混合颜色
                // 克隆颜色
                const mixColor = centerColor.clone();
                mixColor.lerp(endColor, randomPosition / params.radius);
                colorArr[current] = mixColor.r;
                colorArr[current + 1] = mixColor.g;
                colorArr[current + 2] = mixColor.b;
            }
            console.log(verticesArr);
            // 创建配置数组
            const vertices = new Float32Array(verticesArr);
            particlesGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(vertices, 3)
            );
            // 创建随机颜色数组
            const colors = new Float32Array(colorArr);
            // console.log(colors);
            particlesGeometry.setAttribute(
                'color',
                new THREE.BufferAttribute(colors, 3)
            );

            // 设置<点>材质纹理
            const pointTextureLoader = new THREE.TextureLoader();
            const pointTexture = pointTextureLoader.load(
                require(`./textures/particles/1.png`)
            );
            pointTexture.magFilter = THREE.NearestFilter;
            pointTexture.minFilter = THREE.NearestFilter;

            // 使用<点>材质
            const pointsMaterial = new THREE.PointsMaterial({
                // 设置<点>材质尺寸，默认1.0
                size: picSize,
                // 材质大小随相机深度（远近而衰减），默认为true
                sizeAttenuation: true,
                // 设置<点>材质颜色
                color: new THREE.Color(0xffffff),
                // 设置纹理材质
                map: pointTexture,
                // 设置alpha贴图（黑色透明，白色完全不透明）
                alphaMap: pointTexture,
                transparent: true,
                //4️⃣ 启用顶点材质，忽略pointMaterial.color.set(xxx);
                vertexColors: true,
                // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
                depthWrite: false,
                //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
                blending: THREE.AdditiveBlending,
            });

            // 生成<点>物体
            const sphere = new THREE.Points(particlesGeometry, pointsMaterial);
            scene.add(sphere);
            return sphere;
        };

        const points1 = createPoints(0.3, 5000);
        // const points2 = createPoints(0.3);
        // const points3 = createPoints()
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
            const time = clock.getElapsedTime();
            points1.rotation.y = time * 0.5;
            // points2.rotation.x = time * 1;
            // points3.rotation.x = time * 1.5;
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
