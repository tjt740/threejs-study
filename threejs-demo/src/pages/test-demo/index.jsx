import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { Divider, Button, Modal, Tag } from 'antd';
// lodash
import * as _ from 'lodash';
import './index.less';
import CanvasHighlighter from 'canvas-highlighter';

const html = `燕子去了，有再来的时候杨柳枯了，有再青的时候桃花谢了，有再开的时候。但是聪明的你告诉我，我们的日子为什么一去不复返呢？是有人偷了他 们罢：那是谁？又藏在何处呢？是他们自己逃走了罢如今又到了哪里呢？

我不知道他们给了我多少日子，但我的手确乎是渐渐空虚了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头涔涔而泪潸潸了。去的尽管去了，来的尽管来着，去来的中间，又怎样地匆匆呢？

早上我起来的时候，小屋里射进两三方斜斜的太阳。太阳他有脚啊，轻轻悄悄地挪移了，我也茫茫然跟着旋转。于是洗手的时候，日子从水盆里过去，吃饭的时候，日子从饭碗里过去，默默时，便从凝然的双眼前过去。我觉察他去的匆匆了，伸出手遮挽时，他又从遮挽着的手边过去。

天黑时，我躺在床上，他便伶伶俐俐地从我身上跨过，从我脚边飞去了。等我睁开眼和太阳再见，这算又溜走了一日。我掩着面叹息。但是新来的日子的影儿又开始在叹息里闪过了。在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？

只有徘徊罢了，只有匆匆罢了，在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了。我留着些什么痕迹呢？我何曾留着像游丝样的痕迹呢？

我赤裸裸来到这世界，转眼间也将赤裸裸的回去罢？但不能平的，为什么偏要白白走这一遭啊？你聪明的，告诉我，我们的日子为什么一去不复返呢？`;

let highlighter;
// 默认选中内容
let active = '';
// 记录tagStyleRecordList
let tagStyleRecordList = [];

