import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import './index.css';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ConfigProvider locale={ locale }>
        <App />
        </ConfigProvider>
    </BrowserRouter>
);
