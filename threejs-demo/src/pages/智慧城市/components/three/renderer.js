import * as THREE from 'three';
import { WIDTH, HEIGHT } from './getScreenWidthandHeight';
import camera from './camera';
import WindowAddEventListener from './windowAddEventsListener/WindowAddEventsListener';

// 初始化<渲染器>
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 消除锯齿
    alpha: true, // 背景透明
});
// 改变渲染器尺寸
renderer.setSize(WIDTH, HEIGHT);
// 设置像素比 使图形锯齿消失
renderer.setPixelRatio(window.devicePixelRatio);

// 二级监听事件 (也可以不用类组件函数)
new WindowAddEventListener(camera, renderer);

export default renderer;
