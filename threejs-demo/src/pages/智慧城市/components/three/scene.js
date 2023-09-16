import * as THREE from 'three';

// 创建场景
const scene = new THREE.Scene();
// 场景颜色
scene.background = new THREE.Color(0x000000);

// 添加背景
// 初始化cubeTextureLoader 立方体纹理加载器
const loader = new THREE.CubeTextureLoader();
// 加载CubeTexture的一个类。 内部使用ImageLoader来加载文件。
const cubeTexture = loader.load([
    require('../../textures/1.jpg'),
    require('../../textures/2.jpg'),
    require('../../textures/3.jpg'),
    require('../../textures/4.jpg'),
    require('../../textures/5.jpg'),
    require('../../textures/6.jpg'),
]);
//设置场景环境贴图、物体纹理映射
scene.envmap = cubeTexture;
scene.background = cubeTexture;

export default scene;
