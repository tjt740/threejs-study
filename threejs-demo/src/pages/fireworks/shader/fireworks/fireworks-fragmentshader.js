const fireworksFragmentshader = /*glsl*/ `
    void main(){
        //2. 设置渐变圆
        float strength = distance(gl_PointCoord,vec2(0.5));
        strength *= 2.0;
        strength = 1.0-strength;
        gl_FragColor = vec4(strength);

    }
`;

export default fireworksFragmentshader;
