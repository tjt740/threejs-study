import React from 'react';
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

// 设置路由 → 引入BrowserRouter →
import { BrowserRouter } from 'react-router-dom';
import { RouterCom } from './router/router.jsx';
import 'antd/dist/antd.css';
import './index.css';
const { Header, Content, Footer, Sider } = Layout;

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
