import * as THREE from 'three';
// 导入封装的场景
import scene from './scene';

// 实际three.js渲染区域
export const WIDTH =
    Number(
        window
            .getComputedStyle(
                document.getElementsByClassName('ant-layout-content')[0]
            )
            .width.split('px')[0]
    ) || window.innerWidth;
export const HEIGHT =
    Number(
        window
            .getComputedStyle(
                document.getElementsByClassName('ant-layout-content')[0]
            )
            .height.split('px')[0]
    ) || window.innerHeight;

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
// 更新camera 视角方向, 摄像机看的方向，配合OrbitControls.target = new THREE.Vector3(
//     scene.position.x,
//     scene.position.y,
//     scene.position.z
// );
// 摄像机看向方向（可以是场景中某个物体）
camera.lookAt(scene.position);

// 摄像机添加到场景中
scene.add(camera);

export default camera;
