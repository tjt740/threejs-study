/*
 * 场景组件
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
//1️⃣ 获取屏幕three.js实际渲染宽高
import './three/getScreenWidthandHeight';
//2️⃣ 导入场景
import scene from './three/scene';
//3️⃣ 导入相机
import './three/camera';
//4️⃣ 导入render
import renderer from './three/renderer';
//5️⃣  导入控制器
import './three/controls';
//6️⃣ 导入动画帧
import './three/animationFrame';
//7️⃣ 导入gui
import './three/gui/gui';
//9️⃣ 创建几何体
import createMesh from './three/utils/createMesh';

// 创建城市
import createCity from './three/mesh/city';
import '../index.less';

// 创建.hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default function Scene() {
    const containerRef = useRef(null);

    const init = () => {
        /*
         * ------------ start ----------
         */
        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 创建城市
        createCity();

        /*
         * ------------end ----------
         */

        //8️⃣ DOM承载渲染器
        containerRef.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 初始化three.js
        init();
    });

    return <div ref={containerRef} id="container"></div>;
}
