import { Input, Table, Tag } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus, IconPaperclip } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useState } from 'react';
import { Size } from '@/dicts';
import style from '../params.module.less'
import { observer } from 'mobx-react';
import { useRequestStore } from '@/store/request';
import shortid from 'shortid';
import { FormDataItem } from '@/models/formData';
import { NativeFileDialog, GetFilePathPlaceholder } from '~/go/app/App';
import { RenderIf } from '@/components/headerless/renderIf';

const getPlaceholderAction = GetFilePathPlaceholder()



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

  const [source, setSource] = useState<FormDataItem[]>([])

  const [filePlaceholder, setPlaceholder] = useState("")

  const reqStore = useRequestStore()

  useEffect(() => {
    getPlaceholderAction.then(setPlaceholder)
    resume()
  }, [])

  const resume = () => {

    try {

      if (
        reqStore.currentViewRequest.isFormData && reqStore.currentViewRequest.body) {
        setSource(JSON.parse(reqStore.currentViewRequest.body as string) as FormDataItem[])
      }

      setTimeout(() => {
        if (!source.length) {
          addRow()
        }
      })

    } catch {
      addRow()
    }

  }

  const cancel = (item: FormDataItem) => {
    setSource(prev => (
      prev.map(formItem => formItem === item ? {
        ...formItem,
        filePath: '',
        value: '',
        isFile: false,
      } : formItem)
    ))
    sync()
  }

  const upload = (item: FormDataItem) => {
    NativeFileDialog({}, false).then(res => {
      setSource(prev => (
        prev.map(formItem => formItem === item ? {
          ...formItem,
          filePath: filePlaceholder + res.path,
          value: res.path,
          isFile: true,
        } : formItem)
      ))
      sync()
    })
  }

  const sync = () => {
    reqStore.setBinaryState(false)
    reqStore.setFormDataState(true)
    setTimeout(() => {
      setSource((prev) => {
        reqStore.setBody(JSON.stringify(prev))
        return prev
      }) 
    })    
  }

  const addRow = () => {
    setSource(prev => {
      return [
        ...prev, { id: shortid.generate(), name: '', value: '', isFile: false, filePath: "" }
      ]
    })
    sync()
  }

  const changevalue = (evt: Event, key: string, name: string) => {
    const input = evt.target as HTMLInputElement
    setSource(source.map(item => item.id !== key ? item : { ...item, [name]: input.value }))
  }

  const del = (key: string) => {
    setSource(source.filter(item => item.id !== key))
    sync()
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
        <RenderIf
          fallback={
            <Tag
              className={style.tag}
              size={"small"}
              onClose={() => cancel(item)}
              closable>
              {item.value}
            </Tag>
          }
          when={!item.isFile}>
          <Input
            spellCheck={false}
            className={style.input}
            suffix={
              <IconPaperclip
                className={style.icon}
                onClick={() => upload(item)}>
              </IconPaperclip>
            }
            onBlur={sync}
            placeholder="Please enter value"
            onInput={(evt) => changevalue(evt as unknown as Event, item.id, 'value')}
            value={item.value}>
          </Input>
        </RenderIf>
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
  }, [source, reqStore.currentViewRequest.body])

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
