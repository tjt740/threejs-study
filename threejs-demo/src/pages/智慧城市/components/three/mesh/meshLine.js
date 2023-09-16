import * as THREE from 'three';

export default class MeshLine {
    constructor(mesh) {
        this.mesh = mesh;

        this.geometry = mesh.geometry;

        this.edgesGeometry = new THREE.EdgesGeometry(this.geometry);

        this.edgesLine = new THREE.LineSegments(
            this.edgesGeometry,
            new THREE.LineBasicMaterial({ color: 'rgb(68, 142, 247)' })
        );

        this.mesh.updateWorldMatrix(true, true);

        this.edgesLine.matrix.copy(this.mesh.matrixWorld);

        this.edgesLine.matrix.decompose(
            this.edgesLine.position,
            this.edgesLine.quaternion,
            this.edgesLine.scale
        );

        return this.edgesLine;
    }
}
