import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const scene = new THREE.Scene();
// 场景颜色

const rgbeLoader = new RGBELoader();
rgbeLoader.load(require('../textures/023.hdr'), (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
    scene.environment = envMap;
});
// scene.background = new THREE.Color(0xd2d0d0);

export default scene;
