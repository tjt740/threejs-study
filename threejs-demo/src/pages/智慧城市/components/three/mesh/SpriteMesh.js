import * as THREE from 'three';
import renderer from '../renderer';
import camera from '../camera';
import scene from '../scene';
import gsap from 'gsap';

export default class SpriteMesh {
    constructor(mapTexture, paramsPosition) {
        this.callbacksfn = [];

        this.sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: mapTexture,
                // depthTest: false, // 不进行深度检测
            })
        );

        // 点击射线判断
        // 创建射线
        const raycaster = new THREE.Raycaster();
        // 创建鼠标点
        const mouse = new THREE.Vector2();
        window.addEventListener('click', (e) => {
            mouse.x =
                ((e.clientX - renderer.domElement.offsetLeft) /
                    renderer.domElement.clientWidth) *
                    2 -
                1;
            mouse.y =
                -(
                    (e.clientY - renderer.domElement.offsetTop) /
                    renderer.domElement.clientHeight
                ) *
                    2 +
                1;
            // 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
            raycaster.setFromCamera(mouse, camera);

            // 检测照射结果
            const intersect = raycaster.intersectObject(this.sprite);

            if (intersect.length) {
                // 执行回调数组
                if (this.callbacksfn.length) {
                    this.callbacksfn.forEach((callback) => {
                        try {
                            callback();
                        } catch (e) {
                            console.log('callback error', e);
                        }
                    });
                }
            }
        });
        this.sprite.position.copy(paramsPosition);
        scene.add(this.sprite);

        gsap.to(this.sprite.scale, {
            x: 1.15,
            y: 1.15,
            z: 1.15,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'none',
        });
    }

    // 封装点击事件 回调函数
    onClick(callback) {
        this.callbacksfn.push(callback);
    }
}
