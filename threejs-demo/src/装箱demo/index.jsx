import React, { useEffect, useState, useRef } from 'react';
import { Button, Drawer, Tabs, Descriptions, Tree, Empty } from 'antd';
// import './index.css';
import 'antd/dist/antd.css';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// mockData
import { mockData } from './mockData';

let cartonWidth,
    cartonHeight,
    cartonLength,
    detailIndex = 0,
    // angle = 0,
    intersections,
    intersected,
    defaults = {
        result: [],
        detailList: [],
        dataList: [],
        detailNum: 0,
        cartonNum: 0,
        taskNum: 0,
        cartonList: [],
    },
    HEIGHT,
    WIDTH,
    boxArr = [];

const orientationEnum = {
    FRONT_UP: 2,
    FRONT_DOWN: 3,
};

// 创建场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    999999
);
//初始化网格
// const grid = new THREE.GridHelper(15000, 20, 0x333333, 0x333333);
// 选中子级盒子
const mouse = new THREE.Vector3();
// 射线
const raycaster = new THREE.Raycaster();
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, //开启锯齿
    alpha: true, //透明度
});
// 初始化轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// const axesHelper = new THREE.AxesHelper(5000);

export default function ThreeComponent() {
    const [selectIndex, setSelectIndex] = useState(0);
    const [boxContext, setBoxContext] = useState(null);
    const [containerContext, setContainerContext] = useState(null);
    // 容器
    const container = useRef(null);

      // 获取详细数据
      const getInfoDetail = () => {
        // 获取详情
        defaults['result'] = mockData;
        defaults['detailList'] = [];
        const dataList = mockData;
        // 获取初始装货箱信息
        const { container } = dataList;
        const { width, height, length } = container.cube;
        // 装货箱
        initBox(width, height, length, container);
        // 单个详情
        detailIndex = defaults['detailNum'] = dataList.placedItems.length;
        // 渲染单个子级盒子
        boxArr = [];
        for (let i = 0; i < defaults['detailNum']; i++) {
            const detail = dataList.placedItems[i];
            defaults['detailList'].push(
                initObject(
                    detail.item.cube.width,
                    detail.item.cube.height,
                    detail.item.cube.length,
                    detail.position.x,
                    detail.position.y,
                    detail.position.z,
                    detail.orientation,
                    i
                )
            );
        }
    };

    // 初始化纸箱
    const initBox = (xLen, yLen, zLen, context) => {   
        setContainerContext(context);
        cartonWidth = xLen;
        cartonHeight = yLen;
        cartonLength = zLen;
        // 声明几何体
        const geometry = new THREE.BoxGeometry(xLen, yLen, zLen);
        // 声明材质;
        const edges = new THREE.EdgesGeometry(geometry);
        // 几何体+ 材质 = 物体
        console.log(edges)
        const containerBox = new THREE.LineSegments(edges);
        containerBox.material.color = new THREE.Color(0x000000);
        containerBox.position.set(0, 0, 0);
        // 将物体添加到场景中
        scene.add(containerBox);
        // 添加网格
        // grid.position.y = -(cartonHeight / 2) - cartonHeight / 8;
        // scene.add(grid);
        return containerBox;
    };

    // 材质
    function getTextCanvas(width, height, length, i) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let ctx2 = canvas.getContext('2d');
        let ctx3 = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = length;
        // 设置箱子面颜色
        // ctx3.fillStyle = 'rgba(34,34,34, 0.35)';
        ctx3.fillStyle = 'rgba(183,139,34,1)';
        window.ctx3 = ctx3;
        ctx3.fillRect(0, 0, width, length);
        // 制作胶带
        ctx.fillStyle = 'rgba(152,107,9,0.8)';
        ctx.fillRect(
            0,
            length / 2 - length / 4 + length / 8,
            width,
            length / 4
        );
        // 设置封条
        ctx2.fillStyle = 'black';
        ctx.fillRect(0, length / 2, width, 10);
        ctx.fillStyle = 'white';
        ctx.font = 'normal 240px "楷体"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`纸箱${i + 1}`, width / 2, length / 2);
        return canvas;
    }

    // 设置每个子级盒子
    const initObject = (width, height, length, x, y, z, orientation, i) => {
        const mesh = new THREE.Object3D();
        const geometry = new THREE.BoxGeometry(width, height, length);
        // 设置随机颜色
        const color = new THREE.Color(0xff794204);
        // 设置子级盒子材质
        let material = [];
        for (let i = 0; i < geometry.groups.length; i++) {
            let mats = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                // opacity: 0.9,
            });
            material.push(mats);
        }
        // 上下面
        material[orientationEnum[orientation]].map = new THREE.CanvasTexture(
            getTextCanvas(width, height, length, i)
        );
        // 几何体 + 材质 = 物体
        const cube = new THREE.Mesh(geometry, material);
        // 3D模型添加 材质和几何体
        mesh.add(cube);
        // 设置子级盒子边框
        const wideFrame = new THREE.BoxGeometry(width, height, length);
        const materialBorder = new THREE.EdgesGeometry(wideFrame);
        const lineFrame = new THREE.LineSegments(
            materialBorder,
            new THREE.LineBasicMaterial({ color: 0xff131313 })
        );
        // scene.add(axesHelper);
        mesh.add(lineFrame);
        // 装箱复位
        mesh.position.set(
            y + width / 2 - cartonWidth / 2 + 5,
            z + height / 2 - cartonHeight / 2 + 4,
            x + length / 2 - cartonLength / 2 + 3,
            'XYZ'
        );
        scene.add(mesh);
        boxArr.push(cube);
        return mesh;
    };

    // 选中盒子
    const onMouseClick = (e) => {
        e.preventDefault();
        // 修改e精度
        console.log( renderer.domElement.offsetLeft)
        mouse.x = ((e.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        intersections = raycaster.intersectObjects(boxArr);
        if (intersections.length > 0) {
            intersected = intersections[0].object;
            if (!boxArr.findIndex((v) => v.uuid === intersected.uuid)) {
                boxArr.forEach((v) => {
                    v.material.forEach(
                        (i) => (i.color = new THREE.Color(0xff794204))
                    );
                });
                boxArr[selectIndex].material.forEach(
                    (v) => (v.color = new THREE.Color(0xff5e3405))
                );
                setBoxContext(defaults['result'].placedItems[0]);
                setSelectIndex(0);
                return;
            }
            setSelectIndex(
                boxArr.findIndex((v) => v.uuid === intersected.uuid)
            );
        }
    };

    // 渲染函数
    const render = () => {
        controls.update();
        // 每次执行渲染函数render时候，角度累加0.005
        // angle += 0.005;
        // 圆周运动网格模型x坐标计算  绕转半径400
        // var x = 850 * Math.sin(angle);
        // 圆周运动网格模型y坐标计算  绕转半径400
        // var z = 400 * Math.cos(angle);
        // 每次执行render函数，更新需要做圆周运动网格模型Mesh的位置属性
        // controls.object.position.z = x;
        // controls.object.position.y =  x;
        renderer.render(scene, camera);
        // 动画帧
        requestAnimationFrame(render);
    };

    const init = () => {
        // 实际canvas 宽高
        WIDTH =
            window.innerWidth -
            Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName(
                            'ant-drawer-content-wrapper'
                        )[0]
                    )
                    .width.split('px')[0]
            );
        HEIGHT =
            window.innerHeight -
            Number(
                window
                    .getComputedStyle(document.getElementById('operate'))
                    .height.split('px')[0]
            );
        // 场景颜色
        scene.background = new THREE.Color(0x999999);
        // 调整相机位置
        camera.position.set(13100, 2200, 2100);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 200,
        });

        scene.add(camera);
        raycaster.intersectObjects(scene.children);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setSize(WIDTH, HEIGHT);
        // 控制器阻尼
        controls.enableDamping = true;
        // 动态阻尼系数
        controls.dampingFactor = 0.1;
        // 旋转中心点
        controls.target.set(0, 0, 0);
        // 是否允许控制
        // controls.enabled  = false;
        // 是否允许转动
        // controls.rotate = false;
        // controls.maxPolarAngle = Math.PI / 2;

        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

        // 子级盒子选中
        document.addEventListener('click', onMouseClick, false);

        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            WIDTH =
                window.innerWidth -
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName(
                                'ant-drawer-content-wrapper'
                            )[0]
                        )
                        .width.split('px')[0]
                );
            HEIGHT =
                window.innerHeight -
                Number(
                    window
                        .getComputedStyle(document.getElementById('operate'))
                        .height.split('px')[0]
                );
            // 更新camera 宽高比;
            camera.aspect = WIDTH / HEIGHT;
            // 更新camera 投影矩阵
            camera.updateProjectionMatrix();
            // 更新渲染器
            renderer.setSize(WIDTH, HEIGHT);
            // 设置渲染器像素比:
            renderer.setPixelRatio(window.devicePixelRatio);
        });
    };

    useEffect(() => {
        // 1. 初始化
        init();
        // 2. 获取详情
        getInfoDetail();
    }, []);

    useEffect(() => {
        if (!!defaults['result'].placedItems.length) {
            if (intersected && intersections) {
                boxArr.forEach((v) => {
                    v.material.forEach(
                        (i) => (i.color = new THREE.Color(0xff794204))
                    );
                });
                boxArr[selectIndex].material.forEach(
                    (v) => (v.color = new THREE.Color(0xff5e3405))
                );
                setBoxContext(defaults['result'].placedItems[selectIndex]);
                return;
            }
        }
    }, [selectIndex]);

    // tab内容
    const TabContext = (props) => {
        const { active } = props;
        // 集装箱信息
        const containerContext = {
            height: props?.containerContext?.cube.height,
            width: props?.containerContext?.cube.width,
            length: props?.containerContext?.cube.length,
            price: props?.containerContext?.price,
            weight: props?.containerContext?.weight,
        };

        // 纸箱
        const boxContext = {
            height: props?.boxContext?.item?.cube.height,
            width: props?.boxContext?.item?.cube.width,
            length: props?.boxContext?.item?.cube.length,
        };

        return (
            <>
                {active === 0 ? (
                    <Descriptions column={1}>
                        <Descriptions.Item label="重量 ">
                            {containerContext.weight}
                        </Descriptions.Item>
                        <Descriptions.Item label="价格">
                            {containerContext.price}
                        </Descriptions.Item>
                        <Descriptions.Item label="长度">
                            {containerContext.length}
                        </Descriptions.Item>
                        <Descriptions.Item label="宽度">
                            {containerContext.width}
                        </Descriptions.Item>
                        <Descriptions.Item label="高度">
                            {containerContext.height}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <>
                        {props.boxContext ? (
                            <Descriptions column={1}>
                                <Descriptions.Item label="长度">
                                    {boxContext.length}
                                </Descriptions.Item>
                                <Descriptions.Item label="宽度">
                                    {boxContext.width}
                                </Descriptions.Item>
                                <Descriptions.Item label="高度">
                                    {boxContext.height}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span>请选中纸箱</span>}
                            ></Empty>
                        )}
                    </>
                )}
            </>
        );
    };

    return (
        <div id="container">
            <div id="operate">
                <Button
                    id="first"
                    onClick={() => {
                        detailIndex = 0;
                        for (let i = 0; i < defaults['detailNum']; i++) {
                            scene.remove(defaults['detailList'][i]);
                        }
                    }}
                >
                    清空
                </Button>
                <Button
                    id="prev"
                    onClick={() => {
                        if (detailIndex <= 0) {
                            return;
                        }
                        detailIndex -= 1;
                        scene.remove(defaults['detailList'][detailIndex]);
                    }}
                >
                    上一步
                </Button>
                <Button
                    id="next"
                    onClick={() => {
                        if (detailIndex >= defaults['detailNum']) {
                            return;
                        }
                        scene.add(defaults['detailList'][detailIndex]);
                        detailIndex += 1;
                    }}
                >
                    下一步
                </Button>
                <Button
                    id="last"
                    onClick={() => {
                        detailIndex = defaults['detailNum'];
                        for (var i = 0; i < defaults['detailNum']; i++) {
                            scene.add(defaults['detailList'][i]);
                        }
                    }}
                >
                    回填
                </Button>
            </div>

            <div id="canvas-frame" ref={container}></div>

            <Drawer placement="right" open={true} closable={false} mask={false}>
                <Tabs
                    defaultActiveKey="1"
                    items={new Array(2).fill(null).map((_, i) => {
                        const tabTitle = {
                            0: '载货箱',
                            1: '纸箱',
                        };
                        return {
                            label: tabTitle[i],
                            key: Math.random(),
                            children: (
                                <TabContext
                                    active={i}
                                    boxContext={boxContext}
                                    containerContext={containerContext}
                                />
                            ),
                        };
                    })}
                />
            </Drawer>
        </div>
    );
}
