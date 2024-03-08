import { RenderIf} from "@/components/headerless/renderIf"
import { Match } from '@/components/headerless/match'
import { SmartHeaders } from "@/dicts/headers"
import { useRequestStore } from "@/store/request"
import { Button, Space, Tag } from "@douyinfe/semi-ui"
import { useEffect, useState } from "react"
import { GetFileUrl, NativeFileDialog, GetFilePathPlaceholder } from "~/go/app/App"
import style from './bodyType.module.less'
const getBaseUrlAction = GetFileUrl()
const getPlaceholderAction = GetFilePathPlaceholder()

export default () => {

  const [fileBaseUrl, setBaseUrl] = useState("")

  const [filePathPlaceholder, setPlaceholder] = useState("")


  useEffect(() => {
    
    getBaseUrlAction.then(setBaseUrl)

    getPlaceholderAction.then(setPlaceholder).then(() => {
      if (reqStore.currentViewRequest?.isBinary) {
       setPlaceholder(val => {
        setPath(reqStore.currentViewRequest?.body?.replaceAll(val, "") || "")
        return val
       })
      }
    })
    

  }, [])

  const reqStore = useRequestStore()

  const [path, setPath] = useState("")

  const cancel = () => {
    setPath("")
    reqStore.setBinaryState(false)
    reqStore.setBody(null)
  }

  const upload = () => {
    cancel()
    NativeFileDialog({}, false).then(res => {
      if (!res) return 
      reqStore.setBinaryState(true)
      reqStore.setFormDataState(false)
      reqStore.setHeader(SmartHeaders.ContentType ,res.content_type)
      reqStore.setBody(`${filePathPlaceholder}${res.path}`)
      setPath(res.path)
    })
  }
  
  return (
    <Space vertical align={"start"}>
      <br />
      <RenderIf when={Boolean(path)}>
        <Match>
          <Match.Option when={reqStore.getHeaderValue(SmartHeaders.ContentType).indexOf('image') > -1}>
            <img className={style.type_image} src={fileBaseUrl + (path)} alt="" />
          </Match.Option>
          <Match.Option when={ !!path && reqStore.getBody().indexOf(filePathPlaceholder) > -1}>
            <img className={style.type_image} src={fileBaseUrl + (path)} alt="" />
          </Match.Option>
          <Match.Option when={ !path }>
            <Tag onClose={cancel} closable size={"large"}> {path} </Tag>
          </Match.Option>
        </Match>
      </RenderIf>
      <Button
        onClick={upload}
        type={"primary"}>
        upload
      </Button>
    </Space>
  )
}