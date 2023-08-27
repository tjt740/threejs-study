import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let camera, scene, renderer, labelRenderer;

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

let moon;
let chinaPosition;
let chinaLabel;
let chinaDiv;
const raycaster = new THREE.Raycaster();
init();
animate();

// 创建射线

function init() {
    const EARTH_RADIUS = 1;
    const MOON_RADIUS = 0.27;

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        200
    );
    camera.position.set(0, 5, -10);

    scene = new THREE.Scene();

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 0, 1);
    scene.add(dirLight);
    const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
    scene.add(light);

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    //

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
    const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: textureLoader.load('textures/planets/earth_atmos_2048.jpg'),
        specularMap: textureLoader.load(
            'textures/planets/earth_specular_2048.jpg'
        ),
        normalMap: textureLoader.load('textures/planets/earth_normal_2048.jpg'),
        normalScale: new THREE.Vector2(0.85, 0.85),
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    // earth.rotation.y = Math.PI;
    scene.add(earth);

    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
    const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 5,
        map: textureLoader.load('textures/planets/moon_1024.jpg'),
    });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // 添加提示标签
    const earthDiv = document.createElement('div');
    earthDiv.className = 'label';
    earthDiv.innerHTML = '地球';
    const earthLabel = new CSS2DObject(earthDiv);
    earthLabel.position.set(0, 1, 0);
    earth.add(earthLabel);

    // 中国
    const chinaDiv = document.createElement('div');
    chinaDiv.className = 'label1';
    chinaDiv.innerHTML = '中国';
    chinaLabel = new CSS2DObject(chinaDiv);
    chinaLabel.position.set(-0.3, 0.5, -0.9);
    earth.add(chinaLabel);
    console.log(chinaLabel);

    const moonDiv = document.createElement('div');
    moonDiv.className = 'label';
    moonDiv.innerHTML = '月球';
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0, 0.3, 0);
    moon.add(moonLabel);

    // 实例化css2d的渲染器
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(labelRenderer.domElement);
    labelRenderer.domElement.style.position = 'fixed';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.left = '0px';
    labelRenderer.domElement.style.zIndex = '10';

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 100;

    //

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

// // 实例化射线
// const raycaster = new THREE.Raycaster()

function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

    const chinaPosition = chinaLabel.position.clone();
    // 计算出标签跟摄像机的距离
    const labelDistance = chinaPosition.distanceTo(camera.position);
    // 检测射线的碰撞
    // chinaLabel.position
    // 向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
    chinaPosition.project(camera);
    raycaster.setFromCamera(chinaPosition, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    // console.log(intersects)

    // 如果没有碰撞到任何物体，那么让标签显示
    if (intersects.length == 0) {
        chinaLabel.element.classList.add('visible');
    } else {
        // if(labelDistance)
        const minDistance = intersects[0].distance;
        console.log(minDistance, labelDistance);
        if (minDistance < labelDistance) {
            chinaLabel.element.classList.remove('visible');
        } else {
            chinaLabel.element.classList.add('visible');
        }
    }

    // 标签渲染器渲染
    labelRenderer.render(scene, camera);

    renderer.render(scene, camera);
}
