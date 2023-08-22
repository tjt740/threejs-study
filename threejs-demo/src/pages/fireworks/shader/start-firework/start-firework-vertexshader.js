const startFireworkVertexshader = /*glsl*/ `
    varying vec2 vUv;
    void main(){
    vUv=uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;

        //⭐️ 设置点大小才能显示
        gl_PointSize = 50.0;

    }

`;
export default startFireworkVertexshader;
