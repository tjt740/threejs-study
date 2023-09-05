<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import RoomShapeMesh from "./threeMesh/RoomShapeMesh.js";
import WallShaderMaterial from "./threeMesh/WallShaderMaterial.js";
import Wall from "./threeMesh/Wall.js";
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5.5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

requestAnimationFrame(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
});

// 添加辅助坐标
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
// 加载全景图
const loader = new THREE.TextureLoader();
const texture = loader.load("/assets/HdrSkyCloudy004_JPG_8K.jpg");
texture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = texture;
scene.environment = texture;

// 加载接口
let idToPanorama = {};
fetch(
  "https://test-1251830808.cos.ap-guangzhou.myqcloud.com/three_course/demo720.json"
)
  .then((res) => res.json())
  .then((obj) => {
    console.log(obj);

    // 循环创建房间
    for (let i = 0; i < obj.objData.roomList.length; i++) {
      // 获取房间数据
      const room = obj.objData.roomList[i];
      let roomMesh = new RoomShapeMesh(room);
      let roomMesh2 = new RoomShapeMesh(room, true);
      scene.add(roomMesh, roomMesh2);
      panoramaLocation = obj.panoramaLocation;
      // 房间到全景图的映射
      for (let j = 0; j < obj.panoramaLocation.length; j++) {
        const panorama = obj.panoramaLocation[j];
        if (panorama.roomId === room.roomId) {
          let material = new WallShaderMaterial(panorama);
          panorama.material = material;
          idToPanorama[room.roomId] = panorama;
        }
      }

      //

      roomMesh.material = idToPanorama[room.roomId].material;
      roomMesh.material.side = THREE.DoubleSide;
      roomMesh2.material = idToPanorama[room.roomId].material.clone();
      roomMesh2.material.side = THREE.FrontSide;

      console.log(idToPanorama);
    }

    // 创建墙
    for (let i = 0; i < obj.wallRelation.length; i++) {
      let wallPoints = obj.wallRelation[i].wallPoints;
      let faceRelation = obj.wallRelation[i].faceRelation;

      faceRelation.forEach((item) => {
        item.panorama = idToPanorama[item.roomId];
      });

      let mesh = new Wall(wallPoints, faceRelation);
      scene.add(mesh);
    }
  });
let roomIndex = 0;
let timeline = gsap.timeline();
let dir = new THREE.Vector3();
let panoramaLocation;
function changeRoom() {
  let room = panoramaLocation[roomIndex];
  dir = camera.position
    .clone()
    .sub(
      new THREE.Vector3(
        room.point[0].x / 100,
        room.point[0].z / 100,
        room.point[0].y / 100
      )
    )
    .normalize();

  timeline.to(camera.position, {
    duration: 1,
    x: room.point[0].x / 100 + dir.x * 0.01,
    y: room.point[0].z / 100,
    z: room.point[0].y / 100 + dir.z * 0.01,
  });
  camera.lookAt(
    room.point[0].x / 100,
    room.point[0].z / 100,
    room.point[0].y / 100
  );
  controls.target.set(
    room.point[0].x / 100,
    room.point[0].z / 100,
    room.point[0].y / 100
  );
  roomIndex++;
  if (roomIndex >= panoramaLocation.length) {
    roomIndex = 0;
  }
}
</script>

<template>
  <div>
    <button class="btn" @click="changeRoom">切换房间</button>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}
.btn {
  position: fixed;
  left: 50px;
  top: 50px;
  background: skyblue;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000;
}
</style>
