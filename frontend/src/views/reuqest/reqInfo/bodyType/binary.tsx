import { RenderIf } from "@/components/headerless/renderIf"
import { SmartHeaders } from "@/dicts/headers"
import { useRequestStore } from "@/store/request"
import { Button, Space, Tag } from "@douyinfe/semi-ui"
import { useEffect, useState } from "react"
import { GetFileUrl, NativeFileDialog, GetFilePathPlaceholder } from "~/go/app/App"

const getBaseUrlAction = GetFileUrl()
const getPlaceholderAction = GetFilePathPlaceholder()

export default () => {

  const [fileBaseUrl, setBaseUrl] = useState("")

  const [filePathPlaceholder, setPlaceholder] = useState("")


  useEffect(() => {
    
    getBaseUrlAction.then(setBaseUrl)
    getPlaceholderAction.then(setPlaceholder).then(() => {
      if (reqStore.currentViewRequest.isBinary) {
       setPlaceholder(val => {
        setPath(reqStore.currentViewRequest.body?.replaceAll(val, "") || "")
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
      <RenderIf when={!!path && reqStore.getHeaderValue(SmartHeaders.ContentType).indexOf('image') > -1}>
        <img src={fileBaseUrl + (path)} alt="" />
      </RenderIf>
      <RenderIf when={!!path}>
        <Tag onClose={cancel} closable size={"large"}> {path} </Tag>
      </RenderIf>
      <Button
        onClick={upload}
        type={"primary"}>
        upload
      </Button>
    </Space>
  )
}