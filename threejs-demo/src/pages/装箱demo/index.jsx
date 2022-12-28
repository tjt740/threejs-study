import React, { useEffect, useState, useRef } from 'react';
import { Button, Drawer, Tabs, Descriptions, Empty } from 'antd';
import 'antd/dist/antd.css';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
// mockData
import { mockData } from './mockData';

let cartonWidth;
let cartonHeight;
let cartonLength;
let detailIndex = 0;
let intersections;
let intersected;
const defaults = {
    result: [],
    detailList: [],
    dataList: [],
    detailNum: 0,
    cartonNum: 0,
    taskNum: 0,
    cartonList: [],
};
let HEIGHT;
let WIDTH;
let boxArr = [];

// 创建场景
const scene = new THREE.Scene();

// 初始化相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    99999
);
// 初始化网格
const grid = new THREE.GridHelper(15000, 20, 0x333333, 0x333333);
// 选中子级盒子
const mouse = new THREE.Vector3();
// 射线
const raycaster = new THREE.Raycaster();
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, // 开启锯齿
    alpha: true, // 透明度
});
// 初始化轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 三维坐标轴
const axesHelper = new THREE.AxesHelper(5000);

// gui控制器
const gui = new dat.GUI();
const cameraGui = gui.addFolder('调整相机视角');
// cameraGui.add(camera.position, 'x').min(1).max(20000).step(10);
// cameraGui.add(camera.position, 'y').min(1).max(10000).step(10);
// cameraGui.add(camera.position, 'z').min(1).max(10000).step(10);

