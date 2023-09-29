import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import scene from '../../three/scene';
import camera from '../../three/camera';
import renderer from '../../three/renderer';
import controlsModule from '../../three/controls';
import animation from '../../three/animation';
import gui from '../../three/gui';
import gsap from '../../three/gsap';
import windowDom2 from '../../three/windowDom2';
// 添加光线
import ambientLight from '../../three/ambientLight';
import directionalLight from '../../three/directionalLight';

// 辅助线
import axesHelper from '../../three/axesHelper';

// 加载工厂模型
// import '../../mesh/init-model';
// 加载战斗机模型
import '../../mesh/init-fighter';

export default function Scene() {
    const containerRef = useRef(null);

    const init = () => {
        // DOM承载渲染器
        containerRef.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        // 初始化three.js
        init();
    });

    return <div ref={containerRef} id="container"></div>;
}
