import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { xml } from '@codemirror/legacy-modes/mode/xml';
import { useEffect, useState } from 'react';
import style from './bodyType.module.less'
import { useRequestStore } from '@/store/request';
import { SmartHeaders } from '@/dicts/headers';
import { ContentType } from '@/dicts/contentType';


export default () => {

  const [xmlStr, setXmlStr] = useState("")

  const reqStore = useRequestStore()

  useEffect(() => {
    if (reqStore.getContentType().indexOf('xml') > -1) {
      setXmlStr(reqStore.currentViewRequest.body as string)
    }
  }, [])

  const sync = () => {
    setXmlStr(newVal => {
      reqStore.setBody(newVal)
      reqStore.setContentType(
        ContentType.ApplicaitonXml
      )
      return newVal
    })  
  }

  return (
      <CodeMirror 
        onBlur={sync}
        className={style.xml}
        onChange={setXmlStr} 
        value={xmlStr} 
        height="100%" 
        extensions={[StreamLanguage.define(xml)]} 
      />
  )
}
