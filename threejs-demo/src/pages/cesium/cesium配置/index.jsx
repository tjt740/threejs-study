import React, { useEffect, useRef } from 'react';

// 引入cesium.js
import * as Cesium from 'cesium';
// 引入widgets.css
import 'cesium/Build/Cesium/Widgets/widgets.css';
import gsap from 'gsap';

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
        // primivite创建矩形

        class CustomMaterialPropery {
            constructor() {
                this.definitionChanged = new Cesium.Event();
                Cesium.Material._materialCache.addMaterial('CustomMaterial', {
                    fabric: {
                        type: 'CustomMaterial',
                        uniforms: {
                            uTime: 0,
                        },
                        source: `
                  czm_material czm_getMaterial(czm_materialInput materialInput)
                  {
                    // 生成默认的基础材质
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    material.diffuse = vec3(materialInput.st, uTime);
                    return material;
                  }
        
                  `,
                    },
                });

                this.params = {
                    uTime: 0,
                };
                gsap.to(this.params, {
                    uTime: 1,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                });
            }
            getType() {
                // 返回材质类型
                return 'CustomMaterial';
            }
            getValue(time, result) {
                // console.log(result, time);
                // let t = performance.now() / 1000;
                // t = t % 1;
                // console.log(t);
                // result.uTime = t;
                result.uTime = this.params.uTime;
                // 返回材质值
                return result;
            }
        }

        let material = new CustomMaterialPropery();

        // 01-创建几何体
        const rectGeometry = new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(
                // 西边的经度
                140,
                // 南边维度
                20,
                // 东边经度
                160,
                // 北边维度
                30
            ),
            // 距离表面高度
            height: 0,
            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        });

        // 02-创建几何体实例
        const instance = new Cesium.GeometryInstance({
            id: 'blueRect',
            geometry: rectGeometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    Cesium.Color.BLUE.withAlpha(0.5)
                ),
            },
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        });

        // 03-设置外观
        const appearance = new Cesium.EllipsoidSurfaceAppearance({
            material: material,
            show: true,
        });

        // 04-图元
        const primitive = new Cesium.Primitive({
            geometryInstances: [instance],
            appearance: appearance,
            show: true,
        });

        // 05-添加到viewer
        // viewer.scene.primitives.add(primitive);
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
