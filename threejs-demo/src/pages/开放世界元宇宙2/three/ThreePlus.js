import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 使用 lil-gui 调试 three.js 图形
import GUI from 'lil-gui';

// 云特效
import Cloud from './Cloud';
export default class ThreePlus {
    constructor(HTMLElement) {
        this.HTMLElement = HTMLElement;

        this.clock = new THREE.Clock();
        this.WIDTH =
            Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName('ant-layout-content')[0]
                    )
                    .width.split('px')[0]
            ) || window.innerWidth;
        this.HEIGHT =
            Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName('ant-layout-content')[0]
                    )
                    .height.split('px')[0]
            ) || window.innerHeight;

        this.init();
    }
    // 初始化
    init() {
        this.initGUI();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();
        this.initControls();
        this.initAnimation();
        this.initEventListenr();
        this.initAxesHelper();
    }
    // 初始化GUI
    initGUI() {
        this.gui = new GUI({
            // 设置gui title
            title: 'gui控制器(点击展开)',
            // 收起分区，默认false
            closeFolders: true,
            // 自动生成在页面右上角，默认为true
            autoPlace: true,
        });
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

        this.gui.add(eventObj, 'Fullscreen').name('全屏');
        this.gui.add(eventObj, 'ExitFullscreen').name('退出全屏');
    }
    // 初始化场景
    initScene() {
        this.scene = new THREE.Scene();
        // 场景颜色
        this.scene.background = new THREE.Color(0x000000);
        // const bufferGeometry = new THREE.BufferGeometry();
        // const position = [0, 0, 0, 1.5, 1.5, 1.5];
        // bufferGeometry.setAttribute(
        //     'position',
        //     new THREE.Float32BufferAttribute(position, 3)
        // );

        // const lineSegments = new THREE.LineSegments(
        //     bufferGeometry,
        //     new THREE.LineDashedMaterial({
        //         color: 0xf00,
        //         dashSize: 0.2,
        //         gapSize: 0.2,
        //     })
        // );
        // lineSegments.computeLineDistances();
        // this.scene.add(lineSegments);
    }
    // 初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45, // 90
            this.WIDTH / this.HEIGHT,
            0.1,
            1000
        );
        // 更新camera 宽高比;
        this.camera.aspect = this.WIDTH / this.HEIGHT;
        // 更新camera 投影矩阵
        this.camera.updateProjectionMatrix();
        // 设置相机位置 object3d具有position，属性是一个3维的向量。
        this.camera.position.set(0, 0, 20);
        // 摄像机看向方向（可以是场景中某个物体）
        this.camera.lookAt(this.scene.position);
        // 摄像机添加到场景中
        this.scene.add(this.camera);
    }
    // 初始化灯光
    initLight() {
        // 创建环境光
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.ambientLight.position.set(5, 50, 7);
        this.scene.add(this.ambientLight);
        // gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

        // 创建平行光
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(2.4, 50, 2);
        this.scene.add(this.directionalLight);
        // gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');
    }
    // 初始化render
    initRenderer() {
        // 初始化<渲染器>
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, // 消除锯齿
            alpha: true, // 背景透明
            // 设置对数深度缓冲区，优化深度冲突问题，当两个面间隙过小，或者重合，你设置webgl渲染器对数深度缓冲区也是无效的。
            logarithmicDepthBuffer: true,
        });
        // 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
        this.renderer.outputColorSpace = 'srgb';
        // 色调映射 THREE.NoToneMapping || THREE.LinearToneMapping || THREE.ReinhardToneMapping || THREE.CineonToneMapping || THREE.ACESFilmicToneMapping
        this.renderer.toneMapping = THREE.NoToneMapping;
        // 色调映射的曝光级别。默认是1，屏幕是2.2，越低越暗
        this.renderer.toneMappingExposure = 2.2;

        // 改变渲染器尺寸
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        // 设置像素比 使图形锯齿 消失
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // 设置渲染器开启阴影计算
        this.renderer.shadowMap.enabled = true;
        // 设置软阴影（不再是像素阴影）
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 渲染是否使用正确的物理渲染方式,默认是false. 吃性能（已被移除）.
        // renderer.physicallyCorrectLights = true;
        // DOM承载渲染器
        this.HTMLElement.appendChild(this.renderer.domElement);
    }
    // 初始化控制器
    initControls() {
        // 轨道控制器
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        // 控制器阻尼
        this.controls.enableDamping = true;
        // 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
        this.controls.dampingFactor = 0.05;
        // 自动旋转
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        this.controls.maxPolarAngle = Math.PI;
        // 控制器最小俯视角
        this.controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        this.controls.target = new THREE.Vector3(
            this.scene.position.x,
            this.scene.position.y,
            this.scene.position.z
        );
    }
    // 初始化动画
    initAnimation = () => {
        // 获取秒数
        // this.time = this.clock.getElapsedTime();
        // 控制器更新
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        // 动画帧
        requestAnimationFrame(this.initAnimation);
    };
    // 初始化坐标线
    initAxesHelper() {
        //  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
        this.axesHelper = new THREE.AxesHelper(25);
        //  坐标辅助线添加到场景中
        this.scene.add(this.axesHelper);
    }
    // 初始化页面监听
    initEventListenr() {
        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 实际three.js渲染区域
            this.WIDTH =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .width.split('px')[0]
                ) || window.innerWidth;
            this.HEIGHT =
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
            this.camera.aspect = this.WIDTH / this.HEIGHT;
            /* 
        更新camera 投影矩阵
        .updateProjectionMatrix () : undefined
        更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
        */
            this.camera.updateProjectionMatrix();
            // 更新渲染器
            this.renderer.setSize(this.WIDTH, this.HEIGHT);
            // 设置渲染器像素比:
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });
    }
    // 加载盒子
    createBox(width, height, depth) {
        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        const boxMaterial = new THREE.MeshBasicMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.boxGroup = new THREE.Group();
        this.boxGroup.add(boxMesh);
        this.scene.add(this.boxGroup);
    }
    // 创建云特效
    createCloud() {
        const clouds = new Cloud({});
        this.scene.add(clouds.meshGroup);
        console.log(this.scene);
    }
}
