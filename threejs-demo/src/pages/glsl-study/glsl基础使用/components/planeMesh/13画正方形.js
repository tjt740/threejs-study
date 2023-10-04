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
       
        // 定义函数
        float rect(vec2 pt, vec2 size, vec2 center) {
            /*
                假设
                    正方形中心在 (0.5,0);
                    pt = v_position.xy = vec2(0.6,0.0);
                    p = pt - center = (0.1,0.0);
                    size = vec2(0.5);
            */
            vec2 p = pt - center;
            // 假设我们只给正方形尺寸设置一半
            vec2 halfSize = size * 0.5; // vec2(0.5,0.5);
            float horz = step(-halfSize.x, p.x) -  step(halfSize.x, p.x);
            float vert = step(-halfSize.y, p.y) -  step(halfSize.y, p.y);
            return horz*vert;
        }
          

        void main() {
            // 创建纯黄色画布 return === 1.0;
            float inRect = rect(v_position.xy, vec2(1.0,1.0), vec2(0.0,0.0));

            // 颜色
            vec3 color = vec3(1.0,1.0,0.0) * inRect;

            gl_FragColor = vec4(color,1.0); 
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

export default planeMesh;
