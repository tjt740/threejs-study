import * as THREE from 'three';
import gsap from 'gsap';

export default class Radar {
    constructor() {
        // 创建平面
        this.planeGeometry = new THREE.PlaneGeometry(3, 3);
        // 创建材质
        this.planeMaterial = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            vertexShader: /*glsl*/ `
                varying vec2 vUv;
                   void main(){
                    vUv = uv;
                    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
                    gl_Position = projectionMatrix * viewPosition;
                }
            `,
            fragmentShader: /*glsl*/ `
             varying vec2 vUv;
             uniform vec3 u_color;
             uniform float u_time;
             // 渲染函数（1）
             vec2 rotate(vec2 uv, float rotation, vec2 mid){
                return vec2(
                    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
                    );
             }
            // 渲染函数（2）
            // mat2 rotate2d(float _angle){
            //   return mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle));
            // }

            // void main(){
            //     vec2 newUv = rotate2d(u_time*6.28) * (vUv-0.5);
            //     newUv += 0.5;
            //     float alpha =  1.0 - step(0.5,distance(newUv,vec2(0.5)));
                
            //     float angle = atan(newUv.x-0.5,newUv.y-0.5);
            //     float strength = (angle+3.14)/6.28;
            //     gl_FragColor =vec4(u_color,alpha*strength);
            // }

              void main(){
     
                vec2 rotateUv = rotate(vUv,-u_time*5.0,vec2(0.5));
                float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
                float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
                float strength = (angle+3.14)/ (2.0* 3.1415926);
                gl_FragColor =vec4(u_color,alpha*strength);
              
            }
    
            `,

            uniforms: {
                u_color: {
                    value: new THREE.Color(0x422134),
                },
                u_time: {
                    value: 0,
                },
            },
        });

        this.radar = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        this.radar.rotation.x = Math.PI / 2;
        this.radar.position.set(0, 2, 0);

        gsap.to(this.planeMaterial.uniforms.u_time, {
            value: 999,
            duration: 999,
            repeat: -1,
            ease: 'none',
        });

        return this.radar;
    }
}