export default function PackagePreview3D() {
    const [selectIndex, setSelectIndex] = useState(0);
    const [boxContext, setBoxContext] = useState(null);
    const [containerContext, setContainerContext] = useState(null);
    // 容器
    const container = useRef(null);

    // 获取详细数据
    const getInfoDetail = async () => {
        const res = { status: 200, data: [], success: true };
        res.data = mockData.singleContainerLoadingSolutions;
        defaults.result = res;
        defaults.detailList = [];

        // 初始装货箱信息
        const { width, length, height } = res.data[0].container.cube;
        initBox(width, height, length, res.data[0].container);

        // 单个详情
        const placedItemsArr = res.data[0].placedItems;
        detailIndex = defaults.detailNum = placedItemsArr.length;

        // 渲染单个子级盒子
        boxArr = [];
        for (let i = 0; i < defaults.detailNum; i++) {
            const detail = placedItemsArr[i];
            defaults.detailList.push(
                initObject(
                    detail.rotatedCube.width,
                    detail.rotatedCube.height,
                    detail.rotatedCube.length,
                    detail.position.x,
                    detail.position.y,
                    detail.position.z,
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
        // start
        const dir = new THREE.Vector3(0, 0, 0);
        dir.normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const arrowHelper1 = new THREE.ArrowHelper(
            dir,
            origin,
            6300,
            0x00ff00,
            200,
            100
        );

        arrowHelper1.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        scene.add(arrowHelper1);

        const arrowHelper2 = new THREE.ArrowHelper(
            dir,
            origin,
            13000,
            0x0000ff,
            200,
            100
        );
        arrowHelper2.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        arrowHelper2.rotation.x = Math.PI / 2;
        scene.add(arrowHelper2);

        const arrowHelper3 = new THREE.ArrowHelper(
            dir,
            origin,
            5300,
            0xff0000,
            200,
            100
        );
        arrowHelper3.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        arrowHelper3.rotation.z = -Math.PI / 2;
        scene.add(arrowHelper3);

        const size = 6000,
            divisions = 6;

        const step = size / divisions;

        const verticesX = [],
            verticesY = [],
            verticesZ = [],
            colors = [];
        const fontSize = 200;
        // 刻度尺
        const createTextTexture = (obj) => {
            let canvas = document.createElement('canvas');
            canvas.width = obj.width;
            canvas.height = obj.height;
            let ctx = canvas.getContext('2d');
            ctx.font = obj.font || `Bold ${fontSize}px Arial`;
            ctx.fillStyle = obj.color || '#090909';
            ctx.fillText(obj.text, 0, obj.height / 2);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return texture;
        };

        for (let i = 0, j = 0, k = 0; i <= divisions; i++, k += step) {
            // 200 : 线长
            verticesX.push(200, 0, k, 0, 0, k);
            verticesY.push(-200, 0, k, 0, 0, k);
            verticesZ.push(-200, 0, k, 0, 0, k);

            const material = new THREE.SpriteMaterial({
                map: createTextTexture({
                    text: ` ${i ? i * 100 : ''}`,
                    width: 500,
                    height: 500,
                }),
                opacity: 1,
                transparent: true,
            });

            const materialY = new THREE.SpriteMaterial({
                map: createTextTexture({
                    text: ` ${i * 100}`,
                    width: 500,
                    height: 500,
                }),
                opacity: 1,
                transparent: true,
            });
            const particleX = new THREE.Sprite(material);
            particleX.position.set(
                `${i * step - step - fontSize}`,
                -(cartonHeight / 2 + fontSize / 3),
                -(cartonLength / 2) - 400
            );
            particleX.scale.set(500, 500, 500);
            scene.add(particleX);

            const particleY = new THREE.Sprite(materialY);
            //  100： 字体大小
            particleY.position.set(
                -(cartonWidth / 2) - 400,
                `${i * step - (step + step / 2) + fontSize / 2}`,
                -(cartonLength / 2)
            );
            particleY.scale.set(500, 500, 500);
            scene.add(particleY);

            const particleZ = new THREE.Sprite(material);
            particleZ.position.set(
                -(cartonWidth / 2) - 400,
                -(cartonHeight / 2 + fontSize / 3),
                `${i * step + fontSize / 4 - cartonLength / 2}  `
            );
            particleZ.scale.set(500, 500, 500);
            scene.add(particleZ);

            const color = new THREE.Color(0x090909);
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }
        const materialLine = new THREE.LineBasicMaterial({
            vertexColors: true,
            toneMapped: false,
        });

        // x线刻度尺
        const geometryX = new THREE.BufferGeometry();
        geometryX.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(verticesX, 3)
        );
        geometryX.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        const lineX = new THREE.LineSegments(geometryX, materialLine);
        lineX.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        lineX.rotation.y = Math.PI / 2;
        scene.add(lineX);

        // Y线刻度尺
        const geometryY = new THREE.BufferGeometry();
        geometryY.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(verticesY, 3)
        );
        geometryY.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        const lineY = new THREE.LineSegments(geometryY, materialLine);
        lineY.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        lineY.rotation.x = -Math.PI / 2;
        scene.add(lineY);

        // Z线刻度尺
        const geometryZ = new THREE.BufferGeometry();
        geometryZ.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(verticesY, 3)
        );
        geometryZ.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        const lineZ = new THREE.LineSegments(geometryZ, materialLine);
        lineZ.position.set(
            -(cartonWidth / 2),
            -(cartonHeight / 2),
            -(cartonLength / 2)
        );
        scene.add(lineZ);

        // end

        // 声明几何体
        const geometry = new THREE.BoxGeometry(xLen, yLen, zLen);
        // 声明材质;
        const edges = new THREE.EdgesGeometry(geometry);
        // 几何体+ 材质 = 物体
        const containerBox = new THREE.LineSegments(edges);
        containerBox.material.color = new THREE.Color(0x000000);
        containerBox.position.set(0, 0, 0);
        // 将物体添加到场景中
        scene.add(containerBox);
        // 添加网格
        grid.position.y = -(cartonHeight / 2) - cartonHeight / 8;
        scene.add(grid);
        return containerBox;
    };

    // 材质
    function getTextCanvas(width, height, length, i) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.globalAlpha = 0.65;
        canvas.width = width;
        canvas.height = length;

        // 设置箱子面颜色
        ctx.fillStyle = 'rgba(255,255,5,1)';
        ctx.fillRect(0, 0, width, length);
        ctx.save();

        // 制作胶带
        ctx.fillStyle = 'rgba(183,139,34,1)';
        ctx.fillRect(
            0,
            length / 2 - length / 4 + length / 8,
            width,
            length / 4
        );
        ctx.save();
        // 设置封条
        ctx.fillStyle = 'black';
        ctx.fillRect(0, length / 2, width, 10);
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = 'normal 180px "楷体"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`纸箱${i + 1}`, width / 2, length / 2);
        return canvas;
    }

    // 设置每个子级盒子
    const initObject = (width, height, length, x, y, z, index) => {
        const mesh = new THREE.Object3D();
        const geometry = new THREE.BoxGeometry(width, height, length);
        // 设置随机颜色
        const color = new THREE.Color(0xff794204);
        // 设置子级盒子材质
        const material = [];
        for (let j = 0; j < geometry.groups.length; j++) {
            const mats = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.8,
            });
            material.push(mats);
        }

        // console.log(
        //   '宽:',
        //   width,
        //   '高:',
        //   height,
        //   '长:',
        //   length,
        //   '体积:',
        //   width * height * length,
        // );

        // 上下面
        // for (let j = 0; j < 6; j++) {
        material[2].map = new THREE.CanvasTexture(
            getTextCanvas(width, height, length, index)
        );
        // }

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
        mesh.add(lineFrame);
        // 装箱复位
        mesh.position.set(
            y + width / 2 - cartonWidth / 2,
            z + height / 2 - cartonHeight / 2,
            x + length / 2 - cartonLength / 2,
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
        mouse.x =
            ((e.clientX - renderer.domElement.offsetLeft) /
                renderer.domElement.clientWidth) *
                2 -
            1;

        mouse.y =
            -(
                (e.clientY - renderer.domElement.offsetTop) /
                renderer.domElement.clientHeight
            ) *
                2 +
            1;
        raycaster.setFromCamera(mouse, camera);
        intersections = raycaster.intersectObjects(boxArr);

        if (intersections.length > 0) {
            // 计算相交偏移量
            intersected = intersections[0].object;
            // useEffect 监听筛选出的id变化 确定点的那个盒子
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
            Number(
                window
                    .getComputedStyle(document.getElementById('container'))
                    .width.split('px')[0]
            ) -
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
            Number(
                window
                    .getComputedStyle(
                        document.getElementsByClassName('ant-layout')[0]
                    )
                    .height.split('px')[0]
            ) -
            Number(
                window
                    .getComputedStyle(document.getElementById('operate'))
                    .height.split('px')[0]
            ) -
            16 * 2;
        document.getElementById('canvas-frame').style.width = WIDTH + 'px';
        document.getElementById('canvas-frame').style.height = HEIGHT + 'px';
        // HEIGHT = window.innerHeight;
        // 场景颜色
        scene.background = new THREE.Color(0x999999);
        // 调整相机位置
        camera.position.set(12000, 0, 0);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 200,
        });
        scene.add(axesHelper);
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
        // 禁用缩放
        // controls.enableZoom = false;

        // 渲染
        render();

        // DOM承载渲染器
        container.current.appendChild(renderer.domElement);

        // 子级盒子选中
        document.addEventListener('click', onMouseClick, false);

        // 根据页面大小变化，更新渲染
        window.addEventListener('resize', () => {
            WIDTH =
                Number(
                    window
                        .getComputedStyle(document.getElementById('container'))
                        .width.split('px')[0]
                ) -
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
                Number(
                    window
                        .getComputedStyle(
                            document.getElementsByClassName('ant-layout')[0]
                        )
                        .height.split('px')[0]
                ) -
                Number(
                    window
                        .getComputedStyle(document.getElementById('operate'))
                        .height.split('px')[0]
                ) -
                16 * 2;
            document.getElementById('canvas-frame').style.width = WIDTH + 'px';
            document.getElementById('canvas-frame').style.height =
                HEIGHT + 'px';
            // HEIGHT = window.innerHeight;
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
        if (defaults?.result?.data?.length) {
            if (intersected && intersections) {
                boxArr.forEach((v) => {
                    v.material.forEach(
                        (i) => (i.color = new THREE.Color(0xff794204))
                    );
                });
                boxArr[selectIndex].material.forEach(
                    (v) => (v.color = new THREE.Color(0xff5e3405))
                );
                setBoxContext(defaults.result.data[0].placedItems[selectIndex]);
            }
        }
    }, [selectIndex]);

    // tab内容
    const TabContext = (props) => {
        const { active } = props;

        // 集装箱信息枚举
        const containerContextEnum = {
            height: '包装箱高度',
            width: '包装箱宽度',
            length: '包装箱长度',
            containerId: '包装箱id',
            price: '价格',
            volume: '体积',
            weight: '重量',
        };

        // 纸箱信息枚举
        const boxItemContextEnum = {
            containerId: '包装箱id',
            frontId: '物品前面对应的id',
            itemId: '物品id',
            itemName: '物品名',
            upId: '物品上面对应的id',
            height: '纸箱高度',
            width: '纸箱宽度',
            length: '纸箱长度',
            volume: '体积',
        };

        // 打平JSON，找到对应的枚举★
        const flatJSON = (propContext, contextEnum) => {
            console.log(propContext, contextEnum);
            return Object.entries(propContext).map((v, idx) => {
                const [key, value] = v;
                if (
                    Object.prototype.toString.call(value) === '[object Object]'
                ) {
                    return flatJSON(value, contextEnum);
                }
                return contextEnum[key] ? (
                    <Descriptions.Item label={contextEnum[key]} key={idx}>
                        {value === 0 || value ? String(value) : '--'}
                    </Descriptions.Item>
                ) : null;
            });
        };

        return (
            <>
                {active === 0 ? (
                    <Descriptions column={1}>
                        {props?.containerContext
                            ? flatJSON(
                                  props?.containerContext,
                                  containerContextEnum
                              )
                            : null}
                    </Descriptions>
                ) : (
                    <>
                        {props.boxItemContext ? (
                            <Descriptions column={1}>
                                {flatJSON(
                                    props?.boxItemContext,
                                    boxItemContextEnum
                                )}
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
                    style={{ margin: '5px' }}
                    onClick={() => {
                        detailIndex = 0;
                        for (let i = 0; i < defaults.detailNum; i++) {
                            scene.remove(defaults.detailList[i]);
                        }
                    }}
                >
                    清空
                </Button>
                <Button
                    style={{ margin: '5px' }}
                    onClick={() => {
                        if (detailIndex <= 0) {
                            return;
                        }
                        detailIndex -= 1;
                        scene.remove(defaults.detailList[detailIndex]);
                    }}
                >
                    上一步
                </Button>
                <Button
                    style={{ margin: '5px' }}
                    onClick={() => {
                        if (detailIndex >= defaults.detailNum) {
                            return;
                        }
                        scene.add(defaults.detailList[detailIndex]);
                        detailIndex += 1;
                    }}
                >
                    下一步
                </Button>
                <Button
                    style={{ margin: '5px' }}
                    onClick={() => {
                        detailIndex = defaults.detailNum;
                        for (let i = 0; i < defaults.detailNum; i++) {
                            scene.add(defaults.detailList[i]);
                        }
                    }}
                >
                    回填
                </Button>
            </div>

            {/* three 承载容器 */}
            <div id="canvas-frame" ref={container}></div>

            <Drawer
                // style={{ width: 0 }}
                placement="right"
                open
                closable={false}
                mask={false}
            >
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
                                    boxItemContext={boxContext}
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
