import React, { useEffect, useRef } from 'react';

//* ----s----
/*
* pnpm i @toast-ui/editor
* pnpm i @toast-ui/editor-plugin-chart   <图表>功能组件
* pnpm i @toast-ui/editor-plugin-code-syntax-highlight
* pnpm i @toast-ui/editor-plugin-color-syntax   <文本颜色修改>功能组件 
* pnpm i @toast-ui/editor-plugin-table-merged-cell
* pnpm i @toast-ui/editor-plugin-uml

*/
// Editor 组件
import Editor from '@toast-ui/editor';
// chart 组件
import chart from '@toast-ui/editor-plugin-chart';
// <文本颜色修改>功能组件
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import './editor-plugin-color-syntax.css';
// <代码高亮>功能
import Prism from 'prismjs';
import 'prismjs/components/prism-clojure.js';
import 'prismjs/themes/prism.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// <UML>功能
import uml from '@toast-ui/editor-plugin-uml';
// <table>功能
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';
// 国际化
import '@toast-ui/editor/dist/i18n/zh-cn';
// 样式
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
let editor;
//* ----e----

export default function MarkdownCom() {
    const editorRef = useRef(null);

    // chart 容器宽高设置
    const chartOptions = {
        minWidth: 100,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 300,
    };

    // 自定义工具栏btn
    function createLastButton() {
        const button = document.createElement('button');
        button.className = 'toastui-editor-toolbar-icons last';
        button.style.backgroundImage = 'none';
        button.style.margin = '0';
        button.style.color = 'red';
        button.innerHTML = `<i>B</i>`;
        button.addEventListener('click', () => {
            editor.exec('bold');
        });
        return button;
    }
    // 初始化
    const initEditor = () => {
        Editor.setLanguage('zh-CN', {
            'Add row': '[添加行]',
            'Add col': '[添加列]',
            'Remove row': '[删除行]',
            'Remove col': '[删除列]',
            Align: '[水平方向]',
            'Align left': '[左对齐]',
            'Align right': '[右对齐]',
            'Align center': '[居中对齐]',
            WYSIWYG: 't-所见即所得',
        });
        editor = new Editor({
            el: document.getElementById('editor'), // 确定承载容器DOM
            previewStyle: 'vertical', // tab || vertical 编辑样式，还支持tab切换的形式
            height: '100%', // Markdown 高度'
            // 自定义工具栏
            toolbarItems: [
                // 使用自定义
                [
                    {
                        el: createLastButton(),
                        command: 'bold',
                        tooltip: '自定义加粗',
                    },
                ],
                // 默认自带
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['table', 'image', 'link'],
                ['code', 'codeblock'],
            ],

            //图表
            /* 
            $$chart
            ,category1,category2
            Jan,21,23
            Feb,31,17

            type: column
            title: Monthly Revenue
            x.title: Amount
            y.title: Month
            y.min: 1
            y.max: 40
            y.suffix: $
            $$
            */

            initialValue: `# 谭金涛今天学习了吗`, // 设置默认值
            theme: 'dark', // 暗黑模式
            // viewer: true, // 观察模式
            initialEditType: 'markdown', // wysiwyg || markdown 默认编辑模式（Markdown/ 富文本编辑模式）
            language: 'zh-CN', // 国际化语言
            placeholder: '请输入内容', // placeholder
            // 外链插件 chart 代码高亮 uml
            plugins: [
                [chart, chartOptions],
                colorSyntax,
                [codeSyntaxHighlight, { highlighter: Prism }],
                [uml],
                [tableMergedCell],
            ],
        });

        editor.insertToolbarItem(
            { groupIndex: 0, itemIndex: 0 },
            {
                name: 'myItem',
                tooltip: '艾特谭金涛',
                command: 'bold',
                text: '@',
                className: 'toastui-editor-toolbar-icons first',
                style: { backgroundImage: 'none', color: 'orange' },
            }
        );
    };

    useEffect(() => {
        initEditor();
        window.editor = editor;
        setTimeout(() => {
            // 设置值
            editor.setMarkdown('**学了**');

            const res = {
                "success": true,
                "result": "以下是一个简单的Python代码，用于冒泡排序数据列表：\n```python\ndef bubble_sort(arr): \n    n = len(arr) \n    for i in range(n): \n        for j in range(0, n - i - 1): \n            if arr[j] > arr[j + 1]: \n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n```\n要使用这个函数排序给定列表，只需调用函数并传递列表即可。示例代码如下所示：\n```python\narr = [23, 34, 11, 45, 6, 8, 12, 5, 2, 4]\nsorted_arr = bubble_sort(arr) \nprint(sorted_arr) \n```\n输出结果为：\n```\n[2, 4, 5, 6, 8, 11, 12, 23, 34, 45]\n```"
                
            }
            editor.setMarkdown(res.result);
        }, 3000);

        setTimeout(() => {
            // 获取值
            console.log('值:', editor.getMarkdown(), editor.getHTML());
        }, 5000);

        setTimeout(() => {
            // 清空
            // editor.reset();
        }, 6000);
    }, []);

    return (
        <>
            <div id="editor" ref={editorRef}></div>
        </>
    );
}
