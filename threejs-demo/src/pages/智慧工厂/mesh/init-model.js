import * as THREE from 'three';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// 获取屏幕实际渲染3D图像的宽高
import { HEIGHT, WIDTH } from '../three/camera';
// 相机
import camera from '../three/camera';
// 引入CSS3渲染器CSS3DRenderer + CSS3DObject
import {
    CSS3DRenderer,
    CSS3DObject,
} from 'three/addons/renderers/CSS3DRenderer.js';
// renderer
import renderer from '../three/renderer';
// 场景
import scene from '../three/scene';

// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建gltfloader
const gltfLoader = new GLTFLoader();

// 加载被压缩的.glb文件会报错，需要draco解码器
const dracoLoader = new DRACOLoader();
// 设置dracoLoader路径
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
);
// 使用js方式解压
dracoLoader.setDecoderConfig({ type: 'js' });
// 初始化_initDecoder 解码器
dracoLoader.preload();

// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader);

// 渲染外墙
const wallGroup = new THREE.Group();
gltfLoader.loadAsync(require('../model/wall.glb')).then((gltf) => {
    // console.log(gltf);
    wallGroup.add(gltf.scene);
    scene.add(wallGroup);
});
export { wallGroup };

//------------------------------------------
// 渲染地下第一层
const floor1Group = new THREE.Group();
gltfLoader.loadAsync(require('../model/floor1.glb')).then((gltf) => {
    // console.log(gltf);
    floor1Group.add(gltf.scene);
    scene.add(floor1Group);
    // 让叉车动画动起来 （关键帧动画）
    const animationClips = gltf.animations[0];
    // 创建动画播放器
    const mixer = new THREE.AnimationMixer(gltf.scene);
    // 创建动画缓存
    const action = mixer.clipAction(animationClips);
    // 动画播放
    action.play();

    // 设置动画帧
    const clock = new THREE.Clock();
    const loop = () => {
        // 获取秒之间间隔（帧间隔）
        const timeDelta = clock.getDelta();
        // 更新动画播放器
        mixer.update(timeDelta);
        requestAnimationFrame(loop);
    };
    loop();
});
export { floor1Group };
//------------------------------------------

// 创建CSS3DRenderer+CSS3Object
// 渲染底面第一层
const floor2Group = new THREE.Group();
const tagGroup = new THREE.Group();
const css3DGroup = new THREE.Group();
function creatTag(params) {
    const { name, position } = params;
    // 创建一个CSS3渲染器CSS3DRenderer
    const css3DRenderer = new CSS3DRenderer();
    // 给css3DRenderer 设置宽高（整个canvas宽高大小）
    css3DRenderer.setSize(WIDTH, HEIGHT);
    //  因为使用了setSize，所以会跟renderer样式冲突，所以需要修改style。（因为position设置了fixed，所以控制器没有效果），解决办法🔽，更改控制器实例化对象
    const css3DControls = new OrbitControls(camera, css3DRenderer.domElement);
    css3DRenderer.domElement.style.position = 'fixed';
    css3DRenderer.domElement.style.top = '0px';
    //⭐️ 注意位置
    css3DRenderer.domElement.style.right = '0px';
    css3DRenderer.domElement.style.zIndex = '10';
    css3DRenderer.domElement.style.color = '#fff';
    // 将实例化的CSS2DRenderer对象，塞入document.body中。
    document.body.appendChild(css3DRenderer.domElement);

    // 创建DOM
    const element = document.createElement('div');
    element.className = 'elementTag';
    element.innerHTML = /*html*/ `
        <div class="elementContent" >
            <h3 >${name}(点击白色处)</h3>
        </div>
    `;

    // 创建CSS3对象模型CSS3DObject,并将DOM塞入CSS3DObject
    const css3DObject = new CSS3DObject(element);
    css3DObject.position.copy(position);
    css3DObject.scale.set(0.2, 0.2, 0.2);
    // 将 CSS2DObject 添加到earth模型中
    scene.add(css3DObject);

    //📌 因为射线raycaster无法对css3dRenderer对象进行碰撞检测，所以另辟蹊径，采用创建planeGeometry方法来实现
    const planeGeometry = new THREE.PlaneGeometry(30, 40);
    const planeMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        // opacity: 0,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    const { x, y, z } = position;
    planeMesh.position.set(x - 30, y + 20, z);
    planeMesh.name = name;
    tagGroup.add(planeMesh);

    scene.add(tagGroup);

    // // 进行 深度检测 遮住就隐藏
    // //1️⃣ 创建射线
    // const raycaster = new THREE.Raycaster();

    // 渲染循环
    const loop = () => {
        // //2️⃣ 克隆china2DObject位置。
        // const _cloneChinaPosition = css3DObject.position.clone();

        // //3️⃣ 根据克隆的china2DObject位置，计算出标签跟摄像机的距离
        // const labelDistance = _cloneChinaPosition.distanceTo(camera.position);

        // // 4️⃣ 将向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
        // _cloneChinaPosition.project(camera);

        // // 5️⃣ 通过摄像机和 🇨🇳 CSS2DObject位置更新射线 ,设置相机更新射线照射
        // raycaster.setFromCamera(_cloneChinaPosition, camera);

        // // 6️⃣ 检测场景中所有对象的射线碰撞结果
        // const intersects = raycaster.intersectObjects(scene.children);

        // //7️⃣ 如果没有碰撞到任何物体，那么让标签显示
        // if (intersects.length === 0) {
        //     css3DObject.element.style.visibility = 'visible';
        // } else {
        //     //8️⃣ 计算出射线碰撞的第一项距离。
        //     const minDistance = intersects[0].distance;
        //     //9️⃣ 如果射线碰撞的第一项距离 小于 css3DObject到相机的位置就隐藏
        //     if (minDistance < labelDistance) {
        //         css3DObject.element.style.visibility = 'hidden';
        //     } else {
        //         css3DObject.element.style.visibility = 'visible';
        //     }
        // }

        css3DControls.update();
        css3DRenderer.render(scene, camera);
        requestAnimationFrame(loop);
    };
    loop();
}
// 添加射线检测
function raycasterJudge(params) {
    // console.log(params);
    //1️⃣ 创建射线
    const raycaster = new THREE.Raycaster();
    //2️⃣ 创建鼠标点
    const mouse = new THREE.Vector2();
    //3️⃣ 鼠标点击事件
    const onClick = (e) => {
        // ❤️‍🔥4️⃣ 修复点击事件精度
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
        //5️⃣ 通过摄像机和鼠标位置更新射线 ,设置相机更新射线照射
        raycaster.setFromCamera(mouse, camera);

        // 检测照射结果
        const intersects = raycaster.intersectObjects(params.children);
        // console.log(intersects);
        if (intersects.length) {
            alert(intersects[0].object.name); // 弹窗名字
        }
    };

    // 全局添加点击事件
    renderer.domElement.addEventListener('click', onClick);
}

gltfLoader.loadAsync(require('../model/floor2.glb')).then((gltf) => {
    // console.log(gltf);
    floor2Group.add(gltf.scene);
    scene.add(floor2Group);

    gltf.scene.traverse((child) => {
        if (child.type === 'Object3D' && !child.children.length) {
            // console.log(child);
            // 创建CSS3DRenderer+CSS3Object
            creatTag(child);
        }
    });

    // 射线检测判断
    setTimeout(() => {
        raycasterJudge(tagGroup);
        floor2Group.add(tagGroup);
    });
});
export { floor2Group };
