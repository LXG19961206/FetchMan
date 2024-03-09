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

    if (!reqStore.currentViewRequest) return 

    if (reqStore.currentViewRequest.isFormData) {
      return 
    }

    const maybeJson = reqStore.currentViewRequest.body as string

    const currentContentType = reqStore.getHeaderValue(SmartHeaders.ContentType)

    console.log(maybeJson, currentContentType)
   
    if (currentContentType && currentContentType.indexOf(ContentType.Json) > - 1) {
      setJson(maybeJson)
    }

  }, [reqStore.currentViewRequest.body])

  const sync = (newVal: string) => {
    reqStore.setHeader('Content-Type', ContentType.Json)
    reqStore.setBinaryState(false)
    reqStore.setFormDataState(false)
    reqStore.setBody(JSON.stringify(newVal))
  }

  return (
    <div className={style.editor}>
      <Editor
        height={"400px"}
        onChange={sync}
        editMode
        json={jsonStr as string}>
      </Editor>
    </div>
  )

}