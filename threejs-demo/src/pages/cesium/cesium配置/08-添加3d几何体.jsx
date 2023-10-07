import React, { useEffect, useRef } from 'react';

// 引入cesium.js
import * as Cesium from 'cesium';
// 引入widgets.css
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 设置token
Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NmVkYWVhNS1lZmJmLTRkNzUtYjRkNi01MmY2OTRhNmVjM2QiLCJpZCI6MTY5NjUwLCJpYXQiOjE2OTY1NjUxMzd9.lYVl4r-BBQHpiAKQmABCZNkgHKPWDceZOsLHZX6k014';

// 设置cesium默认视角（移到中国🇨🇳）
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边经度
    89.5,
    // 南边维度
    -20.4,
    // 东边经度
    110.4,
    // 北边的维度
    61.2
);

export default function CesiumComponent() {
    const cesiumRef = useRef(null);

    const init = async () => {
        const viewer = new Cesium.Viewer(
            cesiumRef.current || 'cesium-container',
            {
                // 是否显示控制台信息
                infoBox: false,
                // 是否显示右上角的搜索栏
                geocoder: false,
                // 是否显示home按钮
                homeButton: false,
                // 是否显示3D/2.5D控制器
                sceneModePicker: false,
                // 是否显示图层选择器
                baseLayerPicker: false,
                // 是否显示帮助按钮
                navigationHelpButton: false,
                // 是否播放动画
                animation: false,
                // 是否显示时间轴
                timeline: false,
                // 是否显示全屏按钮
                fullscreenButton: false,
            }
        );

        // 相机飞入
        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000),
        //     orientation: {
        //         heading: Cesium.Math.toRadians(0),
        //         pitch: Cesium.Math.toRadians(-90),
        //         roll: 0,
        //     },
        // });

        // 隐藏logo
        viewer.cesiumWidget.creditContainer.style.display = 'none';

        // 创建模型
        const blueBox = viewer.entities.add({
            name: "Blue box",
            position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000),
            box: {
              dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
              material: Cesium.Color.BLUE,
            },
          });
          
          const redBox = viewer.entities.add({
            name: "Red box with black outline",
            position: Cesium.Cartesian3.fromDegrees(113.3191, 21.109, 2000),
            box: {
              dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
              material: Cesium.Color.RED.withAlpha(0.5),
              outline: true,
              outlineColor: Cesium.Color.BLACK,
            },
          });
          
          const outlineOnly = viewer.entities.add({
            name: "Yellow box outline",
            position: Cesium.Cartesian3.fromDegrees(113.3191, 22.109, 2000),
            box: {
              dimensions: new Cesium.Cartesian3(400.0, 300.0, 500.0),
              fill: false,
              outline: true,
              outlineColor: Cesium.Color.YELLOW,
            },
          });
          
          viewer.zoomTo(viewer.entities);
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
