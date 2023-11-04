import React, { useEffect, useRef } from 'react';
import ThreePlus from './three/ThreePlus';

export default function ThreeComponent() {
    const containerRef = useRef(null);

    const init = () => {
        const threePlus = new ThreePlus(containerRef.current);

        threePlus.addAxes3DHelper();
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <div id="container" ref={containerRef}></div>
        </>
    );
}
