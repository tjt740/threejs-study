import React, { useEffect, useRef } from 'react';
import ThreePlus from './three/ThreePlus';

export default function ThreeComponent() {
    const containerRef = useRef(null);

    const init = () => {
        const threePlus = new ThreePlus(containerRef.current);
        threePlus.setRgbeLoader();

        // 创建盒子
        // threePlus.createBox(5, 5, 5);
        // 创建云朵
        threePlus.createCloud();
        // 创建海洋
        threePlus.creatOcean();
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
