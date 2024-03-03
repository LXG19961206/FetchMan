import { useRequestStore } from "@/store/request"
import Editor from '@/components/jsonEditor/jsonEditor';
import style from './bodyType.module.less'
import { ContentType } from "@/dicts/contentType";

export const Json = () => {

  const reqStore = useRequestStore()

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
        json={reqStore.currentRequest.body as string}>
      </Editor>
    </div>
  )

}