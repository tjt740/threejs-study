import React, { useRef, useState, useEffect } from 'react';
import { Button, Collapse, Divider, Input, Tag, Tooltip } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
    BetaSchemaForm, // schema表单
    ProFormDependency, // 联动表单
    ProCard,
    ProForm,
    ProFormGroup,
    ProFormList,
    ProFormText,
    ProFormCheckbox,
    ProFormTextArea,
    ProFormSelect,
    ProFormRadio,
} from '@ant-design/pro-components';
import * as _ from 'lodash';
import { schema } from './schema';

import './index.less';

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ps: input 类型
const InputType = () => {
    return (
        <>
            <Divider>基础设置</Divider>
            <ProFormGroup>
                <ProFormText
                    width="sm"
                    name="name"
                    label="显示名称"
                    placeholder="请输入显示名称"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                console.log(value);
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('名称内容不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormText
                    width="sm"
                    name="code"
                    label="code"
                    placeholder="请输入code"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                console.log(value);
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('code不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormRadio.Group
                    name="isRequired"
                    label="是否必填"
                    required
                    initialValue={'0'}
                    options={[
                        {
                            label: '非必填',
                            value: '0',
                        },
                        {
                            label: '必填',
                            value: '1',
                        },
                    ]}
                />
            </ProFormGroup>
            <Divider>默认值设置</Divider>
            <ProFormSelect
                initialValue={'aaa'}
                options={[
                    {
                        label: '无',
                        value: 'aaa',
                    },
                    {
                        label: '自定义',
                        value: 'bbb',
                    },
                ]}
                width="xs"
                name="inputDefaultType"
                label="默认值类型"
            />
            <ProFormDependency name={['inputDefaultType']}>
                {({ inputDefaultType }) => {
                    if (inputDefaultType === 'bbb') {
                        return (
                            <ProFormText
                                // width="xl"
                                name="valueText"
                                label="默认值"
                                placeholder="请输入默认值"
                                className="tjt"
                                rules={[
                                    {
                                        required: true,
                                        validator: async (_, value) => {
                                            if (value && value.length > 0) {
                                                return;
                                            }
                                            throw new Error('默认值不能为空！');
                                        },
                                    },
                                ]}
                            />
                        );
                    }
                    // 默认方式
                    return null;
                }}
            </ProFormDependency>
        </>
    );
};

// ps: checkbox 类型
const CheckboxType = () => {
    // checkbox默认值列表
    const newCheckboxList = [];
    const [checkboxList, setCheckboxList] = useState(() => {
        return newCheckboxList;
    });
    const [addBtnDisabled, setAddBtnDisabled] = useState(true);
    const generatenewCheckboxList = (v, i) => {
        newCheckboxList[i] = {
            value: v,
            label: v,
            key: uuid(),
        };
    };

    return (
        <>
            <Divider>基础设置</Divider>
            <ProFormGroup>
                <ProFormText
                    width="sm"
                    name="name"
                    label="显示名称"
                    placeholder="请输入显示名称"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('名称内容不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormText
                    width="sm"
                    name="code"
                    label="code"
                    placeholder="请输入code"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('code不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormRadio.Group
                    name="isRequired"
                    label="是否必填"
                    required
                    initialValue={'0'}
                    options={[
                        {
                            label: '非必填',
                            value: '0',
                        },
                        {
                            label: '必填',
                            value: '1',
                        },
                    ]}
                />
            </ProFormGroup>
            <Divider>选项设置</Divider>
            <ProFormSelect
                initialValue={'auto'}
                options={[
                    {
                        label: '来自接口',
                        value: 'xxx',
                    },
                    {
                        label: '自定义',
                        value: 'auto',
                    },
                ]}
                width="xs"
                name="selectType"
                label="选项类型"
            />
            <ProFormDependency name={['selectType']}>
                {({ selectType }) => {
                    if (selectType === 'auto') {
                        return (
                            <>
                                <ProForm.Item
                                    isListField
                                    style={{ marginBlockEnd: 0 }}
                                    label="选项内容"
                                >
                                    <ProFormList
                                        name="items"
                                        className="radio-box"
                                        initialValue={[{ name: '' }]}
                                        creatorButtonProps={{
                                            disabled: addBtnDisabled,
                                            creatorButtonText: '添加/修改选项',
                                            icon: <EditOutlined />,
                                            type: 'link',
                                            style: { width: 'unset' },
                                        }}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                // 第一次空值
                                                if (!checkboxList.length) {
                                                    const arr = [];
                                                    arr.push({
                                                        label: e.target.value,
                                                        value: e.target.value,
                                                        key: uuid(),
                                                    });
                                                    setAddBtnDisabled(false);
                                                    return;
                                                } else {
                                                    setAddBtnDisabled(false);
                                                }
                                                return;
                                            }

                                            setCheckboxList(
                                                newCheckboxList.filter(
                                                    (item) =>
                                                        item.value !== undefined
                                                )
                                            );
                                            setAddBtnDisabled(true);
                                        }}
                                        onAfterAdd={(_, insertIndex) => {
                                            setAddBtnDisabled(true);
                                            setCheckboxList(newCheckboxList);
                                        }}
                                        onAfterRemove={(index) => {
                                            newCheckboxList.splice(index, 1);
                                            if (!newCheckboxList.length) {
                                                setAddBtnDisabled(false);
                                            }
                                            setCheckboxList(newCheckboxList);
                                        }}
                                        copyIconProps={false}
                                        deleteIconProps={{
                                            tooltipText: '删除选项内容',
                                        }}
                                        itemRender={(
                                            { listDom, action },
                                            // 获取新知
                                            { index, record: { name } }
                                        ) => (
                                            <div
                                                style={{
                                                    display: 'inline-flex',
                                                    marginInlineEnd: 24,
                                                }}
                                            >
                                                {/* tjt: 生成新数组 */}
                                                {generatenewCheckboxList(
                                                    name,
                                                    index
                                                )}
                                                {listDom}
                                                {action}
                                            </div>
                                        )}
                                    >
                                        <ProFormText
                                            allowClear={false}
                                            width="xs"
                                            placeholder="请输入"
                                            name={['name']}
                                        />
                                    </ProFormList>
                                </ProForm.Item>
                            </>
                        );
                    }
                    // 默认方式
                    return null;
                }}
            </ProFormDependency>
            <Divider>默认值设置</Divider>
            <ProFormSelect
                initialValue={'bbb'}
                options={[
                    {
                        label: '无',
                        value: 'aaa',
                    },
                    {
                        label: '自定义',
                        value: 'bbb',
                    },
                ]}
                width="xs"
                name="checkboxDefaultType"
                label="默认值类型"
            />
            <ProFormDependency name={['checkboxDefaultType']}>
                {({ checkboxDefaultType }) => {
                    if (checkboxDefaultType === 'bbb') {
                        return checkboxList[0]?.value ? (
                            <ProFormCheckbox.Group
                                name="checkbox-hello"
                                rules={[
                                    {
                                        required: true,
                                        validator: async (_, value) => {
                                            if (value && value.length > 0) {
                                                return;
                                            }
                                            throw new Error(
                                                '默认选项不能为空！'
                                            );
                                        },
                                    },
                                ]}
                                label="默认值"
                                options={checkboxList}
                            />
                        ) : (
                            <ProFormText name="hello" label="默认值" readonly />
                        );
                    }
                    // 默认方式
                    return null;
                }}
            </ProFormDependency>
        </>
    );
};

// ps: select 类型
const SelectType = () => {
    return <>1</>;
};
// ps: radio 类型
const RadioType = () => {
    // radio默认值列表
    const newRadioList = [];
    const [radioList, setRadioList] = useState(() => {
        return newRadioList;
    });
    const [addBtnDisabled, setAddBtnDisabled] = useState(true);
    const generateNewRadioList = (v, i) => {
        newRadioList[i] = {
            value: v,
            label: v,
            key: uuid(),
        };
    };

    return (
        <>
            <Divider>基础设置</Divider>
            <ProFormGroup>
                <ProFormText
                    width="sm"
                    name="name"
                    label="显示名称"
                    placeholder="请输入显示名称"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('名称内容不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormText
                    width="sm"
                    name="code"
                    label="code"
                    placeholder="请输入code"
                    rules={[
                        {
                            required: true,
                            validator: async (_, value) => {
                                if (value && value.length > 0) {
                                    return;
                                }
                                throw new Error('code不能为空！');
                            },
                        },
                    ]}
                />
                <ProFormRadio.Group
                    name="isRequired"
                    label="是否必填"
                    required
                    initialValue={'0'}
                    options={[
                        {
                            label: '非必填',
                            value: '0',
                        },
                        {
                            label: '必填',
                            value: '1',
                        },
                    ]}
                />
            </ProFormGroup>
            <Divider>选项设置</Divider>
            <ProFormSelect
                initialValue={'auto'}
                options={[
                    {
                        label: '来自接口',
                        value: 'xxx',
                    },
                    {
                        label: '自定义',
                        value: 'auto',
                    },
                ]}
                width="xs"
                name="selectType"
                label="选项类型"
            />
            <ProFormDependency name={['selectType']}>
                {({ selectType }) => {
                    if (selectType === 'auto') {
                        return (
                            <>
                                <ProForm.Item
                                    isListField
                                    style={{ marginBlockEnd: 0 }}
                                    label="选项内容"
                                >
                                    <ProFormList
                                        name="items"
                                        className="radio-box"
                                        initialValue={[{ name: '' }]}
                                        creatorButtonProps={{
                                            disabled: addBtnDisabled,
                                            creatorButtonText: '添加/修改选项',
                                            icon: <EditOutlined />,
                                            type: 'link',
                                            style: { width: 'unset' },
                                        }}
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                // 第一次空值
                                                if (!radioList.length) {
                                                    const arr = [];
                                                    arr.push({
                                                        label: e.target.value,
                                                        value: e.target.value,
                                                        key: uuid(),
                                                    });
                                                    setAddBtnDisabled(false);
                                                    return;
                                                } else {
                                                    setAddBtnDisabled(false);
                                                }
                                                return;
                                            }

                                            setRadioList(
                                                newRadioList.filter(
                                                    (item) =>
                                                        item.value !== undefined
                                                )
                                            );
                                            setAddBtnDisabled(true);
                                        }}
                                        onAfterAdd={(_, insertIndex) => {
                                            setAddBtnDisabled(true);
                                            setRadioList(newRadioList);
                                        }}
                                        onAfterRemove={(index) => {
                                            newRadioList.splice(index, 1);
                                            if (!newRadioList.length) {
                                                setAddBtnDisabled(false);
                                            }
                                            setRadioList(newRadioList);
                                        }}
                                        copyIconProps={false}
                                        deleteIconProps={{
                                            tooltipText: '删除选项内容',
                                        }}
                                        itemRender={(
                                            { listDom, action },
                                            // 获取新知
                                            { index, record: { name } }
                                        ) => (
                                            <div
                                                style={{
                                                    display: 'inline-flex',
                                                    marginInlineEnd: 24,
                                                }}
                                            >
                                                {/* tjt: 生成新数组 */}
                                                {generateNewRadioList(
                                                    name,
                                                    index
                                                )}
                                                {listDom}
                                                {action}
                                            </div>
                                        )}
                                    >
                                        <ProFormText
                                            allowClear={false}
                                            width="xs"
                                            placeholder="请输入"
                                            name={['name']}
                                        />
                                    </ProFormList>
                                </ProForm.Item>
                            </>
                        );
                    }
                    // 默认方式
                    return null;
                }}
            </ProFormDependency>
            <Divider>默认值设置</Divider>
            <ProFormSelect
                initialValue={'bbb'}
                options={[
                    {
                        label: '无',
                        value: 'aaa',
                    },
                    {
                        label: '自定义',
                        value: 'bbb',
                    },
                ]}
                width="xs"
                name="radioDefaultType"
                label="默认值类型"
            />
            <ProFormDependency name={['radioDefaultType']}>
                {({ radioDefaultType }) => {
                    if (radioDefaultType === 'bbb') {
                        return radioList[0]?.value ? (
                            <ProFormRadio.Group
                                name="hello"
                                rules={[
                                    {
                                        required: true,
                                        validator: async (_, value) => {
                                            if (value && value.length > 0) {
                                                return;
                                            }
                                            throw new Error(
                                                '默认选项不能为空！'
                                            );
                                        },
                                    },
                                ]}
                                label="默认值"
                                options={radioList}
                            />
                        ) : (
                            <ProFormText name="hello" label="默认值" readonly />
                        );
                    }
                    // 默认方式
                    return null;
                }}
            </ProFormDependency>
        </>
    );
};

