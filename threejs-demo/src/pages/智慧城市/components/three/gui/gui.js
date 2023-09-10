import GUI from 'lil-gui';

const _gui = new GUI({
    // 设置gui title
    title: 'gui控制器(点击展开)',
    // 收起分区，默认false
    closeFolders: true,
    // 自动生成在页面右上角，默认为true
    autoPlace: true,
});

// 控制是否全屏
const eventObj = {
    Fullscreen: function () {
        // 全屏
        document.body.requestFullscreen();
        console.log('全屏');
    },
    ExitFullscreen: function () {
        document.exitFullscreen();
        console.log('退出全屏');
    },
};

_gui.add(eventObj, 'Fullscreen').name('全屏');
_gui.add(eventObj, 'ExitFullscreen').name('退出全屏');

export default _gui;
