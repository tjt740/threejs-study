import * as THREE from 'three';
import scene from '../../three/scene';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {},

    vertexShader: /*glsl*/ `
        void main() {
            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 0.2, 1.0);
        }
    
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
