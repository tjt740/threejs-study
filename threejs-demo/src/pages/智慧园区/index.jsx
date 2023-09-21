import React, { useEffect, useRef } from 'react';

import scene from './three/scene';
import camera from './three/camera';
import renderer from './three/renderer';
import controls from './three/controls';
import animation from './three/animation';
import gui from './three/gui';
import gsap from './three/gsap';
import windowDom2 from './three/windowDom2';
// 辅助线
import axesHelper from './three/axesHelper';
// 全局加载管理器
// import defaultLoadingManager from './three/defaultLoadingManager';

// city加载
import './three/mesh/city/city';

export default function ThreeComponent() {
    const containerRef = useRef(null);

    const init = () => {
        // DOM承载渲染器
        containerRef.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div id="container" ref={containerRef}></div>
        </>
    );
}
