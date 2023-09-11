import * as THREE from 'three';

export default function modifyCityMaterial(material, mesh) {
    material.onBeforeCompile = (shader) => {
        const { vertexShader, fragmentShader } = shader;

        console.log('vertexShader', vertexShader);
        // console.log('fragmentShader', fragmentShader);

        // 使用bufferGeometry中的.computeBoundingBox();方法，计算模型的包围盒
        mesh.geometry.computeBoundingBox();
        // 包围盒信息
        const boundingBox = mesh.geometry.boundingBox;
        // 获取几何体 最大值、最小值
        const { max, min } = boundingBox;
        // 获取高度差
        let u_height = max.y - min.y;
        // 获取宽度差
        let u_width = max.x - min.x;

        shader.uniforms.u_height = { value: u_height };
        shader.uniforms.u_width = { value: u_width };
    };
}
