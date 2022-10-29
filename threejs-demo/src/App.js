import React from 'react';
import { Layout, Menu } from 'antd';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { RouterCom, routePaths } from './router/router.jsx'; // 1.创建 RouterCom 组件
import { useNavigate } from 'react-router-dom';

const { Content, Sider } = Layout;
const items = routePaths.map((item, index) => ({
    key: String(index + 1),
    label: item.name,
    icon: item.icon,
    children: item.children,
}));

function App() {
    const nav = useNavigate();
    const go = () => {
        nav('day-1', {
            replace: false,
            state: { id: 'reactiv3' },
        });
    };

    return (
        <Layout>
            <Sider>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                    onSelect={({ item }) => {
                        const path = item?.props?.path;
                        console.log(path);

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        // const navigate = useNavigate();
                        // navigate(path);
                    }}
                />
            </Sider>
            <Layout className="site-layout">
                <Content>
                    <button onClick={go}>编程式跳转</button>
                    <BrowserRouter>
                        <RouterCom />
                    </BrowserRouter>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
