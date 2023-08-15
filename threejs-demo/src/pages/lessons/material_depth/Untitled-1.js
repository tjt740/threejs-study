// 导入threejs
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
    45, // 视角
    window.innerWidth / window.innerHeight, // 宽高比
    0.1, // 近平面
    1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 开启抗锯齿
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 15;
// camera.position.y = 2;
// camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animate() {
    controls.update();
    requestAnimationFrame(animate);
    // 渲染
    renderer.render(scene, camera);
}
animate();

// 监听窗口变化
window.addEventListener('resize', () => {
    // 重置渲染器宽高比
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 重置相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新相机投影矩阵
    camera.updateProjectionMatrix();
});

let eventObj = {
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

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load(
    './texture/opt/memorial/Alex_Hart-Nature_Lab_Bones_2k.hdr',
    (envMap) => {
        // 设置球形贴图
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置环境贴图
        scene.background = envMap;
        // 设置环境贴图
        scene.environment = envMap;
        // plane.material.map = envMap;
    }
);

// 创建GUI
const gui = new GUI();

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
    // map: new THREE.TextureLoader().load("./texture/brick/brick_diffuse.jpg"),
    map: new THREE.TextureLoader().load('./texture/sprite0.png'),
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.renderOrder = 0;
scene.add(plane);
// 创建平面2
const planeGeometry1 = new THREE.PlaneGeometry(10, 10);
const planeMaterial1 = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('./texture/lensflare0_alpha.png'),
    side: THREE.DoubleSide,
});
const plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
plane1.position.z = 3;
plane1.renderOrder = 0;
scene.add(plane1);

// 设置2个材质为透明
plane.material.transparent = true;
plane1.material.transparent = true;

// 设置深度模式
plane.material.depthFunc = THREE.LessEqualDepth;
plane.material.depthWrite = true;
plane.material.depthTest = true;
plane1.material.depthFunc = THREE.LessEqualDepth;
plane1.material.depthWrite = true;
plane1.material.depthTest = true;

// gui
const gui1 = gui.addFolder('plane');
gui1.add(plane.material, 'depthFunc', {
    'THREE.NeverDepth': THREE.NeverDepth,
    'THREE.AlwaysDepth': THREE.AlwaysDepth,
    'THREE.LessDepth': THREE.LessDepth,
    'THREE.LessEqualDepth': THREE.LessEqualDepth,
    'THREE.GreaterEqualDepth': THREE.GreaterEqualDepth,
    'THREE.GreaterDepth': THREE.GreaterDepth,
    'THREE.NotEqualDepth': THREE.NotEqualDepth,
}).name('深度模式');
gui1.add(plane.material, 'depthWrite')
    .name('深度写入')
    .onChange(() => {
        plane.material.needsUpdate = true;
    });
gui1.add(plane.material, 'depthTest')
    .name('深度测试')
    .onChange(() => {
        plane.material.needsUpdate = true;
    });

gui1.add(plane, 'renderOrder', 0, 10).step(1).name('渲染顺序');

const gui2 = gui.addFolder('plane1');
gui2.add(plane1.material, 'depthFunc', {
    'THREE.NeverDepth': THREE.NeverDepth,
    'THREE.AlwaysDepth': THREE.AlwaysDepth,
    'THREE.LessDepth': THREE.LessDepth,
    'THREE.LessEqualDepth': THREE.LessEqualDepth,
    'THREE.GreaterEqualDepth': THREE.GreaterEqualDepth,
    'THREE.GreaterDepth': THREE.GreaterDepth,
    'THREE.NotEqualDepth': THREE.NotEqualDepth,
}).name('深度模式');
gui2.add(plane1.material, 'depthWrite')
    .name('深度写入')
    .onChange(() => {
        plane1.material.needsUpdate = true;
    });
gui2.add(plane1.material, 'depthTest')
    .name('深度测试')
    .onChange(() => {
        plane1.material.needsUpdate = true;
    });

gui2.add(plane1, 'renderOrder', 0, 10).step(1).name('渲染顺序');
