import * as THREE from 'three';
import scene from '../../three/scene';

// 加载.glb文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 八叉树
import { Octree } from 'three/examples/jsm/math/Octree.js';
// 可视化八叉树辅助器
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';
// 引入/examples/jsm/math/目录下胶囊扩展库Capsule.js
import { Capsule } from 'three/examples/jsm/math/Capsule.js';

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

// 创建一个胶囊物体对应显示
const capsuleGeometry = new THREE.CapsuleGeometry(R, H - R, 5, 32);
const capsuleMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x00ffff),
    opacity: 0.1,
});
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
// 设置胶囊位置
capsuleMesh.position.set(0, H / 2 + R / 2, 0);
scene.add(capsuleMesh);

// 设置重力
const gravity = -9.8;
// 设置人物速度;
const playerVelocity = new THREE.Vector3(0, 0, 0);
// 设置人物移动方向;
const playerDirection = new THREE.Vector3(0, 0, 0);

// 更新人物 动画帧
const clock = new THREE.Clock();
const loopUpdatePlayer = () => {
    const deltaTime = clock.getDelta();
    // 重力加速度 = 重力*时间;
    playerVelocity.y += gravity * deltaTime;
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

    // 进行碰撞检测
    playerCollisionDetection();

    // 重置胶囊capsuleMesh位置
    resetPlayer();

    // 动画帧
    requestAnimationFrame(loopUpdatePlayer);
};
loopUpdatePlayer();

// 进行碰撞检测
function playerCollisionDetection() {}

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

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(16, 16, 32, 32);
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
    side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);

// 创建八叉树
const worldOctree = new Octree();
// 分割模型，生成八叉树节点，执行.fromGraphNode()会把一个3D模型，分割为8个子空间，每个子空间都包含对应的三角形或者说顶点数据，每个子空间还可以继续分割。
// worldOctree.fromGraphNode(模型对象Mesh);
worldOctree.fromGraphNode(planeMesh);
console.log('查看八叉树结构', worldOctree);

// 创建可视化八叉树辅助器
const octreeHelper = new OctreeHelper(worldOctree);
scene.add(octreeHelper);

// 加载.glb文件
// const gltfLoader = new GLTFLoader();
// gltfLoader
//     .loadAsync(require('../../models/collision-world.glb'))
//     .then((gltf) => {
//         // 场景中添加gltf.scene;
//         scene.add(gltf.scene);
//         gltf.scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//                 if (child.material.map) {
//                     child.material.map.anisotropy = 4;
//                 }
//             }
//         });
//     });

// (2)可视化胶囊几何体
// const capsuleHelper = CapsuleHelper(R, H);
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
