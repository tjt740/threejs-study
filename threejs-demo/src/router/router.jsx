import PackagePreview3D from '../pages/装箱demo';
import Demo1Component from '../pages/lessons/day1';
import { FolderOpenOutlined, FileOutlined } from '@ant-design/icons';
import { Route, Routes, Switch } from 'react-router-dom';
import { createFromIconfontCN } from '@ant-design/icons';

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_2112553_dwu0qui8jl7.js', // 在 iconfont.cn 上生成
});

export const routePaths = [
    {
        name: '学习内容',
        icon: <MyIcon type="icon-hamigua" />,
        children: [
            {
                label: 'day-1',
                key: Math.random(),
                path: '/demo',
                exact: false,
                element: <Demo1Component />,
            },
        ],
    },
    {
        name: '案例/实操',
        icon: <MyIcon type="icon-mangguo" />,
        children: [
            {
                label: '盒子装箱demo',
                key: Math.random(),
                path: '/package-preview',
                exact: false,
                element: <PackagePreview3D />,
            },
        ],
    },
];
export function RouterCom() {
    return (
        // Routes 包裹路由匹配的对象
        <Routes>
            {/* <Route
                path="/package-preview"
                exact={false}  // exact:精准匹配，只有路径完全一致才能被匹配到。 如果Route 里不加 exact，那么凡是Link里面 to 的路径包含了/， 那么就会被匹配到，于是Switch就不继续匹配下去
                element={<PackagePreview3D />
                }
            /> */}
            {routePaths.map((v) => {
                v.children.map((item, index) => (
                    <Route
                        path={item.path}
                        exact={item.exact}
                        element={item.element}
                        key={String(index + 1)}
                    />
                ));
            })}
        </Routes>
    );
}
