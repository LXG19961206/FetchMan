import { Input, Table } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useState } from 'react';
import { Size } from '@/dicts';
import style from './params.module.less'
import { observer } from 'mobx-react';
import { useRequestStore } from '@/store/request';
import { cloneDeep } from 'lodash'
import { Param } from '@/models/param';
import shortid from 'shortid';



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
    width: 300
  },
  {
    title: 'edit',
    dataIndex: 'edit',
  },
];




export default observer(() => {

  const [source, setSource] = useState<Param[]>([])

  const reqStore = useRequestStore()

  useEffect(() => {

    if (reqStore.params.length) {
      setSource(cloneDeep(reqStore.params))
    }
    

    setTimeout(() => {
      if (!source.length) {
        addRow()
      }
    })
    
  }, [reqStore.params])

  const generateParamsUrl = () => {
    if (!reqStore.currentRequest.url) return 
    const paramsUrl = source
      .filter(item => item.name)
      .reduce((prev, item, i, arr) => prev + `${item.name}=${item.value}${i + 1 !== arr.length ? '&' : ''}`, "")
    const plainUrl = reqStore.currentRequest.url.split('?')[0]
    reqStore.setUrl(
      `${plainUrl}?${paramsUrl}`
    )
  }


  const addRow = () => {
    setSource(prev => {
      return [
        ...prev,
        { id: shortid.generate(), name: '', value: '' }
      ]
    })
  }

  const changevalue = (evt: Event, key: string, name: string) => {
    const input = evt.target as HTMLInputElement
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: input.value }))
  }

  const del = (key: string) => {
    setSource(source.filter(item => item.id !== key))
    setTimeout(() => {
      generateParamsUrl()
    })
  }

  const tableSource = useMemo(() => {
    return source.map((item, i) => ({
      key: item.id,
      name: (
        <Input
          className={style.input}
          spellCheck={false}
          placeholder="Please enter key"
          onInput={(evt) => changevalue(evt as unknown as Event, item.id, 'name')}
          value={item.name}>
        </Input>
      ),
      value: (
        <Input
          className={style.input}
          onBlur={generateParamsUrl}
          placeholder="Please enter value"
          spellCheck={false}
          onInput={(evt) => changevalue(evt as unknown as Event, item.id, 'value')}
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
      scroll={{ y: 400 }}
      bordered
      pagination={false}
      footer={
        <div className={style.footer} onClick={addRow.bind(null)}>
          <IconPlus></IconPlus>
        </div>
      }
      size={Size.small}
      sticky
      columns={columns}
      dataSource={tableSource}>
    </Table>
  )
}
)
