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

export { WIDTH, HEIGHT };
