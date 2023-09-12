import * as THREE from 'three';

export default function modifyCityMaterial(material, mesh) {
    material.onBeforeCompile = (shader) => {
        console.log('vertexShader', shader.vertexShader);
        console.log('fragmentShader', shader.fragmentShader);

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
        shader.uniforms.u_topColor = {
            value: new THREE.Color(0xffffff),
        };

        // 修改顶点着色器
        shader.vertexShader = shader.vertexShader.replace(
            `#include <common>`,
            /*glsl*/ `
            #include <common>
            varying vec3 vPosition;
            `
        );

        // 修改开始的顶点着色器
        // threejs-demo/node_modules/three/src/renderers/shaders/ShaderChunk/begin_vertex.glsl.js
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            /*glsl*/ `
              #include <begin_vertex>
              vPosition = position;
            `
        );

        // 修改片元着色器
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            /*glsl*/ `#include <common>
             varying vec3 vPosition;
             uniform vec3 u_topColor;
             uniform float u_height;
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <dithering_fragment>`,
            /*glsl*/ `#include <dithering_fragment>
                // 渐变目标颜色
                vec4 distGradColor = gl_FragColor;
                // 设置混合百分比
                float gradMix = (vPosition.y + u_height/2.0)/u_height;
                // 计算出混合颜色
                vec3 gradMixColor  = mix(distGradColor.xyz,u_topColor,gradMix);

                gl_FragColor = vec4(gradMixColor, 1);
                 
           `
        );
    };
}
