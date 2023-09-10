import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import camera from './camera';
import renderer from './renderer';
import scene from './scene';

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 控制器阻尼
controls.enableDamping = true;
// 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
controls.dampingFactor = 0.05;
// 自动旋转
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0;
// 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
controls.maxPolarAngle = Math.PI;
// 控制器最小俯视角
controls.minPolarAngle = 0;
// 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
controls.target = new THREE.Vector3(
    scene.position.x,
    scene.position.y,
    scene.position.z
);

export default controls;
