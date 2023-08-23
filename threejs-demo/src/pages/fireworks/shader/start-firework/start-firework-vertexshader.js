const startFireworkVertexshader = /*glsl*/ `
    
    attribute vec3 step;
    // 时间
    uniform float uTime;
    // 小球尺寸
    uniform float uSize;

    void main(){
    
        vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );
        // 位置 = 时间*距离
        modelPosition.xyz += ( step * uTime);
    
        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        //⭐️ 设置点大小才能显示
        // 随时间逐渐变大
        gl_PointSize = uSize * uTime;

    }

`;
export default startFireworkVertexshader;
