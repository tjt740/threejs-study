import * as THREE from 'three';
import scene from '../../three/scene';
import renderer from '../../three/renderer';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_texture: {
            value: new THREE.TextureLoader().load(require('./textures/1.png')),
        },
    },

    vertexShader: /*glsl*/ `
    // 顶点着色器代码
    varying vec2 vUv; // 传递纹理坐标给片段着色器
        void main() {
        vUv = uv; // 将顶点的纹理坐标传递给片段着色器
            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
            uniform sampler2D u_texture;  // 纹理贴图 uniform 变量
            varying vec2 vUv; // 从顶点着色器传递的纹理坐标
        void main() {
            gl_FragColor = texture2D(u_texture,vUv);  // 通过纹理坐标采样纹理贴图
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
