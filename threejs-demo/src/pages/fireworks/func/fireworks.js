import * as THREE from 'three';
// 初始烟花位置的着色器材质
import startFireworkVertexshader from '../shader/start-firework/start-firework-vertexshader';
import startFireworkFragmentshader from '../shader/start-firework/start-firework-fragmentshader';

// 创建类组件
export default class FireWork {
    // from: 烟花初始发射位置 position:烟花终点位置
    constructor({ color, position, from = { x: 0, y: 0, z: 0 }, scene }) {
        // console.log('创建烟花:', color, position);
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
                new Float32Array([from.x, from.y, from.z]),
                3
            )
        );
        // 设置初始小球着色器材质
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
                // 设置uTime,通过updateTime更新
                uTime: {
                    value: 0,
                },
                // 尺寸
                uSize: {
                    value: 15.0,
                },
            },
        });
        // 设置初始小球
        this.startFireworkBail = new THREE.Points(
            this.startFireworkBailGeometry,
            this.startFireworkBailMaterial
        );

        // 给初始小球设置，烟花🎆位移距离
        this.startFireworkBailGeometry.setAttribute(
            'step',
            new THREE.BufferAttribute(
                new Float32Array([
                    position.x - from.x, // 烟花终点 - 烟花起始点距离
                    position.y - from.y,
                    position.z - from.z,
                ]),
                3
            )
        );

        // console.log(this.startFireworkBailGeometry);
        // 定义场景
        this.scene = scene;

        // 通过uTimes去实现烟花的移动
        // 定义时间
        this.time = new THREE.Clock();

        // 创建爆炸💥烟花
        this.fireworkBoomGeometry = new THREE.BufferGeometry();
        // 烟花爆炸数量
        this.maxFireworkCount = 180 + Math.floor(Math.random() * 180);
        // 爆炸烟花顶点位置
        this.fireworkBoomPositionList = [];
        // 烟花大小
        this.fireworkBoomScaleList = [];
        // 烟花方向数组
        this.fireworkBoomDirectionList = [];

        for (let i = 0; i < this.maxFireworkCount; i++) {
            // 负责每3个点形成一个烟花坐标点
            this.fireworkBoomPositionList[i * 3 + 0] = position.x; // 0 1 2 ... 3个点 为一个坐标
            this.fireworkBoomPositionList[i * 3 + 1] = position.y;
            this.fireworkBoomPositionList[i * 3 + 2] = position.z;

            // // 负责每一个烟花的大小
            // this.fireworkBoomScaleList[i] = Math.random();

            // // 每一个烟花向4周发射的角度
            // // 发射上下为圆
            // const theta = Math.random() * 2 * Math.PI;
            // // 发射左右为圆
            // const beta = Math.random() * 2 * Math.PI;
            // // 发射半径
            // const r = Math.random();

            // this.fireworkBoomDirectionList[i * 3 + 0] =
            //     r * Math.sin(theta) + r * Math.sin(beta);
            // this.fireworkBoomDirectionList[i * 3 + 1] =
            //     r * Math.cos(theta) + r * Math.cos(beta);
            // this.fireworkBoomDirectionList[i * 3 + 2] =
            //     r * Math.sin(theta) + r * Math.cos(beta);
        }

        // 设置爆炸💥烟花顶点位置
        this.fireworkBoomGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array(this.fireworkBoomPositionList),
                3
            )
        );
        // 设置爆炸💥烟花大小
        this.fireworkBoomGeometry.setAttribute(
            'boomScale',
            new THREE.BufferAttribute(
                new Float32Array(this.fireworkBoomScaleList),
                1
            )
        );
        // 设置爆炸💥烟花方向
        this.fireworkBoomGeometry.setAttribute(
            'randomDirection',
            new THREE.BufferAttribute(
                new Float32Array(this.fireworkBoomDirectionList),
                3
            )
        );

        // 设置爆炸💥烟花材质
        this.fireworkBoomMaterial = new THREE.ShaderMaterial({
            // 顶点着色器
            vertexShader: /*glsl*/ `
            // attribute vec3 step;
            // 时间
            // uniform float uTime;
            // 小球尺寸
            // uniform float uSize;

            void main(){
            
                vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );
                // 位置 = 时间*距离
                // modelPosition.xyz += ( step * uTime);
            
                gl_Position = projectionMatrix * viewMatrix * modelPosition;

                //⭐️ 设置点大小才能显示
                // 随时间逐渐变大
                gl_PointSize = 20.0;
                // gl_PointSize = uSize * uTime;

            }
                    `,
            // 片元着色器
            fragmentShader: /*glsl*/ `
                void main(){
               
                    float strength = distance(gl_PointCoord,vec2(0.5));
                    strength*=2.0;
                    strength = 1.0-strength;
                    gl_FragColor = vec4(strength);

                }
            `,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            // 设置uniforms 把变量带给顶点着色器、片元着色器
            uniforms: {
                // 设置uTime,通过updateTime更新
                uTime: {
                    value: 0,
                },
                // 尺寸
                uSize: {
                    value: 15.0,
                },
            },
        });
        // 爆炸💥烟花
        this.fireworkBoomMesh = new THREE.Points(
            this.fireworkBoomGeometry,
            this.fireworkBoomMaterial
        );
    }

    // 调用场景添加
    addScene() {
        // this.scene.add(this.startFireworkBail);
        this.scene.add(this.fireworkBoomMesh);
    }

    // 更新时间，获取时间步数
    updateTime() {
        const getElapsedTime = this.time.getElapsedTime();
        // 更新uTime
        // 限制小球飞出去的距离，时间限制
        if (getElapsedTime < 1) {
            this.startFireworkBailMaterial.uniforms.uTime.value =
                getElapsedTime;
            this.startFireworkBailMaterial.uniforms.uSize.value = 18;
            // 小球飞出去后炸开（需要清除原先飞出去的小球）
        } else {
            // 清除物体
            this.scene.remove(this.startFireworkBail);
            // 清除小球自定义几何体
            this.startFireworkBailGeometry.dispose();
            // 重置小球的uSize
            this.startFireworkBailMaterial.uniforms.uSize.value = 0;
        }
        // console.log('运行时间:', getElapsedTime);
    }
}
