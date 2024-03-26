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
import InjectVarInput from '@/views/env/injectVarInput';
import { useAutoHeight } from '@/hooks';



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

  const { bindWrapper, height } = useAutoHeight()


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
      reqStore.setContentType(ContentType.FormUrl)
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

  const changevalue = (value: string, key: string, name: string) => {
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: value }))
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
          onInput={(evt) => changevalue((evt.target as HTMLInputElement).value, item.id, 'name')}
          value={item.name}>
        </Input>
      ),
      value: (
        <InjectVarInput
          className={style.input}
          onBlur={generateFormUrl}
          placeholder="Please enter value"
          spellCheck={false}
          onChange={(val) => changevalue(val, item.id, 'value')}
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
  }, [source, reqStore.currentViewRequest?.body])

  return (
    <Table
      scroll={{ y: height }}
      bordered
      pagination={false}
      ref={(el) => {
        bindWrapper(el?.tableRef.current?.rootWrapRef.current)
      }}
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
