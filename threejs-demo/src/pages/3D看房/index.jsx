import React, { useEffect, useRef,useState } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 引入加载.hdr 文件组件
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// 引入补间动画tween.js three.js 自带
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
// 引入gsap补间动画操作组件库
import gsap from 'gsap';
// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';
// import * as dat from 'dat.gui';
// const gui = new dat.GUI();

import './index.less';
const gui = new GUI();

let tagDOM;
export default function ThreeComponent() {
    const container = useRef(null);
    const [loadingProgess,setLoadingProgess] = useState(0);

    // 实际three.js渲染区域
    const WIDTH =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        ) || window.innerWidth;
    const HEIGHT =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        ) || window.innerHeight;

    const init = () => {
        const scene = new THREE.Scene();
        // 场景颜色
        // scene.background = new THREE.Color(0xd2d0d0);
        // scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(
            75, // 90
            WIDTH / HEIGHT,
            0.1,
            1000
        );
        // 更新camera 投影矩阵
        camera.updateProjectionMatrix();
        // 更新camera 宽高比;
        camera.aspect = WIDTH / HEIGHT;
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        // camera.position.set(0, 10, 20);
        camera.position.set(0, 0, 0);

        // 摄像机添加到场景中
        scene.add(camera);

        // 初始化<渲染器>
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        renderer.outputColorSpace = 'srgb-linear';

        // 改变渲染器尺寸
        renderer.setSize(WIDTH, HEIGHT);
        // 设置像素比 使图形锯齿 消失
        renderer.setPixelRatio(window.devicePixelRatio);

        /*
         * ------------ start ----------
         */

        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        const axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        scene.add(axesHelper);

        // // 创建当前所在的房间中心
        // const livingRoom = new THREE.BoxGeometry(10, 10, 10);
        // // 创建盒子材质
        // const livingRoomMaterialsList = [
        //     require('./textrues/img/livingroom/right.jpg'),
        //     require('./textrues/img/livingroom/left.jpg'),
        //     require('./textrues/img/livingroom/top.jpg'),
        //     require('./textrues/img/livingroom/bottom.jpg'),
        //     require('./textrues/img/livingroom/front.jpg'),
        //     require('./textrues/img/livingroom/behind.jpg'),
        // ];
        // // map一个新的纹理数组
        // const livingRoomMaterial = livingRoomMaterialsList.map(
        //     (item) =>
        //         new THREE.MeshBasicMaterial({
        //             map: new THREE.TextureLoader().load(item),
        //             side: THREE.DoubleSide,
        //         })
        // );
        // const livingRoomMesh = new THREE.Mesh(livingRoom, livingRoomMaterial);
        // // 添加当前所在位置
        // scene.add(livingRoomMesh);

        // // 创建canvas文案
        // const canvas = document.createElement('canvas');
        // canvas.width = 1024;
        // canvas.height = 1024;
        // const ctx = canvas.getContext('2d');
        // // ctx.scale(-1, 1); // 水平缩放因子为 -1，表示水平翻转
        // // ctx.transform(-1, 0, 0, 1, canvas.width, 0); // 水平翻转 推荐

        // ctx.font = '12px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.font = 'bold 200px Arial';
        // ctx.fillStyle = '#ffffff'; //  设置文本字体和大小
        // ctx.fillText('厨房', 512, 512); // 绘制文本，参数分别是文本内容，x 坐标和 y 坐标

        // // 绘制一个填充矩形
        // ctx.fillStyle = 'rgba(100, 100, 100, 0.2)'; // 设置填充颜色
        // ctx.fillRect(0, 256, 1024, 512); // 参数分别是 x 坐标，y 坐标，宽度和高度

        // // 绘制一个描边矩形
        // ctx.strokeStyle = 'red'; // 设置描边颜色
        // ctx.lineWidth = 5; // 设置描边线宽度
        // ctx.strokeRect(0, 0, 1024, 1024); // 参数分别是 x 坐标，y 坐标，宽度和高度 1024,1024 全部宽度

        // // 创建canvasTexture纹理
        // const canvasTexture = new THREE.CanvasTexture(canvas);

        // // 创建精灵文案 （精灵文案始终朝向自己）
        // const textSprite = new THREE.Sprite(
        //     new THREE.SpriteMaterial({
        //         map: canvasTexture,
        //         // map: new THREE.TextureLoader().load(require('./textrues/img/childroom/13_d.jpg')),
        //         depthTest: false, // 不进行深度检测
        //     })
        // );
        // // 设置精灵文案位置
        // textSprite.position.set(2, 0, -5);
        // scene.add(textSprite);

        // 添加鼠标点击拖拽事件
        let isMouseDown = false;
        // 监听鼠标按下事件
        container.current.addEventListener(
            'mousedown',
            () => {
                isMouseDown = true;
            },
            false
        );
        container.current.addEventListener(
            'mouseup',
            () => {
                isMouseDown = false;
            },
            false
        );
        container.current.addEventListener('mouseout', () => {
            isMouseDown = false;
        });
        // 是否按下鼠标,移动鼠标
        container.current.addEventListener('mousemove', (event) => {
            if (isMouseDown) {
                camera.rotation.y += event.movementX * 0.002;
                camera.rotation.x += event.movementY * 0.002;
                // /📌 设置相机旋转时的顺序，以Y轴为主
                camera.rotation.order = 'YXZ';
                // xyz
            }
        });

        // 将上面 创建<当前所在房间>函数封装成类组件
        class Room {
            /* 
                imgSrc: 图片地址
                meshPosition: 模型位置   
                euler: 物体旋转角度
            */
            constructor(
                imgSrcList,
                meshPosition,
                euler = new THREE.Euler(0, 0, 0)
            ) {
                // 创建模型
                this.geometry = new THREE.BoxGeometry(10, 10, 10);
                this.material = imgSrcList?.map(
                    (item) =>
                        new THREE.MeshBasicMaterial({
                            map: new THREE.TextureLoader().load(item),
                            side: THREE.DoubleSide,
                        })
                );
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.position.copy(meshPosition);
                this.mesh.rotation.copy(euler);
                // 添加当前所在位置
                scene.add(this.mesh);
            }
        }

        // 封装 精灵文案类组件
        class SpriteText {
            /*
             text: 精灵文案
             canvasPosition: canvas位置
           
            */
            constructor(text, canvasPosition) {
                this.callbacks = [];
                this.textSprite = null;
                // 创建canvas文案
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = 'bold 200px Arial';
                ctx.fillStyle = 'red'; //  设置文本字体和大小
                ctx.fillText(text, 512, 512); // 绘制文本，参数分别是文本内容，x 坐标和 y 坐标

                // 绘制一个填充矩形
                ctx.fillStyle = 'rgba(100, 100, 100, 0.2)'; // 设置填充颜色
                ctx.fillRect(0, 256, 1024, 512); // 参数分别是 x 坐标，y 坐标，宽度和高度

                // 绘制一个描边矩形
                ctx.strokeStyle = 'red'; // 设置描边颜色
                ctx.lineWidth = 5; // 设置描边线宽度
                ctx.strokeRect(0, 0, 1024, 1024); // 参数分别是 x 坐标，y 坐标，宽度和高度 1024,1024 全部宽度

                // 创建canvasTexture纹理
                const canvasTexture = new THREE.CanvasTexture(canvas);

                // 创建精灵文案 （精灵文案始终朝向自己）
                this.textSprite = new THREE.Sprite(
                    new THREE.SpriteMaterial({
                        map: canvasTexture,
                        depthTest: false, // 不进行深度检测
                    })
                );
                // 设置精灵文案位置
                this.textSprite.position.copy(canvasPosition);
                scene.add(this.textSprite);

                // 点击射线判断
                //1️⃣ 创建射线
                const raycaster = new THREE.Raycaster();
                //2️⃣ 创建鼠标点
                const mouse = new THREE.Vector2();
                window.addEventListener('click', (e) => {
                    mouse.x =
                        ((e.clientX - renderer.domElement.offsetLeft) /
                            renderer.domElement.clientWidth) *
                            2 -
                        1;
                    mouse.y =
                        -(
                            (e.clientY - renderer.domElement.offsetTop) /
                            renderer.domElement.clientHeight
                        ) *
                            2 +
                        1;
                    //5️⃣ 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
                    raycaster.setFromCamera(mouse, camera);

                    // 检测照射结果
                    const intersect = raycaster.intersectObject(
                        this.textSprite
                    );
                    if (intersect.length) {
                        // 执行回调数组
                        this.callbacks.forEach((callback) => {
                            callback();
                        });
                    }
                });
            }

            // 点击回调
            onClick(callback) {
                this.callbacks.push(callback);
            }

            hidden() {
                this.textSprite.visible = false;
            }

            show() {
                this.textSprite.visible = true;
            }
        }

        // 创建客厅
        const livingRoomMesh = new Room(
            [
                require('./textrues/img/livingroom/right.jpg'),
                require('./textrues/img/livingroom/left.jpg'),
                require('./textrues/img/livingroom/top.jpg'),
                require('./textrues/img/livingroom/bottom.jpg'),
                require('./textrues/img/livingroom/front.jpg'),
                require('./textrues/img/livingroom/behind.jpg'),
            ],
            new THREE.Vector3(0, 0, 0)
        );
        // 创建厨房回到客厅精灵文案
        const livingSprite = new SpriteText(
            '客厅',
            new THREE.Vector3(-5, 0, 1)
        );

        // 创建厨房
        const kitchenMesh = new Room(
            [
                require('./textrues/img/kitchen/3_r.jpg'),
                require('./textrues/img/kitchen/3_l.jpg'),
                require('./textrues/img/kitchen/3_u.jpg'),
                require('./textrues/img/kitchen/3_d.jpg'),
                require('./textrues/img/kitchen/3_f.jpg'),
                require('./textrues/img/kitchen/3_b.jpg'),
            ],
            new THREE.Vector3(0, 0, -11),
            new THREE.Euler(0, Math.PI / 2, 0)
        );
        // 创建客厅去厨房精灵文案
        const kitchenSprite = new SpriteText(
            '厨房',
            new THREE.Vector3(2, 0, -5)
        );

        // 创建阳台
        const balconyMesh = new Room(
            [
                require('./textrues/img/balcony/8_r.jpg'),
                require('./textrues/img/balcony/8_l.jpg'),
                require('./textrues/img/balcony/8_u.jpg'),
                require('./textrues/img/balcony/8_d.jpg'),
                require('./textrues/img/balcony/8_f.jpg'),
                require('./textrues/img/balcony/8_b.jpg'),
            ],
            new THREE.Vector3(0, 0, 11),
            new THREE.Euler(0, Math.PI / 2, 0)
        );
        // 创建客厅去阳台精灵
        const balconySprite = new SpriteText(
            '阳台',
            new THREE.Vector3(0, 0, 5)
        );

        // 点击厨房，隐藏厨房精灵，显示客厅。
        livingSprite.onClick(() => {
            console.log('去客厅');
            // 移动到客厅
            gsap.to(camera.position, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                onComplete: () => {
                    // 移动到客厅，隐藏客厅，显示厨房，显示阳台，
                    livingSprite.hidden();
                    kitchenSprite.show();
                    balconySprite.show();
                },
            });

            moveTo('客厅')
            // camera.position.set(0, 0, -11);
        });

        // 点击客厅，隐藏客厅精灵，显示厨房。
        kitchenSprite.onClick(() => {
            console.log('去厨房');
            // 移动到厨房
            gsap.to(camera.position, {
                duration: 1,
                x: 2,
                y: 0,
                z: -11,
                onComplete: () => {
                    // 移动到厨房 显示客厅，隐藏厨房，隐藏阳台
                    livingSprite.show();
                    kitchenSprite.hidden();
                    balconySprite.hidden();
                },
            });

            moveTo('厨房');
        });

        balconySprite.onClick(() => {
            console.log('去阳台');
            // 移动到阳台
            gsap.to(camera.position, {
                duration: 1,
                x: 0,
                y: 0,
                z: 11,
                onComplete: () => {
                    // 移动到阳台，隐藏厨房，隐藏阳台，显示客厅
                    livingSprite.show();
                    kitchenSprite.hidden();
                    balconySprite.hidden();
                },
            });

            moveTo('阳台');
        });


        // 设置右下角位置
        tagDOM = document.getElementsByClassName('tag')[0];
        tagDOM.style.cssText = `transform:translate(100px,100px)`;

        // 配合点击进行位置改变
        function moveTo(name){
            const positions = {
              客厅: {x:100, y:110},
                厨房: {x:180, y:190},
                阳台: {x:50, y:50},
              };
              if (positions[name]) {
                gsap.to(tagDOM, {
                  duration: 0.5,
                  x: positions[name].x,
                  y: positions[name].y,
                  ease: "power3.inOut",
                });
              }
        }

        /*
         * ------------end ----------
         */

        // 渲染函数
        function render(t) {
            renderer.render(scene, camera);
            // 动画帧
            requestAnimationFrame(render);
        }
        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

        // 控制是否全屏
        const eventObj = {
            Fullscreen: function () {
                // 全屏
                document.body.requestFullscreen();
                console.log('全屏');
            },
            ExitFullscreen: function () {
                document.exitFullscreen();
                console.log('退出全屏');
            },
        };

        gui.add(eventObj, 'Fullscreen').name('全屏');
        gui.add(eventObj, 'ExitFullscreen').name('退出全屏');

        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 实际three.js渲染区域
            const WIDTH =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .width.split('px')[0]
                ) || window.innerWidth;
            const HEIGHT =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .height.split('px')[0]
                ) || window.innerHeight;
            // 更新camera 宽高比;
            camera.aspect = WIDTH / HEIGHT;
            /* 
                更新camera 投影矩阵
                .updateProjectionMatrix () : undefined
                更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
                */
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(WIDTH, HEIGHT);
            // 设置渲染器像素比:
            renderer.setPixelRatio(window.devicePixelRatio);
        });

        THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
            console.log("进度:", new Number((loaded / total) * 100).toFixed(2));
        };
    };

    useEffect(() => {
        // 1. 初始化
        init();
    }, []);

    return (
        <>
            <div id="container" ref={container}></div>
            {!loadingProgess?        <div class="progress" >
    <img src={require('./assets/loading.gif')} alt="" />
    <span>新房奔跑中： { loadingProgess}%</span>
  </div>
       :null }
         <div className="map">
                <div className="tag"></div>
                <img src={require('./assets/map.gif')} alt="" />
            </div>
        </>
    );
}
