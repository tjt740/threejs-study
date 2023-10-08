import * as THREE from 'three';
// 导入封装的场景
import scene from './scene';

//  创建XYZ直角坐标系  (红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(25);
//  坐标辅助线添加到场景中
// scene.add(axesHelper);

export default axesHelper;
