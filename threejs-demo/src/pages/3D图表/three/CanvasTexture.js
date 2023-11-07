import * as THREE from 'three';

export default class CanvasTexture {
    constructor(label, value) {
        // 创建canvas文案
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 200px Arial';
        ctx.fillStyle = '#ffffff'; //  设置文本字体和大小
        ctx.fillText(`${label}${value}`, 512, 512); // 绘制文本，参数分别是文本内容，x 坐标和 y 坐标

        // 绘制一个填充矩形
        ctx.fillStyle = 'rgba(100, 100, 100, 0.2)'; // 设置填充颜色
        ctx.fillRect(0, 256, 1024, 512); // 参数分别是 x 坐标，y 坐标，宽度和高度

        // 绘制一个描边矩形
        ctx.strokeStyle = 'red'; // 设置描边颜色
        ctx.lineWidth = 5; // 设置描边线宽度
        ctx.strokeRect(0, 0, 1024, 1024); // 参数分别是 x 坐标，y 坐标，宽度和高度 1024,1024 全部宽度

        // 创建canvasTexture纹理
        this.canvasTexture = new THREE.CanvasTexture(canvas);
    }
}
