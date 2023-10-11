// 导入camera
import camera from './camera';
// 导入renderer承载器
import renderer from './renderer';

// 根据页面大小变化，更新渲染
window.addEventListener('resize', () => {
    // 实际three.js渲染区域
    const WIDTH =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .width.split('px')[0]
        ) || window.innerWidth;
    const HEIGHT =
        Number(
            window
                .getComputedStyle(
                    document.getElementsByClassName('ant-layout-content')[0]
                )
                .height.split('px')[0]
        ) || window.innerHeight;
    // 更新camera 宽高比;
    camera.aspect = WIDTH / HEIGHT;
    /* 
        更新camera 投影矩阵
        .updateProjectionMatrix () : undefined
        更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
        */
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(WIDTH, HEIGHT);
    // 设置渲染器像素比:
    renderer.setPixelRatio(window.devicePixelRatio);
});
