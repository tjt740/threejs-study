import React, { useEffect, useRef } from 'react';
import ThreePlus from './three/ThreePlus';

export default function ThreeComponent() {
    const containerRef = useRef(null);

    const init = () => {
        const threePlus = new ThreePlus(containerRef.current);
        // 创建盒子
        // threePlus.createBox(5, 5, 5);
        // 创建云朵
        threePlus.createCloud();
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
