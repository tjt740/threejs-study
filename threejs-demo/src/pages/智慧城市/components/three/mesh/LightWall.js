import * as THREE from 'three';
import gsap from 'gsap';

export default class LightWall {
    constructor() {
        // 创建圆柱缓冲几何体 (圆柱的顶部半径，圆柱的底部半径，圆柱高度，圆柱四周分段数，圆柱测面分段数，是否不封顶两端)
        const cylinderHeight = 4;
        this.cylinderGeometry = new THREE.CylinderGeometry(
            3,
            3,
            cylinderHeight,
            32,
            1,
            true
        );
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,

            vertexShader: /*glsl*/ `

            varying vec3 vPosition;

                void main(){
                    vPosition = position;

                    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
                    gl_Position = projectionMatrix * viewPosition;
                }
            `,
            fragmentShader: /*glsl*/ `
             varying vec3 vPosition;
             uniform float u_height;
                void main(){
                 
                     // 渐变目标颜色
                    vec4 distGradColor = gl_FragColor;
                    // 设置混合百分比
                    float gradMix = (vPosition.y + u_height/2.0)/u_height;
                    // 计算出混合颜色
                    gl_FragColor = vec4(1,1,0,1.0-gradMix);
                  
                }
            `,
            uniforms: {},
        });

        this.material.uniforms.u_height = { value: cylinderHeight };

        this.cylinder = new THREE.Mesh(this.cylinderGeometry, this.material);
        this.cylinder.position.set(0, 1.5, 0);

        // 光墙动画
        gsap.to(this.cylinder.scale, {
            x: 2,
            z: 2,
            repeat: -1,
            yoyo: true,
            duration: 1,
        });

        return this.cylinder;
    }
}
