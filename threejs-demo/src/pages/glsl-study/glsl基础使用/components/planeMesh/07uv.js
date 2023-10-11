import * as THREE from 'three';
import scene from '../../three/scene';
import renderer from '../../three/renderer';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {},

    vertexShader: /*glsl*/ `
         // 从顶点着色器传递的纹理坐标
        varying vec2 v_uv;
        
        void main() {
        // 将顶点的纹理坐标传递给片段着色器
            v_uv = uv; 
            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
        // 从顶点着色器传递的纹理坐标
        varying vec2 v_uv;
       
        void main() {
        // 通过纹理坐标采样纹理贴图
            gl_FragColor = vec4(v_uv,0.0,1.0); 
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
