import * as THREE from 'three';

export default class Axes3D {
    constructor() {
        this.size = 10;
        this.divisions = 10;
        this.gridHelper = new THREE.GridHelper(
            this.size,
            this.divisions,
            0xf00000,
            0x444444
        );
        console.log(this.gridHelper);
    }
}
