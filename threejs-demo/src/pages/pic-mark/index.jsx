import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button, message, Divider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './FileSaver';
import cNames from 'classnames';
import { colorChange } from './utils';
import './index.css';

const p1 = {};
const p2 = {};
// 图片数据存储
const image = new Image();
let canvas,
    borderCanvas,
    leftTopCanvas,
    leftBottomCanvas,
    rightTopCanvas,
    rightBottomCanvas,
    obj = {},
    xMin,
    yMin,
    xMax,
    yMax,
    pMin,
    pMax,
    k,
    imgX,
    imgY,
    canW,
    canH,
    ctx,
    imW,
    imH,
    color,
    label,
    value,
    imgWK,
    imgHK,
    lenIm,
    xl,
    xr,
    yu,
    yd,
    target,
    x,
    y,
    xm,
    ym,
    p,
    mouseX,
    mouseY,
    imgXY,
    flagDrawBbox = false,
    isPointInPath = false,
    selectValue,
    data,
    // 是否删除
    isDelete;

export default function ObjectDetection() {
    canvas = useRef(null);
    borderCanvas = useRef(null);
    leftTopCanvas = useRef(null);
    leftBottomCanvas = useRef(null);
    rightTopCanvas = useRef(null);
    rightBottomCanvas = useRef(null);

    const [objValueArr, setObjValueArr] = useState([]);

    // label数组
    const [radioValueList, setRadioValueList] = useState([]);

    // key 监听值变化 ★不存在无法更新页面
    const [pageKey, setPageKey] = useState(Math.random());
    // radio切换
    const [radioValue, setRadioValue] = useState(null);
    // 初始化
    const init = () => {
        // 加载图片
        image.onload = () => {
            canvas = canvas.current;
            canvas.width = image.width;
            canvas.height = image.height;
            canW = image.width;
            canH = image.height;
            ctx = canvas.getContext('2d');
            image.objects = [];
            // 在canvas页面 按下时
            canvas.onmousedown = (e) => {
                canvas = canvas.current || canvas;
                for (let i = 0; i < image?.objects?.length || 0; i++) {
                    if (image?.objects?.length) {
                        isPointInPath = isPointInRect(e, image.objects[i]);
                        if (isPointInPath && e.button === 0) {
                            console.log('选中', image.objects[i]);
                            for (
                                let j = 0;
                                j < image?.objects.length || 0;
                                j++
                            ) {
                                image.objects[j].isClick = false;
                            }
                            image.objects[i].isClick = true;
                            backfillDraw(image.objects);
                            showOriginImg();

                            canvas.onmousemove = (e) => {
                                image.objects[i].xMin =
                                    e.offsetX - image.objects[i].width / 2;
                                image.objects[i].yMin =
                                    e.offsetY - image.objects[i].height / 2;
                                image.objects[i].xMax =
                                    image.objects[i].xMin +
                                    image.objects[i].width;
                                image.objects[i].yMax =
                                    image.objects[i].yMin +
                                    image.objects[i].height;
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
                            p2.x =
                                e.offsetX > image.canx ? e.offsetX : image.canx;
                            p2.x =
                                p2.x < image.canx + image.canw
                                    ? p2.x
                                    : image.canx + image.canw;
                            p2.y =
                                e.offsetY > image.cany ? e.offsetY : image.cany;
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
                        canvas.onmouseup = () => {
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
            showOriginImg();
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
        const objValue = picData?.objValue || picData || [];
        objValue?.forEach((i) => {
            i.x = i.xMin + 1;
            i.y = i.yMin + 1;
            i.w = i.xMax - i.xMin;
            i.h = i.yMax - i.yMin;
            if (i.isShow === undefined) {
                i.isShow = true;
                return;
            }
            if (!i.isShow) {
                i.isShow = false;
            }
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
            drawFill(
                x,
                y,
                xm,
                ym,
                target.labelColor,
                img.objects[i]?.isShow,
                img.objects[i]?.isClick,
                img.objects[i]
            );
        }
    };
    // 图像上的点对应的canvas坐标
    const imageXYtoCanXY = (img, x, y) => {
        x = (x - img.cutX) * img.sizeK + img.canx;
        y = (y - img.cutY) * img.sizeK + img.cany;
        return [x, y];
    };
    // 拖拽更改image.objects
    const dragChangeWidthAndHeight = (event, index) => {
        image.objects[index].x = event.offsetX + 1;
        image.objects[index].y = event.offsetY + 1;
        image.objects[index].width =
            image.objects[index].xMax - image.objects[index].xMin;
        image.objects[index].height =
            image.objects[index].yMax - image.objects[index].yMin;
        image.objects[index].w =
            image.objects[index].xMax - image.objects[index].xMin;
        image.objects[index].h =
            image.objects[index].yMax - image.objects[index].yMin;
        setObjValueArr(image.objects);
        showImage(image);
    };
    // 画填充
    const drawFill = (x1, y1, x2, y2, ReactColor, isShow, isClick, item) => {
        if (isShow) {
            if (isClick) {
                ctx.strokeStyle = 'rgb(59, 160, 249)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                ctx.save();
                // 拖拽改变图片宽高大小
                // 坐上角
                leftTopCanvas.current.width = 10;
                leftTopCanvas.current.height = 10;
                leftTopCanvas.current.style.cssText = `top:${y1 - 5}px;left:${
                    x1 - 5
                }px;cursor:se-resize`;
                const leftTopCtx = leftTopCanvas.current.getContext('2d');
                leftTopCtx.fillStyle = '#FFFFFF';
                leftTopCtx.fillRect(0, 0, 10, 10);
                leftTopCanvas.current.onmousedown = (e) => {
                    document.onmousedown = () => {
                        document.onmousemove = (e) => {
                            if (e.offsetX > 10 || e.offsetY > 10) {
                                if (image.objects?.length) {
                                    const index = image.objects.findIndex(
                                        (o) => o.keyId === item.keyId
                                    );
                                    image.objects[index].xMin = e.offsetX;
                                    image.objects[index].yMin = e.offsetY;
                                    dragChangeWidthAndHeight(e, index);
                                }
                            }
                        };

                        document.onmouseup = () => {
                            document.onmousemove = null;
                            document.onmousedown = null;
                            document.onmouseup = null;
                            flagDrawBbox = false;
                            canvas.onmousemove = null;
                            canvas.onmouseup = null;
                        };
                    };
                };

                // 左下角
                leftBottomCanvas.current.width = 10;
                leftBottomCanvas.current.height = 10;
                leftBottomCanvas.current.style.cssText = `top:${
                    y2 - 5
                }px;left:${x1 - 5}px;cursor:ne-resize`;
                const leftBottomCtx = leftBottomCanvas.current.getContext('2d');
                leftBottomCtx.fillStyle = '#FFFFFF';
                leftBottomCtx.fillRect(0, 0, 10, 10);
                leftBottomCanvas.current.onmousedown = (e) => {
                    document.onmousedown = () => {
                        document.onmousemove = (e) => {
                            if (e.offsetX > 10 || e.offsetY > 10) {
                                if (image.objects?.length) {
                                    const index = image.objects.findIndex(
                                        (o) => o.keyId === item.keyId
                                    );
                                    image.objects[index].xMin = e.offsetX;
                                    image.objects[index].yMax = e.offsetY;
                                    dragChangeWidthAndHeight(e, index);
                                }
                            }
                        };

                        document.onmouseup = () => {
                            document.onmousemove = null;
                            document.onmousedown = null;
                            document.onmouseup = null;
                            flagDrawBbox = false;
                            canvas.onmousemove = null;
                            canvas.onmouseup = null;
                        };
                    };
                };

                // 右上角
                rightTopCanvas.current.width = 10;
                rightTopCanvas.current.height = 10;
                rightTopCanvas.current.style.cssText = `top:${y1 - 5}px;left:${
                    x2 - 5
                }px;cursor:sw-resize`;
                const rightTopCtx = rightTopCanvas.current.getContext('2d');
                rightTopCtx.fillStyle = '#FFFFFF';
                rightTopCtx.fillRect(0, 0, 10, 10);
                rightTopCanvas.current.onmousedown = (e) => {
                    document.onmousedown = () => {
                        document.onmousemove = (e) => {
                            if (e.offsetX > 10 || e.offsetY > 10) {
                                if (image.objects?.length) {
                                    const index = image.objects.findIndex(
                                        (o) => o.keyId === item.keyId
                                    );
                                    image.objects[index].xMax = e.offsetX;
                                    image.objects[index].yMin = e.offsetY;
                                    dragChangeWidthAndHeight(e, index);
                                }
                            }
                        };

                        document.onmouseup = () => {
                            document.onmousemove = null;
                            document.onmousedown = null;
                            document.onmouseup = null;
                            flagDrawBbox = false;
                            canvas.onmousemove = null;
                            canvas.onmouseup = null;
                        };
                    };
                };

                // 右下角
                rightBottomCanvas.current.width = 10;
                rightBottomCanvas.current.height = 10;
                rightBottomCanvas.current.style.cssText = `top:${
                    y2 - 5
                }px;left:${x2 - 5}px;cursor:nw-resize`;
                const rightBottomCtx =
                    rightBottomCanvas.current.getContext('2d');
                rightBottomCtx.fillStyle = '#FFFFFF';
                rightBottomCtx.fillRect(0, 0, 10, 10);
                rightBottomCanvas.current.onmousedown = (e) => {
                    document.onmousedown = () => {
                        document.onmousemove = (e) => {
                            if (e.offsetX > 10 || e.offsetY > 10) {
                                if (image.objects?.length) {
                                    const index = image.objects.findIndex(
                                        (o) => o.keyId === item.keyId
                                    );
                                    image.objects[index].xMax = e.offsetX;
                                    image.objects[index].yMax = e.offsetY;
                                    dragChangeWidthAndHeight(e, index);
                                }
                            }
                        };
                        document.onmouseup = () => {
                            document.onmousemove = null;
                            document.onmousedown = null;
                            document.onmouseup = null;
                            flagDrawBbox = false;
                            canvas.onmousemove = null;
                            canvas.onmouseup = null;
                        };
                    };
                };
            }
            ctx.beginPath();
            ctx.lineTo(x2, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y2);
            ctx.lineTo(x1, y1);
            ctx.fillStyle = utilsColorChange(ReactColor);
            ctx.fill();
            ctx.closePath();
            ctx.save();
        }
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
    // 获取详情
    const getContentInfo = () => {
        axios
            .get(
                'https://tianqiapi.com/api?version=v6&appid=12382165&appsecret=9QN9R6Ma&city=杭州'
            )
            .then((res) => {
                res = {
                    success: true,
                    errorCode: null,
                    errorMessage: null,
                    data: {
                        detailData: {
                            id: 51042,
                            gmtCreate: 1674487914000,
                            gmtModified: 1674487914000,
                            sceneId: null,
                            taskId: null,
                            taskRecordId: null,
                            dialogId: null,
                            title: null,
                            sourceContent:
                                'https://station-img.oss-cn-hangzhou.aliyuncs.com/bpm/20220530/0c8cc470521f4850964e90f307c76b41/Screenshot_20220527_102922_com.tencent.mm.jpg',
                            robotRecognition: null,
                            humanRecognition: null,
                            nluResult: null,
                            comment: null,
                            nodeId: null,
                            topicId: null,
                            status: 300,
                            operatorId: null,
                            operatorName: null,
                            dataSetId: 55,
                        },
                        tagList: [
                            {
                                id: 640,
                                gmtCreate: 1674487965000,
                                gmtModified: 1674487965000,
                                labelKey: 'tag3',
                                labelType: 'category',
                                color: '#a4dd00',
                                labelName: 'tag2',
                                sourceContent:
                                    'https://station-img.oss-cn-hangzhou.aliyuncs.com/bpm/20220530/0c8cc470521f4850964e90f307c76b41/Screenshot_20220527_102922_com.tencent.mm.jpg',
                                comment: null,
                                feature: null,
                                operatorId: null,
                                operatorName: null,
                                taskDetailId: 51042,
                                taskRecordId: null,
                                taskId: null,
                                dataSetId: 55,
                                dataIndex: null,
                            },
                        ],
                        nextDetailId: 51043,
                    },
                };

                const { detailData } = res.data;
                // 初始化
                init();
                image.src = detailData?.sourceContent || '';
            });
    };
    // 获取标签列表
    const getTagTableData = (id) => {
        axios
            .get(
                'https://tianqiapi.com/api?version=v6&appid=12382165&appsecret=9QN9R6Ma&city=杭州'
            )
            .then((res) => {
                res = {
                    success: true,
                    errorCode: null,
                    errorMessage: null,
                    data: {
                        category: [
                            {
                                id: 111,
                                gmtCreate: 1674487927000,
                                gmtModified: 1674487927000,
                                labelName: 'tag1',
                                labelKey: 'tag2',
                                labelType: 'category',
                                color: '#fcdc00',
                                dataSetId: 55,
                            },
                            {
                                id: 112,
                                gmtCreate: 1674487935000,
                                gmtModified: 1674487935000,
                                labelName: 'tag2',
                                labelKey: 'tag3',
                                labelType: 'category',
                                color: '#a4dd00',
                                dataSetId: 55,
                            },
                            {
                                id: 113,
                                gmtCreate: 1674487939000,
                                gmtModified: 1674487939000,
                                labelName: 'tag3',
                                labelKey: 'tag4',
                                labelType: 'category',
                                color: '#fda1ff',
                                dataSetId: 55,
                            },
                        ],
                    },
                };
                if (res.data?.category?.length) {
                    res.data.category.forEach((o) => {
                        o.label = o.labelName;
                        o.value = o.labelKey;
                        o.labelColor = o.color;
                    });
                    selectValue = res.data?.category?.at(0);
                    setRadioValue(res.data.category?.at(0));
                    setRadioValueList(res.data.category);
                    return;
                }
                setRadioValueList([]);
            });
    };
    // 显隐标注
    useEffect(() => {
        getContentInfo();
        // 最后获取 标签
        setTimeout(() => {
            getTagTableData();
        });
    }, []);
    // radio切换
    useEffect(() => {
        if (
            Object.prototype.toString.call(radioValue) === '[object Object]' ||
            Object.prototype.toString.call(radioValue) === '[object String]'
        ) {
            if (radioValueList.length) {
                selectValue = radioValueList.filter(
                    (i) => i.value === (radioValue?.value || radioValue)
                )[0];
                resetDataNewObj();
            }
        }
    }, [radioValue]);
    // 刷新
    useEffect(() => {
        if (image?.objects?.at(-1)) {
            console.log('===>触发确认<===');
        }
    }, [pageKey]);

    return (
        <div id="object-detection-container">
            <div className="object-detection">
                <div className="title">
                    <div className="save-operation">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                zoomOutPicture(image);
                            }}
                        ></Button>
                        <Button
                            type="primary"
                            icon={<MinusOutlined />}
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
                        <div className="labelSelect"></div>
                    </div>
                    <div className="label-operation">
                        <Radio.Group
                            onChange={onChangeLineColor}
                            value={radioValue?.value || radioValue}
                        >
                            {radioValueList?.map((i) => (
                                <>
                                    <Radio
                                        key={i.value}
                                        value={i.value}
                                        style={{ color: i.labelColor }}
                                    >
                                        {i.label}
                                    </Radio>
                                </>
                            ))}
                        </Radio.Group>
                        <Divider />
                    </div>
                </div>
                <div className="content-container">
                    <div id="canvas">
                        {/* 承载容器 */}
                        <canvas id="drawer" ref={canvas}></canvas>
                        {/* 红框容器 */}
                        <canvas
                            className="border-canvas"
                            ref={borderCanvas}
                        ></canvas>
                        {/* 左上角 */}
                        <canvas
                            className="border-canvas"
                            ref={leftTopCanvas}
                        ></canvas>
                        {/* 左下角 */}
                        <canvas
                            className="border-canvas"
                            ref={leftBottomCanvas}
                        ></canvas>
                        {/* 右上角 */}
                        <canvas
                            className="border-canvas"
                            ref={rightTopCanvas}
                        ></canvas>
                        {/* 右上角 */}
                        <canvas
                            className="border-canvas"
                            ref={rightBottomCanvas}
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
                            className={cNames(
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
                                if (isDelete) {
                                    [...objValueArr].forEach((item) => {
                                        item.isSelect = false;
                                    });
                                    isDelete = false;
                                    return;
                                }
                                [...objValueArr].forEach((item) => {
                                    item.isSelect = false;
                                });
                                objValueArr.at(i).isSelect = true;
                                setObjValueArr([...objValueArr]);
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
                                    className={cNames(
                                        'iconfont',
                                        v.isShow ? 'tjtyanjing' : 'tjtbiyan'
                                    )}
                                    onClick={() => {
                                        objValueArr[i].isShow =
                                            !objValueArr[i].isShow;
                                        image.objects[i].isShow =
                                            objValueArr[i].isShow;
                                        setObjValueArr([...objValueArr]);
                                        confirmBox(image.objects);
                                    }}
                                ></i>
                                <i
                                    className="iconfont tjtlajitong1"
                                    onClick={() => {
                                        if (
                                            [...objValueArr].length === 1 &&
                                            i === 0
                                        ) {
                                            setObjValueArr([]);
                                            isDelete = true;
                                            image.objects = [];
                                            showOriginImg();
                                            borderCanvas.current.style.cssText = `top:auto;left:auto`;
                                            borderCanvas.current.width = 0;
                                            borderCanvas.current.height = 0;
                                            return;
                                        }

                                        [...objValueArr].splice(i, 1);
                                        [...objValueArr].forEach((item) => {
                                            item.isSelect = false;
                                        });
                                        isDelete = true;
                                        setObjValueArr([...objValueArr]);
                                        image.objects.splice(i, 1);
                                        confirmBox(image.objects);

                                        borderCanvas.current.style.cssText = `top:auto;left:auto`;
                                        borderCanvas.current.width = 0;
                                        borderCanvas.current.height = 0;
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
