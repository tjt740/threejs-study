import React, { useEffect, useRef } from 'react';

// 引入cesium.js
import * as Cesium from 'cesium';
// 引入widgets.css
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 设置token
Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NmVkYWVhNS1lZmJmLTRkNzUtYjRkNi01MmY2OTRhNmVjM2QiLCJpZCI6MTY5NjUwLCJpYXQiOjE2OTY1NjUxMzd9.lYVl4r-BBQHpiAKQmABCZNkgHKPWDceZOsLHZX6k014';

// 设置cesium默认视角（移到中国🇨🇳）
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
//     // 西边经度
//     89.5,
//     // 南边维度
//     -20.4,
//     // 东边经度
//     110.4,
//     // 北边的维度
//     61.2
// );

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

                // 设置天空盒子
                skyBox: new Cesium.SkyBox({
                    sources: {
                        positiveX: require('./textures/2/px.jpg'),
                        negativeX: require('./textures/2/nx.jpg'),
                        positiveY: require('./textures/2/ny.jpg'),
                        negativeY: require('./textures/2/py.jpg'),
                        positiveZ: require('./textures/2/pz.jpg'),
                        negativeZ: require('./textures/2/nz.jpg'),
                    },
                }),
                // 设置天地图矢量路径图
                // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                //     // url: 'http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=d311373e1f9d7682d6d255b8a156e22e',
                //     url: 'http://t0.tianditu.gov.cn/vec_w/wmts?tk=d311373e1f9d7682d6d255b8a156e22e',
                //     layer: 'tdtBasicLayer',
                //     style: 'default',
                //     format: 'image/jpeg',
                //     tileDiscardPolicy: 'GoogleMapsCompatible',
                // }),
                // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                //     //影像底图
                //     url: 'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=d311373e1f9d7682d6d255b8a156e22e',
                //     // subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                //     layer: 'tdtImgLayer',
                //     style: 'default',
                //     format: 'image/jpeg',
                //     tileMatrixSetID: 'GoogleMapsCompatible', //使用谷歌的瓦片切片方式
                //     show: true,
                // }),
            }
        );

        // 生成position是天安门的位置
        const position = Cesium.Cartesian3.fromDegrees(
            116.393428,
            39.90923,
            100
        );
        viewer.camera.setView({
            // 指定相机位置
            destination: position,
            // 指定相机视角
            orientation: {
                // 指定相机的朝向,偏航角
                heading: Cesium.Math.toRadians(0),
                // 指定相机的俯仰角,0度是竖直向上,-90度是向下
                pitch: Cesium.Math.toRadians(-20),
                // 指定相机的滚转角,翻滚角
                roll: 0,
            },
        });

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                116.393428,
                39.90923,
                100
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
