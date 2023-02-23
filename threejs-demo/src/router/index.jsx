import PackagePreview3D from '../pages/装箱demo';
import PicMark from '../pages/pic-mark';
import TextMark from '../pages/text-mark';
import MarkdownCom from '../pages/markdown';
// import Day1Com from '../pages/lessons/day1';
// import Day2Com from '../pages/lessons/day2';
// import Day3Com from '../pages/lessons/day3';
// import Day4Com from '../pages/lessons/day4';
// import Day5Com from '../pages/lessons/day5';
// import Day6Com from '../pages/lessons/day6';
// import Day7Com from '../pages/lessons/day7';
// import Day8Com from '../pages/lessons/day8';
// import NoFound from '../pages/no-found';
// import { Redirect } from '../pages/redirect';
// import { Outlet, Route, Routes } from 'react-router-dom';

import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import './index.css';
import { createFromIconfontCN } from '@ant-design/icons';
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3387028_u7gtdny4m09.js', // 在 iconfont.cn 上生成
});
// 不推荐路由组件 （一）
// export function RouterCom1() {
//     return (
//         <Routes>
//             {/* 2️⃣默认路由 */}
//             <Route path="/" element={<Day1Com />} />
//             {/* 3️⃣一级路由 */}
//             <Route path="/package-preview" element={<PackagePreview3D />} />
//             {/* http://localhost:3000/package-preview */}
//             {/* 4️⃣二级/多级路由  5️⃣<Outlet/>二级路由显示父级路由123 */}
//             <Route
//                 path="/lessons"
//                 element={
//                     <div>
//                         123 <Outlet />
//                     </div>
//                 }
//             >
//                 <Route path="day-1" element={<Day1Com />} />
//                 {/* http://localhost:3000/lessons/day-1 */}
//             </Route>
//             {/* 6️⃣动态路由*/}
//             <Route
//                 path="/lessons/:context"
//                 element={<> /lessons:context</>}
//             ></Route>
//             {/* http://localhost:3000/lessons/tjt?age=23 */}
//             {/* 7️⃣重定向 404 */}
//             <Route path="/404" element={<NoFound />}></Route>
//             <Route path="*" element={<Navigate to="/404" />} />
//         </Routes>
//     );
// }

// （二）
// 懒加载
const LazyLoad = (path) => {
    //传入在view 下的路径
    const LazyCom = React.lazy(() => import(`../pages/${path}`));
    return (
        <React.Suspense fallback={<> 加载中...</>}>
            <LazyCom />
        </React.Suspense>
    );
};

