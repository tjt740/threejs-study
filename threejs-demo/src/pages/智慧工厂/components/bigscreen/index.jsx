import React from 'react';
// import { wallGroup, floor1Group, floor2Group } from '../../mesh/init-model';
import './index.css';
import gsap from '../../three/gsap';

export default function BigScreen() {
    let floorCount = 0;
    return (
        <div id="bigScreen">
            <div className="header">智慧工厂系统平台</div>
            <div className="main">
                {/* <div className="left">
                    <div className="cityEvent">
                        <h1
                            onClick={() => {
                                wallGroup.visible = true;

                                floor1Group.visible = false;
                                floor2Group.visible = false;
                            }}
                        >
                            <span>仅展示厂房外形</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1
                            onClick={() => {
                                wallGroup.visible = true;
                                floor1Group.visible = true;
                                floor2Group.visible = true;

                                if (!floorCount) {
                                    gsap.to(wallGroup.position, {
                                        y: 100,
                                        duration: 1,
                                        repeat: 0,
                                        onComplete: () => {
                                            floorCount++;
                                        },
                                    });
                                }
                                console.log(floorCount);

                                if (floorCount === 1) {
                                    gsap.to(floor2Group.position, {
                                        y: 100,
                                        duration: 1,
                                        repeat: 0,
                                        onComplete: () => {
                                            floorCount++;
                                        },
                                    });
                                }

                                if (floorCount === 2) {
                                    gsap.to(floor1Group.position, {
                                        y: 100,
                                        duration: 1,
                                        repeat: 0,
                                        onComplete: () => {
                                            floorCount++;
                                        },
                                    });
                                }
                            }}
                        >
                            <span>厂房分层展开</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1
                            onClick={() => {
                                wallGroup.visible = true;
                                floor1Group.visible = true;
                                floor2Group.visible = true;

                                gsap.to(wallGroup.position, {
                                    y: 0,
                                    duration: 1,
                                    repeat: 0,
                                });

                                gsap.to(floor2Group.position, {
                                    y: 0,
                                    duration: 1,
                                    repeat: 0,
                                });

                                gsap.to(floor1Group.position, {
                                    y: 0,
                                    duration: 1,
                                    repeat: 0,
                                });

                                floorCount = 0;
                            }}
                        >
                            <span>厂房复原</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1
                            onClick={() => {
                                floor2Group.visible = true;

                                wallGroup.visible = false;
                                floor1Group.visible = false;
                            }}
                        >
                            <span>仅展示第2层</span>
                        </h1>
                    </div>
                    <div
                        className="cityEvent"
                        onClick={() => {
                            floor1Group.visible = true;

                            wallGroup.visible = false;
                            floor2Group.visible = false;
                        }}
                    >
                        <h1>
                            <span>仅展示第1层</span>
                        </h1>
                    </div>
                </div> */}
                <div className="right">
                    <div className="cityEvent">
                        <h1>
                            <span>展开飞机</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1>
                            <span>恢复飞机</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1>
                            <span>粒子特效</span>
                        </h1>
                    </div>
                    <div className="cityEvent">
                        <h1>
                            <span>粒子爆炸</span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
