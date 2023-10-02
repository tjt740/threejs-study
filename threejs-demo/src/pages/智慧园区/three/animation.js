import * as THREE from 'three';
// 导入控制器
import controlsModule from './controls';
// 导入renderer承载器
import renderer from './renderer';
// 导入场景
import scene from './scene';
// 导入camera
import camera from './camera';

// 渲染函数
const clock = new THREE.Clock();
const animation = () => {
    // 获取秒数
    // const time = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // 控制器更新
    controlsModule.controls.update(deltaTime);

    renderer.render(scene, camera);
    // 动画帧
    requestAnimationFrame(animation);
};
// 渲染动画帧
animation();

export default animation;
