import * as THREE from 'three';
// 初始烟花位置的着色器材质
import startFireworkVertexshader from '../shader/start-firework/start-firework-vertexshader';
import startFireworkFragmentshader from '../shader/start-firework/start-firework-fragmentshader';

// 创建类组件
export default class FireWork {
    // from: 烟花初始发射位置 position:烟花终点位置
    constructor({ color, position, form = { x: 0, y: 0, z: 0 }, scene }) {
        console.log('创建烟花:', color, position);
        // 转换成three.js color
        this.color = new THREE.Color(color);
        // 烟花终点位置
        this.position = position;
        // 创建烟花起始小球
        this.startFireworkBailGeometry = new THREE.BufferGeometry();
        // 设置小球初始位置
        this.startFireworkBailGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array([form.x, form.y, form.z]),
                3
            )
        );
        // 设置初始小球着色器caiz
        this.startFireworkBailMaterial = new THREE.ShaderMaterial({
            // 顶点着色器
            vertexShader: startFireworkVertexshader,
            // 片元着色器
            fragmentShader: startFireworkFragmentshader,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            // 设置uniforms 把变量带给顶点着色器、片元着色器
            uniforms: {
                // 随机圆球颜色
                uColor: { value: this.Color },
            },
        });
        // 设置初始小球
        this.startFireworkBail = new THREE.Points(
            this.startFireworkBailGeometry,
            this.startFireworkBailMaterial
        );

        this.scene = scene;
    }

    // 调用场景添加
    addScene() {
        this.scene.add(this.startFireworkBail);
    }
}
