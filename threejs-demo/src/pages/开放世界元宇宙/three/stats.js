import Stats from 'three/examples/jsm/libs/stats.module';

const statsFn = (Element) => {
    const stats = new Stats();
    // 在动画帧中更新 stats
    function animation(t) {
        // 动画帧中更新stats
        stats.update();

        requestAnimationFrame(animation);
    }
    // 渲染动画帧
    animation();

    // 将stats对象塞入DOM中
    Element.appendChild(stats.dom);
};

export default statsFn;
