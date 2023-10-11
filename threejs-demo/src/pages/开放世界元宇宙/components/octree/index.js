import * as THREE from 'three';
import scene from '../../three/scene';
import camera from '../../three/camera';
import controls from '../../three/controls';

// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// 八叉树分割模型，生成八叉树节点
// 引入八叉树扩展库
import { Octree } from 'three/examples/jsm/math/Octree.js';
// 可视化八叉树辅助器
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';
// 引入/examples/jsm/math/目录下胶囊扩展库Capsule.js
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(16, 16);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
    side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);

// 创建一个平面(模拟眼镜)
const capsuleBodyGeometry = new THREE.PlaneGeometry(1, 0.4, 1, 1);
const capsuleBodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide,
});
const capsuleBody = new THREE.Mesh(capsuleBodyGeometry, capsuleBodyMaterial);
capsuleBody.position.set(0, 0.5, -0.4);
scene.add(capsuleBody);

// 创建八叉树实例
const worldOctree = new Octree();
// 分割模型，生成八叉树节点，执行.fromGraphNode()会把一个3D模型，分割为8个子空间，每个子空间都包含对应的三角形或者说顶点数据，每个子空间还可以继续分割。
// worldOctree.fromGraphNode(模型对象Mesh);
worldOctree.fromGraphNode(planeMesh);
console.log('查看八叉树结构', worldOctree);

// 创建八叉树辅助器
const octreeHelper = new OctreeHelper(worldOctree);
// 场景添加八叉树辅助器
// scene.add(octreeHelper);

// 创建一个碰撞胶囊（谭金涛：173cm）
// new Capsule( start = new Vector3( 0, 0, 0 ), end = new Vector3( 0, 1, 0 ), radius = 1 )
const R = 0.4; // 胶囊半径
const H = 1.73; // 胶囊总高度
const start = new THREE.Vector3(0, R, 0); //底部半球球心坐标
const end = new THREE.Vector3(0, H - R, 0); //顶部半球球心坐标
const playerCollider = new Capsule(start, end, R);
//获取碰撞胶囊中心
const capsuleCenter = playerCollider.getCenter(new THREE.Vector3());
console.log('碰撞胶囊中心:', capsuleCenter); // Vector3 {x: 0, y: 0.865, z: 0}
console.log('碰撞胶囊(谭金涛身高体型):', playerCollider);

// 创建一个胶囊几何体对应显示 （半径,长度-2*半径）
const capsuleGeometry = new THREE.CapsuleGeometry(R, H - 2 * R, 5, 32);
const capsuleMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x00ffff),
    opacity: 0.1,
});
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
// 设置胶囊几何体位置
capsuleMesh.position.set(0, H / 2, 0);
scene.add(capsuleMesh);

// 模拟第三人称跟随
// 设置相机一直跟随胶囊几何体
camera.position.set(0, 4, 8);
// camera.position.set(0, 0, 0);
// 相机一直盯着胶囊几何体
camera.lookAt(capsuleMesh.position);
// 胶囊几何体添加相机
capsuleMesh.add(camera);
// 让控制器一直聚焦在胶囊体上，达到第三人称的效果  controls.target = new THREE.Vector3(xx,xx,xx);
// 控制器中心点聚焦于胶囊几何体位置
controls.target = capsuleMesh.position;

// 创建空3D对象作为上下仰视摄像机
const cameraUpBottomControls = new THREE.Object3D();
cameraUpBottomControls.add(camera);
// 胶囊几何体添加（上下仰视摄像机）
capsuleMesh.add(cameraUpBottomControls);

// 胶囊几何体添加（眼镜）
capsuleMesh.add(capsuleBody);

// 锁定鼠标指针
document.addEventListener(
    'mousedown',
    () => {
        // 锁定鼠标指针
        document.body.requestPointerLock();
    },
    false
);

// 设置视角旋转 （需要注释掉所有控制器）
document.addEventListener('mousemove', (e) => {
    // 胶囊几何体左右环视
    capsuleMesh.rotation.y -= e.movementX * 0.01;
    // 胶囊几何体上下环视
    cameraUpBottomControls.rotation.x -= e.movementY * 0.005;
});

// 设置重力
const gravity = -9.8;
// 设置人物速度;
const playerVelocity = new THREE.Vector3(0, 0, 0);
// 设置人物移动方向;
const playerDirection = new THREE.Vector3(0, 0, 0);
// 人物（胶囊）是否碰撞到地面
let playerIsOnFloor = false;
// 键盘按下事件
const keyStates = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    // 空格键
    Space: false,
    isDown: false,
};

// 更新人物 动画帧
const clock = new THREE.Clock();
const loopUpdatePlayer = () => {
    const deltaTime = clock.getDelta();

    // 如果胶囊碰撞在地面上就没有重力加速度了
    // 模拟阻尼
    const damping = -0.1;
    // const damping = Math.exp(-4 * deltaTime) - 1;
    if (playerIsOnFloor) {
        playerVelocity.y = 0;
        // 在地板上滑动，按键结束后才有阻尼
        keyStates.isDown ||
            playerVelocity.addScaledVector(playerVelocity, damping);
    } else {
        // 重力加速度 = 重力*时间;
        playerVelocity.y += gravity * deltaTime;
    }
    // 计算玩家移动距离 = 位置 * 时间
    const playerDistance = playerVelocity.clone().multiplyScalar(deltaTime);
    // 实时改变碰撞胶囊位置(会改变start、end信息)
    playerCollider.translate(playerDistance);
    // 实时改变capsuleMesh位置,通过每一帧获取胶囊位置
    /*
        new Capsule().getCenter( target ) {
		return target.copy( this.end ).add( this.start ).multiplyScalar( 0.5 );
	}
    */
    playerCollider.getCenter(capsuleMesh.position);

    // 实时进行碰撞检测
    playerCollisionDetection();

    // 重置胶囊capsuleMesh位置
    resetPlayer(deltaTime);

    // 人物控制器
    playerControls(deltaTime);

    // 动画帧
    requestAnimationFrame(loopUpdatePlayer);
};
loopUpdatePlayer();

