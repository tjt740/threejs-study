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
            vec3 color = vec3(0.0,0.0,0.0);
            
            //使用 smoothstep( edge0, edge1, x ); 如果x <= edge0，返回0.0 ；如果x >= edge1 返回1.0；如果edge0 < x < edge1，则执行0~1之间的平滑埃尔米特差值。
            color.r = smoothstep(0.0, 1.0,v_position.x);// 0 0 1 1
            color.g = smoothstep(0.0,1.0,v_position.y);// 0 1 1 0
            color.b = 0.0;

            gl_FragColor = vec4(color,1.0); 
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
