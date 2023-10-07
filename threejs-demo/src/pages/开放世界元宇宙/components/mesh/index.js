import * as THREE from 'three';
import scene from '../../three/scene';

const R = 100; //半径长度

const angle = Math.PI / 6; // 30度
// const angle = Math.PI/2;// 90度
// const angle = Math.PI;// 180度

// x,y位置
const x = R * Math.cos(angle);
const y = R * Math.sin(angle);

const geometry = new THREE.SphereGeometry(3);
const material = new THREE.MeshLambertMaterial({ color: 0x00ffff });
const mesh = new THREE.Mesh(geometry, material);
// 设置位置
mesh.position.set(x, y, 0);

scene.add(mesh);
