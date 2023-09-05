import * as THREE from 'three';

export default class RoomShapeMesh extends THREE.Mesh {
    constructor(room, isTop) {
        super();

        this.room = room;
        this.roomShapePoints = room.areas;
        this.isTop = isTop;
        this.init();
    }
    init() {
        let roomShape = new THREE.Shape();
        // 生成房间形状
        for (let i = 0; i < this.roomShapePoints.length; i++) {
            let point = this.roomShapePoints[i];
            if (i === 0) {
                roomShape.moveTo(point.x / 100, point.y / 100);
            } else {
                roomShape.lineTo(point.x / 100, point.y / 100);
            }
        }
        console.log(roomShape);
        // 生成房间形状的几何体
        let roomShapeGeometry = new THREE.ShapeGeometry(roomShape);
        // 旋转几何体顶点
        roomShapeGeometry.rotateX(Math.PI / 2);
        this.geometry = roomShapeGeometry;
        this.material = new THREE.MeshBasicMaterial({
            side: this.isTop ? THREE.FrontSide : THREE.DoubleSide,
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            transparent: true,
        });
        this.isTop ? (this.position.y = 2.8) : (this.position.y = 0);
    }
}