const { Panel } = Collapse;
// 类型枚举
const PRO_FORM_DEPENDENCY_ENUM = {
    input: <InputType />,
    radio: <RadioType />,
    checkbox: <CheckboxType />,
};
export default function ComplexFormily() {
    const formRef = useRef(null);
    const [tagContext, setTagContext] = useState([]);
    // 组件类型
    const selectOptions = [
        {
            value: 'select',
            text: '下拉单选', // tag文案
            label: '选择框',
            isOpen: false,
        },
        {
            value: 'input',
            text: '文本输入',
            label: '输入框',
            isOpen: false,
        },
        {
            value: 'radio',
            text: '单选',
            label: '单选框',
            isOpen: false,
        },
        {
            value: 'checkbox',
            text: '多选',
            label: '多选框',
            isOpen: false,
        },
    ];
    const [pageKey, setPageKey] = useState(Math.random());
    const [addKey, setAddKey] = useState(Math.random());
    window.formRef = formRef;

    const actionRef = useRef();

    return (
        <div className="workspace-config-container">
            <div className="table-exhibition">
                <div className="form-container">
                    {/* <BetaSchemaForm
                    shouldUpdate={false}
                    layoutType="Form"
                    onFinish={async (values) => {
                    console.log(values);
                    }}
                    columns={schema(itemRenderProps)}
                /> */}
                    <Collapse defaultActiveKey={['a']} collapsible="disabled">
                        <Panel
                            header="【单选】是否有效"
                            key="a"
                            showArrow={false}
                            extra={
                                <>
                                    <Button
                                        type="dashed"
                                        // tjt:控制 disabled
                                        disabled={
                                            actionRef.current?.getList()?.length
                                                ? !actionRef.current
                                                      ?.getList()
                                                      ?.at(-1)['useMode']
                                                : false
                                        }
                                        key={addKey}
                                        onClick={() => {
                                            actionRef.current?.add({
                                                useMode: null,
                                            });

                                            setAddKey(Math.random());
                                        }}
                                    >
                                        <PlusOutlined /> 增加子问题
                                    </Button>
                                </>
                            }
                        >
                            <ProForm
                                layout="horizontal"
                                formRef={formRef}
                                onFinish={async (e) => {
                                    formRef.current
                                        .validateFields()
                                        .then((res) => {
                                            console.log(res);
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }}
                                onReset={() => {
                                    setAddKey(Math.random());
                                }}
                                initialValues={{
                                    radioA: 'a',
                                    children: [
                                        {
                                            useMode: 'radio',
                                            isRequired: '0',
                                            selectType: 'auto',
                                            items: [
                                                {
                                                    name: '1',
                                                },
                                                {
                                                    name: '2',
                                                },
                                                {
                                                    name: '3',
                                                },
                                                {
                                                    name: '4',
                                                },
                                                {
                                                    name: '5',
                                                },
                                            ],
                                            radioDefaultType: 'bbb',
                                            name: '单选',
                                            undefined: '5',
                                            hello: '1',
                                            code: 'radio111',
                                        },
                                        {
                                            useMode: 'checkbox',
                                            isRequired: '0',
                                            selectType: 'auto',
                                            items: [
                                                {
                                                    name: 'a',
                                                },
                                                {
                                                    name: 'b',
                                                },
                                                {
                                                    name: 'c',
                                                },
                                                {
                                                    name: 'd',
                                                },
                                                {
                                                    name: 'e',
                                                },
                                            ],
                                            checkboxDefaultType: 'bbb',
                                            name: '多选',
                                            undefined: 'e',
                                            'checkbox-hello': ['a', 'c', 'e'],
                                            code: 'checkbox111',
                                        },
                                        {
                                            useMode: 'radio',
                                            isRequired: '0',
                                            selectType: 'auto',
                                            items: [
                                                {
                                                    name: '5',
                                                },
                                                {
                                                    name: '4',
                                                },
                                                {
                                                    name: '3',
                                                },
                                                {
                                                    name: '2',
                                                },
                                                {
                                                    name: '1',
                                                },
                                            ],
                                            radioDefaultType: 'bbb',
                                            undefined: '1',
                                            hello: '5',
                                            code: 'radio222',
                                            name: '11111',
                                        },
                                        {
                                            useMode: 'checkbox',
                                            isRequired: '0',
                                            selectType: 'auto',
                                            items: [
                                                {
                                                    name: 'b',
                                                },
                                                {
                                                    name: 'c',
                                                },
                                                {
                                                    name: 'd',
                                                },
                                                {
                                                    name: 'a',
                                                },
                                            ],
                                            checkboxDefaultType: 'bbb',
                                            name: '2',
                                            undefined: 'a',
                                            'checkbox-hello': ['b', 'd', 'a'],
                                            code: 'checkbox22',
                                        },
                                    ],
                                }}
                                onValuesChange={(form, values) => {
                                    // console.log(form, values, tagContext);
                                }}
                            >
                                <ProFormRadio.Group
                                    name="radioA"
                                    options={[
                                        {
                                            label: '有效',
                                            value: 'a',
                                        },
                                        {
                                            label: '无效',
                                            value: 'b',
                                        },
                                    ]}
                                />
                                <ProFormList
                                    name="children"
                                    label=""
                                    min={1}
                                    copyIconProps={false} // 显隐copy图标
                                    actionRef={actionRef}
                                    key={pageKey}
                                    itemRender={(
                                        { listDom, action },
                                        { index }
                                    ) => {
                                        return (
                                            <ProCard
                                                key={index}
                                                extra={action}
                                                style={{ marginBlockEnd: 8 }}
                                            >
                                                <Collapse
                                                    // 控制显隐记录
                                                    defaultActiveKey={
                                                        tagContext[index]
                                                            ?.text &&
                                                        tagContext[index]
                                                            ?.isOpen
                                                            ? [index]
                                                            : null
                                                    }
                                                    onChange={(key) => {
                                                        // 控制显隐折叠
                                                        if (!key.length) {
                                                            tagContext.at(
                                                                index
                                                            ).isOpen = false;
                                                            setTagContext([
                                                                ...tagContext,
                                                            ]);
                                                            return;
                                                        }

                                                        tagContext.at(
                                                            index
                                                        ).isOpen = true;
                                                        setTagContext([
                                                            ...tagContext,
                                                        ]);
                                                    }}
                                                    style={{ marginBottom: 16 }}
                                                    // collapsible={
                                                    //     tagContext[index]?.text
                                                    //         ? 'header'
                                                    //         : 'disabled'
                                                    // }
                                                >
                                                    <Panel
                                                        header={
                                                            <Tag>
                                                                {tagContext.length
                                                                    ? tagContext[
                                                                          index
                                                                      ]?.text
                                                                    : null}
                                                            </Tag>
                                                        }
                                                        key={index}
                                                        extra={
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'flex-end',
                                                                }}
                                                            >
                                                                <ProFormSelect
                                                                    placeholder="请选择类型"
                                                                    options={
                                                                        selectOptions
                                                                    }
                                                                    width="sm"
                                                                    // tjt:
                                                                    name="useMode"
                                                                    label="组件类型"
                                                                    onChange={(
                                                                        value,
                                                                        form
                                                                    ) => {
                                                                        const {
                                                                            text,
                                                                        } =
                                                                            form;

                                                                        tagContext[
                                                                            index
                                                                        ] = {
                                                                            index,
                                                                            text,
                                                                            isOpen: true,
                                                                        };
                                                                        setTagContext(
                                                                            [
                                                                                ...tagContext,
                                                                            ]
                                                                        );

                                                                        setPageKey(
                                                                            Math.random()
                                                                        );
                                                                    }}
                                                                />
                                                                {/* <Button
                                                                    style={{
                                                                        marginLeft: 12,
                                                                    }}
                                                                    type="dashed"
                                                                    // tjt:控制 disabled
                                                                    disabled={
                                                                        actionRef.current?.getList()
                                                                            ?.length
                                                                            ? !actionRef.current
                                                                                  ?.getList()
                                                                                  ?.at(
                                                                                      -1
                                                                                  )[
                                                                                  'useMode'
                                                                              ]
                                                                            : false
                                                                    }
                                                                    key={addKey}
                                                                    onClick={() => {
                                                                        actionRef.current?.add(
                                                                            {
                                                                                useMode:
                                                                                    null,
                                                                            }
                                                                        );
                                                                        setAddKey(
                                                                            Math.random()
                                                                        );
                                                                    }}
                                                                >
                                                                    <PlusOutlined />{' '}
                                                                    增加子问题
                                                                </Button> */}
                                                            </div>
                                                        }
                                                    >
                                                        {listDom}
                                                    </Panel>
                                                </Collapse>
                                            </ProCard>
                                        );
                                    }}
                                    creatorButtonProps={false}
                                    onAfterAdd={(
                                        defaultValue,
                                        insertIndex,
                                        count
                                    ) => {
                                        console.log(
                                            defaultValue,
                                            insertIndex,
                                            count
                                        );
                                    }}
                                    onAfterRemove={(i) => {
                                        const _cloneTagContext = _.cloneDeep([
                                            ...tagContext,
                                        ]);
                                        _cloneTagContext.splice(i, 1);
                                        setTagContext(_cloneTagContext);
                                    }}
                                    alwaysShowItemLabel={false}
                                >
                                    {/* // tjt: */}
                                    <ProFormDependency name={['useMode']}>
                                        {({ useMode }) => {
                                            return (
                                                <div className="tjt">
                                                    {
                                                        PRO_FORM_DEPENDENCY_ENUM[
                                                            useMode
                                                        ]
                                                    }
                                                </div>
                                            );
                                        }}
                                    </ProFormDependency>
                                </ProFormList>
                            </ProForm>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </div>
    );
}
