import React, { useEffect, useRef } from 'react';

import scene from './three/scene';
import camera from './three/camera';
import renderer from './three/renderer';
import controls from './three/controls';
import animation from './three/animation';
import gui from './three/gui';
import gsap from './three/gsap';
import windowDom2 from './three/windowDom2';
// 添加光线
import ambientLight from './three/ambientLight';
import directionalLight from './three/directionalLight';
// 辅助线
import axesHelper from './three/axesHelper';
// 性能监视器
import statsFn from './three/stats';

// 加载场景
import './components/mesh/index';

export default function ThreeComponent() {
    const containerRef = useRef(null);

    const init = () => {
        // 性能监视器
        statsFn(containerRef.current);
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
