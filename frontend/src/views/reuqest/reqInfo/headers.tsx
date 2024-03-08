import { Input, Table, AutoComplete } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useState } from 'react';
import { Size } from '@/dicts';
import style from './params.module.less'
import { observer } from 'mobx-react';
import { useRequestStore } from '@/store/request';
import shortid from 'shortid';
import { Header } from '@/models/headers';
import { SmartHeaders } from '@/dicts/headers';

const smartHeaderList = Object.values(SmartHeaders)

export type Source = {
  key: number,
  name: string,
  value: string,
}[]

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: 300
  },
  {
    title: 'value',
    dataIndex: 'value',
  },
  {
    title: 'edit',
    dataIndex: 'edit',
    width: 120
  },
];




export default observer(() => {

  const [source, setSource] = useState<Header[]>([])

  const reqStore = useRequestStore()

  useEffect(() => {

    if (Object.values(reqStore.currentViewRequest?.headers || {}).length > 0) {
      const source = Object.entries(reqStore.currentViewRequest?.headers!)
        .map(([key, val], i) => ({
          name: key,
          value: val,
          id: i.toString()
        })
      )
      setSource(source)
    }

  }, [reqStore.currentViewRequest?.headers, reqStore.currentViewRequest?.body])

  const updateHeader = () => {
    source.forEach(item => {
      reqStore.setHeader(item.name, item.value)
    })
  }


  const addRow = () => {
    setSource(prev => {
      return [
        ...prev,
        { id: shortid.generate(), name: '', value: '' }
      ]
    })
  }

  const changeValue = (evt: Event, key: string, name: string) => {
    const input = evt.target as HTMLInputElement
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: input.value }))
  }

  const autoCompleteChange = (val: string, key: string, name: string) => {
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: val }))
  }

  const del = (key: string) => {
    setSource(source.filter(item => item.id !== key))
    setTimeout(() => {
    })
  }

  const tableSource = useMemo(() => {
    return source.map((item, i) => ({
      key: item.id,
      name: (
        <AutoComplete
          className={style.input}
          onChange={(val: string | number) => autoCompleteChange(val as string, item.id, 'name')}
          placeholder='Please enter key'
          data={smartHeaderList}
          value={item.name}>
        </AutoComplete>
      ),
      value: (
        <Input
          className={style.input}
          onBlur={updateHeader}
          placeholder="Please enter value"
          spellCheck={false}
          onInput={(evt) => changeValue(evt as unknown as Event, item.id, 'value')}
          value={item.value}>
        </Input>
      ),

      edit: (
        <span
          className={style.operate_icon}>
          <IconDelete
            color='lightblue'
            onClick={del.bind(null, item.id)}>
          </IconDelete>
        </span>
      )
    }))
  }, [source])

  return (
    <Table
      className={style.table}
      bordered
      scroll={{ y: 400 }}
      pagination={false}
      size={Size.small}
      footer={
        <div className={style.footer} onClick={addRow.bind(null)}>
          <IconPlus></IconPlus>
        </div>
      }
      sticky
      columns={columns}
      dataSource={tableSource}>
    </Table>
  )
}
)
