import React, { useEffect, useRef } from 'react';

// 引入cesium.js
// import * as Cesium from 'cesium';
// 导入widgets.css 【必须】
// import 'cesium/Build/Cesium/Widgets/widgets.css';

export default function CesiumComponent() {
    const containerRef = useRef(null);

    const init = () => {};

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div id="container" ref={containerRef}></div>
        </>
    );
}