// 进行碰撞检测
function playerCollisionDetection() {
    const result = worldOctree.capsuleIntersect(playerCollider);
    playerIsOnFloor = false;
    if (result) {
        // 碰撞到了地面就改成true
        playerIsOnFloor = result.normal.y > 0;
        // 根据碰撞结果平移胶囊碰撞体，使交叉重合深度为0
        playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
}

// 重置胶囊capsuleMesh位置
function resetPlayer() {
    // 如果胶囊位置下降小于-20，就重置
    if (capsuleMesh.position.y <= -20) {
        const R = 0.4; // 胶囊半径
        const H = 1.73; // 胶囊总高度
        // 设置回到初始位置（此处设想的是从天上掉下来到最初为止，所以都加了y轴都加了7）
        const start = new THREE.Vector3(0, 7 + R, 0); //底部半球球心坐标
        const end = new THREE.Vector3(0, 7 + H - R, 0); //顶部半球球心坐标
        playerCollider.set(start, end, R);
        // 重置速度和方向
        playerVelocity.set(0, 0, 0);
        playerDirection.set(0, 0, 0);
    }
}

// 根据键盘按下的键来更新键盘的状态
document.addEventListener(
    'keydown',
    (event) => {
        keyStates[event.code] = true;
        keyStates.isDown = true;
    },
    false
);
document.addEventListener(
    'keyup',
    (event) => {
        keyStates[event.code] = false;
        keyStates.isDown = false;
    },
    false
);

// 根据键盘状态更新玩家速度
function playerControls(deltaTime) {
    // 设置任务移动速度
    const speed = deltaTime * 5;

    // 如果胶囊往前/往后
    if (keyStates['KeyW'] || keyStates['KeyS']) {
        // 胶囊移动方向
        playerDirection.z = 1;
        //获取胶囊的正前面方向
        const capsuleFront = new THREE.Vector3(0, 0, 0);
        // 胶囊移动，返回一个矢量，表示对象在世界空间中的正z轴方向。
        capsuleMesh.getWorldDirection(capsuleFront);
        // 计算玩家的速度 如果是s就是倒退 w就是正
        playerVelocity.add(
            capsuleFront.multiplyScalar(keyStates['KeyW'] ? -speed : speed)
        );
    }
    // 如果胶囊往左往右
    if (keyStates['KeyA'] || keyStates['KeyD']) {
        // 胶囊移动方向
        playerDirection.x = 1;
        //获取胶囊的正前面方向
        const capsuleFront = new THREE.Vector3(0, 0, 0);
        // 胶囊移动，返回一个矢量，表示对象在世界空间中的正z轴方向。
        capsuleMesh.getWorldDirection(capsuleFront);

        // 求侧方的方向，根据胶囊正前方的方向和正上方的方向，求叉积。
        capsuleFront.cross(capsuleMesh.up);

        // 计算玩家的速度 如果是A是左，D是右
        playerVelocity.add(
            capsuleFront.multiplyScalar(keyStates['KeyA'] ? speed : -speed)
        );
    }
    // 如果按了空格，胶囊调起来
    if (keyStates['Space']) {
        playerVelocity.y = 3;
    }
}

// 加载.glb文件
const gltfLoader = new GLTFLoader();
gltfLoader
    .loadAsync(require('../../models/collision-world.glb'))
    .then((gltf) => {
        // 场景中添加gltf.scene;
        scene.add(gltf.scene);
        worldOctree.fromGraphNode(gltf.scene);
        // const octreeHelper = new OctreeHelper(worldOctree);
        // scene.add(octreeHelper);
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) {
                    child.material.map.anisotropy = 4;
                }
            }
        });
    });

//(2) 可视化胶囊几何体
// const capsuleHelper = CapsuleHelper(R, H);
// capsuleHelper.position.set(2, 0, 0);
// scene.add(capsuleHelper);

// function CapsuleHelper(R, H) {
//     const group = new THREE.Group();
//     const material = new THREE.MeshLambertMaterial({
//         color: 0x00ffff,
//         transparent: true,
//         opacity: 0.5,
//     });
//     // 底部半球
//     const geometry = new THREE.SphereGeometry(
//         R,
//         25,
//         25,
//         0,
//         2 * Math.PI,
//         0,
//         Math.PI / 2
//     );
//     geometry.rotateX(Math.PI);
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.position.y = R;
//     group.add(mesh);
//     // 顶部半球
//     const geometry2 = new THREE.SphereGeometry(
//         R,
//         25,
//         25,
//         0,
//         2 * Math.PI,
//         0,
//         Math.PI / 2
//     );
//     const mesh2 = new THREE.Mesh(geometry2, material);
//     mesh2.position.set(0, H - R, 0);
//     group.add(mesh2);
//     // 中间圆柱
//     const h = H - 2 * R;
//     const geometry3 = new THREE.CylinderGeometry(R, R, h, 32, 1, true);
//     geometry3.translate(0, h / 2 + R, 0);
//     const mesh3 = new THREE.Mesh(geometry3, material);
//     group.add(mesh3);
//     return group;
// }
