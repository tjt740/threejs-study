import * as THREE from 'three';
// 引入gsap补间动画操作组件库
import gsap from 'gsap';

export default function modifyCityMaterial(material, mesh) {
    material.onBeforeCompile = (shader) => {
        // console.log('vertexShader', shader.vertexShader);
        // console.log('fragmentShader', shader.fragmentShader);
        /*
         *封装一下
         */
        // 修改城市底色
        modifyCityGradColor(mesh, shader);
        // 增加城市雷达辐射效果
        addCityRadarEffectShader(shader);
        // 增加光束
        otherLightLine(shader);
        //  楼房灯光向上特效
        addToTopLine(shader);
    };
}

// 修改城市底色
function modifyCityGradColor(mesh, shader) {
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

          // #谭金涛#
     `
    );

    gsap.to(shader.uniforms.u_lightLineWidth, {
        value: 500,
        duration: 5,
        ease: 'none',
        repeat: -1,
    });
}

// 增加城市雷达辐射效果
function addCityRadarEffectShader(shader) {
    // 设置辐射雷达中心点
    shader.uniforms.u_spreatCenter = { value: new THREE.Vector2(0, 0) };
    // 设置辐射雷达扩散波纹宽度
    shader.uniforms.u_spreadWidth = { value: 10 };
    // 扩散时间
    shader.uniforms.u_spreadTime = { value: 0 };

    // 片元着色器替换
    shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        /*glsl*/ `#include <common>
            // 定义uniforms
            uniform vec2 u_spreatCenter;
            uniform float u_spreadWidth;
            uniform float u_spreadTime;
        `
    );
    // 接着定义的 #谭金涛#修改
    shader.fragmentShader = shader.fragmentShader.replace(
        `// #谭金涛#`,
        /*glsl*/ `
        // 扩散半径
    float spreadRadius = distance(vPosition.xz,u_spreatCenter);
        
        //  扩散范围的函数
    float spreadIndex = -(spreadRadius-u_spreadTime)*(spreadRadius-u_spreadTime)+u_spreadWidth;
        
        if(spreadIndex>0.0){
            gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex/u_spreadWidth);
        }

    // #谭金涛#
    `
    );

    gsap.to(shader.uniforms.u_spreadTime, {
        value: 800,
        duration: 3,
        ease: 'none',
        repeat: -1,
    });
}

// 增加其他特效
function otherLightLine(shader) {
    //   扩散的时间
    shader.uniforms.uLightLineTime = { value: -1500 };
    //   设置条带的宽度
    shader.uniforms.uLightLineWidth = { value: 200 };

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        /*glsl*/ `
       #include <common>
 
       // 灯时间
       uniform float uLightLineTime;
       // 灯带宽度
       uniform float uLightLineWidth;
       `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        `// #谭金涛#`,
        /*glsl*/ `
     float LightLineMix = -(vPosition.x+vPosition.z-uLightLineTime)*(vPosition.x+vPosition.z-uLightLineTime)+uLightLineWidth;
 
     if(LightLineMix>0.0){
         gl_FragColor = mix(gl_FragColor,vec4(0.8,1.0,1.0,1),LightLineMix /uLightLineWidth);
         
     }
 
     // #谭金涛#
     `
    );

    gsap.to(shader.uniforms.uLightLineTime, {
        value: 1500,
        duration: 5,
        ease: 'none',
        repeat: -1,
    });
}

// 楼房灯光向上特效
function addToTopLine(shader) {
    //   扩散的时间
    shader.uniforms.uToTopTime = { value: 0 };
    //   设置条带的宽度
    shader.uniforms.uToTopWidth = { value: 40 };

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
            #include <common>
            // 灯时
            uniform float uToTopTime;
            // 灯带宽度
            uniform float uToTopWidth;
            `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '// #谭金涛#',
        `
          float ToTopMix = -(vPosition.y-uToTopTime)*(vPosition.y-uToTopTime)+uToTopWidth;
      
          if(ToTopMix>0.0){
              gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1,1),ToTopMix /uToTopWidth);
              
          }
      
          // #谭金涛#
          `
    );

    gsap.to(shader.uniforms.uToTopTime, {
        value: 500,
        duration: 3,
        ease: 'none',
        repeat: -1,
    });
}
