import React, { useMemo, useRef, useState } from 'react';
import { SVG, Rect } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js';
import '@svgdotjs/svg.panzoom.js';
import './index.css';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import AceEditor from 'react-ace';
// 词典模式
import 'ace-builds/src-noconflict/mode-mysql';
import 'brace/mode/mysql';
// 主题
import 'ace-builds/src-noconflict/theme-sqlserver';
import 'ace-builds/src-noconflict/theme-xcode';
// 代码提示
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

export default function SvgMark() {
    const sqlEditor = useRef(null);
    const [basicCompleters, setBasicCompleters] = useState([
        {
            name: 'cnalgo.s_artoo_call_record',
            value: 'cnalgo.s_artoo_call_record',
            score: 100,
            meta: 'sql查询',
        },

        {
            name: 'name',
            value: 'tjt',
            score: 100,
            meta: '手动添加1',
        },
        {
            name: 'name',
            value: 'two',
            score: 100,
            meta: '手动添加2',
        },
        {
            name: 'name',
            value: 'three',
            score: 100,
            meta: '手动添加3',
        },
    ]);
    function onChange(newValue) {
        console.log('change', newValue);
    }

    // 自动完成
    const complete = (editor) => {
        // 向编辑器中添加自动补全列表
        window.editor = editor;
        editor.completers.push({
            getCompletions: function (editor, session, pos, prefix, callback) {
                callback(null, basicCompleters);
            },
        });
    };
    return (
        <div id="svg-container">
            参考github
            <a href="https://github.com/heylight/canvas-select">
                https://github.com/heylight/canvas-select
            </a>
            <Editor
                height="90vh"
                defaultLanguage="javascript"
                defaultValue="// some comment"
            />
            {/* ----react-ace - mysql */}
            pnpm i ace-builds brace react-ace
            <AceEditor
                id="editor"
                ref={sqlEditor}
                aria-label="editor"
                mode="mysql"
                // theme="sqlserver"
                theme="xcode"
                name="editor"
                fontSize={16}
                width="100%"
                height="100%"
                showPrintMargin={false}
                showGutter
                // placeholder="请输入内容"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                }}
                debounceChangePeriod={500}
                readOnly={false}
                tabSize={4}
                //   value={value}
                onChange={onChange}
                showLineNumbers
                onLoad={(editor) => complete(editor)}
            />
        </div>
    );
}
