import * as THREE from 'three';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import renderer from '../three/renderer';
import camera from '../three/camera';
import scene from '../three/scene';

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

// 渲染战斗机
const fighterGroup = new THREE.Group();

let _gltf;
gltfLoader.loadAsync(require('../model/Fighter1.glb')).then((gltf) => {
    console.log(gltf);
    _gltf = gltf;
    fighterGroup.add(gltf.scene);
    fighterGroup.position.y = 40;
    fighterGroup.position.z = 75;
    scene.add(fighterGroup);

    // 添加射线检测
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
        const intersects = raycaster.intersectObjects(gltf.scene.children);

        if (intersects.length) {
            // 控制战斗机显隐
            fighterGroup.visible = !fighterGroup.visible;
        }
    };

    // 全局添加点击事件
    window.addEventListener('click', onClick);

    // 粒子化飞机
    creatParticleFighter(false, _gltf);
    // 粒子爆炸
    particlesBoom(false, _gltf);
});

export { fighterGroup };

// 创建粒子化飞机
const particlesGroup = new THREE.Group();
const creatParticleFighter = (flag = false, gltf = _gltf) => {
    if (flag) {
        gltf.scene.traverse((child) => {
            recursion(child, particlesGroup);
        });

        // 递归判断子组件children中是否有Mesh，如果有就重新追加执行
        function recursion(object3D, particlesGroup) {
            if (object3D.children.length) {
                object3D.children.forEach((child) => {
                    if (child.isMesh) {
                        const verticesArrary =
                            child.geometry.attributes.position.array;

                        // 生成粒子自定义几何体
                        const particlesGeometry = new THREE.BufferGeometry();
                        // 创建配置数组
                        const vertices = new Float32Array(verticesArrary);
                        particlesGeometry.setAttribute(
                            'position',
                            new THREE.BufferAttribute(vertices, 3)
                        );

                        // 使用<点>材质
                        const pointsMaterial = new THREE.PointsMaterial({
                            color: new THREE.Color(
                                Math.random(),
                                Math.random(),
                                Math.random()
                            ),
                            map: new THREE.TextureLoader().load(
                                require('../textures/3.png')
                            ),
                            // 设置<点>材质尺寸，默认1.0
                            size: 0.2,
                            // 材质大小随相机深度（远近而衰减），默认为true
                            sizeAttenuation: true,
                            // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
                            depthWrite: false,
                            //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
                            blending: THREE.AdditiveBlending,
                        });

                        // 生成<点>物体
                        const sphere = new THREE.Points(
                            particlesGeometry,
                            pointsMaterial
                        );
                        // 设置位置信息、尺寸大小、旋转角度

                        sphere.position.copy(child.position);
                        sphere.scale.copy(child.scale);
                        sphere.rotation.copy(child.rotation);
                        particlesGroup.add(sphere);

                        // 递归
                        recursion(child, particlesGroup);
                    }
                });
            }
        }
        scene.add(particlesGroup);
        // console.log(particlesGroup);

        // gltf.scene.traverse((child) => {
        //     if (child.isMesh) {
        //         console.log(child);

        //         const verticesArrary = child.geometry.attributes.position.array;
        //         // 生成粒子自定义几何体
        //         const particlesGeometry = new THREE.BufferGeometry();
        //         // 创建配置数组
        //         const vertices = new Float32Array(verticesArrary);
        //         particlesGeometry.setAttribute(
        //             'position',
        //             new THREE.BufferAttribute(vertices, 3)
        //         );

        //         // 使用<点>材质
        //         const pointsMaterial = new THREE.PointsMaterial({
        //             color: new THREE.Color(
        //                 Math.random(),
        //                 Math.random(),
        //                 Math.random()
        //             ),
        //             // 设置<点>材质尺寸，默认1.0
        //             size: 0.2,
        //             // 材质大小随相机深度（远近而衰减），默认为true
        //             sizeAttenuation: true,
        //             // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
        //             depthWrite: false,
        //             //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
        //             blending: THREE.AdditiveBlending,
        //         });

        //         // 生成<点>物体
        //         const sphere = new THREE.Points(
        //             particlesGeometry,
        //             pointsMaterial
        //         );
        //         // 设置位置信息、尺寸大小、旋转角度
        //         sphere.position.copy(child.position);
        //         sphere.scale.copy(child.scale);
        //         sphere.rotation.copy(child.rotation);

        //         particlesGroup.add(sphere);
        //     }
        // });
        // scene.add(particlesGroup);
    }
};

