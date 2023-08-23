const startFireworkFragmentshader = /*glsl*/ `
    
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
        gl_FragColor = vec4(strength);    
    }
`;

export default startFireworkFragmentshader;
