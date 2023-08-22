
attribute vec3 aStep;

uniform float uTime;
uniform float uSize;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    modelPosition.xyz += (aStep*uTime);

    vec4 viewPosition = viewMatrix * modelPosition;

    

    gl_Position =  projectionMatrix * viewPosition;

    // 设置顶点大小
    gl_PointSize =uSize;
    
}