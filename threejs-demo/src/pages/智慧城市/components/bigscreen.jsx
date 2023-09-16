import React, { useState, useEffect } from 'react';
import './bigScreen.css';

// camera+ 场景 + 雷达 + 图标精灵
import * as THREE from 'three';
import camera from './three/camera';
import scene from './three/scene';
import controls from './three/controls';
import Radar from './three/mesh/Radar';
import SpriteMesh from './three/mesh/SpriteMesh';
import gsap from 'gsap';

// 精灵图片地址枚举
const SPRITE_IMG_ENUM = {
    火警: require('../assets/bg/标签_火警.png'),
    治安: require('../assets/bg/警察.png'),
    电力: require('../assets/bg/电力抢修队.png'),
};

export default function BigScreen() {
    const [data, setData] = useState([]);
    const [cityList, setCityList] = useState([]);

    // 获取左边信息
    const queryData = () => {
        fetch('http://127.0.0.1:4523/m1/3305209-0-default/api/smartcity/info', {
            type: 'GET',
        })
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                if (res.message) {
                    setData(Object.values(res.data));
                }
            })
            .catch(() => {
                const res = require('../data/queryData.json');
                setData(Object.values(res.data));
                console.error('请去apifox中查看');
            });
    };

    // 获取右边事件列表
    const queryCityList = () => {
        fetch('http://127.0.0.1:4523/m1/3305209-0-default/api/smartcity/list', {
            type: 'GET',
        })
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                if (res.message) {
                    res.list.forEach((item) => {
                        const {
                            name,
                            type,
                            position: { x, y },
                        } = item;
                        // 创建雷达特效
                        const radar = new Radar();
                        radar.position.set(x / 10, 1, y / 10);
                        scene.add(radar);

                        //  添加精灵图片并加上点击事件 <警告精灵>传参
                        const sprite = new SpriteMesh(
                            new THREE.TextureLoader().load(
                                SPRITE_IMG_ENUM[name]
                            ),
                            new THREE.Vector3(x / 10, 2, y / 10)
                        );
                        // <警告精灵>回调函数
                        sprite.onClick(() => {
                            console.log(type);

                            // 通过gsap控制相机和镜头
                            const position = {
                                x: x / 10,
                                y: 2,
                                z: y / 10,
                            };

                            //⭐️ 更改控制器中心点设置
                            gsap.to(controls.target, {
                                duration: 1,
                                x: position.x,
                                y: position.y,
                                z: position.z,
                            });

                            // 禁止控制控制器
                            controls.enabled = false;

                            // 相机视角移动
                            gsap.to(camera.position, {
                                duration: 4,
                                x: position.x,
                                y: position.y + 3,
                                z: position.z + 7,
                                // 相机视角移动完成后，可以允许控制
                                onComplete: () => {
                                    controls.enabled = true;
                                },
                            });

                            // alert(type);
                        });
                    });

                    // 数据渲染
                    setCityList(res.list);
                }
            })
            .catch(() => {
                console.error('请去apifox中查看');
                const res = require('../data/queryCityList.json');

                res.list.forEach((item) => {
                    const {
                        name,
                        type,
                        position: { x, y },
                    } = item;
                    // 创建雷达特效
                    const radar = new Radar();
                    radar.position.set(x / 10, 1, y / 10);
                    scene.add(radar);

                    //  添加精灵图片并加上点击事件 <警告精灵>传参
                    const sprite = new SpriteMesh(
                        new THREE.TextureLoader().load(SPRITE_IMG_ENUM[name]),
                        new THREE.Vector3(x / 10, 2, y / 10)
                    );
                    // <警告精灵>回调函数
                    sprite.onClick(() => {
                        console.log(type);

                        // 通过gsap控制相机和镜头
                        const position = {
                            x: x / 10,
                            y: 2,
                            z: y / 10,
                        };

                        // 控制器中心点设置
                        gsap.to(controls.target, {
                            duration: 1,
                            x: position.x,
                            y: position.y,
                            z: position.z,
                        });

                        // 禁止控制控制器
                        controls.enabled = false;

                        // 相机视角移动
                        gsap.to(camera.position, {
                            duration: 4,
                            x: position.x,
                            y: position.y + 3,
                            z: position.z + 7,
                            // 相机视角移动完成后，可以允许控制
                            onComplete: () => {
                                controls.enabled = true;
                            },
                        });

                        // alert(type);
                    });
                });

                // 数据渲染
                setCityList(res.list);
            });
    };

    const toFixInt = (num) => {
        return num.toFixed(0);
    };

    useEffect(() => {
        queryData();
        queryCityList();
    }, []);

    return (
        <div id="bigScreen">
            <div className="header">智慧城市管理系统平台</div>
            <div className="main">
                <div className="left">
                    {data.map((item, index) => (
                        <div className="cityEvent" key={index}>
                            <h3>
                                <span>{item.name}</span>
                            </h3>
                            <h1>
                                <img
                                    alt="图片警告"
                                    src={'../assets/bg/bar.svg'}
                                    className="icon"
                                />
                                <span>
                                    {toFixInt(item.number)}（{item.unit}）
                                </span>
                            </h1>
                            <div className="footerBoder"></div>
                        </div>
                    ))}
                </div>
                <div className="right">
                    <div className="cityEvent list">
                        <h3>
                            <span>事件列表</span>
                        </h3>
                        <ul>
                            {cityList.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        console.log(item);
                                        const {
                                            position: { x, y },
                                        } = item;

                                        // 通过gsap控制相机和镜头
                                        const position = {
                                            x: x / 10,
                                            y: 2,
                                            z: y / 10,
                                        };

                                        // 控制器中心点设置
                                        gsap.to(controls.target, {
                                            duration: 1,
                                            x: position.x,
                                            y: position.y,
                                            z: position.z,
                                        });

                                        // 禁止控制控制器
                                        controls.enabled = false;

                                        // 相机视角移动
                                        gsap.to(camera.position, {
                                            duration: 4,
                                            x: position.x,
                                            y: position.y + 3,
                                            z: position.z + 7,
                                            // 相机视角移动完成后，可以允许控制
                                            onComplete: () => {
                                                controls.enabled = true;
                                            },
                                        });
                                    }}
                                >
                                    <h1>
                                        <div>
                                            <img
                                                alt="图片警告"
                                                className="icon"
                                                src={SPRITE_IMG_ENUM[item.name]}
                                            />
                                            <span> {item.name} </span>
                                        </div>
                                        <span className="time">
                                            {item.time}
                                        </span>
                                    </h1>
                                    <p>{item.type}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
