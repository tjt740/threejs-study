import * as THREE from 'three';
import scene from '../scene';
// 引入 GLTFLoader 加载glb模型文件
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 自定义修改material 修改材质 顶点着色器和片元着色器
import modifyCityMaterial from '../modify-material/modifyCityMaterial';
// 飞线特效（几何体）
import FlyLine from './FlyLine';
// 飞线特效（shader）
import FlyLineShader from './FlyLineShader';
// 修改楼房模型，增加线框特效
import MeshLine from '../mesh/meshLine';
// 光墙
import LightWall from './LightWall';
// 雷达扫射特效
import Radar from './Radar';
// 精灵
import SpriteMesh from './SpriteMesh';

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

        // 创建光墙
        const lightWall = new LightWall();
        scene.add(lightWall);

        //⭐️ 去bigScreen 中查看接口调用

        // 创建雷达特效
        const radar1 = new Radar();
        radar1.position.set(-4.5, 3, -1.5);
        scene.add(radar1);
        const radar2 = new Radar();
        radar2.position.set(5.5, 1, 1.5);
        scene.add(radar2);

        //  添加精灵图片并加上点击事件 <警告精灵>传参
        const warningSprite = new SpriteMesh(
            new THREE.TextureLoader().load(
                require('../../../textures/warning.png')
            ),
            new THREE.Vector3(-4.5, 3.5, -1.5)
        );
        // <警告精灵>回调函数
        warningSprite.onClick(() => {
            console.log('点中警告⚠️');
            alert('点中警告⚠️');
        });

        // <危险精灵>
        const alarmSprite = new SpriteMesh(
            new THREE.TextureLoader().load(
                require('../../../textures/alarm.png')
            ),
            new THREE.Vector3(5.5, 1.5, 1.5)
        );
        // <危险精灵>回调函数
        alarmSprite.onClick(() => {
            console.log('危险');
            alert('危险');
        });
    });
}
