const fireworksVertexshader = /*glsl*/ `

    
    attribute float boomScale;
    attribute vec3 randomDirection;
    

    uniform float uTime;
    uniform float uSize;

    void main(){
    
        vec4 modelPosition =  modelMatrix * vec4( position, 1.0 );

        // 烟火通过randomDirection 散开 +散开速度
        modelPosition.xyz+=randomDirection* uTime * 10.0;

        gl_Position = projectionMatrix * viewMatrix * modelPosition;

        //⭐️ 设置点大小才能显示
        // 随时间逐渐再变小
        gl_PointSize = uSize*boomScale-(uTime*10.0);

    

    }

`;
export default fireworksVertexshader;
