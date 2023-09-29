import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 飞行控制器
import { FlyControls } from 'three/addons/controls/FlyControls';
// 第一人称视角控制器
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
// 导入封装的场景
import scene from './scene';
// 导入camera
import camera from './camera';
// 导入renderer
import renderer from './renderer';

// 创建控制器组
class ControlsModule {
    constructor() {
        // 设置默认控制器
        this.setOrbitControls();
    }
    // 轨道控制器
    setOrbitControls() {
        // 先清除控制器。避免重复增加
        this.controls?.dispose();
        this.controls = new OrbitControls(camera, renderer.domElement);
        // 控制器阻尼
        this.controls.enableDamping = true;
        // 阻尼系数，只有在.enableDamping = true时才生效，默认0.05
        this.controls.dampingFactor = 0.05;
        // 自动旋转
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;
        // 控制器最大仰视角 / 最小俯视角  （抬头/低头角度）
        this.controls.maxPolarAngle = Math.PI / 2;
        // 控制器最小俯视角
        this.controls.minPolarAngle = 0;
        // 控制器的基点 / 控制器的焦点，.object的轨道围绕它运行。 它可以在任何时候被手动更新，以更改控制器的焦点
        this.controls.target = new THREE.Vector3(
            scene.position.x,
            scene.position.y,
            scene.position.z
        );
    }

    // 设置轨迹球控制器
    setTrackballControls() {
        // 先清除控制器。避免重复增加
        this.controls?.dispose();
        this.controls = new TrackballControls(camera, renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.dynamicDampingFactor = 0.2;
    }

    // 设置飞行控制器
    setFlyControls() {
        // 先清除控制器。避免重复增加
        this.controls?.dispose();
        this.controls = new FlyControls(camera, renderer.domElement);
        this.controls.movementSpeed = 100;
        this.controls.rollSpeed = Math.PI / 60;
    }

    // 设置第一人称视角控制器
    setFirstPersonControls() {
        // 先清除控制器。避免重复增加
        this.controls?.dispose();
        this.controls = new FirstPersonControls(camera, renderer.domElement);
        this.controls.movementSpeed = 10;
        this.controls.rollSpeed = Math.PI / 60;
        this.controls.lookSpeed = 0.1;
        this.controls.heightCoef = 5;
    }
}
// ！！重点
export default new ControlsModule();
