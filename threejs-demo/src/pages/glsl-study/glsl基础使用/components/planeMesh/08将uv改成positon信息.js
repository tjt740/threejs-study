import * as THREE from 'three';
import scene from '../../three/scene';
import renderer from '../../three/renderer';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {},

    vertexShader: /*glsl*/ `
         
        varying vec3 v_position;
        
        void main() {
       
            v_position = position;

            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
        varying vec3 v_position;
       
        void main() {
        // 通过纹理坐标采样纹理贴图
            gl_FragColor = vec4(v_position,1.0); 
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
