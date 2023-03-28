import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function CustomCom() {
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
        camera.position.set(0, 0, 400);
        scene.add(camera);

        const color = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
        );
        /*
         * ------------ start ----------
         */
        //初始化BufferGeometry

        const geometry = new THREE.BufferGeometry();

        //设置顶点坐标

        const vertices = new Float32Array([
            //底部的矩形
            -3, 0, 0, -3, 0, 2, 3, 0, 2,

            -3, 0, 0, 3, 0, 2, 3, 0, 0,
            //顶部的矩形
            -1.5, 2, 0.5, -1.5, 2, 1.5, 1.5, 2, 1.5, -1.5, 2, 0.5, 1.5, 2, 1.5,
            1.5, 2, 0.5,
            //侧面
            -3, 0, 0, -1.5, 2, 1.5, -1.5, 2, 0.5, -3, 0, 0, -3, 0, 2, -1.5, 2,
            1.5, 1.5, 2, 1.5, 3, 0, 0, 1.5, 2, 0.5, 3, 0, 2, 3, 0, 0, 1.5, 2,
            1.5,

            //正面
            3, 0, 2, -1.5, 2, 1.5, -3, 0, 2, 3, 0, 2, 1.5, 2, 1.5, -1.5, 2, 1.5,

            //背面
            -1.5, 2, 0.5, 3, 0, 0, -3, 0, 0.5,

            1.5, 2, 0.5, 3, 0, 0, -1.5, 2, 0.5,
            //底面
            -3, 0, 2, -3, 0, 0, 3, 0, 2,

            3, 0, 0, 3, 0, 2, -3, 0, 0,
        ]);

        ///连接顶点

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(vertices, 3)
        );

        //材质

        const material = new THREE.MeshBasicMaterial({
            color,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        //生成物体
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

       

        // for(let i =0 ; i< 12; i++){
        //     let aspect = 12/ 4;
        //     if(i < aspect){
        //     let j = i * 4 ;
        //     let a = j;
        //     let b = j+1 ;
        //     let c = j+ 2;
        //         let d = j+3
        //         console.log(a , b , c,d );
        //     }}

        const points = [];
        const res = [
            // [36, 0, 0],
            // [344, 0, 0],
            // [36, 244, 0],
            // [344, 244, 0],
            // [0, 0, 30],
            // [380, 0, 30],
            // [0, 244, 30],
            // [380, 244, 0],
            // [0, 0, 160],
            // [380, 0, 160],
            // [0, 244, 160],
            // [380, 244, 160]
            // 第一层
            [0, 0, 0],
            [200, 0, 0],
            [200, 0, 200],
            [0, 0, 200],
            // [0, 0, 0],//
            // 第二层
            [-50, 75, 0],
            [250, 75, 0],
            [250, 75, 200],
            [-50, 75, 200],
            // [-50, 75, 0],//
            // 第三层
            [-50, 150, 0],
            [250, 150, 0],
            [250, 150, 200],
            [-50, 150, 200],
            // [-50, 150, 0],//
        ];

        const fn = (vertices) => {
            const proportion = vertices.length / 4;
            return vertices.reduce(
                (prev, _, idx) => {
                    if (idx < proportion) {
                        let j = idx * 4;
                        let startIndex = j;
                        let endIndex = j + 3;
                        prev.splice(endIndex + 1 + idx, 0, vertices[startIndex]);
                    }

                    return prev;
                },
                [...vertices]
            );
        };

        const newArr = fn(res);


        // 画线点层数
        const proportionNewArr = newArr.length / 5;
        // 横线数组
        const groupHorizontal = new THREE.Group();
        // 垂直线数组
        const groupVertical = new THREE.Group();
        const geo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-50, 75, 0)]);
        const line2 = new THREE.Line(geo2, new THREE.MeshBasicMaterial({color:new THREE.Color(0x7777ff)}))
        groupVertical.add(line2);
        scene.add(groupVertical);

        const material2 = new THREE.LineBasicMaterial({
            color: 0x0000ff,
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
              
                const geometry = new THREE.BufferGeometry().setFromPoints(verticesArr);
                console.log(verticesArr);
                const line = new THREE.Line(geometry, material2);
                groupHorizontal.add(line);
            }
        }
        console.log(groupHorizontal);
        scene.add(groupHorizontal);




        // res.forEach((v,i) => {
        //     points[i] = new THREE.Vector3(v[0], v[1], v[2]);
        // })

        // console.log(points);
        // // points.push( new THREE.Vector3( - 10, 0, 0 ) );
        // // points.push( new THREE.Vector3( 0, 10, 0 ) );
        // // points.push( new THREE.Vector3( 10, 0, 0 ) );

        // const geometry2 = new THREE.BufferGeometry().setFromPoints( points );

        // const line = new THREE.Line( geometry2, material2 );
        // scene.add( line );

        /*
         * ------------ end ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        // scene.add(axesHelper);

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
            清除物体
            <div id="container" ref={container}></div>
        </>
    );
}
