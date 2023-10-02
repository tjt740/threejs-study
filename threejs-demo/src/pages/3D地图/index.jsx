import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// CSM 阴影
import { CSM } from 'three/addons/csm/CSM.js';
// 引入axios请求
import axios from 'axios';
import { message } from 'antd';

// 安装d3组件库
import * as d3 from 'd3';

// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
// 引入gsap补间动画操作组件库
import gsap from 'gsap';
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
const gui = new GUI({
    // 设置gui title
    title: 'gui控制器(点击展开)',
    // 收起分区，默认false
    closeFolders: true,
    // 自动生成在页面右上角，默认为true
    autoPlace: true,
});

// import * as dat from 'dat.gui';
// const gui = new dat.GUI();

export default function ThreeComponent() {
    const containerRef = useRef(null);

    // 实际three.js渲染区域
    const WIDTH =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        ) || window.innerWidth;
    const HEIGHT =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        ) || window.innerHeight;

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0xd2d0d0);
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            45, // 90
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 20);
        // 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
        //     scene.position.x,
        //     scene.position.y,
        //     scene.position.z
        // );
        // 摄像机看向方向（可以是场景中某个物体）
        camera.lookAt(scene.position);

        // 摄像机添加到场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        // scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
            // 设置对数深度缓冲区，优化深度冲突问题，当两个面间隙过小，或者重合，你设置webgl渲染器对数深度缓冲区也是无效的。
            logarithmicDepthBuffer: true,
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        renderer.outputColorSpace = 'srgb';
        // 色调映射 THREE.NoToneMapping || THREE.LinearToneMapping || THREE.ReinhardToneMapping || THREE.CineonToneMapping || THREE.ACESFilmicToneMapping
        renderer.toneMapping = THREE.NoToneMapping;
        // 色调映射的曝光级别。默认是1，屏幕是2.2，越低越暗
        renderer.toneMappingExposure = 2.2;

        // 改变渲染器尺寸
        renderer.setSize(WIDTH, HEIGHT);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 设置软阴影（不再是像素阴影）
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能（已被移除）.
        // renderer.physicallyCorrectLights = true;

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
        controls.dampingFactor = 0.05;
        // 自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        controls.target = new THREE.Vector3(
            scene.position.x,
            scene.position.y,
            scene.position.z
        );

        /*
         * ------------ start ----------
         */
        const mapGroup = new THREE.Group();

        // 获取地图信息
        axios
            .get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
            .then((res) => {
                console.log(res);
                message.success('接口请求成功😆');
                // 获取省份信息
                const {
                    data: { features },
                } = res;

                // 渲染点信息
                // 获取各个省份的坐标信息+地理坐标点信息
                // 使用d3.js 设置原点偏移，首都经纬坐标 北京市[116.405285, 39.904989]
                const projection = d3
                    .geoMercator()
                    .center([116.405285, 39.904989]) // 首都经纬坐标 北京市[116.405285, 39.904989]
                    .translate([0, 0, 0]);

                for (let i = 0; i < features.length; i++) {
                    // console.log('各省地理坐标信息:', features[i].geometry.type);

                    // 单个省份 对象
                    const province = new THREE.Object3D();
                    province.name = features[i].properties.name;

                    // 处理数据拿到点信息
                    if (features[i].geometry.type === 'MultiPolygon') {
                        features[i].geometry.coordinates.forEach((item) => {
                            // 创建各省图形(各省 坐标信息)
                            const proviceMapMesh = extrudeMap(item, projection);

                            // 创建线框图形
                            const lineMesh = lineMap(item, projection);

                            // 添加图形
                            province.add(proviceMapMesh);
                            // 添加图形
                            province.add(lineMesh);
                        });
                    }

                    // 数据结构不一致才需要这么操作
                    if (features[i].geometry.type === 'Polygon') {
                        // 创建各省图形(各省 坐标信息)
                        const proviceMapMesh = extrudeMap(
                            new Array(features[i].geometry.coordinates[0]),
                            projection
                        );
                        // 添加图形
                        province.add(proviceMapMesh);

                        // 创建线框图形
                        const lineMesh = lineMap(
                            new Array(features[i].geometry.coordinates[0]),
                            projection
                        );

                        // 添加图形
                        province.add(lineMesh);
                    }

                    console.log(mapGroup);
                    // 场景添加
                    scene.add(province);
                }
            })
            .catch((err) => {
                message.error('接口请求失败');
            });

        // 生成挤压图形地图
        function extrudeMap(coordinates, projection) {
            // 创建图形Shape
            const shape = new THREE.Shape();

            for (let j = 0; j < coordinates[0].length; j++) {
                // 修正数据,修正后的数据y轴会反过来，需要自己手动将坐标改成-y
                const projectionXY = projection(coordinates[0][j]);
                const x = projectionXY[0];
                const y = projectionXY[1];

                if (!j) {
                    // 第一个值用 .moveTo()
                    shape.moveTo(x, -y);
                } else {
                    // 其余点用 .lineTo()
                    shape.lineTo(x, -y);
                }
            }

            // 生成挤压几何体
            const extrudeGeometry = new THREE.ExtrudeGeometry(shape, {
                // 挤压深度
                depth: 5,
                bevelEnabled: true,
            });

            // 随机颜色
            const randomColor = (0.5 + Math.random() * 0.5) * 0xffffff;

            const extrudeMaterial = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: randomColor,
                transparent: true,
                opacity: 0.5,
            });
            // return出 Mesh
            return new THREE.Mesh(extrudeGeometry, extrudeMaterial);
        }

        // 生成线框地图
        function lineMap(coordinates, projection) {
            const lineGeometry = new THREE.BufferGeometry();
            const pointsArray = [];
            for (let j = 0; j < coordinates[0].length; j++) {
                // 修正数据,修正后的数据y轴会反过来，需要自己手动将坐标改成-y
                const projectionXY = projection(coordinates[0][j]);
                const x = projectionXY[0];
                const y = projectionXY[1];
                // 创建三维点
                pointsArray.push(new THREE.Vector3(x, -y, 9));
            }

            // 放入多个点
            lineGeometry.setFromPoints(pointsArray);

            // 生成随机颜色
            const lineColor = new THREE.Color(
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5
            );

            const lineMaterial = new THREE.LineBasicMaterial({
                color: lineColor,
            });
            return new THREE.Line(lineGeometry, lineMaterial);
        }

        /*
         * ------------end ----------
         */

        // 渲染函数
        function animation(t) {
            // 控制器更新
            controls.update();
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(animation);
        }
        // 渲染动画帧
        animation();

        // DOM承载渲染器
        containerRef.current.appendChild(renderer.domElement);

        // 控制是否全屏
        const eventObj = {
            Fullscreen: function () {
                // 全屏
                document.body.requestFullscreen();
                console.log('全屏');
            },
            ExitFullscreen: function () {
                document.exitFullscreen();
                console.log('退出全屏');
            },
        };

        gui.add(eventObj, 'Fullscreen').name('全屏');
        gui.add(eventObj, 'ExitFullscreen').name('退出全屏');

        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 实际three.js渲染区域
            const WIDTH =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .width.split('px')[0]
                ) || window.innerWidth;
            const HEIGHT =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .height.split('px')[0]
                ) || window.innerHeight;
            // 更新camera 宽高比;
            camera.aspect = WIDTH / HEIGHT;
            /* 
                更新camera 投影矩阵
                .updateProjectionMatrix () : undefined
                更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
                */
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(WIDTH, HEIGHT);
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
            <div id="container" ref={containerRef}></div>
        </>
    );
}
