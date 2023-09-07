import * as THREE from 'three';

export class CreateRoomList {
    constructor(areasList, roomName, scene) {
        this.areasList = areasList;
        this.roomName = roomName;
        this.scene = scene;

        this.roomShape = new THREE.Shape();
        for (let i = 0; i < this.areasList.length; i++) {
            if (!i) {
                this.roomShape.moveTo(
                    this.areasList[i].x / 100,
                    this.areasList[i].y / 100
                );
            } else {
                this.roomShape.lineTo(
                    this.areasList[i].x / 100,
                    this.areasList[i].y / 100
                );
            }

            console.log(this.areasList[i]);
        }

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

        // 创建canvas文案
        this.creatCanvas();
    }
    // 创建模型
    generateMesh() {
        this.scene.add(new THREE.Mesh(this.shapeGeometry, this.shapeMaterial));
    }
    // 创建canvas文案
    creatCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '250px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'red'; //  设置文本字体和大小
        this.ctx.fillText(this.roomName, 512, 256);
        this.canvasTexture = new THREE.CanvasTexture(this.canvas);

        this.textSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: this.canvasTexture,
                depthTest: false, // 不进行深度检测
            })
        );

        // 设置精灵文案位置
        this.textSprite.position.set(
            this.areasList[0].x / 100,
            1,
            this.areasList[0].y / 100
        );

        this.scene.add(this.textSprite);
    }
}
