import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { html } from '@codemirror/legacy-modes/mode/xml';
import { useEffect, useState } from 'react';
import style from './bodyType.module.less'
import { useRequestStore } from '@/store/request';
import { SmartHeaders } from '@/dicts/headers';
import { ContentType } from '@/dicts/contentType';


export default () => {

  const [htmlStr, setHtmlStr] = useState("")

  const reqStore = useRequestStore()

  useEffect(() => {
    if (reqStore.getContentType().indexOf(ContentType.Html) > -1) {
      setHtmlStr(reqStore.currentViewRequest.body as string)
    }
  }, [])

  const sync = () => {
    setHtmlStr(newVal => {
      reqStore.setBody(newVal)
      reqStore.setHeader(
        SmartHeaders.ContentType,
        ContentType.Html
      )
      return newVal
    })  
  }

  return (
      <CodeMirror 
        onBlur={sync}
        className={style.xml}
        onChange={setHtmlStr} 
        value={htmlStr} 
        height="100%" 
        extensions={[StreamLanguage.define(html)]} 
      />
  )
}