function Testdemo() {
    const contextRef = useRef(null);
    // 组件配置
    const highlighterConfig = {
        rectFill: 'rgba(20,230,22,0.5)',
    };

    const [paramsOptions, setParamsOptions] = useImmer({
        // 默认回填数据
        list: [
            {
                id: 'CE0C0ADD',
                range: {
                    id: 'CE0C0ADD',
                    text: '了，伸出',
                    start: {
                        path: [0],
                        offset: 330,
                        text: '了，伸出',
                    },
                    end: {
                        path: [0],
                        offset: 334,
                        text: '了，伸出',
                    },
                    config: {
                        rect: {
                            // 固定参数
                            fill: 'rgba(255, 170, 0, 0.2)',
                            visible: true,
                            // konva.js配置 可选链
                            konvaConfig: {
                                stroke: 'rgba(255, 170, 0, 0.2)',
                                offsetX: 3,
                                cornerRadius: 5,
                            },
                        },
                        line: {
                            stroke: 'rgba(255, 170, 0, 1)',
                            strokeWidth: 2,
                            visible: true,
                            konvaConfig: {
                                // 偏移
                                offsetX: 3,
                                // 圆角
                                // lineCap: 'round',
                                // lineJoin: 'round',
                            },
                        },
                    },
                },
                text: '评论',
            },
        ],
        styleRecordList: [],
        // 标注范围
        range: null,
        isModalOpen: false,
        style: {
            top: 0,
            left: 0,
            display: 'none',
        },
        // 是否选中
        active: null,
    });

    const showModal = () => {
        setParamsOptions((draft) => {
            draft.isModalOpen = true;
        });
    };
    const handleOk = () => {
        if (paramsOptions.range) {
            const cloneDeepArr = _.cloneDeep(paramsOptions.list);
            cloneDeepArr.push({
                // todo: 改成uuid() 2;
                id: paramsOptions.range.id,
                range: paramsOptions.range,
                text: '评论',
            });

            // 高亮选中区域
            highlighter.addRange(paramsOptions.range);
            setParamsOptions((draft) => {
                draft.list = cloneDeepArr;
                draft.style.display = 'none';
            });

            // 自定义隐藏矩形，只显示下划线
            const _cloneDeepRange = _.cloneDeep(paramsOptions.range);
            _cloneDeepRange.config.rect.visible = false;
            highlighter.updateRange(_cloneDeepRange);
        }

        setParamsOptions((draft) => {
            draft.isModalOpen = false;
            // 隐藏标注按钮
            draft.style.display = 'none';
        });
    };

    const handleCancel = () => {
        setParamsOptions((draft) => {
            draft.isModalOpen = false;
            draft.style.display = 'none';
        });
    };

    // 获取详情
    function getContentInfo() {
        if (contextRef?.current) {
            // 创建 CanvasHighlighter 实例
            highlighter = new CanvasHighlighter(
                contextRef.current
                // highlighterConfig
            );

            // 数据回填渲染已有评论列表
            highlighter.renderRanges(paramsOptions.list.map((i) => i.range));

            // 默认选中
            active = paramsOptions.list[0].id;

            // 监听容器元素鼠标抬起事件
            contextRef.current.addEventListener('mouseup', () => {
                // 获取当前划词选中的 range 对象
                console.log('新增数据↓', highlighter.getSelectionRange());
                // todo: 改成uuid() 1;
                const newRrange = highlighter.getSelectionRange();
                setParamsOptions((draft) => {
                    draft.range = newRrange;
                });

                if (highlighter.getSelectionRange()) {
                    // 获取划词区域最后一个节点位置,标注位置
                    const { start, end } = highlighter.getSelectionPosition();
                    console.log(highlighter.getSelectionPosition());
                    // 设置高亮按钮位置 <标注+tag>

                    // tagStyleRecordList.push({
                    //     id: newRrange.id,
                    //     top: end.y + 24 + 'px',
                    //     left: start.x + 'px',
                    //     display: 'inline-block',
                    // });

                    setParamsOptions((draft) => {
                        draft.style = {
                            top: end.y - 35 + 'px',
                            left: end.x + 4 + 'px',
                            display: 'inline-block',
                        };
                    });
                }
            });

            document.addEventListener('click', (event) => {
                // 通过传入点击位置获取 range id
                const id = highlighter.getRangeIdByPointer(
                    event.clientX,
                    event.clientY
                );

                // 隐藏上一个激活的 range
                const _cloneDeepRange = _.cloneDeep(
                    highlighter.getRange(active)
                );
                if (_cloneDeepRange) {
                    _cloneDeepRange.config.rect.visible = false;
                    highlighter.updateRange(_cloneDeepRange);
                }

                // 激活新点击的 range
                active = '';
                if (id) {
                    active = id;
                    const _cloneDeepRange = _.cloneDeep(
                        highlighter.getRange(id)
                    );
                    _cloneDeepRange.config.rect.visible = true;
                    highlighter.updateRange(_cloneDeepRange);
                }
            });
        }
    }

    useEffect(() => {
        getContentInfo();
    }, []);
    useEffect(() => {
        console.log('监听标注列表++>', paramsOptions.list);
        window.paramsOptions = paramsOptions;

        // let arr = [];
        // paramsOptions.list.forEach((item) => {
        //     tagStyleRecordList.forEach((v, i) => {
        //         if (v.id === item.id) {
        //             arr.push(v);
        //         }
        //     });
        // });
        // setParamsOptions((draft) => {
        //     draft.styleRecordList = arr;
        // });
    }, [paramsOptions.list]);

    // 获取全部标注数据
    // highlighter.getAllRange()
    window.highlighter = highlighter;
    return (
        <div className="one-search-box-container">
            <div id="one-search-box-container">
                <div className="flex-row">
                    <div className="one-search-box">
                        <div className="title">
                            <div className="label-operation">
                                <Divider />
                                <Button
                                    className="highlight-btn"
                                    type="primary"
                                    danger
                                    onClick={showModal}
                                    style={paramsOptions.style}
                                >
                                    标注
                                </Button>
                            </div>
                        </div>
                        <div className="content-container">
                            <div className="content-show">
                                <div
                                    className="content-container interval"
                                    ref={contextRef}
                                >
                                    {html}
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="aside"></aside>
                </div>

                <Modal
                    title="高亮弹窗"
                    open={paramsOptions.isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>

                {/* {paramsOptions.styleRecordList.map((item) => {
                    return (
                        <Tag key={item.id} style={item} color="#f50">
                            #f50
                        </Tag>
                    );
                })} */}
            </div>
        </div>
    );
}

export default Testdemo;
