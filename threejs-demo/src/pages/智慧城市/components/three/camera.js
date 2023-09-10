import * as THREE from 'three';
import { WIDTH, HEIGHT } from './getScreenWidthandHeight';
import scene from './scene';

// 创建相机
const camera = new THREE.PerspectiveCamera(
    45, // 90
    WIDTH / HEIGHT,
    0.1,
    1000
);

// 更新camera 宽高比;
camera.aspect = WIDTH / HEIGHT;
// 更新camera 投影矩阵
camera.updateProjectionMatrix();
// 设置相机位置 object3d具有position，属性是一个3维的向量。
camera.position.set(0, 0, 20);
// 摄像机看向方向（可以是场景中某个物体）
camera.lookAt(scene.position);
// 摄像机添加到场景中
scene.add(camera);

export default camera;
