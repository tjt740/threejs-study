/*
 *动画帧
 */
import * as THREE from 'three';
import scene from './scene';
import camera from './camera';
import controls from './controls';
import renderer from './renderer';

// 渲染动画帧函数
const clock = new THREE.Clock();
function animation(t) {
    // 获取秒数
    const time = clock.getElapsedTime();
    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
    // 动画帧
    requestAnimationFrame(animation);
}
// 渲染
animation();

export default animation;
