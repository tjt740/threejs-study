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

    const init = () => {
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

      

        // 生成position是天安门的位置
        const position = Cesium.Cartesian3.fromDegrees(
            116.393428,
            39.90923,
            1000
        );
            
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                116.393428,
                39.90923,
                100000
            ),
            orientation: {
                heading: Cesium.Math.toRadians(348.4202942851978),
                pitch: Cesium.Math.toRadians(-89.74026687972041),
                roll: Cesium.Math.toRadians(0),
            },
            complete: function callback() {
                // 定位完成之后的回调函数
            },
        });

        // 隐藏logo
        viewer.cesiumWidget.creditContainer.style.display = 'none';

        // 通过按键移动相机
        document.addEventListener('keydown', (e) => {
            console.log(e.key);
            // 获取相机离地面的高度
            const height = viewer.camera.positionCartographic.height;
            const moveRate = height / 100;
            if (e.key === 'w') {
                // 设置相机向前移动
                viewer.camera.moveForward(moveRate);
            } else if (e.key === 's') {
                // 设置相机向后移动
                viewer.camera.moveBackward(moveRate);
            } else if (e.key === 'a') {
                // 设置相机向左移动
                viewer.camera.moveLeft(moveRate);
            } else if (e.key === 'd') {
                // 设置相机向右移动
                viewer.camera.moveRight(moveRate);
            } else if (e.key === 'q') {
                // 设置相机向左旋转相机
                viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
            } else if (e.key === 'e') {
                // 设置相机向右旋转相机
                viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
            } else if (e.key === 'r') {
                // 设置相机向上旋转相机
                viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
            } else if (e.key === 'f') {
                // 设置相机向下旋转相机
                viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
            } else if (e.key === 'g') {
                // 向左逆时针翻滚
                viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
            } else if (e.key === 'h') {
                // 向右顺时针翻滚
                viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
            }
        });
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
