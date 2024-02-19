import {Input, Table, Tag } from '@douyinfe/semi-ui';
import {Colors, createStyle, Cursor, OverFlow, percent, px} from '@/style';
import {useContext, useEffect, useMemo, useState} from 'react';
import {Size} from '@/dicts';
import {BodyTypeDict} from "@/dicts/body";
import { IconPaperclip, IconDelete } from '@douyinfe/semi-icons';
import {NativeFileDialog} from "~/go/app/App";
import {paddingX, Reset} from "@/style/common";
import {RenderIf} from "@/components/headerless/renderIf";
import {ReqContext} from "@/context";

export type MulFormSource = {
    Type: string,
    key: number,
    Key: string,
    Value: string,
    Description: string
}[]


const columns = [
    {
        title: 'Key',
        dataIndex: 'Key',
        width: 300
    },
    {
        title: 'Value',
        dataIndex: 'Value',
        width: 300
    },
    {
        title: 'Description',
        dataIndex: 'Description',
        width: 400
    },
    {
        title: 'Edit',
        dataIndex: 'Edit',
    },
];

const style = {
    input: createStyle({
        background: Colors.Transparent,
        color: Colors.ThemeDark,
        fontSize: px(12)
    }),
    icon: createStyle({
        cursor: Cursor.pointer
    }),
    table: createStyle({
        height: px(350),
        overflow: OverFlow.scroll,
        wordBreak: 'break-all'
    }),
    tag: createStyle({
        maxWidth: px(120)
    })
}


export default (props: {
    syncHandler: (sources: MulFormSource) => void,
    getter: MulFormSource
}) => {

    const reqCtx = useContext(ReqContext)

    const [source, setSource] = useState<MulFormSource>([])

    useEffect(() => {
        setSource([
            {key: -1, Key: '', Description: '', Value: '', Type: BodyTypeDict.text },
            ...props.getter,
        ])
    }, [props.getter])

    const addRow = (key: number) => {
        const lastRow = source.slice(-1)[0]
        if (lastRow.key !== key) return
        if ([null, undefined, ''].includes(lastRow.Key as never)) return
        setSource([...source, {
            key: +new Date(), Key: '', Description: '', Value: '', Type: BodyTypeDict.text
        }])
    }

    const changeValue = (evt: Event, key: number, Key: string) => {
        const input = evt.target as HTMLInputElement
        setSource(source.map(item => item.key !== key ? item : {...item, [Key]: input.value}))
    }

    const del = (key: number) => {
        setSource(source.filter(item => item.key !== key))
        syncValueToContext()
    }

    const syncValueToContext = () => {

        reqCtx.setHeaders(
            reqCtx.headers.filter(item => item[0] !== "Content-Type")
        )

        props.syncHandler(source)
    }

    const upload = async (item: MulFormSource[0]) => {
        await NativeFileDialog({}, true).then(res => {
            setSource([
                ...source.filter(row => row.key !== item.key),
                { ...item, Type: BodyTypeDict.binary, Value: res.Path }
            ])
        })
    }

    const cancel = (item: MulFormSource[0]) => {
        setSource([
            ...source.filter(row => row.key !== item.key),
            { ...item, Type: BodyTypeDict.text, Value: "" }
        ])
    }

    const tableSource = useMemo(() => {
        return source.map(item => ({
            key: item.key,
            Key: (
                <Input
                    spellCheck={false}
                    style={style.input}
                    onBlur={addRow.bind(void 0, item.key)}
                    placeholder="Please enter key"
                    onInput={(evt) => changeValue(evt as unknown as Event, item.key, 'Key')}
                    value={item.Key}>
                </Input>
            ),
            Value: (
                <RenderIf
                    fallback={
                        <Tag
                            size={"small"}
                            style={style.tag}
                            onClose={ () => cancel(item)} closable>
                            { item.Value }
                        </Tag>
                    }
                    when={item.Type === BodyTypeDict.text}>
                    {
                        <Input
                            spellCheck={false}
                            style={style.input}
                            suffix={
                                <IconPaperclip style={style.icon} onClick={ () => upload(item) }></IconPaperclip>
                            }
                            onBlur={ syncValueToContext }
                            placeholder="Please enter value"
                            onInput={(evt) => changeValue(evt as unknown as Event, item.key, 'Value')}
                            value={item.Value}>
                        </Input>
                    }
                </RenderIf>

            ),
            Description: (
                <Input
                    spellCheck={false}
                    onBlur={syncValueToContext}
                    style={style.input}
                    placeholder="Please enter Description"
                    onInput={(evt) => changeValue(evt as unknown as Event, item.key, 'Description')}
                    value={item.Description}>
                </Input>
            ),
            Edit: (
                <span>
                    <IconDelete
                        onClick={del.bind(null, item.key)}>
                    </IconDelete>
                </span>
            )
        }))
    }, [source])

    return (
        <Table
            style={style.table}
            bordered
            pagination={false}
            size={Size.small}
            sticky
            columns={columns}
            dataSource={tableSource}>
        </Table>
    )
}