export { creatParticleFighter, particlesGroup };

// 粒子爆炸
const particlesBoomGroup = new THREE.Group();
const particlesBoom = (flag = false, gltf = _gltf) => {
    if (flag) {
        gltf.scene.traverse((child) => {
            recursion(child, particlesBoomGroup);
        });

        // 递归判断子组件children中是否有Mesh，如果有就重新追加执行
        function recursion(object3D, particlesBoomGroup) {
            if (object3D.children.length) {
                object3D.children.forEach((child) => {
                    if (child.isMesh) {
                        const verticesArrary =
                            child.geometry.attributes.position.array;

                        // 生成粒子自定义几何体
                        const particlesGeometry = new THREE.BufferGeometry();
                        // 创建配置数组
                        const vertices = new Float32Array(verticesArrary);
                        particlesGeometry.setAttribute(
                            'position',
                            new THREE.BufferAttribute(vertices, 3)
                        );

                        const color = new THREE.Color(
                            Math.random(),
                            Math.random(),
                            Math.random()
                        );

                        const pointsMaterial = new THREE.ShaderMaterial({
                            // 设置材质随相机深度重叠后，是否进行遮挡。默认为true
                            depthWrite: false,
                            //  设置材质在随相机深度重叠后，遮挡样式 https://threejs.org/docs/index.html#api/zh/constants/Materials
                            blending: THREE.AdditiveBlending,
                            vertexShader: /*glsl*/ `
                               attribute vec3 aPosition; 
uniform float u_time;
void main(){
    vec4 currentPosition = modelMatrix * vec4(position, 1.0);
    vec3 direction = aPosition - currentPosition.xyz;

    vec3 targetPosition = currentPosition.xyz + direction * 0.5 * u_time;
    vec4 vPosition = viewMatrix * vec4(targetPosition, 1.0);
    gl_Position = projectionMatrix*vPosition;
    
    gl_PointSize = 10.0;
}
                            `,
                            fragmentShader: /*glsl*/ `
                                uniform sampler2D u_texture;
                                uniform vec3 u_color;
                                void main(){
                                    vec4 uTextureColor = texture2D(u_texture, gl_PointCoord);
    gl_FragColor =  vec4(u_color,uTextureColor);
                                }
                            `,
                            uniforms: {
                                u_time: {
                                    value: 0,
                                },
                                u_color: {
                                    value: color,
                                },
                                u_texture: {
                                    value: new THREE.TextureLoader().load(
                                        require('../textures/2.png')
                                    ),
                                },
                            },
                        });

                        // 生成<点>物体
                        const sphere = new THREE.Points(
                            particlesGeometry,
                            pointsMaterial
                        );
                        // 设置位置信息、尺寸大小、旋转角度

                        sphere.position.copy(child.position);
                        sphere.scale.copy(child.scale);
                        sphere.rotation.copy(child.rotation);
                        particlesBoomGroup.add(sphere);

                        // 递归
                        recursion(child, particlesBoomGroup);

                        const clock = new THREE.Clock();
                        function loop() {
                            const time = clock.getElapsedTime();
                            pointsMaterial.uniforms.u_time.value = time;
                            requestAnimationFrame(loop);
                        }
                        loop();
                    }
                });
            }
        }
        scene.add(particlesBoomGroup);
    }
};

export { particlesBoom, particlesBoomGroup };
