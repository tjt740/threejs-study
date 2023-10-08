import * as THREE from 'three';
import scene from './scene';
import gui from './gui';

// 创建环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 2.22);
ambientLight.position.set(5, 50, 7);
scene.add(ambientLight);
gui.add(ambientLight, 'intensity', 0, 10).name('自然光亮度');

export default ambientLight;
