import React, { useEffect, useState, useRef } from 'react';
import data from '@emoji-mart/data';
import i18n from '@emoji-mart/data/i18n/zh.json';

import Picker from '@emoji-mart/react';
import { Input } from 'antd';
import './index.less';
window.i18n = i18n;
export default function EmojiCom() {
    const [value, setValue] = useState(null);

    useEffect(() => {}, []);

    return (
        <>
            🏪
            <Input value={value} placeholder="请输入内容" />
            <br />
            <Picker
                i18n={i18n}
                data={data}
                locale="zh"
                perLine="8"
                searchPosition="none"
                // previewPosition="none"
                onEmojiSelect={(v) => {
                    console.log(v);
                    setValue(v.native);
                }}
            />
        </>
    );
}
