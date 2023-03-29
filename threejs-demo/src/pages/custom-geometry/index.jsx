import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
export default function CustomCom() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        scene.background = new THREE.Color(0x969696);
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 100, 600);

        const gui = new dat.GUI();
        const cameraGui = gui.addFolder('调整相机视角');
        cameraGui.add(camera.position, 'x').min(1).max(1000).step(10);
        cameraGui.add(camera.position, 'y').min(1).max(1000).step(10);
        cameraGui.add(camera.position, 'z').min(1).max(1000).step(10);

        scene.add(camera);

        /*
         * ------------ start ----------
         */

        const points = [];
        const res = [
            // 第一种
                // [0, 0, 0],
                // [400, 0, 0],
                // [400, 300, 0],
                // [0, 300, 0],
                // [0, 0, 200],
                // [400, 0, 200],
                // [400, 300, 200],
                // [0, 300, 200],
                // [0, 0, 200],
                // [400, 0, 200],
                // [400, 300, 200],
                // [0, 300, 200]
            
            // 第二种 
            
                [0, 0, 0],
                [400, 0, 0],
                [400, 300, 0],
                [0, 300, 0],
                [0, 0, 150],
                [400, 0, 150],
                [400, 300, 150],
                [0, 300, 150],
                [40, 0, 200],
                [360, 0, 200],
                [360, 300, 200],
                [40, 300, 200]
            
            
            
            // // 第一层
            // [0, 0, 0],
            // [200, 0, 0],
            // [200, 0, 200],
            // [0, 0, 200],
            // // [0, 0, 0],//
            // // 第二层
            // [-50, 55, 0],
            // [250, 55, 0],
            // [250, 55, 200],
            // [-50, 55, 200],
            // // [-50, 75, 0],//
            // // 第三层
            // [-50, 150, 0],
            // [250, 150, 0],
            // [250, 150, 200],
            // [-50, 150, 200],
            // // [-50, 150, 0],//
        ];

        // 垂直线数组
        const groupVertical = new THREE.Group();
        const layers2 = (vertices) => {
            // 基层
            const proportion = vertices.length / 4;
            // 数组数
            const floorNum = vertices.length / 3;
            // 柱数
            const lengthNumber =
                vertices.length / 2 + vertices.length / proportion / 2;

            const verticesArr1 = [];
            const verticesArr2 = [];
            const verticesArr3 = [];
            const verticesArr4 = [];

            for (let i = 0; i < vertices.length; i++) {
                const j = i * 4;
                const a = j;
                const b = j + 1;
                const c = j + 2;
                const d = j + 3;

                if (j < vertices.length) {
                    verticesArr1.push(
                        new THREE.Vector3(
                            vertices[a][0],
                            vertices[a][1],
                            vertices[a][2]
                        )
                    );
                    verticesArr2.push(
                        new THREE.Vector3(
                            vertices[b][0],
                            vertices[b][1],
                            vertices[b][2]
                        )
                    );
                    verticesArr3.push(
                        new THREE.Vector3(
                            vertices[c][0],
                            vertices[c][1],
                            vertices[c][2]
                        )
                    );
                    verticesArr4.push(
                        new THREE.Vector3(
                            vertices[d][0],
                            vertices[d][1],
                            vertices[d][2]
                        )
                    );

                    if (verticesArr1.length > 2) {
                        verticesArr1.shift();
                        verticesArr2.shift();
                        verticesArr3.shift();
                        verticesArr4.shift();
                    }
                    if (verticesArr1.length === 2) {
                        const verticesArrList = [
                            verticesArr1,
                            verticesArr2,
                            verticesArr3,
                            verticesArr4,
                        ];
                        for (let k = 0; k < verticesArrList.length; k++) {
                            const geo =
                                new THREE.BufferGeometry().setFromPoints(
                                    verticesArrList[k]
                                );
                            const verticalLine = new THREE.Line(
                                geo,
                                new THREE.MeshBasicMaterial({
                                    color: new THREE.Color(0x000000),
                                })
                            );
                            groupVertical.add(verticalLine);
                            groupVertical.position.x = -100;
                        }
                    }
                }
            }
            scene.add(groupVertical);
        };
        const newArr2 = layers2(res);
        // const geo2 = new THREE.BufferGeometry().setFromPoints([
        //     // new THREE.Vector3(0, 0, 0),
        //     // new THREE.Vector3(-50, 75, 0),
        //     new THREE.Vector3(200, 0, 0),
        //     new THREE.Vector3(250, 75, 0),
        // ]);
        // const line2 = new THREE.Line(
        //     geo2,
        //     new THREE.MeshBasicMaterial({ color: new THREE.Color(0x000000) })
        // );
        // groupVertical.add(line2);
        // // groupVertical.position.x = -200;
        // scene.add(groupVertical);

        // layers
        const layers = (vertices) => {
            const proportion = vertices.length / 4;
            return vertices.reduce(
                (prev, _, idx) => {
                    if (idx < proportion) {
                        let j = idx * 4;
                        let startIndex = j;
                        let endIndex = j + 3;
                        prev.splice(
                            endIndex + 1 + idx,
                            0,
                            vertices[startIndex]
                        );
                    }

                    return prev;
                },
                [...vertices]
            );
        };

        const newArr = layers(res);
        // 画线点层数
        const proportionNewArr = newArr.length / 5;
        // 横线数组
        const groupHorizontal = new THREE.Group();
        // 材质
        const material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
        });
        for (let i = 0; i < newArr.length; i++) {
            const verticesArr = [];
            const j = i * 5;
            const a = j;
            const b = j + 1;
            const c = j + 2;
            const d = j + 3;
            const e = j + 4;

            if (i < proportionNewArr) {
                verticesArr.push(
                    new THREE.Vector3(newArr[a][0], newArr[a][1], newArr[a][2]),
                    new THREE.Vector3(newArr[b][0], newArr[b][1], newArr[b][2]),
                    new THREE.Vector3(newArr[c][0], newArr[c][1], newArr[c][2]),
                    new THREE.Vector3(newArr[d][0], newArr[d][1], newArr[d][2]),
                    new THREE.Vector3(newArr[e][0], newArr[e][1], newArr[e][2])
                );

                const geometry = new THREE.BufferGeometry().setFromPoints(
                    verticesArr
                );
                // console.log(verticesArr);
                const line = new THREE.Line(geometry, material);
                groupHorizontal.add(line);
                groupHorizontal.position.x = -100;
            }
        }
        scene.add(groupHorizontal);

        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        const placeMaterial = new THREE.MeshBasicMaterial({
            color: 0x7c8891,
            side: THREE.DoubleSide,
        });
        const floor = new THREE.Mesh(planeGeometry, placeMaterial);
        floor.rotation.x = -(Math.PI / 2);
        floor.position.set(0, -10, 100);

        scene.add(floor);

        /*
         * ------------ end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(1000);
        //  坐标辅助线添加到场景中
        // scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
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

        //
        camera.updateProjectionMatrix();

        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
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
            清除物体
            <div id="container" ref={container}></div>
        </>
    );
}
