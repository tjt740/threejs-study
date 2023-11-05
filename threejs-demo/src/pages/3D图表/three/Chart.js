import * as THREE from 'three';

export default class Chart {
    constructor(label, value, type, index, size) {
        this.label = label;
        this.value = value;
        this.type = type;
        this.size = size;
        // 下标
        this.index = index;

        this.chartGroup = new THREE.Group();

        this.createChart();
    }

    createChart() {
        if (this.type === 'box') {
            this.boxGeometry = new THREE.BoxGeometry(1, this.value, 1);
            this.boxMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff * Math.random(),
                opacity: 0.9,
                transparent: true,
            });

            this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);

            this.boxMesh.position.x = -this.index * 2;
            this.boxMesh.position.y = -this.size / 2 + this.value / 2;
            this.chartGroup.add(this.boxMesh);
        } else {
            this.cylinderGeometry = new THREE.CylinderGeometry(
                0.5,
                0.5,
                this.value,
                32
            );
            this.cylinderMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff * Math.random(),
                opacity: 0.9,
                transparent: true,
            });

            this.cylinderMesh = new THREE.Mesh(
                this.cylinderGeometry,
                this.cylinderMaterial
            );

            this.cylinderMesh.position.x = -this.index * 2;
            this.cylinderMesh.position.y = -this.size / 2 + this.value / 2;
            this.chartGroup.add(this.cylinderMesh);
        }
    }
}
