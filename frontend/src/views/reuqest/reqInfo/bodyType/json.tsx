import { useRequestStore } from "@/store/request"
import Editor from '@/components/jsonEditor/jsonEditor';
import style from './bodyType.module.less'
import { ContentType } from "@/dicts/contentType";
import { useEffect, useState } from "react";
import { SmartHeaders } from "@/dicts/headers";

export const Json = () => {

  const reqStore = useRequestStore()

  const [jsonStr, setJson] = useState('')

  useEffect(() => {

    if (reqStore.currentViewRequest.isBinary || reqStore.currentViewRequest.isFormData) {
      return 
    }

    const currentContentType = reqStore.getHeaderValue(SmartHeaders.ContentType)
   
    if (currentContentType.indexOf(ContentType.Json) > - 1) {
      setJson(reqStore.currentViewRequest.body as string)
    }

  }, [])

  const sync = (newVal: string) => {
    reqStore.setHeader('Content-Type', ContentType.Json)
    reqStore.setBinaryState(false)
    reqStore.setFormDataState(false)
    reqStore.setBody(newVal)
  }

  return (
    <div className={style.editor}>
      <Editor
        height={"400px"}
        onBlur={sync}
        editMode
        json={jsonStr as string}>
      </Editor>
    </div>
  )

}