import * as THREE from 'three';
import gsap from 'gsap';
export default class FlyLineShader {
    constructor() {
        //1. 生成曲线路径
        this.points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, 3, -4),
            new THREE.Vector3(10, 0, -8),
        ];
        //2. 生成圆滑曲线
        this.curve = new THREE.CatmullRomCurve3(this.points);

        //2.5 获取曲线由多少个点组成
        const curvePoints = this.curve.getPoints(150);

        //3. 将曲线转化为几何体并创建线条对象
        this.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        // 给每个顶点设置属性
        const aSizeArray = new Float32Array(curvePoints.length); // [0, 0, 0, 0, 0, 0, 0, 0, 0,.....151个]
        for (let i = 0; i < aSizeArray.length; i++) {
            aSizeArray[i] = i;
            // 0,1,2  3,4,5  6,7,8
            // let a = i * 3; // 0 3 6
            // let b = a + 1; // 1 4 7
            // let c = a + 2; // 2 5 8
        }

        // 给bufferGeometry增加自定义属性
        this.geometry.setAttribute(
            'aSize',
            new THREE.BufferAttribute(aSizeArray, 1)
        );

        // 增加贴图
        this.texture = new THREE.TextureLoader().load(
            require('../../../textures/z_11.png')
        );
        // this.texture.repeat.set(1, 2);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        // 创建曲线的材质，用线段材质。
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            // 需要关闭深度检测
            depthTest: false,
            blending: THREE.AdditiveBlending,

            vertexShader: /*glsl*/ `
            // 获取自定义属性
            attribute float aSize;
            varying float vSize;
            uniform float u_time;
            uniform vec3 u_color;
            uniform float u_length;

                void main() {
                    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
                    gl_Position = projectionMatrix * viewPosition;
                   
                    // vSize = (aSize-75.0)*10.0;
                    // 配合u_time修改vSize
                     // 当点大小到一定时再出现, aSize  0 ~ 150 跟aSizeArray.length相关
                    vSize = (aSize - u_time);
                  

                    if(vSize<0.0){
                        vSize  = vSize + u_length;
                    }

                    vSize = (vSize-75.0) * 10.0;

                    // 实现近大远小
                    gl_PointSize = -vSize/viewPosition.z;
                    
                }
            `,
            fragmentShader: /*glsl*/ `
                varying float vSize;
                uniform vec3 u_color;
                void main() {
               
                    
                    float distanceToCenter = distance(gl_PointCoord,vec2(0.5,0.5));
                    float strength = 1.0 - (distanceToCenter*2.0);

                    if(vSize<=0.0){
                        gl_FragColor = vec4(1,0,0,0);
                    }else{
                        gl_FragColor = vec4(u_color,strength);
                    }
                }
            `,
            uniforms: {
                u_texture: {
                    value: this.texture,
                },
                u_time: {
                    value: 0,
                },
                u_color: {
                    value: new THREE.Color(0x0fff30),
                },
                u_length: {
                    value: aSizeArray.length,
                },
            },
        });

        // 创建点
        this.mesh = new THREE.Points(this.geometry, this.material);

        gsap.to(this.material.uniforms.u_time, {
            value: 150, // aSizeArray.length
            duration: 3,
            repeat: -1,
        });
        // 更改u_time
        return this.mesh;
    }
}
