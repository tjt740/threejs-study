import PackagePreview3D from '../pages/装箱demo';
import Day1Com from '../pages/lessons/day1';
import Day10Com from '../pages/lessons/day10';
import NoFound from '../pages/no-found';
import { Redirect } from '../pages/redirect';
import { Outlet, Route, Routes, useRoutes, Navigate } from 'react-router-dom';
import React from 'react';
import './index.css';
import { createFromIconfontCN } from '@ant-design/icons';
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_2112553_dwu0qui8jl7.js', // 在 iconfont.cn 上生成
});
// 
export function RouterCom1() {
    return (
        <Routes>
            {/* 2️⃣默认路由 */}
            <Route path="/" element={<Day1Com />} />
            {/* 3️⃣一级路由 */}
            <Route path="/package-preview" element={<PackagePreview3D />} />
            {/* http://localhost:3000/package-preview */}
            {/* 4️⃣二级/多级路由  5️⃣<Outlet/>二级路由显示父级路由123 */}
            <Route
                path="/lesson"
                element={
                    <div>
                        123 <Outlet />
                    </div>
                }
            >
                <Route path="day-1" element={<Day1Com />} />
                {/* http://localhost:3000/lesson/day-1 */}
            </Route>
            {/* 6️⃣动态路由*/}
            <Route
                path="/lesson/:context"
                element={<> /lesson:context</>}
            ></Route>
            {/* http://localhost:3000/lesson/tjt?age=23 */}
            {/* 7️⃣重定向 404 */}
            <Route path="/404" element={<NoFound />}></Route>
            <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
    );
}

// 懒加载
const LazyLoad = (path) => { //传入在view 下的路径
    const LazyCom = React.lazy(() => import(`../pages/${path}`))
    return (
        <React.Suspense fallback={<> 加载中...</>}>
            <LazyCom />
        </React.Suspense>
    )
}

export const routerPaths = [
    {

        title: '学习内容',
        icon: <MyIcon type="icon-hamigua" />,
        pathName: 'lessons/day',
    },
    {
        title: '案例/实操',
        icon: <MyIcon type="icon-xigua" />,
        pathName:'装箱demo'
    }
];

export function RouterCom2() {
    return useRoutes([
        // 默认路由
        {
            path: '/',
            element:LazyLoad('lessons/day1'),
        },
        // 一级路由
        {
            path: '/package-preview',
            element: LazyLoad('装箱demo'),
        },
        // 多级路由
        {
            path: '/lesson',
            element: (
                <>
                    <div className="father">父级</div>
                    <Outlet />
                </>
            ),
            children: [
                {
                    path: 'day-1', // http://localhost:3000/lesson/day-1
                    element: <div className="son1">儿子1：day-1</div>,
                },
                // 孙子级路由
                {
                    path: 'day-2', // http://localhost:3000/lesson/day-1
                    element: (

                        <>
                            <div className="son2">儿子2：day-2</div>
                            <Outlet />
                        </>
                    ),
                    children: [
                        {
                            path: 'day-2-a',
                            element: (
                                <div className="grandson">孙子：day-2-a</div>
                            ),
                        },
                    ],
                },
            ],
        },
        // 动态路由
        { path: 'lesson/:context', element: <Day10Com /> },
        {
            path: '/404',
            element: LazyLoad('no-found')
        },
        // 重定向 404
        {
            path: '*',
            element: <Navigate to="/404" />,
        },
        // {
        //     path: '*',
        //     element: <Redirect to="/404" />,
        // },
    ]);
}
