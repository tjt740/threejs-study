import * as THREE from 'three';
// 导入控制器
import controls from './controls';
// 导入renderer承载器
import renderer from './renderer';
// 导入场景
import scene from './scene';
// 导入camera
import camera from './camera';

// 渲染函数
const clock = new THREE.Clock();
function animation(t) {
    // 获取秒数
    const time = clock.getElapsedTime();

    // 通过摄像机和鼠标位置更新射线
    // raycaster.setFromCamera(mouse, camera);

    // 最后，想要成功的完成这种效果，你需要在主函数中调用 TWEEN.update()
    // TWEEN.update();

    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
    // 动画帧
    requestAnimationFrame(animation);
}
// 渲染动画帧
animation();

export default animation;
