import * as THREE from 'three';

export class CreateRoomList {
    constructor(areasList, roomName, scene) {
        console.log(roomName);
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

        // const canvas = document.createElement('canvas');
        // canvas.width = 1024;
        // canvas.height = 1024;
        // const ctx = canvas.getContext('2d');
        // ctx.font = '12px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.font = 'bold 200px Arial';
        // ctx.fillStyle = '#ffffff'; //  设置文本字体和大小
        // ctx.fillText(roomName, 512, 512);
        // const canvasTexture = new THREE.CanvasTexture(canvas);
        // canvasTexture.minFilter = THREE.LinearFilter;
        // canvasTexture.magFilter = THREE.LinearFilter;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 200px Arial';
        this.ctx.fillStyle = '#ffffff'; //  设置文本字体和大小
        this.ctx.fillText(roomName, 512, 512);
        this.canvasTexture = new THREE.CanvasTexture(this.canvas);
        this.canvasTexture.minFilter = THREE.LinearFilter;
        this.canvasTexture.magFilter = THREE.LinearFilter;

        const textSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: this.canvasTexture,
                depthTest: false, // 不进行深度检测
            })
        );
        // scene.add(textSprite)

        this.shapeGeometry = new THREE.ShapeGeometry(this.roomShape);
        this.shapeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            // map: textSprite,
            transparent: true,
        });

        // 旋转几何体顶点，变成平面
        this.shapeGeometry.rotateX(Math.PI / 2);

        // 创建模型
        this.generateMesh();

        // 创建canvas文案
        // this.creatCanvas(roomName);
    }
    // 创建模型
    generateMesh() {
        return new THREE.Mesh(this.shapeGeometry, this.shapeMaterial);
    }
    // 创建canvas文案
    creatCanvas(roomName) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 1024;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 200px Arial';
        this.ctx.fillStyle = '#ffffff'; //  设置文本字体和大小
        this.ctx.fillText(roomName, 512, 512);
        this.canvasTexture = new THREE.CanvasTexture(this.canvas);
        this.canvasTexture.minFilter = THREE.LinearFilter;
        this.canvasTexture.magFilter = THREE.LinearFilter;

        const textSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: this.canvasTexture,
                depthTest: false, // 不进行深度检测
            })
        );

        return textSprite;
    }
}
