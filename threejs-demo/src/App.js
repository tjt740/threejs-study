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
    return (
        <>
            <BrowserRouter>
                <RouterCom />
            </BrowserRouter>
        </>
    );
}

export default App;
