/* eslint-disable no-loop-func */
let fixedTextStackLen = 0;
export const Labeltxt = (function () {
    let _self;
    let _el;
    let initText;
    let mouseDataIndex = 0;
    let deleteRecord = [];
    let deleteList = [];
    class Labeltxt {
        constructor(opt) {
            _el = opt.el;
            _self = this;
            this.config = Object.assign({}, this.default, opt);
            this.color = 'rgb(207, 232, 198)';
            this.textStack = [];
            this.letters = []; // 存放被选中的文字内容
            selectText();
        }
        addText(htmlStr) {
            // 清空已有的标记内容
            // clean();
            _el.innerHTML = htmlStr;
            _self.textStack.push(htmlStr);
            initText = htmlStr;
        }
        output() {
            if (window._self.letters.length) {
                _self = window._self;
            }
            return _self.letters;
        }
        setInitValue(initValue) {
            clean();
            fixedTextStackLen = window.numFlag2;

            const maxInitValueDataIndex = Number(
                initValue.reduce((a, b) =>
                    Number(a.dataIndex) > Number(b.dataIndex) ? a : b
                ).dataIndex
            );

            fixedTextStackLen = maxInitValueDataIndex;
            window.numFlag2 = fixedTextStackLen;

            deleteList = initValue;
            window._self = {
                color: 'rgb(20: 232, 198)',
                textStack: [],
                letters: [],
            };
            const mockData = _el.innerText.trim().split('');
            let sumNumber = 0;
            initValue = initValue.sort(
                (a, b) =>
                    JSON.parse(a.feature).start - JSON.parse(b.feature).start
            );
            initValue.forEach((item) => {
                window._self.letters.push({
                    // str: item.sourceContent,
                    str: JSON.parse(item.feature).content,
                    tag: item.labelKey,
                    id: item.id,
                    dataIndex: item.dataIndex,
                    startIndex: JSON.parse(item.feature).start,
                    endIndex: JSON.parse(item.feature).end,
                });

                const { color, sourceContent, labelName, dataIndex, feature } =
                    item;
                const { start, end, content } = JSON.parse(item.feature);
                const replaceStr = `<span class="text-selected" data-index=${dataIndex} style="background-color: transparent; --primaryColor:${
                    color === '#ffffff' ? '#e5e7eb' : color
                }" data-attr=${labelName}>${content}</span>`;
                let signIndex = end - start;
                mockData
                    .splice(start - sumNumber, signIndex + 1, replaceStr)
                    .join('');
                sumNumber += signIndex;
            });
            _el.innerHTML = mockData.join('');
        }
        // 删除选中
        deleteLabel(value) {
            if (window._self.letters.length) {
                _self = window._self;

                const deleteIndex = _self.letters.findIndex(
                    (item) => item.dataIndex === mouseDataIndex
                );
                let deleteSpanValue = 0;
                _el.style.cssText = `pointer-events: inherit;`;
                const deleteValue = _self.letters[deleteIndex];
                for (
                    let i = 0;
                    i < _el.children.length === 1 ? 2 : _el.children.length;
                    i++
                ) {
                    if (
                        _el.children[i].getAttribute('data-index') ===
                        mouseDataIndex
                    ) {
                        deleteSpanValue = i;
                        deleteRecord.push({
                            idx: deleteSpanValue,
                            deleteStr: deleteValue.str,
                            prevMouseDataIndex: mouseDataIndex,
                        });
                        break;
                    }
                }
                // 彻底清除记录
                for (let o = 0; o < deleteRecord.length; o++) {
                    const elChildrenIndex = Array.from(_el.children).findIndex(
                        (item) =>
                            item.getAttribute('data-index') ===
                            deleteRecord[o].prevMouseDataIndex
                    );
                    if (elChildrenIndex > -1) {
                        const outerText =
                            _el.children[elChildrenIndex].outerText;
                        _el.children[elChildrenIndex].replaceWith(outerText);
                    }
                }
                _self.letters.splice(deleteIndex, 1);
                fixedTextStackLen++;

                document.getElementById('select-modal').style.display = 'none';
                window.deleteSequenceLabeling({
                    id: deleteList[deleteIndex].id,
                });
                window.setModalSelectContent(null);
            }
        }
    }

    function selectText() {
        const selObj = window.getSelection();
        const range = document.createRange();

        _el.onmouseup = function (e) {
            if (e.target.classList.contains('text-selected')) {
                mouseDataIndex = e.target.getAttribute('data-index');
                openModal(e, e.target.getAttribute('data-attr'));
                return;
            }
            const acrossText = selObj.toString();
            if (
                selObj.anchorNode === selObj.focusNode &&
                selObj.anchorOffset !== selObj.focusOffset
            ) {
                if (window._self) {
                    _self = window._self;
                }
                _el.style.cssText = `pointer-events: none;`;
                fixedTextStackLen++;

                const span = createSpan(fixedTextStackLen);

                // 从前往后
                if (selObj.anchorOffset < selObj.focusOffset) {
                    range.setStart(selObj.anchorNode, selObj.anchorOffset);
                    range.setEnd(selObj.anchorNode, selObj.focusOffset);
                } else {
                    // 从后往前
                    range.setStart(selObj.anchorNode, selObj.focusOffset);
                    range.setEnd(selObj.anchorNode, selObj.anchorOffset);
                }
                range.surroundContents(span);
                // 确定 startIndex / endIndex (★ 核心)
                const maxDataIndex = [];
                let startIndex = 0;
                let endIndex = 0;

                for (
                    let i = 0;
                    i <
                    Array.from(
                        document.getElementsByClassName('content-container')[0]
                            .childNodes
                    ).length;
                    i++
                ) {
                    const element =
                        document.getElementsByClassName('content-container')[0]
                            .childNodes[i];

                    if (element?.innerText) {
                        maxDataIndex.push(
                            Number(element.getAttribute('data-index'))
                        );
                        if (
                            span.getAttribute('data-index') ===
                            String(
                                maxDataIndex.reduce((a, b) => (a > b ? a : b))
                            )
                        ) {
                            const index = i || 1;
                            for (let k = 0; k < index; k++) {
                                startIndex +=
                                    document.getElementsByClassName(
                                        'content-container'
                                    )[0].childNodes[k].length ||
                                    document.getElementsByClassName(
                                        'content-container'
                                    )[0].childNodes[k].innerText?.length ||
                                    0;
                                endIndex +=
                                    document.getElementsByClassName(
                                        'content-container'
                                    )[0].childNodes[k].length ||
                                    document.getElementsByClassName(
                                        'content-container'
                                    )[0].childNodes[k].innerText?.length ||
                                    0;
                            }
                            endIndex +=
                                document.getElementsByClassName(
                                    'content-container'
                                )[0].childNodes[index].length ||
                                document.getElementsByClassName(
                                    'content-container'
                                )[0].childNodes[index].innerText.length - 1;
                            break;
                        }
                    }
                }

                _self.letters.push({
                    str: acrossText,
                    tag: null,
                    dataIndex: span.getAttribute('data-index'),
                    startIndex,
                    endIndex,
                });
                _self.textStack.push(_el.innerHTML);
                openModal(e);
            }
        };
    }

    // 打开弹窗
    function openModal(e, selectValue) {
        if (selectValue) {
            window.setModalSelectContent([selectValue]);
        }
        selectLabel({
            label: '表情1',
            value: 'code1',
            color: 'red',
        });
        // document.getElementById('select-modal').style.cssText = `display:block`;
        // document.getElementById(
        //     'select-modal'
        // ).style.cssText = `display:block;top: ${
        //     e.offsetY +
        //     Number(
        //         window
        //             .getComputedStyle(document.getElementById('select-modal'))
        //             .height.split('px')[0]
        //     ) /
        //         1.5 +
        //     10
        // }px;left: ${e.offsetX}px`;
    }

    // 回退
    function repeal() {
        if (_self.textStack.length !== window._self.textStack.length) {
            _self = window._self;
        }
        if (!_self.textStack.length) {
            return;
        }
        if (_self.textStack.length === 1) {
            _el.innerHTML = initText;
            _self.letters = [];
            _self.textStack = [];
            _el.style.cssText = `pointer-events: inherit;`;
            document.getElementById('select-modal').style.display = 'none';
            return;
        }
        _self.letters.pop();
        _self.textStack.pop();
        _el.style.cssText = `pointer-events: inherit;`;
        _el.innerHTML = _self.textStack[_self.textStack.length - 1];
        document.getElementById('select-modal').style.display = 'none';
        window._self = _self;
    }
    window.repeal = repeal;

    // 全清
    function clean() {
        _el.innerHTML = initText;
        _self.textStack = [];
        _self.letters = [];
        deleteList = [];
        deleteRecord = [];
        initText = '';
        mouseDataIndex = 0;
        _el.style.cssText = `pointer-events: inherit;`;
        document.getElementById('select-modal').style.display = 'none';
    }
    window.clean = clean;

    // 创建span
    function createSpan(index) {
        const spanEle = document.createElement('span');
        spanEle.className = 'text-selected';
        spanEle.setAttribute('data-index', index);
        spanEle.style.backgroundColor = _self.color;
        return spanEle;
    }

    // 选中下拉
    function selectLabel(v) {
        const { label, value, color } = v;
        const ts = document.getElementsByClassName('text-selected');
        // 修改路线
        if (!_self.letters.length && !_self.textStack.length) {
            _self = window._self;
            const changeIndex = Array.from(ts).findIndex(
                (item) =>
                    item.getAttribute('data-index') === String(mouseDataIndex)
            );
            ts[changeIndex].setAttribute('data-attr', label);
            const lettersAndTextStacksIndex = _self.letters.findIndex(
                (item) => item.dataIndex === mouseDataIndex
            );
            // 修改样式
            document
                .getElementsByClassName('text-selected')
                [changeIndex].style.setProperty(
                    '--primaryColor',
                    color === '#ffffff' ? '#e5e7eb' : color
                );

            _self.letters[lettersAndTextStacksIndex].tag = value;
            _self.textStack[lettersAndTextStacksIndex] = _el.innerHTML;
            _el.style.cssText = `pointer-events: inherit;`;
            document.getElementById('select-modal').style.display = 'none';
            window.setModalSelectContent(null);
            const { dataIndex, str, startIndex, endIndex } =
                _self.letters[lettersAndTextStacksIndex];
            window.sequenceLabeling({
                labelKey: value,
                color,
                id: deleteList[changeIndex].id,
                dataIndex, // 传给后端后端吐给我
                sourceContent: _el.innerText,
                feature: JSON.stringify({
                    start: startIndex,
                    end: endIndex,
                    content: str,
                }),
            });
            window._self = _self;
            return;
        }

        // 修改select内容
        if (
            window?._self &&
            window?._self?.letters?.length !== _self?.letters?.length
        ) {
            _self = {
                ..._self,
                letters: [...window._self.letters, ..._self.letters],
                textStack: [...window._self.textStack, ..._self.textStack],
            };
        }
        // 正常添加
        const addIndex = Array.from(ts).findIndex(
            (item) =>
                item.getAttribute('data-index') === String(fixedTextStackLen)
        );
        ts[addIndex].setAttribute('data-attr', label);

        // 修改伪类样式
        document
            .getElementsByClassName('text-selected')
            [addIndex].style.setProperty(
                '--primaryColor',
                color === '#ffffff' ? '#e5e7eb' : color
            );
        document.getElementsByClassName('text-selected')[
            addIndex
        ].style.backgroundColor = 'transparent';
        _self.letters[ts.length - 1 > 0 ? ts.length - 1 : 0].tag = value;
        _self.textStack[ts.length - 1 > 0 ? ts.length - 1 : 0] = _el.innerHTML;
        _el.style.cssText = `pointer-events: inherit;`;
        // document.getElementById('select-modal').style.display = 'none';
        const { str, startIndex, endIndex, dataIndex } = _self.letters.at(-1);
        // window.sequenceLabeling({
        //     labelKey: value,
        //     color,
        //     dataIndex, // 传给后端后端吐给我
        //     sourceContent: _el.innerText,
        //     feature: JSON.stringify({
        //         start: startIndex,
        //         end: endIndex,
        //         content: str,
        //     }),
        // });
        // window.setModalSelectContent(null);
        // window._self = _self;
    }
    window.selectLabel = selectLabel;

    return Labeltxt;
})();
