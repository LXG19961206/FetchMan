import { useRequestStore } from '@/store/request'
import { TextArea } from '@douyinfe/semi-ui'
import { useEffect, useState } from 'react'
import style from './bodyType.module.less'
import { ContentType } from '@/dicts/contentType'
import { SmartHeaders } from '@/dicts/headers'

export default () => {

  const [text, setText] = useState('')
  const reqStore = useRequestStore()

  const sync = () => {
    reqStore.setBody(text)
    reqStore.setBinaryState(false)
    reqStore.setFormDataState(false)
    reqStore.setHeader(SmartHeaders.ContentType, ContentType.Text)
  }

  return (
    <div
      className={style.plain_text_area}>
      <TextArea
        onBlur={sync}
        placeholder='please enter plain text...'
        value={text} onChange={setText}>
      </TextArea>
    </div>
  )
}