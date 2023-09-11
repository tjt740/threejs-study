import * as THREE from 'three';
import _scene from '../scene';

export default function createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    _scene.add(cube);
}
