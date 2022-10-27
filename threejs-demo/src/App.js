import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { RouterCom, routePaths } from './router/router.jsx'; // 1.创建 RouterCom 组件

const { Content, Sider } = Layout;
const items = routePaths.map((item, index) => ({
    key: String(index + 1),
    label: item.name,
    icon: item.icon,
    children: item.children,
}));

function App() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Content>
                    11111
                    <BrowserRouter>
                        <RouterCom />
                    </BrowserRouter>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
