import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// 引用 lil-gui 组件
import GUI from 'lil-gui';

export default function ThreeComponent() {
    const container = useRef(null);
    // const gui = new dat.GUI();

    const gui = new GUI(
        // 配置gui设置 方法（1）
        {
            // gui宽度
            width: '600px',
            // 设置gui title
            title: 'gui控制器',
            // 收起分区，默认false
            closeFolders: false,
            // 自动生成在页面右上角，默认为true
            autoPlace: true,
        }
    );

    // 配置gui控制的设置项
    const myObject = {
        myBoolean: true,
        myFunction: function (value) {
            alert('触发函数', value);
        },
        myString: 'lil-gui',
        myNumber: 1,
        mySelectNumber: 1,
    };

    // 开关选项
    gui.add(myObject, 'myBoolean');
    // 文字
    gui.add(myObject, 'myString');

    // 数字设置
    gui.add(myObject, 'myNumber').name('myNumber设置');

    // 0：最小值, 1：最大值
    gui.add(myObject, 'myNumber', 0, 1);
    // 0：最小值 , 100：最大值 , 2：每次增加的值为2
    gui.add(myObject, 'myNumber', 0, 100, 2);
    // 0：最小值 , 100：最大值 , 0.1：每次增加的值为0.1
    gui.add(myObject, 'myNumber').min(0).max(1).step(0.1);

    // 下来选项数值
    gui.add(myObject, 'mySelectNumber', [0, 1, 2]);
    gui.add(myObject, 'mySelectNumber', {
        下拉1: 0,
        下拉2: 1,
        下拉3: 2,
    }).onChange((v) => {
        console.log('值:', v);
    });

    // 触发myObject中myFunction
    gui.add(myObject, 'myFunction').name('触发myFunction');

    // 创建gui分区
    const gui2 = gui.addFolder('分区2');
    // 添加颜色管理器
    const colorFormats = {
        string: '#ffffff',
        int: 0xffffff,
        object: { r: 1, g: 1, b: 1 },
        array: [1, 1, 1],
    };
    gui2.addColor(colorFormats, 'string').name('颜色管理器');

    // 收起gui
    gui.close();
    // 打开gui
    gui.open();
    // 隐藏gui
    gui.hide();
    // 展示gui
    gui.show();
    // gui动画开启
    gui.openAnimated(true);
    // 配置gui设置 方法（2）
    gui.options({
        // gui宽度
        width: '600px',
        // 设置gui title
        title: 'gui控制器',
        // 收起分区，默认false
        closeFolders: false,
        // 自动生成在页面右上角，默认为true
        autoPlace: true,
    });
    // 销毁gui
    // gui.destroy();

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0x444444);
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        //  更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = window.innerWidth / window.innerHeight;

        // camera.lookAt(scene.position);

        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        camera.position.set(0, 0, 10);
        // 摄像机添加到场景中
        scene.add(camera);

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        renderer.outputColorSpace = 'srgb';
        // 色调映射 THREE.NoToneMapping || THREE.LinearToneMapping || THREE.ReinhardToneMapping || THREE.CineonToneMapping || THREE.ACESFilmicToneMapping
        renderer.toneMapping = THREE.ReinhardToneMapping;
        // 色调映射的曝光级别。默认是1，屏幕是2.2，越低越暗
        renderer.toneMappingExposure = 2.2;

        const WIDTH = Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        );
        const HEIGHT = Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        );

        /*
         * ------------ start ----------
         */

        // 创建点
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array([0, 0, 0]);
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        // 创建点材质
        // const pointsMaterial = new THREE.PointsMaterial({
        //     size: 50, // 设置<点>材质尺寸，默认1.0
        //     color: new THREE.Color(0xfff000), // 设置<点>材质颜色
        //     sizeAttenuation: true, // 设置<点>是否因相机深度而衰减
        // });

        // 点着色器材质
        const pointsSharderMaterial = new THREE.ShaderMaterial({
            // 顶点着色器
            vertexShader: /* glsl */ `
                void main(){
                    // 设置点的位置
                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;

                    // 设置点的大小
                    gl_PointSize = 100.0;
                }
            `,
            // 片元着色器
            fragmentShader: /* glsl */ `
                void main(){
                    gl_FragColor = vec4(0.0, 1.0, 1.0, 0.3); // rgba 红黄蓝
                }
            `,
        });

        // 生成<点>物体
        const point = new THREE.Points(geometry, pointsSharderMaterial);
        scene.add(point);

        /*
         * ------------end ----------
         */

        // 改变渲染器尺寸
        renderer.setSize(window.innerWidth, window.innerHeight);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        renderer.shadowMap.enabled = true;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能.
        renderer.physicallyCorrectLights = true;

        // 渲染函数
        const clock = new THREE.Clock();
        function render(t) {
            controls.update();
            // 获取秒数
            const time = clock.getElapsedTime();

            // 通过摄像机和鼠标位置更新射线
            // raycaster.setFromCamera(mouse, camera);

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        controls.enableDamping = true;
        // 自动旋转
        controls.autoRotate = false;
        controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        controls.target = new THREE.Vector3(0, 0, 0);

        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

        // 更具页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 更新camera 宽高比;
            camera.aspect = window.innerWidth / window.innerHeight;
            /* 
                更新camera 投影矩阵
                .updateProjectionMatrix () : undefined
                更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
                */
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight);
            // 设置渲染器像素比:
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <div id="container" ref={container}></div>
        </>
    );
}
