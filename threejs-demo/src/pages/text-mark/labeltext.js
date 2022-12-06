/* eslint-disable no-unused-expressions */
/* eslint-disable no-loop-func */

// todo:  切换颜色
export const LabelText = (function () {
    let _self;
    let _el;
    let initText;
    let mouseDataIndex = 0;
    let fixedTextStackLen = 0;
    let deleteRecord = [];
    function LabelText(opt) {
        _el = opt.el;
        _self = this;
        this.config = Object.assign({}, this.default, opt);
        this.textStack = [];
        this.letters = []; // 存放被选中的文字内容
        selectText();
    }

    LabelText.prototype = {
        addText(htmlStr) {
            // 清空已有的标记内容
            clean();
            _el.innerHTML = htmlStr;
            initText = htmlStr;
        },
        output() {
            if (window._self.letters.length) {
                _self = window._self;
            }
            return _self.letters;
        },
        // 删除选中
        deleteLabel(value) {
            if (window._self.letters.length && window._self.textStack.length) {
                _self = window._self;
                const deleteIndex = _self.letters.findIndex(
                    (item) => item.dataIndex === mouseDataIndex
                );

                let deleteSpanValue = 0;
                _el.style.cssText = `pointer-events: inherit;`;
                const deleteValue = _self.letters[deleteIndex];

                _el.innerHTML = _self.textStack.at(-1);

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
                _self.textStack.splice(deleteIndex, 1);
                document.getElementById('select-modal').style.display = 'none';
                mouseDataIndex = 0;
                window.setModalSelectContent(null);
            }
        },
    };

    function selectText() {
        const selObj = window.getSelection();
        const range = document.createRange();

        _el.onmouseup = function (e) {
            if (e.target.classList.contains('text-selected')) {
                console.log('在相同位置划线');
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
                        maxDataIndex.push(element.getAttribute('data-index'));

                        if (
                            span.getAttribute('data-index') ===
                            maxDataIndex.reduce((a, b) => (a > b ? a : b)[0])
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
        document.getElementById('select-modal').style.cssText = `display:block`;
        document.getElementById(
            'select-modal'
        ).style.cssText = `display:block;top: ${e.offsetY + 120}px;left: ${
            e.offsetX
        }px`;
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
        mouseDataIndex = 0;
        document.getElementById('select-modal').style.display = 'none';
        window._self = _self;
    }
    window.repeal = repeal;

    // 全清
    function clean() {
        _el.innerHTML = initText;
        _self.textStack = [];
        _self.letters = [];
        deleteRecord = [];
        initText;
        mouseDataIndex = 0;
        fixedTextStackLen = 0;
        _el.style.cssText = `pointer-events: inherit;`;
        document.getElementById('select-modal').style.display = 'none';
    }
    window.clean = clean;

    // 创建span
    function createSpan(index) {
        const spanEle = document.createElement('span');
        spanEle.className = 'text-selected';
        spanEle.setAttribute('data-index', index);
        spanEle.style.backgroundColor = 'rgba(24, 144, 255,0.5)';
        return spanEle;
    }

    function selectLabel(value) {
        const ts = document.getElementsByClassName('text-selected');
        // 修改路线
        if (mouseDataIndex) {
            console.log('修改路线');
            _self = window._self;
            const changeIndex = Array.from(ts).findIndex(
                (item) =>
                    item.getAttribute('data-index') === String(mouseDataIndex)
            );
            ts[changeIndex].setAttribute('data-attr', value);
            // 改变伪类颜色
            ts[changeIndex].style.setProperty('--select-color', value);
            const lettersAndTextStacksIndex = _self.letters.findIndex(
                (item) => item.dataIndex === mouseDataIndex
            );
            _self.letters[lettersAndTextStacksIndex].tag = value;
            _self.textStack[lettersAndTextStacksIndex] = _el.innerHTML;
            _el.style.cssText = `pointer-events: inherit;`;
            mouseDataIndex = document.getElementById(
                'select-modal'
            ).style.display = 'none';
            window.setModalSelectContent(null);
            mouseDataIndex = 0;
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
            mouseDataIndex = 0;
        }
        // 正常添加
        const addIndex = Array.from(ts).findIndex(
            (item) =>
                item.getAttribute('data-index') === String(fixedTextStackLen)
        );
        ts[addIndex].setAttribute('data-attr', value);
        ts[addIndex].style.backgroundColor = 'transparent';
        // 改变伪类颜色
        ts[addIndex].style.setProperty('--select-color', value);
        _self.letters[ts.length - 1 > 0 ? ts.length - 1 : 0].tag = value;
        _self.textStack[ts.length - 1 > 0 ? ts.length - 1 : 0] = _el.innerHTML;
        _el.style.cssText = `pointer-events: inherit;`;
        document.getElementById('select-modal').style.display = 'none';
        window.setModalSelectContent(null);
        mouseDataIndex = 0;
        window._self = _self;
    }
    window.selectLabel = selectLabel;

    return LabelText;
})();
