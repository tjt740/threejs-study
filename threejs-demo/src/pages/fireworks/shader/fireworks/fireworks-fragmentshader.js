const fireworksFragmentshader = /*glsl*/ `
    // void main(){
    //      // 设置渐变圆
    //     float strength = distance(gl_PointCoord,vec2(0.5));
    //     strength *= 2.0;
    //     strength = 1.0-strength;
    //     gl_FragColor = vec4(strength);

    // }

    
    uniform vec3 uColor;
    void main(){
        float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
        float strength = distanceToCenter*2.0;
        strength = 1.0-strength;
        strength = pow(strength,1.5);
        gl_FragColor = vec4(uColor,strength);
    }
`;

export default fireworksFragmentshader;