// Tjt: 以后只需要维护这一个路由就可以了
// Ps:  iconfont地址:  https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.db775f1f3&manage_type=myprojects&projectId=3387028&keyword=&project_type=&page=
export const routerPaths = [
    {
        label: '学习内容',
        icon: <MyIcon type="icon-kecheng" />,
        key: Math.random(),
        children: [
            {
                label: '创建一个对象 （场景+相机+对象） ==> 渲染器渲染',
                icon: <MyIcon type="icon-danta" />,
                elementPath: 'lessons/day1',
                key: 'lessons/day1',
            },
            {
                label: '轨道控制器控制器 OrbitControls 使物体可以旋转',
                icon: <MyIcon type="icon-qingning" />,
                elementPath: 'lessons/day2',
                key: 'lessons/day2',
            },
            {
                label: '3D辅助线',
                icon: <MyIcon type="icon-lajiao" />,
                elementPath: 'lessons/day3',
                key: 'lessons/day3',
            },
            {
                label: '物体移动',
                icon: <MyIcon type="icon-shizi" />,
                elementPath: 'lessons/day4',
                key: 'lessons/day4',
            },
            {
                label: '物体位置 + 缩放 + 角度',
                icon: <MyIcon type="icon-mojituo" />,
                elementPath: 'lessons/day5',
                key: 'lessons/day5',
            },
            {
                label: 'new THREE.Clock() 获取运行时时间信息',
                icon: <MyIcon type="icon-pijiu" />,
                elementPath: 'lessons/day6',
                key: 'lessons/day6',
            },
            {
                label: 'gsap 设置动画效果 动画框架 npm i gsap',
                icon: <MyIcon type="icon-putaojiu" />,
                elementPath: 'lessons/day7',
                key: 'lessons/day7',
            },
            {
                label: '随页面尺寸变化而自适应渲染大小',
                icon: <MyIcon type="icon-kouxiangtang" />,
                elementPath: 'lessons/day8',
                key: 'lessons吧/day8',
            },
            {
                label: 'dat.gui使用',
                icon: <MyIcon type="icon-xiangcaobingqilin" />,
                elementPath: 'lessons/day9',
                key: 'lessons/day9',
            },
            {
                label: '认识几何体',
                icon: <MyIcon type="icon-jiaozi" />,
                elementPath: 'lessons/day10',
                key: 'lessons/day10',
            },
            {
                label: '创建酷炫三角形',
                icon: <MyIcon type="icon-tilamisu" />,
                elementPath: 'lessons/day11',
                key: 'lessons/day11',
            },
            {
                label: '创建空心长方体',
                icon: <MyIcon type="icon-huoguo" />,
                elementPath: 'lessons/day12',
                key: 'lessons/day12',
            },

            {
                label: '基础网格材质',
                icon: <MyIcon type="icon-paobing" />,
                elementPath: 'lessons/day13',
                key: 'lessons/day13',
            },

            {
                label: '标准网格材质',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/day14',
                key: 'lessons/day14',
            },

            {
                label: '清除物体',
                icon: <MyIcon type="icon-hebaodan" />,
                elementPath: 'lessons/day15',
                key: 'lessons/day15',
            },
            {
                label: '灯光与阴影',
                icon: <MyIcon type="icon-bangbangtang" />,
                elementPath: 'lessons/day16',
                key: 'lessons/day16',
            },
            
        ],
    },
    {
        label: '案例 / 实操',
        icon: <MyIcon type="icon-anliku" />,
        key: Math.random(),
        children: [
            {
                label: '3D装箱demo',
                icon: <MyIcon type="icon-zhixiang_niupizhixiang-15" />,
                elementPath: '装箱demo',
                key: 'package-preview',
            },
            {
                label: '测试图片标注demo',
                icon: <MyIcon type="icon-feiyuguantou" />,
                elementPath: 'pic-mark',
                key: 'pic-mark',
            },
            {
                label: '测试文本标注demo',
                icon: <MyIcon type="icon-dangaojuan" />,
                elementPath: 'text-mark',
                key: 'text-mark',
            },
            {
                label: '测试纹理demo',
                icon: <MyIcon type="icon-yuzijiang" />,
                elementPath: 'texture-demo',
                key: 'texture-demo',
            },
            {
                label: 'Markdown组件',
                icon: <MyIcon type="icon-kesong" />,
                elementPath: 'markdown',
                key: 'markdown',
            },
            {
                label: '自定义几何体展示',
                icon: <MyIcon type="icon-chengzhi" />,
                elementPath: 'custom-geometry',
                key: 'custom-geometry',
            },
            {
                label: 'emoji表情',
                icon: <MyIcon type="icon-kele" />,
                elementPath: 'emoji表情',
                key: 'emoji',
            }
            
        ],
    },
];

export function RouterCom2() {
    // 固定路由配置
    const FIXED_ROUTE = [
        // 默认路由
        {
            path: '/',
            element: LazyLoad('lessons/day1'),
        },
        {
            path: '/404',
            element: LazyLoad('no-found'),
        },
        // 重定向 404
        {
            path: '*',
            element: <Navigate to="/404" />,
        },
    ];

    // 路由枚举
    const routerPathsEnum = routerPaths.reduce(
        (prev, v) =>
            prev.concat(
                v.children.map((i) => {
                    return { path: i.key, element: LazyLoad(i.elementPath) };
                })
            ),
        []
    );

    return useRoutes([...routerPathsEnum, ...FIXED_ROUTE]);
}
