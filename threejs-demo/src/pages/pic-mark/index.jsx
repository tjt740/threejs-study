import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './FileSaver';
import './jquery-3.4.1';
import './jscolor';
import './index.css';
import { colorChange } from './utils';

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
            show_origin_img();
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
                show_origin_img();
            }
        };
        // 划线
        canvas.onmousedown = function (e) {
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
                show_image(image);
                
                ctx.strokeStyle = lineColorChange(obj.labelColor);
                ctx.fillStyle = lineColorChange(obj.labelColor);
                ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
                ctx.save();
                ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
                ctx.save();
            }
        };
    }
    /*双击放大图片*/
    function enlargeIm(e, img) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        console.log(e.clientX, e.offsetX);
        console.log(canvas.offsetLeft);
        console.log('canvasX: ' + mouseX + ' canvasY: ' + mouseY);
        if (canXYonImage(mouseX, mouseY)) {
            imgXY = canXYtoImageXY(img, mouseX, mouseY);
            console.log(imgXY);
            img.focusX = imgXY[0];
            img.focusY = imgXY[1];
            img.sizek *= 1.5;
            resetDataNewObj();
            show_image(img);
            return;
        }
    }
    /*判断点是否在image上*/
    function canXYonImage(x, y) {
        if (x > image.canx && x < image.canx + image.canw) {
            if (y > image.cany && y < image.cany + image.canh) {
                return true;
            }
        } else {
            return false;
        }
    }
    /*获取canvas上一个点对应原图像的点*/
    function canXYtoImageXY(img, canx, cany) {
        k = 1 / img.sizek;
        imgX = (canx - img.canx) * k + img.cutx;
        imgY = (cany - img.cany) * k + img.cuty;
        return [imgX, imgY];
    }
    /*在canvas上展示原图片*/
    function show_origin_img() {
        flush_canvas();
        console.log(canvas);
        canvas = canvas ? canvas 
        : canvas.current;
        // todo: 
        imW = canvas.width;
        imH = canvas.height;
        image.width = canW;
        image.height = canH;
        k = canW / imW;
        if (imH * k > canH) {
 
            k = canH / imH;
        }
        console.log(k,canW,imW);
        image.sizek = k;
        image.focusX = imW / 2;
        image.focusY = imH / 2;
        resetDataNewObj();
        show_image(image);
    }
    /*在canvas上展示图像对应的部分*/
    function show_image(img) {
        
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
                console.log(2.1);
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
        show_objects(img);
    }
    /*图像上的点对应的canvas坐标*/
    function imageXYtoCanXY(img, x, y) {
        x = (x - img.cutx) * img.sizek + img.canx;
        y = (y - img.cuty) * img.sizek + img.cany;
        return [x, y];
    }
    /*在canvas上显示已标注目标*/
    function show_objects(img) {
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
            draw_fill(img, x, y, xm, ym, target.labelColor);
            // 画线
            // draw_line(img, x, y, xm, ym, target.labelColor);

            // // 左
            // draw_line(img, x, y, x, ym, target.labelColor);
            // // 上
            // draw_line(img, x, y, xm, y, target.labelColor);
            // // 右
            // draw_line(img, xm, y, xm, ym, target.labelColor);
            // // 下
            // draw_line(img, x, ym, xm, ym, target.labelColor);
        }
    }
    // 画填充 画直线
    function draw_fill(img, x1, y1, x2, y2, color) {
        ctx.strokeStyle = lineColorChange(color);
        ctx.fillStyle = lineColorChange(color);
        // 画填充
        ctx.beginPath();
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.fill();
        ctx.closePath();
        // 画直线
        ctx.beginPath();
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
        ctx.closePath();
    }

    // 充值obj
    function resetDataNewObj() {
        obj = {};
        color = selectValue?.at(0)?.labelColor;
        lab = selectValue?.at(0)?.value;
        console.log(selectValue);
        obj.labelColor = color;
        obj.label = lab;
        console.log(obj);
    }
    /*背景画布*/
    function flush_canvas() {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, canW, canH);
    }
    // 更改line颜色
    const onChangeLineColor = (e) => {
        setRadioValue(e.target.value);
    };
    // 确认框
    function confirmBox() {
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
            show_origin_img();
            return true;
        }
        return false;
    }
    // 颜色转换
    const lineColorChange = (color) => {
        return colorChange.hexToRgb(color || '#000000').rgba;
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        // canvas = canvas.current;
        selectValue = radioValueList.filter((i) => i.value === radioValue);
        // console.log(selectValue)
        show_image(image);
        ctx.strokeStyle = selectValue?.at(0)?.labelColor;
        ctx.fillStyle = lineColorChange(selectValue?.at(0)?.labelColor);
        // console.log( lineColorChange(selectValue?.at(0)?.labelColor));
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.save();
        ctx.strokeStyle = lineColorChange(selectValue?.at(0)?.labelColor);
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
        ctx.save();
    }, [radioValue]);

    return (
        <>
            <div className="operation">
                <Button type="primary" icon={<MinusOutlined />} />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={(e) => enlargeIm(e, image)}
                />
            </div>

            <div className="labelSelect">
                <Radio.Group onChange={onChangeLineColor} value={radioValue}>
                    {radioValueList.map((i) => (
                        <Radio
                            key={i.value}
                            value={i.value}
                            style={{ color: i.labelColor }}
                        >
                            {' '}
                            {i.label}{' '}
                        </Radio>
                    ))}
                </Radio.Group>
            </div>

            <canvas ref={canvas} width="960" height="540"></canvas>

            {/* <label htmlFor="imgSelector" className="btn btn-success">
                    打开图片路径
                </label>
                <input
                    type="file"
                    id="imgSelector"
                    name="imgFile"
                    webkitdirectory="true"
                    directory="true"
                    multiple={ true}
                />
                <button id="gotoIm">
                    转到图片...
                </button> */}

            <div className="CateBox">
                <button
                    id="boxDone"
                    onClick={() => {
                        if (!confirmBox()) {
                            alert('未选择目标区域！');
                        }
                    }}
                >
                    确认
                </button>
                <br />
                <button id="imDone">完成图片标注</button>
                <br />
                <button id="resetIm">重新标注图片</button>
                <br />
            </div>
        </>
    );
}
