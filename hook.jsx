import React, { useState, useMemo, useSyncExternalStore } from 'react';

export function useQueryData() {
    const [data, setData] = useState(null);
    const getData = async () => {
        const response = await fetch(`http://geek.itheima.net/v1_0/channels`, {
            method: 'GET',
        });
        const res = await response.json();
        console.log('数据:', res);
        setData(res.message);
    };
    return [data, getData];
}

export function useInnerWidth() {
    // 保持 subscribe 固定引用，避免 resize 监听器重复执行
    const [subscribe, getSnapshot] = useMemo(() => {
        return [
            (notify) => {
                // 真实情况这里会用到节流
                window.addEventListener('resize', notify);
                return () => {
                    window.removeEventListener('resize', notify);
                };
            },
            // 返回 resize 后需要的快照
            () => window.innerWidth,
        ];
    }, []);
    return useSyncExternalStore(subscribe, getSnapshot);
}
