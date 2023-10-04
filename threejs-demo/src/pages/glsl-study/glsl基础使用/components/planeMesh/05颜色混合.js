import * as THREE from 'three';
import scene from '../../three/scene';
import renderer from '../../three/renderer';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: {
            value: {
                x: 0,
                y: 0,
            },
        },
    },

    vertexShader: /*glsl*/ `
        void main() {
            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
    uniform vec2 u_resolution;
        void main() {

            vec2 uv = vec2( gl_FragCoord.xy/u_resolution);
            /*
                左下：(0.0, 0.0) gl_FragColor = vec4(uv,0.0,1.0) === rgba(0.0,0.0,0.0,1.0) 黑色
                左上：(0.0, 1.0) gl_FragColor = vec4(uv,0.0,1.0) === rgba(0.0,1.0,0.0,1.0) 绿色
                右上：(1.0, 1.0) gl_FragColor = vec4(uv,0.0,1.0) === rgba(1.0,1.0,0.0,1.0) 黄色
                右下：(1.0, 0.0) gl_FragColor = vec4(uv,0.0,1.0) === rgba(1.0,0.0,0.0,1.0) 红色
            */
            // 中间
            vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), uv.y);
            gl_FragColor = vec4(color , 1.0);
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const getRenderWorH = () => {
    planeMaterial.uniforms.u_resolution.value.x = Number(
        renderer.domElement.style.width.split('px')[0]
    );
    planeMaterial.uniforms.u_resolution.value.y = Number(
        renderer.domElement.style.height.split('px')[0]
    );
};
getRenderWorH();

export default planeMesh;
