import {Input, Table} from '@douyinfe/semi-ui';
import {Colors, createStyle, Cursor, OverFlow, px} from '@/style';
import {IconDelete} from '@douyinfe/semi-icons';
import {useContext, useEffect, useMemo, useState} from 'react';
import {Size} from '@/dicts';


export type Source = {
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
        overflow: OverFlow.scroll
    })
}


export default (props: {
    syncHandler: (sources: Source) => void,
    getter: Source
}) => {

    const [source, setSource] = useState<Source>([])

    useEffect(() => {
        setSource([
            ...props.getter,
            {key: -1, Key: '', Description: '', Value: ''}
        ])
    }, [props.getter])

    const addRow = (key: number) => {
        const lastRow = source.slice(-1)[0]
        if (lastRow.key !== key) return
        if ([null, undefined, ''].includes(lastRow.Key as never)) return
        setSource([...source, {
            key: key + 1, Key: '', Description: '', Value: ''
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
        props.syncHandler(source)
    }

    const tableSource = useMemo(() => {
        return source.map(item => ({
            key: item.key,
            Key: (
                <Input
                    style={style.input}
                    onBlur={addRow.bind(void 0, item.key)}
                    spellCheck={false}
                    placeholder="Please enter key"
                    onInput={(evt) => changeValue(evt as unknown as Event, item.key, 'Key')}
                    value={item.Key}>
                </Input>
            ),
            Value: (
                <Input
                    style={style.input}
                    onBlur={syncValueToContext}
                    placeholder="Please enter value"
                    spellCheck={false}
                    onInput={(evt) => changeValue(evt as unknown as Event, item.key, 'Value')}
                    value={item.Value}>
                </Input>
            ),
            Description: (
                <Input
                    style={style.input}
                    placeholder="Please enter Description"
                    spellCheck={false}
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

