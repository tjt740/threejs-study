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
                // // 是否显示右上角的搜索栏
                // geocoder: false,
                // // 是否显示home按钮
                // homeButton: false,
                // // 是否显示3D/2.5D控制器
                // sceneModePicker: false,
                // // 是否显示图层选择器
                // baseLayerPicker: false,
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
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                116.393428,
                39.90923,
                2000
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

        // 创建一个点
        const point = viewer.entities.add({
            // 定位点 在经纬度，700的高度显示
            position: Cesium.Cartesian3.fromDegrees(116.393428, 39.90923, 700),
            // 点
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 4,
            },
        });

        // 添加3D建筑
        const tileset = await Cesium.createOsmBuildingsAsync();
        viewer.scene.primitives.add(tileset);

        // 添加文字标签和广告牌
        var label = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(116.393428, 39.90923, 700),
            label: {
                text: '广州塔',
                font: '24px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 4,
                // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                // 设置文字的偏移量
                pixelOffset: new Cesium.Cartesian2(0, -24),
                // 设置文字的显示位置,LEFT /RIGHT /CENTER
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                // 设置文字的显示位置
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            billboard: {
                image: require('./textures/gzt.png'),
                width: 50,
                height: 50,
                // 设置广告牌的显示位置
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                // 设置广告牌的显示位置
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            },
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
