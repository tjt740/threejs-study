import React, { useEffect, useRef, useState } from 'react';
import Scene from './components/scene';
// import vertexShader from './shader/vertexShader';
import BigScreen from './components/bigscreen';
import './index.less';

export default function ThreeComponent() {
    useEffect(() => {}, []);
    const [stared, setStared] = useState(false);

    return (
        <>
            {/* 容器承载容器 */}
            <Scene></Scene>
            {/* 大屏 */}
            <BigScreen />
            {/* <button
                className={`button ${stared ? 'stared' : ''}`}
                onClick={() => setStared(!stared)}
            >
                <span className="icon">icon</span>
                <div className="heart-animation-1" key="animation-1" />
                <div className="heart-animation-2" key="animation-2" />
            </button> */}
        </>
    );
}
