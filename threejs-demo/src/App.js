import React , { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import './index.css';

import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { RouterCom1, RouterCom2,routerPaths } from './router/index.jsx'; // 1.创建 RouterCom 组件


const { Content, Sider } = Layout;
const items = routerPaths.map((item, index) => ({
    key: String(index + 1),
    label: item.title,
    icon: item.icon,
    // children: item.children,
}));
console.log(routerPaths)

function App() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            {/* <BrowserRouter> */}
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
                        onSelect={(item) => {
                            console.log(item)
                            // const path = item?.props?.path;
                            // console.log(path);
                            
                        }}
                    />
                </Sider>
                <Layout className="site-layout">
                    <Content>
                        {/* 渲染路由方式 1 */}
                        {/* <RouterCom1 /> */}

                        {/* 渲染路由方式 2 */}
                        <RouterCom2 />
                    </Content>
                </Layout>
            </Layout>
            {/* </BrowserRouter> */}
        </>
    );
}

export default App;
