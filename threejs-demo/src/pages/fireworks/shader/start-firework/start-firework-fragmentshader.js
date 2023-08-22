const startFireworkFragmentshader = /*glsl*/ `
    varying vec2 vUv;
    uniform vec3 uColor;
    void main(){
        // gl_FragColor =  vec4(vUv, 1.0, 1.0);

        //1. 画圆点
        // float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
        // strength = step(0.5,strength);
        // gl_FragColor = vec4(vec3(strength), 1.0);

        //2. 设置渐变圆
        float strength = distance(gl_PointCoord,vec2(0.5));
        strength*=2.0;
        strength = 1.0-strength;
        // gl_FragColor = vec4(strength);

        //3. 将原点进行颜色赋值
        strength = pow(strength,1.5);
        gl_FragColor = vec4(uColor,strength);

    }
`;

export default startFireworkFragmentshader;
