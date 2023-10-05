import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 引入cesium.js
import * as Cesium from 'cesium';
import { Viewer } from 'resium';
// 引入widgets.css
// import 'cesium/Build/Cesium/Widgets/widgets.css';

export default function CesiumComponent() {
    const cesiumRef = useRef(null);

    const init = () => {
        const viewer = new Cesium.Viewer(
            cesiumRef.current || 'cesium-container',
            {
                infoBox: false,
            }
        );
        // viewer.scene.globe.depthTestAgainstTerrain = true;
        // viewer.scene.globe.enableLighting = true;
        // viewer.scene.globe.baseColor = new THREE.Color(0.3, 0.3, 0.3);
        // viewer.scene.globe.showGroundAtmosphere = true;
        // viewer.scene.globe.show = true;
        // viewer.scene.globe.enableLighting = true;
        // viewer.scene.globe.showWaterEffect = true;
        // viewer.scene.globe.showGroundAtmosphere = true;
        // viewer.scene.globe.show = true;
        // viewer.scene.globe.enableLighting = true;
        // viewer.scene.globe.showWaterEffect = true;
        // viewer.scene.globe.showGroundAtmosphere = true;
        // viewer.scene.globe.show = true;
        // ;
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {/* 一定要限制高度 */}
            <div
                id="cesium-container"
                ref={cesiumRef}
                style={{
                    height: '100vh',
                    width: '100%',
                }}
            ></div>
        </>
    );
}
