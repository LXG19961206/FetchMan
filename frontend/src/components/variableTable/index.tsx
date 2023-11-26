import { Input, Table, Button } from '@douyinfe/semi-ui';
import { Colors, createStyle, Cursor, OverFlow, px } from '../../style';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Size } from '../../dicts';
import style from './table.module.css'


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
    width: '35%'
  },
  {
    title: 'Value',
    dataIndex: 'Value',
    width: '35%'
  },
  {
    title: 'Description',
    dataIndex: 'Description',
    width: '20%'
  },
  {
    title: 'Edit',
    dataIndex: 'Edit',
    width: '10%'
  },
];




export default (props: {
  source: Source,
  onChange?: (source: Source) => unknown
}) => {

  const [source, setSource] = useState<Source>([])

  const delRow = (key: string | number) => {
    setSource(source.filter(item => item.key !== key))
  }

  const addRow = () => {
    const key = +new Date()
    setSource([
      ...source, {
        key, Key: '', Value: '', Description: ''
      }
    ])
  }

  const tableSource = useMemo(() => {
    return source.map(item => ({
      key: item.key,
      Key: (
        <Input
          className={style.table_field_input}
          spellCheck={false}
          placeholder="Please enter key"
          onInput={(evt) => item.Key = (evt.target as HTMLInputElement).value}
          defaultValue={item.Key}>
        </Input>
      ),
      Value: (
        <Input
          className={style.table_field_input}
          placeholder="Please enter value"
          spellCheck={false}
          onInput={(evt) => item.Value = (evt.target as HTMLInputElement).value}
          defaultValue={item.Value}>
        </Input>
      ),
      Description: (
        <Input
          className={style.table_field_input}
          placeholder="Please enter Description"
          spellCheck={false}
          onInput={(evt) => item.Description = (evt.target as HTMLInputElement).value}
          defaultValue={item.Description}>
        </Input>
      ),
      Edit: (
        <span
          className={style.table_field_icon}>
          {
            source.length > 1
              ? (
                <IconDelete
                  style={{ color: '#333' }} onClick={delRow.bind(void 0, item.key)}>
                </IconDelete>
              )
              : <IconDelete style={{ color: '#aaa', cursor: 'not-allowed' }}></IconDelete>
          }
        </span>
      )
    }))
  }, [source])

  useEffect(() => {

    if (source.length === 0) {
      addRow()
    }

    Promise.resolve().then(() => {
      props.onChange?.call(void 0, source)
    })

  }, [source])


  return (
    <div className={style.wrapper}>
      <Table
        className={style.table}
        pagination={false}
        size={Size.small}
        sticky
        bordered
        columns={columns}
        dataSource={tableSource}>
      </Table>
      <div
        onClick={addRow}
        className={style.add_action_bar}>
        <IconPlus></IconPlus>
        <span> Add another row </span>
      </div>
    </div>
  )
}

