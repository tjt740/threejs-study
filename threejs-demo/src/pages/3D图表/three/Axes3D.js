import * as THREE from 'three';

export default class Axes3D {
    constructor(size = 10, divisions = 10) {
        this.size = size;
        this.divisions = divisions;
        this.gridHelper = new THREE.GridHelper(
            this.size,
            this.divisions,
            0x888888,
            0x888888
        );
    }
}
