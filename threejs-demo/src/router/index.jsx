import PackagePreview3D from '../pages/装箱demo';
import ComplexFormily from '../pages/complex-formily';

// import PicMark from '../pages/pic-mark';
// import TextMark from '../pages/text-mark';
// import MarkdownCom from '../pages/markdown';
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
        <React.Suspense fallback={<> 加载中... </>}>
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
                label: 'MeshMatcapMaterial材质（无需灯光）',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/MeshMatcapMaterial',
                key: 'lessons/MeshMatcapMaterial',
            },
            {
                label: 'lamert(朗伯特)网格材质（漫反射）',
                icon: <MyIcon type="icon-paobing" />,
                elementPath: 'lessons/MeshLamertMaterial',
                key: 'lessons/MeshLamertMaterial',
            },
            {
                label: 'MeshPhongMaterial镜面材质',
                icon: <MyIcon type="icon-paobing" />,
                elementPath: 'lessons/MeshPhongMaterial',
                key: 'lessons/MeshPhongMaterial',
            },
            {
                label: '精讲标准网格材质',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/MeshStandardMaterial',
                key: 'lessons/MeshStandardMaterial',
            },
            {
                label: '物理网格材质MeshPhysicalMaterial',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/MeshPhysicalMaterial',
                key: 'lessons/MeshPhysicalMaterial',
            },
            {
                label: '标准网格材质',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/day14',
                key: 'lessons/day14',
            },
            {
                label: 'texture学习',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/texture',
                key: 'lessons/texture',
            },
            {
                label: '加载不同文件类型的纹理',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/other-texture',
                key: 'lessons/other-texture',
            },
            {
                label: '材质的深度相关内容学习depth',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/material_depth',
                key: 'lessons/material_depth',
            },
            {
                label: '材质混合模式详解',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/material_blend',
                key: 'lessons/material_blend',
            },
            {
                label: ' 对平面/物体/场景裁剪',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/裁剪平面、对物体裁剪',
                key: 'lessons/裁剪平面、对物体裁剪',
            },
            {
                label: '模板渲染',
                icon: <MyIcon type="icon-mantou" />,
                elementPath: 'lessons/template-render',
                key: 'lessons/template-render',
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
            {
                label: '粒子/点特效',
                icon: <MyIcon type="icon-fengmi" />,
                elementPath: 'lessons/day17',
                key: 'lessons/day17',
            },
            {
                label: '射线',
                icon: <MyIcon type="icon-shupian" />,
                elementPath: 'lessons/day18',
                key: 'lessons/day18',
            },
            {
                label: 'cannon-es 物理引擎',
                icon: <MyIcon type="icon-haixing" />,
                elementPath: 'lessons/day19',
                key: 'lessons/day19',
            },
            {
                label: '原生Webgl创建物体',
                icon: (
                    <MyIcon type="icon-box-parcel-package-delivery-pack-office-facd" />
                ),
                elementPath: 'lessons/day20',
                key: 'lessons/day20',
            },
            {
                label: '认识着色器',
                icon: <MyIcon type="icon-kele" />,
                elementPath: 'lessons/day21',
                key: 'lessons/day21',
            },
            {
                label: '学习GLSL内置函数',
                icon: <MyIcon type="icon-danta" />,
                elementPath: 'lessons/day22',
                key: 'lessons/day22',
            },
            {
                label: 'gltfloader使用',
                icon: <MyIcon type="icon-kouxiangtang" />,
                elementPath: 'lessons/gltfloader',
                key: 'lessons/gltfloader',
            },

            {
                label: '线性雾、指数雾',
                icon: <MyIcon type="icon-banji" />,
                elementPath: 'lessons/fog',
                key: 'lessons/fog',
            },
            {
                label: 'tween.js补间动画使用',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/tween',
                key: 'lessons/tween',
            },
            {
                label: '理解uv',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/uv',
                key: 'lessons/uv',
            },
            {
                label: '理解法向、法线作用',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/normal-mapping',
                key: 'lessons/normal-mapping',
            },
            {
                label: '几何体顶点转换_顶点位移_旋转_缩放',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/几何体顶点转换_顶点位移_旋转_缩放',
                key: 'lessons/几何体顶点转换_顶点位移_旋转_缩放',
            },
            {
                label: '包围辅助线 框+圆',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/surround',
                key: 'lessons/surround',
            },
            {
                label: '着色器设置点材质',
                icon: <MyIcon type="icon-meishikafei" />,
                elementPath: 'lessons/point-material',
                key: 'lessons/point-material',
            },
            {
                label: 'shader-粒子效果',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/shader-粒子效果',
                key: 'lessons/shader-粒子效果',
            },
            {
                label: '着色器加工材质+阴影补正',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/着色器加工材质',
                key: 'lessons/着色器加工材质',
            },
            {
                label: '后期合成-效果合成器',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: 'lessons/EffectComposer',
                key: 'lessons/EffectComposer',
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
                label: '复杂formily',
                icon: <MyIcon type="icon-danta" />,
                elementPath: 'complex-formily',
                key: 'complex-formily',
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
                elementPath: 'emoji',
                key: 'emoji',
            },
            {
                label: 'svg标注',
                icon: <MyIcon type="icon-bingkuai" />,
                elementPath: 'svg-mark',
                key: 'svg-mark',
            },
            {
                label: '繁星粒子demo',
                icon: <MyIcon type="icon-008-mushroom" />,
                elementPath: 'stellar-particle-demo',
                key: 'stellar-particle-demo',
            },
            {
                label: '下雪demo',
                icon: <MyIcon type="icon-roujiamo" />,
                elementPath: 'snow-demo',
                key: 'snow-demo',
            },
            {
                label: '大语言模型键入demo',
                icon: <MyIcon type="icon-haixing" />,
                elementPath: 'chat-robot',
                key: 'chat-robot',
            },
            {
                label: '银河系demo',
                icon: <MyIcon type="icon-xiezishousi" />,
                elementPath: 'galaxy-demo',
                key: 'galaxy-demo',
            },
            {
                label: '银河系demo（粒子实现）',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: 'galaxy-demo-points',
                key: 'galaxy-demo-points',
            },
            {
                label: '3d滚动页面',
                icon: <MyIcon type="icon-futejia" />,
                elementPath: '3d-scroll-demo',
                key: '3d-scroll-demo',
            },
            {
                label: '点击屏幕创建立方体撞击地面',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: '点击屏幕创建立方体撞击地面',
                key: '点击屏幕创建立方体撞击地面',
            },
            {
                label: 'MeshPhongMaterialdemo',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'MeshPhongMaterialdemo',
                key: 'MeshPhongMaterialdemo',
            },
            {
                label: '标准网格材质泥路',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: '标准网格材质泥路',
                key: '标准网格材质泥路',
            },
            {
                label: '加载three.js editor 编辑后的物理网格材质模型',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'MeshPhysicalMaterial-demo',
                key: 'MeshPhysicalMaterial-demo',
            },
            {
                label: '物理网格材质中自发光贴图（iphone手机模型）',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'MeshPhysicalMaterial-moblie',
                key: 'MeshPhysicalMaterial-moblie',
            },
            {
                label: '使用物理材质加载室内家具',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'MeshPhysicalMaterial-home',
                key: 'MeshPhysicalMaterial-home',
            },
            {
                label: '材质混合实现水杯+果汁+🧊',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'water-cup',
                key: 'water-cup',
            },
            {
                label: '实现金属剖面（运用材质裁剪+模板缓冲）',
                icon: <MyIcon type="icon-050-forest" />,
                elementPath: 'metal-anatomy',
                key: 'metal-anatomy',
            },

            {
                label: '原始着色器RawshaderMaterial纹理贴图Texture',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: '原始着色器RawshaderMaterial纹理贴图Texture',
                key: '原始着色器RawshaderMaterial纹理贴图Texture',
            },
            {
                label: '原始着色器材质生成旋转星星',
                icon: <MyIcon type="icon-xiezishousi" />,
                elementPath: '原始着色器材质生成旋转星星',
                key: '原始着色器材质生成旋转星星',
            },
            {
                label: '孔明灯-原始着色器',
                icon: <MyIcon type="icon-paofu" />,
                elementPath: 'fly-light',
                key: 'fly-light',
            },
            {
                label: '烟雾水云',
                icon: <MyIcon type="icon-tilamisu" />,
                elementPath: 'smoke-water-cloud',
                key: 'smoke-water-cloud',
            },
            {
                label: '官方‘水’模型',
                icon: <MyIcon type="icon-zhutongfan" />,
                elementPath: 'water-model',
                key: 'water-model',
            },
            {
                label: '复习标准网格材质',
                icon: <MyIcon type="icon-nuomici" />,
                elementPath: '复习标准网格材质',
                key: '复习标准网格材质',
            },
            {
                label: '加载glb文件',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: '加载glb文件',
                key: '加载glb文件',
            },
            {
                label: '多模型添加包围框',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: '多模型添加包围框',
                key: '多模型添加包围框',
            },
            {
                label: '给.glb文件添加线框、wrieFrameGeometry、EdgesGeometry',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: 'model-line',
                key: 'model-line',
            },
            {
                label: '烟花🎆（着色器材质+点粒子）',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: 'fireworks',
                key: 'fireworks',
            },
            {
                label: '测试',
                icon: <MyIcon type="icon-zhangyuxiaowanzi" />,
                elementPath: 'test-demo',
                key: 'test-demo',
            },
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
                    return { path: i?.key, element: LazyLoad(i?.elementPath) };
                })
            ),
        []
    );

    return useRoutes([...routerPathsEnum, ...FIXED_ROUTE]);
}
