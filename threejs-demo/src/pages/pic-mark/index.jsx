import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './FileSaver';
import './index.css';
import { colorChange } from './utils';
import axios from 'axios';

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
    lab,
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
    flag_drawBbox = false;

export default function PicMark() {
    canvas = useRef(null);
    let selectValue;
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
    const [radioValue, setRadioValue] = useState(
        () => radioValueList[0]?.value
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
            enlargeIm(e, image);
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
                ctx.fillStyle = lineColorChange(obj.labelColor);
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
                                label: 'botany',
                                labelColor: '#68228B',
                                xMin: 100,
                                xMax: 326,
                                yMin: 44,
                                yMax: 233,
                                width: 226,
                                height: 189,
                            },
                            {
                                label: 'fruit',
                                labelColor: '#FF82AB',
                                xMin: 523,
                                xMax: 752,
                                yMin: 82,
                                yMax: 303,
                                width: 229,
                                height: 221,
                            },
                            {
                                label: 'botany',
                                labelColor: '#68228B',
                                xMin: 172,
                                xMax: 371,
                                yMin: 246,
                                yMax: 496,
                                width: 199,
                                height: 250,
                            },
                            {
                                label: 'coffee',
                                labelColor: '#00CD00',
                                xMin: 391,
                                xMax: 520,
                                yMin: 262,
                                yMax: 425,
                                width: 129,
                                height: 163,
                            },
                            {
                                label: 'carton',
                                labelColor: '#00B2EE',
                                xMin: 569,
                                xMax: 750,
                                yMin: 328,
                                yMax: 482,
                                width: 181,
                                height: 154,
                            },
                            {
                                label: 'tape',
                                labelColor: '#DEB887',
                                xMin: 949,
                                xMax: 1152,
                                yMin: 162,
                                yMax: 355,
                                width: 203,
                                height: 193,
                            },
                        ],
                    };

                    console.log('data====>>>>>', data);

                    const { imgName, objValue } = data;
                    objValue.forEach((i) => {
                        drawFill(
                            imgName,
                            i.xMin,
                            i.yMin,
                            i.xMax,
                            i.yMax,
                            i.labelColor
                        );
                        i.x = i.xMin;
                    }
                    );
                    console.log(objValue);
                    confirmBox(objValue);
                    // showOriginImg();

                    return;
                }
            });
    }
    //双击放大图片
    function enlargeIm(e, img) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;

        if (canXYonImage(mouseX, mouseY)) {
            imgXY = canXYtoImageXY(img, mouseX, mouseY);
            img.focusX = imgXY[0];
            img.focusY = imgXY[1];
            img.sizek *= 1.5;
            resetDataNewObj();
            showImage(img);
            return;
        }
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

        if (canW > imgWK) {
            img.cutx = 0;
            img.canx = (canW - imgWK) / 2;
            img.cutw = img.width;
            img.canw = imgWK;
        } else {
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
        }

        if (canH > imgHK) {
            img.cuty = 0;
            img.cany = (canH - imgHK) / 2;
            img.cuth = img.height;
            img.canh = imgHK;
        } else {
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
        }
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
        ctx.fillStyle = lineColorChange(color);
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
        color = selectValue?.at(0)?.labelColor;
        lab = selectValue?.at(0)?.value;
        obj.labelColor = color;
        obj.label = lab;
    }
    //背景画布
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
            console.log(`1`,image.objects)
            return true;
        }
        if (resData?.length) { 
            console.log(2, resData);
            // flush_canvas();
            resetDataNewObj();
            // todo: 回填渲染
            // showImage(image);
        } 
        console.log(3,resData)
        return false;
    }
    // 颜色转换
    const lineColorChange = (color) => {
        return colorChange.hexToRgb(color || '#000000').rgba;
    };
    //保存标注结果
    const saveObj = () => {
        const num = image.objects.length;
        if (num) {
            const objValue = [];
            for (let i = 0; i < num; i++) {
                target = image.objects[i];
          
                objValue.push({
                    label: target.label,
                    labelColor: target.labelColor,
                    xMin: parseInt(target.xMin),
                    xMax: parseInt(target.xMax),
                    yMin: parseInt(target.yMin),
                    yMax: parseInt(target.yMax),
                    width: parseInt(target.w),
                    height: parseInt(target.h),
                });
            }
            // Tjt: key 数据
            const imRes = { imgName: image.src, objValue };
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

    useEffect(() => {
        init();
        // 获取已存的数据;
        setTimeout(() => { 
            getData();
        },0)
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selectValue = radioValueList.filter((i) => i.value === radioValue);
        resetDataNewObj();
        showImage(image);
        ctx.fillStyle = lineColorChange(selectValue?.at(0)?.labelColor);
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.save();
    }, [radioValue]);
    return (
        <>
            <header>
                <div className="operation">
                    <Button type="primary" icon={<MinusOutlined />} />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={(e) => enlargeIm(e, image)}
                    />
                    <Button
                        onClick={() => {
                            if (!confirmBox()) {
                                alert('未选择目标区域！');
                            }
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
            </div>
        </>
    );
}
