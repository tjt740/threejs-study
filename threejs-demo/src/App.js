import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { RouterCom2, routerPaths } from './router/index.jsx'; //
import './index.css';

const { Content, Sider } = Layout;
const items = routerPaths.map((item, index) => ({
    key: index,
    label: item.label,
    icon: item.icon,
    children: item.children,
}));

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3387028_mgnzua1ud6.js',
});

function App() {
    const draggableRef = useRef(null);
    // 是否收缩侧边栏
    const [collapsed, setCollapsed] = useState(true);
    const [width, setWidth] = useState(240);
    const navigate = useNavigate();
    function init() {
        const dynamicSide = document.getElementById('dynamic-side');

        draggableRef.current.ondragend = (e) => {
            if (e.x - 16 <= 240) {
                setWidth(240);
                dynamicSide.style.cssText = `width: 240px`;
                return;
            }
            setWidth(e.x - 16);
            dynamicSide.style.cssText = `width: ${e.x - 16}px`;
        };
    }
    useEffect(() => {
        init();
    }, []);
    return (
        <>
            <Layout>
                <Sider
                    id="dynamic-side"
                    width={width}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <Menu
                        mode="inline"
                        items={items}
                        onSelect={(item) => {
                            navigate(item['key']);
                        }}
                    />
                    <div className="drag-icon" draggable ref={draggableRef}>
                        <IconFont type="icon-034-beehive" />
                    </div>
                </Sider>

                <Layout className="site-layout">
                    <Content>
                        <RouterCom2 />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default App;
