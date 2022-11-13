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
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    return (
        <>
            <Layout>
                <Sider
                    width={300}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={items}
                        onSelect={(item) => {
                            navigate(item['key']);
                        }}
                    />
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
