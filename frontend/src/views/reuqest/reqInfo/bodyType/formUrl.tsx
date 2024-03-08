import { Input, Table } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useState } from 'react';
import { Size } from '@/dicts';
import style from '../params.module.less'
import { observer } from 'mobx-react';
import { useRequestStore } from '@/store/request';
import { cloneDeep } from 'lodash'
import { Param } from '@/models/param';
import shortid from 'shortid';
import QueryString from 'qs';
import { ContentType } from '@/dicts/contentType';
import { SmartHeaders } from '@/dicts/headers';



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

    if (
      typeof reqStore.currentViewRequest?.body === 'string' &&
      reqStore.currentViewRequest.body.indexOf('=') > -1
    ) {
      try {
        resume()
      } catch (err) {
        console.log(err)
      }
      setTimeout(() => {
        if (!source.length) {
          addRow()
        }
      })
    }

    return () => {
      generateFormUrl()
    }
    
  }, [])

  const resume = () => {
    const formUrl = QueryString.parse(reqStore.currentViewRequest?.body as string)
    const prevSource = Object.entries(formUrl).map(([key, val], idx) => ({
      name: key, value: val as string, id: idx.toString()
    }))
    setSource([...prevSource])
    setTimeout(() => {
      console.log(source)
    })
  }

  const generateFormUrl = () => {
    if (source.length) {
      const formUrl = QueryString.stringify(source.reduce((prev, item) => ({
        ...prev,
        [item.name]: item.value
      }), {}))
      reqStore.setHeader(SmartHeaders.ContentType, ContentType.FormUrl)
      reqStore.setBinaryState(false)
      reqStore.setFormDataState(false)
      reqStore.setBody(formUrl)
    }
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
      generateFormUrl()
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
          onBlur={generateFormUrl}
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
  }, [source, reqStore.currentViewRequest?.body])

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
