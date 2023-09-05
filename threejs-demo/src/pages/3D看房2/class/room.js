import * as THREE from 'three';

export class CreateRoomList {
    constructor(areasList, roomName) {
        this.roomShape = new THREE.Shape();

        for (let i = 0; i < areasList.length; i++) {
            if (!i) {
                this.roomShape.moveTo(
                    areasList[i].x / 100,
                    areasList[i].y / 100
                );
            } else {
                this.roomShape.lineTo(
                    areasList[i].x / 100,
                    areasList[i].y / 100
                );
            }
        }

        console.log(areasList);
        this.shapeGeometry = new THREE.ShapeGeometry(this.roomShape);
        this.shapeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
        });

        // 旋转几何体顶点，变成平面
        this.shapeGeometry.rotateX(Math.PI / 2);

        // 创建模型
        this.generateMesh();
    }
    // 创建模型
    generateMesh() {
        return new THREE.Mesh(this.shapeGeometry, this.shapeMaterial);
    }
}
