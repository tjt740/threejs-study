import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { RouterCom2, routerPaths } from './router/index.jsx'; //

const { Content, Sider } = Layout;
const items = routerPaths.map((item, index) => ({
    key: index,
    label: item.label,
    icon: item.icon,
    children: item.children,
}));

function App() {
    // 是否收缩侧边栏
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState();
    const navigate = useNavigate();
    return (
        <>
            <Layout>
                <Sider
                    className="dynamic-side"
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
                </Sider>
                <div> </div>
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
