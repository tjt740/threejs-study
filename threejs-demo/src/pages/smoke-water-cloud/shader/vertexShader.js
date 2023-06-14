
const vertexShader =  `
void main(){
precision highp float;
vec4  modelPosition  =  modelMatrix * vec4( position, 1.0 );
gl_Position = projectionMatrix * viewMatrix *  modelPosition;
}
`

export default vertexShader;
