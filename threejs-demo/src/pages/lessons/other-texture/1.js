// 导入threejs
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// 导入dds格式加载器
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
// ktx2格式加载器
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
// 导入tga
import { TGALoader } from 'three/addons/loaders/TGALoader.js';

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
    antialias: true, // 抗锯齿
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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

let params = {};

// 创建GUI
const gui = new GUI();

// 创建纹理加载器
let textureLoader = new THREE.TextureLoader();
// 加载纹理
// let texture = textureLoader.load("./texture/filter/minecraft.png");
let texture = textureLoader.load('./texture/brick/brick_diffuse.jpg');
// let texture = textureLoader.load("./texture/rain.png");
let planeGeometry = new THREE.PlaneGeometry(1, 1);
let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    // 允许透明
    transparent: true,
});
// planeMaterial.map = texture;
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// texture.flipY = false;
// texture.flipY = true;

texture.colorSpace = THREE.SRGBColorSpace;
// 场景背景
// scene.background = new THREE.Color(0xffffff);
// 直接取映射到的最近的像素
// texture.magFilter = THREE.NearestFilter;
// 取映射到的最近的四个像素的平均值
// texture.magFilter = THREE.LinearFilter;

// texture.minFilter = THREE.NearestFilter;
// texture.minFilter = THREE.LinearFilter;
texture.minFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapNearestFilter;
// texture.minFilter = THREE.NearestMipMapLinearFilter;
// texture.minFilter = THREE.NearestMipMapNearestFilter;

// texture.generateMipmaps = false;

// 获取各项异性的最大值
let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
texture.anisotropy = 4;
console.log(maxAnisotropy);

// jpg/png纹理加载
// textureLoader.load(
//   "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k.jpg",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     console.log("jpg/png", texture);
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//     texture.magFilter = THREE.LinearFilter;
//     texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//   }
// );

// ktx2加载器;
// let ktx2Loader = new KTX2Loader()
//   .setTranscoderPath("basis/")
//   .detectSupport(renderer);
// let ktx2Texture = ktx2Loader.load(
//   "./texture/opt/ktx2/Alex_Hart-Nature_Lab_Bones_2k_uastc-mip-triangle.ktx2",
//   (texture) => {
//     console.log("ktx2", texture);
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     // texture.magFilter = THREE.LinearFilter;
//     // texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//     // 不起效果texture.flipY = true;
//     texture.needsUpdate = true;
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//   }
// );

// dds加载器
// let ddsLoader = new DDSLoader();
// let ddsTexture = ddsLoader.load(
//   "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k_bc3_nomip.dds",
//   (texture) => {
//     console.log("dds", texture);
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     texture.flipY = true;
//     texture.needsUpdate = true;
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//     texture.center = new THREE.Vector2(0.5, 0.5);
//     texture.rotation = Math.PI;
//     texture.magFilter = THREE.LinearFilter;
//     texture.minFilter = THREE.LinearMipMapLinearFilter;
//     texture.anisotropy = 16;
//   }
// );

// Alex_Hart - Nature_Lab_Bones_2k_bc7.tga;
// tga加载纹理;
// let tgaLoader = new TGALoader();
// tgaLoader.load(
//   "./texture/opt/env/Alex_Hart-Nature_Lab_Bones_2k-mipmap.tga",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     console.log("tga", texture);
//     scene.background = texture;
//     scene.environment = texture;
//     plane.material.map = texture;
//   }
// );
