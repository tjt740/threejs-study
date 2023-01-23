import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button, message  } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './FileSaver';
import cnames from 'classnames';
import { colorChange } from './utils';
import './index.css';

let canvas;
let borderCanvas;
let obj = {};
const p1 = {};
const p2 = {};
// 图片数据存储
const image = new Image();
let xMin;
let yMin;
let xMax;
let yMax;
let pMin;
let pMax;
let k;
let imgX;
let imgY;
let canW;
let canH;
let ctx;
let imW;
let imH;
let color;
let label;
let value;
let imgWK;
let imgHK;
let lenIm;
let xl;
let xr;
let yu;
let yd;
let target;
let x;
let y;
let xm;
let ym;
let p;
let mouseX;
let mouseY;
let imgXY;
let flagDrawBbox = false;
let isPointInPath = false;
let selectValue;
let data;
export default function ObjectDetection() {
    canvas = useRef(null);
    borderCanvas = useRef(null);
    const [objValueArr, setObjValueArr] = useState([]);
    // label数组
    const [radioValueList, setRadioValueList] = useState([
        {
            label: '植物',
            value: 'botany',
            labelColor: '#e80b0b',
        },
        {
            label: '水果',
            value: 'fruit',
            labelColor: '#e80',
        },
        {
            label: '咖啡',
            value: 'coffee',
            labelColor: '#00CD00',
        },
        {
            label: '纸箱',
            value: 'carton',
            labelColor: '#00B2EE',
        },
        {
            label: '磁带',
            value: 'tape',
            labelColor: '#DEB887',
        },
    ]);
    // key 监听值变化 ★不存在无法更新页面
    const [pageKey, setPageKey] = useState(Math.random());
    // radio切换
    const [radioValue, setRadioValue] = useState(() => radioValueList?.at(0));
    // 初始化
    const init = () => {
        canvas = canvas.current;
        canW = canvas.width;
        canH = canvas.height;
        ctx = canvas.getContext('2d');
        image.src =
            'https://img.alicdn.com/imgextra/i4/O1CN011OxBf221KTni2eSSA_!!6000000006966-0-tps-8364-4320.jpg';
        image.objects = [];

        // 加载图片
        image.onload = function () {
            showOriginImg();
        };
        // 在canvas页面 按下时
        canvas.onmousedown = function (e) {
            canvas = canvas.current || canvas;
            for (let i = 0; i < image?.objects?.length || 0; i++) {
                if (image?.objects?.length) {
                    isPointInPath = isPointInRect(e, image.objects[i]);
                    if (isPointInPath && e.button === 0) {
                        console.log('选中');
                        // borderCanvas.current.style.cssText = `top:${image.objects[i].yMin}px;left:${image.objects[i].xMin}px`;
                        // borderCanvas.current.width = image?.objects[i]?.width;
                        // borderCanvas.current.height = image?.objects[i]?.height;
                        // const borderCtx = borderCanvas.current.getContext('2d');
                        // borderCtx.strokeStyle = 'rgb(59, 160, 249)';
                        // borderCtx.lineWidth = 3;
                        // borderCtx.strokeRect(
                        //   0,
                        //   0,
                        //   borderCanvas.current.width,
                        //   borderCanvas.current.height,
                        // ); // 绘制红色边框矩形
                        // borderCtx.clearRect(
                        //   0,
                        //   0,
                        //   borderCanvas.current.width,
                        //   borderCanvas.current.height,
                        // );
                        canvas.onmousemove = (e) => {
                            image.objects[i].xMin =
                                e.offsetX - image.objects[i].width / 2;
                            image.objects[i].yMin =
                                e.offsetY - image.objects[i].height / 2;
                            image.objects[i].xMax =
                                image.objects[i].xMin + image.objects[i].width;
                            image.objects[i].yMax =
                                image.objects[i].yMin + image.objects[i].height;

                            // borderCanvas.current.style.cssText = `top:${image.objects[i].yMin}px;left:${image.objects[i].xMin}px`;
                            backfillDraw(image.objects);
                            showOriginImg();
                        };
                        canvas.onmouseup = () => {
                            canvas.onmousemove = null;
                            canvas.onmouseup = null;
                        };
                        break;
                    }
                }
            }

            if (!isPointInPath && e.button === 0) {
                console.log('未选中');
                canvas.onmousemove = (e) => {
                    if (!isPointInPath && flagDrawBbox) {
                        p2.x = e.offsetX > image.canx ? e.offsetX : image.canx;
                        p2.x =
                            p2.x < image.canx + image.canw
                                ? p2.x
                                : image.canx + image.canw;
                        p2.y = e.offsetY > image.cany ? e.offsetY : image.cany;
                        p2.y =
                            p2.y < image.cany + image.canh
                                ? p2.y
                                : image.cany + image.canw;
                        obj.x = Math.min(p1.x, p2.x);
                        obj.y = Math.min(p1.y, p2.y);
                        obj.w = Math.abs(p1.x - p2.x);
                        obj.h = Math.abs(p1.y - p2.y);
                        obj.width = Math.abs(p1.x - p2.x);
                        obj.height = Math.abs(p1.y - p2.y);
                        obj.isShow = true;
                        obj.isSelect = false;
                        showImage(image);
                        ctx.fillStyle = utilsColorChange(obj?.labelColor);
                        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                        ctx.save();
                    }
                    canvas.onmouseup = function () {
                        flagDrawBbox = false;
                        canvas.onmousemove = null;
                        canvas.onmouseup = null;
                    };
                };
                if (!flagDrawBbox && e.button === 0) {
                    flagDrawBbox = true;
                    p1.x = e.offsetX > image.canx ? e.offsetX : image.canx;
                    p1.x =
                        p1.x < image.canx + image.canw
                            ? p1.x
                            : image.canx + image.canw;
                    p1.y = e.offsetY > image.cany ? e.offsetY : image.cany;
                    p1.y =
                        p1.y < image.cany + image.canh
                            ? p1.y
                            : image.cany + image.canw;
                    return;
                }
                flagDrawBbox = false;
            }
        };
    };
    // 判断点是否在矩形内。
    const isPointInRect = (point, rect) => {
        return (
            point.offsetX >= rect.x &&
            point.offsetY >= rect.y &&
            point.offsetX <= rect.x + rect.w &&
            point.offsetY <= rect.y + rect.h
        );
    };
    // 拖拽改变图片宽高大小
    const changeWorH = () => {};
    // 获取数据
    const getData = () => {
        // 接口数据
        data = [];
        setTimeout(() => {
            data = {
                imgName: 'http://www.tietuku.cn/assets/img/error.svg',
                objValue: [
                    {
                        label: '植物',
                        labelColor: '#68228B',
                        value: 'botany',
                        keyId: '0.9097',
                        xMin: 110,
                        xMax: 236,
                        yMin: 65,
                        yMax: 208,
                        width: 126,
                        height: 143,
                    },
                    {
                        label: '咖啡',
                        labelColor: '#00CD00',
                        value: 'coffee',
                        keyId: '0.7403',
                        xMin: 284,
                        xMax: 418,
                        yMin: 67,
                        yMax: 216,
                        width: 134,
                        height: 149,
                    },
                    {
                        label: '纸箱',
                        labelColor: '#00B2EE',
                        value: 'carton',
                        keyId: '0.2151',
                        xMin: 697,
                        xMax: 900,
                        yMin: 77,
                        yMax: 286,
                        width: 203,
                        height: 209,
                    },
                    {
                        label: '咖啡',
                        labelColor: '#00CD00',
                        value: 'coffee',
                        keyId: '0.9641',
                        xMin: 465,
                        xMax: 665,
                        yMin: 70,
                        yMax: 273,
                        width: 200,
                        height: 203,
                    },
                ],
            };
            const { objValue } = data;
            backfillDraw(data);
            image.objects = objValue;
            confirmBox(image.objects);
        }, 500);
    };
    // 回填渲染
    const backfillDraw = (picData) => {
        // 鼠标移动每一帧都清楚画布内容，然后重新画圆
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // todo: 需要做处理
        const objValue = picData?.objValue || picData || [];
        objValue?.forEach((i) => {
            drawFill(i.xMin, i.yMin, i.xMax, i.yMax, i.labelColor);
            i.x = i.xMin + 1;
            i.y = i.yMin + 1;
            i.w = i.xMax - i.xMin;
            i.h = i.yMax - i.yMin;
            i.isShow = true;
            i.isSelect = false;
        });
    };
    // 双击放大图片
    const enlargedPicture = (e, img) => {
        if (e) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        } else {
            mouseX = 1;
            mouseY = 1;
        }
        if (canXYOnImage(mouseX, mouseY)) {
            imgXY = canXYtoImageXY(img, mouseX, mouseY);
            img.focusX = imgXY[0];
            img.focusY = imgXY[1];
            img.sizeK *= 1.2;
            resetDataNewObj();
            showImage(img);
        }
    };
    // 缩小图片
    const zoomOutPicture = (img) => {
        mouseX = 1;
        mouseY = 1;
        imgXY = canXYtoImageXY(img, mouseX, mouseY);
        imgXY = [1, 1];
        img.focusX = imgXY[0];
        img.focusY = imgXY[1];
        img.sizeK *= 0.9;
        resetDataNewObj();
        showImage(img);
    };
    // 判断点是否在image上
    const canXYOnImage = (x, y) => {
        if (x > image.canx && x < image.canx + image.canw) {
            if (y > image.cany && y < image.cany + image.canh) {
                return true;
            }
        } else {
            return false;
        }
    };
    // 获取canvas上一个点对应原图像的点
    const canXYtoImageXY = (img, canx, cany) => {
        k = 1 / img.sizeK;
        imgX = (canx - img.canx) * k + img.cutX;
        imgY = (cany - img.cany) * k + img.cutY;
        return [imgX, imgY];
    };
    // 在canvas上展示原图片
    function showOriginImg() {
        canvas = canvas?.current || canvas;
        imW = canvas?.width;
        imH = canvas?.height;
        k = canW / imW;
        if (imH * k > canH) {
            k = canH / imH;
        }
        image.width = canW;
        image.height = canH;
        image.sizeK = k;
        image.focusX = imW / 2;
        image.focusY = imH / 2;
        resetDataNewObj();
        showImage(image);
    }
    // 在canvas上展示图像对应的部分
    // *此处img === image
    const showImage = (img) => {
        flushCanvas();
        imgWK = img.width * img.sizeK;
        imgHK = img.height * img.sizeK;
        img.canx = 0;
        img.canw = canW;
        lenIm = canW / img.sizeK;
        img.cutW = lenIm;
        xl = img.focusX - lenIm / 2;
        xr = img.focusX + lenIm / 2;
        img.cutX = xl;
        if (xl < 0) {
            img.cutX = 0;
        }
        if (xr >= img.width) {
            img.cutX = xl - (xr - img.width + 1);
        }
        img.cany = 0;
        img.canh = canH;
        lenIm = canH / img.sizeK;
        img.cutH = lenIm;
        yu = img.focusY - lenIm / 2;
        yd = img.focusY + lenIm / 2;
        img.cutY = yu;
        if (yu < 0) {
            img.cutY = 0;
        }
        if (yd >= img.height) {
            img.cutY = yu - (yd - img.height + 1);
        }
        // 绘制图片并进行自适应
        ctx.drawImage(img, 0, 0, img.cutW, img.cutH);
        showObjects(img);
    };
    // 在canvas上显示已标注目标
    // *此处img === image
    const showObjects = (img) => {
        for (let i = 0; i < img.objects.length; i++) {
            target = img.objects[i];
            x = target.xMin;
            y = target.yMin;
            xm = target.xMax;
            ym = target.yMax;
            p = imageXYtoCanXY(img, x, y);
            x = p[0];
            y = p[1];
            p = imageXYtoCanXY(img, xm, ym);
            xm = p[0];
            ym = p[1];
            // 画填充
            drawFill(x, y, xm, ym, target.labelColor);
        }
    };
    // 图像上的点对应的canvas坐标
    const imageXYtoCanXY = (img, x, y) => {
        x = (x - img.cutX) * img.sizeK + img.canx;
        y = (y - img.cutY) * img.sizeK + img.cany;
        return [x, y];
    };
    // 画填充
    const drawFill = (x1, y1, x2, y2, ReactColor) => {
        ctx.beginPath();
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.fillStyle = utilsColorChange(ReactColor);
        ctx.fill();
        ctx.closePath();
        ctx.save();
    };
    // 充值obj
    const resetDataNewObj = () => {
        obj = {};
        color = selectValue?.[0]?.labelColor || selectValue?.labelColor;
        value = selectValue?.[0]?.value || selectValue?.value;
        label = selectValue?.[0]?.label || selectValue?.label;
        // 塞入数据到obj
        obj.labelColor = color;
        obj.value = value;
        obj.label = label;
        obj.keyId = Math.random().toFixed(4);
        setObjValueArr(image.objects);
    };
    // 背景画布绘制 #ffffff
    const flushCanvas = () => {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, canW, canH);
    };
    // 更改line颜色
    const onChangeLineColor = (e) => {
        setRadioValue(e.target.value);
    };
    // 确认框
    const confirmBox = (resData) => {
        if (Object.prototype.toString.call(radioValue) !== '[object Object]') {
            selectValue = radioValueList.filter(
                (i) => i.value === radioValue
            )[0];
            setPageKey(Math.random());
            setRadioValue(selectValue);
        } else {
            selectValue = radioValueList.filter(
                (i) => i.value === radioValue?.value
            )[0];
            setPageKey(Math.random());
            setRadioValue(selectValue);
        }

        if ('w' in obj && obj.w !== 0) {
            xMin = obj.x;
            yMin = obj.y;
            xMax = xMin + obj.w;
            yMax = yMin + obj.h;
            pMin = canXYtoImageXY(image, xMin, yMin);
            obj.xMin = pMin[0];
            obj.yMin = pMin[1];
            pMax = canXYtoImageXY(image, xMax, yMax);
            obj.xMax = pMax[0];
            obj.yMax = pMax[1];
            image.objects.push(obj);
            showOriginImg();
            return true;
        }
        if (resData?.length) {
            image.objects = resData;
            showOriginImg();
            return true;
        }
        // 没有划线路线
        return false;
    };
    // 颜色转换
    const utilsColorChange = (fillColor) => {
        return colorChange.hexToRgb(fillColor || '#000000').rgba;
    };
    // 保存标注结果
    const saveObj = () => {
        if (image?.objects?.length) {
            const objArr = [];
            for (let i = 0; i < image?.objects?.length; i++) {
                target = image.objects[i];
                objArr.push({
                    label: target.label,
                    labelColor: target.labelColor,
                    value: target.value,
                    keyId: target.keyId,
                    xMin: parseInt(target.xMin),
                    xMax: parseInt(target.xMax),
                    yMin: parseInt(target.yMin),
                    yMax: parseInt(target.yMax),
                    width: parseInt(target.w),
                    height: parseInt(target.h),
                });
            }
            console.log('标注数组：', objArr);
            const imRes = { imgName: image.src, objArr };
            const blob = new Blob([JSON.stringify(imRes)], { type: '' });
            const imgName = image.src.split('.')[0];
            const jsonFile = imgName + '.json';
            saveJSON(jsonFile, blob);
            return;
        }
        message.error('未进行任何标注');
    };
    // 保存json文件
    const saveJSON = (file, JSONData) => {
        // 下载为json文件
        const link = document.createElement('a');
        link.download = file;
        link.style.display = 'none';
        // 字符内容转变成blob地址
        link.href = URL.createObjectURL(JSONData);
        // 触发点击
        document.body.appendChild(link);
        link.click();
        // 然后移除
        document.body.removeChild(link);
    };

    // 显隐标注
    useEffect(() => {
        setRadioValueList([
            {
                label: '植物',
                value: 'botany',
                labelColor: '#e80b0b',
            },
            {
                label: '水果',
                value: 'fruit',
                labelColor: '#e80',
            },
            {
                label: '咖啡',
                value: 'coffee',
                labelColor: '#00CD00',
            },
            {
                label: '纸箱',
                value: 'carton',
                labelColor: '#00B2EE',
            },
            {
                label: '磁带',
                value: 'tape',
                labelColor: '#DEB887',
            },
        ]);
        init();
        // 获取已存的数据;
        getData();
        selectValue = radioValueList?.at(0);
    }, []);

    useEffect(() => {
        if (Object.prototype.toString.call(radioValue) !== '[object Object]') {
            selectValue = radioValueList.filter(
                (i) => i.value === radioValue
            )[0];
            resetDataNewObj();
            console.log('触发radio变化', objValueArr, selectValue, radioValue);
        }
    }, [radioValue]);

    useEffect(() => {
        // console.groupCollapsed(
        //   `%页面已经发生变化(づ￣3￣)づ╭❤～`,
        //   'color:#36ab60; font-size: 14px;'
        // );
    }, [pageKey]);

    return (
        <div id="object-detection-container">
            <div className="object-detection">
                <div className="title">
                    <div className="save-operation">
                        <Button
                            type="primary"
                            icon={<MinusOutlined />}
                            onClick={() => {
                                zoomOutPicture(image);
                            }}
                        ></Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                enlargedPicture(null, image);
                            }}
                        ></Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                !confirmBox(image?.objects) &&
                                message.error('未选择目标区域！');
                            }}
                        >
                            确认
                        </Button>
                        <Button onClick={() => saveObj()}>完成图片标注</Button>
                        <Button
                            type="dashed"
                            onClick={() => {
                                image.objects = [];
                                showOriginImg();
                            }}
                        >
                            重新标注图片
                        </Button>
                        <div className="labelSelect">
                            <Radio.Group
                                onChange={onChangeLineColor}
                                value={
                                    Object.prototype.toString.call(
                                        radioValue
                                    ) === '[object Object]'
                                        ? radioValue.value
                                        : radioValue
                                }
                            >
                                {radioValueList.map((i) => (
                                    <Radio
                                        key={i.value}
                                        value={i.value}
                                        style={{ color: i.labelColor }}
                                    >
                                        {i.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="label-operation"></div>
                </div>
                <div className="content-container">
                    <div id="canvas">
                        <canvas
                            width="1920"
                            height="1080"
                            ref={canvas}
                        ></canvas>
                        <canvas
                            className="border-canvas"
                            ref={borderCanvas}
                        ></canvas>
                    </div>
                </div>

                <div className="next-btn">
                    <Button
                        type="primary"
                        className="prev-btn"
                        onClick={() => {}}
                    >
                        上一条
                    </Button>
                    <Button type="primary" onClick={() => {}}>
                        下一条
                    </Button>
                </div>
            </div>
            <div className="operation-area">
                <div className="card-title">操作</div>
                <ul className="radio-label">
                    {objValueArr?.map((v, i) => (
                        <li
                            className={cnames(
                                'li-radio-content',
                                v?.isSelect && v?.isShow
                                    ? 'radio-select'
                                    : null,
                                v?.isShow ? null : 'opacity'
                            )}
                            key={v?.keyId}
                            onMouseEnter={() => {
                                const selectItem = [...objValueArr].at(i);
                                const { x, y, width, height } = selectItem;
                                borderCanvas.current.style.cssText = `top:${y}px;left:${x}px`;
                                borderCanvas.current.width = width;
                                borderCanvas.current.height = height;
                                const borderCtx =
                                    borderCanvas.current.getContext('2d');
                                borderCtx.strokeStyle = 'red';
                                borderCtx.lineWidth = 5;
                                borderCtx.strokeRect(0, 0, width, height); // 绘制红色边框矩形
                            }}
                            onMouseLeave={() => {
                                borderCanvas.current.style.cssText = `top:auto;left:auto`;
                                borderCanvas.current.width = 0;
                                borderCanvas.current.height = 0;
                            }}
                            onClick={() => {
                                [...objValueArr].forEach((item) => {
                                    item.isSelect = false;
                                });
                                objValueArr[i].isSelect = true;
                                setObjValueArr([...objValueArr]);

                                // console.log([...objValueArr]);
                                // console.log('isShow===>', i);
                            }}
                        >
                            <div
                                className="li-radio"
                                style={{ background: v?.labelColor }}
                            >
                                {v.label}
                            </div>
                            <div className="li-operation">
                                <i
                                    className={cnames(
                                        'iconfont',
                                        v.isShow ? 'tjtyanjing' : 'tjtbiyan'
                                    )}
                                    onClick={() => {
                                        objValueArr[i].isShow =
                                            !objValueArr[i].isShow;
                                        setObjValueArr([...objValueArr]);
                                        console.log([...objValueArr]);
                                        console.log('isShow===>', i);
                                    }}
                                ></i>
                                <i
                                    className="iconfont tjtlajitong1"
                                    onClick={() => {
                                        console.log(i);
                                    }}
                                ></i>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
