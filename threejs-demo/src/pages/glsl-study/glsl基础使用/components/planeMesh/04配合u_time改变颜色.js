import * as THREE from 'three';
import scene from '../../three/scene';
import renderer from '../../three/renderer';

const planeGeometry = new THREE.PlaneGeometry(15, 15);

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_color: {
            value: new THREE.Color(0xf02350),
        },
        u_mouse: { value: { x: 0.0, y: 0.0 } },
        u_time: { value: 0 },
    },

    vertexShader: /*glsl*/ `
        void main() {
            // <投影矩阵>*<视图矩阵>*<模型矩阵>*<顶点坐标>
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /*glsl*/ `
        uniform vec3 u_color;
        uniform vec2 u_mouse;


        void main() {
            // gl_FragColor = vec4(u_color, 1.0);
            vec3 color = vec3(u_mouse.x, 0.0, u_mouse.y); 
            gl_FragColor = vec4(color, 1.0);
        }
    `,
});

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// 点击修改uniforms.u_color的颜色
// renderer.domElement.addEventListener('click', (e) => {
//     planeMaterial.uniforms.u_color.value = new THREE.Color(
//         Math.random(),
//         Math.random(),
//         Math.random()
//     );

//     planeMaterial.uniforms.u_mouse.value.x = (e.clientX / 100) * Math.random();
//     planeMaterial.uniforms.u_mouse.value.y = (e.clientY / 100) * Math.random();
// });

const clock = new THREE.Clock();
// 动画帧
const loop = () => {
    // 获取秒数
    const time = clock.getElapsedTime();

    // planeMaterial.uniforms.u_time.value = Math.sin(time);
    console.log(Math.sin(time));

    requestAnimationFrame(loop);
};
loop();

export default planeMesh;
