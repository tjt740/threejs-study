import * as THREE from 'three';
import scene from '../scene';
import gui from '../gui';

// 创建平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2.4, 50, 2);
scene.add(directionalLight);

gui.add(directionalLight, 'intensity', 0, 10).name('平行光亮度');

export default directionalLight;
