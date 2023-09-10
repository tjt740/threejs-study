import React, { useEffect, useRef } from 'react';
import Scene from './components/scene';
// import vertexShader from './shader/vertexShader';

export default function ThreeComponent() {
    useEffect(() => {}, []);

    return (
        <>
            {/* 容器承载容器 */}
            <Scene></Scene>
        </>
    );
}
