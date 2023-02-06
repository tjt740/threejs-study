import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 导入动画库
import gsap from 'gsap';

// Step1 导入gui
import * as dat from 'dat.gui';
/*
 *  轻量级页面配置ui库  npm install --save dat.gui  https://www.npmjs.com/package/dat.gui
 */
// Step2 初始化gui
const gui = new dat.GUI();

export default function ThreeComponent() {
    const container = useRef(null);

    const init = () => {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            90,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10);
        scene.add(camera);

        const geometry = new THREE.BoxGeometry(2, 3, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffe5cd61 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 渲染器
        const renderer = new THREE.WebGLRenderer();
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
        renderer.setSize(WIDTH, HEIGHT);
        console.log(renderer);

        // 获取Clock 跟踪时间，解决 Date now() 不准的问题；
        const clock = new THREE.Clock(); // 获取关于时钟的信息： <autoStart> <elapsedTime> <oldTime> <running> <startTime>

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

        // 渲染函数
        function render(t) {
            controls.update();

            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }

        const axesHelper = new THREE.AxesHelper(7);
        scene.add(axesHelper);

        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        /* 
            设置控制阻尼，让控制器效果更佳
            .enableDamping : Boolean
            将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
            请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
        */
        controls.enableDamping = true;

        cube.position.set(2, 2, 1);
        cube.rotation.set(Math.PI / 4, 0, 0, 'XYZ'); // Math.PI = 180° , 'XYZ'、'YZX'、'ZXY' 都可以，但必须大写
        cube.scale.set(0.5, 0.7, 0.5); // XYZ 轴缩放尺寸

        // 使用gsap动画
        // const animationX = gsap.to(cube.position, {
        //     x: 10,
        //     duration: 4,
        //     repeat: true,
        //     yoyo: true,
        //     delay: 1,
        //     ease: 'none',
        // });

        // Step3 使用gui
        // 折叠命名区间
        const gui1 = gui.addFolder('配置cube内容');
        const gui2 = gui.addFolder('配置模组2');

        // 添加gui控制器内容, min(最小值区间) max(最大值区间) step(值据) name(名字) onChange()每次参数改变的回调
        gui1.add(cube.position, 'y')
            .min(1)
            .max(10)
            .step(0.1)
            .name('移动物体在Y轴移动距离');
        gui1.add(cube.rotation, 'z').min(0).max(720).step(1);
        gui1.add(cube.scale, 'x')
            .name('改变物体X轴尺寸')
            .onChange((val) => console.log('变化值:', val))
            .onFinishChange((finVal) => console.log('完全停下操作:', finVal));
        // 修改物体颜色
        const params = {
            cssColor: '#ffffff',
            rgbColor: [255, 255, 255],
        };
        gui1.addColor(params, 'cssColor')
            .name('CSS颜色值')
            .onChange((color) => {
                console.log('改变的颜色:', color);
                cube.material.color.set(color);
            });
        gui1.addColor(params, 'rgbColor')
            .name('RGB颜色值')
            .onChange((color) => {
                console.log('改变的颜色:', color);
                cube.material.color.set(color);
            });
        // 修改物体显影 setValue(设置属性)
        gui1.add(cube, 'visible').setValue(true).name('是否显示');

        // gsap + gui 配置 点击触发事件
        const animationParams = {
            xFn: () => {
                gsap.to(cube.position, {
                    x: 5,
                    duration: 8,
                    repeat: true,
                    yoyo: false,
                    delay: 0,
                    ease: 'ease',
                });
            },
        };
        gui2.add(animationParams, 'xFn').name('点击触发gsap动画 --- xFn');

        // options({key1:value1,key2:value2})配置
        gui2.add(cube.position, 'y')
            .options({ Y1: 'yFn1', Y2: 'yFn2' })
            .name('物体在Y轴移动变化方式')
            .onChange((v) => {
                if (v === 'yFn1') {
                    gsap.to(cube.position, {
                        y: 5,
                        duration: 8,
                        repeat: true,
                        yoyo: false,
                        delay: 0,
                        ease: 'ease',
                    });
                } else {
                    gsap.to(cube.position, {
                        y: -5,
                        duration: 8,
                        repeat: true,
                        yoyo: false,
                        delay: 0,
                        ease: 'ease',
                    });
                }
            });

        // 类似radio
        gui2.add(cube.material, 'wireframe').name('是否网格化物体');

        // 改变gui控制台宽度
        gui.width = 400;
    
        // 默认收起gui控制展示
        gui.close();

        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);
    };

    useEffect(() => {
        gsap.to('h1', {
            rotation: 360,
            duration: 5,
            repeat: true,
            ease: 'none',
        });

        // 1. 初始化
        init();
    }, []);

    return (
        <>
            dat.gui 配置
            <div id="container" ref={container}></div>
        </>
    );
}
