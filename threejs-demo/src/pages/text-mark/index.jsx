import React, { useState, useEffect, useRef } from 'react';
import { Menu, Button, Select, Tag } from 'antd';
import {
    CheckOutlined,
    RollbackOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import { LabelText } from './labeltext';
import './index.css';

const str =
    'WebGL（全写Web Graphics Library）是一种3D绘图协议，这种绘图技术标准允许把JavaScript和OpenGL ES 2.0结合在一起，通过增加OpenGL ES 2.0的一个JavaScript绑定，WebGL可以为HTML5 Canvas提供硬件3D加速渲染，这样Web开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型了，还能创建复杂的导航和数据视觉化。显然，WebGL技术标准免去了开发网页专用渲染插件的麻烦，可被用于创建具有复杂3D结构的网站页面，甚至可以用来设计3D网页游戏等等。还有一些厂商对MSAA技术进行了扩展，这里只简单提下： - 2006年，NVIDIA提出的CSAA（coverage sampling antialiasing），AMD提出的EQAA（enhanced quality antialiasing），尝试优化MSAA的Coverage来改进AA效果，但是提升的效果非常有限，参见[7, 8]的介绍； - 2007年，ATI提出的CFAA（custom filter antialiasing），尝试优化MSAA的Resolve阶段的过滤算法（默认是Box Filter）来改进AA效果；移动平台的TBR架构能高效的支持MSAA，但是由于MSAA的原理限制，它不适用于延迟管线（deferred pipeline）。此时，快速近似抗锯齿（FXAA，fast approximate antialising）可以作为MSAA算法的补充。FXAA是通过单一次、全屏的后处理来实现的，也是对边缘像素多次超采样，达到边缘锯齿的效果，是一个偏经验性的算法（简单说，就是别问我它为什么有效果），虚幻4引擎集成了该技术[9]。光珊化后，每一个像素点都包含了 颜色 、深度 、纹理数据， 这个我们叫做片元小tips ： 每个像素的颜色由片元着色器的gl_FragColor提供接收光栅化阶段生成的片元，在光栅化阶段中，已经计算出每个片元的颜色信息，这一阶段会将片元做逐片元挑选的操作，处理过的片元会继续向后面的阶段传递。 片元着色器运行的次数由图形有多少个片元决定的。逐片元挑选通过模板测试和深度测试来确定片元是否要显示，测试过程中会丢弃掉部分无用的片元内容，然后生成可绘制的二维图像绘制并显示。● 深度测试： 就是对 z 轴的值做测试，值比较小的片元内容会覆盖值比较大的。（类似于近处的物体会遮挡远处物体）。● 模板测试： 模拟观察者的观察行为，可以接为镜像观察。标记所有镜像中出现的片元，最后只绘制有标记的内容。';
let labelText;
export default function TextMark() {
    const contextRef = useRef(null);
    const [modalSelectContent, setModalSelectContent] = useState(null);
    window.setModalSelectContent = setModalSelectContent;
    const items = [
        {
            label: <Tag color="#c41d7f">#c41d7f</Tag>,
            key: '#c41d7f',
            color: '#c41d7f',
            background: '#fff0f6',
            border: '#ffadd2',
        },
        {
            label: <Tag color="#cf1322">#cf1322</Tag>,
            key: '#cf1322',
            color: '#cf1322',
            background: '#fff1f0',
            border: '#ffa39e',
        },
        {
            label: <Tag color="#d4380d">#d4380d</Tag>,
            key: '#d4380d',
            color: '#d4380d',
            background: '#fff2e8',
            border: '#ffbb96',
        },
        {
            label: <Tag color="#d46b08">#d46b08</Tag>,
            key: '#d46b08',
            color: '#d46b08',
            background: '#fff7e6',
            border: '#ffd591',
        },
        {
            label: <Tag color="#d48806">#d48806</Tag>,
            key: '#d48806',
            color: '#d48806',
            background: '#fffbe6',
            border: '#ffe58f',
        },
        {
            label: <Tag color="#7cb305">#7cb305</Tag>,
            key: '#7cb305',
            color: '#7cb305',
            background: '#fcffe6',
            border: '#eaff8f',
        },
        {
            label: <Tag color="#389e0d">#389e0d</Tag>,
            key: '#389e0d',
            color: '#389e0d',
            background: '#f6ffed',
            border: '#b7eb8f',
        },
        {
            label: <Tag color="#08979c">#08979c</Tag>,
            key: '#08979c',
            color: '#08979c',
            background: '#e6fffb',
            border: '#87e8de',
        },
        {
            label: <Tag color="#0958d9">#0958d9</Tag>,
            key: '#0958d9',
            color: '#0958d9',
            background: '#e6f4ff',
            border: '#91caff',
        },
        {
            label: <Tag color="#1d39c4">#1d39c4</Tag>,
            key: '#1d39c4',
            color: '#1d39c4',
            background: '#f0f5ff',
            border: '#adc6ff',
        },
        {
            label: <Tag color="#531dab">#531dab</Tag>,
            key: '#531dab',
            color: '#531dab',
            background: '#f9f0ff',
            border: '#d3adf7',
        },
    ];
    const [menuKey, setMenuKey] = useState(Math.random());

    // 自定义tag
    const tagRender = (props) => {
        const { label, value } = props;
        return (
            <>
                {label ? (
                    <Tag color={value} style={{ marginLeft: 5 }}>
                        {label}
                    </Tag>
                ) : null}
            </>
        );
    };

    useEffect(() => {
        // Step1 :
        // eslint-disable-next-line react-hooks/exhaustive-deps
        labelText = new LabelText({
            el: contextRef.current,
        });

        //  Step2 : 模拟接口调用
        setTimeout(() => {
            labelText.addText(str);
        }, 0);
    }, []);

    return (
        <>
            <header>
                <div className="operation">
                    <Button
                        type="primary"
                        shape="round"
                        icon={<RollbackOutlined />}
                        onClick={() => {
                            window.repeal();
                        }}
                    >
                        上一步
                    </Button>
                    <Button
                        type="primary"
                        shape="round"
                        danger
                        icon={<UndoOutlined />}
                        onClick={() => {
                            window.clean();
                        }}
                    >
                        重置标注
                    </Button>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<CheckOutlined />}
                        onClick={() => {
                            console.log(labelText.output());
                            labelText.output();
                        }}
                    >
                        标注结果
                    </Button>
                    <div className="labelSelect"></div>
                </div>
            </header>

            <div className="container">
                <div
                    className="content-container interval"
                    ref={contextRef}
                ></div>
                {/* 下拉选择 */}
                <div id="select-modal">
                    <div className="input-select">
                        <Select
                            size="large"
                            mode="multiple"
                            allowClear={modalSelectContent}
                            defaultOpen={false}
                            showArrow={false}
                            dropdownStyle={{ height: 0 }}
                            showSearch={false}
                            placeholder="请选择标签"
                            maxTagCount={1}
                            value={modalSelectContent || null}
                            tagRender={tagRender}
                            onClear={() => {
                                labelText.deleteLabel(modalSelectContent);
                            }}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="label-show">
                        <Menu
                            key={menuKey}
                            items={items}
                            onSelect={(item) => {
                                window.selectLabel(item?.key);
                                setMenuKey(Math.random());
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
