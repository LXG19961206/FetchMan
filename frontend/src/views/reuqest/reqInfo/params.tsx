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
import InjectVarInput from '@/views/env/injectVarInput';



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
    if (!reqStore.currentViewRequest.url) return 
    const paramsUrl = source
      .filter(item => item.name)
      .reduce((prev, item, i, arr) => prev + `${item.name}=${item.value}${i + 1 !== arr.length ? '&' : ''}`, "")
    const plainUrl = reqStore.currentViewRequest.url.split('?')[0]
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

  const changevalue = (value: string, key: string, name: string) => {
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: value }))
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
          onInput={(evt) => changevalue((evt.target as HTMLInputElement).value as string, item.id, 'name')}
          value={item.name}>
        </Input>
      ),
      value: (
        <InjectVarInput
          onChange={(value) => changevalue(value, item.id, 'value')}
          className={style.input}
          onBlur={generateParamsUrl}
          placeholder="Please enter value"
          spellCheck={false}
          value={item.value}>
        </InjectVarInput>
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
