import React, { useEffect, useState } from 'react';
// 容器承载容器
import Scene from './components/scene';
// 大屏
import BigScreen from './components/bigscreen';

export default function ThreeComponent() {
    return (
        <>
            {/* 容器承载容器 */}
            <Scene></Scene>
            {/* 大屏 */}
            <BigScreen />
        </>
    );
}
