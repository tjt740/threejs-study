import React, { useState, useRef } from 'react';
import { Button, Input, message } from 'antd';
import { createFromIconfontCN, PoweroffOutlined } from '@ant-design/icons';
import cNames from 'classnames';
import 'github-markdown-css/github-markdown.css';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './index.css';

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3790510_qx17ke68n38.js', // 在 iconfont.cn 上生成
});

marked.use(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    })
);

marked.setOptions({
    silent: true,
    highlight(code) {
        return hljs.highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
});

export default function ChatRobot() {
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recordList, setRecordList] = useState([]);
    const [pageKey, setPageKey] = useState(Math.random());

    const getContent = (params) => {
        setIsLoading(true);
        let res = {
            success: true,
            errorCode: null,
            errorMessage: null,
            detailMsg: null,
            data: "[普通链接](https://www.wdphp.com/)\n[![](https://img.alicdn.com/imgextra/i3/O1CN01EP1LAL1buxMwswYz8_!!6000000003526-2-tps-96-96.png)]\n| 项目        | 价格   |  数量  |\n| --------   | -----:  | :----:  |\n| 计算机      | $1600   |   5     |\n| 手机        |   $12   |   12   |\n| 管线        |    $1    |  234  |  \n```javascript\nfunction formatetime(datetime) {\n  const date = datetime.split(' ');\n  const year = date[0].split('年');\n  const month = date[1].split(月份);\n  const day = date[2].split('日');\n  const hours = +date[3]? date[3].split(小时 : [])[0]: [0];\n  const minutes = +date[4]? date[4].split(分钟 : [])[0]: [0];\n  const seconds = +date[5]? date[5].split(秒 : [])[0]: [0];\n  const ampm = date[6];\n  const hh = Math.floor(Math.floor(Math.floor(hours)) / 12); // 转化为小时\n  const mm = Math.floor(Math.floor(Math.floor(minutes) / 60) % 12); // 转化为分钟\n  constss = seconds % 60;  // 将秒转化为小数并保留一位小数\n  const string = year[0]? year[0] +'' + month[0] +'' + day[0] +'' + ampm +'' + hh + ':' + mm + ':' + '0' + '0'+ '0' + '' + string: '?';\n  return string;\n}\nconsole.log(formattime(new Date()));\n```\n这个函数会用split()方法把日期从字符串转换为date对象，然后根据日期对象创建一个字符串来表示日期。最后把日期字符串格式化输出。\n1.以下是一个简单的Python代码，用于冒泡排序数据列表：\n```python\ndef bubble_sort(arr): \n    n = len(arr) \n    for i in range(n): \n        for j in range(0, n - i - 1): \n            if arr[j] > arr[j + 1]: \n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n```\n要使用这个函数排序给定列表，只需调用函数并传递列表即可。示例代码如下所示：\n```python\narr = [23, 34, 11, 45, 6, 8, 12, 5, 2, 4]\nsorted_arr = bubble_sort(arr) \nprint(sorted_arr) \n```\n输出结果为：\n```\n[2, 4, 5, 6, 8, 11, 12, 23, 34, 45]\n```\n好的，我可以帮你列出一个规划列表。以下是一些例子，根据你的需求，你可以根据自己的情况进行修改：\n\n规划列表：\n\n1. 计划未来5年的职业规划\n- 目标：成为某个领域的专家\n- 解决方案：学习新技能、参加相关培训、寻找实习或工作，参加行业协会或社交活动等\n- 风险：需要付出大量时间和精力，而且职业规划需要不断调整和发展，需要不断尝试和实践\n\n2. 计划未来1年的时间管理\n- 目标：更好地利用时间，提高工作效率\n- 解决方案：制定日程表、优先处理重要任务、避免无效会议和社交活动等\n- 风险：需要时刻保持专注和高效，否则会影响工作和生活质量\n\n3. 计划未来2年的投资计划\n- 目标：增加投资收益\n- 解决方案：分散投资、寻找优质投资机会、控制风险等\n- 风险：需要考虑投资周期和风险承受能力，否则会影响长期投资收益\n\n希望这些例子可以帮助你更好地规划和管理你的工作和生活！",
        };
        setRecordList([
            ...recordList,
            {
                content: res.data,
                question: params,
            },
        ]);
        setTimeout(() => {
            const resDataSplit = res.data.split('');
            const arr = [];
            let flag = -1;
            function sum() {
                if (flag < resDataSplit.length) {
                    flag++;

                    arr.push(resDataSplit[flag]);
                    document.getElementById(
                        `editor${recordList.length}`
                    ).innerHTML = marked.parse(arr.join(''));
                } else {
                    return false;
                }
                setTimeout(sum, 10);
            }

            sum();

            setIsLoading(false);
            inputRef.current.input.value = '';
            inputRef.current.input.defaultValue = '';
            setPageKey(Math.random());
        });
    };

    return (
        <div
            className="chat-robot"
            style={{
                overflow: 'auto',
            }}
        >
            <div className="chat-robot-container">
                {recordList.length
                    ? recordList.map((item, index) => (
                          <div className="chat-robot-box" key={index}>
                              {item?.question?.query ? (
                                  <div className="chat-robot-desc-box">
                                      <div className="prompt-box-desc">
                                          <span>{item?.question?.query}</span>
                                      </div>
                                  </div>
                              ) : null}
                              <div className="flex-container">
                                  <div className="chat-box-wrap">
                                      <div className="chat-box-contents">
                                          <div
                                              className={cNames(
                                                  'chat-box-contents-inner-box-example',
                                                  {
                                                      hidden: item?.content,
                                                  }
                                              )}
                                          ></div>
                                          <div
                                              className="chat-box-contents-inner-box-text markdown-body"
                                              id={'editor' + index}
                                          ></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))
                    : null}
            </div>
            <div>
                <div className="prompt-input-wrap">
                    <div className="prompt-input-logo-list">
                        <Input
                            key={pageKey}
                            ref={inputRef}
                            id="content"
                            placeholder="请输入内容"
                            bordered={false}
                            allowClear
                            onPressEnter={(e) => {
                                const inputValue = e.target?.value;
                                if (inputValue) {
                                    const params = {
                                        query: inputValue,
                                    };

                                    getContent(params);
                                    return;
                                }
                                message.warning('请输入内容');
                            }}
                        />
                        <div className="confirm">
                            {!isLoading ? (
                                <MyIcon
                                    onClick={() => {
                                        const inputValue =
                                            inputRef?.current?.input?.value;

                                        if (inputValue) {
                                            const params = {
                                                query: inputValue,
                                            };

                                            getContent(params);
                                            return;
                                        }
                                        message.warning('请输入内容');
                                    }}
                                    style={{
                                        fontSize: '24px',
                                        transform: 'scale(1.5)',
                                    }}
                                    type="icon-feiji"
                                />
                            ) : (
                                <Button
                                    type="link"
                                    className="loading-btn"
                                    icon={<PoweroffOutlined />}
                                    loading
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
