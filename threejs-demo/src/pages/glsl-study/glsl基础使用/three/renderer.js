import * as THREE from 'three';
// 获取camera中的宽高
import { WIDTH, HEIGHT } from './camera';

// 初始化<渲染器>
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 消除锯齿
    alpha: true, // 背景透明
    // 设置对数深度缓冲区，优化深度冲突问题，当两个面间隙过小，或者重合，你设置webgl渲染器对数深度缓冲区也是无效的。
    logarithmicDepthBuffer: true,
});
// 设置渲染器编码格式  THREE.NoColorSpace = "" || THREE.SRGBColorSpace = "srgb" || THREE.LinearSRGBColorSpace = "srgb-linear"
renderer.outputColorSpace = 'srgb';
// 色调映射 THREE.NoToneMapping || THREE.LinearToneMapping || THREE.ReinhardToneMapping || THREE.CineonToneMapping || THREE.ACESFilmicToneMapping
renderer.toneMapping = THREE.NoToneMapping;
// 色调映射的曝光级别。默认是1，屏幕是2.2，越低越暗
renderer.toneMappingExposure = 2.2;

// 改变渲染器尺寸
renderer.setSize(WIDTH, HEIGHT);
// 设置像素比 使图形锯齿 消失
renderer.setPixelRatio(window.devicePixelRatio);
// 设置渲染器开启阴影计算
renderer.shadowMap.enabled = true;
// 设置软阴影（不再是像素阴影）
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// 渲染是否使用正确的物理渲染方式,默认是false. 吃性能（已被移除）.
// renderer.physicallyCorrectLights = true;

export default renderer;
