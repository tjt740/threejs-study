import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import scene from './three/scene';
import camera from './three/camera';
import renderer from './three/renderer';
import controlsModule from './three/controls';
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

// 添加光线
import ambientLight from './three/light/ambientLight';
import directionalLight from './three/light/directionalLight';

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
            <div style={{ display: 'flex' }}>
                <Button
                    onClick={() => {
                        controlsModule.setOrbitControls();
                    }}
                >
                    切换到默认轨道控制器
                </Button>
                <Button
                    onClick={() => {
                        controlsModule.setFlyControls();
                    }}
                >
                    切换到飞行控制器
                </Button>
                <Button
                    onClick={() => {
                        controlsModule.setFirstPersonControls();
                    }}
                >
                    切换到第一人称控制器
                </Button>
                <Button
                    onClick={() => {
                        controlsModule.setTrackballControls();
                    }}
                >
                    切换到轨迹球控制器
                </Button>
            </div>
            <div id="container" ref={containerRef}></div>
        </>
    );
}
