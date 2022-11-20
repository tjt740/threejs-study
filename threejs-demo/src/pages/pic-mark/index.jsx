import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './FileSaver';
import './index.css';
import { colorChange } from './utils';
import axios from 'axios';
import cnames from 'classnames';

let canvas,
    obj = {},
    p1 = {},
    p2 = {},
    image = new Image(),
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
    resValue = [],
    flag_drawBbox = false;
const radioValueList = [
    {
        label: '植物',
        value: 'botany',
        labelColor: '#68228B',
    },
    {
        label: '水果',
        value: 'fruit',
        labelColor: '#FF82AB',
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
];
export default function PicMark() {
    canvas = useRef(null);
    let selectValue = radioValueList?.at(0);
    const [objValueArr, setObjValueArr] = useState([]);
    const [radioValue, setRadioValue] = useState(
        () => radioValueList?.at(0)?.value
    );
    // 初始化
    function init() {
        canvas = canvas.current;
        canW = canvas.width;
        canH = canvas.height;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        flush_canvas();
        image.src = 'http://www.tietuku.cn/assets/img/error.svg';
        image.objects = [];

        // 加载图片
        image.onload = function () {
            showOriginImg();
        };
        // 双击方法
        canvas.ondblclick = function (e) {
            enlargedPicture(e, image);
        };
        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        canvas.onmouseup = function (e) {
            if (e.button === 2) {
                showOriginImg();
            }
        };
        // 划线
        canvas.onmousedown = function (e) {
            // 0 : 鼠标左键
            if (e.button === 0) {
                if (!flag_drawBbox) {
                    flag_drawBbox = true;
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
                flag_drawBbox = false;
            }
        };
        canvas.onmousemove = function (e) {
            if (flag_drawBbox) {
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
                showImage(image);
                ctx.fillStyle = utilsColorChange(obj.labelColor);
                ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                ctx.save();
            }
        };
    }
    // 获取数据
    function getData() {
        axios
            .get(
                `https://search.heweather.com/find?location=杭州&key=bc08513d63c749aab3761f77d74fe820`
            )
            .then((res) => {
                if (res.status === 200) {
                    let data = {
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
                                label: '植物',
                                labelColor: '#68228B',
                                value: 'botany',
                                keyId: '0.2382',
                                xMin: 266,
                                xMax: 366,
                                yMin: 64,
                                yMax: 208,
                                width: 100,
                                height: 144,
                            },
                            {
                                label: '植物',
                                labelColor: '#68228B',
                                value: 'botany',
                                keyId: '0.1336',
                                xMin: 416,
                                xMax: 516,
                                yMin: 64,
                                yMax: 206,
                                width: 100,
                                height: 142,
                            },
                            {
                                label: '咖啡',
                                labelColor: '#00CD00',
                                value: 'coffee',
                                keyId: '0.7728',
                                xMin: 190,
                                xMax: 280,
                                yMin: 241,
                                yMax: 371,
                                width: 90,
                                height: 130,
                            },
                            {
                                label: '咖啡',
                                labelColor: '#00CD00',
                                value: 'coffee',
                                keyId: '0.7403',
                                xMin: 352,
                                xMax: 486,
                                yMin: 241,
                                yMax: 390,
                                width: 134,
                                height: 149,
                            },
                            {
                                label: '水果',
                                labelColor: '#FF82AB',
                                value: 'fruit',
                                keyId: '0.4778',
                                xMin: 528,
                                xMax: 696,
                                yMin: 219,
                                yMax: 324,
                                width: 168,
                                height: 105,
                            },
                            {
                                label: '纸箱',
                                labelColor: '#00B2EE',
                                value: 'carton',
                                keyId: '0.5362',
                                xMin: 729,
                                xMax: 953,
                                yMin: 37,
                                yMax: 261,
                                width: 224,
                                height: 224,
                            },
                            {
                                label: '纸箱',
                                labelColor: '#00B2EE',
                                value: 'carton',
                                keyId: '0.3866',
                                xMin: 1038,
                                xMax: 1248,
                                yMin: 167,
                                yMax: 420,
                                width: 210,
                                height: 253,
                            },
                            {
                                label: '纸箱',
                                labelColor: '#00B2EE',
                                value: 'carton',
                                keyId: '0.2151',
                                xMin: 1220,
                                xMax: 1423,
                                yMin: 20,
                                yMax: 229,
                                width: 203,
                                height: 209,
                            },
                            {
                                label: '磁带',
                                labelColor: '#DEB887',
                                value: 'tape',
                                keyId: '0.2404',
                                xMin: 616,
                                xMax: 967,
                                yMin: 537,
                                yMax: 776,
                                width: 351,
                                height: 239,
                            },
                            {
                                label: '磁带',
                                labelColor: '#DEB887',
                                value: 'tape',
                                keyId: '0.9110',
                                xMin: 173,
                                xMax: 406,
                                yMin: 554,
                                yMax: 830,
                                width: 233,
                                height: 276,
                            },
                            {
                                label: '磁带',
                                labelColor: '#DEB887',
                                value: 'tape',
                                keyId: '0.1834',
                                xMin: 1249,
                                xMax: 1444,
                                yMin: 492,
                                yMax: 699,
                                width: 195,
                                height: 207,
                            },
                            {
                                label: '咖啡',
                                labelColor: '#00CD00',
                                value: 'coffee',
                                keyId: '0.9641',
                                xMin: 877,
                                xMax: 1077,
                                yMin: 500,
                                yMax: 703,
                                width: 200,
                                height: 203,
                            },
                        ],
                    };
                    const { imgName, objValue } = data;
                    objValue?.forEach((i) => {
                        drawFill(
                            imgName,
                            i.xMin,
                            i.yMin,
                            i.xMax,
                            i.yMax,
                            i.labelColor
                        );
                        i.x = i.xMin + 1;
                        i.y = i.yMin + 1;
                        i.w = i.xMax - i.xMin;
                        i.h = i.yMax - i.yMin;
                        // Tjt: 眼睛图标打开
                        i.isShow = true;
                        // Tjt: 是否选中
                        i.isSelect = false;
                    });
                    setObjValueArr(objValue);
                    resValue = objValue;
                    confirmBox(objValue);
                    return;
                }
            });
    }
    //双击放大图片
    function enlargedPicture(e, img) {
        if (e) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        } else {
            mouseX = 1;
            mouseY = 1;
        }
        if (canXYonImage(mouseX, mouseY)) {
            imgXY = canXYtoImageXY(img, mouseX, mouseY);
            img.focusX = imgXY[0];
            img.focusY = imgXY[1];
            img.sizek *= 1.2;
            resetDataNewObj();
            showImage(img);
            return;
        }
    }
    // 缩小图片
    function zoomOutPicture(img) {
        mouseX = 1;
        mouseY = 1;
        imgXY = canXYtoImageXY(img, mouseX, mouseY);
        imgXY = [1, 1];
        img.focusX = imgXY[0];
        img.focusY = imgXY[1];
        img.sizek *= 0.9;
        resetDataNewObj();
        showImage(img);
    }
    //判断点是否在image上
    function canXYonImage(x, y) {
        if (x > image.canx && x < image.canx + image.canw) {
            if (y > image.cany && y < image.cany + image.canh) {
                return true;
            }
        } else {
            return false;
        }
    }
    //获取canvas上一个点对应原图像的点
    function canXYtoImageXY(img, canx, cany) {
        k = 1 / img.sizek;
        imgX = (canx - img.canx) * k + img.cutx;
        imgY = (cany - img.cany) * k + img.cuty;
        return [imgX, imgY];
    }
    //在canvas上展示原图片
    function showOriginImg() {
        flush_canvas();
        canvas = canvas.current || canvas;
        imW = canvas.width;
        imH = canvas.height;
        image.width = canW;
        image.height = canH;
        k = canW / imW;
        if (imH * k > canH) {
            k = canH / imH;
        }
        image.sizek = k;
        image.focusX = imW / 2;
        image.focusY = imH / 2;
        resetDataNewObj();
        showImage(image);
    }
    //在canvas上展示图像对应的部分
    function showImage(img) {
        flush_canvas();
        imgWK = img.width * img.sizek;
        imgHK = img.height * img.sizek;

        // if (canW > imgWK) {
        //     img.cutx = 0;
        //     img.canx = (canW - imgWK) / 2;
        //     img.cutw = img.width;
        //     img.canw = imgWK;
        // } else {
        img.canx = 0;
        img.canw = canW;
        lenIm = canW / img.sizek;
        img.cutw = lenIm;
        xl = img.focusX - lenIm / 2;
        xr = img.focusX + lenIm / 2;
        img.cutx = xl;
        if (xl < 0) {
            img.cutx = 0;
        }
        if (xr >= img.width) {
            img.cutx = xl - (xr - img.width + 1);
        }
        // }

        // if (canH > imgHK) {
        //     img.cuty = 0;
        //     img.cany = (canH - imgHK) / 2;
        //     img.cuth = img.height;
        //     img.canh = imgHK;
        // } else {
        img.cany = 0;
        img.canh = canH;
        lenIm = canH / img.sizek;
        img.cuth = lenIm;
        yu = img.focusY - lenIm / 2;
        yd = img.focusY + lenIm / 2;
        img.cuty = yu;
        if (yu < 0) {
            img.cuty = 0;
        }
        if (yd >= img.height) {
            img.cuty = yu - (yd - img.height + 1);
        }
        // }
        // 先把图片缩放成画布比例的大小，否则直接设置图片宽高图片展示不完整
        ctx.drawImage(
            img,
            0,
            0,
            img.cutw,
            img.cuth,
            img.canx,
            img.cany,
            img.canw,
            img.canh
        );
        showObjects(img);
    }
    //图像上的点对应的canvas坐标
    function imageXYtoCanXY(img, x, y) {
        x = (x - img.cutx) * img.sizek + img.canx;
        y = (y - img.cuty) * img.sizek + img.cany;
        return [x, y];
    }
    //在canvas上显示已标注目标
    function showObjects(img) {
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
            drawFill(img, x, y, xm, ym, target.labelColor);
        }
    }
    // 画填充
    function drawFill(img, x1, y1, x2, y2, color) {
        ctx.fillStyle = utilsColorChange(color);
        ctx.beginPath();
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.fill();
        ctx.closePath();
    }
    // 充值obj
    function resetDataNewObj() {
        obj = {};
        color = selectValue?.[0]?.labelColor || selectValue?.labelColor;
        value = selectValue?.[0]?.value || selectValue?.value;
        label = selectValue?.[0]?.label || selectValue?.label;
        // 塞入数据到obj
        obj.labelColor = color;
        obj.value = value;
        obj.label = label;
        obj.keyId = Math.random().toFixed(4);
    }
    //  背景画布
    function flush_canvas() {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, canW, canH);
    }
    // 更改line颜色
    const onChangeLineColor = (e) => {
        setRadioValue(e.target.value);
    };
    // 确认框
    function confirmBox(resData) {
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
            resetDataNewObj();
            showOriginImg();
            return true;
        }
        // 没有划线路线
        return false;
    }
    // 颜色转换
    const utilsColorChange = (color) => {
        return colorChange.hexToRgb(color || '#000000').rgba;
    };
    //保存标注结果
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
            selectValue = objArr;
            console.log('标注数组：', objArr);
            // Tjt: 传给后端的数据
            const imRes = { imgName: image.src, objArr };
            const blob = new Blob([JSON.stringify(imRes)], { type: '' });
            const imgName = image.src.split('.')[0];
            const jsonFile = imgName + '.json';
            saveJson(jsonFile, blob);
            return;
        }
        alert('未进行任何标注');
    };
    //保存json文件
    function saveJson(file, data) {
        //下载为json文件
        const Link = document.createElement('a');
        Link.download = file;
        Link.style.display = 'none';
        // 字符内容转变成blob地址
        Link.href = URL.createObjectURL(data);
        // 触发点击
        document.body.appendChild(Link);
        Link.click();
        // 然后移除
        document.body.removeChild(Link);
    }

    // 显隐标注
    

    useEffect(() => {
        init();
        // 获取已存的数据;
        setTimeout(() => {
            getData();
        }, 0);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selectValue = radioValueList.filter((i) => i.value === radioValue);
        resetDataNewObj();
        showImage(image);
        ctx.fillStyle = utilsColorChange(selectValue?.labelColor);
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.save();
    }, [radioValue]);
    return (
        <>
            <header>
                <div className="operation">
                    <Button
                        type="primary"
                        icon={<MinusOutlined />}
                        onClick={() => zoomOutPicture(image)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => enlargedPicture(null, image)}
                    />
                    <Button
                        onClick={() => {
                            if (resValue.length) {
                                !confirmBox(resValue) &&
                                    alert('未选择目标区域！');
                                return;
                            }
                            !confirmBox() && alert('未选择目标区域！');
                        }}
                    >
                        确认
                    </Button>
                    <Button onClick={() => saveObj()}>完成图片标注</Button>
                    <Button
                        type="dashed"
                        onClick={() => {
                            resValue = [];
                            image.objects = [];
                            showOriginImg();
                        }}
                    >
                        重新标注图片
                    </Button>
                    <div className="labelSelect">
                        <Radio.Group
                            onChange={onChangeLineColor}
                            value={radioValue}
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
            </header>

            <div className="container">
                <div id="canvas">
                    <canvas width="1920" height="1080" ref={canvas}></canvas>
                </div>

                <div className="operation-area">
                    <div className="card-title">操作</div>
                    <ul className="radio-label">
                       
                        {objValueArr?.map((v, i) => (
                            <li
                                className={cnames(
                                    'li-radio-content',
                                    v.isSelect && v.isShow
                                        ? 'radio-select'
                                        : null,
                                    v.isShow ? null : 'opacity'
                                )}
                                key={v.keyId}
                                onClick={() => {
                                    [...objValueArr].forEach(
                                        (item) => (item.isSelect = false)
                                    );
                                    objValueArr[i].isSelect = true;
                                    setObjValueArr([...objValueArr]);
                                }}
                            >
                                <div
                                    className="li-radio"
                                    style={{ background: v.labelColor }}
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
                                            console.log([...objValueArr])
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
        </>
    );
}
