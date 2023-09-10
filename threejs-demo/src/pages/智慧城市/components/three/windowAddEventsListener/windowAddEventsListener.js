export default class WindowAddEventListener {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.init();
    }

    init() {
        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            // 实际three.js渲染区域
            const WIDTH =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .width.split('px')[0]
                ) || window.innerWidth;
            const HEIGHT =
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-layout-content'
                            )[0]
                        )
                        .height.split('px')[0]
                ) || window.innerHeight;
            // 更新camera 宽高比;
            this.camera.aspect = WIDTH / HEIGHT;
            // 更新camera 投影矩阵
            this.camera.updateProjectionMatrix();
            //更新渲染器
            this.renderer.setSize(WIDTH, HEIGHT);
            //设置渲染器像素比:
            this.renderer.setPixelRatio(window.devicePixelRatio);
        });
    }
}
