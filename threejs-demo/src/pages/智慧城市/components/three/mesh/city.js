import * as THREE from 'three';
import scene from '../scene';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 解压缩.glb .gltf 文件
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// 自定义修改material 修改材质 顶点着色器和片元着色器
import modifyCityMaterial from '../modify-material/modifyCityMaterial';
// 飞线特效（几何体）
import FlyLine from './FlyLine';
// 飞线特效（shader）
import FlyLineShader from './FlyLineShader';
// 修改楼房模型，增加线框特效
import MeshLine from '../mesh/MeshLine';

export default function createCity() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.loadAsync(require('../../../models/city.glb')).then((gltf) => {
        // 修改子级mesh材质
        gltf.scene.traverse((item) => {
            if (item.type === 'Mesh') {
                const cityMaterial = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(0x0c016f),
                    side: THREE.DoubleSide,
                });

                // 通过 .onBeforeCompile 修改材质 顶点着色器和片元着色器
                modifyCityMaterial(cityMaterial, item);
                item.material = cityMaterial;

                // 给楼房增加线框特效
                if (item.name === 'Layerbuildings') {
                    const meshLine = new MeshLine(item);
                    scene.add(meshLine);
                }
            }
        });

        scene.add(gltf.scene);

        // 飞线特效（几何体）
        const flyLine = new FlyLine();
        scene.add(flyLine);
        // 飞线特效（shader）
        const flyLineShader = new FlyLineShader();
        scene.add(flyLineShader);
    });
}
