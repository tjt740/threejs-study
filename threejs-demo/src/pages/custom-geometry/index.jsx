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
        camera.position.set(0, 0, 10);
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

const geometry = new THREE.BufferGeometry()

//设置顶点坐标

const vertices = new Float32Array([
 //底部的矩形
 -3, 0, 0,
 -3, 0, 2,
 3, 0, 2,
 
 -3, 0, 0,
 3, 0, 2,
 3, 0, 0,
 //顶部的矩形
 -1.5, 2, 0.5,
 -1.5, 2, 1.5,
 1.5, 2, 1.5,
 -1.5, 2, 0.5,
 1.5, 2, 1.5,
 1.5, 2, 0.5,
 //侧面
-3,0,0,
-1.5,2,1.5,
-1.5,2,0.5,
 -3,0,0,
 -3,0,2,
 -1.5,2,1.5,
 1.5,2,1.5,
 3,0,0,
 1.5,2,0.5,
 3,0,2,
 3,0,0,
    1.5, 2, 1.5,
 
 //正面
 3,0,2,
 -1.5,2,1.5,
 -3,0,2,
 3,0,2,
 1.5,2,1.5,
 -1.5,2,1.5,

 //背面
 -1.5,2,0.5,
 3,0,0,
 -3,0,0.5,

 1.5,2,0.5,
 3,0,0,
 -1.5,2,0.5,
 //底面
 -3,0,2,
 -3,0,0,
 3,0,2,

     3,0,0,
 3,0,2,
 -3,0,0
])

  


///连接顶点

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

//材质

const material = new THREE.MeshBasicMaterial({  color,
    opacity: 0.3,
    transparent: true, });

//生成物体
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

        // let splinepts = [];
        // splinepts.push(new THREE.Vector2(0, 0));
        // splinepts.push(new THREE.Vector2(0, 20));
        // splinepts.push(new THREE.Vector2(10, 30));
        // splinepts.push(new THREE.Vector2(30, 30));
        // splinepts.push(new THREE.Vector2(40, 20));
        // splinepts.push(new THREE.Vector2(40, 0));

        // let splineShape = new THREE.Shape(splinepts);
        // let geometry = new THREE.ShapeGeometry(splineShape);
        // let mesh = new THREE.Mesh(
        //     geometry,
        //     new THREE.MeshBasicMaterial({
        //         side: THREE.DoubleSide,
        //         color,
        //         opacity: 0.3,
        //         transparent: true,
        //     })
        // );
        // scene.add(mesh);

        // const length = 12, width = 8;

        // const shape = new THREE.Shape();
        // shape.moveTo( 0,0 );
        // shape.lineTo( 0, 8 );
        // shape.lineTo( 12, 8 );
        // shape.lineTo( 12, 0 );
        // shape.lineTo( 0, 0 );
        
        // const extrudeSettings = {
        //     steps: 2,
        //     depth: 16,
        //     bevelEnabled: true,
        //     bevelThickness: 4,
        //     bevelSize: 4,
        //     bevelOffset: 0,
        //     bevelSegments: 1
        // };
        
        // const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        // const material = new THREE.MeshBasicMaterial({
        //     side: THREE.DoubleSide,
        //             color,
        //             opacity: 0.7,
        //     transparent: true,
        // });
        // const mesh = new THREE.Mesh( geometry, material ) ;
        // scene.add( mesh );
        
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
