import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// 导入轨道控制器 只能通过这种方法
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

export default function SmokeWaterCloud() {
    const container = useRef(null);
    return (
        <>
            <div id="container" ref={container}></div>
        </>
    );
}
